import jwt from "jsonwebtoken";
import UserModel from "../dataBase/models/userModel.js";

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.headers.token;
      if (!authHeader) {
        return next(new Error("Token Missing"));
      }
      const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
      );
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
        return next(
          new Error("Only Admin and Vendor can use chat")
        );
      }
      socket.user = user;
      console.log(
        `Socket authenticated: User ID=${user.id}, Role=${user.role_Id}`
      );
      next();
    } catch (error) {
      console.log("Socket Auth Error:", error.message);
      next(new Error("Invalid Token"));
    }
  });
  io.on("connection", (socket) => {
    console.log(
      `User Connected: ${socket.user.name} | ID: ${socket.user.id} | Role: ${socket.user.role_Id}`
    );
    socket.on("disconnect", () => {
      console.log(
        `User Disconnected: ${socket.user.name}`
      );
    });
  });
};

export default socketHandler;