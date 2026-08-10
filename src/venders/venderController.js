import StoreService from "./venderService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import { ORDER_STATUS } from "../helper/constants.js";
import {
  storeMessages,
  productMessage,
  userMessage,
  orderMessages
} from "../helper/commanMessages.js";
import { ROLE } from "../helper/roleBase.js";
import slugify from "slugify";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utility/ cloudinaryUpload.js";
import * as commanFunction from "../helper/commonFunction.js";
import stripe from "../../config/stripe.js";
import { emailQueue } from "../../utility/queue/emailQueue.js";
import { v4 as uuidv4 } from "uuid";
export default class StoreController {
  async init(db) {
    this.services = new StoreService();
    await this.services.init(db);
  }
  async userVendor(req, res) {
    const { email } = req.body;
    const existingUser = await this.services.getByEmail(email);
    if (existingUser) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.USER_EXIST);
    }
    let avatar = null;
    if (req.files && req.files.length > 0) {
      const result = await uploadToCloudinary(req.files[0], "users/avatar");
      avatar = result.secure_url;
    }
    const otp = commanFunction.generateOtp(6);
    const user = await this.services.createUser({
      ...req.body,
      avtar: avatar,
      role_Id: ROLE.VENDER,
      otp,
      is_verified: false,
      otp_expire: new Date(Date.now() + 10 * 60 * 1000),
    });
    const stripeAccount = await stripe.accounts.create({
      country: "AU",
      email: user.email,
      controller: {
        fees: {
          payer: "application",
        },
        losses: {
          payments: "application",
        },
        stripe_dashboard: {
          type: "express",
        },
      },
    });
    await this.services.updateUser(user.id, {
      stripe_account_id: stripeAccount.id,
    });
    const sessionId = uuidv4();
    const accessToken = commanFunction.generateAccessToken(user, sessionId);
    const refreshToken = commanFunction.generateRefreshToken(user, sessionId);
    await this.services.createSession(user.id, sessionId);
    await emailQueue.add("registration", {
      email: user.email,
      otp,
      name: user.name,
    });
    return sendResponse(res, STATUS_CODE.CREATED, userMessage.USER_CREATED, {
      user,
      stripeAccount,
      accessToken,
      refreshToken,
    });
  }

  async createOnboardingLink(req, res) {
    const user = await this.services.getUserById(req.user.id);
    if (!user.stripe_account_id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.STRIPE_ACCOUNT_NOT_FOUND,
      );
    }
    const accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: "https://example.com/reauth",
      return_url: `http://localhost:8089/venders/stripeAccountDetails?userId=${user.id}`,
      type: "account_onboarding",
    });
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.STRIPE_ACCOUNT_CONNECTED,
      {
        url: accountLink.url,
      },
    );
  }

  async getStripeAccountStatus(req, res) {
    const { userId } = req.query;
    if (!userId) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, "User id is required");
    }
    const user = await this.services.getUserById(userId);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.USER_NOT_FOUND,
      );
    }
    if (!user.stripe_account_id) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.STRIPE_ACCOUNT_NOT_FOUND,
      );
    }
    const account = await stripe.accounts.retrieve(user.stripe_account_id);
    if (
      account.details_submitted &&
      account.charges_enabled &&
      account.payouts_enabled
    ) {
      await this.services.updateUser(user.id, {
        is_account_enabled: true,
      });
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.STRIPE_ACCOUNT_FETCHED,
      {
        stripe_account_id: account.id,
        details_submitted: account.details_submitted,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        requirements: account.requirements,
      },
    );
  }

  async createStore(req, res) {
    const payload = { ...req.body };
    payload.user_id = req.user.id;
    let slug = slugify(payload.store_name, {
      lower: true,
      strict: true,
      trim: true,
    });
    const existingSlug = await this.services.getBySlug(slug);
    if (existingSlug) {
      slug = `${slug}-${Date.now()}`;
    }
    payload.slug = slug;
    // Upload Store Logo
    if (req.files?.store_logo?.length > 0) {
      const logo = await uploadToCloudinary(
        req.files.store_logo[0],
        "store/logo",
      );
      payload.store_logo = logo.secure_url;
    }
    if (req.files?.store_banner?.length > 0) {
      const banner = await uploadToCloudinary(
        req.files.store_banner[0],
        "store/banner",
      );
      payload.store_banner = banner.secure_url;
    }
    const store = await this.services.createStore(payload);
    return sendResponse(res, STATUS_CODE.CREATED, storeMessages.STORE_CREATED, {
      store,
    });
  }

  async updateStore(req, res) {
    const payload = { ...req.body };
    const userId = req.user.id;
    const store = await this.services.getStoreByUserId(userId);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    if (payload.store_name && payload.store_name !== store.store_name) {
      let slug = slugify(payload.store_name, {
        lower: true,
        strict: true,
        trim: true,
      });
      const existingSlug = await this.services.getBySlug(slug);
      if (existingSlug && existingSlug.id !== store.id) {
        slug = `${slug}-${Date.now()}`;
      }
      payload.slug = slug;
    }
    if (req.files?.store_logo?.length > 0) {
      if (store.store_logo_public_id) {
        await deleteFromCloudinary(store.store_logo_public_id);
      }
      const logo = await uploadToCloudinary(
        req.files.store_logo[0],
        "store/logo",
      );
      payload.store_logo = logo.secure_url;
      payload.store_logo_public_id = logo.public_id;
    }
    if (req.files?.store_banner?.length > 0) {
      if (store.store_banner_public_id) {
        await deleteFromCloudinary(store.store_banner_public_id);
      }
      const banner = await uploadToCloudinary(
        req.files.store_banner[0],
        "store/banner",
      );
      payload.store_banner = banner.secure_url;
      payload.store_banner_public_id = banner.public_id;
    }
    await this.services.updateStore(store.id, payload);
    const updateStore = await this.services.getStoreByUserId(userId);
    return sendResponse(res, STATUS_CODE.SUCCESS, storeMessages.STORE_UPDATED, {
      updateStore,
    });
  }

  async deleteStore(req, res) {
    const userId = req.user.id;
    const store = await this.services.getStoreByUserId(userId);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    if (store.store_logo_public_id) {
      await deleteFromCloudinary(store.store_logo_public_id);
    }
    if (store.store_banner_public_id) {
      await deleteFromCloudinary(store.store_banner_public_id);
    }
    await this.services.deleteStore(store.id);
    return sendResponse(res, STATUS_CODE.SUCCESS, storeMessages.STORE_DELETED);
  }

  async getStore(req, res) {
    const userId = req.user.id;
    const store = await this.services.getStoreByUserId(userId);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, storeMessages.STORE_FETCHED, {
      store,
    });
  }

  async addProduct(req, res) {
    const payload = {
      ...req.body,
    };
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    payload.store_id = store.id;
    const mediaData = [];
    // Images
    if (req.files?.product_images?.length > 0) {
      for (const file of req.files.product_images) {
        const result = await uploadToCloudinary(file, "products/images");

        mediaData.push({
          media_type: "images",
          media_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    // Videos
    if (req.files?.product_videos?.length > 0) {
      for (const file of req.files.product_videos) {
        const result = await uploadToCloudinary(file, "products/videos");

        mediaData.push({
          media_type: "video",
          media_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    const product = await this.services.createProduct(payload, mediaData);
    return sendResponse(
      res,
      STATUS_CODE.CREATED,
      productMessage.PRODUCT_CREATED,
      {
        product,
      },
    );
  }

  async updateProductQuantity(req, res) {
    const { id } = req.params;
    const { quantity } = req.body;
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const product = await this.services.getProductById(id);
    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    if (product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    await this.services.updateProductQuantity(id, quantity);
    const updateProduct = await this.services.getProductById(id);

    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_QUANTITY,
      {
        product: updateProduct,
      },
    );
  }

  async addProductMedia(req, res) {
    const { id } = req.params;
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const product = await this.services.getProductById(id);
    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    if (product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    const mediaData = [];
    // images
    if (req.files?.product_images?.length > 0) {
      for (const file of req.files.product_images) {
        const result = await uploadToCloudinary(file, "products/images");
        mediaData.push({
          product_id: product.id,
          media_type: "images",
          media_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    // videos
    if (req.files?.product_videos?.length > 0) {
      for (const file of req.files.product_videos) {
        const result = await uploadToCloudinary(file, "products/videos");
        mediaData.push({
          product_id: product.id,
          media_type: "video",
          media_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }
    await this.services.addProductMedia(mediaData);
    return sendResponse(res, STATUS_CODE.SUCCESS, productMessage.MEDIA_UPLOAD);
  }

  async deleteProductMedia(req, res) {
    const { mediaId } = req.params;
    console.log("Params:", req.params);
    const media = await this.services.getMediaById(mediaId);
    console.log("===>", media);
    if (!media) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.MEDIA_NOT_FOUND,
      );
    }
    const product = await this.services.getProductById(media.product_id);
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store || product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    await deleteFromCloudinary(media.public_id);
    await this.services.deleteMedia(mediaId);
    return sendResponse(res, STATUS_CODE.SUCCESS, productMessage.MEDIA_DELETED);
  }

  async updateProduct(req, res) {
    const { id } = req.params;
    const payload = {
      ...req.body,
    };
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const product = await this.services.getProductById(id);
    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    if (product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    await this.services.updateProduct(id, payload);
    const updateProduct = await this.services.getProductById(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_UPDATED,
      {
        product: updateProduct,
      },
    );
  }

  async getAllProducts(req, res) {
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const { page, limit, offset } = commanFunction.pagignation(
      req.query.page,
      req.query.limit,
    );

    const result = await this.services.getAllProducts(store.id, {
      search: req.query.search,
      limit,
      offset,
    });
    const response = commanFunction.pagignation(page, limit, result);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_FETCHED,
      response,
    );
  }

  async changeProductStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const product = await this.services.getProductById(id);

    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    if (product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    await this.services.changeProductStatus(id, status);
    const updatedProduct = await this.services.getProductById(id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_UPDATED,
      {
        product: updatedProduct,
      },
    );
  }

  async getOutOfStockProducts(req, res) {
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const { page, limit, offset } = commanFunction.pagignation(
      req.query.page,
      req.query.limit,
    );
    const result = await this.services.getOutOfStockProducts(store.id, {
      search: req.query.search,
      limit,
      offset,
    });
    const response = commanFunction.pagignation(page, limit, result);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_FETCHED,
      response,
    );
  }

  async setPrimaryImages(req, res) {
    const { mediaId } = req.params;
    const media = await this.services.getMediaById(mediaId);
    if (!media) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.MEDIA_NOT_FOUND,
      );
    }
    if (media.media_type !== "images") {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        productMessage.ONLY_PRODUCT_IMAGE,
      );
    }
    const product = await this.services.getProductById(media.product_id);
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store || product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    await this.services.removePrimaryImage(product.id);
    await this.services.setPrimaryImage(mediaId);
    return sendResponse(res, STATUS_CODE.SUCCESS, productMessage.PRIMARY_IMAGE);
  }

  async venderDashboard(req, res) {
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const dashboard = await this.services.venderDashboard(store.id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.DASHBOARD_FETECH,
      { dashboard },
    );
  }

  async getProductWithId(req, res) {
    const { id } = req.params;
    const store = await this.services.getStoreByUserId(id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const product = await this.services.getProduct(id);
    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    if (product.store_id !== store.id) {
      return sendResponse(res, STATUS_CODE.FORBIDDEN, productMessage.NOT_ALLOW);
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_FETCHED,
      { product },
    );
  }

  async getAllUserProduct(req, res) {
    const { page, limit, offset } = commanFunction.pagignation(
      req.query.page,
      req.query.limit,
    );
    const result = await this.services.getAllUserProducts({
      search: req.query.search,
      limit,
      offset,
    });
    const response = commanFunction.pagignation(page, limit, result);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.PRODUCT_FETCHED,
      response,
    );
  }

  async getVendorOrders(req, res) {
    const { page = 1, limit = 10, status, search = "" } = req.query;
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const {
      page: currentPage,
      limit: currentLimit,
      offset,
    } = commanFunction.pagignation(page, limit);
    const result = await this.services.getVendorOrders(store.id, {
      status,
      search,
      limit: currentLimit,
      offset,
    });
    if (result.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_ORDER_NOT_FOUND,
      );
    }
    const response = commanFunction.pagignation(
      currentPage,
      currentLimit,
      result,
    );
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      userMessage.VENDER_ORDER_FETCH,
      response,
    );
  }

  async getVendorPayouts(req, res) {
    const { status } = req.query;
    // Logged-in vendor ki store find karo
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const payouts = await this.services.getVendorPayouts(store.id, {
      status,
    });

    if (!payouts || payouts.length === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.PAYOUT_NOT_FOUND,
      );
    }

    return sendResponse(res, STATUS_CODE.SUCCESS, userMessage.PAYOUT_FETCH, {
      payouts,
    });
  }

  async getLowStockProducts(req, res) {
    const store = await this.services.getStoreByUserId(req.user.id);
    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const { page, limit, offset } = commanFunction.pagignation(
      req.query.page,
      req.query.limit,
    );
    const result = await this.services.getLowStockProducts(store.id, {
      search: req.query.search,
      limit,
      offset,
    });
    if (result.count === 0) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.NO_LOW_STOCK,
      );
    }
    const response = commanFunction.pagignation(page, limit, result);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      productMessage.LOW_STOCK_FETCH,
      response,
    );
  }

  async updateOrderStatus(req, res) {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatus = [
      ORDER_STATUS.PENDING,
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PACKED,
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.DELIVERED,
      ORDER_STATUS.CANCELLED,
    ];
    if (!status) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        orderMessages.ORDER_STATUS
      );
    }
    if (!allowedStatus.includes(status)) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        `Invalid order status. Allowed statuses: ${allowedStatuses.join(", ")}`,
      );
    }
    const store = await this.services.getStoreByUserId(req.user.id);

    if (!store) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        storeMessages.STORE_NOT_FOUND,
      );
    }
    const order = await this.services.getVendorOrderById(orderId, store.id);

    if (!order) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        userMessage.VENDER_ORDER_NOT_FOUND,
      );
    }
    if (
      order.order_status === ORDER_STATUS.DELIVERED ||
      order.order_status === ORDER_STATUS.CANCELLED
    ) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        `Order is already ${order.order_status} and cannot be updated`,
      );
    }
    await this.services.updateOrderStatus(orderId, status);

    // Get updated order
    const updatedOrder = await this.services.getOrderById(orderId);

    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      orderMessages.STATUS_UPDATE,
      {
        order: updatedOrder,
      },
    );
  }
}
