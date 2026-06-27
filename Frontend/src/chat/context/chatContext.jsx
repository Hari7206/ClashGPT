import { createContext, useState } from "react";
import { graphAPI } from "../services/chatapi";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const data = await graphAPI(prompt);
      
      console.log("📦 API Response:", data);

      // Create AI message - data already has the right structure
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        solution_1: data.solution_1 || "No response from Mistral",
        solution_2: data.solution_2 || "No response from Cohere",
        judge_recommendation: {
          solution_1_score: data.judge_recommendation?.solution_1_score || 0,
          solution_2_score: data.judge_recommendation?.solution_2_score || 0,
        },
        timestamp: new Date().toISOString(),
      };

      console.log("✅ AI Message:", aiMessage);

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ messages, isLoading, error, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};