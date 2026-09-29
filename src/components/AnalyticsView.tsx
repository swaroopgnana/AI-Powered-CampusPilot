/**
 * Campus Pulse Analytics Dashboard
 * Visualizes Marwadi University crowd density, hourly campus traffic,
 * popular destination distribution, and sensor network telemetry.
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { Activity, Users, Volume2, Wifi } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { telemetry } = useCampus();

  const hourlyTraffic = [
    { hour: '8 AM', density: 32 },
    { hour: '10 AM', density: 72 },
    { hour: '12 PM', density: 92 },
    { hour: '2 PM', density: 78 },
    { hour: '4 PM', density: 85 },
    { hour: '6 PM', density: 50 },
    { hour: '8 PM', density: 28 },
  ];

  const popularDestinations = [
    { name: 'MU Central Knowledge Resource Center (Library)', share: 36, color: 'bg-sky-500' },
    { name: 'Faculty of Engineering (FOE Block Labs)', share: 28, color: 'bg-indigo-500' },
    { name: 'Student Food Court & Amul Hub', share: 20, color: 'bg-emerald-500' },
    { name: 'Marwadi Sports Complex & Arena', share: 10, color: 'bg-amber-500' },
    { name: 'Main Admin Building & Central Atrium', share: 6, color: 'bg-slate-500' },
  ];

  return (
    <div className="relative w-full h-full overflow-y-auto pb-28 select-none bg-[#090d15] text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Campus Telemetry & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Aggregated sensor telemetry from quad sensors, library acoustic meters, and mesh access points.
          </p>
        </div>

        {/* Telemetry Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Active Scholars</span>
              <Users className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-semibold text-white tabular-nums mt-1">
              {telemetry.activeUsers.toLocaleString()}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Quad Crowd Density</span>
              <Activity className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-semibold text-sky-400 tabular-nums mt-1">
              {telemetry.crowdDensityPercent}%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Library Open Desks</span>
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-semibold text-emerald-400 tabular-nums mt-1">
              {telemetry.openDesksInLibrary}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {telemetry.libraryNoiseDb} dB (Acoustic quiet)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06]">
            <div className="text-xs text-slate-500 flex items-center justify-between">
              <span>Mesh Network Latency</span>
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="text-xl font-semibold text-white tabular-nums mt-1">
              {telemetry.meshLatencyMs} ms
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              100% Nodes Healthy
            </div>
          </div>
        </div>

        {/* Hourly Traffic Chart */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Hourly Pedestrian Traffic & Quad Density
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Aggregated along University Spine Boulevard & Central Amphitheater
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Peak: 12:00 PM – 1:30 PM
            </div>
          </div>

          <div className="flex items-end justify-between h-40 pt-4 gap-2 sm:gap-4">
            {hourlyTraffic.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {item.density}%
                </span>
                <div className="w-full max-w-[36px] bg-white/[0.04] rounded-t overflow-hidden h-28 flex items-end">
                  <div
                    className="w-full bg-sky-500 hover:bg-sky-400 transition-colors rounded-t"
                    style={{ height: `${item.density}%` }}
                  ></div>
                </div>
                <span className="text-[11px] text-slate-400 whitespace-nowrap">
                  {item.hour}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Destinations Breakdown */}
        <div className="p-5 rounded-2xl bg-[#0e1320] border border-white/[0.08] space-y-3.5">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Campus Destination Distribution
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live distribution of navigational waypoints and foot traffic
            </p>
          </div>

          <div className="space-y-3">
            {popularDestinations.map((dest) => (
              <div key={dest.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{dest.name}</span>
                  <span className="font-mono text-slate-400 tabular-nums">{dest.share}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div className={`h-full ${dest.color} rounded-full`} style={{ width: `${dest.share}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
