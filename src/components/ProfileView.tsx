/**
 * CampusPilot Student Profile & Preferences View
 * Configured for Marwadi University Student Context
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { RouteOptimizer, RoutePreference } from '../types';
import {
  Sliders,
  Accessibility,
  Volume2,
  Bookmark,
  ChevronRight,
  Flame,
  CheckCircle,
  Compass,
  Radio,
} from 'lucide-react';

export const ProfileView: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    activeAlgorithm,
    setActiveAlgorithm,
    activePreference,
    setActivePreference,
    runDemoScenario,
    setSelectedBuilding,
    setActiveScreen,
  } = useCampus();

  const handleSavedLocationClick = (buildingId: string) => {
    const bldg = CAMPUS_BUILDINGS.find((b) => b.id === buildingId);
    if (bldg) {
      setSelectedBuilding(bldg);
      setActiveScreen('map');
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-24 select-none">
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-4">
        {/* User Profile Card */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs flex items-center gap-4">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-primary/20 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface">
                {userProfile.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                {userProfile.role}
              </span>
            </div>
            <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
              {userProfile.department} • {userProfile.year} • Marwadi University
            </p>
            <p className="font-code-telemetry text-xs text-on-surface-variant mt-0.5">
              Enrollment ID: {userProfile.studentId}
            </p>
          </div>
        </div>

        {/* Demo Mode Controller Panel */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-secondary/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-secondary flex-shrink-0" />
              <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                Marwadi University Digital Twin Simulation Controls
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 text-xs font-bold">
              Digital Twin Sandbox
            </span>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Quickly trigger predefined university scenarios to test spatial routing algorithms, computer vision optical flow, and emergency evacuation protocols.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => runDemoScenario('workshop')}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left transition-colors active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Compass className="w-4 h-4 text-primary" />
                <span className="font-label-md font-bold text-primary text-xs sm:text-sm">
                  1. AI Summit Nav
                </span>
              </div>
              <span className="text-xs text-on-surface-variant block">
                Routes to FOE Lab 312 via A* Heuristic
              </span>
            </button>

            <button
              onClick={() => runDemoScenario('emergency')}
              className="p-3 rounded-xl bg-red-950/20 hover:bg-red-950/30 border border-red-500/40 text-left transition-colors active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Flame className="w-4 h-4 text-error" />
                <span className="font-label-md font-bold text-error text-xs sm:text-sm">
                  2. Evac FOE Corridor 2B
                </span>
              </div>
              <span className="text-xs text-red-300 block">
                Code Orange • Reroutes to Highway Gate 1
              </span>
            </button>

            <button
              onClick={() => runDemoScenario('reset')}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left transition-colors active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span className="font-label-md font-bold text-on-surface text-xs sm:text-sm">
                  3. Normal Day
                </span>
              </div>
              <span className="text-xs text-on-surface-variant block">
                Clears alerts & telemetry to normal
              </span>
            </button>
          </div>
        </div>

        {/* Routing Engine Preferences */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
            Navigation & Digital Twin Routing Engine Preferences
          </h3>

          <div className="space-y-3">
            <div>
              <label className="font-label-sm text-xs text-on-surface-variant block mb-1">
                Default Graph Routing Algorithm
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['A*', 'Dijkstra', 'BFS', 'DFS'] as RouteOptimizer[]).map((algo) => (
                  <button
                    key={algo}
                    onClick={() => setActiveAlgorithm(algo)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeAlgorithm === algo
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {algo}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-label-sm text-xs text-on-surface-variant block mb-1">
                Default Path Preference
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'SAFEST', label: 'Safest (CCTV)' },
                    { id: 'FASTEST', label: 'Fastest Direct' },
                    { id: 'ACCESSIBLE', label: 'Accessible (Ramps)' },
                  ] as { id: RoutePreference; label: string }[]
                ).map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => setActivePreference(pref.id)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                      activePreference === pref.id
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-surface-container flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-on-surface-variant" />
                <div>
                  <span className="font-label-md text-xs sm:text-sm font-semibold text-on-surface block">
                    Strict Accessibility Mode
                  </span>
                  <span className="font-body-sm text-xs text-on-surface-variant">
                    Always avoid stairs, narrow paths, or stepped elevations across campus
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={userProfile.accessibleOnly}
                onChange={(e) => updateUserProfile({ accessibleOnly: e.target.checked })}
                className="w-5 h-5 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Saved University Bookmarks */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface mb-3 flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-primary" />
            <span>Saved Marwadi University Locations</span>
          </h3>

          <div className="space-y-2">
            {userProfile.savedLocations.map((loc) => (
              <div
                key={loc.id}
                onClick={() => handleSavedLocationClick(loc.buildingId)}
                className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container flex items-center justify-between cursor-pointer transition-colors"
              >
                <span className="text-xs font-bold text-on-surface">{loc.name}</span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface mb-3">
            Campus Emergency Contacts
          </h3>

          <div className="space-y-2.5">
            {userProfile.emergencyContacts.map((contact, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-surface-container-low border border-surface-container flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-on-surface block">{contact.name}</span>
                  <span className="text-[11px] text-on-surface-variant">{contact.role}</span>
                </div>
                <span className="font-code-telemetry text-xs font-bold text-primary">
                  {contact.number}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
