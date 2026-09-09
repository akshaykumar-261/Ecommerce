import { z } from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(20, "Password must not exceed 20 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
      "Password must contain 8 characters(1 uppercase, lowercase, number, and special character).",
    ),
});

export const registerSchema = z
  .object({
    // FIRST NAME
    name: z
      .string()
      .min(4, "First Name must be at least 4 characters")
      .max(50, "First Name must not exceed 50 characters"),

    // LAST NAME
    lastname: z
      .string()
      .min(1, "Last Name is required")
      .min(4, "Last Name must be at least 4 characters")
      .max(50, "Last Name must not exceed 50 characters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    // MOBILE NUMBER
    phoneNo: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),

    // ADDRESS
    address: z.string().min(1, "Address is required"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must not exceed 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must contain 8 characters(1 uppercase, lowercase, number, and special character).",
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(20, "Password must not exceed 20 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
        "Password must contain 1 uppercase, lowercase, number, and special character.",
      ),

    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });