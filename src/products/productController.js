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
}
