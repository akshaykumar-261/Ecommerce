import Joi from "joi";

export const addAddressValidation = Joi.object({
  name: Joi.string().max(20).allow("", null),

  phone_no: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required.",
      "string.pattern.base": "Phone number must be between 10 and 15 digits.",
    }),

  house_no: Joi.string().max(100).required().messages({
    "string.empty": "House number is required.",
  }),

  road_area_colony: Joi.string().max(255).required().messages({
    "string.empty": "Road/Area/Colony is required.",
  }),

  city: Joi.string().max(200).required().messages({
    "string.empty": "City is required.",
  }),

  zipcode: Joi.string().max(40).required().messages({
    "string.empty": "Zipcode is required.",
  }),

  landmark: Joi.string().max(200).allow("", null),

  state: Joi.string().max(200).required().messages({
    "string.empty": "State is required.",
  }),

  country: Joi.string().max(200).required().messages({
    "string.empty": "Country is required.",
  }),
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
