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
    const store = await storeModel.findOne({
      where: {
        user_id: vendorId,
        deletedAt: null,
      },
    });
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
      attributes: ["order_id", "total"],
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
    // Paid orders only; sales restricted to this vendor's items instead of the whole order grand_total
    const paidOrderIds = (
      await orderModel.findAll({
        where: {
          id: {
            [Op.in]: orderIds,
          },
          payment_status: "Paid",
        },
        attributes: ["id"],
        raw: true,
      })
    ).map((o) => o.id);
    const total_sales = orderItems
      .filter((i) => paidOrderIds.includes(i.order_id))
      .reduce((sum, i) => sum + Number(i.total || 0), 0);
    // Earnings from actual payout records for this vendor, not an assumed ratio
    const earnings = await this.Model.VendorPayout.sum("vendor_amount", {
      where: {
        vendor_id: vendorId,
      },
    });
    return {
      total_products,
      total_orders,
      completed_orders,
      cancelled_orders,
      pending_orders,
      total_sales: Number(total_sales.toFixed(2)),
      total_earnings: Number(earnings || 0),
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
  ) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {};
    if (status) {
      where.payout_status = status;
    }
    if (vendor_id) {
      where.vendor_id = Number(vendor_id);
    }
    if (order_id !== undefined && order_id !== null && String(order_id).trim() !== "") {
      where.order_id = Number(order_id);
    }
    return this.Model.VendorPayout.findAndCountAll({
      where,
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
        [Op.like]: `%${search}%`,
      };
    }
    return this.Model.Order.findAndCountAll({
      where,
      distinct: true,
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

  createCategory = async (payload) => {
    return await this.Model.Category.create(payload);
  };

getAllCategories = async (search, status) => {
  const where = {};

  if (search) {
    where.cat_name = {
      [Op.like]: `%${search}%`,
    };
  }

  if (status === "active") {
    where.is_active = true;
  }

  if (status === "inactive") {
    where.is_active = false;
  }

  return await this.Model.Category.findAll({
    where,
    order: [["id", "DESC"]],
  });
};
  getcategoryById = async (id) => {
    return await this.Model.Category.findOne({
      where: {
        id,
      },
    });
  };

  getCategoryBySlug = async (slug) => {
    return await this.Model.Category.findOne({
      where: {
        slug,
      },
    });
  };

  updateCategory = async (id, payload) => {
    return await this.Model.Category.update(payload, {
      where: {
        id,
      },
    });
  };

  deleteCategory = async (id) => {
    return await this.Model.Category.destroy({
      where: {
        id,
      },
    });
  };

  getProductById = async (categoryId, page, limit, search = "") => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {
      category_id: categoryId,
      deletedAt: null,
    };
    if (search) {
      where.pro_name = {
        [Op.like]: `%${search}%`,
      };
    }
    return await this.Model.Products.findAndCountAll({
      where,
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });
  };

  getProductsByCategoryAndRating = async (
    categoryId,
    page,
    limit,
    rating,
    search = "",
  ) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const productWhere = {
      category_id: categoryId,
      deletedAt: null,
    };
    if (search) {
      productWhere.pro_name = {
        [Op.like]: `%${search}%`,
      };
    }
    if (rating) {
      const reviews = await this.Model.Review.findAll({
        where: {
          rating: Number(rating),
        },
        attributes: ["product_id"],
        group: ["product_id"],
        raw: true,
      });
      const productIds = reviews.map((review) => review.product_id);
      if (productIds.length === 0) {
        return {
          count: 0,
          rows: [],
        };
      }
      productWhere.id = {
        [Op.in]: productIds,
      };
    }
    return await this.Model.Products.findAndCountAll({
      where: productWhere,
      limit: Number(limit),
      offset,
      order: [["id", "DESC"]],
    });
  };

  // Global admin dashboard: real counts + payout-based financials grouped by currency.
  // No trend data: orders carry no date-based aggregate semantics beyond createdAt.
  getAdminDashboard = async () => {
    const [
      total_users,
      total_vendors,
      total_customers,
      total_stores,
      total_categories,
      total_products,
      total_orders,
      delivered_orders,
      cancelled_orders,
      pending_orders,
      paid_orders,
      total_payouts,
    ] = await Promise.all([
      this.Model.Users.count({ where: { deletedAt: null } }),
      this.Model.Users.count({ where: { role_Id: 2, deletedAt: null } }),
      this.Model.Users.count({ where: { role_Id: 3, deletedAt: null } }),
      this.Model.Store.count({ where: { deletedAt: null } }),
      this.Model.Category.count(),
      this.Model.Products.count({ where: { deletedAt: null } }),
      this.Model.Order.count(),
      this.Model.Order.count({ where: { order_status: "Delivered" } }),
      this.Model.Order.count({ where: { order_status: "Cancelled" } }),
      this.Model.Order.count({
        where: {
          order_status: { [Op.in]: ["Pending", "Confirmed", "Packed", "Shipped"] },
        },
      }),
      this.Model.Order.count({ where: { payment_status: "Paid" } }),
      this.Model.VendorPayout.count(),
    ]);
    // Amounts live on payout records, so financial summary must be grouped per currency
    const payoutSums = await this.Model.VendorPayout.findAll({
      attributes: [
        "currency",
        [fn("SUM", col("gross_amount")), "gross_amount"],
        [fn("SUM", col("platform_fee")), "platform_fee"],
        [fn("SUM", col("vendor_amount")), "vendor_amount"],
      ],
      group: ["currency"],
      raw: true,
    });
    const paidStatuses = ["pending", "paid", "failed", "refunded"];
    const payout_breakdown = {};
    for (const status of paidStatuses) {
      const rows = await this.Model.VendorPayout.findAll({
        attributes: [
          "currency",
          [fn("SUM", col("vendor_amount")), "vendor_amount"],
          [fn("COUNT", col("id")), "count"],
        ],
        where: { payout_status: status },
        group: ["currency"],
        raw: true,
      });
      payout_breakdown[status] = rows.map((r) => ({
        currency: r.currency,
        vendor_amount: Number(r.vendor_amount || 0),
        payouts: Number(r.count || 0),
      }));
    }
    return {
      counts: {
        users: total_users,
        vendors: total_vendors,
        customers: total_customers,
        stores: total_stores,
        categories: total_categories,
        products: total_products,
        orders: {
          total: total_orders,
          delivered: delivered_orders,
          cancelled: cancelled_orders,
          pending: pending_orders,
          paid: paid_orders,
        },
        payouts: total_payouts,
      },
      // All amounts are per-currency; never sum across currencies
      financial_summary: payoutSums.map((r) => ({
        currency: r.currency,
        gross_amount: Number(r.gross_amount || 0),
        platform_fee: Number(r.platform_fee || 0),
        vendor_amount: Number(r.vendor_amount || 0),
      })),
      payout_breakdown,
    };
  };

  getAdminProducts = async (page, limit, search, category_id, vendor_id, status) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = { deletedAt: null };
    if (search) {
      where[Op.or] = [
        { pro_name: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }
    if (category_id) {
      where.category_id = category_id;
    }
    // vendor_id is a Users.id; resolve to its store id(s) since products hang off stores
    if (vendor_id) {
      const storeIds = (
        await this.Model.Store.findAll({
          where: { user_id: vendor_id },
          attributes: ["id"],
          raw: true,
        })
      ).map((s) => s.id);
      if (!storeIds.length) {
        return { count: 0, rows: [] };
      }
      where.store_id = { [Op.in]: storeIds };
    }
    if (status !== undefined && status !== null && status !== "") {
      where.status = status === "1" || status === 1 ? 1 : 0;
    }
    return this.Model.Products.findAndCountAll({
      where,
      include: [
        {
          model: this.Model.Store,
          attributes: ["id", "store_name", "user_id", "slug"],
          required: false,
        },
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

  updateProductStatus = async (productId, status) => {
    return this.Model.Products.update(
      { status: Boolean(status) },
      {
        where: {
          id: productId,
          deletedAt: null,
        },
      },
    );
  };

  getProductRowById = async (productId) => {
    return this.Model.Products.findOne({
      where: {
        id: productId,
        deletedAt: null,
      },
    });
  };

  getCustomerById = async (userId) => {
    return this.Model.Users.findOne({
      where: {
        id: userId,
        role_Id: 3,
        deletedAt: null,
      },
    });
  };

  updateCustomerStatus = async (userId, is_active) => {
    return this.Model.Users.update(
      { is_active: Boolean(is_active) },
      {
        where: {
          id: userId,
          role_Id: 3,
          deletedAt: null,
        },
      },
    );
  };
}
