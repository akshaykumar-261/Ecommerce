import ChatMessage from "../../dataBase/models/chatMessageModel.js";
import UserModel from "../../dataBase/models/userModel.js";
import { Op, fn, col, literal } from "sequelize";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";

class ChatController {
  async getConversations(req, res) {
    try {
      const userId = req.user.id;
      const userRole = req.user.role_Id;

      const messages = await ChatMessage.findAll({
        where: {
          [Op.or]: [{ sender_id: userId }, { receiver_id: userId }],
        },
        attributes: [
          "room",
          [fn("MAX", col("createdAt")), "lastMessageAt"],
          [fn("MAX", col("id")), "lastMessageId"],
        ],
        group: ["room"],
        order: [[literal("lastMessageAt"), "DESC"]],
        raw: true,
      });

      if (!messages.length) {
        return sendResponse(
          res,
          STATUS_CODE.SUCCESS,
          "No conversations found",
          { conversations: [] },
        );
      }

      const conversations = [];
      for (const msg of messages) {
        const lastMessage = await ChatMessage.findByPk(msg.lastMessageId, {
          raw: true,
        });

        const otherUserId =
          lastMessage.sender_id === userId
            ? lastMessage.receiver_id
            : lastMessage.sender_id;

        const otherUser = await UserModel.findByPk(otherUserId, {
          attributes: ["id", "name", "email", "role_Id"],
          raw: true,
        });

        const unreadCount = await ChatMessage.count({
          where: {
            room: msg.room,
            receiver_id: userId,
            is_read: false,
          },
        });

        conversations.push({
          room: msg.room,
          otherUser,
          lastMessage: {
            id: lastMessage.id,
            message: lastMessage.message,
            sender_id: lastMessage.sender_id,
            createdAt: lastMessage.createdAt,
          },
          unreadCount,
        });
      }

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Conversations fetched successfully",
        { conversations },
      );
    } catch (error) {
      console.error("Get Conversations Error:", error);
      return sendResponse(
        res,
        STATUS_CODE.SERVER_ERROR,
        "Failed to fetch conversations",
      );
    }
  }

  async getMessages(req, res) {
    try {
      const userId = req.user.id;
      const { room } = req.params;
      const { page = 1, limit = 50 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const messages = await ChatMessage.findAndCountAll({
        where: { room },
        order: [["createdAt", "DESC"]],
        limit: Number(limit),
        offset,
      });

      const senderIds = [
        ...new Set(messages.rows.map((m) => m.sender_id)),
      ];
      const receiverIds = [
        ...new Set(messages.rows.map((m) => m.receiver_id)),
      ];
      const allUserIds = [...new Set([...senderIds, ...receiverIds])];

      const users = await UserModel.findAll({
        where: { id: allUserIds },
        attributes: ["id", "name", "email"],
        raw: true,
      });

      const userMap = {};
      users.forEach((u) => {
        userMap[u.id] = u;
      });

      const formattedMessages = messages.rows.map((m) => ({
        id: m.id,
        sender_id: m.sender_id,
        sender_name: userMap[m.sender_id]?.name || "Unknown",
        receiver_id: m.receiver_id,
        message: m.message,
        is_read: m.is_read,
        read_at: m.read_at,
        createdAt: m.createdAt,
      }));

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Messages fetched successfully",
        {
          messages: formattedMessages.reverse(),
          totalMessages: messages.count,
          totalPages: Math.ceil(messages.count / Number(limit)),
          currentPage: Number(page),
        },
      );
    } catch (error) {
      console.error("Get Messages Error:", error);
      return sendResponse(
        res,
        STATUS_CODE.SERVER_ERROR,
        "Failed to fetch messages",
      );
    }
  }

  async getChatVendors(req, res) {
    try {
      const vendors = await UserModel.findAll({
        where: {
          role_Id: 2,
          is_active: true,
          deletedAt: null,
        },
        attributes: ["id", "name", "email"],
        raw: true,
      });

      const vendorRooms = await ChatMessage.findAll({
        attributes: [
          "room",
          [fn("MAX", col("createdAt")), "lastMessageAt"],
        ],
        group: ["room"],
        raw: true,
      });

      const vendorsWithStatus = vendors.map((vendor) => {
        const roomPattern = `_vendor_${vendor.id}`;
        const hasChatted = vendorRooms.some((r) =>
          r.room.endsWith(roomPattern),
        );
        return { ...vendor, hasChatted };
      });

      vendorsWithStatus.sort((a, b) => {
        if (a.hasChatted && !b.hasChatted) return -1;
        if (!a.hasChatted && b.hasChatted) return 1;
        return a.name.localeCompare(b.name);
      });

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Vendors fetched successfully",
        { vendors: vendorsWithStatus },
      );
    } catch (error) {
      console.error("Get Chat Vendors Error:", error);
      return sendResponse(
        res,
        STATUS_CODE.SERVER_ERROR,
        "Failed to fetch vendors",
      );
    }
  }

  async getChatAdmin(req, res) {
    try {
      const admin = await UserModel.findOne({
        where: {
          role_Id: 1,
          is_active: true,
          deletedAt: null,
        },
        attributes: ["id", "name", "email"],
        raw: true,
      });

      if (!admin) {
        return sendResponse(
          res,
          STATUS_CODE.NOT_FOUND,
          "No admin found",
        );
      }

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Admin fetched successfully",
        { admin },
      );
    } catch (error) {
      console.error("Get Chat Admin Error:", error);
      return sendResponse(
        res,
        STATUS_CODE.SERVER_ERROR,
        "Failed to fetch admin",
      );
    }
  }

  async deleteMessages(req, res) {
    try {
      const userId = req.user.id;
      const { room } = req.params;

      if (!room) {
        return sendResponse(
          res,
          STATUS_CODE.BAD_REQUEST,
          "Room is required",
        );
      }

      const deleted = await ChatMessage.destroy({
        where: { room },
      });

      if (global.io) {
        global.io.to(room).emit("chat_deleted", { room, deleted_by: userId });
      }

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Chat deleted successfully",
        { deletedCount: deleted },
      );
    } catch (error) {
      console.error("Delete Messages Error:", error);
      return sendResponse(
        res,
        STATUS_CODE.SERVER_ERROR,
        "Failed to delete chat",
      );
    }
  }

  async deleteMessage(req, res) {
    try {
      const userId = req.user.id;
      const { messageId } = req.params;

      const message = await ChatMessage.findByPk(messageId);
      if (!message) {
        return sendResponse(
          res,
          STATUS_CODE.NOT_FOUND,
          "Message not found",
        );
      }

      if (message.sender_id !== userId) {
        return sendResponse(
          res,
          STATUS_CODE.FORBIDDEN,
          "You can only delete your own messages",
        );
      }

      const room = message.room;
      await message.destroy();

      if (global.io) {
        global.io.to(room).emit("message_deleted", {
          messageId: Number(messageId),
          room,
          deleted_by: userId,
        });
      }

      return sendResponse(
        res,
        STATUS_CODE.SUCCESS,
        "Message deleted successfully",
      );
    } catch (error) {
      console.error("Delete Message Error:", error);
      return sendResponse(
        res,
        STATUS_CODE.SERVER_ERROR,
        "Failed to delete message",
      );
    }
  }
}

export default new ChatController();
