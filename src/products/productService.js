import { Op } from "sequelize";
import * as commanFunction from "../helper/commonFunction.js";

export default class ProductServices {
  async init(db) {
    this.Model = db.models;
  }

  getCategoryById = async (id) => {
    return await this.Model.Category.findOne({
      where: { id },
    });
  };

  getProductsByCategoryId = async (categoryId, page, limit, search = "") => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {
      category_id: categoryId,
      deletedAt: null,
      status: true,
    };
    if (search) {
      where.pro_name = {
        [Op.like]: `%${search}%`,
      };
    }
    return await this.Model.Products.findAndCountAll({
      where,
      include: [
        {
          model: this.Model.Category,
          attributes: ["id", "cat_name", "slug"],
          required: false,
        },
        {
          model: this.Model.ProductMedia,
          attributes: ["id", "media_type", "media_url", "is_primary"],
          required: false,
        },
      ],
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });
  };
}
