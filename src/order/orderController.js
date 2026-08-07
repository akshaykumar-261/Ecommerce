import OrderService from "./orderService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import {
  orderMessages,
  paymentMessage,
  productMessage,
} from "../helper/commanMessages.js";
import {
  PAYMENT_STATUS,
  ORDER_STATUS,
  PAYMENT_RECORD_STATUS,
} from "../helper/constants.js";
import stripe from "../../config/stripe.js";
import { sequelize } from "../../config/db.js";
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
    const vendorId = cart.cartItems[0].product.store.user_id;
    const vendor = await this.services.getVendorById(vendorId);
    if (!vendor || !vendor.stripe_account_id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        orderMessages.VENDER_NO_SRIPE_ACCOUNT,
      );
    }
    if (!vendor.is_account_enabled) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        orderMessages.VENDER_SRIPE_ACCOUNT_NOT_ENABLED,
      );
    }
    // Calculate Total
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
      grandTotal += Number(item.price);
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
      await this.services.createOrderItem(
        {
          order_id: order.id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.product.price,
          total: item.price,
        },
        transaction,
      );
    }
    // creating paymentIntent
    const commission = Math.round(grandTotal * 0.1 * 100); // cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100), // Total Amount
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      transfer_data: {
        destination: vendor.stripe_account_id,
      },
      application_fee_amount: commission,
      metadata: {
        order_id: order.id,
        vendor_id: vendor.id,
        user_id: req.user.id,
      },
      description: `Payment for Order #${order.order_number}`,
    });
    const payment = await this.services.createPayment(
      {
        order_id: order.id,
        transaction_id: paymentIntent.id,
        amount: grandTotal,
        payment_method: "Card",
        payment_provider: "Stripe",
        payment_status: PAYMENT_RECORD_STATUS.PENDING,
      },
      transaction,
    );
    await this.services.createVenderPayout(
      {
        order_id: order.id,
        payment_id: payment.id,
        vendor_id: vendor.id,
        stripe_account_id: vendor.stripe_account_id,
        gross_amount: grandTotal,
        platform_fee: grandTotal * 0.1,
        vendor_amount: grandTotal - grandTotal * 0.1,
        payout_status: "pending",
      },
      transaction,
    );
    await transaction.commit();
    return sendResponse(res, STATUS_CODE.CREATED, orderMessages.ORDER_CREATED, {
      order,
      payment_intent_id: paymentIntent.id,
    });
  }

  async confirmPayment(req, res) {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        paymentMessage.PAYMENTINTENT_REQUIRE,
      );
    }
    const paymentConfirm = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentConfirm.status === "succeeded") {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Payment already confirmed",
      );
    }
    let paymentIntent;
    paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: "pm_card_visa",
    });
    // Payment Success
    if (paymentIntent.status === "succeeded") {
      const payment = await this.services.getPaymentByTransactionId(
        paymentIntent.id,
      );
      const orderId = paymentIntent.metadata.order_id;
      await this.services.updatePayment(payment.id, {
        status: PAYMENT_RECORD_STATUS.SUCCESS,
      });
      await this.services.updateOrder(orderId, {
        payment_status: PAYMENT_STATUS.PAID,
        order_status: ORDER_STATUS.CONFIRMED,
      });
      const order = await this.services.getOrderById(orderId);
      for (const item of order.orderItems) {
        await this.services.reduceStock(item.product_id, item.quantity);
      }
      const cart = await this.services.getCart(req.user.id);
      if (cart) {
        await this.services.clearCart(cart.id);
      }
      await this.services.updateVendorPayout(orderId, {
        payout_status: "paid",
      });
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
    const payment = order.payment;
    if (!payment) {
      await transaction.rollback();
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        paymentMessage.PAYMENT_NOT_FOUND,
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
    await transaction.commit();
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      paymentMessage.ORDER_REFUND,
      refund,
    );
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
