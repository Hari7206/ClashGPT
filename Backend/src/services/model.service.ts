import { ChatGoogle } from "@langchain/google";
import { ChatCohere } from "@langchain/cohere";
import { ChatMistralAI } from "@langchain/mistralai";
import config from "../config/config.js";
import readline from "readline";



export const geminiModel = new ChatGoogle({
  model: "gemini-flash-latest",
  apiKey: config.GOOGLE_API_KEY,
});

export const mistralModel = new ChatMistralAI({
model: "mistral-large-latest",
apiKey: config.MISTRAL_API_KEY,
});



export const cohereModel = new ChatCohere({
  model: "command-r-plus",
  apiKey: config.COHERE_API_KEY,
  
});