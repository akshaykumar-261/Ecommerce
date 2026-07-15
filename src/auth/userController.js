import UserServices from "./userService.js";
import { authMessage, userMessage } from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../helper/commonFunction.js";
import { uploadToCloudinary } from "../../utility/ cloudinaryUpload.js";
import { ROLE } from "../helper/roleBase.js";
import { emailQueue } from "../../utility/queue/emailQueue.js";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
export default class userController {
  async init(db) {
    this.service = new UserServices();
    this.Models = db.models;
    await this.service.init(db);
  }
  async userCreate(req, res) {
    const { email } = req.body;
    const existingUser = await this.service.getByEmail(email);
    if (existingUser) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.USER_EXIST);
    }
    let avatar = null;
    if (req.files && req.files.length > 0) {
      const result = await uploadToCloudinary(req.files[0], "users/avatar");
      avatar = result.secure_url;
    }
    const otp = commanFunction.generateOtp(6);
    const user = await this.service.createUser({
      ...req.body,
      avtar: avatar,
      role_Id: ROLE.CUSTOMER,
      otp,
      is_verified: false,
      otp_expire: new Date(Date.now() + 10 * 60 * 1000),
    });
    const sessionId = uuidv4();
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    await this.Models.user_devices.create({
      user_Id: user.id,
      session_id: sessionId,
    });
    const abc = await emailQueue.add("registration", {
      email: user.email,
      otp,
      name: user.name,
    });
    return sendResponse(res, STATUS_CODE.CREATED, userMessage.USER_CREATED, {
      user,
      accessToken,
    });
  }

  async verifyUser(req, res) {
    const { otp } = req.body;
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        authMessage.TOKEN_REQUIRED,
      );
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_TOKEN,
      );
    }
    const user = await this.service.getUserById(decoded.id);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (user.is_verified) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_VERIFY,
      );
    }
    if (user.otp_expire < new Date()) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.OTP_EXPIRED,
      );
    }
    if (user.otp != otp) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_OTP,
      );
    }
    await this.service.verifyUser(user.id);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_VERIFIED);
  }
}
