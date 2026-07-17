import UserServices from "./userService.js";
import { authMessage, userMessage } from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../helper/commonFunction.js";
import bcrypt from "bcrypt";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utility/ cloudinaryUpload.js";
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
  //************* Creating User  ******** */
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
    await this.service.createSession(user.id, sessionId);
    await emailQueue.add("registration", {
      email: user.email,
      otp,
      name: user.name,
    });
    return sendResponse(res, STATUS_CODE.CREATED, userMessage.USER_CREATED, {
      user,
      accessToken,
      refreshToken,
    });
  }

  async verifyUser(req, res) {
    const { otp } = req.body;
    const users = req.user;
    const user = await this.service.getUserById(users.id);
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

  async resendOtpVerifyUser(req, res) {
    const user = req.user;
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    const otp = commanFunction.generateOtp(6);
    await this.service.updateOtp(user.id, otp);
    await emailQueue.add("registration", {
      email: user.email,
      otp,
      name: user.name,
    });
    const sessionId = uuidv4();
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    await this.service.updateSession(req.sessionId, sessionId);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_SENT, {
      accessToken,
      refreshToken,
    });
  }
  //***************  Forgot password  *****/
  async forgotPassword(req, res) {
    const { email } = req.body;
    const user = await this.service.getByEmail(email);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!user.is_verified) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_VERIFY,
      );
    }
    const otp = commanFunction.generateOtp(6);
    await this.service.updateOtp(user.id, otp);
    await emailQueue.add("forgot-password", {
      email: user.email,
      otp,
      name: user.name,
    });
    const sessionId = uuidv4();
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_SENT, {
      accessToken,
      refreshToken,
    });
  }

  async verifyForgotOtp(req, res) {
    const { otp } = req.body;
    const users = req.user;
    const user = await this.service.getUserById(users.id);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
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
    const sessionId = uuidv4();
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_VERIFIED, {
      accessToken,
      refreshToken,
    });
  }

  async resetPassword(req, res) {
    const { newPassword } = req.body;
    const user = req.user;
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    await this.service.updateUser(user.id, { password: newPassword });
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.PASSWORD_RESET_SUCCESS,
    );
  }
  async resendOtpForgotPassword(req, res) {
    const user = req.user;
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    const otp = commanFunction.generateOtp(6);
    await this.service.updateOtp(user.id, otp);
    await emailQueue.add("forgot-password", {
      email: user.email,
      otp,
      name: user.name,
    });
    const sessionId = uuidv4();
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    await this.service.updateSession(req.sessionId, sessionId);
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.OTP_SENT, {
      accessToken,
      refreshToken,
    });
  }

  async refreshToken(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, STATUS_CODE.UNAUTHORIZE, authMessage.INVALID);
    }
    const refreshToken = authHeader.split(" ")[1];
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await this.service.getUserById(decoded.id);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    const accessToken = commanFunction.generateAccessToken(
      user,
      decoded.sessionId,
    );
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.ACCESS_TOKEN_GENERATED,
      { accessToken },
    );
  }
  async updateUser(req, res) {
    const { id } = req.params;
    const existingUser = await this.service.getUserById(id);
    if (!existingUser) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    const payload = {
      ...req.body,
    };
    if (req.file) {
      // Agar purani image hai tabhi delete karo
      if (existingUser.avatar_public_id) {
        await deleteFromCloudinary(existingUser.avatar_public_id);
      }
      const result = await uploadToCloudinary(req.file, "users/avatar");
      payload.avtar = result.secure_url;
      payload.avatar_public_id = result.public_id;
    }
    await this.service.updateUser(id, payload);
    const updatedUser = await this.service.getUserById(id);
    console.log("===>", updatedUser);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.USER_UPDATED,
      updatedUser,
    );
  }

  async getUserProfile(req, res) {
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

  async login(req, res) {
    const sessionId = uuid4();
    const { email, password, device_token, device_type, device_id } = req.body;
    const userInDb = await this.service.getByEmail(email);
    if (userInDb) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!userInDb.is_verified) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.VERIFY_EMAIL,
      );
    }
    const isMatch = await bcrypt.compare(password, userInDb.password);
    if (!isMatch) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_CREDENTIALS,
      );
    }
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    if (existingDevice) {
      const abc = await existingDevice.update({
        device_token,
        device_type: device_type,
        is_login: true,
        login_time: new Date(),
        logout_time: null,
        session_id: sessionId,
      });
    } else {
      const a = await this.Models.UserDevices.create({
        user_id: userInDb.id,
        device_token,
        device_type: device_type,
        device_id,
        is_login: true,
        login_time: new Date(),
        session_id: sessionId,
      });
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.LOGIN_SUCCESS, {
      accessToken,
      refreshToken,
    });
  }
}
