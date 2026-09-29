/**
 * CampusPilot Student Profile & Settings View
 * Clean, calm profile view with navigation preferences and saved places.
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import { RouteOptimizer, RoutePreference } from '../types';
import {
  Accessibility,
  Volume2,
  Bookmark,
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

  const algorithms: RouteOptimizer[] = ['A*', 'Dijkstra'];

  return (
    <div className="relative w-full h-full overflow-y-auto pb-28 select-none bg-[#090d15] text-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* User Profile Card */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] flex items-center gap-4">
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-14 h-14 rounded-xl object-cover border border-white/[0.1] shrink-0"
          />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold text-white truncate">
                {userProfile.name}
              </h1>
              <span className="text-xs text-sky-400 font-medium">
                {userProfile.role}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              {userProfile.department} · {userProfile.year} · Marwadi University
            </div>
            <div className="text-xs font-mono text-slate-500 mt-0.5">
              ID: {userProfile.studentId}
            </div>
          </div>
        </div>

        {/* Navigation & Spatial Routing Preferences */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] space-y-4">
          <h2 className="text-sm font-semibold text-white">
            Navigation Preferences
          </h2>

          {/* Accessible Routes Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Accessibility className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-xs font-medium text-white">
                  Step-Free & Elevator Routing
                </div>
                <div className="text-[11px] text-slate-400">
                  Prioritize wheelchair ramps, automatic doors, and elevator banks
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                updateUserProfile({
                  accessibleOnly: !userProfile.accessibleOnly,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                userProfile.accessibleOnly ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  userProfile.accessibleOnly ? 'translate-x-4' : 'translate-x-0.5'
                } top-0.5 absolute`}
              />
            </button>
          </div>

          {/* Voice Guidance Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/[0.04]">
            <div className="flex items-center gap-3">
              <Volume2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-medium text-white">
                  Spoken Turn-by-Turn Audio Guidance
                </div>
                <div className="text-[11px] text-slate-400">
                  Voice cues when approaching turns and building entrances
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                updateUserProfile({
                  voiceGuidance: !userProfile.voiceGuidance,
                })
              }
              className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
                userProfile.voiceGuidance ? 'bg-sky-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform ${
                  userProfile.voiceGuidance ? 'translate-x-4' : 'translate-x-0.5'
                } top-0.5 absolute`}
              />
            </button>
          </div>

          {/* Solver Selection */}
          <div className="space-y-1.5 pt-1">
            <div className="text-xs font-medium text-slate-400">
              Graph Routing Solver
            </div>
            <div className="flex gap-2">
              {algorithms.map((algo) => (
                <button
                  key={algo}
                  onClick={() => setActiveAlgorithm(algo)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    activeAlgorithm === algo
                      ? 'border-sky-500/40 bg-sky-500/15 text-sky-300'
                      : 'border-white/[0.06] bg-black/30 text-slate-400 hover:text-white'
                  }`}
                >
                  {algo} Algorithm
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Locations */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] space-y-3.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Bookmark className="w-3.5 h-3.5 text-sky-400" />
              <span>Saved Places</span>
            </h2>
            <span className="text-xs text-slate-500">
              {userProfile.savedLocations.length} locations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {userProfile.savedLocations.map((loc) => {
              const bldg = CAMPUS_BUILDINGS.find((b) => b.id === loc.buildingId);
              return (
                <div
                  key={loc.id}
                  onClick={() => handleSavedLocationClick(loc.buildingId)}
                  className="p-3 rounded-xl bg-black/30 hover:bg-black/50 border border-white/[0.04] hover:border-white/[0.08] transition-colors flex items-center justify-between cursor-pointer group"
                >
                  <div>
                    <div className="text-xs font-medium text-white group-hover:text-sky-300 transition-colors">
                      {loc.name}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {bldg?.code} · {bldg?.category}
                    </div>
                  </div>
                  <Compass className="w-3.5 h-3.5 text-slate-500 group-hover:text-sky-400 transition-colors" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
