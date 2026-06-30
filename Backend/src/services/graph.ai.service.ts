// backend/services/graph.ai.service.ts
import { HumanMessage } from "@langchain/core/messages";
import {
  StateGraph,
  END,
  START,
} from "@langchain/langgraph";
import {
  mistralModel,
  cohereModel,
  groqModel,
} from "./model.service.js";

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
  
  try {
    if (!state.userMessage || state.userMessage.trim() === "") {
      console.error("❌ Empty user message");
      return {
        solution_1: "Please provide a valid message.",
        solution_2: "Please provide a valid message.",
      };
    }

    console.log("🔄 Calling Mistral AI...");
    const mistralPromise = mistralModel.invoke(state.userMessage)
      .then(response => {
        console.log("✅ Mistral AI responded");
        return response;
      })
      .catch(error => {
        console.error("❌ Mistral AI error:", error.message);
        return { content: "Mistral AI is currently unavailable. Please try again." };
      });

    console.log("🔄 Calling Cohere AI...");
    const coherePromise = cohereModel.invoke(state.userMessage)
      .then(response => {
        console.log("✅ Cohere AI responded");
        return response;
      })
      .catch(error => {
        console.error("❌ Cohere AI error:", error.message);
        return { content: "Cohere AI is currently unavailable. Please try again." };
      });

    const [mistral_solution, cohere_solution] = await Promise.all([
      mistralPromise,
      coherePromise,
    ]);

    const solution1 = mistral_solution?.content || "Mistral AI could not generate a response";
    const solution2 = cohere_solution?.content || "Cohere AI could not generate a response";

    console.log("📊 Solution 1 length:", solution1.length);
    console.log("📊 Solution 2 length:", solution2.length);

    return {
      solution_1: solution1,
      solution_2: solution2,
    };
  } catch (error) {
    console.error("❌ Error in solutionNode:", error);
    return {
      solution_1: "An error occurred while generating the response.",
      solution_2: "An error occurred while generating the response.",
    };
  }
};

const judgeNode = async (state: GraphState) => {
  console.log("⚖️ Judging solutions...");
  
  try {
    const solution1 = state.solution_1 || "No response provided";
    const solution2 = state.solution_2 || "No response provided";

    console.log("Solution 1 length:", solution1.length);
    console.log("Solution 2 length:", solution2.length);

    const judgePrompt = `You are a strict evaluator.

Compare these two answers and score them from 0 to 10.

Solution 1:
${solution1.substring(0, 5000)}

Solution 2:
${solution2.substring(0, 5000)}

Return ONLY valid JSON in this exact format:
{"solution_1_score": 8, "solution_2_score": 7}`;

    console.log("🔄 Calling Groq for judging...");
    
    const judgeResponse = await groqModel.invoke([
      new HumanMessage(judgePrompt),
    ]);

    const raw = typeof judgeResponse?.content === "string" ? judgeResponse.content : "";
    console.log("📝 RAW JUDGE OUTPUT:", raw);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    let result = { solution_1_score: 5, solution_2_score: 5 };

    if (jsonMatch) {
      try {
        let json = jsonMatch[0];
        json = json.replace(/\/\/.*$/gm, "");
        json = json.replace(/,\s*}/g, "}");
        json = json.replace(/,\s*]/g, "]");
        json = json.replace(/'/g, '"');
        
        const parsed = JSON.parse(json);
        result = {
          solution_1_score: Math.min(Math.max(parsed.solution_1_score || 0, 0), 10),
          solution_2_score: Math.min(Math.max(parsed.solution_2_score || 0, 0), 10),
        };
        console.log("✅ Parsed judge scores:", result);
      } catch (err) {
        console.error("❌ Failed to parse judge JSON:", err);
        console.error("Raw JSON attempt:", jsonMatch[0]);
      }
    } else {
      console.warn("⚠️ No JSON found in judge response");
    }

    return {
      judge_recommendation: result,
    };
  } catch (error) {
    console.error("❌ Error in judgeNode:", error);
    return {
      judge_recommendation: {
        solution_1_score: 5,
        solution_2_score: 5,
      },
    };
  }
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

// ✅ ONLY ONE default export - the main graph function
export default async function (userMessage: string) {
  console.log("🚀 Starting graph with message:", userMessage);
  
  try {
    const result = await graph.invoke({
      userMessage: userMessage,
    });

    console.log("✅ Graph execution complete");
    console.log("📊 Solution 1 length:", result.solution_1?.length || 0);
    console.log("📊 Solution 2 length:", result.solution_2?.length || 0);
    console.log("📊 Judge:", result.judge_recommendation);

    return {
      solution_1: result.solution_1 || "",
      solution_2: result.solution_2 || "",
      judge_recommendation: result.judge_recommendation || {
        solution_1_score: 0,
        solution_2_score: 0,
      },
    };
  } catch (error) {
    console.error("❌ Graph execution error:", error);
    throw error;
  }
}

// ✅ Named export - NOT default
export const generateChatTitle = async (userMessage: string): Promise<string> => {
  try {
    console.log("📝 Generating chat title for:", userMessage.substring(0, 50) + "...");
    
    const titlePrompt = `Generate a short, concise title (maximum 5-6 words) for a conversation that starts with this user message: "${userMessage}"

The title should be:
- Short and descriptive (max 5-6 words)
- Capture the main topic or question
- No quotes, no explanation, just the title

Example:
User: "What is the best way to learn machine learning?"
Title: Best Way to Learn ML

User: "Explain quantum computing in simple terms"
Title: Quantum Computing Explained

Now generate the title for this message: "${userMessage}"`;

    const response = await groqModel.invoke([
      new HumanMessage(titlePrompt),
    ]);

    const title = typeof response?.content === "string" ? response.content.trim() : "New Chat";
    
    console.log("✅ Generated title:", title);
    
    return title;
  } catch (error) {
    console.error("❌ Error generating chat title:", error);
    return "New Chat";
  }
};