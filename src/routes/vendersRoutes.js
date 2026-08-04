import express from "express";
import VenderController from "../venders/venderController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import upload from "../middleweare/uploadFile.js";
import { sequelize } from "../../config/db.js";
import authorize from "../middleweare/authmiddleweare.js";
import Store from "../../dataBase/models/storeModel.js";
import Product from "../../dataBase/models/productModel.js";
import ProductMediaModel from "../../dataBase/models/productMedia.js";
import Users from "../../dataBase/models/userModel.js";
import UserDevices from "../../dataBase/models/user_deviceModel.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
import {
  createStoreSchema,
  updateStoreSchema,
  createVendorSchema,
  validateRequest,
} from "../venders/venderValidation.js";
const router = express.Router();
const venderController = new VenderController();
const role = checkRole("Vendors");
await venderController.init(sequelize);
venderController.init({
  models: { Store, Product, ProductMediaModel, Users, UserDevices },
});

router.post(
  "/createVendor",
  upload.any(),
  validateRequest(createVendorSchema),
  asyncHandler(venderController.userVendor.bind(venderController)),
);
router.get(
  "/onboardingLink",
  authorize,
  checkRole("Vendors"),
  asyncHandler(venderController.createOnboardingLink.bind(venderController)),
);
router.get(
  "/stripeAccountDetails",
  //authorize,
 // checkRole("Vendors"),
  asyncHandler(venderController.getStripeAccountStatus.bind(venderController)),
);

router.post(
  "/create-store",
  authorize,
  role,
  upload.fields([{ name: "store_logo" }, { name: "store_banner" }]),
  validateRequest(createStoreSchema),
  asyncHandler(venderController.createStore.bind(venderController)),
);
router.put(
  "/update-store",
  authorize,
  role,
  validateRequest(updateStoreSchema),
  upload.fields([
    { name: "store_logo", maxCount: 1 },
    { name: "store_banner", maxCount: 1 },
  ]),
  asyncHandler(venderController.updateStore.bind(venderController)),
);
router.delete(
  "/delete-store",
  authorize,
  role,
  asyncHandler(venderController.deleteStore.bind(venderController)),
);
router.get(
  "/get-store",
  authorize,
  role,
  asyncHandler(venderController.getStore.bind(venderController)),
);
router.post(
  "/add-product",
  authorize,
  role,
  upload.fields([
    {
      name: "product_images",
      maxCount: 10,
    },
    {
      name: "product_videos",
      maxCount: 2,
    },
  ]),
  asyncHandler(venderController.addProduct.bind(venderController)),
);
router.patch(
  "/products-quantity/:id",
  authorize,
  role,
  asyncHandler(venderController.updateProductQuantity.bind(venderController)),
);
router.post(
  "/products-media/:id",
  authorize,
  role,
  upload.fields([
    {
      name: "product_images",
      maxCount: 10,
    },
    {
      name: "product_videos",
      maxCount: 2,
    },
  ]),
  asyncHandler(venderController.addProductMedia.bind(venderController)),
);
router.delete(
  "/product-media-delete/:mediaId",
  authorize,
  role,
  asyncHandler(venderController.deleteProductMedia.bind(venderController)),
);
router.put(
  "/update-product-details/:id",
  authorize,
  asyncHandler(venderController.updateProduct.bind(venderController)),
);
router.get(
  "/get-products",
  authorize,
  role,
  asyncHandler(venderController.getAllProducts.bind(venderController)),
);
router.patch(
  "/change-product-status/:id",
  authorize,
  role,
  asyncHandler(venderController.changeProductStatus.bind(venderController)),
);
router.get(
  "/outOf-Stock-Product",
  authorize,
  role,
  asyncHandler(venderController.getOutOfStockProducts.bind(venderController)),
);
router.post(
  "/setPrimary-image/:mediaId",
  authorize,
  role,
  asyncHandler(venderController.setPrimaryImages.bind(venderController)),
);
router.get(
  "/get-product-dashboard",
  authorize,
  role,
  asyncHandler(venderController.venderDashboard.bind(venderController)),
);
router.get(
  "/get-productById/:id",
  authorize,
  role,
  asyncHandler(venderController.getProductWithId.bind(venderController)),
);
router.get(
  "/products",
  authorize,
  role,
  asyncHandler(venderController.getAllUserProduct.bind(venderController)),
);
export default router;
