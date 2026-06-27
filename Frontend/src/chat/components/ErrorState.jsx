import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft, Wifi, ServerCrash } from 'lucide-react';

const ErrorState = ({ message, onRetry, onGoBack }) => {
  return (
    <div className="flex items-center justify-center py-12 animate-fade-in-up">
      <div
        className="glass-card rounded-3xl p-8 max-w-md w-full text-center"
        style={{
          border: '1px solid rgba(239, 68, 68, 0.2)',
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.08)',
        }}
      >
     
        <div className="flex items-center justify-center mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center animate-bounce-in"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.08))',
              border: '1px solid rgba(239,68,68,0.25)',
            }}
          >
            <ServerCrash size={36} style={{ color: '#ef4444' }} />
          </div>
        </div>

        <h3 className="text-xl font-bold text-slate-100 mb-2">
          Something went wrong
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed mb-2">
          {message || "We couldn't connect to the AI models. This might be a temporary issue."}
        </p>
        <div
          className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-6"
        >
          <Wifi size={12} />
          <span>Check your connection and try again</span>
        </div>

        <div
          className="flex items-start gap-3 p-3 rounded-xl mb-6 text-left"
          style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.15)' }}
        >
          <AlertTriangle size={15} style={{ color: '#ef4444', flexShrink: 0, marginTop: 1 }} />
          <p className="text-xs text-slate-400">
            The AI comparison service is temporarily unavailable. Our team has been notified and is working on a fix.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onGoBack}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #334155',
              color: '#94a3b8',
            }}
          >
            <ArrowLeft size={15} />
            Go Back
          </button>
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, rgba(239,68,68,0.2), rgba(239,68,68,0.15))',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
            }}
          >
            <RefreshCw size={15} />
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorState;
