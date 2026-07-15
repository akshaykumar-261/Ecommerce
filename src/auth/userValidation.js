import Joi from "joi";
export const createUserSchema = Joi.object({
  name: Joi.string().min(4).max(100).required().messages({
    "string.min": "Name must be at least 4 characters long",
    "string.max": "Name must not exceed 100 characters",
    "any.required": "Name is required",
    "string.empty": "Name cannot be empty",
  }),
  lastname: Joi.string().min(4).max(100).required().messages({
    "string.min": "lastname must be at least 4 characters long",
    "string.max": "lastname must not exceed 100 characters",
    "any.required": "lastname is required",
    "string.empty": "lastname cannot be empty",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "any.required": "Email is required",
    "string.empty": "Email cannot be empty",
  }),
  phoneNo: Joi.string().min(10).max(15).required().messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
    "any.required": "Phone number is required",
    "string.empty": "Phone number cannot be empty",
  }),
  address: Joi.string().max(200).required().messages({
    "string.max": "Address must not exceed 200 characters",
    "any.required": "Address is required",
    "string.empty": "Address cannot be empty",
  }),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,20}$",
      ),
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 20 characters",
      "any.required": "Password is required",
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Password must contain 8 characters(1 uppercase, lowercase, number, and special character).",
    }),
  role_Id: Joi.number().valid(3).default(3),
  department: Joi.forbidden(),
  avtar: Joi.any().optional(),
});

export const verifyUserSchema = Joi.object({
  // email: Joi.string().email().required().messages({
  //   "string.email": "Please enter a valid email address",
  //   "string.empty": "Email cannot be empty",
  //   "any.required": "Email is required",
  // }),

  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required()
    .messages({
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "string.empty": "OTP cannot be empty",
      "any.required": "OTP is required",
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
