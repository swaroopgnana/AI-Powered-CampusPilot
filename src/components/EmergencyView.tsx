/**
 * CampusPilot Emergency Evacuation Tactical System
 * Safety Command Center with Real-Time Incident Tracking,
 * Multi-Hazard Trigger Grid, and Safe-Route Evacuation HUD.
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
                Safety Command HUD
              </h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isEmergencyActive ? 'bg-error text-white animate-pulse' : 'bg-emerald-900/60 text-emerald-300'
              }`}>
                {isEmergencyActive ? 'Active Protocol' : 'Normal Standby'}
              </span>
            </div>
            <p className="font-code-telemetry text-xs text-slate-400">
              Emergency Hotline: 911 / 4444 (24/7 Response)
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
                  180 meters
                </span>
              </div>
              <div>
                <span className="text-[10px] font-code-telemetry text-slate-400 uppercase block">
                  Transit to Safety
                </span>
                <span className="font-label-md font-bold text-emerald-400 text-sm block">
                  ~3.5 mins walk
                </span>
              </div>
              <div>
                <span className="text-[10px] font-code-telemetry text-slate-400 uppercase block">
                  Designated Safe Zone
                </span>
                <span className="font-label-md font-bold text-white text-sm truncate block">
                  North Gate Lawn B
                </span>
              </div>
            </div>

            {/* AI Evacuation Engine Directive */}
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 mb-5 flex items-start gap-3">
              <Brain className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-label-sm font-bold text-red-200 block text-xs">
                  AI Evacuation Directive
                </span>
                <p className="font-body-sm text-red-200/90 text-sm mt-0.5 leading-relaxed">
                  {activeIncident.recommendedDirective}
                </p>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStartEvacuation}
                className="flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-headline-sm font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 active:scale-95 transition-all cursor-pointer"
              >
                <Navigation className="w-5 h-5" />
                <span>START EVACUATION SAFE ROUTE</span>
              </button>

              <button
                onClick={handleCheckInSafe}
                className={`py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  hasCheckedInSafe
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-500'
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {hasCheckedInSafe ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
                <span>{hasCheckedInSafe ? 'Status Logged Safe' : "I'm Safe Check-In"}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-headline-md text-lg font-bold text-white">
              Campus Environmental Conditions: All Clear
            </h3>
            <p className="font-body-md text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              All academic wings, walkways, and research labs are operating under normal security parameters.
            </p>
          </div>
        )}

        {/* 3D Evacuation Vector HUD Canvas */}
        <div className="p-space-md rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="font-code-telemetry text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              Tactical Evacuation Spatial HUD
            </span>
            <span className="font-code-telemetry text-xs text-emerald-400 font-bold">
              Green Vector = Hazard-Free Path
            </span>
          </div>

          <div className="relative w-full h-56 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 flex items-center justify-center">
            <svg viewBox="0 0 800 350" className="w-full h-full object-contain">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="350" fill="url(#grid)" />

              {/* Hazard Polygon: Engineering Block Level 2 */}
              <g className="animate-pulse">
                <circle cx="240" cy="230" r="70" fill="#dc2626" opacity="0.3" />
                <circle cx="240" cy="230" r="45" fill="#dc2626" opacity="0.5" />
                <text x="240" y="225" fill="#fecaca" fontSize="12" fontWeight="bold" textAnchor="middle">
                  HAZARD ZONE
                </text>
                <text x="240" y="242" fill="#ffffff" fontSize="10" textAnchor="middle">
                  Corridor 2B Blocked
                </text>
              </g>

              {/* Safe Zone: North Gate */}
              <g>
                <circle cx="560" cy="70" r="45" fill="#16a34a" opacity="0.25" className="animate-ping" />
                <circle cx="560" cy="70" r="28" fill="#16a34a" stroke="#4ade80" strokeWidth="2.5" />
                <text x="560" y="75" fill="#ffffff" fontSize="16" fontWeight="bold" textAnchor="middle">
                  ✓
                </text>
                <text x="560" y="115" fill="#86efac" fontSize="11" fontWeight="bold" textAnchor="middle">
                  North Gate Safe Zone
                </text>
              </g>

              {/* User Position */}
              <g>
                <circle cx="340" cy="280" r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
                <text x="340" y="310" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                  You (Quad B)
                </text>
              </g>

              {/* Glowing Green Evacuation Pathway circumventing danger */}
              <path
                d="M 340 280 Q 460 270 480 180 T 560 70"
                fill="none"
                stroke="#22c55e"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="8 6"
              />
            </svg>

            <div className="absolute bottom-2 left-3 bg-slate-900/80 px-2 py-1 rounded text-[11px] font-code-telemetry text-slate-300 border border-slate-800">
              Corridor 2B Bypass Vector • Step-free
            </div>
          </div>
        </div>

        {/* Fast SOS Category Trigger Grid */}
        <div className="space-y-2">
          <span className="font-headline-sm text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Report / Trigger Emergency Category
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {emergencyCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.type}
                  onClick={() => triggerEmergency(cat.type)}
                  className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center gap-3 transition-colors active:scale-95 text-left cursor-pointer"
                >
                  <div className={`w-9 h-9 rounded-lg ${cat.color} flex items-center justify-center text-white flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-label-md text-sm font-semibold text-slate-200 block truncate">
                      {cat.label}
                    </span>
                    <span className="font-code-telemetry text-[11px] text-slate-400">
                      Dispatch Alert
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Vision Hazard Scanner trigger button */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center flex-shrink-0">
              <ScanLine className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-headline-sm font-bold text-white text-sm">
                AI Vision Hazard Analysis
              </h4>
              <p className="font-body-sm text-slate-400 text-xs truncate">
                Upload or capture an image to identify fire, crowd congestion, or road blockage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsVisionModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex-shrink-0 cursor-pointer active:scale-95 transition-all"
          >
            Scan Hazard
          </button>
        </div>

        {/* Emergency Contacts List */}
        <div className="p-space-md rounded-2xl bg-slate-900 border border-slate-800">
          <span className="font-headline-sm text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Campus Emergency Directory
          </span>
          <div className="space-y-2">
            {userProfile.emergencyContacts.map((contact, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800"
              >
                <div>
                  <span className="font-label-md text-slate-200 text-sm font-semibold block">
                    {contact.name}
                  </span>
                  <span className="font-code-telemetry text-xs text-slate-400">
                    {contact.role}
                  </span>
                </div>
                <a
                  href={`tel:${contact.number.split('/')[0].trim()}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{contact.number}</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
