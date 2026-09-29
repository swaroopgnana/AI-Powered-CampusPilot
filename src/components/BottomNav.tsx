/**
 * Mobile Bottom Navigation Dock - Restrained Minimalist Standard
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ScreenId } from '../types';
import {
  Compass,
  LayoutDashboard,
  Bot,
  Building2,
  Calendar,
  BarChart3,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, isEmergencyActive } = useCampus();

  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'map', label: '3D Map', icon: Compass },
    { id: 'home', label: 'Overview', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assist', icon: Bot },
    { id: 'facilities', label: 'Directory', icon: Building2 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'analytics', label: 'Pulse', icon: BarChart3 },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-[#0a0d14]/90 backdrop-blur-xl md:hidden border-t border-white/[0.07]">
      <div className="flex justify-around items-center h-14 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            activeScreen === item.id ||
            (item.id === 'map' && activeScreen === 'navigation');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-1 min-w-[48px] py-1 transition-all cursor-pointer ${
                isActive
                  ? 'text-sky-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-4.5 h-4.5" />
                {item.id === 'map' && isEmergencyActive && (
                  <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500"></span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
