import AdminService from "./adminService.js";
import { authMessage, userMessage } from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { emailQueue } from "../../utility/queue/emailQueue.js";
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
      "Vendor dashboard fetched successfully.",
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
}
