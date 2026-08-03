import express from "express";
import AdminController from "../admin/adminController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import { sequelize } from "../../config/db.js";
import Users from "../../dataBase/models/userModel.js";
import authorize from "../middleweare/authmiddleweare.js";
const router = express.Router();
const adminController = new AdminController();
const role = checkRole("Super Admin");
import checkRole from "../middleweare/roleBasemiddleweare.js";
await adminController.init(sequelize);
adminController.init({ models: { Users } });
router.get(
    "/admin-profile",
    authorize,
    role,
    asyncHandler(adminController.getAdminProfile.bind(adminController)),
)
router.get(
    "/get-all-venders",
    authorize,
    role,
    asyncHandler(adminController.getAllAdmin.bind(adminController)),
)
export default router;