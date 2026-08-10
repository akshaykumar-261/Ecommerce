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
import Payment from "../../dataBase/models/paymetModel.js";
import Store from "../../dataBase/models/storeModel.js";
import Users from "../../dataBase/models/userModel.js";
import VendorPayout from "../../dataBase/models/vendor_payouts.js";
import AdminCongiguration from "../../dataBase/models/adminConfigration.js";
const router = express.Router();
const orderController = new OrderController();
await orderController.init(sequelize);
orderController.init({
  models: {
    Address,
    Cart,
    CartItem,
    Order,
    OrderItem,
    Product,
    Payment,
    Store,
    Users,
    VendorPayout,
    AdminCongiguration,
  },
});
router.post(
  "/placeOrder",
  authorize,
  asyncHandler(orderController.placeOrder.bind(orderController)),
);
router.post(
  "/payment-confirm",
  authorize,
  asyncHandler(orderController.confirmPayment.bind(orderController)),
);
router.get(
  "/getOrders",
  authorize,
  asyncHandler(orderController.getMyOrders.bind(orderController)),
);
router.get(
  "/getOrderById/:orderId",
  authorize,
  asyncHandler(orderController.getOrderById.bind(orderController)),
);
router.post(
  "/cancelOrder/:orderId",
  authorize,
  asyncHandler(orderController.cancelOrder.bind(orderController)),
);
router.patch(
  "/change-order-status/:orderId",
  authorize,
  asyncHandler(orderController.updateOrderStatus.bind(orderController)),
);
router.get(
  "/track-order/:orderId",
  authorize,
  asyncHandler(orderController.trackOrder.bind(orderController)),
);
export default router;
