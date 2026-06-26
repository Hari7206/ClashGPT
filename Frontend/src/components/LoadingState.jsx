import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

const SkeletonLine = ({ width = '100%', height = '14px', delay = 0 }) => (
  <div
    className="shimmer rounded-lg"
    style={{ width, height, animationDelay: `${delay}s` }}
  />
);

const SkeletonCard = ({ modelName, modelIcon, modelColor, delay = 0 }) => (
  <div
    className="glass-card rounded-2xl overflow-hidden"
    style={{
      animationDelay: `${delay}ms`,
      borderColor: `${modelColor}20`,
    }}
  >
    {/* Header */}
    <div
      className="flex items-center justify-between px-5 py-3.5 border-b"
      style={{ borderColor: `${modelColor}15`, background: `${modelColor}08` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
          style={{ background: `${modelColor}15`, border: `1px solid ${modelColor}30` }}
        >
          {modelIcon}
        </div>
        <div className="space-y-1.5">
          <SkeletonLine width="90px" height="12px" />
          <SkeletonLine width="55px" height="10px" />
        </div>
      </div>
      <div className="flex gap-1.5">
        {[1, 2, 3].map((i) => (
          <div key={i} className="shimmer w-8 h-8 rounded-lg" style={{ animationDelay: `${i * 0.1}s` }} />
        ))}
      </div>
    </div>

    {/* Content Skeleton */}
    <div className="px-5 py-4 space-y-3">
      <SkeletonLine width="100%" height="18px" delay={0.1} />
      <div className="space-y-2">
        <SkeletonLine width="100%" delay={0.15} />
        <SkeletonLine width="92%" delay={0.2} />
        <SkeletonLine width="87%" delay={0.25} />
      </div>
      <div className="space-y-2 mt-4">
        <SkeletonLine width="75%" height="12px" delay={0.3} />
        <div className="pl-4 space-y-1.5">
          <SkeletonLine width="88%" height="12px" delay={0.35} />
          <SkeletonLine width="80%" height="12px" delay={0.4} />
          <SkeletonLine width="85%" height="12px" delay={0.45} />
          <SkeletonLine width="70%" height="12px" delay={0.5} />
        </div>
      </div>
      <div
        className="shimmer rounded-xl"
        style={{ height: '80px', animationDelay: '0.55s' }}
      />
      <div className="space-y-2">
        <SkeletonLine width="95%" delay={0.6} />
        <SkeletonLine width="65%" delay={0.65} />
      </div>
    </div>

    {/* Footer Skeleton */}
    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800/50">
      <div className="flex gap-3">
        <SkeletonLine width="60px" height="10px" />
        <SkeletonLine width="80px" height="10px" />
      </div>
      <SkeletonLine width="70px" height="20px" />
    </div>
  </div>
);

const LoadingState = ({ model1Name, model1Icon, model1Color, model2Name, model2Icon, model2Color }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Loading Header */}
      <div className="flex items-center justify-center gap-4 py-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: '#22d3ee' }} className="animate-pulse" />
          <span className="text-slate-300 font-medium text-sm">Comparing AI models...</span>
          <Sparkles size={16} style={{ color: '#a78bfa' }} className="animate-pulse" />
        </div>
      </div>

      {/* Typing Indicator */}
      <div className="flex items-center justify-center gap-3">
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full"
          style={{ background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34, 211, 238, 0.2)' }}
        >
          <Cpu size={14} style={{ color: '#22d3ee' }} />
          <div className="flex items-center gap-1">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
          </div>
          <span className="text-xs text-slate-400">Generating responses</span>
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <SkeletonCard
          modelName={model1Name}
          modelIcon={model1Icon}
          modelColor={model1Color}
          delay={0}
        />
        <SkeletonCard
          modelName={model2Name}
          modelIcon={model2Icon}
          modelColor={model2Color}
          delay={200}
        />
      </div>

      {/* Judge Loading */}
      <div
        className="glass-card rounded-2xl p-6 space-y-4"
        style={{ border: '1px solid rgba(251, 191, 36, 0.1)' }}
      >
        <div className="flex items-center gap-2">
          <div className="shimmer w-8 h-8 rounded-xl" />
          <div className="space-y-1.5">
            <SkeletonLine width="100px" height="14px" />
            <SkeletonLine width="140px" height="11px" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="shimmer h-28 rounded-2xl" />
          <div className="shimmer h-28 rounded-2xl" />
        </div>
        <SkeletonLine width="100%" height="48px" />
      </div>
    </div>
  );
};

export default LoadingState;
