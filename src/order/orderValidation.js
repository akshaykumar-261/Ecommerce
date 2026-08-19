import Joi from "joi";
// place order api
export const placeOrderSchema = Joi.object({
  address_id: Joi.number().integer().positive().required().messages({
    "number.base": "Address ID must be a number",
    "number.integer": "Address ID must be an integer",
    "number.positive": "Address ID must be greater than 0",
    "any.required": "Address ID is required",
  }),
});

// Confirm Payment
export const confirmPaymentSchema = Joi.object({
  paymentIntentId: Joi.string().trim().required().messages({
    "string.empty": "Payment Intent ID cannot be empty",
    "any.required": "Payment Intent ID is required",
  }),
});

// Order ID Params
export const orderIdSchema = Joi.object({
  orderId: Joi.number().integer().positive().required().messages({
    "number.base": "Order ID must be a number",
    "number.integer": "Order ID must be an integer",
    "number.positive": "Order ID must be greater than 0",
    "any.required": "Order ID is required",
  }),
});

// Update Order Status
export const updateOrderStatusSchema = Joi.object({
  order_status: Joi.string()
    .valid(
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    )
    .required()
    .messages({
      "any.only": "Invalid order status",
      "string.empty": "Order status cannot be empty",
      "any.required": "Order status is required",
    }),
});

export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.params);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    next();
  };
};
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
