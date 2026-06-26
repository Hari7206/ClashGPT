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
import { countWords } from '../utils/data';

const AIResponseCard = ({
  modelName,
  modelIcon,
  modelColor,
  content,
  timestamp,
  animationDelay = 0,
  onRegenerate,
}) => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const wordCount = countWords(content);
  const readTime = Math.ceil(wordCount / 200);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div
        className="glass-card rounded-2xl overflow-hidden animate-fade-in-up"
        style={{
          animationDelay: `${animationDelay}ms`,
          borderColor: `${modelColor}25`,
          boxShadow: `0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px ${modelColor}15`,
        }}
      >
        {/* Card Header */}
        <div
          className="flex items-center justify-between px-5 py-3.5"
          style={{
            background: `linear-gradient(135deg, ${modelColor}10, transparent)`,
            borderBottom: `1px solid ${modelColor}20`,
          }}
        >
          <div className="flex items-center gap-3">
            {/* Model Avatar */}
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{
                background: `${modelColor}15`,
                border: `1px solid ${modelColor}30`,
                boxShadow: `0 0 12px ${modelColor}20`,
              }}
            >
              {modelIcon}
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">{modelName}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="inline-flex items-center gap-1 text-xs"
                  style={{ color: modelColor }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: modelColor, boxShadow: `0 0 4px ${modelColor}` }}
                  />
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="btn-icon p-2 text-xs"
              title="Copy response"
              aria-label="Copy response"
            >
              {copied ? (
                <Check size={15} style={{ color: '#34d399' }} />
              ) : (
                <Copy size={15} />
              )}
            </button>
            <button
              onClick={onRegenerate}
              className="btn-icon p-2"
              title="Regenerate"
              aria-label="Regenerate response"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="btn-icon p-2"
              title={expanded ? 'Collapse' : 'Expand'}
              aria-label={expanded ? 'Collapse' : 'Expand'}
            >
              {expanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div
          className="px-5 py-4 overflow-y-auto transition-all duration-300"
          style={{
            maxHeight: expanded ? '100vh' : '420px',
          }}
        >
          <MarkdownRenderer content={content} />
        </div>

        {/* Card Footer */}
        <div
          className="flex items-center justify-between px-5 py-3 border-t"
          style={{ borderColor: `${modelColor}15` }}
        >
          <div className="flex items-center gap-3 text-xs text-slate-500">
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
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: `${modelColor}15`,
              color: modelColor,
              border: `1px solid ${modelColor}25`,
            }}
          >
            AI Response
          </div>
        </div>
      </div>

      {/* Expanded modal overlay */}
      {expanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
          onClick={() => setExpanded(false)}
        >
          <div
            className="glass-card rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in"
            style={{ borderColor: `${modelColor}30` }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between px-6 py-4 border-b"
              style={{ borderColor: `${modelColor}20` }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{modelIcon}</span>
                <h3 className="font-semibold text-slate-100">{modelName}</h3>
              </div>
              <button onClick={() => setExpanded(false)} className="btn-icon p-2">
                <X size={16} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
              <MarkdownRenderer content={content} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIResponseCard;
