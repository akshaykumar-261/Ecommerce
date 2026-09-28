import { Op } from "sequelize";
import * as commanFunction from "../helper/commonFunction.js";

export default class ContactService {
  async init(db) {
    this.Model = db.models;
  }

  // Any registered account (verified or not) is linked to the message so the
  // admin panel can show the account. Guests simply have no link and are
  // stored with a null user_id.
  getUserByEmail = async (email) => {
    return this.Model.Users.findOne({
      where: {
        email,
        deletedAt: null,
      },
      attributes: ["id", "name", "lastname", "email", "is_verified", "is_active"],
    });
  };

  createMessage = async (payload) => {
    return this.Model.ContactMessage.create(payload);
  };

  getMessageById = async (id) => {
    return this.Model.ContactMessage.findOne({
      where: { id },
      include: [
        {
          // LEFT JOIN: guest messages have a null user_id and must still load.
          model: this.Model.Users,
          attributes: ["id", "name", "lastname", "email", "is_verified"],
          required: false,
        },
        {
          model: this.Model.ContactReply,
          attributes: ["id", "message_id", "admin_id", "reply", "createdAt"],
          required: false,
        },
      ],
    });
  };

  getMessages = async (page, limit, search, status) => {
    const { offset } = commanFunction.pagignation(page, limit);
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { message: { [Op.like]: `%${search}%` } },
      ];
    }
    if (status) {
      where.status = status;
    }
    return this.Model.ContactMessage.findAndCountAll({
      where,
      include: [
        {
          // LEFT JOIN: guest messages have a null user_id and must still list.
          model: this.Model.Users,
          attributes: ["id", "name", "lastname", "email", "is_verified"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
    });
  };

  getMessageCountByStatus = async () => {
    const [total, pending, replied, closed] = await Promise.all([
      this.Model.ContactMessage.count(),
      this.Model.ContactMessage.count({ where: { status: "PENDING" } }),
      this.Model.ContactMessage.count({ where: { status: "REPLIED" } }),
      this.Model.ContactMessage.count({ where: { status: "CLOSED" } }),
    ]);
    return { total, pending, replied, closed };
  };

  createReply = async (payload) => {
    return this.Model.ContactReply.create(payload);
  };

  getRepliesByMessageId = async (messageId) => {
    return this.Model.ContactReply.findAll({
      where: { message_id: messageId },
      order: [["createdAt", "DESC"]],
    });
  };

  markMessageReplied = async (id) => {
    return this.Model.ContactMessage.update(
      { status: "REPLIED", replied_at: new Date() },
      { where: { id } },
    );
  };

  updateMessageStatus = async (id, status) => {
    return this.Model.ContactMessage.update({ status }, { where: { id } });
  };

  deleteMessage = async (id) => {
    return this.Model.ContactMessage.destroy({ where: { id } });
  };
}
