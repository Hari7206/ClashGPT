// auth/pages/HelpSupport.jsx
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  HelpCircle, 
  Mail, 
  MessageSquare, 
  BookOpen, 
  Shield, 
  Zap,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Copy,
  Check,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

// Custom SVG Icons
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.15 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.62.24 2.85.12 3.15.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const HelpSupport = () => {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const bgColor = isDark ? 'bg-[#0d0d0d]' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const textColor = isDark ? 'text-white' : 'text-gray-900';
  const mutedColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100';

  const faqs = [
    {
      id: 1,
      question: 'What is ClashGPT?',
      answer: 'ClashGPT is an AI-powered platform that compares responses from multiple AI models side-by-side. You ask a question, and we show you how different AI models respond, with an AI judge scoring each response.'
    },
    {
      id: 2,
      question: 'Which AI models are supported?',
      answer: 'Currently, ClashGPT supports Mistral AI and Cohere AI. We are actively working on adding more models including GPT-4, Claude, and Gemini.'
    },
    {
      id: 3,
      question: 'How does the AI Judge work?',
      answer: 'The AI Judge evaluates responses from different models based on relevance, accuracy, completeness, and clarity. Each response is scored from 1-10, and the model with the higher score is declared the winner.'
    },
    {
      id: 4,
      question: 'Is my data secure?',
      answer: 'Yes, we take data security seriously. All conversations are encrypted and stored securely. We do not share your data with third parties without your explicit consent.'
    },
    {
      id: 5,
      question: 'Can I delete my chat history?',
      answer: 'Yes, you can delete individual chats by hovering over them in the sidebar and clicking the trash icon. You can also delete your entire account in the Settings page.'
    },
    {
      id: 6,
      question: 'How do I contact support?',
      answer: 'You can reach us at harithapa4654@gmail.com. We typically respond within 24-48 hours during business days.'
    }
  ];

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('harithapa4654@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className={`min-h-screen ${bgColor} ${textColor} flex flex-col`}>
      {/* Header */}
      <div className={`sticky top-0 z-10 ${cardBg} border-b ${borderColor} px-4 py-3 flex items-center gap-4`}>
        <button
          onClick={() => navigate(-1)}
          className={`p-2 rounded-lg ${hoverBg} transition-colors`}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Help & Support</h1>
        <div className="flex-1" />
        <HelpCircle size={20} className={mutedColor} />
      </div>

      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-4 py-6 space-y-6">
        {/* Quick Links */}
        <div className={`${cardBg} rounded-2xl p-6 border ${borderColor}`}>
          <h2 className="text-lg font-semibold mb-4">Quick Help</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => document.getElementById('faq-section').scrollIntoView({ behavior: 'smooth' })}
              className={`flex items-center gap-3 p-4 rounded-xl ${hoverBg} transition-colors border ${borderColor}`}
            >
              <BookOpen size={20} className="text-blue-400" />
              <span className="text-sm font-medium">FAQ</span>
            </button>
            <button
              onClick={handleCopyEmail}
              className={`flex items-center gap-3 p-4 rounded-xl ${hoverBg} transition-colors border ${borderColor}`}
            >
              <Mail size={20} className="text-blue-400" />
              <span className="text-sm font-medium">Email Support</span>
              {copied ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <Copy size={16} className={mutedColor} />
              )}
            </button>
          </div>
        </div>

        {/* Contact Info */}
        <div className={`${cardBg} rounded-2xl p-6 border ${borderColor}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Mail size={18} className="text-blue-400" />
            Contact Us
          </h2>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-3 rounded-xl ${isDark ? 'bg-[#252525]' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-3">
                <Mail size={16} className={mutedColor} />
                <span className="text-sm">harithapa4654@gmail.com</span>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className={mutedColor} />}
              </button>
            </div>
            <p className={`text-xs ${mutedColor}`}>
              Response time: 24-48 hours on business days
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq-section" className={`${cardBg} rounded-2xl p-6 border ${borderColor}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <HelpCircle size={18} className="text-blue-400" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-2">
            {faqs.map((faq) => (
              <div
                key={faq.id}
                className={`rounded-xl border ${borderColor} overflow-hidden transition-all duration-200`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className={`w-full flex items-center justify-between p-4 text-left ${hoverBg} transition-colors`}
                >
                  <span className="text-sm font-medium">{faq.question}</span>
                  {expandedFaq === faq.id ? (
                    <ChevronUp size={16} className={mutedColor} />
                  ) : (
                    <ChevronDown size={16} className={mutedColor} />
                  )}
                </button>
                {expandedFaq === faq.id && (
                  <div className={`px-4 pb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'} text-sm leading-relaxed`}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className={`${cardBg} rounded-2xl p-6 border ${borderColor}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText size={18} className="text-blue-400" />
            Resources
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              to="/privacy"
              className={`flex items-center justify-between p-3 rounded-xl ${hoverBg} transition-colors border ${borderColor}`}
            >
              <span className="text-sm">Privacy Policy</span>
              <ExternalLink size={14} className={mutedColor} />
            </Link>
            <Link
              to="/terms"
              className={`flex items-center justify-between p-3 rounded-xl ${hoverBg} transition-colors border ${borderColor}`}
            >
              <span className="text-sm">Terms of Service</span>
              <ExternalLink size={14} className={mutedColor} />
            </Link>
          </div>
        </div>

        {/* Social Links - Updated with your GitHub and LinkedIn */}
        <div className={`${cardBg} rounded-2xl p-6 border ${borderColor}`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield size={18} className="text-blue-400" />
            Connect With Us
          </h2>
          <div className="flex gap-3 flex-wrap">
            <a
              href="https://github.com/Hari7206"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${hoverBg} transition-colors border ${borderColor}`}
            >
              <GithubIcon />
              <span className="text-sm">GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/hari-thapa-67827835b/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl ${hoverBg} transition-colors border ${borderColor}`}
            >
              <LinkedInIcon />
              <span className="text-sm">LinkedIn</span>
            </a>
          </div>
        </div>

        {/* Security Badge */}
        <div className={`${cardBg} rounded-2xl p-4 border ${borderColor} text-center`}>
          <div className="flex items-center justify-center gap-2">
            <Shield size={16} className="text-green-500" />
            <span className={`text-sm ${mutedColor}`}>
              Your data is secure and encrypted
            </span>
            <CheckCircle size={14} className="text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupport;