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
import ProductMedia from "../../dataBase/models/productMedia.js";
import Review from "../../dataBase/models/reviewModel.js"
import authorize from "../middleweare/authmiddleweare.js";
import limiter from "../../utility/rateLimit.js";
import {
  validateRequest,
  validateParams,
  validateQuery,
  venderActionValidation,
  venderIdValidation,
  updateAdminConfigurationValidation,
  productIdValidation,
  adminUserIdValidation,
  productStatusValidation,
  userStatusValidation,
  adminProductsQueryValidation,
  dashboardValidation,
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
    ProductMedia,
    Review
  },
});
router.put(
  "/update-profile",
  // auth must run before multer so unauthenticated uploads never reach the handler
  authorize,
  role,
  upload.single("avtar"),
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
router.get(
  "/dashboard",
  authorize,
  role,
  validateQuery(dashboardValidation),
  asyncHandler(adminController.getAdminDashboard.bind(adminController)),
);
router.get(
  "/products",
  authorize,
  role,
  validateQuery(adminProductsQueryValidation),
  asyncHandler(adminController.getAdminProducts.bind(adminController)),
);
router.patch(
  "/products/:id/status",
  authorize,
  role,
  validateParams(productIdValidation),
  validateRequest(productStatusValidation),
  asyncHandler(adminController.updateProductStatus.bind(adminController)),
);
router.patch(
  "/users/:id/status",
  authorize,
  role,
  validateParams(adminUserIdValidation),
  validateRequest(userStatusValidation),
  asyncHandler(adminController.updateUserStatus.bind(adminController)),
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
  checkRole("Super Admin","Vendors"),
  asyncHandler(adminController.createCategory.bind(adminController)),
);
router.get(
  "/get-categories",
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
