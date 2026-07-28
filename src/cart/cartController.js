import CartServices from "./cartService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import { cartMessage, productMessage } from "../helper/commanMessages.js";

export default class CartController {
  async init(db) {
    this.services = new CartServices();
    await this.services.init(db);
  }

  async addProdct(req, res) {
    const { product_id, quantity } = req.body;
    let cart = await this.services.getCartByUserId(req.user.id);
    if (!cart) {
      cart = await this.services.createCart(req.user.id);
    }
    const product = await this.services.getProductById(product_id);
    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    if (product.quantity < quantity) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        productMessage.OUT_OF_STOCK,
      );
    }
    const exitstingItem = await this.services.getCartItem(cart.id, product.id);
    if (exitstingItem) {
      const totalQty = exitstingItem.quantity + Number(quantity);
      await this.services.updateCartItem(exitstingItem.id, totalQty);
      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        productMessage.PRODUCT_QUANTITY,
      );
    }
    const createItem = await this.services.createCartItem({
      cart_id: cart.id,
      product_id: product.id,
      quantity,
      price: product.price * quantity,
    });
    return sendResponse(res, STATUS_CODE.CREATED, cartMessage.ADDTO_CART, {
      createItem,
    });
  }

  async getCart(req, res) {
    const cart = await this.services.getCart(req.user.id);
    console.log("=========>", cart);
    if (!cart) {
      return sendResponse(res, STATUS_CODE.NOT_FOUND, cartMessage.NOT_FOUND);
    }
    return sendResponse(res, STATUS_CODE.SUCCESS, cartMessage.CART_FETCHED, {
      cart,
    });
  }

  async updateCartItemQuantity(req, res) {
    const { cartItemId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, cartMessage.QUANTITY);
    }
    const cartItem = await this.services.getCartItemById(cartItemId);

    if (!cartItem) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        cartMessage.CART_ITEM_NOT_FOUND,
      );
    }
    // Product Check
    const product = await this.services.getProductById(cartItem.product_id);

    if (!product) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        productMessage.PRODUCT_NOT_FOUND,
      );
    }
    // Stock Check
    if (quantity > product.quantity) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        productMessage.OUT_OF_STOCK,
      );
    }
    const totalPrice = Number(product.price) * quantity;
    // Update
    await this.services.updateCartItem(cartItem.id, quantity, totalPrice);
    const updatedItem = await this.services.getCartItemById(cartItem.id);
    return sendResponse(res, STATUS_CODE.SUCCESS, cartMessage.CART_UPDATED, {
      cartItem: updatedItem,
    });
  }

  async getCartCount(req, res) {
    const cart = await this.services.getCartByUserId(req.user.id);
    if (!cart) {
      return sendResponse(res, STATUS_CODE.SUCCESS, cartMessage.CART_COUNT);
    }
    const count = await this.services.getCartCount(cart.id);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      cartMessage.CART_COUNT_FETCH,
      {
        count,
      },
    );
  }

  async removeCartItem(req, res) {
    const { product_id } = req.params;
    const cart = await this.services.getCartByUserId(req.user.id);
    if (!cart) {
      return sendResponse(res, STATUS_CODE.NOT_FOUND, cartMessage.CART_EMPTY);
    }
    const cartItem = await this.services.getCartItem(cart.id, product_id);
    if (!cartItem) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        cartMessage.CART_ITEM_NOT_FOUND,
      );
    }
    await this.services.deleteCartItem(cartItem.id);
    return sendResponse(res, STATUS_CODE.SUCCESS, cartMessage.REMOVE_FROM_CART);
  }

  

  // async updateCartQuantity(req, res) {
  //   const { cartItemId } = req.params;
  //   const { action } = req.body; // increment | decrement

  //   // Cart Item Check
  //   const cartItem = await this.services.getCartItemById(cartItemId);

  //   if (!cartItem) {
  //     return sendResponse(
  //       res,
  //       STATUS_CODE.NOT_FOUND,
  //       cartMessage.CART_ITEM_NOT_FOUND,
  //     );
  //   }

  //   // Product Check
  //   const product = await this.services.getProductById(cartItem.product_id);

  //   if (!product) {
  //     return sendResponse(
  //       res,
  //       STATUS_CODE.NOT_FOUND,
  //       productMessage.PRODUCT_NOT_FOUND,
  //     );
  //   }

  //   let quantity = cartItem.quantity;

  //   // Increase
  //   if (action === "increment") {
  //     if (quantity >= product.quantity) {
  //       return sendResponse(
  //         res,
  //         STATUS_CODE.BAD_REQUEST,
  //         productMessage.OUT_OF_STOCK,
  //       );
  //     }

  //     quantity++;
  //   }

  //   // Decrease
  //   else if (action === "decrement") {
  //     quantity--;

  //     if (quantity <= 0) {
  //       await this.services.deleteCartItem(cartItem.id);

  //       return sendResponse(
  //         res,
  //         STATUS_CODE.SUCCESS,
  //         cartMessage.REMOVE_FROM_CART,
  //       );
  //     }
  //   }

  //   const totalPrice = quantity * product.price;

  //   await this.services.updateCartItem(cartItem.id, quantity, totalPrice);

  //   const updatedItem = await this.services.getCartItemById(cartItem.id);

  //   return sendResponse(res, STATUS_CODE.SUCCESS, cartMessage.CART_UPDATED, {
  //     cartItem: updatedItem,
  //   });
  // }
}
