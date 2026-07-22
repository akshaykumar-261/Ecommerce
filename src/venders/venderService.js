import { Op, where } from "sequelize";
import { sequelize } from "../../config/db.js";
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

  async createProduct(payload, mediaData) {
    const transaction = await sequelize.transaction();
    try {
      const product = await this.Model.Product.create(payload, {
        transaction,
      });
      if (mediaData.length > 0) {
        const mediaPayload = mediaData.map((item, index) => ({
          product_id: product.id,
          media_type: item.media_type,
          media_url: item.media_url,
          public_id: item.public_id,
          is_primary: index === 0,
          sort_order: index + 1,
        }));
        await this.Model.ProductMediaModel.bulkCreate(mediaPayload, {
          transaction,
        });
      }
      await transaction.commit();
      return await this.Model.Product.findByPk(product.id, {
        include: [
          {
            model: this.Model.ProductMediaModel,
          },
        ],
      });
    } catch (error) {
      if (transaction && !transaction.finished) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  async updateProductQuantity(id, quantity) {
    return await this.Model.Product.update(
      {
        quantity,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async getProductById(id) {
    return await this.Model.Product.findByPk(id);
  }
}
