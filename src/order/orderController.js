import OrderService from "./orderService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import {
  orderMessages,
  paymentMessage,
  productMessage,
  adminMessage,
  userMessage,
} from "../helper/commanMessages.js";
import {
  PAYMENT_STATUS,
  ORDER_STATUS,
  PAYMENT_RECORD_STATUS,
  PAYOUT_STATUS,
} from "../helper/constants.js";
import stripe, { CURRENCY } from "../../config/stripe.js";
import { sequelize } from "../../config/db.js";
import {
  getEffectiveUnitPrice,
  getEffectiveLineTotal,
} from "../helper/commonFunction.js";
import { describeStripeTransferFailure } from "../stripe/stripeErrors.js";
export default class OrderController {
  async init(db) {
    this.services = new OrderService();
    await this.services.init(db);
  }
  async placeOrder(req, res) {
    const transaction = await sequelize.transaction();
    const { address_id } = req.body;
    // Check Address
    const address = await this.services.getAddress(address_id, req.user.id);
    if (!address) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        orderMessages.ADDRESS_NOT_FOUND,
      );
    }
    const cart = await this.services.getCart(req.user.id);
    if (!cart || cart.cartItems.length === 0) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        orderMessages.CART_EMPTY,
      );
    }
    const user = await this.services.getUserById(req.user.id);
    if (!user) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!user.customer_account_enabled || !user.stripe_customer_id) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Customer Stripe account is not enabled",
      );
    }
    // Calculate Total
    // Priced from the live product, not cartItems.price: the cart row stores
    // price x quantity captured when the item was added, so it goes stale and
    // it ignores discount_price entirely.
    let grandTotal = 0;
    for (const item of cart.cartItems) {
      if (item.product.quantity < item.quantity) {
        await transaction.rollback();
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          `${item.product.pro_name} is out of stock`,
        );
      }
      grandTotal += getEffectiveLineTotal(item.product, item.quantity);
    }
    // Create Order
    const order = await this.services.createOrder(
      {
        user_id: req.user.id,
        address_id,
        order_number: `ORD-${Date.now()}`,
        grand_total: grandTotal,
        payment_status: PAYMENT_STATUS.PENDING,
        order_status: ORDER_STATUS.PENDING,
      },
      transaction,
    );
    // Create Order Items
    for (const item of cart.cartItems) {
      const unitPrice = getEffectiveUnitPrice(item.product);
      await this.services.createOrderItem(
        {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: unitPrice,
          total: unitPrice * item.quantity,
        },
        transaction,
      );
    }
    // creating paymentIntent
    const adminConfiguration = await this.services.getAdminConfiguration();
    if (!adminConfiguration) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        adminMessage.ADMIN_CONFIGURATION,
      );
    }
    const commissionPercentage = Number(
      adminConfiguration.commission_percentage,
    );

    // ----------------------------------------------------
    // 1. GROUP CART ITEMS BY VENDOR
    // A single cart can hold products from several stores, so the payout
    // split is derived per vendor instead of assuming one vendor.
    // ----------------------------------------------------
    const vendorGroups = new Map();

    for (const item of cart.cartItems) {
      const vendorId = item.product.store.user_id;

      if (!vendorGroups.has(vendorId)) {
        vendorGroups.set(vendorId, {
          vendorId,
          items: [],
          grossAmount: 0,
        });
      }

      const group = vendorGroups.get(vendorId);

      group.items.push(item);
      // Split on the discounted amount, so commission is a percentage of what
      // the customer actually paid rather than of the undiscounted MRP.
      group.grossAmount += getEffectiveLineTotal(item.product, item.quantity);
    }

    // ----------------------------------------------------
    // 2. VALIDATE ALL VENDORS
    // Every vendor must be able to receive a transfer, otherwise the order
    // cannot be split later and the customer would pay for goods that can
    // never be paid out.
    // ----------------------------------------------------
    const vendorPayouts = [];

    for (const group of vendorGroups.values()) {
      const vendor = await this.services.getVendorById(group.vendorId);

      if (!vendor || !vendor.stripe_account_id) {
        await transaction.rollback();
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          orderMessages.VENDER_NO_SRITE_ACCOUNT,
        );
      }

      if (!vendor.is_account_enabled) {
        await transaction.rollback();
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          orderMessages.VENDER_SRITE_ACCOUNT_NOT_ENABLED,
        );
      }

      const platformFee = group.grossAmount * (commissionPercentage / 100);
      const vendorAmount = group.grossAmount - platformFee;

      vendorPayouts.push({
        vendor,
        grossAmount: group.grossAmount,
        platformFee,
        vendorAmount,
      });
    }

    // ----------------------------------------------------
    // 3. CREATE ONE PAYMENT INTENT ON THE PLATFORM ACCOUNT
    // No transfer_data.destination and no application_fee_amount: the
    // platform takes the whole charge and pays each vendor its share from
    // the webhook using a separate transfer.
    // ----------------------------------------------------
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100),
      currency: CURRENCY,
      customer: user.stripe_customer_id,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      transfer_group: `ORDER_${order.id}`,
      metadata: {
        order_id: String(order.id),
        user_id: String(req.user.id),
        stripe_customer_id: user.stripe_customer_id,
      },
      description: `Payment for Order #${order.order_number}`,
    });

    // ----------------------------------------------------
    // 4. CREATE PAYMENT RECORD
    // ----------------------------------------------------
    const payment = await this.services.createPayment(
      {
        order_id: order.id,
        transaction_id: paymentIntent.id,
        amount: grandTotal,
        payment_method: "Card",
        payment_provider: "Stripe",
        status: PAYMENT_RECORD_STATUS.PENDING,
        currency: CURRENCY,
      },
      transaction,
    );

    // ----------------------------------------------------
    // 5. CREATE ONE PAYOUT RECORD PER VENDOR
    // These stay "pending" until the webhook issues the matching transfer.
    // ----------------------------------------------------
    for (const payout of vendorPayouts) {
      await this.services.createVenderPayout(
        {
          order_id: order.id,
          payment_id: payment.id,
          vendor_id: payout.vendor.id,
          stripe_account_id: payout.vendor.stripe_account_id,
          gross_amount: payout.grossAmount,
          platform_fee: payout.platformFee,
          vendor_amount: payout.vendorAmount,
          currency: CURRENCY,
          payout_status: PAYOUT_STATUS.PENDING,
        },
        transaction,
      );
    }

    await transaction.commit();
    return sendResponse(res, STATUS_CODE.CREATED, orderMessages.ORDER_CREATED, {
      order,
      payment_intent_id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
    });
  }

  async confirmPayment(req, res) {
    const { paymentIntentId, payment_method_id } = req.body;
    if (!paymentIntentId) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        paymentMessage.PAYMENTINTENT_REQUIRE,
      );
    }
    if (!payment_method_id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Payment method ID is required",
      );
    }
    const user = await this.services.getUserById(req.user.id);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!user.stripe_customer_id || !user.customer_account_enabled) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Customer Stripe account is not enabled",
      );
    }
    const paymentConfirm =
      await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentConfirm.customer !== user.stripe_customer_id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Payment does not belong to this customer",
      );
    }
    // The webhook may have settled this intent before the client got here, so
    // an already-succeeded intent is reported as success rather than an error.
    let paymentIntent = paymentConfirm;
    if (paymentIntent.status !== "succeeded") {
      paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: payment_method_id,
      });
    }
    // Payment Success
    if (paymentIntent.status === "succeeded") {
      const payment = await this.services.getPaymentByTransactionId(
        paymentIntent.id,
      );
      if (!payment) {
        return sendResponse(
          res,
          STATUS_CODE.NOT_FOUND,
          "Payment record not found",
        );
      }
      const orderId = paymentIntent.metadata.order_id;
      await this.services.updatePayment(payment.id, {
        status: PAYMENT_RECORD_STATUS.SUCCESS,
      });
      // Stock and cart are handled here so the shopper sees a confirmed order
      // immediately. Vendor payouts are NOT touched: those are the webhook's
      // job, because a transfer only counts as paid once Stripe has moved the
      // money to the vendor's connected account.
      await this.services.finalizePaidOrder(orderId, req.user.id);
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        paymentMessage.PAYMENT_SUCCESS,
        paymentIntent,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      paymentMessage.PAYMENT_NOT_COMPETE,
      paymentIntent,
    );
  }

  async getMyOrders(req, res) {
    const orders = await this.services.getOrderUserId(req.user.id);
    return sendResponse(res, STATUS_CODE.SUCCESS, orderMessages.ORDER_FETCHED, {
      orders,
    });
  }

  async getOrderById(req, res) {
    const { orderId } = req.params;
    const order = await this.services.getOrderById(orderId);
    if (!order) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        orderMessages.ORDER_NOT_FOUND,
      );
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, orderMessages.ORDER_FETCHED, {
      order,
    });
  }

  async cancelOrder(req, res) {
    const transaction = await sequelize.transaction();
    const { orderId } = req.params;
    const order = await this.services.getOrderWithPayment(orderId);
    if (!order) {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        orderMessages.ORDER_NOT_FOUND,
      );
    }
    // Order Owner Check
    if (order.user_id !== req.user.id) {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        productMessage.NOT_ALLOW,
      );
    }
    // Already Cancelled?
    if (order.order_status === ORDER_STATUS.CANCELLED) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        productMessage.ORDER_ALREADY_CANCELLED,
      );
    }

    if (order.payment_status !== PAYMENT_STATUS.PAID) {
      await this.services.updateOrder(
        order.id,
        {
          order_status: ORDER_STATUS.CANCELLED,
        },
        transaction,
      );
      for (const item of order.orderItems) {
        await this.services.restoreStock(item.product_id, item.quantity);
      }
      await transaction.commit();
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        orderMessages.ORDER_CANCELLED,
      );
    }
    const user = await this.services.getUserById(req.user.id);
    if (!user) {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!user.stripe_customer_id || !user.customer_account_enabled) {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Customer Stripe account is not enabled",
      );
    }

    const payment = order.payment;
    if (!payment) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        paymentMessage.PAYMENT_NOT_FOUND,
      );
    }
    const paymentIntent = await stripe.paymentIntents.retrieve(
      payment.transaction_id,
    );
    if (paymentIntent.customer !== user.stripe_customer_id) {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Payment does not belong to this customer",
      );
    }
    const refund = await stripe.refunds.create({
      payment_intent: payment.transaction_id,
    });
    if (refund.status !== "succeeded") {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        paymentMessage.ORDER_REFUND,
      );
    }
    await this.services.updatePayment(
      payment.id,
      {
        status: PAYMENT_RECORD_STATUS.REFUNDED,
      },
      transaction,
    );
    await this.services.updateOrder(
      order.id,
      {
        order_status: ORDER_STATUS.CANCELLED,
        payment_status: PAYMENT_STATUS.REFUNDED,
      },
      transaction,
    );
    for (const item of order.orderItems) {
      await this.services.restoreStock(
        item.product_id,
        item.quantity,
        transaction,
      );
    }
    // Money already sent to vendors has to come back, otherwise the platform
    // eats the refund out of its own balance while payouts still read "paid".
    const reversedPayouts = await this.reverseVendorTransfers(order);
    await transaction.commit();
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      paymentMessage.ORDER_REFUND,
      { refund, reversed_payouts: reversedPayouts },
    );
  }

  /*
   * Reverses every transfer this order produced and marks the payout row
   * "refunded". A reversal that Stripe rejects is recorded on the row as
   * "failed" with the reason instead of aborting the whole cancellation,
   * because the customer refund has already succeeded at that point.
   */
  async reverseVendorTransfers(order) {
    const payouts = await this.services.getVendorPayoutsByOrderId(order.id);
    const results = [];

    for (const payout of payouts) {
      if (!payout.transfer_id) continue;
      if (payout.payout_status === PAYOUT_STATUS.REFUNDED) continue;

      try {
        const reversal = await stripe.transfers.createReversal(
          payout.transfer_id,
          {},
          { idempotencyKey: `refund-${payout.id}-${payout.transfer_id}` },
        );
        await this.services.updateVendorPayoutById(payout.id, {
          payout_status: PAYOUT_STATUS.REFUNDED,
          failure_reason: null,
        });
        results.push({
          payout_id: payout.id,
          vendor_id: payout.vendor_id,
          transfer_id: payout.transfer_id,
          reversal_id: reversal.id,
          status: reversal.status,
        });
      } catch (error) {
        const reason = describeStripeTransferFailure(error);
        await this.services.updateVendorPayoutById(payout.id, {
          payout_status: PAYOUT_STATUS.FAILED,
          failure_reason: `Transfer reversal failed. ${reason}`,
        });
        results.push({
          payout_id: payout.id,
          vendor_id: payout.vendor_id,
          transfer_id: payout.transfer_id,
          status: "failed",
          failure_reason: reason,
        });
      }
    }

    return results;
  }
  async updateOrderStatus(req, res) {
    // Admin Api
    const { orderId } = req.params;
    const { order_status } = req.body;
    const order = await this.services.getOrderById(orderId);
    if (!order) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        orderMessages.ORDER_NOT_FOUND,
      );
    }
    if (
      order.order_status === ORDER_STATUS.CANCELLED ||
      order.order_status === ORDER_STATUS.DELIVERED
    ) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        orderMessages.ORDER_STATUS,
      );
    }
    await this.services.updateOrder(orderId, {
      order_status,
    });
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      orderMessages.ORDER_STATUS_UPDATE,
    );
  }

  async trackOrder(req, res) {
    const { orderId } = req.params;
    const order = await this.services.trackOrder(orderId, req.user.id);
    if (!order) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        orderMessages.ORDER_NOT_FOUND,
      );
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, orderMessages.ORDER_FETCHED, {
      order_id: order.id,
      order_number: order.order_number,
      order_status: order.order_status,
      payment_status: order.payment_status,
      ordered_at: order.createdAt,
      last_updated: order.updatedAt,
    });
  }
}
