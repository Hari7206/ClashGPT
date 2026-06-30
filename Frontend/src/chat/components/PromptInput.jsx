// chat/components/PromptInput.jsx
import React, { useRef, useState, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Mic,
  MicOff,
  Loader2,
  CornerDownLeft,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const PromptInput = ({ onSubmit, isLoading, placeholder }) => {
  const { isDark } = useTheme();
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return;
    onSubmit(value.trim());
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSubmit = value.trim().length > 0 && !isLoading;

  // ✅ Light mode: white background with gray border
  const bgColor = isDark ? '#1a1a1a' : '#ffffff';
  const borderColor = canSubmit ? (isDark ? '#4a4a4a' : '#3b82f6') : (isDark ? '#2a2a2a' : '#e5e7eb');
  const textColor = isDark ? '#e5e7eb' : '#1f2937';

  return (
    <div className="relative">
      <div
        className="rounded-2xl transition-all duration-200"
        style={{
          background: bgColor,
          border: `1px solid ${borderColor}`,
          boxShadow: canSubmit
            ? isDark ? '0 0 0 3px rgba(59,130,246,0.08), 0 8px 32px rgba(0,0,0,0.3)' : '0 0 0 3px rgba(59,130,246,0.05), 0 8px 32px rgba(0,0,0,0.06)'
            : isDark ? '0 8px 32px rgba(0,0,0,0.15)' : '0 8px 32px rgba(0,0,0,0.06)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask anything — ClashGPT will compare AI models for you..."}
          disabled={isLoading}
          rows={1}
          className="w-full bg-transparent border-none outline-none font-sans text-sm leading-6 px-5 pt-4 pb-2 resize-none max-h-[200px] overflow-y-auto"
          style={{ color: textColor }}
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            <button
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              title="Attach file"
              aria-label="Attach file"
              disabled={isLoading}
            >
              <Paperclip size={16} className={isDark ? 'text-gray-500' : 'text-gray-400'} />
            </button>

            <button
              className={`p-2 rounded-lg transition-colors ${isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100'}`}
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              aria-label={isRecording ? 'Stop recording' : 'Voice input'}
              disabled={isLoading}
              style={{
                color: isRecording ? '#ef4444' : (isDark ? '#6b7280' : '#9ca3af'),
                background: isRecording ? 'rgba(239, 68, 68, 0.1)' : undefined,
              }}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'} ml-2 hidden sm:flex items-center gap-1`}>
              <CornerDownLeft size={11} />
              Send · Shift+Enter for new line
            </span>
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                : isDark ? '#2a2a2a' : '#f3f4f6',
              color: canSubmit ? 'white' : (isDark ? '#4a4a4a' : '#9ca3af'),
              cursor: canSubmit ? 'pointer' : 'not-allowed',
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                <span>Comparing...</span>
              </>
            ) : (
              <>
                <Zap size={15} fill={canSubmit ? 'white' : (isDark ? '#4a4a4a' : '#9ca3af')} />
                <span>Clash</span>
                <Send size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptInput;