import UserServices from "./userService.js";
import { userMessage } from "../helper/commanMessages.js";
import { sendResponse } from "../helper/responseHandler.js";
import { STATUS_CODE } from "../helper/statusCode.js";
import * as commanFunction from "../helper/commonFunction.js";
import { uploadToCloudinary } from "../../utility/ cloudinaryUpload.js";
import { ROLE } from "../helper/roleBase.js";
import { emailQueue } from "../../utility/queue/emailQueue.js"
export default class userController {
  async init(db) {
    this.service = new UserServices();
    this.Models = db.models;
    await this.service.init(db);
  }
  async userCreate(req, res) {
    const { email } = req.body;
    const existingUser = await this.service.getByEmail(email);
    if (existingUser) {
      return sendResponse(res, STATUS_CODE.BAD_REQUEST, userMessage.USER_EXIST);
    }
    let avatar = null;
    if (req.files && req.files.length > 0) {
      const result = await uploadToCloudinary(req.files[0], "users/avatar");
      avatar = result.secure_url;
    }
    const otp = commanFunction.generateOtp(6);
    const user = await this.service.createUser({
      ...req.body,
      avtar: avatar,
      role_Id: ROLE.CUSTOMER,
      otp,
      is_verified: false,
      otp_expire: new Date(Date.now() + 10 * 60 + 1000),
    });
     const abc = await emailQueue.add("registration", {
          email: user.email,
          otp,
          name: user.name
     })
      console.log("=============>", abc);
    return sendResponse(res,STATUS_CODE.CREATED,userMessage.USER_CREATED,{user})
  }
}
