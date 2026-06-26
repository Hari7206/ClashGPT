import { ChatCohere } from "@langchain/cohere";
import { ChatGroq } from "@langchain/groq";
import { ChatMistralAI } from "@langchain/mistralai";

import config from "../config/config.js";


export const groqModel = new ChatGroq({
  model: "llama-3.1-8b-instant",
  apiKey: config.GROQ_API_KEY,
});

export const cohereModel = new ChatCohere({
  model: "command-r-08-2024",
  apiKey: config.COHERE_API_KEY,
});

export const mistralModel = new ChatMistralAI({
  model: "mistral-large-latest",
  apiKey: config.MISTRAL_API_KEY,
});