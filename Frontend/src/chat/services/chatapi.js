import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000",
});

export const graphAPI = async (message) => {
  try {
    const res = await API.post("/use-graph", {
      message,
    });
    
    console.log("🌐 API Response:", res.data);
    return res.data;
  } catch (error) {
    console.error("💥 API Error:", error);
    throw error;
  }
};