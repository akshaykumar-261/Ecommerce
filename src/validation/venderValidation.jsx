import { z } from "zod";
export const businessDetailsSchema = z.object({
  store_name: z
    .string()
    .trim()
    .min(2, "Store name must be at least 2 characters")
    .max(100, "Store name must not exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),

  email: z.string().trim().email("Please enter a valid email address"),

  phoneNo: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must not exceed 200 characters"),

  city: z
    .string()
    .trim()
    .min(2, "City is required")
    .max(50, "City must not exceed 50 characters"),

  state: z
    .string()
    .trim()
    .min(2, "State is required")
    .max(50, "State must not exceed 50 characters"),

  country: z
    .string()
    .trim()
    .min(2, "Country is required")
    .max(50, "Country must not exceed 50 characters"),

  zipcode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Zipcode must be exactly 6 digits"),
});
