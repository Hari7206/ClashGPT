// chat/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIResponseCard from "../components/AIResponseCard";
import JudgePanel from "../components/JudgePanel";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import PromptInput from "../components/PromptInput";
import WelcomeScreen from "../components/WelcomeScreen";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../../auth/hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { isDark } = useTheme();
  const { 
    messages, 
    isLoading, 
    error, 
    sendMessage,
    chats,
    currentChatId,
    loadChat,
    createNewChat,
    deleteChatById,
    clearMessages,
    loadChats,
  } = useChat();
  
  const { user } = useAuth();

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    
    if (token) {
      localStorage.setItem('token', token);
      
      if (userParam) {
        try {
          const userData = JSON.parse(decodeURIComponent(userParam));
          localStorage.setItem('user', JSON.stringify(userData));
          console.log("✅ Google login successful:", userData);
        } catch (e) {
          console.error('Failed to parse user data', e);
        }
      }
      
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  const handleNewChat = async () => {
    const newChat = await createNewChat();
    if (newChat) {
      clearMessages();
    }
  };

  const handleSelectConversation = (chat) => {
    loadChat(chat._id);
  };

  const handleRetry = () => {
    if (currentChatId) {
      loadChat(currentChatId);
    } else {
      loadChats();
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const bgColor = isDark ? 'bg-[#0d0d0d]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50';
  const borderColor = isDark ? 'border-[#1a1a1a]' : 'border-gray-200';

  return (
    <div className={`flex h-screen ${bgColor} ${textColor} overflow-hidden`}>
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onNewChat={handleNewChat}
        onSelectConversation={handleSelectConversation}
        activeConversationId={currentChatId}
        conversations={chats}
        models={[
          { id: 'mistral', name: 'Mistral AI', icon: '🧠', badge: 'v0.3' },
          { id: 'cohere', name: 'Cohere AI', icon: '⚡', badge: 'v2.1' },
        ]}
      />
      
      <div className="flex flex-col flex-1 min-w-0">
        <Navbar
          onToggleSidebar={toggleSidebar}
          onNewChat={handleNewChat}
          user={user}
        />

        <div className={`flex-1 overflow-y-auto ${bgColor}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6">
            {messages.length === 0 && !isLoading && (
              <WelcomeScreen onSelectPrompt={sendMessage} />
            )}

            {messages.map((msg, i) => (
              <div key={i}>
                {msg.type === "user" ? (
                  <div className="flex justify-end">
                    <div className={`max-w-2xl rounded-2xl px-5 py-3 ${
                      isDark 
                        ? 'bg-[#2a2a2a] text-gray-200' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {msg.solution_1 && (
                      <AIResponseCard
                        modelName="Mistral AI"
                        modelIcon="🧠"
                        modelColor="#3b82f6"
                        content={msg.solution_1}
                        timestamp={msg.timestamp}
                        onRegenerate={() => {
                          const lastUserMsg = messages.filter(m => m.type === 'user').pop();
                          if (lastUserMsg) {
                            sendMessage(lastUserMsg.content);
                          }
                        }}
                      />
                    )}
                    
                    {msg.solution_2 && (
                      <AIResponseCard
                        modelName="Cohere AI"
                        modelIcon="⚡"
                        modelColor="#60a5fa"
                        content={msg.solution_2}
                        timestamp={msg.timestamp}
                        onRegenerate={() => {
                          const lastUserMsg = messages.filter(m => m.type === 'user').pop();
                          if (lastUserMsg) {
                            sendMessage(lastUserMsg.content);
                          }
                        }}
                      />
                    )}
                  </div>
                )}

                {msg.judge_recommendation && msg.solution_1 && msg.solution_2 && (
                  <JudgePanel
                    score1={msg.judge_recommendation.solution_1_score || 0}
                    score2={msg.judge_recommendation.solution_2_score || 0}
                    model1Name="Mistral"
                    model2Name="Cohere"
                    model1Icon="🧠"
                    model2Icon="⚡"
                    model1Color="#3b82f6"
                    model2Color="#60a5fa"
                    content1={msg.solution_1}
                    content2={msg.solution_2}
                  />
                )}
              </div>
            ))}

            {isLoading && (
              <LoadingState 
                model1Name="Mistral"
                model1Icon="🧠"
                model1Color="#3b82f6"
                model2Name="Cohere"
                model2Icon="⚡"
                model2Color="#60a5fa"
              />
            )}

            {error && (
              <ErrorState 
                message={error} 
                onRetry={handleRetry}
                onGoBack={handleGoBack}
              />
            )}
          </div>
        </div>

        <div className={`border-t ${borderColor} p-4`}>
          <div className="max-w-4xl mx-auto">
            <PromptInput onSubmit={sendMessage} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;