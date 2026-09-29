/**
 * Spotlight Search & Quick Command Palette (Cmd+K)
 * Clean, instant search across Marwadi University buildings, labs, facilities, and events.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_BUILDINGS, CAMPUS_FACILITIES, CAMPUS_EVENTS } from '../data/campusData';
import { Search, Calendar, Building2, MapPin, X, ArrowRight } from 'lucide-react';

interface SpotlightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpotlightModal: React.FC<SpotlightModalProps> = ({ isOpen, onClose }) => {
  const { setSelectedBuilding, setSelectedFacility, setSelectedEvent, setActiveScreen } = useCampus();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedBuildings = CAMPUS_BUILDINGS.filter(
    (b) =>
      b.name.toLowerCase().includes(cleanQuery) ||
      b.code.toLowerCase().includes(cleanQuery) ||
      b.description.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  const matchedFacilities = CAMPUS_FACILITIES.filter(
    (f) =>
      f.name.toLowerCase().includes(cleanQuery) ||
      f.buildingName.toLowerCase().includes(cleanQuery) ||
      f.type.toLowerCase().includes(cleanQuery)
  ).slice(0, 4);

  const matchedEvents = CAMPUS_EVENTS.filter(
    (e) =>
      e.title.toLowerCase().includes(cleanQuery) ||
      e.venue.toLowerCase().includes(cleanQuery) ||
      e.tags.some((t) => t.toLowerCase().includes(cleanQuery))
  ).slice(0, 3);

  const handleSelectBuilding = (b: (typeof CAMPUS_BUILDINGS)[0]) => {
    setSelectedBuilding(b);
    setActiveScreen('map');
    onClose();
  };

  const handleSelectFacility = (f: (typeof CAMPUS_FACILITIES)[0]) => {
    setSelectedFacility(f);
    const b = CAMPUS_BUILDINGS.find((bldg) => bldg.id === f.buildingId);
    if (b) setSelectedBuilding(b);
    setActiveScreen('map');
    onClose();
  };

  const handleSelectEvent = (ev: (typeof CAMPUS_EVENTS)[0]) => {
    setSelectedEvent(ev);
    const b = CAMPUS_BUILDINGS.find((bldg) => bldg.id === ev.buildingId);
    if (b) setSelectedBuilding(b);
    setActiveScreen('map');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-20 px-4 animate-in fade-in duration-100">
      <div className="bg-[#0e1320] border border-white/[0.1] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-white/[0.06] gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search campus buildings, labs, venues, events..."
            className="w-full bg-transparent text-slate-100 placeholder:text-slate-500 text-sm focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white/[0.04] rounded border border-white/[0.08]">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 space-y-3 text-xs">
          {/* Buildings Section */}
          {matchedBuildings.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Landmarks & Buildings
              </div>
              <div className="mt-0.5 space-y-0.5">
                {matchedBuildings.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handleSelectBuilding(b)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-slate-300 shrink-0">
                        <Building2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-200 group-hover:text-white truncate">
                          {b.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {b.code} · {b.category} · {b.floors} Floors
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-sky-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Navigate</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Section */}
          {matchedFacilities.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Facilities & Labs
              </div>
              <div className="mt-0.5 space-y-0.5">
                {matchedFacilities.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelectFacility(f)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-slate-300 shrink-0">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-200 group-hover:text-white truncate">
                          {f.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {f.buildingName} · {f.floor} {f.room ? `· ${f.room}` : ''}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-sky-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Events Section */}
          {matchedEvents.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Events & Summits
              </div>
              <div className="mt-0.5 space-y-0.5">
                {matchedEvents.map((ev) => (
                  <button
                    key={ev.id}
                    onClick={() => handleSelectEvent(ev)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-white/[0.04] text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-md bg-white/[0.04] flex items-center justify-center text-slate-300 shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-slate-200 group-hover:text-white truncate">
                          {ev.title}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {ev.timeText} · {ev.venue}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-sky-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Show 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchedBuildings.length === 0 &&
            matchedFacilities.length === 0 &&
            matchedEvents.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-xs">
                No matching locations or events found for "{query}".
              </div>
            )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-3.5 py-2 bg-black/20 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
          <span>Click an item to view in 3D Map</span>
          <span>ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
