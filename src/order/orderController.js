import OrderService from "./orderService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import { orderMessages } from "../helper/commanMessages.js";
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
    // Get Cart
    const cart = await this.services.getCart(req.user.id);
    if (!cart || cart.cartItems.length === 0) {
      await transaction.rollback();

      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        orderMessages.CART_EMPTY,
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
        payment_status: "Pending",
        order_status: "Pending",
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
    // Commit DB Transaction
    await transaction.commit();
    // creating paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grandTotal * 100),
      currency: "inr",
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        order_id: order.id,
        user_id: req.user.id,
      },
      description: `Payment for Order #${order.order_number}`,
    });
    const payment = await this.services.createPayment({
      order_id: order.id,
      transaction_id: paymentIntent.id,
      amount: grandTotal,
      payment_method: "Card",
      payment_provider: "Stripe",
      payment_status: "Pending",
    });
    return sendResponse(res, STATUS_CODE.CREATED, orderMessages.ORDER_CREATED, {
      order,
      payment_intent_id: paymentIntent.id,
    });
  }

  async getMyOrders(req, res) {
    const orders = await this.services.getOrder(req.user.id);
    return sendResponse(res, STATUS_CODE.SUCCESS, orderMessages.ORDER_FETCHED, {
      orders,
    });
  }

  async confirmPayment(req, res) {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "paymentIntentId is required",
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
        status: "success",
      });
      await this.services.updateOrder(orderId, {
        payment_status: "Paid",
        order_status: "Confirmed",
      });
      const order = await this.services.getOrderById(orderId);
      for (const item of order.orderItems) {
        await this.services.reduceStock(item.product_id, item.quantity);
      }
      const cart = await this.services.getCart(req.user.id);
      if (cart) {
        await this.services.clearCart(cart.id);
      }
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Payment successful.",
        paymentIntent,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.BAD_REQUEST,
      "Payment not completed.",
      paymentIntent,
    );
  }
}
