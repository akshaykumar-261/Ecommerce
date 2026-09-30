import { Op, where } from "sequelize";
import { sequelize } from "../../config/db.js";
import { ORDER_STATUS, PAYMENT_STATUS } from "../helper/constants.js";

export default class OrderService {
  async init(db) {
    this.Model = db.models;
  }

  async getAddress(addressId, userId) {
    return await this.Model.Address.findOne({
      where: {
        id: addressId,
        user_id: userId,
      },
    });
  }

  async getCart(userId) {
    return await this.Model.Cart.findOne({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: this.Model.CartItem,
          include: [
            {
              model: this.Model.Product,
              include: [
                {
                  model: this.Model.Store,
                  include: [
                    {
                      model: this.Model.Users || this.Model.User, // ya Users (neeche dekho)
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async createOrder(payload, transaction) {
    return await this.Model.Order.create(payload, {
      transaction,
    });
  }
  async createOrderItem(payload, transaction) {
    return await this.Model.OrderItem.create(payload, {
      transaction,
    });
  }
  async createVenderPayout(payload, transaction) {
    return await this.Model.VendorPayout.create(payload, {
      transaction,
    });
  }

  async reduceStock(productId, qty, transaction) {
    const product = await this.Model.Product.findByPk(productId, {
      transaction,
    });
    await product.update(
      {
        quantity: product.quantity - qty,
      },
      {
        transaction,
      },
    );
  }

  async restoreStock(productId, qty, transaction) {
    //4
    const product = await this.Model.Product.findByPk(productId);
    await product.update(
      {
        quantity: product.quantity + qty,
      },
      {
        transaction,
      },
    );
  }

  async clearCart(cartId, transaction) {
    return await this.Model.CartItem.destroy({
      where: {
        cart_id: cartId,
      },
      transaction,
    });
  }

  async getOrderUserId(userId) {
    return await this.Model.Order.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: this.Model.OrderItem,
          include: [
            {
              model: this.Model.Product,
              include: [
                {
                  model: this.Model.ProductMediaModel,
                },
              ],
            },
          ],
        },
        {
          model: this.Model.Address,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
  }

  async getOrder(orderId) {
    return await this.Model.Order.findByPk(orderId, {
      include: [this.Model.OrderItem],
    });
  }

  async cancelOrder(orderId) {
    return await this.Model.Order.update(
      {
        order_status: "Cancelled",
      },
      {
        where: {
          id: orderId,
        },
      },
    );
  }
  async createPayment(payload, transaction) {
    return await this.Model.Payment.create(payload, {
      transaction,
    });
  }
  async updatePayment(id, payload, transaction) {
    // 1
    return await this.Model.Payment.update(payload, {
      where: {
        id,
      },
      transaction,
    });
  }

  async updateOrder(orderId, payload, transaction) {
    //2
    return await this.Model.Order.update(payload, {
      where: {
        id: orderId,
      },
      transaction,
    });
  }

  async getOrderById(orderId) {
    return await this.Model.Order.findByPk(orderId, {
      include: [
        {
          model: this.Model.OrderItem,
          include: [
            {
              model: this.Model.Product,
              include: [
                {
                  model: this.Model.ProductMediaModel,
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getPaymentByTransactionId(transactionId) {
    return await this.Model.Payment.findOne({
      where: {
        transaction_id: transactionId,
      },
    });
  }

  async getOrderWithPayment(orderId) {
    return await this.Model.Order.findByPk(orderId, {
      include: [
        {
          model: this.Model.OrderItem,
        },
        {
          model: this.Model.Payment,
        },
      ],
    });
  }

  async trackOrder(orderId, userId) {
    return await this.Model.Order.findOne({
      where: {
        id: orderId,
        user_id: userId,
      },
      attributes: [
        "id",
        "order_number",
        "order_status",
        "payment_status",
        "createdAt",
        "updatedAt",
      ],
    });
  }

  async getVendorByStoreId(storeId) {
    return await this.Model.Store.findOne({});
  }

  async getOrderByOrderId(orderId) {
    return await this.Model.Order.findByPk(orderId, {
      include: [
        {
          model: this.Model.OrderItem,
          include: [
            {
              model: this.Model.Product,
              include: [
                {
                  model: this.Model.Store,
                  include: [
                    {
                      model: this.Model.Users,
                      attributes: ["id", "stripe_account_id", "name", "email"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getVendorById(vendorId) {
    return await this.Model.Users.findByPk(vendorId, {
      attributes: [
        "id",
        "name",
        "email",
        "stripe_account_id",
        "is_account_enabled",
      ],
    });
  }

  async getUserById(userId) {
    return await this.Model.Users.findOne({
      where: {
        id: userId,
        deletedAt: null,
      },
    });
  }

  // Payouts are per vendor per order, so they are addressed by payout id —
  // updating "all payouts of an order" would let one vendor's transfer
  // outcome overwrite another's.
  async updateVendorPayoutById(payoutId, payload) {
    return await this.Model.VendorPayout.update(payload, {
      where: {
        id: payoutId,
      },
    });
  }

  async getVendorPayoutsByOrderId(orderId) {
    return await this.Model.VendorPayout.findAll({
      where: {
        order_id: orderId,
      },
      order: [["id", "ASC"]],
    });
  }

  /*
   * Flips an order to Confirmed/Paid, decrements stock and empties the cart.
   * Shared by confirmPayment and the payment_intent.succeeded webhook, which
   * can arrive in either order. Guarded by a row lock plus a status check so
   * stock is never decremented twice for the same order.
   */
  async finalizePaidOrder(orderId, userId) {
    const transaction = await sequelize.transaction();
    try {
      const order = await this.Model.Order.findByPk(orderId, {
        transaction,
        lock: transaction.LOCK.UPDATE,
      });
      if (!order) {
        await transaction.rollback();
        return null;
      }
      if (order.order_status === ORDER_STATUS.CONFIRMED) {
        await transaction.rollback();
        return { order, alreadyFinalized: true };
      }

      await this.updateOrder(
        orderId,
        {
          payment_status: PAYMENT_STATUS.PAID,
          order_status: ORDER_STATUS.CONFIRMED,
        },
        transaction,
      );

      const orderItems = await this.Model.OrderItem.findAll({
        where: { order_id: orderId },
        transaction,
      });
      for (const item of orderItems) {
        await this.reduceStock(item.product_id, item.quantity, transaction);
      }

      const cart = await this.Model.Cart.findOne({
        where: { user_id: userId },
        transaction,
      });
      if (cart) {
        await this.clearCart(cart.id, transaction);
      }

      await transaction.commit();
      return { order, alreadyFinalized: false };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getAdminConfiguration() {
    return await this.Model.AdminCongiguration.findOne({
      where: {
        is_active: true,
      },
      order: [["id", "DESC"]],
    });
  }
}
