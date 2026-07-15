import { sendEmail } from "./emailServices.js"

export const sendForgotOtp = async (email, otp, name) => {
  const subject = "Verify Your Account";

  const htmlContent = `
    <h2>Hello ${name},</h2>
    <p>
      We received a request to reset your password.
    </p>
    <p>Your OTP is:</p>

    <h1 style="color:#2563eb;">
      ${otp}
    </h1>
    
    <p>
      This OTP will expire in 5 minutes.
    </p>
    <p>
      If you did not request this OTP,
      please ignore this email.
    </p>
    <br />
    <p>
      Regards,<br />
      Ecommerce Platform
    </p>
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
