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
  forgotPasswordSchema,
  verifyForgotOtpSchema,
  resetPasswordSchema,
  updateUserSchema,
  loginSchema,
} from "../auth/userValidation.js";
const router = express.Router();
const userController = new UserController();
await userController.init(sequelize);
userController.init({ models: { Users, Roles, UserDevices } });
router.post(
  "/create",
  upload.any(),
  validateRequest(createUserSchema),
  asyncHandler(userController.userCreate.bind(userController)),
);
router.post(
  "/verify-user",
  authorize,
  validateRequest(verifyUserSchema),
  asyncHandler(userController.verifyUser.bind(userController)),
);
router.post(
  "/resend-otp-verifyUser",
  authorize,
  asyncHandler(userController.resendOtpVerifyUser.bind(userController)),
);
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema),
  asyncHandler(userController.forgotPassword.bind(userController)),
);
router.post(
  "/verify-forgotOtp",
  authorize,
  validateRequest(verifyForgotOtpSchema),
  asyncHandler(userController.verifyForgotOtp.bind(userController)),
);
router.post(
  "/reset-password",
  authorize,
  validateRequest(resetPasswordSchema),
  asyncHandler(userController.resetPassword.bind(userController)),
);
router.post(
  "/resend-otp-forgotPassword",
  authorize,
  asyncHandler(userController.resendOtpForgotPassword.bind(userController)),
);
router.put(
  "/update-user/:id",
  upload.single("avtar"),
  authorize,
  validateRequest(updateUserSchema),
  asyncHandler(userController.updateUser.bind(userController)),
);
router.post(
  "/refresh-token",
  authorize,
  asyncHandler(userController.refreshToken.bind(userController)),
);
router.get(
  "/get-User",
  authorize,
  asyncHandler(userController.getUserProfile.bind(userController)),
);
router.post("/login", asyncHandler(userController.login.bind(userController)));
router.post(
  "/logout",
  authorize,
  validateRequest(loginSchema),
  asyncHandler(userController.logout.bind(userController)),
);
export default router;
