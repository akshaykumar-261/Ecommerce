import express from "express";
import productController from "../products/productController.js";
import authorize from "../middleweare/authmiddleweare.js";
import { asyncHandler } from "../helper/commonFunction.js";
import Products from "../../dataBase/models/productModel.js";
import Category from "../../dataBase/models/categoryModel.js";
import ProductMedia from "../../dataBase/models/productMedia.js";
import Store from "../../dataBase/models/storeModel.js";
import {
  categoryIdParamValidation,
  productIdParamValidation,
  productsByCategoryQueryValidation,
  allProductsQueryValidation,
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
    Store,
  },
});

router.get(
  "/AllProduct",
  validateQuery(allProductsQueryValidation),
  asyncHandler(productCtrl.getAllProducts.bind(productCtrl))
);

router.get(
  "/category/:id",
  validateParams(categoryIdParamValidation),
  validateQuery(productsByCategoryQueryValidation),
  asyncHandler(productCtrl.getProductsByCategoryId.bind(productCtrl))
);

router.get(
  "/search",
  asyncHandler(productCtrl.searchProducts.bind(productCtrl))
);

router.get(
  "/search-suggestions",
  asyncHandler(productCtrl.searchSuggestions.bind(productCtrl))
);

router.get(
  "/:id",
  validateParams(productIdParamValidation),
  asyncHandler(productCtrl.getProductById.bind(productCtrl))
);

export default router;
