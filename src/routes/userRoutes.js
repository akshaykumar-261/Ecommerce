import express from "express";
import UserController from "../auth/userController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import upload from "../middleweare/uploadFile.js";
import { sequelize } from "../../config/db.js";
import Users from "../../dataBase/models/userModel.js";
import Roles from "../../dataBase/models/roleModel.js";
import {
  validateRequest,
  createUserSchema,
  verifyUserSchema,
} from "../auth/userValidation.js";
const router = express.Router();
const userController = new UserController();
await userController.init(sequelize);
userController.init({ models: { Users, Roles } });
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
export default router;
