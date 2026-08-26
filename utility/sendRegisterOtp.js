import { sendEmail } from "./emailService2.js";

export const sendRegistrationOtp = async (email, otp, name) => {
  const subject = "Verify Your Account";

  const htmlContent = `
    <h2>Hello ${name},</h2>

    <p>Welcome to Ecommerce Platform.</p>

    <p>Your verification OTP is:</p>

    <h1 style="color:#007bff">${otp}</h1>

    <p>This OTP will expire in 10 minutes.</p>

    <p>Thank You</p>
  `;

  return await sendEmail({
    to: {
      email,
      name,
    },
    subject,
    htmlContent,
  });
};