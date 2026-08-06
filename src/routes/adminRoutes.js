import express from "express";
import AdminController from "../admin/adminController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import Users from "../../dataBase/models/userModel.js";
import Store from "../../dataBase/models/storeModel.js";
import Products from "../../dataBase/models/productModel.js";
import Order from "../../dataBase/models/orderModel.js";
import OrderItems from "../../dataBase/models/orderItem.js";
import authorize from "../middleweare/authmiddleweare.js";
const router = express.Router();
const adminController = new AdminController();
const role = checkRole("Super Admin");
import checkRole from "../middleweare/roleBasemiddleweare.js";
await adminController.init({
  models: { Users, Store, Products, Order, OrderItems },
});
router.get(
  "/admin-profile",
  authorize,
  role,
  asyncHandler(adminController.getAdminProfile.bind(adminController)),
);
router.get(
  "/get-all-venders",
  authorize,
  role,
  asyncHandler(adminController.getAllVenderByAdmin.bind(adminController)),
);
router.patch(
  "/vendor/action/:id",
  authorize,
  role,
  asyncHandler(adminController.venderAction.bind(adminController)),
);
router.get(
  "/vender/dashBoard/:id",
  authorize,
  role,
  asyncHandler(adminController.getVendorDashboard.bind(adminController)),
);
router.get(
  "/users",
  authorize,
  role,
  asyncHandler(adminController.getAllUsers.bind(adminController)),
);
export default router;
