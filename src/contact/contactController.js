import ContactService from "./contactService.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
import { contactMessages } from "../helper/commanMessages.js";
import { pagignation } from "../helper/commonFunction.js";
import {
  sendContactReplyToUser,
  sendNewContactMessageToAdmin,
} from "../../utility/sendContactEmails.js";

export default class ContactController {
  async init(db) {
    this.Model = db.models;
    this.service = new ContactService();
    await this.service.init(db);
  }
  async sendMessage(req, res) {
    const { name, email, subject, message } = req.body;
    const user = await this.service.getUserByEmail(email);
    const contactMessage = await this.service.createMessage({
      user_id: user?.id || null,
      name,
      email,
      subject: subject || null,
      message,
    });

    // Notify the admin; a mail failure must not fail the request.
    try {
      await sendNewContactMessageToAdmin({
        message: contactMessage,
        adminEmail: process.env.ADMIN_EMAIL,
        adminName: process.env.ADMIN_NAME || "Admin",
      });
    } catch (error) {
      console.error("Failed to notify admin about contact message:", error.message);
    }

    return sendResponse(res, STATUS_CODE.CREATED, contactMessages.MESSAGE_SENT, {
      message: contactMessage,
    });
  }

  async getMessages(req, res) {
    const { page = 1, limit = 10, search = "", status = "" } = req.query;
    const messages = await this.service.getMessages(page, limit, search, status);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      contactMessages.MESSAGES_FETCHED,
      pagignation(page, limit, messages),
    );
  }

  async getMessageCount(req, res) {
    const counts = await this.service.getMessageCountByStatus();
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      contactMessages.MESSAGES_FETCHED,
      counts,
    );
  }

  async getMessageById(req, res) {
    const { id } = req.params;
    const message = await this.service.getMessageById(id);
    if (!message) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        contactMessages.MESSAGE_NOT_FOUND,
      );
    }
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      contactMessages.MESSAGE_FETCHED,
      { message },
    );
  }

  async replyToMessage(req, res) {
    const { id } = req.params;
    const { reply } = req.body;

    const message = await this.service.getMessageById(id);
    if (!message) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        contactMessages.MESSAGE_NOT_FOUND,
      );
    }
    await this.service.createReply({
      message_id: message.id,
      admin_id: req.user?.id || null,
      reply,
    });

    let mailSent = true;
    try {
      await sendContactReplyToUser({ contactMessage: message, reply });
    } catch (error) {
      mailSent = false;
      console.error("Failed to send contact reply email:", error.message);
    }

    await this.service.markMessageReplied(message.id);

    return sendResponse(res, STATUS_CODE.SUCCESS, contactMessages.REPLY_SENT, {
      messageId: message.id,
      mailSent,
    });
  }

  async updateMessageStatus(req, res) {
    const { id } = req.params;
    const { status } = req.body;
    const message = await this.service.getMessageById(id);
    if (!message) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        contactMessages.MESSAGE_NOT_FOUND,
      );
    }
    await this.service.updateMessageStatus(id, status);
    return sendResponse(
      res,
      STATUS_CODE.SUCCESS,
      contactMessages.STATUS_UPDATED,
      { id: Number(id), status },
    );
  }

  async deleteMessage(req, res) {
    const { id } = req.params;
    const message = await this.service.getMessageById(id);
    if (!message) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        contactMessages.MESSAGE_NOT_FOUND,
      );
    }
    await this.service.deleteMessage(id);
    return sendResponse(res, STATUS_CODE.SUCCESS, contactMessages.MESSAGE_DELETED);
  }
}
