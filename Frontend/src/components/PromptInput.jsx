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

const PromptInput = ({ onSubmit, isLoading, placeholder }) => {
  const [value, setValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea
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

  return (
    <div className="relative">
      {/* Input Container */}
      <div
        className="rounded-2xl transition-all duration-200"
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          border: `1px solid ${canSubmit ? 'rgba(34, 211, 238, 0.4)' : '#334155'}`,
          boxShadow: canSubmit
            ? '0 0 0 3px rgba(34, 211, 238, 0.08), 0 8px 32px rgba(0,0,0,0.3)'
            : '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder || "Ask anything — ClashGPT will compare AI models for you..."}
          disabled={isLoading}
          rows={1}
          style={{
            resize: 'none',
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#e2e8f0',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            width: '100%',
            padding: '1rem 1.25rem',
            paddingBottom: '0.5rem',
            maxHeight: '200px',
            overflowY: 'auto',
          }}
          className="placeholder-slate-500"
        />

        {/* Bottom toolbar */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-1">
            {/* Attachment */}
            <button
              className="btn-icon p-2"
              title="Attach file"
              aria-label="Attach file"
              disabled={isLoading}
            >
              <Paperclip size={16} />
            </button>

            {/* Voice */}
            <button
              className="btn-icon p-2"
              onClick={() => setIsRecording(!isRecording)}
              title={isRecording ? 'Stop recording' : 'Voice input'}
              aria-label={isRecording ? 'Stop recording' : 'Voice input'}
              disabled={isLoading}
              style={{
                color: isRecording ? '#ef4444' : '#94a3b8',
                background: isRecording ? 'rgba(239, 68, 68, 0.1)' : undefined,
                border: isRecording ? '1px solid rgba(239, 68, 68, 0.3)' : undefined,
                animation: isRecording ? 'pulse-glow 1s ease-in-out infinite' : 'none',
              }}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Hint text */}
            <span className="text-xs text-slate-600 ml-2 hidden sm:flex items-center gap-1">
              <CornerDownLeft size={11} />
              Send · Shift+Enter for new line
            </span>
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            id="send-button"
            aria-label="Send message"
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200"
            style={{
              background: canSubmit
                ? 'linear-gradient(135deg, #22d3ee, #8b5cf6)'
                : 'rgba(30, 41, 59, 0.6)',
              color: canSubmit ? 'white' : '#475569',
              border: canSubmit ? 'none' : '1px solid #334155',
              boxShadow: canSubmit ? '0 4px 15px rgba(34, 211, 238, 0.3)' : 'none',
              transform: canSubmit ? 'scale(1)' : 'scale(0.98)',
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
                <Zap size={15} fill={canSubmit ? 'white' : '#475569'} />
                <span>Clash</span>
                <Send size={13} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Character count */}
      {value.length > 200 && (
        <div className="absolute -top-6 right-1 text-xs text-slate-500">
          {value.length} chars
        </div>
      )}
    </div>
  );
};

export default PromptInput;
