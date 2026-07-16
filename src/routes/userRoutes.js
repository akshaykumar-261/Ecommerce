import express from "express";
import UserController from "../auth/userController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import upload from "../middleweare/uploadFile.js";
import { sequelize } from "../../config/db.js";
import Users from "../../dataBase/models/userModel.js";
import Roles from "../../dataBase/models/roleModel.js";
import UserDevices from "../../dataBase/models/user_deviceModel.js";
import authorize from "../middleweare/authmiddleweare.js";
import {
  validateRequest,
  createUserSchema,
  verifyUserSchema,
} from "../auth/userValidation.js";
const router = express.Router();
const userController = new UserController();
await userController.init(sequelize);
userController.init({ models: { Users, Roles,UserDevices } });
router.post(
  "/create",
  upload.any(),
  validateRequest(createUserSchema),
  asyncHandler(userController.userCreate.bind(userController)),
);
router.post(
  "/verify-user",
  validateRequest(verifyUserSchema),
  asyncHandler(userController.verifyUser.bind(userController)),
);
router.post(
  "/resend-otp-verifyUser",
  asyncHandler(userController.resendOtpVerifyUser.bind(userController))
)
router.post(
  "/forgot-password",
  asyncHandler(userController.forgotPassword.bind(userController))
)
router.post(
  "/verify-forgotOtp",
  asyncHandler(userController.verifyForgotOtp.bind(userController))
)
router.post(
  "/reset-password",
  authorize,
  asyncHandler(userController.resetPassword.bind(userController))
)
export default router;
