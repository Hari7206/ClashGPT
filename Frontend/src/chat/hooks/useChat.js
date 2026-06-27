import { useContext } from "react";
import { ChatContext } from "../context/chatContext";

export const useChat = () => {
  return useContext(ChatContext);
};