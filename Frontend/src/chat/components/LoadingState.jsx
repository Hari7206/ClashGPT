import React from 'react';
import { Cpu, Sparkles } from 'lucide-react';

const SkeletonLine = ({ width = '100%', height = '14px', delay = 0 }) => {
  return (
    <div
      className="shimmer rounded-md"
      style={{
        width,
        height,
        animationDelay: `${delay}ms`, // Switched to ms for project-wide consistency
      }}
    />
  );
};

const SkeletonCard = ({ modelName, modelIcon, modelColor }) => {
  return (
    <div 
      className="glass-card rounded-2xl overflow-hidden border transition-all duration-300"
      style={{
        borderColor: modelColor ? `${modelColor}25` : '#1e293b',
        boxShadow: modelColor ? `0 0 20px ${modelColor}10` : 'none',
      }}
    >
      {/* Header */}
      <div 
        className="px-5 py-3 border-b flex items-center gap-2"
        style={{ 
          borderColor: modelColor ? `${modelColor}20` : '#1e293b/50',
          background: modelColor ? `linear-gradient(135deg, ${modelColor}05, transparent)` : 'transparent'
        }}
      >
        <span className="flex-shrink-0" style={{ color: modelColor || 'inherit' }}>
          {modelIcon}
        </span>
        <span className="text-sm font-medium text-slate-300">{modelName}</span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 space-y-3">
        <SkeletonLine height="18px" delay={0} />
        <SkeletonLine width="92%" delay={75} />
        <SkeletonLine width="85%" delay={150} />
        <SkeletonLine width="70%" delay={225} />
      </div>
    </div>
  );
};

const LoadingState = ({
  model1Name,
  model1Icon,
  model1Color,
  model2Name,
  model2Icon,
  model2Color,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Status */}
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <div className="flex items-center gap-2 text-slate-400 font-medium">
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
          <span>Comparing AI models...</span>
          <Sparkles size={16} className="text-amber-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Cpu size={14} className="animate-spin [animation-duration:3s]" />
          <span>Generating responses...</span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SkeletonCard
          modelName={model1Name}
          modelIcon={model1Icon}
          modelColor={model1Color}
        />
        <SkeletonCard
          modelName={model2Name}
          modelIcon={model2Icon}
          modelColor={model2Color}
        />
      </div>
    </div>
  );
};

export default LoadingState;