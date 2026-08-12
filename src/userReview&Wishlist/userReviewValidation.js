import Joi from "joi";

export const addReviewValidation = Joi.object({
  product_id: Joi.number().integer().positive().required().messages({
    "any.required": "Product ID is required.",
    "number.base": "Product ID must be a number.",
    "number.integer": "Product ID must be an integer.",
    "number.positive": "Product ID must be greater than 0.",
  }),
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "any.required": "Rating is required.",
    "number.base": "Rating must be a number.",
    "number.integer": "Rating must be an integer.",
    "number.min": "Rating must be between 1 and 5.",
    "number.max": "Rating must be between 1 and 5.",
  }),
  review: Joi.string().max(1000).required().messages({
    "any.required": "Review is required.",
    "string.empty": "Review is required.",
    "string.max": "Review cannot exceed 1000 characters.",
  }),
});

export const updateReviewValidation = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    "any.required": "Rating is required.",
    "number.base": "Rating must be a number.",
    "number.integer": "Rating must be an integer.",
    "number.min": "Rating must be between 1 and 5.",
    "number.max": "Rating must be between 1 and 5.",
  }),

  review: Joi.string().max(1000).required().messages({
    "any.required": "Review is required.",
    "string.empty": "Review is required.",
    "string.max": "Review cannot exceed 1000 characters.",
  }),
});


export const productIdValidation = Joi.object({
  productId: Joi.number().integer().positive().required().messages({
    "any.required": "Product ID is required.",
    "number.base": "Product ID must be a number.",
    "number.integer": "Product ID must be an integer.",
    "number.positive": "Product ID must be greater than 0.",
  }),
});


export const reviewIdValidation = Joi.object({
  reviewId: Joi.number().integer().positive().required().messages({
    "any.required": "Review ID is required.",
    "number.base": "Review ID must be a number.",
    "number.integer": "Review ID must be an integer.",
    "number.positive": "Review ID must be greater than 0.",
  }),
});


export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    next();
  };
};

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