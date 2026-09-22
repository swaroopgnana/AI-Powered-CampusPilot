/**
 * CampusPilot Campus Facilities Directory View
 * Searchable catalog of campus resources, study zones, labs, cafes,
 * and accessibility services with distance calculation and instant navigation.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_FACILITIES, CAMPUS_BUILDINGS } from '../data/campusData';
import { Facility } from '../types';
import { Search, Accessibility, Navigation } from 'lucide-react';

export const FacilitiesView: React.FC = () => {
  const { setSelectedBuilding, setSelectedFacility, setActiveScreen } = useCampus();

  const [activeType, setActiveType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const facilityTypes = [
    'All',
    'Library',
    'Laboratory',
    'Classroom',
    'Cafeteria',
    'Medical Center',
    'ATM',
    'Sports',
    'Administration',
  ];

  const filteredFacilities = CAMPUS_FACILITIES.filter((f) => {
    const matchesType = activeType === 'All' || f.type === activeType;
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.buildingName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.room && f.room.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const handleNavigateToFacility = (fac: Facility) => {
    setSelectedFacility(fac);
    const bldg = CAMPUS_BUILDINGS.find((b) => b.id === fac.buildingId);
    if (bldg) {
      setSelectedBuilding(bldg);
    }
    setActiveScreen('map');
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-24 select-none">
      {/* Header and Search */}
      <div className="p-space-md bg-surface-container-low border-b border-surface-container sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search facilities, quiet pods, labs, cafeteria, ATMs..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 border border-surface-container shadow-xs"
            />
          </div>

          {/* Type Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {facilityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeType === type
                    ? 'bg-secondary text-on-secondary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Facilities Directory List */}
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            {filteredFacilities.length} Facilities Available
          </span>
          <span className="text-xs font-code-telemetry text-tertiary">
            Live Occupancy Telemetry
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-4 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-surface-container text-secondary">
                    {fac.type}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {fac.accessibility && (
                      <span title="Step-Free Ramp Access">
                        <Accessibility className="w-4 h-4 text-emerald-600" />
                      </span>
                    )}
                    <span className="font-code-telemetry text-xs font-bold text-on-surface">
                      {fac.distanceMeters}m away
                    </span>
                  </div>
                </div>

                <h3 className="font-headline-sm text-base font-bold text-on-surface mb-0.5">
                  {fac.name}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant mb-2">
                  {fac.buildingName} • {fac.floor} {fac.room ? `(${fac.room})` : ''}
                </p>

                {/* Additional metrics */}
                <div className="p-2.5 rounded-xl bg-surface-container-low text-xs text-on-surface-variant space-y-1 mb-3">
                  <div className="flex items-center justify-between">
                    <span>Hours: {fac.openingHours}</span>
                    <span className="text-tertiary font-bold">
                      {fac.isOpen ? 'Open Now' : 'Closed'}
                    </span>
                  </div>
                  {fac.currentCapacity && (
                    <div className="flex items-center justify-between font-code-telemetry">
                      <span>Status:</span>
                      <span className="text-secondary font-semibold">{fac.currentCapacity}</span>
                    </div>
                  )}
                  {fac.quietScore && (
                    <div className="flex items-center justify-between font-code-telemetry">
                      <span>Quiet Score:</span>
                      <span className="text-tertiary font-bold">{fac.quietScore}/100</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleNavigateToFacility(fac)}
                className="w-full py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/95 text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (3D Path)</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
