import { Router } from "express";
import authorize from "../middleweare/authmiddleweare.js";
import checkRole from "../middleweare/roleBasemiddleweare.js";
import { asyncHandler } from "../helper/commonFunction.js";
import chatController from "../chat/chatController.js";

const router = Router();

const adminRole = checkRole("Super Admin");
const vendorRole = checkRole("Vendors");
const chatRole = checkRole("Super Admin", "Vendors");

router.get(
  "/conversations",
  authorize,
  chatRole,
  asyncHandler(chatController.getConversations.bind(chatController)),
);

router.get(
  "/messages/:room",
  authorize,
  chatRole,
  asyncHandler(chatController.getMessages.bind(chatController)),
);

router.get(
  "/vendors",
  authorize,
  adminRole,
  asyncHandler(chatController.getChatVendors.bind(chatController)),
);

router.get(
  "/admin",
  authorize,
  vendorRole,
  asyncHandler(chatController.getChatAdmin.bind(chatController)),
);

router.delete(
  "/messages/:room",
  authorize,
  chatRole,
  asyncHandler(chatController.deleteMessages.bind(chatController)),
);

router.delete(
  "/message/:messageId",
  authorize,
  chatRole,
  asyncHandler(chatController.deleteMessage.bind(chatController)),
);

export default router;
