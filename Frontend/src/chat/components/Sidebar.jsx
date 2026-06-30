// chat/components/Sidebar.jsx
import React, { useState } from 'react';
import {
  PlusCircle,
  MessageSquare,
  Star,
  Settings,
  Cpu,
  Trash2,
  ChevronRight,
  X,
  Zap,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Sidebar = ({ 
  isOpen,
  onClose,
  onNewChat, 
  onSelectConversation, 
  activeConversationId,
  conversations = [],    
  models = []           
}) => {
  const { isDark } = useTheme();
  const [activeSection, setActiveSection] = useState('chats');
  const [hoveredId, setHoveredId] = useState(null);

  const favorites = conversations.filter(c => c.favorite);
  const recent = conversations.filter(c => !c.favorite);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

const bgColor = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
const textColor = isDark ? 'text-white' : 'text-gray-900';
const textMuted = isDark ? 'text-gray-400' : 'text-gray-600';
const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100';
const activeBg = isDark ? 'bg-[#2a2a2a]' : 'bg-gray-100';

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 ${bgColor} border-r ${borderColor} transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ 
          boxShadow: isDark ? '2px 0 12px rgba(0,0,0,0.5)' : '2px 0 12px rgba(0,0,0,0.1)',
        }}
      >
        <div className={`p-4 flex items-center justify-between border-b ${borderColor}`}>
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}
            >
              <Zap size={14} fill="white" color="white" />
            </div>
            {/* ✅ Blue ClashGPT name */}
            <span 
              className="font-bold text-base"
              style={{ 
                color: '#3b82f6',
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              ClashGPT
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg ${hoverBg} transition-colors`}
            aria-label="Close sidebar"
          >
            <X size={18} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
          </button>
        </div>

        <div className="p-3">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              color: 'white',
            }}
          >
            <PlusCircle size={16} />
            New Chat
          </button>
        </div>

        <div className="px-3 space-y-0.5 mb-3">
          {[
            { id: 'chats', icon: <MessageSquare size={16} />, label: 'Recent Chats', count: conversations.length },
            { id: 'favorites', icon: <Star size={16} />, label: 'Favorites', count: favorites.length },
            { id: 'models', icon: <Cpu size={16} />, label: 'AI Models', count: models.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeSection === item.id 
                  ? `${activeBg} ${textColor}` 
                  : `${textMuted} ${hoverBg}`
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-200 text-gray-600'}`}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {activeSection === 'chats' && (
            <div className="space-y-1">
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider px-2 py-1 flex items-center gap-1.5`}>
                <Clock size={11} /> Recent
              </p>
              {recent.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={24} className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No recent chats</p>
                </div>
              ) : (
                recent.map(conv => (
                  <ConversationItem
                    key={conv._id || conv.id}
                    conv={conv}
                    isActive={activeConversationId === conv._id || activeConversationId === conv.id}
                    isHovered={hoveredId === conv._id || hoveredId === conv.id}
                    onHover={setHoveredId}
                    onSelect={() => { onSelectConversation(conv); onClose(); }}
                    formatTimestamp={formatTimestamp}
                    isDark={isDark}
                    hoverBg={hoverBg}
                    activeBg={activeBg}
                  />
                ))
              )}

              {favorites.length > 0 && (
                <>
                  <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider px-2 py-1 mt-3 flex items-center gap-1.5`}>
                    <Star size={11} /> Pinned
                  </p>
                  {favorites.map(conv => (
                    <ConversationItem
                      key={conv._id || conv.id}
                      conv={conv}
                      isActive={activeConversationId === conv._id || activeConversationId === conv.id}
                      isHovered={hoveredId === conv._id || hoveredId === conv.id}
                      onHover={setHoveredId}
                      onSelect={() => { onSelectConversation(conv); onClose(); }}
                      formatTimestamp={formatTimestamp}
                      isDark={isDark}
                      hoverBg={hoverBg}
                      activeBg={activeBg}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {activeSection === 'favorites' && (
            <div className="space-y-1">
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider px-2 py-1 flex items-center gap-1.5`}>
                <Sparkles size={11} /> Favorites
              </p>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Star size={24} className={`mx-auto mb-2 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No favorites yet</p>
                </div>
              ) : (
                favorites.map(conv => (
                  <ConversationItem
                    key={conv._id || conv.id}
                    conv={conv}
                    isActive={activeConversationId === conv._id || activeConversationId === conv.id}
                    isHovered={hoveredId === conv._id || hoveredId === conv.id}
                    onHover={setHoveredId}
                    onSelect={() => { onSelectConversation(conv); onClose(); }}
                    formatTimestamp={formatTimestamp}
                    isDark={isDark}
                    hoverBg={hoverBg}
                    activeBg={activeBg}
                  />
                ))
              )}
            </div>
          )}

          {activeSection === 'models' && (
            <div className="space-y-1">
              <p className={`text-xs font-semibold ${isDark ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider px-2 py-1`}>
                Available Models
              </p>
              {models.map(model => (
                <div
                  key={model.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${hoverBg} cursor-pointer transition-colors group`}
                >
                  <span className="text-lg">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'}`}>{model.name}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-[#2a2a2a] text-gray-400' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {model.badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={`p-3 border-t ${borderColor}`}>
          <button className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${textMuted} ${hoverBg} transition-colors`}>
            <Settings size={16} />
            <span className="flex-1 text-left">Settings</span>
            <ChevronRight size={14} className={isDark ? 'text-gray-600' : 'text-gray-400'} />
          </button>
        </div>
      </aside>
    </>
  );
};

const ConversationItem = ({ conv, isActive, isHovered, onHover, onSelect, formatTimestamp, isDark, hoverBg, activeBg }) => {
  return (
    <div
      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
        isActive
          ? `${activeBg} border ${isDark ? 'border-[#3a3a3a]' : 'border-gray-300'}`
          : hoverBg
      }`}
      onMouseEnter={() => onHover(conv._id || conv.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onSelect}
    >
      <MessageSquare
        size={14}
        className={isActive ? (isDark ? 'text-gray-300' : 'text-gray-700') : (isDark ? 'text-gray-600' : 'text-gray-400')}
      />
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate font-medium ${
            isActive ? (isDark ? 'text-white' : 'text-gray-900') : (isDark ? 'text-gray-400' : 'text-gray-600')
          }`}
        >
          {conv.title}
        </p>
        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'} truncate`}>{formatTimestamp(conv.createdAt || conv.timestamp)}</p>
      </div>

      {isHovered && (
        <div className="flex items-center gap-1 animate-fade-in absolute right-2 bg-inherit pl-2">
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className={`p-1 rounded-lg ${isDark ? 'hover:bg-amber-500/20' : 'hover:bg-amber-500/10'} transition-colors`}
            aria-label="Favorite"
          >
            <Star
              size={12}
              className={isDark ? 'text-gray-500' : 'text-gray-400'}
            />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); }}
            className="p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;