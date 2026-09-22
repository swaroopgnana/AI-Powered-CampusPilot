/**
 * CampusPilot Header Component
 * Preserves the exact Stitch design system: branding, live telemetry, SOS trigger, notifications & profile.
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
        return 'CampusPilot';
      case 'assistant':
        return 'AI Assist';
      case 'map':
      case 'navigation':
        return '3D Map';
      case 'events':
        return 'Campus Events';
      case 'emergency':
        return 'Emergency SOS';
      case 'facilities':
        return 'Campus Facilities';
      case 'analytics':
        return 'Campus Analytics';
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
                  fill="#131b2e"
                />
                <circle cx="20" cy="18" r="9" stroke="#006194" strokeWidth="2.5" />
                <circle cx="20" cy="18" r="4.5" fill="#57dffe" />
                <line x1="20" y1="9" x2="20" y2="4" stroke="#57dffe" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="4" r="2" fill="#57dffe" />
                <line x1="9" y1="18" x2="4" y2="18" stroke="#57dffe" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="4" cy="18" r="2" fill="#57dffe" />
                <line x1="31" y1="18" x2="36" y2="18" stroke="#57dffe" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="36" cy="18" r="2" fill="#57dffe" />
                <polygon points="30,8 32,13 37,15 32,17 30,22 28,17 23,15 28,13" fill="#57dffe" />
              </svg>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                  {getScreenTitle(activeScreen)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${isEmergencyActive ? 'bg-error animate-ping' : 'bg-tertiary animate-pulse'}`}></span>
                <span className="font-code-telemetry text-code-telemetry text-on-surface-variant truncate">
                  {isEmergencyActive ? 'Code Orange • Tactical HUD' : 'North Campus • Live'}
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Right Action Icons: SOS, Notifications, Avatar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            aria-label="Emergency SOS"
            onClick={() => {
              if (activeScreen === 'emergency') {
                triggerEmergency('Fire');
              } else {
                setActiveScreen('emergency');
              }
            }}
            className={`min-h-[36px] px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-[0_2px_10px_rgba(186,26,26,0.3)] active:scale-95 transition-all text-on-error cursor-pointer ${
              isEmergencyActive ? 'bg-error animate-pulse ring-2 ring-error/50' : 'bg-error hover:bg-error/90'
            }`}
          >
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span className="whitespace-nowrap font-bold">SOS</span>
          </button>

          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="w-9 h-9 min-w-[36px] min-h-[36px] relative flex items-center justify-center rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
            )}
          </button>

          <button
            aria-label="Profile"
            onClick={() => setActiveScreen('profile')}
            className="flex items-center justify-center w-10 h-10 min-w-[40px] min-h-[40px] rounded-full hover:ring-2 hover:ring-primary/40 transition-all overflow-hidden"
          >
            <img
              alt={userProfile.name}
              className="w-8 h-8 rounded-full object-cover"
              src={userProfile.avatarUrl}
            />
          </button>
        </div>
      </div>
    </header>
  );
};
