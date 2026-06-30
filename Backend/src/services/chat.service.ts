// backend/services/chat.service.js
import graph, { generateChatTitle } from "./graph.ai.service.js";
import ChatModel from "../models/Chat.model.js";
import BattleModel from "../models/Battle.model.js";

export const processAIBattle = async (userId, message, chatId) => {
  try {
    console.log("🔄 Processing AI battle for user:", userId);
    console.log("💬 Message:", message);
    console.log("📝 Chat ID:", chatId);

    let chat;
    if (!chatId) {
      console.log("🆕 New chat detected - generating AI title...");
      const title = await generateChatTitle(message);
      console.log("📌 Generated title:", title);
      
      chat = await ChatModel.create({
        userId,
        title: title,
      });
      
      chatId = chat._id.toString();
      console.log("✅ New chat created with ID:", chatId);
    }

    // Run the AI battle graph
    const result = await graph(message);
    
    console.log("📊 Graph result:", {
      solution_1_length: result.solution_1?.length || 0,
      solution_2_length: result.solution_2?.length || 0,
      judge: result.judge_recommendation,
    });

    // ✅ Get scores from the result
    const score1 = result.judge_recommendation?.solution_1_score || 0;
    const score2 = result.judge_recommendation?.solution_2_score || 0;
    
    // ✅ Determine winner
    let winner = "draw";
    if (score1 > score2) winner = "solution_1";
    else if (score2 > score1) winner = "solution_2";

    // ✅ Save battle with correct schema fields (direct fields)
    if (chatId) {
      const battleData = {
        chatId,
        userMessage: message,
        solution_1: result.solution_1 || "",
        solution_2: result.solution_2 || "",
        solution_1_score: score1,
        solution_2_score: score2,
        winner: winner,
      };
      
      console.log("💾 Saving battle:", battleData);
      
      await BattleModel.create(battleData);
      console.log("💾 Battle saved to database");
    }

    return {
      ...result,
      chat: chat || null,
      isNewChat: !chatId,
    };
  } catch (error) {
    console.error("❌ Error in processAIBattle:", error);
    throw error;
  }
};