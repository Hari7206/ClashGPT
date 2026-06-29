import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  getUserChats,
  getChatById,
  renameChat,
  deleteChat,
  createChat,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/", authMiddleware, getUserChats);
router.get("/:chatId", authMiddleware, getChatById);
router.post("/", authMiddleware, createChat);
router.put("/:chatId", authMiddleware, renameChat);
router.delete("/:chatId", authMiddleware, deleteChat);

export default router;