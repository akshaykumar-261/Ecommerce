import ReviewService from "./userReviewService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import {
  reviewMessages,
  wishlistMessages,
} from "../helper/commanMessages.js";
import { sequelize } from "../../config/db.js";
export default class ReviewController {
  async init(db) {
     this.Model = db.models;
    this.services = new ReviewService();
    await this.services.init(db);
  }
  async addReview(req, res) {
    const { product_id, rating, review } = req.body;
    const existingReview = await this.services.getMyReview(
      req.user.id,
      product_id,
    );
    if (existingReview) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        reviewMessages.REVIEW_ALREADY_EXISTS,
      );
    }
    const payload = {
      user_id: req.user.id,
      product_id,
      rating,
      review,
    };
    const reviewData = await this.services.createReview(payload);
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      reviewMessages.REVIEW_CREATED,
      {
        review: reviewData,
      },
    );
  }

  async getMyReview(req, res) {
    const { productId } = req.params;
    const review = await this.services.getMyReview(req.user.id, productId);
    if (!review) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        reviewMessages.REVIEW_NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      reviewMessages.REVIEW_FETCHED,
      {
        review,
      },
    );
  }

  async getReviewsByProduct(req, res) {
    const { productId } = req.params;
    const reviews = await this.services.getReviewByProductId(productId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      reviewMessages.REVIEWS_FETCHED,
      {
        reviews,
      },
    );
  }

  async updateReview(req, res) {
    const { reviewId } = req.params;
    const existingReview = await this.services.getMyReviewById(
      reviewId,
      req.user.id,
    );
    if (!existingReview) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        reviewMessages.REVIEW_NOT_FOUND,
      );
    }
    const payload = {
      rating: req.body.rating,
      review: req.body.review,
    };

    await this.services.updateMyReview(reviewId, req.user.id, payload);
    const updatedReview = await this.services.getMyReviewById(
      reviewId,
      req.user.id,
    );
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      reviewMessages.REVIEW_UPDATED,
      {
        review: updatedReview,
      },
    );
  }

  async deleteReview(req, res) {
    const { reviewId } = req.params;
    const existingReview = await this.services.getMyReviewById(
      reviewId,
      req.user.id,
    );
    console.log("==========>", existingReview);
    if (!existingReview) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        reviewMessages.REVIEW_NOT_FOUND,
      );
    }
    await this.services.deleteMyReview(reviewId, req.user.id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      reviewMessages.REVIEW_DELETED,
    );
  }

  async addToWishlist(req, res) {
    const { productId } = req.params;
    const existingWishlist = await this.services.getWishlistItem(
      req.user.id,
      productId,
    );
    if (existingWishlist) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        wishlistMessages.ALREADY_IN_WISHLIST,
      );
    }
    const payload = {
      user_id: req.user.id,
      product_id: productId,
    };
    const wishlist = await this.services.addToWishlist(payload);
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      wishlistMessages.ADDED_TO_WISHLIST,
      {
        wishlist,
      },
    );
  }

  async getWishlist(req, res) {
    const wishlists = await this.services.getWishListByUser(req.user.id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      wishlistMessages.WISHLIST_FETCHED,
      {
        wishlists,
      },
    );
  }

  async removeFromWishlist(req, res) {
    const { productId } = req.params;
    const wishlist = await this.services.getWishlistItem(
      req.user.id,
      productId,
    );
    if (!wishlist) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        wishlistMessages.NOT_IN_WISHLIST,
      );
    }
    await this.services.deleteWishlistItem(req.user.id, productId);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      wishlistMessages.REMOVED_FROM_WISHLIST,
    );
  }

  async getTopRatedProducts(req, res) {
    const { minRating = 3, limit = 20 } = req.query;
    const reviews = await this.services.getTopRatedProducts(
      Number(minRating),
      Number(limit),
    );
    const productIds = reviews.map((r) => r.product_id);
    if (productIds.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "No rated products found.",
        { products: [] }
      );
    }
    const products = await this.Model.Products.findAll({
      where: { id: productIds, deletedAt: null, status: true },
      include: [
        {
          model: this.Model.Category,
          attributes: ["id", "cat_name", "slug"],
          required: false,
        },
        {
          model: this.Model.ProductMedia,
          attributes: ["id", "media_type", "media_url", "is_primary"],
          required: false,
        },
      ],
    });

    const productsWithRating = products.map((p) => {
      const review = reviews.find((r) => r.product_id === p.id);
      return {
        ...p.toJSON(),
        avgRating: review?.avgRating || 0,
        reviewCount: review?.reviewCount || 0,
      };
    });

    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Top rated products fetched successfully.",
      { products: productsWithRating }
    );
  }
}
