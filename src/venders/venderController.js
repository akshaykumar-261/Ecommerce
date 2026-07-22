import StoreService from "./venderService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import { storeMessages } from "../helper/commanMessages.js";
import { ROLE } from "../helper/roleBase.js";
import slugify from "slugify";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utility/ cloudinaryUpload.js";
export default class StoreController {
  async init(db) {
    this.services = new StoreService();
    await this.services.init(db);
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
    console.log("Store Logo Public ID:", store.store_logo_public_id);
    console.log("Store Banner Public ID:", store.store_banner_public_id);
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
      return sendResponse(res, STATUS_CODE.NOT_FOUND, "Store not found.");
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
      "Product created successfully.",
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
      return sendResponse(res, STATUS_CODE.NOT_FOUND, "Product not found.");
    }
    if (product.store_id !== store.id) {
      return sendResponse(
        res,
        STATUS_CODE.FORBIDDEN,
        "You are not allowed to update this product.",
      );
    }
    await this.services.updateProductQuantity(id, quantity);
    const updateProduct = await this.services.getProductById(id);

    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      "Product quantity updated successfully.",
      {
        product: updatedProduct,
      },
    );
  }
}
