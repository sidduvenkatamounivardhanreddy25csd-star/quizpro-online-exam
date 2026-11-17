import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'quizzes', label: 'Quizzes', icon: 'quiz' },
    { id: 'results', label: 'Results', icon: 'analytics' },
    { id: 'admin', label: 'Admin', icon: 'admin_panel_settings' },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#f8f9ff]/90 backdrop-blur-xl border-t border-[#e5eeff] shadow-[0_-2px_12px_rgba(11,28,48,0.04)]">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[56px] h-12 transition-all rounded-xl focus:outline-none ${
                isActive
                  ? 'text-[#4648d4] font-semibold scale-105'
                  : 'text-[#464554] hover:text-[#0b1c30]'
              }`}
            >
              <span 
                className={`material-symbols-outlined text-[22px] ${isActive ? 'fill' : ''}`}
                style={isActive ? { fontVariationSettings: "'FILL' 1, 'wght' 600" } : {}}
              >
                {tab.icon}
              </span>
              <span className={`text-[11px] font-['Inter'] leading-none ${isActive ? 'font-bold text-[#4648d4]' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
