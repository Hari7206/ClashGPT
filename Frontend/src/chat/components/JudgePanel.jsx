// chat/components/JudgePanel.jsx
import React, { useEffect, useState } from 'react';
import { Trophy, Handshake, TrendingUp, AlignLeft, Star } from 'lucide-react';
import { getQualityColor, getQualityLabel, countWords } from '../../utils/helpers.js';
import { useTheme } from '../context/ThemeContext';

const ScoreCard = ({ modelName, modelIcon, modelColor, score, maxScore = 10, delay = 0, isWinner }) => {
  const { isDark } = useTheme();
  const [displayScore, setDisplayScore] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

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

  const cardBg = isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(249, 250, 251, 0.9)';
  const borderColor = isDark ? '#334155' : '#e5e7eb';
  const textColor = isDark ? '#e5e7eb' : '#1f2937';

  return (
    <div
      className="relative p-5 rounded-2xl transition-all duration-300 animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        background: isWinner
          ? isDark 
            ? `linear-gradient(135deg, rgba(59,130,246,0.15), rgba(15,23,42,0.9))`
            : `linear-gradient(135deg, rgba(59,130,246,0.08), rgba(249,250,251,0.9))`
          : cardBg,
        border: `1px solid ${isWinner ? 'rgba(59,130,246,0.3)' : borderColor}`,
        boxShadow: isWinner ? `0 0 30px rgba(59,130,246,0.1)` : 'none',
      }}
    >
      {isWinner && (
        <div
          className="absolute -top-3 -right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
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
              background: isDark ? 'rgba(42,42,42,0.8)' : 'rgba(229,231,235,0.8)',
              border: `1px solid ${borderColor}`,
            }}
          >
            {modelIcon}
          </div>
          <div>
            <p className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-gray-700'}`}>{modelName}</p>
            <p className="text-xs" style={{ color: getQualityColor(score) }}>
              {getQualityLabel(score)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div
            className="text-3xl font-black"
            style={{ color: textColor, fontVariantNumeric: 'tabular-nums' }}
          >
            {displayScore}
          </div>
          <div className={`text-xs font-medium ${isDark ? 'text-slate-500' : 'text-gray-400'}`}>/ {maxScore}</div>
        </div>
      </div>

      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{
            width: `${progressWidth}%`,
            background: isWinner
              ? `linear-gradient(90deg, #3b82f6, #60a5fa)`
              : `linear-gradient(90deg, #6b7280, #9ca3af)`,
            boxShadow: isWinner ? `0 0 10px rgba(59,130,246,0.3)` : 'none',
          }}
        />
      </div>

      <div className="flex gap-1 mt-3">
        {Array.from({ length: maxScore }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background: i < score ? (isDark ? '#3b82f6' : '#60a5fa') : (isDark ? '#1e293b' : '#e5e7eb'),
              transitionDelay: `${delay + i * 50}ms`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const ComparisonTable = ({ model1Name, model1Icon, score1, content1, model2Name, model2Icon, score2, content2 }) => {
  const { isDark } = useTheme();
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

  const borderColor = isDark ? '#2a2a2a' : '#e5e7eb';
  const headerBg = isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(243, 244, 246, 0.8)';

  return (
    <div className="overflow-x-auto rounded-xl border" style={{ borderColor: borderColor }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: headerBg }}>
            <th className={`px-4 py-3 text-left font-semibold text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
              Metric
            </th>
            <th className={`px-4 py-3 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {model1Icon} {model1Name}
            </th>
            <th className={`px-4 py-3 text-left font-semibold text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {model2Icon} {model2Name}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className="border-t transition-colors"
              style={{
                borderColor: borderColor,
                background: i % 2 === 0 ? (isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(249, 250, 251, 0.5)') : 'transparent',
              }}
            >
              <td className={`px-4 py-3 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>
                {row.icon}
                {row.label}
              </td>
              <td
                className="px-4 py-3 font-medium"
                style={{
                  color: row.winner === 'model1' ? (isDark ? '#e5e7eb' : '#1f2937') : (isDark ? '#6b7280' : '#9ca3af'),
                  background: row.winner === 'model1' ? (isDark ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.03)') : 'transparent',
                }}
              >
                {row.val1}
              </td>
              <td
                className="px-4 py-3 font-medium"
                style={{
                  color: row.winner === 'model2' ? (isDark ? '#e5e7eb' : '#1f2937') : (isDark ? '#6b7280' : '#9ca3af'),
                  background: row.winner === 'model2' ? (isDark ? 'rgba(59,130,246,0.05)' : 'rgba(59,130,246,0.03)') : 'transparent',
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
  model1Color = '#3b82f6',
  model2Name,
  model2Icon,
  model2Color = '#60a5fa',
  content1,
  content2,
}) => {
  const { isDark } = useTheme();
  const isTie = score1 === score2;

  const textColor = isDark ? '#e5e7eb' : '#1f2937';
  const mutedColor = isDark ? '#6b7280' : '#9ca3af';
  const borderColor = isDark ? 'rgba(100,116,139,0.3)' : 'rgba(107,114,128,0.2)';

  return (
    <div className="space-y-6 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{
            background: isDark ? 'rgba(251,191,36,0.15)' : 'rgba(251,191,36,0.1)',
            border: `1px solid ${isDark ? 'rgba(251,191,36,0.3)' : 'rgba(251,191,36,0.2)'}`,
          }}
        >
          <Trophy size={20} style={{ color: '#fbbf24' }} />
        </div>
        <div>
          <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-gray-800'}`}>AI Judge</h2>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'}`}>Objective model evaluation</p>
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
            ? isDark ? 'rgba(100,116,139,0.15)' : 'rgba(107,114,128,0.08)'
            : isDark ? `rgba(59,130,246,0.12)` : `rgba(59,130,246,0.06)`,
          border: isTie
            ? `1px solid ${borderColor}`
            : `1px solid rgba(59,130,246,0.3)`,
          boxShadow: !isTie ? `0 0 30px rgba(59,130,246,0.08)` : 'none',
        }}
      >
        {isTie ? (
          <>
            <Handshake size={24} className={isDark ? 'text-slate-400' : 'text-gray-500'} />
            <div className="text-center">
              <p className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>🤝 It's a Tie!</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mt-0.5`}>Both models performed equally well</p>
            </div>
          </>
        ) : (
          <>
            <Trophy size={24} style={{ color: '#fbbf24' }} fill="#fbbf24" />
            <div className="text-center">
              <p className={`font-bold text-lg ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
                {score1 > score2 ? `${model1Icon} ${model1Name} Wins!` : `${model2Icon} ${model2Name} Wins!`}
              </p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-gray-500'} mt-0.5`}>
                By {Math.abs(score1 - score2)} point{Math.abs(score1 - score2) !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </div>

      <div>
        <h3 className={`text-sm font-semibold ${isDark ? 'text-slate-400' : 'text-gray-500'} mb-3 uppercase tracking-wider`}>
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