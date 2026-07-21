import express from "express";
import VenderController from "../venders/venderController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import upload from "../middleweare/uploadFile.js";
import { sequelize } from "../../config/db.js";
import authorize from "../middleweare/authmiddleweare.js";
import Store from "../../dataBase/models/storeModel.js";
import {
  createStoreSchema,
  updateStoreSchema,
  validateRequest,
} from "../venders/venderValidation.js";
const router = express.Router();
const venderController = new VenderController();
await venderController.init(sequelize);
venderController.init({ models: { Store } });
router.post(
  "/create-store",
  authorize,
  upload.fields([{ name: "store_logo" }, { name: "store_banner" }]),
  validateRequest(createStoreSchema),
  asyncHandler(venderController.createStore.bind(venderController)),
);
router.put(
  "/update-store",
  authorize,
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
  asyncHandler(venderController.deleteStore.bind(venderController)),
);
router.get(
  "/get-store",
  authorize,
  asyncHandler(venderController.getStore.bind(venderController)),
);
router.post(
  "/add-product",
  authorize,
  upload.fields([{ name: "product_images" }, { name: "product_videos" }]),
  asyncHandler(venderController.addProduct.bind(venderController)),
);
export default router;
