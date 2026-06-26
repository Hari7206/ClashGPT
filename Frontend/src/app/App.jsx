import React, { useState, useRef, useEffect } from 'react';
import { User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import AIResponseCard from '../components/AIResponseCard';
import JudgePanel from '../components/JudgePanel';
import DevModePanel from '../components/DevModePanel';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import PromptInput from '../components/PromptInput';
import WelcomeScreen from '../components/WelcomeScreen';
import { SAMPLE_RESPONSE } from '../utils/data';

// Model configs
const MODEL_1 = {
  name: 'Mistral AI',
  icon: '🧠',
  color: '#22d3ee',
};

const MODEL_2 = {
  name: 'Cohere AI',
  icon: '⚡',
  color: '#a78bfa',
};

// Simulate API call
const simulateAPICall = (prompt) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Randomly show error 10% of the time for demo
      if (Math.random() < 0.05) {
        reject(new Error('API Error: Failed to fetch responses'));
      } else {
        resolve({
          ...SAMPLE_RESPONSE,
          message: prompt,
        });
      }
    }, 2800);
  });
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (prompt) => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    // Add user message
    const userMsg = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);

    try {
      const data = await simulateAPICall(prompt);

      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        data,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (prompt) => {
    handleSubmit(prompt);
  };

  const handleNewChat = () => {
    setMessages([]);
    setError(null);
    setActiveConversationId(null);
  };

  const handleSelectConversation = (conv) => {
    setActiveConversationId(conv.id);
    setMessages([]);
    setError(null);
    // In real app, load from API. For demo, add sample message.
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          type: 'user',
          content: conv.preview,
          timestamp: conv.timestamp,
        },
        {
          id: 2,
          type: 'ai',
          data: { ...SAMPLE_RESPONSE, message: conv.preview },
          timestamp: new Date(conv.timestamp.getTime() + 3000),
        },
      ]);
    }, 300);
  };

  const handleRetry = () => {
    setError(null);
    // Retry last message
    const lastUserMsg = [...messages].reverse().find(m => m.type === 'user');
    if (lastUserMsg) {
      setMessages(prev => prev.filter(m => m.type !== 'ai' || m.id !== messages[messages.length - 1]?.id));
      handleSubmit(lastUserMsg.content);
    }
  };

  const hasMessages = messages.length > 0;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: '#020617' }}
    >
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isOpen={true}
          onClose={() => {}}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversationId}
        />
      </div>

      {/* Mobile Sidebar */}
      <div className="lg:hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          onSelectConversation={handleSelectConversation}
          activeConversationId={activeConversationId}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onNewChat={handleNewChat}
        />

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">

            {/* Welcome or Messages */}
            {!hasMessages && !isLoading && !error && (
              <WelcomeScreen onSelectPrompt={handleSelectPrompt} />
            )}

            {/* Message Thread */}
            {messages.map((msg) => {
              if (msg.type === 'user') {
                return (
                  <UserMessage key={msg.id} content={msg.content} timestamp={msg.timestamp} />
                );
              }

              if (msg.type === 'ai') {
                return (
                  <AISection key={msg.id} data={msg.data} timestamp={msg.timestamp} />
                );
              }

              return null;
            })}

            {/* Loading State */}
            {isLoading && (
              <LoadingState
                model1Name={MODEL_1.name}
                model1Icon={MODEL_1.icon}
                model1Color={MODEL_1.color}
                model2Name={MODEL_2.name}
                model2Icon={MODEL_2.icon}
                model2Color={MODEL_2.color}
              />
            )}

            {/* Error State */}
            {error && !isLoading && (
              <ErrorState
                message={error}
                onRetry={handleRetry}
                onGoBack={handleNewChat}
              />
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div
          className="border-t sticky bottom-0"
          style={{
            borderColor: '#1e293b',
            background: 'rgba(2, 6, 23, 0.95)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-w-5xl mx-auto px-4 py-4">
            <PromptInput
              onSubmit={handleSubmit}
              isLoading={isLoading}
              value={inputValue}
              onChange={setInputValue}
            />
            <p className="text-center text-xs text-slate-600 mt-2">
              ClashGPT can make mistakes. Compare AI responses critically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// User message bubble
const UserMessage = ({ content, timestamp }) => {
  return (
    <div className="flex justify-end animate-slide-in-right">
      <div className="flex items-end gap-3 max-w-2xl">
        <div className="flex flex-col items-end gap-1.5">
          <div
            className="px-5 py-3.5 rounded-2xl rounded-br-md max-w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.15))',
              border: '1px solid rgba(34,211,238,0.2)',
              boxShadow: '0 4px 20px rgba(34,211,238,0.08)',
            }}
          >
            <p className="text-slate-100 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {content}
            </p>
          </div>
          <span className="text-xs text-slate-500 pr-1">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mb-5"
          style={{
            background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
            color: 'white',
          }}
        >
          U
        </div>
      </div>
    </div>
  );
};

// AI comparison section
const AISection = ({ data, timestamp }) => {
  const [showDev, setShowDev] = useState(false);

  return (
    <div className="space-y-6">
      {/* AI Response Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <AIResponseCard
          modelName={MODEL_1.name}
          modelIcon={MODEL_1.icon}
          modelColor={MODEL_1.color}
          content={data.solution_1}
          timestamp={timestamp}
          animationDelay={0}
          onRegenerate={() => {}}
        />
        <AIResponseCard
          modelName={MODEL_2.name}
          modelIcon={MODEL_2.icon}
          modelColor={MODEL_2.color}
          content={data.solution_2}
          timestamp={timestamp}
          animationDelay={150}
          onRegenerate={() => {}}
        />
      </div>

      {/* Judge Panel */}
      <JudgePanel
        score1={data.judge_recommendation.solution_1_score}
        score2={data.judge_recommendation.solution_2_score}
        model1Name={MODEL_1.name}
        model1Icon={MODEL_1.icon}
        model1Color={MODEL_1.color}
        model2Name={MODEL_2.name}
        model2Icon={MODEL_2.icon}
        model2Color={MODEL_2.color}
        content1={data.solution_1}
        content2={data.solution_2}
      />

      {/* Developer Mode */}
      <DevModePanel data={data} />
    </div>
  );
};

export default App;