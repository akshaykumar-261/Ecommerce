import express from "express";
import UserController from "../auth/userController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import upload from "../middleweare/uploadFile.js";
import { sequelize } from "../../config/db.js";

const router = express.Router();
const userController = new UserController();
await userController.init(sequelize);

router.post(
  "/create",
  upload.any(),
  asyncHandler(async (req, res) => userController.userCreate(req, res)),
);

export default router;
