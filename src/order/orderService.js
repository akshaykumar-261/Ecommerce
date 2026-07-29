import { Op, where } from "sequelize";
import { sequelize } from "../../config/db.js";

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
          include: [this.Model.Product],
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

  async reduceStock(productId, qty) {
    const product = await this.Model.Product.findByPk(productId);
    await product.update({
      quantity: product.quantity - qty,
    });
  }

  async restoreStock(productId, qty) {
    const product = await this.Model.Product.findByPk(productId);
    await product.update({
      quantity: product.quantity + qty,
    });
  }

  async clearCart(cartId) {
    return await this.Model.CartItem.destroy({
      where: {
        cart_id: cartId,
      },
    });
  }

  async getOrder(userId) {
    return await this.Model.Order.findAll({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: this.Model.OrderItem,
          include: [this.Model.Product],
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
  async updatePayment(id, payload) {
    return await this.Model.Payment.update(payload, {
      where: {
        id,
      },
    });
  }

  async updateOrder(orderId, payload) {
    return await this.Model.Order.update(payload, {
      where: {
        id: orderId,
      },
    });
  }

  async getOrderById(orderId) {
    return await this.Model.Order.findByPk(orderId, {
      include: [
        {
          model: this.Model.OrderItem,
        },
      ],
    });
  }
}
