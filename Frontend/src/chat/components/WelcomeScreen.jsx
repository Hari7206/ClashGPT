// chat/components/WelcomeScreen.jsx
import React from 'react';
import {
  Zap,
  GitCompare,
  Sparkles,
  Trophy,
  ArrowRight,
  Code2,
  Brain,
} from 'lucide-react';

const EXAMPLE_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Compare React vs Vue.js for 2025",
  "What is the best way to learn machine learning?",
  "Write a Python function to sort a list of dictionaries",
  "What are the key differences between SQL and NoSQL?",
  "Explain the concept of recursion with an example",
];

const FEATURES = [
  {
    icon: <GitCompare size={20} />,
    title: 'Side-by-Side Comparison',
    desc: 'Compare two AI models simultaneously',
    color: '#22d3ee',
  },
  {
    icon: <Trophy size={20} />,
    title: 'AI Judge Scoring',
    desc: 'Objective 1-10 scoring for each response',
    color: '#fbbf24',
  },
  {
    icon: <Code2 size={20} />,
    title: 'Rich Markdown Rendering',
    desc: 'Code blocks, tables, and full markdown',
    color: '#a78bfa',
  },
  {
    icon: <Brain size={20} />,
    title: 'Multiple AI Models',
    desc: 'Mistral, Cohere, GPT-4, Claude & more',
    color: '#34d399',
  },
];

const WelcomeScreen = ({ onSelectPrompt }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 animate-fade-in-up min-h-[60vh]">
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center mb-5">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center animate-float"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(34,211,238,0.3)',
              boxShadow: '0 0 40px rgba(34,211,238,0.2), 0 0 80px rgba(139,92,246,0.1)',
            }}
          >
            <Zap
              size={36}
              style={{
                color: '#22d3ee',
                filter: 'drop-shadow(0 0 8px rgba(34,211,238,0.8))',
              }}
              fill="rgba(34,211,238,0.3)"
            />
          </div>
        </div>

        <h1
          className="text-4xl sm:text-5xl font-black mb-3 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, #f1f5f9, #94a3b8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Welcome to ClashGPT
        </h1>
        <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
          The ultimate AI model battle arena. Ask one question,
          get{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 600,
            }}
          >
            multiple perspectives
          </span>
          , and see who wins.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl mb-10">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="glass-card rounded-2xl p-4 text-center transition-all hover:scale-[1.03] cursor-default"
            style={{
              border: `1px solid ${feature.color}20`,
            }}
          >
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl mx-auto mb-3"
              style={{
                background: `${feature.color}15`,
                border: `1px solid ${feature.color}25`,
                color: feature.color,
              }}
            >
              {feature.icon}
            </div>
            <p className="text-xs font-semibold text-slate-300 leading-tight mb-1">{feature.title}</p>
            <p className="text-xs text-slate-500 leading-tight hidden sm:block">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Example Prompts */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: '#a78bfa' }} />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Try a prompt</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {EXAMPLE_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              onClick={() => onSelectPrompt(prompt)}
              className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm text-left transition-all group hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid #334155',
                color: '#94a3b8',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(34, 211, 238, 0.3)';
                e.currentTarget.style.color = '#e2e8f0';
                e.currentTarget.style.background = 'rgba(34, 211, 238, 0.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#334155';
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.background = 'rgba(15, 23, 42, 0.8)';
              }}
            >
              <span className="flex-1 line-clamp-1">{prompt}</span>
              <ArrowRight size={13} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#22d3ee' }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;