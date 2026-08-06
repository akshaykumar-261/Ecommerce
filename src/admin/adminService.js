import { Op, where, fn, col } from "sequelize";
import * as commanFunction from "../helper/commonFunction.js";
export default class AdminServices {
  async init(db) {
    this.Model = db.models;
  }
  getUserById = async (id) => {
    return this.Model.Users.findOne({
      where: {
        id: id,
        deletedAt: null,
      },
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "department_Id",
          "refreshToken",
          "is_mobile_notification_active",
          "socail_id",
          "provider",
          "deletedAt",
        ],
      },
    });
  };
  getAllVenders = async (page, limit, search, status) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {
      role_Id: 2,
      deletedAt: null,
    };
    // Search
    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          lastname: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          phoneNo: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }
    // Status Filter
    switch (status) {
      case "approved":
        where.is_account_enabled = true;
        break;

      case "rejected":
        where.is_account_enabled = false;
        break;

      case "blocked":
        where.is_active = false;
        break;

      case "unblocked":
        where.is_active = true;
        break;

      case "deleted":
        where.deletedAt = {
          [Op.ne]: null,
        };
        break;
      default:
        where.deletedAt = null;
    }
    return this.Model.Users.findAndCountAll({
      where,
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "department_Id",
          "refreshToken",
          "is_mobile_notification_active",
          "socail_id",
          "provider",
        ],
      },
      limit: Number(limit),
      offset,
    });
  };

  getVenderById = async (id) => {
    return this.Model.Users.findOne({
      where: {
        id: id,
        role_Id: 2,
        deletedAt: null,
      },
    });
  };

  updateVender = async (id, payload) => {
    return this.Model.Users.update(payload, {
      where: {
        id,
        id,
        role_Id: 2,
        deletedAt: null,
      },
    });
  };

  getVendorDashboard = async (vendorId) => {
    const storeModel = this.Model?.Store;
    const productsModel = this.Model?.Products;
    const orderItemsModel = this.Model?.OrderItems;
    const orderModel = this.Model?.Order;
    if (!storeModel || !productsModel || !orderItemsModel || !orderModel) {
      throw new Error("Admin dashboard models are not initialized.");
    }
    // Vendor Store
    console.log("==============>", vendorId);
    const store = await storeModel.findOne({
      where: {
        user_id: vendorId,
        deletedAt: null,
      },
    });
    console.log("=============================>", store);
    if (!store) {
      return {
        total_products: 0,
        total_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        pending_orders: 0,
        total_sales: 0,
        total_earnings: 0,
      };
    }

    // Total Products
    const total_products = await productsModel.count({
      where: {
        store_id: store.id,
        deletedAt: null,
      },
    });
    const products = await productsModel.findAll({
      where: {
        store_id: store.id,
        deletedAt: null,
      },
      attributes: ["id"],
      raw: true,
    });
    const productIds = products.map((item) => item.id);
    if (!productIds.length) {
      return {
        total_products,
        total_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        pending_orders: 0,
        total_sales: 0,
        total_earnings: 0,
      };
    }

    const orderItems = await orderItemsModel.findAll({
      where: {
        product_id: {
          [Op.in]: productIds,
        },
      },
      attributes: ["order_id"],
      raw: true,
    });
    const orderIds = [...new Set(orderItems.map((i) => i.order_id))];
    if (!orderIds.length) {
      return {
        total_products,
        total_orders: 0,
        completed_orders: 0,
        cancelled_orders: 0,
        pending_orders: 0,
        total_sales: 0,
        total_earnings: 0,
      };
    }
    const total_orders = await orderModel.count({
      where: {
        id: {
          [Op.in]: orderIds,
        },
      },
    });
    const completed_orders = await orderModel.count({
      where: {
        id: {
          [Op.in]: orderIds,
        },
        order_status: "Delivered",
      },
    });
    const cancelled_orders = await orderModel.count({
      where: {
        id: {
          [Op.in]: orderIds,
        },
        order_status: "Cancelled",
      },
    });
    const pending_orders = await orderModel.count({
      where: {
        id: {
          [Op.in]: orderIds,
        },
        order_status: {
          [Op.in]: ["Pending", "Confirmed", "Packed", "Shipped"],
        },
      },
    });
    const sales = await orderModel.sum("grand_total", {
      where: {
        id: {
          [Op.in]: orderIds,
        },
        payment_status: "Paid",
      },
    });
    return {
      total_products,
      total_orders,
      completed_orders,
      cancelled_orders,
      pending_orders,
      total_sales: Number(sales || 0),
      total_earnings: Number((sales || 0) * 0.9),
    };
  };

  getAllUsers = async (page, limit, search, status) => {
    const { offset } = commanFunction.pagignation(page, limit);

    const where = {
      role_Id: 3, // Customer Role
      deletedAt: null,
    };
    // Search
    if (search) {
      where[Op.or] = [
        {
          name: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          lastname: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          email: {
            [Op.like]: `%${search}%`,
          },
        },
        {
          phoneNo: {
            [Op.like]: `%${search}%`,
          },
        },
      ];
    }
    // Status Filter
    switch (status) {
      case "blocked":
        where.is_active = false;
        break;

      case "unblocked":
        where.is_active = true;
        break;

      case "deleted":
        delete where.deletedAt;
        where.deletedAt = {
          [Op.ne]: null,
        };
        break;

      default:
        where.deletedAt = null;
    }
    return this.Model.Users.findAndCountAll({
      where,
      attributes: {
        exclude: [
          "password",
          "createdAt",
          "updatedAt",
          "department_Id",
          "refreshToken",
          "is_mobile_notification_active",
          "socail_id",
          "provider",
        ],
      },
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });
  };
}
