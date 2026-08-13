import AdminService from "./adminService.js";
import {
  authMessage,
  userMessage,
  adminMessage,
  orderMessages,
  categoryMessages,
} from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { emailQueue } from "../../utility/queue/emailQueue.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utility/ cloudinaryUpload.js";
import * as commanFunction from "../helper/commonFunction.js";
export default class AdminController {
  async init(db) {
    this.service = new AdminService();
    this.Model = db.models;
    await this.service.init(db);
  }
  async getAdminProfile(req, res) {
    const user = req.user;
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    const profile = await this.service.getUserById(user.id);
    if (!profile) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_PROFILE_FETCHED,
      profile,
    );
  }

  async updateAdminProfile(req, res) {
    const userId = req.user.id;
    const existingUser = await this.service.getUserById(userId);
    if (!existingUser) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    const payload = {
      ...req.body,
    };
    if (req.file) {
      if (existingUser.avatar_public_id) {
        await deleteFromCloudinary(existingUser.avatar_public_id);
      }
      const result = await uploadToCloudinary(req.file, "users/avatar");
      payload.avtar = result.secure_url;
      payload.avatar_public_id = result.public_id;
    }
    await this.service.updateUser(userId, payload);
    const updatedUser = await this.service.getUserById(userId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_UPDATED,
      updatedUser,
    );
  }

  async getAllVenderByAdmin(req, res) {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const vendors = await this.service.getAllVenders(
      page,
      limit,
      search,
      status,
    );
    if (vendors.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_NOT_FOUND,
      );
    }
    const paginationData = commanFunction.pagignation(page, limit, vendors);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.VENDER_LIST_FETCHED,
      paginationData,
    );
  }

  async venderAction(req, res) {
    const { id } = req.params;
    const { action } = req.body;
    const vender = await this.service.getVenderById(id);
    if (!vender) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_NOT_FOUND,
      );
    }
    let payload = {};
    let message = "";
    switch (action) {
      case "approve":
        payload = { is_account_enabled: true };
        message = userMessage.VENDER_APPROVED;
        break;
      case "reject":
        payload = { is_account_enabled: false };
        message = userMessage.VENDER_REJECTED;
        break;
      case "block":
        payload = { is_active: false };
        message = userMessage.VENDER_BLOCKED;
        break;
      case "unblock":
        payload = { is_active: true };
        message = userMessage.VENDER_UNBLOCKED;
        break;
      case "delete":
        payload = { deletedAt: new Date() };
        message = userMessage.VENDER_DELETED;
        break;
      default:
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          userMessage.INVALID_ACTION,
        );
    }
    await this.service.updateVender(id, payload);
    return sendResponse(res, STATUS_CODE.SUCCESS, message);
  }

  async getVendorDashboard(req, res) {
    const { id } = req.params;
    const vendor = await this.service.getVenderById(id);
    if (!vendor) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_NOT_FOUND,
      );
    }
    const dashboard = await this.service.getVendorDashboard(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      adminMessage.VENDER_DAHBOARD_FETCH,
      dashboard,
    );
  }

  async getAllUsers(req, res) {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const users = await this.service.getAllUsers(page, limit, search, status);
    if (users.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    const paginationData = commanFunction.pagignation(page, limit, users);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_LIST_FETCHED,
      paginationData,
    );
  }

  async getVendorStoreDetails(req, res) {
    const { id } = req.params;
    const { search = "" } = req.query;
    const vendor = await this.service.getVenderById(id);
    if (!vendor) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_NOT_FOUND,
      );
    }
    const data = await this.service.getVendorStoreDetail(id, search);
    if (!data) {
      return sendResponse(res, STATUS_CODE.NOT_FOUND, "Store Not Found");
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Vendor store fetched successfully.",
      data,
    );
  }

  async getAllVendorPayouts(req, res) {
    const { page = 1, limit = 10, status, vendor_id, order_id } = req.query;
    const payouts = await this.service.getAllVendorsPayouts(
      page,
      limit,
      status,
      vendor_id,
      order_id,
    );
    if (payouts.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Vendor payouts not found.",
      );
    }
    const pagignationData = commanFunction.pagignation(page, limit, payouts);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      orderMessages.VENDER_PAYOUT_FETCH,
      pagignationData,
    );
  }

  async getVendorPayoutSummary(req, res) {
    const summary = await this.service.getVendorPayoutSummary();
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      orderMessages.VENDER_PAYOUT_FETCH,
      summary,
    );
  }

  async getAllOrders(req, res) {
    const { page = 1, limit = 10, status, serach = "" } = req.query;
    const orders = await this.service.getAllOrders(page, limit, status, serach);
    if (orders.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        orderMessages.ORDER_NOT_FOUND,
      );
    }
    const pagignationData = commanFunction.pagignation(page, limit, orders);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      orderMessages.ORDER_FETCHED,
      pagignationData,
    );
  }

  async updateAdminConfiguration(req, res) {
    const { commission_percentage } = req.body;
    // Check commission is provided
    if (commission_percentage === undefined || commission_percentage === null) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Commission percentage is required.",
      );
    }
    const commission = Number(commission_percentage);
    // Validate commission
    if (Number.isNaN(commission)) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Commission percentage must be a valid number.",
      );
    }
    if (commission < 0 || commission > 100) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Commission percentage must be between 0 and 100.",
      );
    }
    const configuration = await this.service.updateAdminConfiguration({
      commission_percentage: commission,
      updated_by: req.user.id,
    });
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Admin commission updated successfully.",
      configuration,
    );
  }

  async getAdminConfiguration(req, res) {
    const configuration = await this.service.getAdminConfiguration();
    if (!configuration) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Admin configuration not found.",
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Admin configuration fetched successfully.",
      configuration,
    );
  }

  async createCategory(req, res) {
    const { cat_name } = req.body;
    if (!cat_name || !cat_name.trim()) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        categoryMessages.CATEGORY_NAME_REQUIRED,
      );
    }
    const slug = cat_name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const existingCategory = await this.service.getCategoryBySlug(slug);
    if (existingCategory) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        categoryMessages.CATEGORY_ALREADY_EXISTS,
      );
    }
    const category = await this.service.createCategory({
      cat_name: cat_name.trim(),
      slug,
      is_active: true,
    });
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      categoryMessages.CATEGORY_CREATED,
      {
        category,
      },
    );
  }

  async getAllCategories(req, res) {
    const { page = 1, limit = 10, search = "", status } = req.query;
    const categories = await this.service.getAllCategories(
      page,
      limit,
      search,
      status,
    );
    if (categories.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        categoryMessages.CATEGORIES_NOT_FOUND,
      );
    }
    const pagignationData = commanFunction.pagignation(page, limit, categories);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      categoryMessages.CATEGORIES_FETCHED,
      {
        pagignationData,
      },
    );
  }

  async updateCategory(req, res) {
    const { id } = req.params;
    const { cat_name } = req.body;
    const category = await this.service.getcategoryById(id);
    if (!category) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        categoryMessages.CATEGORIES_NOT_FOUND,
      );
    }
    const payload = {};
    if (cat_name !== undefined) {
      if (!cat_name.trim()) {
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          categoryMessages.CATEGORY_NAME_EMPTY,
        );
      }
      const slug = cat_name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      const existingCategory = await this.service.getCategoryBySlug(slug);
      if (existingCategory && Number(existingCategory.id) !== Number(id)) {
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          categoryMessages.CATEGORY_NAME_ALREADY_EXISTS,
        );
      }
      payload.cat_name = cat_name.trim();
      payload.slug = slug;
    }
    await this.service.updateCategory(id, payload);
    const updatedCategory = await this.service.getcategoryById(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      categoryMessages.CATEGORY_UPDATED,
      updatedCategory,
    );
  }

  async deleteCategory(req, res) {
    const { id } = req.params;
    const category = await this.service.getcategoryById(id);
    if (!category) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        categoryMessages.CATEGORIES_NOT_FOUND,
      );
    }
    await this.service.deleteCategory(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      categoryMessages.CATEGORY_DELETED,
    );
  }

  async getProductByCategoryId(req, res) {
    const { id } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;
    const category = await this.service.getcategoryById(id);
    if (!category) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        categoryMessages.CATEGORIES_NOT_FOUND,
      );
    }
    const products = await this.service.getProductById(id, page, limit, search);
    if (products.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Products not found for this category.",
      );
    }
    const paginationData = commanFunction.pagignation(page, limit, products);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Category products fetched successfully.",
      {
        category,
        products: paginationData,
      },
    );
  }

  async getProductsByCategoryAndRating(req, res) {
    const { id } = req.params;
    const { page = 1, limit = 10, rating, search = "" } = req.query;
    const category = await this.service.getcategoryById(id);
    if (!category) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        categoryMessages.CATEGORY_NOT_FOUND,
      );
    }
    const products = await this.service.getProductsByCategoryAndRating(
      id,
      page,
      limit,
      rating,
      search,
    );
    if (products.count === 0) {
      return sendResponse(res, STATUS_CODE.NOT_FOUND, "Products not found.");
    }
    const paginationData = commanFunction.pagignation(page, limit, products);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Products fetched successfully.",
      paginationData,
    );
  }
}
