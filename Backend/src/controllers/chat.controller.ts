import type { Response } from "express";
import ChatModel from "../models/Chat.model.js";
import BattleModel from "../models/Battle.model.js";
import type { AuthRequest } from "../middleware/auth.middleware.js";



export const getUserChats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    const chats = await ChatModel.find({ userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Chats fetched successfully",
      data: chats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const getChatById = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await ChatModel.findOne({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    const battles = await BattleModel.find({ chatId }).sort({
      createdAt: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Chat loaded",
      data: {
        chat,
        battles,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const renameChat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const chat = await ChatModel.findOneAndUpdate(
      { _id: chatId, userId },
      { title },
      { new: true }
    );

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    return res.json({
      success: true,
      message: "Chat renamed",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const deleteChat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { chatId } = req.params;

    const chat = await ChatModel.findOneAndDelete({
      _id: chatId,
      userId,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    await BattleModel.deleteMany({ chatId });

    return res.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const createChat = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { title } = req.body;

    const chat = await ChatModel.create({
      userId,
      title: title || "New Chat",
    });

    return res.json({
      success: true,
      message: "Chat created",
      data: chat,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};