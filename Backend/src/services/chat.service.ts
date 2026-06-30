// backend/services/chat.service.js
import graph from "./graph.ai.service.js";
import ChatModel from "../models/Chat.model.js";
import BattleModel from "../models/Battle.model.js";

export const processAIBattle = async (userId: string, message: string, chatId: string) => {
  try {
    console.log("🔄 Processing AI battle for user:", userId);
    console.log("💬 Message:", message);
    console.log("📝 Chat ID:", chatId);

    // Run the graph
    const result = await graph(message);
    
    console.log("📊 Graph result:", {
      solution_1_length: result.solution_1?.length || 0,
      solution_2_length: result.solution_2?.length || 0,
      solution_1_preview: result.solution_1?.substring(0, 100) || "empty",
      solution_2_preview: result.solution_2?.substring(0, 100) || "empty",
      judge: result.judge_recommendation,
    });

    // Save battle to database if chatId exists
    if (chatId) {
      await BattleModel.create({
        chatId,
        userMessage: message,
        solution_1: result.solution_1,
        solution_2: result.solution_2,
        judge_recommendation: result.judge_recommendation,
      });
    }

    return result;
  } catch (error) {
    console.error("❌ Error in processAIBattle:", error);
    throw error;
  }
};