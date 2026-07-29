import express from "express";
import OrderController from "../order/orderController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import { sequelize } from "../../config/db.js";
import Address from "../../dataBase/models/addressModel.js";
import Cart from "../../dataBase/models/cartModel.js";
import CartItem from "../../dataBase/models/cartItemModel.js";
import Order from "../../dataBase/models/orderModel.js";
import OrderItem from "../../dataBase/models/orderItem.js";
import Product from "../../dataBase/models/productModel.js";
import authorize from "../middleweare/authmiddleweare.js";
import Payment from "../../dataBase/models/paymetModel.js"
const router = express.Router();
const orderController = new OrderController();
await orderController.init(sequelize);
orderController.init({
  models: { Address, Cart, CartItem, Order, OrderItem, Product, Payment },
});
router.post(
  "/placeOrder",
  authorize,
  asyncHandler(orderController.placeOrder.bind(orderController)),
);
router.post(
  "/payment-confirm",
  authorize,
  (req, res) => orderController.confirmPayment(req, res)
);
export default router;
