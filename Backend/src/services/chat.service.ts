import useGraph from "./graph.ai.service.js";
import ChatModel from "../models/Chat.model.js";
import BattleModel from "../models/Battle.model.js";

export const processAIBattle = async (
  userId: string,
  message: string,
  chatId?: string
) => {
  // 1. Find or create chat
  let chat;

  if (chatId) {
    chat = await ChatModel.findOne({ _id: chatId, userId });
  }

  if (!chat) {
    chat = await ChatModel.create({
      userId,
      title: message.slice(0, 25),
    });
  }

  // 2. Run AI graph
  const result = await useGraph(message);

  const { solution_1, solution_2, judge_recommendation } = result;

  // 3. Decide winner
  let winner: "solution_1" | "solution_2" | "draw" = "draw";

  if (
    judge_recommendation.solution_1_score >
    judge_recommendation.solution_2_score
  ) {
    winner = "solution_1";
  } else if (
    judge_recommendation.solution_2_score >
    judge_recommendation.solution_1_score
  ) {
    winner = "solution_2";
  }

  // 4. Save battle
  const battle = await BattleModel.create({
    chatId: chat._id,
    userMessage: message,
    solution_1,
    solution_2,
    solution_1_score: judge_recommendation.solution_1_score,
    solution_2_score: judge_recommendation.solution_2_score,
    winner,
  });

  return {
    chat,
    battle,
    result,
  };
};