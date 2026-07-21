import { Op, where } from "sequelize";
export default class StoreService {
  async init(db) {
    this.Model = db.models;
  }

  async createStore(payload) {
    const store = await this.Model.Store.create(payload);
    return await this.Model.Store.findByPk(store.id, {
      attributes: {
        exclude: [
          "user_id",
          "updatedAt",
          "total_products",
          "total_orders",
          "is_verified",
          "is_active",
          "rating",
          "updatedAt",
          "createdAt",
          "is_verified",
          "deletedAt",
        ],
      },
    });
  }

  async getBySlug(slug) {
    return await this.Model.Store.findOne({
      where: {
        slug,
        deletedAt: null,
      },
    });
  }

  async updateStore(id, payload) {
    return await this.Model.Store.update(payload, {
      where: { id },
    });
  }

  async deleteStore(id) {
    return await this.Model.Store.destroy({
      where: { id },
    });
  }

  async getStoreByUserId(userId) {
    return await this.Model.Store.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async createProduct(payload) {
    return await this.Model.Product.create(payload);
  }
}
