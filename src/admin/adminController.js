import AdminService from "./adminService.js";
import { authMessage, userMessage } from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { emailQueue } from "../../utility/queue/emailQueue.js";
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

  async getAllAdmin(req, res) {
    const vendors = await this.service.getAllVenders();
    if (!vendors) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.VENDER_LIST_FETCHED,
      vendors,
    );
  }
}
