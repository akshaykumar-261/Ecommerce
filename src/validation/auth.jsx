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
    name: z.string().min(4, "Name must be at least 4 characters"),
    // FIRST NAME
    firstName: z
      .string()
      .min(1, "First Name is required")
      .min(4, "First Name must be at least 4 characters")
      .max(50, "First Name must not exceed 50 characters")
      .regex(/^[A-Za-z\s]+$/, "First Name can contain only letters"),

    // LAST NAME
    lastName: z
      .string()
      .min(1, "Last Name is required")
      .min(4, "Last Name must be at least 4 characters")
      .max(50, "Last Name must not exceed 50 characters")
      .regex(/^[A-Za-z\s]+$/, "Last Name can contain only letters"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email"),

    // MOBILE NUMBER
    phone: z
      .string()
      .min(1, "Mobile number is required")
      .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number"),

    // ADDRESS
    address: z
      .string()
      .min(1, "Address is required")
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address must not exceed 200 characters"),
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
