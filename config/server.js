import "dotenv/config";
import express from "express";
import http from "http";
import startServer from "./app.js";
const app = express();
app.use(express.json());
const server = http.createServer(app);
const PORT = process.env.PORT;
startServer(server);