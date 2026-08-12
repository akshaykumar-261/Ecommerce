import express from "express";
import ReviewController from "../userReview&Wishlist/userReviewController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import { sequelize } from "../../config/db.js";
import authorize from "../middleweare/authmiddleweare.js";
import Users from "../../dataBase/models/userModel.js";
import ReviewModel from "../../dataBase/models/reviewModel.js";
import WishListModel from "../../dataBase/models/wishListModel.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
import {
  addReviewValidation,
  updateReviewValidation,
  validateRequest,
} from "../userReview&Wishlist/userReviewValidation.js";
const router = express.Router();
const reviewController = new ReviewController();
const role = checkRole("Customer");
await reviewController.init(sequelize);
reviewController.init({
  models: {
    Users,
    ReviewModel,
    WishListModel,
  },
});
router.post(
  "/create-review",
  authorize,
  role,
  validateRequest(addReviewValidation),
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
  validateRequest(updateReviewValidation),
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
