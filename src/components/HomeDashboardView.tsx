/**
 * CampusPilot Home Dashboard View
 * Preserves the Stitch visual layout and interactive command hub.
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
  Sliders,
  Sparkles,
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
    runDemoScenario,
    triggerEmergency,
  } = useCampus();

  const [commandQuery, setCommandQuery] = useState('');

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commandQuery.trim()) return;

    // Send query to AI Assist
    addChatMessage({
      id: 'msg-cmd-' + Date.now(),
      sender: 'user',
      timestamp: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Command Bar`,
      text: commandQuery,
    });
    setCommandQuery('');
    setActiveScreen('assistant');
  };

  const nextEvent = CAMPUS_EVENTS[0]; // AI & Machine Learning Workshop

  const handleNavigateNextEvent = () => {
    setSelectedEvent(nextEvent);
    const bldg = CAMPUS_BUILDINGS.find((b) => b.id === nextEvent.buildingId);
    if (bldg) {
      setSelectedBuilding(bldg);
    }
    setActiveScreen('map');
  };

  const promptChips = [
    'Take me to the library',
    'AI Workshop venue?',
    'Nearest cafeteria',
    'Quiet study pods',
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-24 select-none">
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-5">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-on-surface">
                Good afternoon, {userProfile.name} 👋
              </h1>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              {userProfile.department} • {userProfile.year} • {telemetry.currentZone}
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low border border-surface-container">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
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
                  Code Orange Active: Corridor 2B Hazard
                </span>
                <span className="text-xs opacity-90">
                  Corridor 2B is obstructed. Tap to view tactical evacuation path.
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
              placeholder="Ask anything about campus, buildings, events, quiet study..."
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

        {/* "Next Up" Event Card */}
        <div className="p-5 rounded-3xl bg-linear-to-br from-primary/10 via-surface-container-lowest to-surface-container-low border border-primary/20 shadow-xs relative overflow-hidden">
          <div className="flex items-start justify-between gap-3 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-on-primary uppercase tracking-wider">
              Next Up • In 25 min
            </span>
            <span className="font-code-telemetry text-xs font-bold text-secondary">
              Starts at 2:30 PM
            </span>
          </div>

          <h3 className="font-headline-sm text-xl font-bold text-on-surface mb-1">
            {nextEvent.title}
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant mb-4">
            {nextEvent.venue} • {nextEvent.room}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateNextEvent}
              className="py-2.5 px-4 rounded-xl bg-primary text-on-primary font-headline-sm font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-transform cursor-pointer"
            >
              <Compass className="w-4 h-4" />
              <span>Start Safe Navigation</span>
            </button>
            <button
              onClick={() => {
                setSelectedEvent(nextEvent);
                setActiveScreen('events');
              }}
              className="py-2.5 px-4 rounded-xl border border-surface-container font-bold text-sm text-on-surface hover:bg-surface-container cursor-pointer"
            >
              Event Agenda
            </button>
          </div>
        </div>

        {/* Campus Hub 4 Action Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => setActiveScreen('map')}
            className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container shadow-xs text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-headline-sm text-sm font-bold text-on-surface block">
              3D Live Map
            </span>
            <span className="text-xs text-on-surface-variant">Route Optimization</span>
          </button>

          <button
            onClick={() => setActiveScreen('events')}
            className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container shadow-xs text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="font-headline-sm text-sm font-bold text-on-surface block">
              Events
            </span>
            <span className="text-xs text-on-surface-variant">8 Active on campus</span>
          </button>

          <button
            onClick={() => setActiveScreen('facilities')}
            className="p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container border border-surface-container shadow-xs text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-tertiary/15 text-tertiary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-headline-sm text-sm font-bold text-on-surface block">
              Facilities
            </span>
            <span className="text-xs text-on-surface-variant">Labs, Desks & Cafes</span>
          </button>

          <button
            onClick={() => {
              triggerEmergency('Fire');
              setActiveScreen('emergency');
            }}
            className="p-4 rounded-2xl bg-red-500/10 hover:bg-red-500/15 border border-red-500/30 shadow-xs text-left transition-all active:scale-95 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-error text-on-error flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="font-headline-sm text-sm font-bold text-error block">
              Emergency SOS
            </span>
            <span className="text-xs text-red-700">Evacuation HUD</span>
          </button>
        </div>

        {/* 3D Digital Twin Preview Banner */}
        <div className="p-5 rounded-3xl bg-surface-container-lowest border border-surface-container shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                <span className="font-code-telemetry text-xs font-bold text-secondary uppercase">
                  3D Digital Twin Active
                </span>
              </div>
              <h3 className="font-headline-sm text-lg font-bold text-on-surface">
                Interactive Spatial Campus Explorer
              </h3>
              <p className="font-body-md text-xs text-on-surface-variant max-w-md">
                Isometric buildings, CCTV sensor streams, crowd heatmaps, and wheelchair-accessible paths rendered in real time.
              </p>
            </div>

            <button
              onClick={() => setActiveScreen('map')}
              className="py-2.5 px-4 rounded-xl bg-secondary text-on-secondary font-bold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-transform whitespace-nowrap cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Open 3D Campus Explorer</span>
            </button>
          </div>
        </div>

        {/* Live Campus Pulse Telemetry Grid */}
        <div className="space-y-3">
          <h3 className="font-headline-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            Live Campus Pulse Telemetry
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
                Crowd Density
              </span>
              <span className="font-headline-sm text-xl font-bold text-secondary">
                {telemetry.crowdDensityPercent}%
              </span>
              <span className="text-xs text-on-surface-variant block mt-0.5">
                {telemetry.crowdStatus} Flow
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
                Library Desks
              </span>
              <span className="font-headline-sm text-xl font-bold text-tertiary">
                {telemetry.openDesksInLibrary} Vacant
              </span>
              <span className="text-xs text-on-surface-variant block mt-0.5">
                32 dB Quiet Zone
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
                Current Quad
              </span>
              <span className="font-headline-sm text-base font-bold text-on-surface truncate block">
                {telemetry.currentZone}
              </span>
              <span className="text-xs text-on-surface-variant block mt-0.5">
                {telemetry.beaconId}
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container">
              <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
                Campus Weather
              </span>
              <span className="font-headline-sm text-xl font-bold text-on-surface">
                {telemetry.temperature}
              </span>
              <span className="text-xs text-on-surface-variant block mt-0.5">
                {telemetry.weatherCondition}
              </span>
            </div>
          </div>
        </div>

        {/* Demo Scenario Quick Access */}
        <div className="p-4 rounded-2xl bg-surface-container-low border border-surface-container flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-secondary" />
            <span className="font-headline-sm text-xs font-bold text-on-surface">
              Demo Simulation Presets:
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => runDemoScenario('workshop')}
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-xs font-semibold text-primary hover:bg-surface-container border border-surface-container cursor-pointer"
            >
              AI Workshop A*
            </button>
            <button
              onClick={() => runDemoScenario('emergency')}
              className="px-2.5 py-1 rounded-lg bg-error-container text-xs font-semibold text-error hover:bg-error-container/80 border border-error/20 cursor-pointer"
            >
              Corridor 2B Fire
            </button>
            <button
              onClick={() => runDemoScenario('reset')}
              className="px-2.5 py-1 rounded-lg bg-surface-container-lowest text-xs font-semibold text-on-surface hover:bg-surface-container border border-surface-container cursor-pointer"
            >
              Reset Normal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
