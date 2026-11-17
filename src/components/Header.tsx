import React, { useState } from 'react';
import { User } from '../types/quiz';

interface HeaderProps {
  user: User | null;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onSwitchRole: (role: 'student' | 'admin') => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  currentTab,
  onTabChange,
  onSwitchRole,
  onOpenAuth,
  onLogout
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getSubTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Dashboard';
      case 'admin': return 'Admin';
      case 'quizzes': return 'Quizzes';
      case 'results': return 'Results';
      default: return 'Home';
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-[#f8f9ff]/90 backdrop-blur-xl border-b border-[#e5eeff] shadow-[0_1px_8px_rgba(0,0,0,0.03)] pt-safe">
      <div className="max-w-6xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <button 
          onClick={() => onTabChange('home')}
          className="flex items-center gap-2.5 text-left focus:outline-none group"
        >
          {/* QuizPro Logo Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4648d4] to-[#6b38d4] flex items-center justify-center text-white shadow-sm shadow-[#4648d4]/30 relative overflow-hidden group-hover:scale-105 transition-transform">
            <span className="font-extrabold text-xl tracking-tighter">P</span>
            <div className="absolute bottom-1 right-1 w-3 h-3 bg-[#006c49] rounded-full flex items-center justify-center ring-1 ring-white">
              <span className="material-symbols-outlined text-[10px] text-white font-bold leading-none">check</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-['Plus_Jakarta_Sans'] font-bold text-lg text-[#4648d4] leading-none tracking-tight">QuizPro</span>
            <span className="font-['Inter'] text-[11px] font-semibold text-[#464554] tracking-wide mt-0.5">{getSubTitle()}</span>
          </div>
        </button>

        {/* Desktop Quick Nav */}
        <div className="hidden md:flex items-center gap-1 bg-[#eff4ff] p-1 rounded-xl border border-[#dce9ff]">
          {[
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
            { id: 'quizzes', label: 'Quizzes', icon: 'quiz' },
            { id: 'results', label: 'Results', icon: 'analytics' },
            { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === item.id 
                  ? 'bg-white text-[#4648d4] shadow-sm' 
                  : 'text-[#464554] hover:text-[#0b1c30] hover:bg-white/60'
              }`}
            >
              <span className="material-symbols-outlined text-[17px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Action Icons: Quick Role Switch + Notifications + Profile */}
        <div className="flex items-center gap-1.5">
          {/* Quick Persona Tag */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e1e0ff] text-[#07006c] text-[11px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4648d4] animate-pulse"></span>
            <span>{user?.role === 'admin' ? '🛡️ Admin Mode' : '🎓 Student Mode'}</span>
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              aria-label="Notifications"
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 relative flex items-center justify-center rounded-full text-[#464554] hover:text-[#0b1c30] hover:bg-[#e5eeff] transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#e5eeff] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff]">
                  <span className="font-['Plus_Jakarta_Sans'] font-bold text-xs text-[#0b1c30]">Recent Alerts</span>
                  <span className="text-[10px] text-[#4648d4] font-semibold cursor-pointer">Mark all read</span>
                </div>
                <div className="divide-y divide-[#eff4ff] text-xs">
                  <div className="py-2.5">
                    <p className="font-semibold text-[#0b1c30]">New Quiz Available</p>
                    <p className="text-[11px] text-[#464554] mt-0.5">Computer Networks & Protocols is open for testing.</p>
                    <span className="text-[10px] text-[#767586] mt-1 block">15m ago</span>
                  </div>
                  <div className="py-2.5">
                    <p className="font-semibold text-[#006c49]">Grade Published</p>
                    <p className="text-[11px] text-[#464554] mt-0.5">You scored 83.3% in Python Advanced!</p>
                    <span className="text-[10px] text-[#767586] mt-1 block">2h ago</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-full ring-2 ring-[#4648d4]/20 hover:ring-[#4648d4] transition-all overflow-hidden bg-[#e1e0ff]"
            >
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#4648d4]">
                {user?.name ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'U'}
              </span>
            </button>

            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#e5eeff] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="px-4 py-2.5 border-b border-[#eff4ff]">
                  <p className="font-['Plus_Jakarta_Sans'] font-bold text-sm text-[#0b1c30] truncate">{user?.name || 'Guest User'}</p>
                  <p className="text-[11px] text-[#464554] truncate">{user?.email || 'Not logged in'}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#e1e0ff] text-[#07006c]">
                    Role: {user?.role || 'student'}
                  </span>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => onSwitchRole('student')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#4648d4]">school</span>
                    <span>Switch to Alex Rivera (Student)</span>
                  </button>
                  <button
                    onClick={() => onSwitchRole('admin')}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#6b38d4]">admin_panel_settings</span>
                    <span>Switch to Dr. Eleanor (Admin)</span>
                  </button>
                </div>

                <div className="border-t border-[#eff4ff] p-1 mt-1">
                  <button
                    onClick={onOpenAuth}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#4648d4] hover:bg-[#eff4ff] rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">manage_accounts</span>
                    <span>Sign In with another Account</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
