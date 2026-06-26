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
import { SAMPLE_CONVERSATIONS, AI_MODELS, formatTimestamp } from '../utils/data';

const Sidebar = ({ isOpen, onClose, onNewChat, onSelectConversation, activeConversationId }) => {
  const [conversations, setConversations] = useState(SAMPLE_CONVERSATIONS);
  const [activeSection, setActiveSection] = useState('chats');
  const [hoveredId, setHoveredId] = useState(null);

  const toggleFavorite = (id) => {
    setConversations(prev =>
      prev.map(c => c.id === id ? { ...c, favorite: !c.favorite } : c)
    );
  };

  const deleteConversation = (id) => {
    setConversations(prev => prev.filter(c => c.id !== id));
  };

  const favorites = conversations.filter(c => c.favorite);
  const recent = conversations.filter(c => !c.favorite);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${isOpen ? 'open' : ''}`}
        style={{ zIndex: 50 }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-800/50">
          <div className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-7 h-7 rounded-lg"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)' }}
            >
              <Zap size={14} fill="white" color="white" />
            </div>
            <span
              className="font-bold text-base"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #a78bfa)',
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
            className="btn-icon p-1.5 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => { onNewChat(); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
              color: 'white',
              boxShadow: '0 4px 20px rgba(34, 211, 238, 0.25)',
            }}
          >
            <PlusCircle size={16} />
            New Chat
          </button>
        </div>

        {/* Navigation */}
        <div className="px-3 space-y-0.5 mb-3">
          {[
            { id: 'chats', icon: <MessageSquare size={16} />, label: 'Recent Chats', count: conversations.length },
            { id: 'favorites', icon: <Star size={16} />, label: 'Favorites', count: favorites.length },
            { id: 'models', icon: <Cpu size={16} />, label: 'AI Models', count: AI_MODELS.length },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`sidebar-item w-full ${activeSection === item.id ? 'active' : ''}`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              <span
                className="text-xs px-1.5 py-0.5 rounded-full"
                style={{
                  background: activeSection === item.id ? 'rgba(34,211,238,0.2)' : 'rgba(51,65,85,0.5)',
                  color: activeSection === item.id ? '#22d3ee' : '#64748b',
                }}
              >
                {item.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          {activeSection === 'chats' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <Clock size={11} /> Recent
              </p>
              {recent.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare size={24} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-xs text-slate-500">No recent chats</p>
                </div>
              ) : (
                recent.map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={activeConversationId === conv.id}
                    isHovered={hoveredId === conv.id}
                    onHover={setHoveredId}
                    onSelect={() => { onSelectConversation(conv); onClose(); }}
                    onFavorite={() => toggleFavorite(conv.id)}
                    onDelete={() => deleteConversation(conv.id)}
                  />
                ))
              )}

              {favorites.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 mt-3 flex items-center gap-1.5">
                    <Star size={11} /> Pinned
                  </p>
                  {favorites.map(conv => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      isActive={activeConversationId === conv.id}
                      isHovered={hoveredId === conv.id}
                      onHover={setHoveredId}
                      onSelect={() => { onSelectConversation(conv); onClose(); }}
                      onFavorite={() => toggleFavorite(conv.id)}
                      onDelete={() => deleteConversation(conv.id)}
                    />
                  ))}
                </>
              )}
            </div>
          )}

          {activeSection === 'favorites' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1 flex items-center gap-1.5">
                <Sparkles size={11} /> Favorites
              </p>
              {favorites.length === 0 ? (
                <div className="text-center py-8">
                  <Star size={24} className="mx-auto mb-2 text-slate-600" />
                  <p className="text-xs text-slate-500">No favorites yet</p>
                  <p className="text-xs text-slate-600 mt-1">Star a chat to pin it here</p>
                </div>
              ) : (
                favorites.map(conv => (
                  <ConversationItem
                    key={conv.id}
                    conv={conv}
                    isActive={activeConversationId === conv.id}
                    isHovered={hoveredId === conv.id}
                    onHover={setHoveredId}
                    onSelect={() => { onSelectConversation(conv); onClose(); }}
                    onFavorite={() => toggleFavorite(conv.id)}
                    onDelete={() => deleteConversation(conv.id)}
                  />
                ))
              )}
            </div>
          )}

          {activeSection === 'models' && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 py-1">
                Available Models
              </p>
              {AI_MODELS.map(model => (
                <div
                  key={model.id}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors group"
                >
                  <span className="text-lg">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-300 group-hover:text-slate-100">{model.name}</p>
                  </div>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: `${model.color}20`,
                      color: model.color,
                      border: `1px solid ${model.color}30`,
                    }}
                  >
                    {model.badge}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Settings */}
        <div className="p-3 border-t border-slate-800/50">
          <button className="sidebar-item w-full">
            <Settings size={16} />
            <span className="flex-1 text-left">Settings</span>
            <ChevronRight size={14} className="text-slate-600" />
          </button>
        </div>
      </aside>
    </>
  );
};

const ConversationItem = ({ conv, isActive, isHovered, onHover, onSelect, onFavorite, onDelete }) => {
  return (
    <div
      className={`relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all group ${
        isActive
          ? 'bg-cyan-500/10 border border-cyan-500/20'
          : 'hover:bg-slate-800/50'
      }`}
      onMouseEnter={() => onHover(conv.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onSelect}
    >
      <MessageSquare
        size={14}
        className="flex-shrink-0"
        style={{ color: isActive ? '#22d3ee' : '#64748b' }}
      />
      <div className="flex-1 min-w-0">
        <p
          className="text-sm truncate font-medium"
          style={{ color: isActive ? '#22d3ee' : '#94a3b8' }}
        >
          {conv.title}
        </p>
        <p className="text-xs text-slate-600 truncate">{formatTimestamp(conv.timestamp)}</p>
      </div>

      {/* Action buttons on hover */}
      {isHovered && (
        <div className="flex items-center gap-1 animate-fade-in">
          <button
            onClick={(e) => { e.stopPropagation(); onFavorite(); }}
            className="p-1 rounded-lg hover:bg-amber-500/20 transition-colors"
            aria-label={conv.favorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star
              size={12}
              style={{ color: conv.favorite ? '#fbbf24' : '#64748b', fill: conv.favorite ? '#fbbf24' : 'none' }}
            />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 rounded-lg hover:bg-red-500/20 transition-colors"
            aria-label="Delete"
          >
            <Trash2 size={12} className="text-red-400" />
          </button>
        </div>
      )}

      {conv.favorite && !isHovered && (
        <Star size={11} style={{ color: '#fbbf24', fill: '#fbbf24', flexShrink: 0 }} />
      )}
    </div>
  );
};

export default Sidebar;
