/**
 * Marwadi University Digital Twin - Overview Portal
 * Calm, executive-grade design with purposeful whitespace and zero noise.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_EVENTS, CAMPUS_BUILDINGS } from '../data/campusData';
import {
  Search,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  Sparkles,
  ScanLine,
} from 'lucide-react';

interface HomeDashboardViewProps {
  onOpenSpotlight?: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({ onOpenSpotlight }) => {
  const {
    setActiveScreen,
    setSelectedBuilding,
    setSelectedEvent,
    addChatMessage,
    telemetry,
    userProfile,
    isEmergencyActive,
    setIsVisionModalOpen,
  } = useCampus();

  const [searchQuery, setSearchQuery] = useState('');

  const featuredEvents = CAMPUS_EVENTS.slice(0, 2);

  const keyLandmarks = [
    { building: CAMPUS_BUILDINGS[1], label: 'Academic & Tech', detail: 'Robotics & AI Labs' },
    { building: CAMPUS_BUILDINGS[2], label: 'Library & Quiet', detail: '142 Desks Available' },
    { building: CAMPUS_BUILDINGS[4], label: 'Dining Hub', detail: 'Food Court & Amul' },
    { building: CAMPUS_BUILDINGS[5], label: 'Recreation', detail: 'Pavilion & Indoor Arena' },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    addChatMessage({
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: searchQuery,
    });
    setSearchQuery('');
    setActiveScreen('assistant');
  };

  return (
    <div className="relative w-full h-full overflow-y-auto pb-24 bg-[#090d15] text-slate-100 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Emergency Alert (Only appears if an incident is triggered) */}
        {isEmergencyActive && (
          <div
            onClick={() => setActiveScreen('emergency')}
            className="p-3.5 rounded-xl bg-red-950/80 border border-red-700/80 text-white flex items-center justify-between cursor-pointer hover:bg-red-900/60 transition-colors"
          >
            <div className="text-xs text-red-200">
              <strong className="font-semibold text-white">Active Safety Protocol:</strong> FOE Block corridor rerouted. Click to view safe route to Highway Gate 1.
            </div>
            <ArrowRight className="w-4 h-4 text-red-300 shrink-0 ml-2" />
          </div>
        )}

        {/* Minimalist Welcome Header */}
        <div className="space-y-1.5">
          <div className="text-xs text-slate-500 font-medium">
            Marwadi University · Rajkot Campus
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Welcome back, {userProfile.name.split(' ')[0]}
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Spatial digital twin, multi-floor navigation, and live facility telemetry.
          </p>
        </div>

        {/* Unified Search Input (Calm, centered, focused) */}
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search academic blocks, labs, library pods, or ask for directions... (⌘K)"
            className="w-full h-12 pl-11 pr-24 rounded-xl bg-[#0f1422] border border-white/[0.08] text-slate-100 placeholder:text-slate-500 text-sm focus:outline-hidden focus:border-sky-500/80 transition-colors"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs cursor-pointer transition-colors"
            >
              Ask AI
            </button>
          </div>
        </form>

        {/* Quiet Key Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500">Active on Campus</div>
            <div className="text-xl font-semibold text-white mt-1 tabular-nums">
              {telemetry.activeUsers.toLocaleString()}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500">Quad Flow Density</div>
            <div className="text-xl font-semibold text-sky-400 mt-1 tabular-nums">
              {telemetry.crowdDensityPercent}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500">Library Open Desks</div>
            <div className="text-xl font-semibold text-emerald-400 mt-1 tabular-nums">
              {telemetry.openDesksInLibrary}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500">Weather & Air</div>
            <div className="text-xl font-semibold text-white mt-1">
              {telemetry.temperature}
            </div>
          </div>
        </div>

        {/* 3D Map Feature Banner (Clean Architectural Callout) */}
        <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0e1320] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-medium">
              <Compass className="w-3.5 h-3.5" />
              <span>3D Spatial Map</span>
            </div>
            <h2 className="text-lg font-semibold text-white">
              Explore the Autonomous Digital Twin
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Navigate turn-by-turn between lecture halls, engineering laboratories, and the knowledge resource center with step-free pathfinding.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveScreen('map')}
              className="px-4 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Open 3D Map</span>
            </button>
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="px-3.5 py-2.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 font-medium text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5 text-slate-400" />
              <span>Vision Scan</span>
            </button>
          </div>
        </div>

        {/* Primary Landmarks Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">Popular Landmarks</span>
            <button
              onClick={() => setActiveScreen('facilities')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              View directory →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {keyLandmarks.map(({ building, label, detail }) => (
              <button
                key={building.id}
                onClick={() => {
                  setSelectedBuilding(building);
                  setActiveScreen('map');
                }}
                className="p-4 rounded-xl bg-[#0e1320] hover:bg-[#121827] border border-white/[0.06] hover:border-white/[0.12] text-left transition-all cursor-pointer group flex flex-col justify-between h-28"
              >
                <div>
                  <div className="text-[11px] font-mono text-sky-400">{building.code}</div>
                  <div className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors truncate mt-0.5">
                    {building.name.split('(')[0]}
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-white/[0.04]">
                  <span>{detail}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-sky-400" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Scheduled Campus Events */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium text-slate-300">Upcoming Events</span>
            <button
              onClick={() => setActiveScreen('events')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              All events →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {featuredEvents.map((ev) => (
              <div
                key={ev.id}
                className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06] flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    <span>{ev.timeText}</span>
                    <span>·</span>
                    <MapPin className="w-3 h-3" />
                    <span>{ev.venue}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
                  <span className="text-xs text-slate-500">{ev.category}</span>
                  <button
                    onClick={() => {
                      setSelectedEvent(ev);
                      const b = CAMPUS_BUILDINGS.find((bldg) => bldg.id === ev.buildingId);
                      if (b) setSelectedBuilding(b);
                      setActiveScreen('map');
                    }}
                    className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Navigate</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
