import "dotenv/config";
import express from "express";
import http from "http";
import startServer from "./app.js";
import { Server } from "socket.io";
import cors from "cors";
import socketHandler from "../utility/socketUser.js";
import erroHandler from "../src/middleweare/errorHandller.js";
import userRoutes from "../src/routes/userRoutes.js";
import venderRoutes from "../src/routes/vendersRoutes.js";
import cartRoutes from "../src/routes/cartRoutes.js";
import addressRoutes from "../src/routes/addresRoutes.js";
import orderRoutes from "../src/routes/orderRoutes.js";
import adminRoutes from "../src/routes/adminRoutes.js";
import reviewRoutes from "../src/routes/reviewRoutes.js";
import "./association.js";
import "../utility/queue/emailWorkers.js";
import "./cloudnary.js";
const app = express();
app.use(express.json());
app.use("/users", userRoutes);
app.use("/venders", venderRoutes);
app.use("/cart", cartRoutes);
app.use("/address", addressRoutes);
app.use("/order", orderRoutes);
app.use("/admin", adminRoutes);
app.use("/users", reviewRoutes);
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
global.io = io;
app.use(erroHandler);
const PORT = process.env.PORT;
socketHandler(io);
startServer(server);
