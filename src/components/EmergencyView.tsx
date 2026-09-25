/**
 * CampusPilot Emergency Evacuation Tactical System
 * Safety Command Center with Real-Time Incident Tracking for Marwadi University,
 * Multi-Hazard Trigger Grid, and Highway Gate 1 Safe-Route Evacuation HUD.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import {
  AlertTriangle,
  Flame,
  Stethoscope,
  Users,
  Ban,
  Droplets,
  ShieldAlert,
  Brain,
  Navigation,
  CheckCircle2,
  ShieldCheck,
  ScanLine,
  Phone,
  Check,
} from 'lucide-react';

export const EmergencyView: React.FC = () => {
  const {
    isEmergencyActive,
    activeIncident,
    triggerEmergency,
    resolveEmergency,
    setActiveScreen,
    setSelectedBuilding,
    setIsNavigating,
    setIsVisionModalOpen,
    userProfile,
  } = useCampus();

  const [hasCheckedInSafe, setHasCheckedInSafe] = useState(false);

  const emergencyCategories = [
    { type: 'Fire', label: 'Fire & Smoke', icon: Flame, color: 'bg-red-600' },
    { type: 'Medical Emergency', label: 'Medical Aid', icon: Stethoscope, color: 'bg-rose-600' },
    { type: 'Overcrowding', label: 'Stampede / Crowd', icon: Users, color: 'bg-amber-600' },
    { type: 'Blocked Road', label: 'Path Obstruction', icon: Ban, color: 'bg-orange-600' },
    { type: 'Flood', label: 'Flood / Leak', icon: Droplets, color: 'bg-blue-600' },
    { type: 'Security Alert', label: 'Security Alert', icon: ShieldAlert, color: 'bg-purple-600' },
  ];

  const handleStartEvacuation = () => {
    const safeZone = CAMPUS_BUILDINGS.find((b) => b.id === 'bldg-northgate');
    if (safeZone) {
      setSelectedBuilding(safeZone);
    }
    setIsNavigating(true);
    setActiveScreen('map');
  };

  const handleCheckInSafe = () => {
    setHasCheckedInSafe(true);
    setTimeout(() => setHasCheckedInSafe(false), 5000);
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto pb-24 select-none">
      {/* Tactical Status Banner */}
      <div className="px-space-md py-3 bg-slate-900 border-b border-red-900/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-error flex items-center justify-center text-on-error shadow-sm flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-sm text-sm font-bold text-red-200">
                MU Emergency Command HUD
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isEmergencyActive ? 'bg-error text-white animate-pulse' : 'bg-emerald-900/60 text-emerald-300'
              }`}>
                {isEmergencyActive ? 'Active Protocol' : 'Normal Standby'}
              </span>
            </div>
            <p className="font-code-telemetry text-xs text-slate-400">
              Emergency Hotlines: +91 281 7123456 / 100 / 108 (24/7 Security)
            </p>
          </div>
        </div>

        {isEmergencyActive && (
          <button
            onClick={resolveEmergency}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
          >
            Clear Alert
          </button>
        )}
      </div>

      <div className="p-space-md max-w-4xl mx-auto w-full space-y-4">
        {/* Real-Time Active Incident Card */}
        {isEmergencyActive && activeIncident ? (
          <div className="p-5 rounded-2xl bg-slate-900 border-2 border-red-600/80 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600 text-white flex items-center gap-1.5 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                  {activeIncident.severity} Severity
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-red-300 border border-slate-700">
                  {activeIncident.type}
                </span>
              </div>
              <span className="font-code-telemetry text-xs text-slate-400">
                Verified: {activeIncident.timestamp}
              </span>
            </div>

            <h3 className="font-headline-md text-lg sm:text-xl font-bold text-white mb-1">
              {activeIncident.title}
            </h3>
            <p className="font-body-md text-slate-300 text-sm mb-4 leading-relaxed">
              {activeIncident.description}
            </p>

            {/* Tactical Evacuation Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800 mb-4">
              <div>
                <span className="text-[10px] font-code-telemetry text-slate-400 uppercase block">
                  Location
                </span>
                <span className="font-label-md font-bold text-red-300 text-sm truncate block">
                  {activeIncident.location}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-code-telemetry text-slate-400 uppercase block">
                  Hazard Proximity
                </span>
                <span className="font-label-md font-bold text-amber-400 text-sm block">
                  170 meters
                </span>
              </div>
              <div>
                <span className="text-[10px] font-code-telemetry text-slate-400 uppercase block">
                  Transit to Safety
                </span>
                <span className="font-label-md font-bold text-emerald-400 text-sm block">
                  ~3 mins walk
                </span>
              </div>
              <div>
                <span className="text-[10px] font-code-telemetry text-slate-400 uppercase block">
                  Designated Safe Zone
                </span>
                <span className="font-label-md font-bold text-white text-sm truncate block">
                  Highway Gate 1 Lawn 1
                </span>
              </div>
            </div>

            {/* AI Real-time Directive */}
            <div className="p-3.5 rounded-xl bg-red-950/50 border border-red-500/40 mb-4 flex items-start gap-3">
              <Brain className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-red-200 block mb-0.5">
                  AI Tactical Evacuation Directive
                </span>
                <p className="text-xs text-red-300 leading-relaxed">
                  {activeIncident.recommendedDirective}
                </p>
              </div>
            </div>

            {/* Evacuation Actions */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleStartEvacuation}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-headline-sm text-sm font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
              >
                <Navigation className="w-4 h-4" />
                <span>Navigate Highway Gate 1 Safe Zone (3D Map)</span>
              </button>

              <button
                onClick={handleCheckInSafe}
                className={`py-3 px-5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  hasCheckedInSafe
                    ? 'bg-emerald-800 text-emerald-200 border-emerald-600'
                    : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700 active:scale-95'
                }`}
              >
                {hasCheckedInSafe ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-300" />
                    <span>Reported Safe ✓</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>I Am Safe (Check-in)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/60 shadow-lg text-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-900/40 text-emerald-400 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-headline-sm text-lg font-bold text-white mb-1">
              Marwadi University Normal Safety State
            </h3>
            <p className="font-body-md text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
              All academic blocks (FOE, FMS), digital library, and sports avenues have clear pathways and 100% active CCTV optical mesh monitoring.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-mono border border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>All 38 Optical Mesh Sensors Active</span>
            </div>
          </div>
        )}

        {/* Instant Multi-Hazard Incident Trigger Grid */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-white">
                Report Campus Incident or Trigger Simulation
              </h3>
              <p className="font-body-sm text-xs text-slate-400">
                Immediately updates routing graphs and alerts Marwadi University response squads
              </p>
            </div>
            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Vision Scan</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {emergencyCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.type}
                  onClick={() => triggerEmergency(cat.type)}
                  className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all active:scale-95 cursor-pointer flex flex-col gap-2"
                >
                  <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center text-white shadow-xs`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-label-md text-xs font-bold text-white block">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Trigger Protocol
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Emergency Contacts Hotlines */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <h3 className="font-headline-sm text-base font-bold text-white mb-3 flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>Campus Emergency Contacts</span>
          </h3>

          <div className="space-y-2">
            {userProfile.emergencyContacts.map((c, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-white block">{c.name}</span>
                  <span className="text-[11px] text-slate-400">{c.role}</span>
                </div>
                <a
                  href={`tel:${c.number.split('/')[0].trim()}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-code-telemetry text-xs font-bold border border-emerald-500/30"
                >
                  {c.number}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
