import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  PlusCircle,
  ReceiptText,
  BarChart3,
  Settings,
} from 'lucide-react';

interface Props {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
}

export const BottomNav: React.FC<Props> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'ड्यासबोर्ड', label: 'ड्यासबोर्ड', icon: LayoutDashboard },
    { id: 'क्यालेन्डर', label: 'क्यालेन्डर', icon: Calendar },
    { id: 'इन्ट्री थप्नुहोस्', label: 'नयाँ इन्ट्री', icon: PlusCircle, isPrimary: true },
    { id: 'इतिहास', label: 'इतिहास', icon: ReceiptText },
    { id: 'रिपोर्ट', label: 'रिपोर्ट', icon: BarChart3 },
    { id: 'सेटिङ', label: 'सेटिङ', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#C62828] border-t border-red-900/60 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-6 items-center h-16 px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          if (tab.isPrimary) {
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] -mt-4 group relative"
                title={tab.label}
              >
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                    isActive
                      ? 'bg-white text-[#C62828] ring-4 ring-red-300'
                      : 'bg-white text-[#C62828] hover:bg-red-50 ring-2 ring-red-900/40'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-white mt-0.5 truncate max-w-[54px] drop-shadow-xs">
                  {tab.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] py-1 transition-all ${
                isActive ? 'text-white font-bold' : 'text-red-100 hover:text-white'
              }`}
              title={tab.label}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 drop-shadow-sm' : ''}`} />
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-[50px] ${
                  isActive ? 'font-bold text-white' : 'font-medium text-red-100/90'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
