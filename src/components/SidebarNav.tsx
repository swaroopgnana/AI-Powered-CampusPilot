/**
 * CampusPilot Desktop Sidebar Navigation
 * Branded for Marwadi University Digital Twin System
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
  AlertTriangle,
  BarChart3,
  User,
  ShieldAlert,
  Radio,
} from 'lucide-react';

export const SidebarNav: React.FC = () => {
  const { activeScreen, setActiveScreen, isEmergencyActive } = useCampus();

  const navItems: {
    id: ScreenId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }[] = [
    { id: 'home', label: 'MU Dashboard', icon: LayoutDashboard },
    { id: 'assistant', label: 'Neural AI Assist', icon: Bot, badge: 'MU AI' },
    { id: 'map', label: '3D Digital Twin Map', icon: Compass, badge: 'Live Twin' },
    { id: 'events', label: 'Summits & Events', icon: Calendar, badge: '5 Live' },
    { id: 'facilities', label: 'Campus Facilities', icon: Building2 },
    { id: 'emergency', label: 'Emergency Evacuation', icon: AlertTriangle, badge: isEmergencyActive ? 'Alert' : undefined },
    { id: 'analytics', label: 'Campus Pulse Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Student Profile', icon: User },
  ];

  return (
    <aside className="hidden md:flex flex-col flex-shrink-0 w-64 h-full bg-surface-container-low border-r border-surface-container-high/60 p-space-md justify-between select-none">
      <div className="flex flex-col gap-space-sm">
        <div className="px-2 py-1 mb-1 flex items-center justify-between">
          <span className="font-code-telemetry text-code-telemetry text-on-surface-variant uppercase tracking-wider text-[11px] font-semibold">
            Marwadi University
          </span>
          <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Online
          </span>
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = activeScreen === item.id || (item.id === 'map' && activeScreen === 'navigation');
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveScreen(item.id)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-on-primary font-semibold shadow-sm'
                    : 'text-on-surface hover:bg-surface-container active:scale-[0.98]'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-on-primary' : 'text-on-surface-variant'}`} />
                  <span className="font-label-md text-label-md truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container'
                        : item.id === 'emergency'
                        ? 'bg-error text-on-error animate-pulse'
                        : item.id === 'map'
                        ? 'bg-cyan-100 text-cyan-800'
                        : 'bg-surface-container-high text-secondary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Emergency Quick Action in Sidebar */}
      <div className="p-3 bg-surface-container-lowest rounded-xl shadow-xs flex flex-col gap-2 border border-surface-container">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm text-error font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-error" />
            <span>Emergency Quick Link</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
        </div>
        <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
          MU Campus Security & Highway Gate Triage responders on standby.
        </p>
        <button
          onClick={() => setActiveScreen('emergency')}
          className="w-full py-2 px-3 rounded-lg bg-error hover:bg-error/95 text-on-error text-xs font-bold transition-colors active:scale-95 cursor-pointer shadow-2xs"
        >
          Open Tactical Evacuation HUD
        </button>
      </div>
    </aside>
  );
};
