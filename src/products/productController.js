import ProductServices from "./productService.js";
import {  categoryMessages } from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../helper/commonFunction.js";

export default class productController {
  async init(db) {
    this.service = new ProductServices();
    this.Models = db.models;
    await this.service.init(db);
  }
  async getProductsByCategoryId(req, res) {
    const { id } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;
    const category = await this.service.getCategoryById(id);
    if (!category) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        categoryMessages.CATEGORY_NOT_FOUND
      );
    }
    const products = await this.service.getProductsByCategoryId(
      id,
      page,
      limit,
      search
    );
    if (products.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Products not found for this category."
      );
    }
    const paginationData = commanFunction.pagignation(page, limit, products);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Category products fetched successfully.",
      {
        category,
        products: paginationData,
      }
    );
  }

  async getAllProducts(req, res) {
    const { page = 1, limit = 10, search = "" } = req.query;
    const products = await this.service.getAllProducts(page, limit, search);
    const paginationData = commanFunction.pagignation(page, limit, products);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Products fetched successfully.",
      { products: paginationData }
    );
  }

  async getProductById(req, res) {
    const { id } = req.params;
    const product = await this.service.getProductById(id);
    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        "Product not found."
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Product fetched successfully.",
      { product }
    );
  }

  async searchProducts(req, res) {
    const { q = "", page = 1, limit = 12 } = req.query;
    if (!q.trim()) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        "Search query is required."
      );
    }
    const products = await this.service.searchProducts(q, page, limit);
    const paginationData = commanFunction.pagignation(page, limit, products);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Products searched successfully.",
      { products: paginationData }
    );
  }

  async searchSuggestions(req, res) {
    const { q = "", limit = 8 } = req.query;
    if (!q.trim()) {
      return sendResponse(res, STATUS_CODE.SUCCESS, "Suggestions fetched.", {
        suggestions: [],
      });
    }
    const suggestions = await this.service.searchSuggestions(q, limit);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Suggestions fetched successfully.",
      { suggestions }
    );
  }
}
