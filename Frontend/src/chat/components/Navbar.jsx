
import React, { useState } from 'react';
import { 
  Menu, 
  Zap, 
  PlusCircle, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronDown, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut 
} from 'lucide-react';

const Navbar = ({ onToggleSidebar, onNewChat }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isDark, setIsDark] = useState(true);

  const notifications = [
    { id: 1, text: 'Your comparison is ready!', time: '2m ago', unread: true },
    { id: 2, text: 'New model: Gemini 2.0 added', time: '1h ago', unread: true },
    { id: 3, text: 'Weekly digest available', time: '1d ago', unread: false },
  ];

  return (
    <nav
      className="glass sticky top-0 z-30 flex items-center justify-between px-4 py-3 border-b border-slate-800/50"
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {/* Left: Logo + Menu */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="btn-icon p-2 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl animate-float"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
              boxShadow: '0 0 16px rgba(34, 211, 238, 0.4)',
            }}
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <span
            className="font-bold text-lg tracking-tight"
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
      </div>

      {/* Center: New Chat */}
      <button
        onClick={onNewChat}
        className="btn-primary hidden sm:flex items-center gap-2 px-4 py-2 text-sm"
        style={{
          background: 'linear-gradient(135deg, rgba(34,211,238,0.15), rgba(139,92,246,0.15))',
          border: '1px solid rgba(34,211,238,0.3)',
          color: '#22d3ee',
        }}
      >
        <PlusCircle size={16} />
        <span>New Chat</span>
      </button>

      {/* Right: Icons */}
      <div className="flex items-center gap-1.5">
        {/* Search */}
        <button className="btn-icon p-2" aria-label="Search">
          <Search size={17} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            className="btn-icon p-2 relative"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: '#ef4444' }}
            />
          </button>

          {showNotifications && (
            <div
              className="glass-card absolute right-0 top-12 w-80 rounded-2xl p-2 animate-scale-in z-50"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="flex items-center justify-between px-3 py-2 mb-1">
                <span className="text-sm font-semibold text-slate-200">Notifications</span>
                <button className="text-xs text-cyan-400 hover:text-cyan-300">Mark all read</button>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: n.unread ? '#22d3ee' : '#334155' }}
                  />
                  <div>
                    <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          className="btn-icon p-2"
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User Avatar */}
        <div className="relative">
          <button
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-slate-800/60 transition-colors"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
                color: 'white',
              }}
            >
              U
            </div>
            <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div
              className="glass-card absolute right-0 top-12 w-52 rounded-2xl p-2 animate-scale-in z-50"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            >
              <div className="px-3 py-2 mb-1 border-b border-slate-800">
                <p className="text-sm font-semibold text-slate-200">User</p>
                <p className="text-xs text-slate-400">user@clashgpt.ai</p>
              </div>
              {[
                { icon: <User size={15} />, label: 'Profile' },
                { icon: <Settings size={15} />, label: 'Settings' },
                { icon: <HelpCircle size={15} />, label: 'Help & Support' },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/50 text-slate-300 hover:text-slate-100 text-sm transition-colors"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
              <div className="border-t border-slate-800 mt-1 pt-1">
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-red-400 text-sm transition-colors">
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside handler */}
      {(showUserMenu || showNotifications) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowNotifications(false);
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
