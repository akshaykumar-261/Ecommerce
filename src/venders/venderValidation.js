import Joi from "joi";
export const createStoreSchema = Joi.object({
  store_name: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Store name is required.",
    "string.min": "Store name must be at least 3 characters.",
    "string.max": "Store name cannot exceed 200 characters.",
    "any.required": "Store name is required.",
  }),

  description: Joi.string().allow("", null).messages({
    "string.base": "Description must be a string.",
  }),

  email: Joi.string().email().required().messages({
    "string.empty": "Email is required.",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),

  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Phone number must be exactly 10 digits.",
      "any.required": "Phone number is required.",
    }),

  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required.",
    "any.required": "Address is required.",
  }),

  city: Joi.string().trim().required().messages({
    "string.empty": "City is required.",
    "any.required": "City is required.",
  }),

  state: Joi.string().trim().required().messages({
    "string.empty": "State is required.",
    "any.required": "State is required.",
  }),

  country: Joi.string().trim().required().messages({
    "string.empty": "Country is required.",
    "any.required": "Country is required.",
  }),

  zipcode: Joi.string().trim().required().messages({
    "string.empty": "Zipcode is required.",
    "any.required": "Zipcode is required.",
  }),
});

export const updateStoreSchema = Joi.object({
  store_name: Joi.string().trim().min(3).max(200).messages({
    "string.min": "Store name must be at least 3 characters.",
    "string.max": "Store name cannot exceed 200 characters.",
  }),
  description: Joi.string().allow("", null),
  email: Joi.string().email().messages({
    "string.email": "Please enter a valid email address.",
  }),
  phoneNo: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      "string.pattern.base": "Phone number must be exactly 10 digits.",
    }),
  address: Joi.string(),
  city: Joi.string(),
  state: Joi.string(),
  country: Joi.string(),
  zipcode: Joi.string(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required to update.",
  });
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    next();
  };
};
