import { HumanMessage } from "@langchain/core/messages";
import {
  StateGraph,
  END,
  START,
} from "@langchain/langgraph";
import { z } from "zod";

import {
  mistralModel,
  cohereModel,
  groqModel,
} from "./model.service.js";

import { createAgent } from "langchain";

interface GraphState {
  userMessage: string;
  solution_1?: string;
  solution_2?: string;
  judge_recommendation?: {
    solution_1_score: number;
    solution_2_score: number;
  };
}

const solutionNode = async (state: GraphState) => {
  console.log("📝 Getting solutions for:", state.userMessage);
  
  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(state.userMessage),
    cohereModel.invoke(state.userMessage),
  ]);

  return {
    solution_1: mistral_solution.content,
    solution_2: cohere_solution.content,
  };
};
const judgeNode = async (state: GraphState) => {
  console.log("⚖️ Judging solutions...");
  console.log("Solution 1:", state.solution_1);
  console.log("Solution 2:", state.solution_2);

  const judge = createAgent({
    model: groqModel,
    tools: [],
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
You are a strict evaluator.

Compare these two answers:

Solution 1:
${state.solution_1}

Solution 2:
${state.solution_2}

Return ONLY valid JSON:
{
  "solution_1_score": 0,
  "solution_2_score": 0
}
      `),
    ],
  });

  const rawMessage = judgeResponse.messages?.at(-1);
  const raw = typeof rawMessage?.content === "string" ? rawMessage.content : "";

  console.log("RAW JUDGE OUTPUT:", raw);

  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  let result = { solution_1_score: 0, solution_2_score: 0 };

  if (jsonMatch) {
    try {
      let json = jsonMatch[0];
      json = json.replace(/\/\/.*$/gm, "");
      json = json.replace(/,\s*}/g, "}");
      result = JSON.parse(json);
    } catch (err) {
      console.error("Failed to parse judge JSON:", err);
    }
  }

  return {
    judge_recommendation: result,
  };
};

const graph = new StateGraph({
  channels: {
    userMessage: {
      value: (a: string, b: string) => b || a,
      default: () => "",
    },
    solution_1: {
      value: (a: string, b: string) => b || a,
      default: () => "",
    },
    solution_2: {
      value: (a: string, b: string) => b || a,
      default: () => "",
    },
    judge_recommendation: {
      value: (a: any, b: any) => b || a,
      default: () => ({ solution_1_score: 0, solution_2_score: 0 }),
    },
  },
})
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();


export default async function (userMessage: string) {
  console.log("🚀 Starting graph with message:", userMessage);
  
  const result = await graph.invoke({
    userMessage: userMessage,
  });

  
  return {
    solution_1: result.solution_1 || "",
    solution_2: result.solution_2 || "",
    judge_recommendation: result.judge_recommendation || {
      solution_1_score: 0,
      solution_2_score: 0,
    },
  };
}