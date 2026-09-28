import express from "express";
import ContactController from "../contact/contactController.js";
import { asyncHandler } from "../helper/commonFunction.js";
import Users from "../../dataBase/models/userModel.js";
import ContactMessage from "../../dataBase/models/contactMessageModel.js";
import ContactReply from "../../dataBase/models/contactReplyModel.js";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
import limiter from "../../utility/rateLimit.js";
import {
  contactMessageValidation,
  contactReplyValidation,
  contactStatusValidation,
  contactIdValidation,
  contactListQueryValidation,
  validateRequest,
  validateParams,
  validateQuery,
} from "../contact/contactValidation.js";

const router = express.Router();
const contactController = new ContactController();
const adminRole = checkRole("Super Admin");

await contactController.init({
  models: {
    Users,
    ContactMessage,
    ContactReply,
  },
});

// Public: send a contact message
router.post(
  "/send-message",
  limiter,
  validateRequest(contactMessageValidation),
  asyncHandler(contactController.sendMessage.bind(contactController)),
);

// Admin: list all contact messages
router.get(
  "/get-all-messages",
  authorize,
  adminRole,
  validateQuery(contactListQueryValidation),
  asyncHandler(contactController.getMessages.bind(contactController)),
);

// Admin: message counts by status
router.get(
  "/message-counts",
  authorize,
  adminRole,
  asyncHandler(contactController.getMessageCount.bind(contactController)),
);

// Admin: single message with replies
router.get(
  "/get-message/:id",
  authorize,
  adminRole,
  validateParams(contactIdValidation),
  asyncHandler(contactController.getMessageById.bind(contactController)),
);

// Admin: reply to a user (sends email)
router.post(
  "/reply/:id",
  authorize,
  adminRole,
  validateParams(contactIdValidation),
  validateRequest(contactReplyValidation),
  asyncHandler(contactController.replyToMessage.bind(contactController)),
);

// Admin: update message status
router.patch(
  "/update-status/:id",
  authorize,
  adminRole,
  validateParams(contactIdValidation),
  validateRequest(contactStatusValidation),
  asyncHandler(contactController.updateMessageStatus.bind(contactController)),
);

// Admin: delete a message
router.delete(
  "/delete-message/:id",
  authorize,
  adminRole,
  validateParams(contactIdValidation),
  asyncHandler(contactController.deleteMessage.bind(contactController)),
);

export default router;
