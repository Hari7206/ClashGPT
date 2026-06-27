import React, { useEffect, useState } from 'react';
import { Trophy, Handshake, TrendingUp, AlignLeft, Star } from 'lucide-react';
import { getQualityColor, getQualityLabel, countWords } from '../../../src/utils/helpers.js'; // Adjust path as needed

const ScoreCard = ({ modelName, modelIcon, modelColor, score, maxScore = 10, delay = 0, isWinner }) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const percentage = (score / maxScore) * 100;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const step = score / 30;
      const interval = setInterval(() => {
        current = Math.min(current + step, score);
        setDisplayScore(Math.round(current * 10) / 10);
        setProgressWidth((current / maxScore) * 100);
        if (current >= score) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [score, maxScore, delay]);

  return (
    <div
      className="relative p-5 rounded-2xl transition-all duration-300 animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        background: isWinner
          ? `linear-gradient(135deg, ${modelColor}12, rgba(15,23,42,0.9))`
          : 'rgba(15, 23, 42, 0.8)',
        border: `1px solid ${isWinner ? modelColor + '40' : '#334155'}`,
        boxShadow: isWinner ? `0 0 30px ${modelColor}20` : 'none',
      }}
    >
      {isWinner && (
        <div
          className="winner-badge absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f97316)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
          }}
        >
          <Trophy size={12} fill="white" />
          Winner
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: `${modelColor}15`,
              border: `1px solid ${modelColor}30`,
            }}
          >
            {modelIcon}
          </div>
          <div>
            <p className="font-semibold text-sm text-slate-200">{modelName}</p>
            <p className="text-xs" style={{ color: getQualityColor(score) }}>
              {getQualityLabel(score)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-3xl font-black"
            style={{ color: modelColor, fontVariantNumeric: 'tabular-nums' }}
          >
            {displayScore}
          </div>
          <div className="text-xs text-slate-500 font-medium">/ {maxScore}</div>
        </div>
      </div>

    
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progressWidth}%`,
            background: isWinner
              ? `linear-gradient(90deg, ${modelColor}, #fbbf24)`
              : `linear-gradient(90deg, ${modelColor}80, ${modelColor})`,
            boxShadow: isWinner ? `0 0 10px ${modelColor}60` : 'none',
          }}
        />
      </div>

      <div className="flex gap-1 mt-3">
        {Array.from({ length: maxScore }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i < score ? modelColor : '#1e293b',
              transitionDelay: `${delay + i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ComparisonTable = ({ model1Name, model1Icon, score1, content1, model2Name, model2Icon, score2, content2 }) => {
  const words1 = countWords(content1);
  const words2 = countWords(content2);
  const winner = score1 > score2 ? 'model1' : score2 > score1 ? 'model2' : 'tie';

  const rows = [
    {
      label: 'Score',
      icon: <Star size={14} />,
      val1: `${score1} / 10`,
      val2: `${score2} / 10`,
      winner: score1 > score2 ? 'model1' : score2 > score1 ? 'model2' : 'tie',
    },
    {
      label: 'Quality',
      icon: <TrendingUp size={14} />,
      val1: getQualityLabel(score1),
      val2: getQualityLabel(score2),
      winner: score1 > score2 ? 'model1' : score2 > score1 ? 'model2' : 'tie',
    },
    {
      label: 'Response Length',
      icon: <AlignLeft size={14} />,
      val1: `${words1} words`,
      val2: `${words2} words`,
      winner: words1 > words2 ? 'model1' : words2 > words1 ? 'model2' : 'tie',
    },
    {
      label: 'Winner',
      icon: <Trophy size={14} />,
      val1: winner === 'model1' ? '🏆 Winner' : winner === 'tie' ? '🤝 Tied' : '—',
      val2: winner === 'model2' ? '🏆 Winner' : winner === 'tie' ? '🤝 Tied' : '—',
      winner,
    },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(30, 41, 59, 0.8)' }}>
            <th className="px-4 py-3 text-left text-slate-400 font-semibold text-xs uppercase tracking-wider">
              Metric
            </th>
            <th className="px-4 py-3 text-left text-cyan-400 font-semibold text-xs">
              {model1Icon} {model1Name}
            </th>
            <th className="px-4 py-3 text-left text-violet-400 font-semibold text-xs">
              {model2Icon} {model2Name}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className="border-t border-slate-800/50 transition-colors hover:bg-slate-800/20"
              style={{
                background: i % 2 === 0 ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
              }}
            >
              <td className="px-4 py-3 text-slate-400 flex items-center gap-2">
                {row.icon}
                {row.label}
              </td>
              <td
                className="px-4 py-3 font-medium"
                style={{
                  color: row.winner === 'model1' ? '#22d3ee' : '#94a3b8',
                  background: row.winner === 'model1' ? 'rgba(34,211,238,0.05)' : 'transparent',
                }}
              >
                {row.val1}
              </td>
              <td
                className="px-4 py-3 font-medium"
                style={{
                  color: row.winner === 'model2' ? '#a78bfa' : '#94a3b8',
                  background: row.winner === 'model2' ? 'rgba(167,139,250,0.05)' : 'transparent',
                }}
              >
                {row.val2}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const JudgePanel = ({
  score1,
  score2,
  model1Name,
  model1Icon,
  model1Color,
  model2Name,
  model2Icon,
  model2Color,
  content1,
  content2,
}) => {
  const isTie = score1 === score2;
  const winner = score1 > score2 ? { name: model1Name, icon: model1Icon, color: model1Color }
    : score2 > score1 ? { name: model2Name, icon: model2Icon, color: model2Color }
    : null;

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(251,191,36,0.2), rgba(249,115,22,0.2))',
            border: '1px solid rgba(251,191,36,0.3)',
          }}
        >
          <Trophy size={20} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-100">AI Judge</h2>
          <p className="text-xs text-slate-400">Objective model evaluation</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ScoreCard
          modelName={model1Name}
          modelIcon={model1Icon}
          modelColor={model1Color}
          score={score1}
          delay={200}
          isWinner={!isTie && score1 > score2}
        />
        <ScoreCard
          modelName={model2Name}
          modelIcon={model2Icon}
          modelColor={model2Color}
          score={score2}
          delay={400}
          isWinner={!isTie && score2 > score1}
        />
      </div>

      <div
        className="flex items-center justify-center gap-3 py-4 px-6 rounded-2xl animate-bounce-in"
        style={{
          animationDelay: '800ms',
          background: isTie
            ? 'linear-gradient(135deg, rgba(100,116,139,0.15), rgba(51,65,85,0.15))'
            : `linear-gradient(135deg, ${winner?.color}15, ${winner?.color}08)`,
          border: isTie
            ? '1px solid rgba(100,116,139,0.3)'
            : `1px solid ${winner?.color}30`,
          boxShadow: !isTie ? `0 0 30px ${winner?.color}15` : 'none',
        }}
      >
        {isTie ? (
          <>
            <Handshake size={24} className="text-slate-400" />
            <div className="text-center">
              <p className="font-bold text-slate-200 text-lg">🤝 It's a Tie!</p>
              <p className="text-xs text-slate-400 mt-0.5">Both models performed equally well</p>
            </div>
          </>
        ) : (
          <>
            <Trophy size={24} style={{ color: '#fbbf24' }} fill="#fbbf24" />
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: winner?.color }}>
                {winner?.icon} {winner?.name} Wins!
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                By {Math.abs(score1 - score2)} point{Math.abs(score1 - score2) !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
          Comparison Summary
        </h3>
        <ComparisonTable
          model1Name={model1Name}
          model1Icon={model1Icon}
          score1={score1}
          content1={content1}
          model2Name={model2Name}
          model2Icon={model2Icon}
          score2={score2}
          content2={content2}
        />
      </div>
    </div>
  );
};

export default JudgePanel;