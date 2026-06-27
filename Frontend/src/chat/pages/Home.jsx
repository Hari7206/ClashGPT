import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import AIResponseCard from "../components/AIResponseCard";
import JudgePanel from "../components/JudgePanel";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import PromptInput from "../components/PromptInput";
import WelcomeScreen from "../components/WelcomeScreen";
import { useChat } from "../hooks/useChat";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { messages, isLoading, error, sendMessage } = useChat();

  // 🔍 DEBUG: Log messages to see what's coming from the context
  console.log("🔍 Home - Current messages:", messages);
  console.log("🔍 Home - Is loading:", isLoading);
  console.log("🔍 Home - Error:", error);
  
  // Log each message structure
  messages.forEach((msg, index) => {
    console.log(`📝 Message ${index}:`, {
      type: msg.type,
      has_solution_1: !!msg.solution_1,
      has_solution_2: !!msg.solution_2,
      has_judge: !!msg.judge_recommendation,
      content_preview: msg.content?.substring(0, 50) || msg.solution_1?.substring(0, 50) || "empty"
    });
  });

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">

      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex flex-col flex-1">

        {/* Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={() => {}}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* EMPTY STATE */}
          {messages.length === 0 && !isLoading && (
            <WelcomeScreen onSelectPrompt={sendMessage} />
          )}

          {/* MESSAGES */}
          {messages.map((msg, i) => (
            <div key={i}>
              {/* Show AI Response Card for both user and AI messages */}
              {msg.type === "user" ? (
                <div className="flex justify-end">
                  <div className="max-w-3xl bg-slate-800/80 rounded-2xl px-5 py-3 text-slate-200">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <>
                  {/* Show solution_1 if it exists */}
                  {msg.solution_1 && (
                    <AIResponseCard
                      modelName="Mistral AI"
                      modelIcon="🧠"
                      modelColor="#22d3ee"
                      content={msg.solution_1}
                      timestamp={msg.timestamp}
                    />
                  )}
                  
                  {/* Show solution_2 if it exists */}
                  {msg.solution_2 && (
                    <AIResponseCard
                      modelName="Cohere AI"
                      modelIcon="⚡"
                      modelColor="#a78bfa"
                      content={msg.solution_2}
                      timestamp={msg.timestamp}
                    />
                  )}
                </>
              )}

              {/* Judge (only if exists) */}
              {msg.judge_recommendation && msg.solution_1 && msg.solution_2 && (
                <JudgePanel
                  score1={msg.judge_recommendation.solution_1_score || 0}
                  score2={msg.judge_recommendation.solution_2_score || 0}
                  model1Name="Mistral"
                  model2Name="Cohere"
                  model1Icon="🧠"
                  model2Icon="⚡"
                  model1Color="#22d3ee"
                  model2Color="#a78bfa"
                  content1={msg.solution_1}
                  content2={msg.solution_2}
                />
              )}
            </div>
          ))}

          {/* LOADING */}
          {isLoading && <LoadingState 
            model1Name="Mistral"
            model1Icon="🧠"
            model1Color="#22d3ee"
            model2Name="Cohere"
            model2Icon="⚡"
            model2Color="#a78bfa"
          />}

          {/* ERROR */}
          {error && <ErrorState message={error} onRetry={() => {}} />}

        </div>

        {/* INPUT */}
        <PromptInput onSubmit={sendMessage} isLoading={isLoading} />

      </div>
    </div>
  );
}

export default Home;