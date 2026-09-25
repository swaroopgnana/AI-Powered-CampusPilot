/**
 * CampusPilot Campus Analytics Dashboard
 * Visualizes Marwadi University crowd density, hourly campus traffic,
 * popular destination distribution, incident resolution logs, and event attendance telemetry.
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';

export const AnalyticsView: React.FC = () => {
  const { telemetry, isEmergencyActive } = useCampus();

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
    { name: 'MU Central Knowledge Resource Center', share: 36, color: 'bg-primary' },
    { name: 'Faculty of Engineering (FOE Block)', share: 28, color: 'bg-secondary' },
    { name: 'University Food Court & Amul Hub', share: 20, color: 'bg-tertiary' },
    { name: 'Marwadi Sports Complex & Indoor Arena', share: 10, color: 'bg-amber-600' },
    { name: 'Main Admin Building & Auditorium', share: 6, color: 'bg-slate-500' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-20 select-none">
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-4">
        {/* Header telemetry cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Active Scholars On Campus
            </span>
            <span className="font-headline-sm text-2xl font-bold text-on-surface">
              {telemetry.activeUsers.toLocaleString()}
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">↑ 14% vs last week</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Average Quad Density
            </span>
            <span className="font-headline-sm text-2xl font-bold text-secondary">
              {telemetry.crowdDensityPercent}%
            </span>
            <span className="text-xs text-secondary font-semibold mt-1 block">Smooth Movement</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Central Library Vacancy
            </span>
            <span className="font-headline-sm text-2xl font-bold text-tertiary">
              {telemetry.openDesksInLibrary} Desks
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">
              {telemetry.libraryNoiseDb} dB (Acoustic Optimal)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Spatial Ping Latency
            </span>
            <span className="font-headline-sm text-2xl font-bold text-on-surface">
              {telemetry.meshLatencyMs} ms
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">100% CCTV Nodes Active</span>
          </div>
        </div>

        {/* Hourly Traffic Bar Chart */}
        <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Hourly Pedestrian Traffic & Quad Density (Marwadi University)
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Live sensor aggregation from University Spine Boulevard & Central Quad
              </p>
            </div>
            <span className="font-code-telemetry text-xs text-secondary font-bold">
              Peak: 12:30 PM – 1:30 PM
            </span>
          </div>

          <div className="flex items-end justify-between h-44 pt-6 gap-2">
            {hourlyTraffic.map((item) => (
              <div key={item.hour} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-code-telemetry text-on-surface-variant">
                  {item.density}%
                </span>
                <div
                  className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                    item.density > 75
                      ? 'bg-primary'
                      : item.density > 50
                      ? 'bg-secondary'
                      : 'bg-secondary-container'
                  }`}
                  style={{ height: `${item.density}%` }}
                ></div>
                <span className="text-xs font-code-telemetry text-on-surface font-medium">
                  {item.hour}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Destination Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3">
              Popular Marwadi University Destinations
            </h3>

            <div className="space-y-3">
              {popularDestinations.map((dest) => (
                <div key={dest.name}>
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className="text-on-surface truncate">{dest.name}</span>
                    <span className="font-code-telemetry text-on-surface-variant font-bold ml-2">
                      {dest.share}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden">
                    <div className={`h-full ${dest.color} rounded-full`} style={{ width: `${dest.share}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Incident Response Health */}
          <div className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <h3 className="font-headline-sm text-base font-bold text-on-surface mb-3">
              Safety & Sensor Network Status
            </h3>

            <div className="space-y-3 text-body-sm text-on-surface-variant">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span>Active Safety Mesh Nodes</span>
                <span className="font-bold text-tertiary">38 / 38 Online</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span>CCTV Optical Flow Coverage</span>
                <span className="font-bold text-on-surface">96.4% Campus Corridors</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span>Highway Gate 1 Access Status</span>
                <span className="font-bold text-tertiary">Clear • Rapid Evacuation Path Ready</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span>Active Safety Status</span>
                <span className={`font-bold ${isEmergencyActive ? 'text-error' : 'text-tertiary'}`}>
                  {isEmergencyActive ? 'Code Orange Alert (FOE Block)' : 'Normal Operations (Green)'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
