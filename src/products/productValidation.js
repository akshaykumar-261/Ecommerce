import Joi from "joi";

export const categoryIdParamValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Category ID is required.",
      "number.base": "Category ID must be a number.",
      "number.integer": "Category ID must be an integer.",
      "number.positive": "Category ID must be greater than 0.",
    }),
});

export const productIdParamValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Product ID is required.",
      "number.base": "Product ID must be a number.",
      "number.integer": "Product ID must be an integer.",
      "number.positive": "Product ID must be greater than 0.",
    }),
});

export const productsByCategoryQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow("").max(100).default(""),
});

export const allProductsQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow("").max(100).default(""),
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

export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      stripUnknown: true,
      convert: true,
    });
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    for (const key of Object.keys(req.query)) {
      if (!(key in value)) delete req.query[key];
    }
    Object.assign(req.query, value);
    next();
  };
};
