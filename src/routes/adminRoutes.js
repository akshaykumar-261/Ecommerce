import express from "express";
import AdminController from "../admin/adminController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import Users from "../../dataBase/models/userModel.js";
import Store from "../../dataBase/models/storeModel.js";
import Products from "../../dataBase/models/productModel.js";
import Order from "../../dataBase/models/orderModel.js";
import OrderItems from "../../dataBase/models/orderItem.js";
import VendorPayout from "../../dataBase/models/vendor_payouts.js";
import Address from "../../dataBase/models/addressModel.js";
import Payment from "../../dataBase/models/paymetModel.js";
import upload from "../middleweare/uploadFile.js";
import AdminConfiguration from "../../dataBase/models/adminConfigration.js";
import Category from "../../dataBase/models/categoryModel.js";
import Review from "../../dataBase/models/reviewModel.js"
import authorize from "../middleweare/authmiddleweare.js";
import limiter from "../../utility/rateLimit.js";
import {
  validateRequest,
  validateParams,
  venderActionValidation,
  venderIdValidation,
  updateAdminConfigurationValidation,
} from "../admin/adminValidation.js";
const router = express.Router();
const adminController = new AdminController();
const role = checkRole("Super Admin");
import checkRole from "../middleweare/roleBasemiddleweare.js";
await adminController.init({
  models: {
    Users,
    Store,
    Products,
    Order,
    OrderItems,
    VendorPayout,
    Address,
    Payment,
    AdminConfiguration,
    Category,
    Review
  },
});
router.put(
  "/update-profile",
  upload.single("avtar"),
  authorize,
  role,
  asyncHandler(adminController.updateAdminProfile.bind(adminController)),
);
router.get(
  "/admin-profile",
  limiter,
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
  validateParams(venderIdValidation),
  validateRequest(venderActionValidation),
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
router.get(
  "/vendor/store/:id",
  authorize,
  role,
  asyncHandler(adminController.getVendorStoreDetails.bind(adminController)),
);
router.get(
  "/vendor-payouts",
  authorize,
  role,
  asyncHandler(adminController.getAllVendorPayouts.bind(adminController)),
);
router.get(
  "/vendor-payouts/summary",
  authorize,
  role,
  asyncHandler(adminController.getVendorPayoutSummary.bind(adminController)),
);
router.get(
  "/admin/orders",
  authorize,
  role,
  asyncHandler(adminController.getAllOrders.bind(adminController)),
);
router.put(
  "/change-commision",
  authorize,
  role,
  validateRequest(updateAdminConfigurationValidation),
  asyncHandler(adminController.updateAdminConfiguration.bind(adminController)),
);
router.get(
  "/get-commision",
  authorize,
  role,
  asyncHandler(adminController.getAdminConfiguration.bind(adminController)),
);
router.post(
  "/get-category",
  authorize,
  role,
  asyncHandler(adminController.createCategory.bind(adminController)),
);
router.get(
  "/get-categories",
  authorize,
  role,
  asyncHandler(adminController.getAllCategories.bind(adminController)),
);
router.put(
  "/update-category/:id",
  authorize,
  role,
  asyncHandler(adminController.updateCategory.bind(adminController)),
);
router.delete(
  "/delete-category/:id",
  authorize,
  role,
  asyncHandler(adminController.deleteCategory.bind(adminController)),
);
router.get(
  "/getProductByCategoryId/:id",
  authorize,
  role,
  asyncHandler(adminController.getProductByCategoryId.bind(adminController)),
);
router.get(
  "/productByRating/:id",
  authorize,
  role,
  asyncHandler(
    adminController.getProductsByCategoryAndRating.bind(adminController),
  ),
);
export default router;
