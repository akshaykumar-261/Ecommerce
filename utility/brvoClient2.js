import { BrevoClient } from "@getbrevo/brevo";

const brevoApiInstance = new BrevoClient({
  apiKey: process.env.BREVO_API_KEY,
});

export default brevoApiInstance;