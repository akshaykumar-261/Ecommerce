import fs from "fs";
import { STATUS_CODE } from "../helper/statusCode.js";
import { respnseHandler } from "../helper/responseHandler.js";
import * as commanFunction from "../helper/commonFunction.js";
import { serverFile } from "../helper/commanMessages.js";
const erroHandler = (err, req, res, next) => {
  console.error("========== ERROR ==========");
  console.error("Name:", err.name);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);
  if (err.parent) {
    console.error("SQL Message:", err.parent.sqlMessage);
    console.error("SQL Code:", err.parent.code);
    console.error("SQL No:", err.parent.errno);
    console.error("SQL State:", err.parent.sqlState);
  }
  console.error("SQL:", err.sql);
  console.error("Request path:", req.method, req.originalUrl);
  console.error("Request body:", req.body);
  return respnseHandler(
    res,
    STATUS_CODE.SERVER_ERROR,
    serverFile.SERVER_ERROR,
  );
};
export default erroHandler;
