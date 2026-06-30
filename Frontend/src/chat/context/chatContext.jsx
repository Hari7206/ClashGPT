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
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatTitle, setCurrentChatTitle] = useState(null);
  const [isLoadingChats, setIsLoadingChats] = useState(false);

  useEffect(() => {
    loadChats();
  }, []);

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

  // ✅ FIXED: Load chat with correct battle schema
  const loadChat = async (chatId) => {
    try {
      setIsLoading(true);
      const response = await getChatById(chatId);
      
      console.log("📖 Full Chat Response:", response);
      
      if (response.success) {
        const { chat, battles } = response.data;
        console.log("📊 Battles received:", battles.length);
        
        setCurrentChatId(chatId);
        setCurrentChatTitle(chat.title);
        
        const chatMessages = [];
        
        battles.forEach((battle) => {
          console.log("🔍 Battle scores:", {
            solution_1_score: battle.solution_1_score,
            solution_2_score: battle.solution_2_score,
            winner: battle.winner,
          });
          
          // User message
          if (battle.userMessage) {
            chatMessages.push({
              id: `user-${battle._id}`,
              type: "user",
              content: battle.userMessage,
              timestamp: battle.createdAt,
            });
          }
          
          // ✅ AI response with scores from direct fields
          if (battle.solution_1 || battle.solution_2) {
            chatMessages.push({
              id: `ai-${battle._id}`,
              type: "ai",
              solution_1: battle.solution_1 || "No response from Mistral",
              solution_2: battle.solution_2 || "No response from Cohere",
              judge_recommendation: {
                solution_1_score: battle.solution_1_score ?? 0,
                solution_2_score: battle.solution_2_score ?? 0,
              },
              timestamp: battle.createdAt,
            });
          }
        });
        
        console.log("📨 Messages with scores:", chatMessages);
        setMessages(chatMessages);
      }
    } catch (err) {
      console.error("Failed to load chat:", err);
      setError("Failed to load chat");
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = async (title = "New Chat") => {
    try {
      const response = await createChat(title);
      if (response.success) {
        const newChat = response.data;
        setChats([newChat, ...chats]);
        setCurrentChatId(newChat._id);
        setCurrentChatTitle(newChat.title);
        setMessages([]);
        return newChat;
      }
    } catch (err) {
      console.error("Failed to create chat:", err);
      setError("Failed to create chat");
      return null;
    }
  };

  const renameChatTitle = async (chatId, title) => {
    try {
      const response = await renameChat(chatId, title);
      if (response.success) {
        setChats(chats.map(chat => 
          chat._id === chatId ? { ...chat, title: title } : chat
        ));
        if (currentChatId === chatId) {
          setCurrentChatTitle(title);
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to rename chat:", err);
      setError("Failed to rename chat");
      return false;
    }
  };

  const deleteChatById = async (chatId) => {
    try {
      const response = await deleteChat(chatId);
      if (response.success) {
        setChats(chats.filter(chat => chat._id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setCurrentChatTitle(null);
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

  // ✅ FIXED: Send message with correct score handling
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
      let chatId = currentChatId;

      const data = await graphAPI(prompt, chatId);
      
      console.log("📦 API Response:", data);

      if (data.data?.chat) {
        const chatData = data.data.chat;
        setCurrentChatId(chatData._id);
        setCurrentChatTitle(chatData.title);
        
        setChats((prev) => {
          const exists = prev.some(c => c._id === chatData._id);
          if (exists) {
            return prev.map(c => 
              c._id === chatData._id ? { ...c, title: chatData.title } : c
            );
          } else {
            return [chatData, ...prev];
          }
        });
      }

      // ✅ Get scores from response
      const score1 = data.data?.judge_recommendation?.solution_1_score ?? 0;
      const score2 = data.data?.judge_recommendation?.solution_2_score ?? 0;
      
      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        solution_1: data.data?.solution_1 || "No response from Mistral",
        solution_2: data.data?.solution_2 || "No response from Cohere",
        judge_recommendation: {
          solution_1_score: score1,
          solution_2_score: score2,
        },
        timestamp: new Date().toISOString(),
      };

      console.log("✅ AI Message with scores:", aiMessage);
      setMessages((prev) => [...prev, aiMessage]);

      await loadChats();

    } catch (err) {
      console.error("❌ Error:", err);
      setError(err.message || "Failed to get response");
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setCurrentChatId(null);
    setCurrentChatTitle(null);
  };

  return (
    <ChatContext.Provider value={{
      messages,
      isLoading,
      error,
      sendMessage,
      chats,
      currentChatId,
      currentChatTitle,
      isLoadingChats,
      loadChats,
      loadChat,
      createNewChat,
      renameChatTitle,
      deleteChatById,
      clearMessages,
      setCurrentChatId,
      setCurrentChatTitle,
    }}>
      {children}
    </ChatContext.Provider>
  );
};