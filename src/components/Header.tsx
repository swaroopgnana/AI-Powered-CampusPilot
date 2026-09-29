/**
 * CampusPilot Header - Precision Executive Design
 * Clean, restrained, distraction-free top navigation bar.
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ScreenId } from '../types';
import { Search, Bell, AlertCircle, Compass } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  onOpenSpotlight: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenSpotlight,
  unreadCount,
}) => {
  const { activeScreen, setActiveScreen, isEmergencyActive, userProfile } = useCampus();

  const navItems: { id: ScreenId; label: string }[] = [
    { id: 'map', label: '3D Campus' },
    { id: 'home', label: 'Overview' },
    { id: 'assistant', label: 'AI Assistant' },
    { id: 'facilities', label: 'Directory' },
    { id: 'events', label: 'Events' },
    { id: 'analytics', label: 'Telemetry' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 h-14 bg-[#0a0d14]/85 backdrop-blur-md border-b border-white/[0.07] px-4 sm:px-6 flex items-center justify-between select-none">
      {/* Brand Monogram & Title */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => setActiveScreen('home')}
          className="flex items-center gap-2.5 text-left cursor-pointer group transition-opacity hover:opacity-90"
        >
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/25 flex items-center justify-center text-sky-400">
            <Compass className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-sm tracking-tight text-white">
              CampusPilot
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline font-normal">
              Marwadi University
            </span>
          </div>
        </button>
      </div>

      {/* Primary Navigation Tabs */}
      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item) => {
          const isActive =
            activeScreen === item.id || (item.id === 'map' && activeScreen === 'navigation');
          return (
            <button
              key={item.id}
              onClick={() => setActiveScreen(item.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/[0.08] text-white font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Utility Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Quick Search */}
        <button
          onClick={onOpenSpotlight}
          className="flex items-center gap-2 px-2.5 py-1.2 rounded-md bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-slate-200 text-xs border border-white/[0.06] transition-colors cursor-pointer"
          title="Search landmarks, labs, events (⌘K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search</span>
          <kbd className="hidden sm:inline-block text-[10px] text-slate-500 font-mono bg-white/[0.04] px-1 py-0.5 rounded border border-white/[0.08]">
            ⌘K
          </kbd>
        </button>

        {/* SOS Emergency Link (Restrained unless active) */}
        <button
          onClick={() => setActiveScreen('emergency')}
          className={`flex items-center gap-1.5 px-2.5 py-1.2 rounded-md text-xs font-medium transition-colors cursor-pointer ${
            isEmergencyActive
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
              : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
          }`}
          title="Emergency protocols and evacuation routes"
        >
          <AlertCircle className={`w-3.5 h-3.5 ${isEmergencyActive ? 'text-red-400' : 'text-slate-500'}`} />
          <span className="hidden sm:inline">{isEmergencyActive ? 'SOS Active' : 'Safety'}</span>
        </button>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          )}
        </button>

        {/* Profile Avatar */}
        <button
          onClick={() => setActiveScreen('profile')}
          className="flex items-center p-0.5 rounded-md hover:ring-1 hover:ring-white/20 transition-all cursor-pointer ml-1"
          title={`${userProfile.name} - Profile`}
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-6 h-6 rounded-md object-cover border border-white/[0.1]"
          />
        </button>
      </div>
    </header>
  );
};
