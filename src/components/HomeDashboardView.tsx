/**
 * CampusPilot Home Dashboard View
 * Tailored for Marwadi University (MU) Campus
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_EVENTS, CAMPUS_BUILDINGS } from '../data/campusData';
import {
  Search,
  ArrowRight,
  Compass,
  Calendar,
  Building2,
  AlertTriangle,
  Layers,
  Sparkles,
  MapPin,
  Clock,
  Radio,
  ScanLine,
} from 'lucide-react';

export const HomeDashboardView: React.FC = () => {
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

  const [commandQuery, setCommandQuery] = useState('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandQuery.trim()) return;

    addChatMessage({
      id: 'msg-cmd-' + Date.now(),
      sender: 'user',
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Command Bar`,
      text: commandQuery,
    });
    setCommandQuery('');
    setActiveScreen('assistant');
  };

  const nextEvent = CAMPUS_EVENTS[0]; // Marwadi AI Summit

  const handleNavigateNextEvent = () => {
    setSelectedEvent(nextEvent);
    const bldg = CAMPUS_BUILDINGS.find((b) => b.id === nextEvent.buildingId);
    if (bldg) {
      setSelectedBuilding(bldg);
    }
    setActiveScreen('map');
  };

  const promptChips = [
    'Marwadi AI Summit venue?',
    'Take me to Central Digital Library',
    'Where is the Food Court & Amul?',
    'FOE Block AI Supercomputer Lab',
    'Emergency safe route to Highway Gate',
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-24 select-none">
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-5">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-on-surface">
                Welcome to Marwadi University, {userProfile.name} 👋
              </h1>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              {userProfile.department} • {userProfile.year} • {telemetry.currentZone}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-code-telemetry text-xs font-semibold text-on-surface">
              {telemetry.temperature} • {telemetry.weatherCondition}
            </span>
          </div>
        </div>

        {/* Emergency Active Alert Strip */}
        {isEmergencyActive && (
          <div
            onClick={() => setActiveScreen('emergency')}
            className="p-3.5 rounded-2xl bg-error text-on-error flex items-center justify-between cursor-pointer shadow-md hover:bg-error/95 transition-all"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 animate-pulse flex-shrink-0" />
              <div>
                <span className="font-headline-sm text-sm font-bold block">
                  Code Orange Active: FOE Corridor 2B Electrical Surge Hazard
                </span>
                <span className="text-xs opacity-90">
                  Engineering Block corridor blocked. Tap to view tactical safe evacuation path to Highway Gate 1.
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 flex-shrink-0" />
          </div>
        )}

        {/* Command Bar with Search */}
        <div className="space-y-2">
          <form
            onSubmit={handleCommandSubmit}
            className="relative flex items-center w-full shadow-xs rounded-2xl bg-surface-container-lowest border border-surface-container focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all"
          >
            <Search className="absolute left-4 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              value={commandQuery}
              onChange={(e) => setCommandQuery(e.target.value)}
              placeholder="Ask anything about Marwadi University, FOE labs, Central Library, events..."
              className="w-full h-13 pl-12 pr-12 rounded-2xl bg-transparent text-on-surface placeholder:text-on-surface-variant text-body-md focus:outline-hidden"
            />
            <button
              type="submit"
              className="absolute right-3 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Prompt Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {promptChips.map((chip) => (
              <button
                key={chip}
                onClick={() => {
                  setCommandQuery(chip);
                  addChatMessage({
                    id: 'msg-chip-' + Date.now(),
                    sender: 'user',
                    timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Quick Prompt`,
                    text: chip,
                  });
                  setActiveScreen('assistant');
                }}
                className="flex-shrink-0 px-3 py-1 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface text-label-sm font-medium border border-surface-container transition-all active:scale-95 cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Digital Twin 3D Hero Portal Card */}
        <div className="p-5 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                Live 3D Digital Twin
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Rajkot Campus • Latency 8ms
              </span>
            </div>

            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono text-emerald-400 font-semibold">Mesh Synchronized</span>
            </div>
          </div>

          <div className="space-y-1 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Interactive Marwadi University 3D Twin & Spatial HUD
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time university spatial model featuring live IoT crowd sensor feeds, CCTV network tracking, safety-aware A* routing, and building digital twins.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={() => setActiveScreen('map')}
              className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Launch 3D Campus Twin</span>
            </button>

            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 border border-slate-700 active:scale-95 transition-all cursor-pointer"
            >
              <ScanLine className="w-4 h-4 text-cyan-400" />
              <span>AI Vision Hazard Inspection</span>
            </button>
          </div>
        </div>

        {/* Next Up Event Card */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-primary/10 via-surface-container-lowest to-surface-container-low border border-primary/20 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/20 text-primary">
                Featured University Event
              </span>
              <h2 className="font-headline-sm text-lg sm:text-xl font-bold text-on-surface mt-1.5">
                {nextEvent.title}
              </h2>
            </div>
            {nextEvent.isLiveNow && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-error-container text-error text-xs font-bold animate-pulse flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-error"></span>
                Happening Now
              </span>
            )}
          </div>

          <p className="font-body-md text-sm text-on-surface-variant mb-4 leading-relaxed">
            {nextEvent.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-on-surface-variant mb-4 bg-surface-container-low p-3 rounded-2xl">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-primary" />
              <span>{nextEvent.timeText}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-secondary" />
              <span>{nextEvent.venue} ({nextEvent.room})</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNavigateNextEvent}
              className="py-2.5 px-4 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center gap-2 shadow-xs hover:bg-primary/95 active:scale-95 transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Navigate Venue in 3D Map</span>
            </button>

            <button
              onClick={() => setActiveScreen('events')}
              className="py-2.5 px-4 rounded-xl bg-surface-container text-on-surface font-semibold text-xs hover:bg-surface-container-high transition-colors cursor-pointer"
            >
              View All Events
            </button>
          </div>
        </div>

        {/* Campus Telemetry Quick Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Active Campus Scholars
            </span>
            <span className="font-headline-sm text-2xl font-bold text-on-surface">
              {telemetry.activeUsers.toLocaleString()}
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">Live across Rajkot campus</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Digital Library Vacancy
            </span>
            <span className="font-headline-sm text-2xl font-bold text-secondary">
              {telemetry.openDesksInLibrary} Desks Free
            </span>
            <span className="text-xs text-secondary font-semibold mt-1 block">Quiet score: {telemetry.libraryNoiseDb} dB</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              CCTV AI Mesh
            </span>
            <span className="font-headline-sm text-2xl font-bold text-tertiary">
              100% Active
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">Optical hazard scanning on</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Spatial Ping Latency
            </span>
            <span className="font-headline-sm text-2xl font-bold text-on-surface">
              {telemetry.meshLatencyMs} ms
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">Beacon #09 synchronized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
