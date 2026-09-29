/**
 * CampusPilot Emergency Evacuation & Safety System
 * Calm, clear tactical safety center for Marwadi University.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS } from '../data/campusData';
import {
  AlertCircle,
  Flame,
  Stethoscope,
  Users,
  Ban,
  Droplets,
  ShieldAlert,
  Navigation,
  CheckCircle2,
  Phone,
  ScanLine,
  Check,
} from 'lucide-react';

export const EmergencyView: React.FC = () => {
  const {
    isEmergencyActive,
    triggerEmergency,
    resolveEmergency,
    setActiveScreen,
    setSelectedBuilding,
    setIsNavigating,
    setIsVisionModalOpen,
  } = useCampus();

  const [hasCheckedInSafe, setHasCheckedInSafe] = useState(false);

  const emergencyCategories = [
    { type: 'Fire', label: 'Fire & Smoke', icon: Flame },
    { type: 'Medical Emergency', label: 'Medical Aid', icon: Stethoscope },
    { type: 'Overcrowding', label: 'Crowd Obstruction', icon: Users },
    { type: 'Blocked Road', label: 'Corridor Blocked', icon: Ban },
    { type: 'Flood', label: 'Water Leak', icon: Droplets },
    { type: 'Security Alert', label: 'Security Assist', icon: ShieldAlert },
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
    <div className="relative w-full h-full overflow-y-auto pb-28 select-none bg-[#090d15] text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Status Header */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isEmergencyActive ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.04] text-slate-400'
              }`}
            >
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold text-white">
                  Campus Safety & Rapid Evacuation
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    isEmergencyActive
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}
                >
                  {isEmergencyActive ? 'Protocol Active' : 'Normal Standby'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Direct link to Marwadi University control center and tactical egress routing.
              </p>
            </div>
          </div>

          {isEmergencyActive && (
            <button
              onClick={resolveEmergency}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 text-xs font-medium cursor-pointer transition-colors"
            >
              Clear Active Incident
            </button>
          )}
        </div>

        {/* Primary Safe Assembly Card */}
        <div className="p-6 rounded-2xl bg-[#0e1320] border border-white/[0.08] space-y-3">
          <div className="text-xs text-sky-400 font-medium">
            Muster Point Egress
          </div>
          <h2 className="text-base font-semibold text-white">
            Primary Safe Assembly: Highway Gate 1 Lawn
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
            In any evacuation scenario, pedestrian pathways automatically compute clear passage away from hazardous academic corridors toward Highway Gate 1.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              onClick={handleStartEvacuation}
              className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Route to Safe Muster Zone</span>
            </button>

            <button
              onClick={handleCheckInSafe}
              className="px-3.5 py-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.09] text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {hasCheckedInSafe ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{hasCheckedInSafe ? 'Checked-In As Safe' : 'Mark Myself Safe'}</span>
            </button>

            <button
              onClick={() => setIsVisionModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ScanLine className="w-3.5 h-3.5 text-sky-400" />
              <span>Inspect Obstruction</span>
            </button>
          </div>
        </div>

        {/* Hazard Quick Trigger Grid */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-slate-400">
            Simulate or Report Incident
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
            {emergencyCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.type}
                  onClick={() => triggerEmergency(cat.type)}
                  className="p-3.5 rounded-xl bg-[#0e1320] hover:bg-[#131929] border border-white/[0.06] hover:border-white/[0.12] flex flex-col items-center gap-2 text-center transition-colors cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.08] text-slate-300 group-hover:text-white flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-slate-300 group-hover:text-white">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rapid Response Hotlines */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] space-y-3">
          <div className="text-xs font-medium text-slate-400">
            Marwadi University 24/7 Response Hotlines
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Phone className="w-3 h-3 text-sky-400" />
                <span>Campus Control Desk</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1 tabular-nums">
                +91 281 7123456
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">24/7 Security Dispatch</div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>Hostel Health Clinic</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1 tabular-nums">
                +91 281 7123499
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Paramedic & First Aid</div>
            </div>

            <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                <Phone className="w-3 h-3 text-red-400" />
                <span>National Emergency</span>
              </div>
              <div className="text-sm font-semibold text-white mt-1 tabular-nums">
                112 / 108
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Police & Ambulance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
