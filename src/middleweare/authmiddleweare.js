import jwt from "jsonwebtoken";
import UserModel from "../../dataBase/models/userModel.js";
import RoleModel from "../../dataBase/models/roleModel.js";
import {
  authMessage,
  userMessage,
  serverFile,
} from "../helper/commanMessages.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import { sendResponse } from "../helper/responseHandler.js";
const authorize = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, authMessage.UN_AUTH);
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("====>", decoded);
    if (!decoded) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_TOKEN,
      );
    }
    const user = await UserModel.findOne({
      where: {
        id: decoded.id,
        is_active: 1,
      },
      include: [
        {
          model: RoleModel,
          attributes: ["name"],
        },
      ],
    });
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        authMessage.USER_NOT_FOUND,
      );
    }
    req.user = user;
    req.sessionId = decoded.sessionId;
    next();
  } catch (error) {
    console.error(error);
    return sendResponse(res, STATUS_CODE.SERVER_ERROR, authMessage.INVALID);
  }
};
export default authorize;
