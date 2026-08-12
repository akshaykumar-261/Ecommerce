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