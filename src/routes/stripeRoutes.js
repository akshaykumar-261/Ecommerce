import express from "express";
import StripeWebhookController from "../stripe/stripeWebhookController.js";
import { asyncHandler } from "../helper/commonFunction.js";
// The webhook reuses OrderService, so the models it touches must be imported
// before init runs.
import Address from "../../dataBase/models/addressModel.js";
import Cart from "../../dataBase/models/cartModel.js";
import CartItem from "../../dataBase/models/cartItemModel.js";
import Order from "../../dataBase/models/orderModel.js";
import OrderItem from "../../dataBase/models/orderItem.js";
import Product from "../../dataBase/models/productModel.js";
import Payment from "../../dataBase/models/paymetModel.js";
import ProductMediaModel from "../../dataBase/models/productMedia.js";
import Store from "../../dataBase/models/storeModel.js";
import Users from "../../dataBase/models/userModel.js";
import VendorPayout from "../../dataBase/models/vendor_payouts.js";
import AdminCongiguration from "../../dataBase/models/adminConfigration.js";

const router = express.Router();
const webhookController = new StripeWebhookController();
// Same explicit model map orderRoutes.js uses: the webhook reuses OrderService,
// which looks models up by these PascalCase keys rather than by registry name.
await webhookController.init({
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
    ProductMediaModel,
  },
});

/*
 * Signature verification needs the exact bytes Stripe signed, so this route
 * must read a raw body. It is mounted before the global express.json() in
 * config/server.js — if the JSON parser runs first the body is already consumed
 * and constructEvent always throws.
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  asyncHandler(webhookController.handleWebhook.bind(webhookController)),
);

export default router;
