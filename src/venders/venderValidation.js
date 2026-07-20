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
  role_Id: Joi.number().valid(2).default(2),
  department: Joi.forbidden(),
  avtar: Joi.any().optional(),
});

export const verifyUserSchema = Joi.object({
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

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
});

export const verifyForgotOtpSchema = Joi.object({
  otp: Joi.string()
    .length(6)
    .pattern(/^[0-9]{6}$/)
    .required()
    .messages({
      "string.length": "OTP must be 6 digits",
      "string.pattern.base": "OTP must contain only numbers",
      "string.empty": "OTP cannot be empty",
      "any.required": "OTP is required",
    }),
});

export const resetPasswordSchema = Joi.object({
  newPassword: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    )
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 20 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number and special character.",
      "string.empty": "Password cannot be empty",
      "any.required": "New password is required",
    }),
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(4).max(100).messages({
    "string.min": "Name must be at least 4 characters long",
    "string.max": "Name must not exceed 100 characters",
    "string.empty": "Name cannot be empty",
  }),
  lastname: Joi.string().min(4).max(100).messages({
    "string.min": "Lastname must be at least 4 characters long",
    "string.max": "Lastname must not exceed 100 characters",
    "string.empty": "Lastname cannot be empty",
  }),
  email: Joi.string().email().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email cannot be empty",
  }),
  phoneNo: Joi.string().min(10).max(15).messages({
    "string.min": "Phone number must be at least 10 digits",
    "string.max": "Phone number must not exceed 15 digits",
    "string.empty": "Phone number cannot be empty",
  }),
  address: Joi.string().max(200).messages({
    "string.max": "Address must not exceed 200 characters",
    "string.empty": "Address cannot be empty",
  }),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
    )
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password must not exceed 20 characters",
      "string.empty": "Password cannot be empty",
      "string.pattern.base":
        "Password must contain at least one uppercase, one lowercase, one number, and one special character.",
    }),

  avtar: Joi.any().optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field is required for update",
  });

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email cannot be empty",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(8).max(20).required().messages({
    "string.min": "Password must be at least 8 characters long",
    "string.max": "Password must not exceed 20 characters",
    "string.empty": "Password cannot be empty",
    "any.required": "Password is required",
  }),
  device_token: Joi.string().required().messages({
    "string.empty": "Device token cannot be empty",
    "any.required": "Device token is required",
  }),
  device_type: Joi.string().valid("1","2","3").required().messages({
    "any.only": "Device type must be android, ios or web",
    "string.empty": "Device type cannot be empty",
    "any.required": "Device type is required",
  }),
  device_id: Joi.string().required().messages({
    "string.empty": "Device ID cannot be empty",
    "any.required": "Device ID is required",
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
