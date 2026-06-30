// chat/context/chatContext.jsx
import { createContext, useState, useEffect } from "react";
import { 
  graphAPI, 
  getChats, 
  createChat, 
  getChatById, 
  renameChat, 
  deleteChat 
} from "../services/chatapi";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Chat list state
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  // Load all chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Load all chats
  const loadChats = async () => {
    try {
      setIsLoadingChats(true);
      const response = await getChats();
      if (response.success) {
        setChats(response.data || []);
      }
    } catch (err) {
      console.error("Failed to load chats:", err);
      setError("Failed to load chats");
    } finally {
      setIsLoadingChats(false);
    }
  };

  // Load specific chat with battles
  const loadChat = async (chatId) => {
    try {
      setIsLoading(true);
      const response = await getChatById(chatId);
      
      if (response.success) {
        const { chat, battles } = response.data;
        setCurrentChatId(chatId);
        
        // Convert battles to messages format
        const chatMessages = [];
        
        // Add user messages and AI responses from battles
        battles.forEach((battle) => {
          // User message
          if (battle.userMessage) {
            chatMessages.push({
              id: `user-${battle._id}`,
              type: "user",
              content: battle.userMessage,
              timestamp: battle.createdAt,
            });
          }
          
          // AI responses (solution_1 and solution_2)
          if (battle.solution_1 || battle.solution_2) {
            chatMessages.push({
              id: `ai-${battle._id}`,
              type: "ai",
              solution_1: battle.solution_1 || "No response from Mistral",
              solution_2: battle.solution_2 || "No response from Cohere",
              judge_recommendation: {
                solution_1_score: battle.judge_recommendation?.solution_1_score || 0,
                solution_2_score: battle.judge_recommendation?.solution_2_score || 0,
              },
              timestamp: battle.createdAt,
            });
          }
        });
        
        setMessages(chatMessages);
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
      setError("Failed to load chat");
    } finally {
      setIsLoading(false);
    }
  };

  // Create new chat
  const createNewChat = async (title = "New Chat") => {
    try {
      const response = await createChat(title);
      if (response.success) {
        const newChat = response.data;
        setChats([newChat, ...chats]);
        setCurrentChatId(newChat._id);
        setMessages([]); // Clear messages for new chat
        return newChat;
      }
    } catch (err) {
      console.error("Failed to create chat:", err);
      setError("Failed to create chat");
      return null;
    }
  };

  // Rename chat
  const renameChatTitle = async (chatId, title) => {
    try {
      const response = await renameChat(chatId, title);
      if (response.success) {
        setChats(chats.map(chat => 
          chat._id === chatId ? { ...chat, title: title } : chat
        ));
        return true;
      }
    } catch (err) {
      console.error("Failed to rename chat:", err);
      setError("Failed to rename chat");
      return false;
    }
  };

  // Delete chat
  const deleteChatById = async (chatId) => {
    try {
      const response = await deleteChat(chatId);
      if (response.success) {
        setChats(chats.filter(chat => chat._id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setMessages([]);
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
      setError("Failed to delete chat");
      return false;
    }
  };

  // Send message to AI
  const sendMessage = async (prompt) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: prompt,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // If no chat exists, create one first
      let chatId = currentChatId;
      if (!chatId) {
        const newChat = await createNewChat("New Chat");
        if (newChat) {
          chatId = newChat._id;
          setCurrentChatId(chatId);
        }
      }

      const data = await graphAPI(prompt, chatId);
      
      console.log("📦 API Response:", data);

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        solution_1: data.data?.solution_1 || "No response from Mistral",
        solution_2: data.data?.solution_2 || "No response from Cohere",
        judge_recommendation: {
          solution_1_score: data.data?.judge_recommendation?.solution_1_score || 0,
          solution_2_score: data.data?.judge_recommendation?.solution_2_score || 0,
        },
        timestamp: new Date().toISOString(),
      };

      console.log("✅ AI Message:", aiMessage);
      setMessages((prev) => [...prev, aiMessage]);

      // Refresh chat list to update the chat title if changed
      await loadChats();

    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  // Clear messages
  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      error,
      sendMessage,
      chats,
      currentChatId,
      isLoadingChats,
      loadChats,
      loadChat,
      createNewChat,
      renameChatTitle,
      deleteChatById,
      clearMessages,
    }}>
      {children}
    </ChatContext.Provider>
  );
};