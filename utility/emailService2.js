import brevoApiInstance from "./brvoClient2.js";

export const sendEmail = async ({ to, subject, htmlContent }) => {
  try {
    const response =
      await brevoApiInstance.transactionalEmails.sendTransacEmail({
        subject,
        htmlContent,

        sender: {
          name: "Ecommerce Platform",
          email: process.env.EMAIL_FROM,
        },

        to: [
          {
            email: to.email,
            name: to.name,
          },
        ],
      });

    return response;
  } catch (error) {
    console.error("Brevo Email Error:", error);
    throw error;
  }
};