/**
 * CampusPilot Campus Analytics Dashboard
 * Visualizes crowd density, hourly campus traffic, popular destination distribution,
 * incident resolution logs, and event attendance telemetry.
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';

export const AnalyticsView: React.FC = () => {
  const { telemetry, isEmergencyActive } = useCampus();

  const hourlyTraffic = [
    { hour: '8 AM', density: 35 },
    { hour: '10 AM', density: 68 },
    { hour: '12 PM', density: 88 },
    { hour: '2 PM', density: 74 },
    { hour: '4 PM', density: 82 },
    { hour: '6 PM', density: 55 },
    { hour: '8 PM', density: 30 },
  ];

  const popularDestinations = [
    { name: 'Central Library', share: 34, color: 'bg-primary' },
    { name: 'Alan Turing Complex', share: 26, color: 'bg-secondary' },
    { name: 'Student Cafeteria', share: 22, color: 'bg-tertiary' },
    { name: 'Sports Complex', share: 12, color: 'bg-amber-600' },
    { name: 'Administration', share: 6, color: 'bg-slate-500' },
  ];

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-20 select-none">
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-4">
        {/* Header telemetry cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Active Campus Users
            </span>
            <span className="font-headline-sm text-2xl font-bold text-on-surface">
              {telemetry.activeUsers.toLocaleString()}
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">↑ 12% vs last week</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Average Crowd Density
            </span>
            <span className="font-headline-sm text-2xl font-bold text-secondary">
              {telemetry.crowdDensityPercent}%
            </span>
            <span className="text-xs text-secondary font-semibold mt-1 block">Normal Flow</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              Library Vacant Desks
            </span>
            <span className="font-headline-sm text-2xl font-bold text-tertiary">
              {telemetry.openDesksInLibrary}
            </span>
            <span className="text-xs text-tertiary font-bold mt-1 block">
              {telemetry.libraryNoiseDb} dB (Acoustic Good)
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs">
            <span className="text-[11px] font-code-telemetry text-on-surface-variant uppercase block">
              System Health & Ping
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
                Hourly Pedestrian Traffic & Quad Density
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Live sensor aggregation from Pine Avenue & Quad B
              </p>
            </div>
            <span className="font-code-telemetry text-xs text-secondary font-bold">
              Peak: 12:00 PM – 1:30 PM
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
              Popular Campus Destinations
            </h3>

            <div className="space-y-3">
              {popularDestinations.map((dest) => (
                <div key={dest.name}>
                  <div className="flex items-center justify-between text-xs font-medium mb-1">
                    <span className="text-on-surface">{dest.name}</span>
                    <span className="font-code-telemetry text-on-surface-variant font-bold">
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
                <span className="font-bold text-on-surface">94.2% Campus Corridors</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span>Corridor 2B Obstruction Status</span>
                <span className={`font-bold ${isEmergencyActive ? 'text-error animate-pulse' : 'text-tertiary'}`}>
                  {isEmergencyActive ? 'Code Orange Bypass Active' : 'Normal Conditions'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low">
                <span>Avg Navigation Time Saved</span>
                <span className="font-bold text-secondary">3.8 mins / trip</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
