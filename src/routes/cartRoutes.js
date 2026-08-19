import express from "express";
import CartController from "../cart/cartController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import { sequelize } from "../../config/db.js";
import Product from "../../dataBase/models/productModel.js";
import Cart from "../../dataBase/models/cartModel.js";
import CartItem from "../../dataBase/models/cartItemModel.js";
import authorize from "../middleweare/authmiddleweare.js";
import ProductMediaModel from "../../dataBase/models/productMedia.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
import {
  validateRequest,
  addToCartSchema,
  updateCartItemQuantitySchema,
} from "../cart/cartValidation.js";
const router = express.Router();
const cartController = new CartController();
const role = checkRole("Customer");
await cartController.init(sequelize);
cartController.init({ models: { Cart, Product, CartItem, ProductMediaModel } });
router.post(
  "/add-to-cart",
  authorize,
  role,
  validateRequest(addToCartSchema),
  asyncHandler(cartController.addProdct.bind(cartController)),
);
router.get(
  "/get-cart-items",
  authorize,
  role,
  asyncHandler(cartController.getCart.bind(cartController)),
);
router.put(
  "/update-quantity/:cartItemId",
  authorize,
  role,
  validateRequest(updateCartItemQuantitySchema),
  asyncHandler(cartController.updateCartItemQuantity.bind(cartController)),
);
router.get(
  "/get-cart-count",
  authorize,
  role,
  asyncHandler(cartController.getCartCount.bind(cartController)),
);
router.delete(
  "/remove-product/:product_id",
  authorize,
  role,
  asyncHandler(cartController.removeCartItem.bind(cartController)),
);
export default router;
