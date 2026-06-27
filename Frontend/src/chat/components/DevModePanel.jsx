import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Code2, User, Cpu, Gavel, Braces } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const DevModePanel = ({ data = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('json');

  const tabs = [
    { id: 'prompt', label: 'Prompt', icon: <User size={13} /> },
    { id: 'solution1', label: 'Solution 1', icon: <Cpu size={13} /> },
    { id: 'solution2', label: 'Solution 2', icon: <Cpu size={13} /> },
    { id: 'judge', label: 'Judge', icon: <Gavel size={13} /> },
    { id: 'json', label: 'Raw JSON', icon: <Braces size={13} /> },
  ];

  const getTabContent = () => {
    const judge = data.judge_recommendation || {};

    switch (activeTab) {
      case 'prompt':
        return data.message || '';
      case 'solution1':
        return data.solution_1 || '';
      case 'solution2':
        return data.solution_2 || '';
      case 'judge':
        return `Solution 1 Score: ${judge.solution_1_score || 0}/10\nSolution 2 Score: ${judge.solution_2_score || 0}/10\n\nRecommendation: ${
          (judge.solution_1_score || 0) > (judge.solution_2_score || 0)
            ? 'Solution 1 is preferred'
            : (judge.solution_2_score || 0) > (judge.solution_1_score || 0)
            ? 'Solution 2 is preferred'
            : 'Both solutions are equally good'
        }`;
      case 'json':
        return JSON.stringify(data, null, 2);
      default:
        return '';
    }
  };

  const getLanguage = () => {
    return activeTab === 'json' ? 'json' : 'markdown';
  };

  return (
    <div
      className="rounded-2xl overflow-hidden animate-fade-in-up"
      style={{
        animationDelay: '600ms',
        background: 'rgba(10, 15, 30, 0.9)',
        border: '1px solid #1e293b',
      }}
    >
  
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors hover:bg-slate-800/30"
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg"
            style={{ background: 'rgba(34, 211, 238, 0.1)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
          >
            <Code2 size={16} style={{ color: '#22d3ee' }} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-200">Developer Mode</p>
            <p className="text-xs text-slate-500">Raw data & API response</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', border: '1px solid rgba(34, 211, 238, 0.2)' }}
          >
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          {isOpen ? (
            <ChevronDown size={16} className="text-slate-400" />
          ) : (
            <ChevronRight size={16} className="text-slate-400" />
          )}
        </div>
      </button>

    
      {isOpen && (
        <div className="border-t border-slate-800 animate-fade-in">
    
          <div className="flex gap-1 px-4 pt-3 pb-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
                style={{
                  background: activeTab === tab.id ? 'rgba(34, 211, 238, 0.15)' : 'rgba(30, 41, 59, 0.5)',
                  color: activeTab === tab.id ? '#22d3ee' : '#64748b',
                  border: `1px solid ${activeTab === tab.id ? 'rgba(34, 211, 238, 0.3)' : 'transparent'}`,
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="px-4 pb-4">
            <SyntaxHighlighter
              language={getLanguage()}
              style={oneDark}
              customStyle={{
                margin: 0,
                borderRadius: '12px',
                padding: '1rem',
                background: '#060b18',
                fontSize: '0.78rem',
                lineHeight: '1.6',
                fontFamily: 'JetBrains Mono, monospace',
                maxHeight: '400px',
                border: '1px solid #1e293b',
              }}
              showLineNumbers
              lineNumberStyle={{
                color: '#1e293b',
                minWidth: '2.5em',
                paddingRight: '1em',
              }}
            >
              {getTabContent()}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </div>
  );
};

export default DevModePanel;