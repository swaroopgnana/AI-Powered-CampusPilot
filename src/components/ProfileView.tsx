/**
 * CampusPilot Student Profile & Preferences View
 * Manages user credentials, accessible routing flags, saved locations,
 * emergency contacts, and interactive scenario demo triggers.
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
              {userProfile.department} • {userProfile.year}
            </p>
            <p className="font-code-telemetry text-xs text-on-surface-variant mt-0.5">
              ID: {userProfile.studentId}
            </p>
          </div>
        </div>

        {/* Demo Mode Controller Panel */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border-2 border-secondary/30 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-secondary flex-shrink-0" />
              <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                CampusPilot Interactive Demo Scenarios
              </h3>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
              Demo Switcher
            </span>
          </div>

          <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
            Quickly trigger predefined campus simulation states to test routing algorithms, computer vision, and evacuation protocols.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              onClick={() => runDemoScenario('workshop')}
              className="p-3 rounded-xl bg-surface-container-low hover:bg-surface-container border border-surface-container text-left transition-colors active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Compass className="w-4 h-4 text-primary" />
                <span className="font-label-md font-bold text-primary text-xs sm:text-sm">
                  1. Workshop Nav
                </span>
              </div>
              <span className="text-xs text-on-surface-variant block">
                Routes to Turing Room 302 via A* Heuristic
              </span>
            </button>

            <button
              onClick={() => runDemoScenario('emergency')}
              className="p-3 rounded-xl bg-red-950/20 hover:bg-red-950/30 border border-red-500/40 text-left transition-colors active:scale-95 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 mb-0.5">
                <Flame className="w-4 h-4 text-error" />
                <span className="font-label-md font-bold text-error text-xs sm:text-sm">
                  2. Evac Corridor 2B
                </span>
              </div>
              <span className="text-xs text-red-300 block">
                Code Orange • Blocks path & opens North Evac
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
                Resets hazards & telemetry to standard
              </span>
            </button>
          </div>
        </div>

        {/* Routing Engine Preferences */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-4">
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
            Navigation & Routing Engine Preferences
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
                Preferred Route Metric
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['SAFEST', 'FASTEST', 'ACCESSIBLE'] as RoutePreference[]).map((pref) => (
                  <button
                    key={pref}
                    onClick={() => setActivePreference(pref)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activePreference === pref
                        ? 'bg-secondary text-on-secondary shadow-xs'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {pref}
                  </button>
                ))}
              </div>
            </div>

            {/* Accessibility step-free toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <Accessibility className="w-5 h-5 text-secondary flex-shrink-0" />
                <div>
                  <span className="font-label-md text-xs sm:text-sm font-semibold text-on-surface block">
                    Strict Accessibility Mode
                  </span>
                  <span className="text-[11px] sm:text-xs text-on-surface-variant">
                    Require step-free routes, elevators, and automatic doors only
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={userProfile.accessibleOnly}
                onChange={(e) => {
                  updateUserProfile({ accessibleOnly: e.target.checked });
                  if (e.target.checked) setActivePreference('ACCESSIBLE');
                }}
                className="w-5 h-5 accent-secondary cursor-pointer"
              />
            </div>

            {/* Voice Guidance Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-tertiary flex-shrink-0" />
                <div>
                  <span className="font-label-md text-xs sm:text-sm font-semibold text-on-surface block">
                    Turn-by-Turn Audio Prompts
                  </span>
                  <span className="text-[11px] sm:text-xs text-on-surface-variant">
                    Speak upcoming direction milestones through headset
                  </span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={userProfile.voiceGuidance}
                onChange={(e) => updateUserProfile({ voiceGuidance: e.target.checked })}
                className="w-5 h-5 accent-tertiary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Saved Locations */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs space-y-3">
          <h3 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
            Saved Favorite Locations
          </h3>
          <div className="space-y-2">
            {userProfile.savedLocations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleSavedLocationClick(loc.buildingId)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="font-label-md text-xs sm:text-sm font-medium text-on-surface">
                    {loc.name}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
