// chat/components/AIResponseCard.jsx
import React, { useState } from 'react';
import {
  Copy,
  RefreshCw,
  Maximize2,
  Minimize2,
  Check,
  Clock,
  FileText,
  X,
} from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';
import { useTheme } from '../context/ThemeContext';

const AIResponseCard = ({
  modelName,
  modelIcon,
  modelColor = '#3b82f6',
  content,
  timestamp,
  animationDelay = 0,
  onRegenerate,
}) => {
  const { isDark } = useTheme();
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const safeContent = content || "";
  const wordCount = safeContent.trim() ? safeContent.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200);

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Theme-based colors
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const textColor = isDark ? '#e5e7eb' : '#1f2937';
  const borderColor = isDark ? 'rgba(42,42,42,0.5)' : 'rgba(229,231,235,0.8)';
  const headerBg = isDark ? 'rgba(42,42,42,0.3)' : 'rgba(249,250,251,0.5)';
  const mutedColor = isDark ? '#6b7280' : '#9ca3af';
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100';

  return (
    <>
      <div
        className="rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          animationDelay: `${animationDelay}ms`,
          backgroundColor: bgColor,
          border: `1px solid ${borderColor}`,
          boxShadow: isDark 
            ? '0 4px 24px rgba(0,0,0,0.3)' 
            : '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{
            backgroundColor: headerBg,
            borderBottom: `1px solid ${borderColor}`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                backgroundColor: isDark ? 'rgba(42,42,42,0.8)' : 'rgba(243,244,246,0.9)',
                border: `1px solid ${borderColor}`,
              }}
            >
              {modelIcon}
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                {modelName}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className={`p-2 rounded-lg transition-colors ${hoverBg}`}
              title="Copy response"
            >
              {copied ? (
                <Check size={15} style={{ color: '#22c55e' }} />
              ) : (
                <Copy size={15} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              )}
            </button>
            <button
              onClick={onRegenerate}
              className={`p-2 rounded-lg transition-colors ${hoverBg}`}
              title="Regenerate"
            >
              <RefreshCw size={15} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className={`p-2 rounded-lg transition-colors ${hoverBg}`}
              title={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? (
                <Minimize2 size={15} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              ) : (
                <Maximize2 size={15} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              )}
            </button>
          </div>
        </div>

        {/* Content - THIS IS WHERE THE TEXT APPEARS */}
        <div
          className="px-5 py-4 overflow-y-auto transition-all duration-300"
          style={{
            maxHeight: expanded ? '100vh' : '420px',
            color: textColor,
            backgroundColor: bgColor,
          }}
        >
          <MarkdownRenderer content={safeContent} />
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-5 py-3"
          style={{
            borderTop: `1px solid ${borderColor}`,
            backgroundColor: headerBg,
          }}
        >
          <div className={`flex items-center gap-3 text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {formatTime(timestamp)}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={11} />
              {wordCount} words · {readTime} min read
            </span>
          </div>
          <div
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-100 text-gray-600'
            }`}
          >
            AI Response
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setExpanded(false)}
        >
          <div
            className={`rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in`}
            style={{
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 border-b`}
              style={{ borderColor: borderColor }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{modelIcon}</span>
                <h3 className={`font-semibold ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                  {modelName}
                </h3>
              </div>
              <button 
                onClick={() => setExpanded(false)} 
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              >
                <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </button>
            </div>
            <div 
              className="p-6 overflow-y-auto" 
              style={{ 
                maxHeight: 'calc(90vh - 80px)',
                color: textColor,
                backgroundColor: bgColor,
              }}
            >
              <MarkdownRenderer content={safeContent} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIResponseCard;