import express from "express";
import ReviewController from "../userReview&Wishlist/userReviewController.js";
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
import ReviewModel from "../../dataBase/models/reviewModel.js";
import WishListModel from "../../dataBase/models/wishListModel.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
const router = express.Router();
const reviewController = new ReviewController();
const role = checkRole("Customer");
await reviewController.init(sequelize);
reviewController.init({
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
    ReviewModel,
    WishListModel,
  },
});
router.post(
  "/create-review",
  authorize,
  role,
  asyncHandler(reviewController.addReview.bind(reviewController)),
);
router.get(
  "/get-myReview/:productId",
  authorize,
  role,
  asyncHandler(reviewController.getMyReview.bind(reviewController)),
);
router.get(
  "/get-allReviewsProduct/:productId",
  authorize,
  role,
  asyncHandler(reviewController.getReviewsByProduct.bind(reviewController)),
);
router.put(
  "/update-review/:reviewId",
  authorize,
  role,
  asyncHandler(reviewController.updateReview.bind(reviewController)),
);
router.delete(
  "/deleteReview/:reviewId",
  authorize,
  role,
  asyncHandler(reviewController.deleteReview.bind(reviewController)),
);
router.post(
  "/addWishlist-Product/:productId",
  authorize,
  role,
  asyncHandler(reviewController.addToWishlist.bind(reviewController)),
);
router.get(
  "/get-wishList",
  authorize,
  role,
  asyncHandler(reviewController.getWishlist.bind(reviewController)),
);
router.delete(
  "/remove-wishlist/:productId",
  authorize,
  role,
  asyncHandler(reviewController.removeFromWishlist.bind(reviewController)),
);
export default router;
