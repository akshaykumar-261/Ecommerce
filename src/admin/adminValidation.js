import Joi from "joi";

export const venderActionValidation = Joi.object({
  action: Joi.string()
    .valid("approve", "reject", "block", "unblock", "delete")
    .required()
    .messages({
      "any.required": "Action is required.",
      "string.empty": "Action is required.",
      "any.only":
        "Action must be one of approve, reject, block, unblock, or delete.",
    }),
});

export const venderIdValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "Vendor ID is required.",
      "number.base": "Vendor ID must be a number.",
      "number.integer": "Vendor ID must be an integer.",
      "number.positive": "Vendor ID must be greater than 0.",
    }),
});

export const productIdValidation = Joi.object({
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

export const adminUserIdValidation = Joi.object({
  id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "any.required": "User ID is required.",
      "number.base": "User ID must be a number.",
      "number.integer": "User ID must be an integer.",
      "number.positive": "User ID must be greater than 0.",
    }),
});

export const productStatusValidation = Joi.object({
  status: Joi.number()
    .integer()
    .valid(0, 1)
    .required()
    .messages({
      "any.required": "status is required.",
      "any.only": "status must be 0 or 1.",
      "number.base": "status must be 0 or 1.",
    }),
});

export const userStatusValidation = Joi.object({
  is_active: Joi.boolean()
    .required()
    .messages({
      "any.required": "is_active is required.",
      "boolean.base": "is_active must be a boolean.",
    }),
});

export const dashboardValidation = Joi.object({}).unknown(false);

export const adminProductsQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).max(10000).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow("").max(100).default(""),
  category_id: Joi.number().integer().positive(),
  vendor_id: Joi.number().integer().positive(),
  status: Joi.alternatives()
    .try(
      Joi.number().integer().valid(0, 1),
      Joi.string().valid("0", "1"),
    )
    .optional(),
});

export const updateAdminConfigurationValidation = Joi.object({
  commission_percentage: Joi.number()
    .min(0)
    .max(100)
    .required()
    .messages({
      "any.required": "Commission percentage is required.",
      "number.base": "Commission percentage must be a valid number.",
      "number.min": "Commission percentage cannot be less than 0.",
      "number.max": "Commission percentage cannot be greater than 100.",
    }),
});

export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body ?? {});
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
    // Express 5 exposes req.query as a getter-only property, so the sanitized
    // result must be merged key-by-key instead of reassigned.
    for (const key of Object.keys(req.query)) {
      if (!(key in value)) delete req.query[key];
    }
    Object.assign(req.query, value);
    next();
  };
};