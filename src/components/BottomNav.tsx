/**
 * CampusPilot Mobile Bottom Navigation
 * Preserves the exact Stitch design system & tab states
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ScreenId } from '../types';
import {
  LayoutDashboard,
  Bot,
  Compass,
  Calendar,
  Building2,
  User,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, isEmergencyActive } = useCampus();

  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    ping?: boolean;
  }[] = [
    { id: 'home', label: 'Home', icon: LayoutDashboard },
    { id: 'assistant', label: 'AI Assist', icon: Bot },
    { id: 'map', label: '3D Map', icon: Compass, ping: true },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-2px_12px_rgba(0,0,0,0.05)] md:hidden border-t border-surface-container-high/40">
      <div className="flex justify-around items-center h-16 px-space-xs max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive =
            activeScreen === item.id ||
            (item.id === 'map' && activeScreen === 'navigation') ||
            (item.id === 'home' && activeScreen === 'analytics');
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[44px] min-h-[44px] px-2 py-1 transition-all cursor-pointer ${
                isActive ? 'text-secondary font-semibold scale-105' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'text-secondary stroke-[2.2]' : 'text-on-surface-variant'}`} />
                {item.ping && !isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-secondary-container animate-ping"></span>
                )}
                {item.id === 'map' && isEmergencyActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-error animate-pulse"></span>
                )}
              </div>
              <span className="font-label-sm text-[11px] leading-tight tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
