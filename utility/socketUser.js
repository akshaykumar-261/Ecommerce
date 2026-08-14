import jwt from "jsonwebtoken";
import UserModel from "../dataBase/models/userModel.js";
import ChatMessage from "../dataBase/models/chatMessageModel.js";
const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers.authorization;
      if (!authHeader) {
        return next(new Error("Token Missing"));
      }
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findOne({
        where: {
          id: decoded.id,
          is_active: true,
          deletedAt: null,
        },
      });
      if (!user) {
        return next(new Error("User Not Found"));
      }
      const allowedRoles = [1, 2];
      if (!allowedRoles.includes(user.role_Id)) {
        return next(new Error("Only Admin and Vendor can use chat"));
      }
      socket.user = user;
      console.log(
        `Socket authenticated: User ID=${user.id}, Role=${user.role_Id}`,
      );
      next();
    } catch (error) {
      console.log("Socket Auth Error:", error.message);
      next(new Error("Invalid Token"));
    }
  });
  io.on("connection", (socket) => {
    const user = socket.user;
    console.log(
      `User Connected: ${user.name} | ID=${user.id} | Role=${user.role_Id}`,
    );
    socket.on("join_chat", async ({ user_id }, callback) => {
      try {
        const targetUserId = Number(user_id);
        const currentUserId = Number(user.id);
        const currentUserRole = Number(user.role_Id);
        const targetUser = await UserModel.findOne({
          where: {
            id: targetUserId,
            is_active: true,
            deletedAt: null,
          },
        });
        if (!targetUser) {
          return callback?.({
            success: false,
            message: "Target User not found",
          });
        }
        const targetUserRole = Number(targetUser.role_Id);
        if (
          ![1, 2].includes(currentUserRole) ||
          ![1, 2].includes(targetUserRole)
        ) {
          return callback?.({
            success: false,
            message: "Only Admin and Vendor can chat",
          });
        }
        if (currentUserRole === targetUserRole) {
          return callback?.({
            success: false,
            message:
              "Admin can chat only with Vendor and Vendor can chat only with Admin",
          });
        }
        let adminId;
        let vendorId;
        if (currentUserRole === 1) {
          adminId = currentUserId;
          vendorId = targetUserId;
        } else {
          vendorId = currentUserId;
          adminId = targetUserId;
        }
        const roomName = `admin_${adminId}_vendor_${vendorId}`;
        socket.join(roomName);
        socket.chatRoom = roomName;
        socket.chatWith = targetUserId;
        console.log(`${user.name} joined room: ${roomName}f`);
        callback?.({
          success: true,
          message: "Chat room joined successfully",
          room: roomName,
          current_user_id: currentUserId,
          chat_with: targetUserId,
        });
      } catch (error) {
        console.log("Join Chat Error:", error.message);
        callback?.({
          success: false,
          message: "Unable to join chat",
        });
      }
    });
    socket.on("send_message", async ({ message }, callback) => {
      try {
        if (!socket.chatRoom) {
          return callback?.({
            success: false,
            message: "Please join chat room first",
          });
        }
        if (!message || !message.trim()) {
          return callback?.({
            success: false,
            message: "Message is required",
          });
        }
        if (!socket.chatWith) {
          return callback?.({
            success: false,
            message: "Receiver not found",
          });
        }
        const savedMessage = await ChatMessage.create({
          room: socket.chatRoom,
          sender_id: user.id,
          receiver_id: socket.chatWith,
          message: message.trim(),
          is_read: false,
          read_at: null,
        });
        const messageData = {
          id: savedMessage.id,
          sender_id: user.id,
          sender_name: user.name,
          sender_role: user.role_Id,
          receiver_id: socket.chatWith,
          message: savedMessage.message,
          room: socket.chatRoom,
          is_read: savedMessage.is_read,
          created_at: savedMessage.createdAt,
        };
        // Send message to Admin + Vendor
        io.to(socket.chatRoom).emit("receive_message", messageData);
        callback?.({
          success: true,
          message: "Message sent successfully",
          data: messageData,
        });
      } catch (error) {
        console.log("Send Message Error:", error.message);
        callback?.({
          success: false,
          message: "Unable to send message",
        });
      }
    });
    socket.on("typing", () => {
      if (!socket.chatRoom) {
        return;
      }
      socket.to(socket.chatRoom).emit("user_typing", {
        user_id: user.id,
        user_name: user.name,
      });
    });
    socket.on("stop_typing", () => {
      if (!socket.chatRoom) {
        return;
      }
      socket.to(socket.chatRoom).emit("user_stop_typing", {
        user_id: user.id,
        user_name: user.name,
      });
    });
    socket.on("leave_chat", () => {
      try {
        if (!socket.chatRoom) {
          return socket.emit("leave_chat_response", {
            success: false,
            message: "You are not in any chat room",
          });
        }
        const roomName = socket.chatRoom;
        socket.leave(roomName);
        socket.chatRoom = null;
        socket.chatWith = null;
        console.log(`${user.name} left room: ${roomName}`);
        socket.emit("leave_chat_response", {
          success: true,
          message: "Chat room left successfully",
          room: roomName,
        });
      } catch (error) {
        console.log("Leave Chat error:", error.message);
        socket.emit("leave_chat_response", {
          success: false,
          message: "Unable to leave chat",
        });
      }
    });
    socket.on("mark_messages_read", async ({ room }, callback) => {
      try {
        if (!room) {
          return callback?.({
            success: false,
            message: "Room is required",
          });
        }
        await ChatMessage.update(
          {
            is_read: true,
            read_at: new Date(),
          },
          {
            where: {
              room: room,
              receiver_id: user.id,
              is_read: false,
            },
          },
        );
        socket.to(room).emit("messages_read", {
          room,
          read_by: user.id,
        });
        callback?.({
          success: true,
          message: "Messages marked as read",
        });
      } catch (error) {
        console.log("Mark Messages Read Error:", error.message);

        callback?.({
          success: false,
          message: "Unable to mark messages as read",
        });
      }
    });
    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${user.name}`);
    });
  });
};
export default socketHandler;
