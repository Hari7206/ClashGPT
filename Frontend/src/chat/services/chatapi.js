// chat/services/chatapi.js
import axios from "axios";
const API = axios.create({
  baseURL: "http://localhost:3000", // ✅ Make sure this matches your backend port
  withCredentials: true, // ✅ Add this to send cookies
});
// Add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ============ CHAT APIs ============

// Get all user chats
export const getChats = async () => {
  try {
    const res = await API.get("/api/chat/");
    console.log("📋 Get Chats Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Get Chats Error:", error);
    throw error;
  }
};

// Create new chat
export const createChat = async (title = "New Chat") => {
  try {
    const res = await API.post("/api/chat/", { title });
    console.log("📝 Create Chat Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Create Chat Error:", error);
    throw error;
  }
};

// Get specific chat with battles
export const getChatById = async (chatId) => {
  try {
    const res = await API.get(`/api/chat/${chatId}`);
    console.log("📖 Get Chat By ID Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Get Chat By ID Error:", error);
    throw error;
  }
};

// Rename chat
export const renameChat = async (chatId, title) => {
  try {
    const res = await API.put(`/api/chat/${chatId}`, { title });
    console.log("✏️ Rename Chat Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Rename Chat Error:", error);
    throw error;
  }
};

// Delete chat
export const deleteChat = async (chatId) => {
  try {
    const res = await API.delete(`/api/chat/${chatId}`);
    console.log("🗑️ Delete Chat Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 Delete Chat Error:", error);
    throw error;
  }
};

// ============ GRAPH API ============

export const graphAPI = async (message, chatId = null) => {
  try {
    const res = await API.post("/use-graph", {
      message,
      chatId,
    });
    
    console.log("🌐 API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 API Error:", error);
    throw error;
  }
};