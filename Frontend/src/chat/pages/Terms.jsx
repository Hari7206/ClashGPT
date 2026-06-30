// auth/pages/Terms.jsx
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const Terms = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const bgColor = isDark ? 'bg-[#0d0d0d]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100';

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <div className={`sticky top-0 z-10 ${cardBg} border-b ${borderColor} px-4 py-3 flex items-center gap-4`}>
        <button onClick={() => navigate(-1)} className={`p-2 rounded-lg ${hoverBg} transition-colors`}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Terms of Service</h1>
      </div>
      <div className="max-w-4xl mx-auto p-6">
        <div className={`${cardBg} rounded-2xl p-6 border ${borderColor}`}>
          <h2 className="text-lg font-semibold mb-4">Terms of Service</h2>
          <p className={`text-sm ${mutedColor} leading-relaxed`}>
            Last updated: January 2026
          </p>
          <div className={`mt-4 space-y-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
            <p>
              <strong>1. Acceptance of Terms</strong><br />
              By using ClashGPT, you agree to these terms.
            </p>
            <p>
              <strong>2. Use of Service</strong><br />
              You may use ClashGPT for personal and commercial purposes. You are responsible for your interactions.
            </p>
            <p>
              <strong>3. Intellectual Property</strong><br />
              All content and code are owned by ClashGPT. You may not copy, modify, or distribute without permission.
            </p>
            <p>
              <strong>4. Termination</strong><br />
              We reserve the right to terminate accounts for violations of these terms.
            </p>
            <p>
              <strong>5. Contact</strong><br />
              For questions, contact us at harithapa4654@gmail.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;