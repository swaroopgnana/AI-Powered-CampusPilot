/**
 * Campus Facilities & Labs Directory View
 * Searchable catalog of campus resources, study zones, labs, cafes,
 * and accessibility services with distance calculation and instant navigation.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_FACILITIES, CAMPUS_BUILDINGS } from '../data/campusData';
import { Facility } from '../types';
import { Search, Accessibility, Navigation, Clock, MapPin, Volume2 } from 'lucide-react';

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
    <div className="relative w-full h-full overflow-y-auto pb-28 select-none bg-[#090d15] text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Header & Search */}
        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Campus Facilities Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Search Marwadi University academic labs, libraries, study pods, dining spots, and athletics.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search labs, quiet study carrels, cafeteria, medical clinic..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0e1320] border border-white/[0.08] text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {facilityTypes.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeType === type
                    ? 'bg-white/10 text-white font-semibold'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.05]'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-white/[0.06] pb-2">
          <span>{filteredFacilities.length} locations</span>
          <span>Updated in real time</span>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-slate-500">
                      <span>{fac.type}</span>
                      <span className="mx-1.5">·</span>
                      <span className={fac.isOpen ? 'text-emerald-400' : 'text-slate-500'}>
                        {fac.isOpen ? 'Open Now' : 'Closed'}
                      </span>
                      <span className="mx-1.5">·</span>
                      <span>{fac.distanceMeters} m</span>
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors mt-0.5">
                      {fac.name}
                    </h3>
                  </div>

                  {fac.accessibility && (
                    <div className="p-1 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 shrink-0" title="Step-Free Entrance">
                      <Accessibility className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{fac.buildingName} · {fac.floor} {fac.room ? `· ${fac.room}` : ''}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Hours: {fac.openingHours}</span>
                  </div>
                </div>

                {/* Acoustic score if available */}
                {fac.quietScore !== undefined && (
                  <div className="pt-0.5">
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-slate-400" />
                        <span>Acoustic Quiet Score</span>
                      </span>
                      <span className="font-mono text-slate-300 tabular-nums">
                        {fac.quietScore}/100
                      </span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-sky-500 rounded-full"
                        style={{ width: `${fac.quietScore}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {fac.currentCapacity ? `Capacity: ${fac.currentCapacity}` : 'Open Access'}
                </span>

                <button
                  onClick={() => handleNavigateToFacility(fac)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-slate-950 font-semibold text-xs flex items-center gap-1.5 border border-sky-500/25 hover:border-transparent transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Navigate in 3D</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
