import Joi from "joi";

export const contactMessageValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name is required.",
    "string.min": "Name must be at least 2 characters long.",
    "string.max": "Name cannot exceed 100 characters.",
  }),
  email: Joi.string()
    .trim()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      "any.required": "Email is required.",
      "string.empty": "Email is required.",
      "string.email": "Please enter a valid email address.",
    }),
  subject: Joi.string().trim().max(255).allow("").default("").messages({
    "string.max": "Subject cannot exceed 255 characters.",
  }),
  message: Joi.string().trim().min(10).max(5000).required().messages({
    "any.required": "Message is required.",
    "string.empty": "Message is required.",
    "string.min": "Message must be at least 10 characters long.",
    "string.max": "Message cannot exceed 5000 characters.",
  }),
});

export const contactReplyValidation = Joi.object({
  reply: Joi.string().trim().min(2).max(5000).required().messages({
    "any.required": "Reply is required.",
    "string.empty": "Reply is required.",
    "string.min": "Reply must be at least 2 characters long.",
    "string.max": "Reply cannot exceed 5000 characters.",
  }),
});

export const contactStatusValidation = Joi.object({
  status: Joi.string()
    .valid("PENDING", "REPLIED", "CLOSED")
    .required()
    .messages({
      "any.required": "Status is required.",
      "any.only": "Status must be one of PENDING, REPLIED or CLOSED.",
    }),
});

export const contactIdValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "any.required": "Message ID is required.",
    "number.base": "Message ID must be a number.",
    "number.integer": "Message ID must be an integer.",
    "number.positive": "Message ID must be greater than 0.",
  }),
});

export const contactListQueryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow("").default(""),
  status: Joi.string().valid("PENDING", "REPLIED", "CLOSED").allow("").default(""),
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
    for (const key of Object.keys(value)) {
      req.query[key] = value[key];
    }
    next();
  };
};
