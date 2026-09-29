/**
 * Marwadi University Summits & Events Discovery View
 * Event schedules, registration, categorization, and direct 3D venue routing.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_EVENTS, CAMPUS_BUILDINGS } from '../data/campusData';
import { CampusEvent } from '../types';
import { Search, Clock, MapPin, Users, Compass, Check } from 'lucide-react';

export const EventsView: React.FC = () => {
  const { setSelectedEvent, setSelectedBuilding, setActiveScreen } = useCampus();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eventsList, setEventsList] = useState<CampusEvent[]>(CAMPUS_EVENTS);

  const categories = [
    'All',
    'Workshops',
    'Seminars',
    'Hackathons',
    'Competitions',
    'Technical',
    'Cultural',
    'Sports',
  ];

  const filteredEvents = eventsList.filter((ev) => {
    const matchesCat = activeCategory === 'All' || ev.category === activeCategory;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleRegisterToggle = (eventId: string) => {
    setEventsList((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextRegistered = !ev.isRegistered;
          return {
            ...ev,
            isRegistered: nextRegistered,
            attendeesCount: nextRegistered ? ev.attendeesCount + 1 : ev.attendeesCount - 1,
          };
        }
        return ev;
      })
    );
  };

  const handleNavigateToEvent = (ev: CampusEvent) => {
    setSelectedEvent(ev);
    const bldg = CAMPUS_BUILDINGS.find((b) => b.id === ev.buildingId);
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
              Campus Summits & Events
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Explore academic symposiums, hackathons, and guest lectures at Marwadi University.
            </p>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search summits, hackathons, robotics, tech talks..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#0e1320] border border-white/[0.08] text-slate-100 placeholder:text-slate-500 text-xs sm:text-sm focus:outline-hidden focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-white/10 text-white font-semibold'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] text-slate-400 hover:text-white border border-white/[0.05]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Directory Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-b border-white/[0.06] pb-2">
          <span>{filteredEvents.length} events scheduled</span>
          <span>Venues linked to 3D Navigation</span>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-4 rounded-xl bg-[#0e1320] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between space-y-3.5 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="text-xs text-slate-500">
                      <span>{ev.category}</span>
                      <span className="mx-1.5">·</span>
                      <span>By {ev.organizer}</span>
                      {ev.isLiveNow && (
                        <>
                          <span className="mx-1.5">·</span>
                          <span className="text-emerald-400 font-medium">
                            Live Now
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold text-white group-hover:text-sky-300 transition-colors">
                      {ev.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {ev.description}
                </p>

                <div className="text-xs text-slate-400 space-y-1 pt-0.5">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ev.date} · {ev.timeText}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{ev.venue} ({ev.room})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span className="tabular-nums text-slate-300">{ev.attendeesCount} scholars registered</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between gap-2">
                <button
                  onClick={() => handleRegisterToggle(ev.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                    ev.isRegistered
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/[0.05] hover:bg-white/[0.1] text-slate-300'
                  }`}
                >
                  {ev.isRegistered ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : null}
                  <span>{ev.isRegistered ? 'Registered' : 'Register Slot'}</span>
                </button>

                <button
                  onClick={() => handleNavigateToEvent(ev)}
                  className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5" />
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
