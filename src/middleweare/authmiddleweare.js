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
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    console.log("====>", decode);
    if (!decode) {
      return sendResponse(
        res,
        STATUS_CODE.BAD_REQUEST,
        userMessage.INVALID_TOKEN,
      );
    }
    const user = await UserModel.findOne({
      where: {
        id: decode.id,
        //is_active: 1,
      },
      include: [
        {
          model: RoleModel,
          attributes: ["name"],
        },
      ],
    });
    console.log("====>", user);
    if (!user) {
      return sendResponse(
        res,
        STATUS_CODE.NOT_FOUND,
        authMessage.USER_NOT_FOUND,
      );
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        authMessage.TOKEN_EXPIRED
      );
    }

    if (error.name === "JsonWebTokenError") {
      return sendResponse(
        res,
        STATUS_CODE.UNAUTHORIZED,
        authMessage.INVALID_TOKEN
      );
    }

    console.error(error);

    return sendResponse(
      res,
      STATUS_CODE.SERVER_ERROR,
      authMessage.INVALID
    );
};
};
export default authorize;
