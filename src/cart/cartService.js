export default class CartServices {
  async init(db) {
    this.Model = db.models;
  }

  async getCartByUserId(userId) {
    return await this.Model.Cart.findOne({
      where: {
        user_id: userId,
      },
    });
  }

  async createCart(userId) {
    return await this.Model.Cart.create({
      user_id: userId,
    });
  }

  async getProductById(id) {
    return await this.Model.Product.findByPk(id);
  }

  async getCartItem(cartId, productId) {
    return await this.Model.CartItem.findOne({
      where: {
        cart_id: cartId,
        product_id: productId,
      },
    });
  }

  async createCartItem(payload) {
    return await this.Model.CartItem.create(payload);
  }

  async updateCartItem(id, quantity) {
    return await this.Model.CartItem.update(
      {
        quantity,
      },
      {
        where: {
          id,
        },
      },
    );
  }

  async getCart(userId) {
    return await this.Model.Cart.findOne({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: this.Model.CartItem,
          include: [
            {
              model: this.Model.Product,
              include: [
                {
                  model: this.Model.ProductMediaModel,
                  where: {
                    is_primary: true,
                  },
                },
              ],
            },
          ],
        },
      ],
    });
  }

  async getCartItemById(id) {
    return await this.Model.CartItem.findByPk(id);
  }

  async updateCartItem(id, quantity, price) {
    return await this.Model.CartItem.update(
      {
        quantity,
        price,
      },
      { 
        where: {
          id,
        },
      },
    );
  }

  async deleteCartItem(id) {
    return await this.Model.CartItem.destroy({
      where: {
        id,
      },
    });
  }

  async getCartCount(cartId) {
    return await this.Model.CartItem.count({
      where: {
        cart_id: cartId,
      },
    });
  }
}
