/**
 * CampusPilot Header Component
 * Branded for Marwadi University Intelligent Campus Assistance
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { ScreenId } from '../types';
import { ArrowLeft, AlertTriangle, Bell } from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications, unreadCount }) => {
  const { activeScreen, setActiveScreen, isEmergencyActive, triggerEmergency, userProfile } = useCampus();

  const getScreenTitle = (screen: ScreenId): string => {
    switch (screen) {
      case 'home':
        return 'CampusPilot • Marwadi University';
      case 'assistant':
        return 'MU AI Assistant';
      case 'map':
      case 'navigation':
        return '3D Digital Twin Map';
      case 'events':
        return 'MU Events & Summits';
      case 'emergency':
        return 'Emergency SOS Tactical HUD';
      case 'facilities':
        return 'MU Facilities & Labs';
      case 'analytics':
        return 'Campus Pulse Analytics';
      case 'profile':
        return 'Student Profile';
      default:
        return 'CampusPilot';
    }
  };

  const isDeepScreen = activeScreen === 'emergency' || activeScreen === 'facilities' || activeScreen === 'analytics';

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
      <div className="h-16 px-gutter flex items-center justify-between gap-space-sm max-w-7xl mx-auto w-full">
        {/* Left Brand / Back Button */}
        <div className="flex items-center gap-space-sm min-w-0">
          {isDeepScreen ? (
            <button
              aria-label="Go back"
              onClick={() => setActiveScreen('home')}
              className="w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:scale-95 transition-colors cursor-pointer mr-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : null}

          {/* Logo Pin */}
          <button
            onClick={() => setActiveScreen('home')}
            className="flex items-center gap-space-sm min-w-0 text-left cursor-pointer"
          >
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 40 40" className="w-8 h-8 drop-shadow-sm" fill="none">
                <path
                  d="M 20 2 C 10 2 2 10 2 20 C 2 31 20 40 20 40 C 20 40 38 31 38 20 C 38 10 30 2 20 2 Z"
                  fill="#0f172a"
                />
                <circle cx="20" cy="18" r="9" stroke="#0284c7" strokeWidth="2.5" />
                <circle cx="20" cy="18" r="4.5" fill="#38bdf8" />
                <line x1="20" y1="9" x2="20" y2="4" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="4" r="2" fill="#38bdf8" />
                <line x1="9" y1="18" x2="4" y2="18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="4" cy="18" r="2" fill="#38bdf8" />
                <line x1="31" y1="18" x2="36" y2="18" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="36" cy="18" r="2" fill="#38bdf8" />
                <polygon points="30,8 32,13 37,15 32,17 30,22 28,17 23,15 28,13" fill="#38bdf8" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  {getScreenTitle(activeScreen)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isEmergencyActive ? 'bg-error animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
                <span className="font-code-telemetry text-code-telemetry text-on-surface-variant truncate">
                  {isEmergencyActive ? 'Code Orange • Tactical Evac' : 'Marwadi University • Digital Twin Live'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Action Icons: SOS, Notifications, Avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Quick SOS Trigger Button */}
          <button
            onClick={() => {
              if (isEmergencyActive) {
                setActiveScreen('emergency');
              } else {
                triggerEmergency('Fire');
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer shadow-xs ${
              isEmergencyActive
                ? 'bg-error text-on-error animate-pulse'
                : 'bg-error/10 hover:bg-error/20 text-error'
            }`}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">SOS</span>
          </button>

          {/* Notifications Trigger */}
          <button
            onClick={onOpenNotifications}
            className="relative w-9 h-9 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-on-surface hover:bg-surface-container active:scale-95 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => setActiveScreen('profile')}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-surface-container cursor-pointer transition-colors"
          >
            <img
              src={userProfile.avatarUrl}
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/20"
            />
          </button>
        </div>
      </div>
    </header>
  );
};
