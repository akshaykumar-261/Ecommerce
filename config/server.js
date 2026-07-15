import "dotenv/config";
import express from "express";
import http from "http";
import startServer from "./app.js";
import erroHandler from "../src/middleweare/errorHandller.js";
import userRoutes from "../src/routes/userRoutes.js";
import "./association.js";
import "../utility/queue/emailWorkers.js"
import "./cloudnary.js";
const app = express();
app.use(express.json());
app.use("/users", userRoutes);
const server = http.createServer(app);
app.use(erroHandler);
const PORT = process.env.PORT;
startServer(server);