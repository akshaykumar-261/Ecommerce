import Joi from "joi";
export const addToCartSchema = Joi.object({
  product_id: Joi.number().integer().positive().required().messages({
    "number.base": "Product ID must be a number",
    "number.integer": "Product ID must be an integer",
    "number.positive": "Product ID must be greater than 0",
    "any.required": "Product ID is required",
  }),

  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.positive": "Quantity must be greater than 0",
    "any.required": "Quantity is required",
  }),
});

export const updateCartItemQuantitySchema = Joi.object({
  quantity: Joi.number().integer().positive().required().messages({
    "number.base": "Quantity must be a number",
    "number.integer": "Quantity must be an integer",
    "number.positive": "Quantity must be greater than 0",
    "any.required": "Quantity is required",
  }),
});

// // Cart Item ID Params
// export const cartItemIdSchema = Joi.object({
//   cartItemId: Joi.number().integer().positive().required().messages({
//     "number.base": "Cart item ID must be a number",
//     "number.integer": "Cart item ID must be an integer",
//     "number.positive": "Cart item ID must be greater than 0",
//     "any.required": "Cart item ID is required",
//   }),
// });

// // Product ID Params
// export const productIdSchema = Joi.object({
//   product_id: Joi.number().integer().positive().required().messages({
//     "number.base": "Product ID must be a number",
//     "number.integer": "Product ID must be an integer",
//     "number.positive": "Product ID must be greater than 0",
//     "any.required": "Product ID is required",
//   }),
// });

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
