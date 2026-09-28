import { z } from "zod";
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters long")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  subject: z
    .string()
    .trim()
    .max(255, "Subject cannot exceed 255 characters"),

  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters long")
    .max(5000, "Message cannot exceed 5000 characters"),
});

export default contactSchema;
