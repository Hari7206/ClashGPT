import { HumanMessage } from "@langchain/core/messages";
import { StateSchema, MessagesValue, StateGraph, START, END, ReducedValue } from "@langchain/langgraph";
import { promise, z } from "zod"
import { mistralModel, cohereModel , geminiModel } from "./model.service.js";
import type { GraphNode } from "@langchain/langgraph";
import { createAgent  , providerStrategy} from "langchain";




const state = new StateSchema({
  message: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next
    }
  }),
  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next
    }
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
      reducer: (current, next) => next,
    }
  ),
});

const solutionNode: GraphNode<typeof state> = async (state) => {
const [mistral_solution, cohere_solution] = await Promise.all([
  mistralModel.invoke(state.message),
  cohereModel.invoke(state.message),
]);
  return {
    solution_1: mistral_solution.text,
    solution_2: cohere_solution.text
  };
};

const judgeNode: GraphNode<typeof state> = async (state) => {
  console.log('invoking judge with state ' , state);
  
  const {solution_1 , solution_2} =  

  const judge = createAgent({
    model: geminiModel ,
    tools: [] ,
    responseFormat: providerStrategy(z.object({
      solution_1_score: z.number().min(0).max(10) ,
      solution_2_score: z.number().min(0).max(10),
    }))
  })
  const judgeResponse = await judge.invoke({
    messages: [
      
    new HumanMessage(`You are a strict evaluator.

Compare these two answers:

Solution 1:
${state.solution_1}

Solution 2:
${state.solution_2}

Return JSON only:
{
  "solution_1_score": number,
  "solution_2_score": number
}`)
  ]
    
  })
  const result = judgeResponse.structuredResponse

  return {
    judege_recommendation: result
  }
}

const graph = new StateGraph(state)
  .addNode("solution", solutionNode)
  .addNode("judge" , judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution" , "judge")
  .addEdge("judge" , END)

  .compile();


export default async function (userMessage: string) {
  const result = await graph.invoke({
    message: [
      new HumanMessage(userMessage)
    ]
  })
  console.log(result);
  
  return result.message
}
