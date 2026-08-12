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

  getVendorStoreDetail = async (venderId, search) => {
    const store = await this.Model.Store.findOne({
      where: {
        user_id: venderId,
        deletedAt: null,
      },
    });
    if (!store) {
      return null;
    }
    const where = {
      store_id: store.id,
      deletedAt: null,
    };
    if (search) {
      where.pro_name = {
        [Op.like]: `%${search}%`,
      };
    }
    const product = await this.Model.Products.findAndCountAll({
      where,
      order: [["id", "DESC"]],
    });
    return {
      store,
      total_products: product.count,
      products: product.rows,
    };
  };

  getAllVendorsPayouts = async (
    page,
    limit,
    status,
    vendor_id,
    order_id,
    serach,
  ) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {};
    if (status) {
      where.payout_status = status;
    }
    if (vendor_id) {
      where.vendor_id = vendor_id;
    }
    if (order_id) {
      where.order_id = order_id;
    }
    return this.Model.VendorPayout.findAndCountAll({
      where,
      attributes: [where],
      attributes: [
        "id",
        "order_id",
        "payment_id",
        "vendor_id",
        "stripe_account_id",
        "gross_amount",
        "platform_fee",
        "vendor_amount",
        "currency",
        "payout_status",
        "createdAt",
      ],
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });
  };

  getVendorPayoutSummary = async () => {
    const vendorPayout = this.Model.VendorPayout;
    if (!vendorPayout) {
      throw new Error("VendorPayout model is not initialized.");
    }
    const totalGrossAmount = await vendorPayout.sum("gross_amount");
    const totalPlatformFees = await vendorPayout.sum("platform_fee");
    const totalVenderAmount = await vendorPayout.sum("vendor_amount");
    const pendingAmount = await vendorPayout.sum("vendor_amount", {
      where: {
        payout_status: "pending",
      },
    });
    const paidAmount = await vendorPayout.sum("vendor_amount", {
      where: {
        payout_status: "paid",
      },
    });
    const totalPayouts = await vendorPayout.count();
    const failedAmount = await vendorPayout.sum("vendor_amount", {
      where: {
        payout_status: "failed",
      },
    });
    const refundedAmount = await vendorPayout.sum("vendor_amount", {
      where: {
        payout_status: "refunded",
      },
    });
    return {
      total_gross_amount: Number(totalGrossAmount || 0),
      total_platform_fee: Number(totalPlatformFees || 0),
      total_vendor_amount: Number(totalVenderAmount || 0),
      pending_amount: Number(pendingAmount || 0),
      paid_amount: Number(paidAmount || 0),
      failed_amount: Number(failedAmount || 0),
      pending_payouts: pendingAmount,
      paid_payouts: paidAmount,
      failed_payouts: failedAmount,
      total_payouts: totalPayouts,
    };
  };

  getAllOrders = async (page, limit, status, search) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {};
    if (status) {
      const allowedStates = [
        "Pending",
        "Confirmed",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
      ];
      if (!allowedStates.includes(status)) {
        throw new Error("Invalid order status");
      }
      where.order_status = status;
    }
    if (search) {
      where.order_number = {
        [Op.like]: `%${serach}`,
      };
    }
    return this.Model.Order.findAndCountAll({
      where,
      include: [
        {
          model: this.Model.OrderItems,
          include: [
            {
              model: this.Model.Products,
            },
          ],
        },
        // {
        //   model: this.Model.Address,
        // },
        // {
        //   model: this.Model.Users,
        // },
        // {
        //   model: this.Model.Payment,
        // },
      ],
      limit: Number(limit),
      offset,
      order: [["createdAt", "DESC"]],
    });
  };

  updateAdminConfiguration = async (payload) => {
    const AdminConfiguration = this.Model.AdminConfiguration;
    let configuration = await AdminConfiguration.findOne({
      order: [["id", "DESC"]],
    });
    if (!configuration) {
      configuration = await AdminConfiguration.create({
        commission_percentage: payload.commission_percentage,
        is_active: true,
      });
    } else {
      await configuration.update({
        commission_percentage: payload.commission_percentage,
      });
    }
    return configuration;
  };

  getAdminConfiguration = async () => {
    return this.Model.AdminConfiguration.findOne({
      where: {
        is_active: true,
      },
      order: [["id", "DESC"]],
    });
  };

  async updateUser(userId, payload) {
    return await this.Model.Users.update(payload, {
      where: {
        id: userId,
      },
    });
  }
}
