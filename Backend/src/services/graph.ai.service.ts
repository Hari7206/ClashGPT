import { HumanMessage } from "@langchain/core/messages";
import {
  StateSchema,
  MessagesValue,
  StateGraph,
  START,
  END,
  ReducedValue,
} from "@langchain/langgraph";
import { z } from "zod";

import {
  mistralModel,
  cohereModel,
  groqModel,
} from "./model.service.js";

import { createAgent } from "langchain";


type GraphState = {
  message: any;
  solution_1?: string;
  solution_2?: string;
  judge_recommendation?: {
    solution_1_score: number;
    solution_2_score: number;
  };
};


const state = new StateSchema({
  message: MessagesValue,

  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (_, next) => next,
  }),

  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (_, next) => next,
  }),

  judge_recommendation: new ReducedValue(
    z.object({
      solution_1_score: z.number(),
      solution_2_score: z.number(),
    }).default({
      solution_1_score: 0,
      solution_2_score: 0,
    }),
    {
      reducer: (_, next) => next,
    }
  ),
});


const solutionNode = async (state: GraphState) => {
  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(state.message),
    cohereModel.invoke(state.message),
  ]);

  return {
    solution_1: mistral_solution.content,
    solution_2: cohere_solution.content,
  };
};


const judgeNode = async (state: GraphState) => {
  console.log("invoking judge with state", state);

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

  const raw =
    typeof rawMessage?.content === "string"
      ? rawMessage.content
      : Array.isArray(rawMessage?.content)
      ? rawMessage.content.map((c: any) => c.text ?? "").join("")
      : "";

  console.log("RAW OUTPUT:", raw);

const jsonMatch = raw.match(/\{[\s\S]*\}/);

let result = {
  solution_1_score: 0,
  solution_2_score: 0,
};

if (jsonMatch) {
  try {
    let json = jsonMatch[0];

    // Remove JavaScript comments
    json = json.replace(/\/\/.*$/gm, "");

    // Remove trailing commas
    json = json.replace(/,\s*}/g, "}");

    result = JSON.parse(json);
  } catch (err) {
    console.error("Failed to parse judge JSON:", err);
    console.log("Judge JSON was:", jsonMatch[0]);
  }
}

return {
  judge_recommendation: result,
};

}

const graph = new StateGraph(state)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();


export default async function (userMessage: string) {
  const result = await graph.invoke({
    message: [new HumanMessage(userMessage)],
  });

  console.log(result);

  return result.message;
}