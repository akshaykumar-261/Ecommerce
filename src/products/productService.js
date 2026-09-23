import { Op, fn, col, literal } from "sequelize";
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

  getAllProducts = async (page, limit, search = "") => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {
      deletedAt: null,
      status: true,
    };
    if (search) {
      where[Op.or] = [
        { pro_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    return await this.Model.Products.findAndCountAll({
      where,
      include: [
        {
          model: this.Model.Category,
          attributes: ["id", "cat_name",],
          required: false,
        },
        {
          model: this.Model.ProductMedia,
          attributes: ["id", "media_type", "media_url", "is_primary"],
          required: false,
        },
        {
          model: this.Model.Store,
          attributes: ["id", "store_name", "store_logo"],
          required: false,
        },
      ],
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });
  };

  getProductById = async (id) => {
    return await this.Model.Products.findOne({
      where: { id, deletedAt: null, status: true },
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
    });
  };

  searchProducts = async (search, page, limit) => {
    const { offset } = commanFunction.pagignation(page, limit);
    return await this.Model.Products.findAndCountAll({
      where: {
        deletedAt: null,
        status: true,
        [Op.or]: [
          { pro_name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
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

  searchSuggestions = async (search, limit = 8) => {
    return await this.Model.Products.findAll({
      where: {
        deletedAt: null,
        status: true,
        [Op.or]: [
          { pro_name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } },
        ],
      },
      attributes: ["id", "pro_name", "price", "discount_price"],
      include: [
        {
          model: this.Model.ProductMedia,
          attributes: ["id", "media_url", "is_primary"],
          required: false,
          where: { is_primary: true },
          required: false,
        },
      ],
      limit: Number(limit),
      order: [["id", "DESC"]],
    });
  };
}
