
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Zap, 
  PlusCircle, 
  Bell, 
  ChevronDown, 
  User, 
  Settings, 
  HelpCircle, 
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onToggleSidebar, onNewChat }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUserData(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
  }, []);

  const currentUser = user || userData;

  const getInitial = () => {
    if (currentUser?.username) {
      return currentUser.username.charAt(0).toUpperCase();
    }
    if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (currentUser?.username) {
      return currentUser.username;
    }
    if (currentUser?.email) {
      return currentUser.email.split('@')[0];
    }
    return 'User';
  };

  const getDisplayEmail = () => {
    if (currentUser?.email) {
      return currentUser.email;
    }
    return 'user@clashgpt.ai';
  };

  const notifications = [
    { id: 1, text: 'Your comparison is ready!', time: '2m ago', unread: true },
    { id: 2, text: 'New model: Gemini 2.0 added', time: '1h ago', unread: true },
    { id: 3, text: 'Weekly digest available', time: '1d ago', unread: false },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const borderColor = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';
  const hoverBg = isDark ? 'hover:bg-[#2a2a2a]' : 'hover:bg-gray-100';
  const dropdownBg = isDark ? 'bg-[#1a1a1a]' : 'bg-white';
  const dropdownBorder = isDark ? 'border-[#2a2a2a]' : 'border-gray-200';

  return (
    <nav className={`flex items-center justify-between px-4 py-3 border-b ${borderColor} bg-transparent`}>
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg ${hoverBg} transition-colors`}
          aria-label="Toggle sidebar"
        >
          <Menu size={18} className="text-blue-400" />
        </button>

        <div className="flex items-center gap-2.5">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}
          >
            <Zap size={16} fill="white" color="white" />
          </div>
          <span 
            className="font-bold text-lg"
            style={{ 
              background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            ClashGPT
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onNewChat}
          className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors text-white`}
          style={{
            background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
          }}
        >
          <PlusCircle size={16} className="text-white" />
          <span>New Chat</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg ${hoverBg} transition-colors`}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun size={17} className="text-blue-400" /> : <Moon size={17} className="text-blue-500" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            className={`p-2 rounded-lg ${hoverBg} transition-colors relative`}
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserMenu(false);
            }}
            aria-label="Notifications"
          >
            <Bell size={17} className="text-blue-400" />
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ background: '#ef4444' }}
            />
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 top-12 w-80 rounded-xl p-2 z-50 ${dropdownBg} border ${dropdownBorder} shadow-xl`}
            >
              <div className={`flex items-center justify-between px-3 py-2 mb-1 border-b ${borderColor}`}>
                <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>Notifications</span>
                <button className="text-xs text-blue-400 hover:text-blue-300">Mark all read</button>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-3 py-2.5 rounded-lg ${hoverBg} cursor-pointer transition-colors`}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: n.unread ? '#3b82f6' : '#2a2a2a' }}
                  />
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>{n.text}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* User Account Dropdown */}
        <div className="relative">
          <button
            className={`flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg ${hoverBg} transition-colors`}
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifications(false);
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #60a5fa)',
              }}
            >
              {getInitial()}
            </div>
            <ChevronDown size={14} className="text-blue-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div
              className={`absolute right-0 top-12 w-52 rounded-xl p-2 z-50 ${dropdownBg} border ${dropdownBorder} shadow-xl`}
            >
              <div className={`px-3 py-2 mb-1 border-b ${borderColor}`}>
                <p className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{getDisplayName()}</p>
                <p className="text-xs text-gray-500 truncate">{getDisplayEmail()}</p>
              </div>
              
              {/* Profile Link */}
              <Link
                to="/profile"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${hoverBg} ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} text-sm transition-colors`}
                onClick={() => setShowUserMenu(false)}
              >
                <span className="text-blue-400"><User size={15} /></span>
                Profile
              </Link>
              
              {/* Settings Link */}
              <Link
                to="/settings"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${hoverBg} ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} text-sm transition-colors`}
                onClick={() => setShowUserMenu(false)}
              >
                <span className="text-blue-400"><Settings size={15} /></span>
                Settings
              </Link>
              
              {/* Help & Support Link */}
              <Link
                to="/help-support"
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg ${hoverBg} ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} text-sm transition-colors`}
                onClick={() => setShowUserMenu(false)}
              >
                <span className="text-blue-400"><HelpCircle size={15} /></span>
                Help & Support
              </Link>

              {/* Sign Out */}
              <div className={`border-t ${borderColor} mt-1 pt-1`}>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 text-sm transition-colors"
                >
                  <LogOut size={15} />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click Outside Overlay Backdrop */}
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

