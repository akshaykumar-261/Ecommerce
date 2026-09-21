import express from "express";
import productController from "../products/productController.js";
import authorize from "../middleweare/authmiddleweare.js";
import { asyncHandler } from "../helper/commonFunction.js";
import Products from "../../dataBase/models/productModel.js";
import Category from "../../dataBase/models/categoryModel.js";
import ProductMedia from "../../dataBase/models/productMedia.js";
import {
  categoryIdParamValidation,
  productsByCategoryQueryValidation,
  validateParams,
  validateQuery,
} from "../products/productValidation.js";

const router = express.Router();
const productCtrl = new productController();

await productCtrl.init({
  models: {
    Products,
    Category,
    ProductMedia,
  },
});

router.get(
  "/category/:id",
  authorize,
  validateParams(categoryIdParamValidation),
  validateQuery(productsByCategoryQueryValidation),
  asyncHandler(productCtrl.getProductsByCategoryId.bind(productCtrl))
);

export default router;
