import { literal } from "sequelize";

export default class ReviewService {
  async init(db) {
    this.Model = db.models;
  }

  async createReview(payload) {
    return await this.Model.ReviewModel.create(payload);
  }

  async getMyReview(userId, productId) {
    return await this.Model.ReviewModel.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
  }

  async getMyReviewById(reviewId, userId) {
    return await this.Model.ReviewModel.findOne({
      where: {
        id: reviewId,
        user_id: userId,
      },
    });
  }

  // get all review of a product
  async getReviewByProductId(productId) {
    return await this.Model.ReviewModel.findAll({
      where: {
        product_id: productId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  // Update user's own review
  async updateMyReview(reviewId, userId, payload) {
    return await this.Model.ReviewModel.update(payload, {
      where: {
        id: reviewId,
        user_id: userId,
      },
    });
  }

  async deleteMyReview(reviewId, userId) {
    return await this.Model.ReviewModel.destroy({
      where: {
        id: reviewId,
        user_id: userId,
      },
    });
  }

  async addToWishlist(payload) {
    return await this.Model.WishListModel.create(payload);
  }

  async getWishListByUser(userId) {
    return await this.Model.WishListModel.findAll({
      where: {
        user_id: userId,
      },
      order: [["createdAt", "DESC"]],
    });
  }

  async getWishlistItem(userId, productId) {
    return await this.Model.WishListModel.findOne({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
  }

  async deleteWishlistItem(userId, productId) {
    return await this.Model.WishListModel.destroy({
      where: {
        user_id: userId,
        product_id: productId,
      },
    });
  }

  async getTopRatedProducts(minRating = 3, limit = 20) {
    return await this.Model.ReviewModel.findAll({
      attributes: [
        "product_id",
        [literal("AVG(CAST(rating AS DECIMAL(10,2)))"), "avgRating"],
        [literal("COUNT(review.id)"), "reviewCount"],
      ],
      group: ["product_id"],
      having: literal(`AVG(CAST(rating AS DECIMAL(10,2))) >= ${minRating}`),
      order: literal(`avgRating ASC`),
      limit: Number(limit),
      raw: true,
    });
  }
}
