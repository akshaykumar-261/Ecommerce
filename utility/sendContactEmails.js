import { sendEmail } from "./emailServices.js";

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const sendNewContactMessageToAdmin = async ({
  message,
  adminEmail,
  adminName = "Admin",
}) => {
  if (!adminEmail) return null;
  const subject = `New contact message: ${
    message.subject || "No subject"
  }`;
  const htmlContent = `
    <h2>Hello ${escapeHtml(adminName)},</h2>
    <p>A new contact message has been received from the website.</p>
    <table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
      <tr><td><strong>Name:</strong></td><td>${escapeHtml(message.name)}</td></tr>
      <tr><td><strong>Email:</strong></td><td>${escapeHtml(message.email)}</td></tr>
      <tr><td><strong>Subject:</strong></td><td>${escapeHtml(
        message.subject || "-",
      )}</td></tr>
      <tr><td valign="top"><strong>Message:</strong></td><td>${escapeHtml(
        message.message,
      )}</td></tr>
    </table>
    <br />
    <p>Regards,<br />Ecommerce Platform</p>
  `;

  return await sendEmail({
    to: { email: adminEmail, name: adminName },
    subject,
    htmlContent,
  });
};

export const sendContactReplyToUser = async ({ contactMessage, reply }) => {
  const subject = `Re: ${
    contactMessage.subject || "Your enquiry"
  }`;
  const htmlContent = `
    <h2>Hello ${escapeHtml(contactMessage.name)},</h2>
    <p>Thank you for contacting us. Here is our reply:</p>
    <blockquote style="border-left:4px solid #4c2ed8;padding:8px 12px;margin:16px 0;background:#f8f9fc;">
      ${escapeHtml(reply).replace(/\n/g, "<br />")}
    </blockquote>
    <p><strong>Your original message:</strong></p>
    <blockquote style="border-left:4px solid #d1d5db;padding:8px 12px;margin:16px 0;color:#4b5563;">
      ${escapeHtml(contactMessage.message).replace(/\n/g, "<br />")}
    </blockquote>
    <p>
      Reply to this email or write back to us at
      <a href="mailto:support@shopease.com">support@shopease.com</a>.
    </p>
    <br />
    <p>Regards,<br />Ecommerce Support Team</p>
  `;

  return await sendEmail({
    to: { email: contactMessage.email, name: contactMessage.name },
    subject,
    htmlContent,
  });
};
