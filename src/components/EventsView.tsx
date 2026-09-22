/**
 * CampusPilot Campus Events View
 * Event discovery, categorization, live status tracking, registration,
 * and direct 3D venue routing.
 */

import React, { useState } from 'react';
import { useCampus } from '../context/CampusContext';
import { CAMPUS_EVENTS, CAMPUS_BUILDINGS } from '../data/campusData';
import { CampusEvent } from '../types';
import {
  Search,
  Clock,
  MapPin,
  Users,
  Compass,
  Check,
  Plus,
  X,
} from 'lucide-react';

export const EventsView: React.FC = () => {
  const { setSelectedEvent, setSelectedBuilding, setActiveScreen } = useCampus();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eventsList, setEventsList] = useState<CampusEvent[]>(CAMPUS_EVENTS);
  const [selectedEventModal, setSelectedEventModal] = useState<CampusEvent | null>(null);

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
    <div className="relative w-full h-full flex flex-col bg-surface overflow-y-auto pb-24 select-none">
      {/* Search & Header Bar */}
      <div className="p-space-md bg-surface-container-low border-b border-surface-container sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search campus events, workshops, hackathons..."
              className="w-full h-11 pl-11 pr-4 rounded-xl bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40 border border-surface-container shadow-xs"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-lowest text-on-surface-variant hover:text-on-surface border border-surface-container'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events List Grid */}
      <div className="p-space-md max-w-4xl mx-auto w-full space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-headline-sm text-xs font-bold text-on-surface-variant uppercase tracking-wider">
            {filteredEvents.length} Campus Events Found
          </span>
          <span className="text-xs font-code-telemetry text-secondary">
            Syncs with Student Schedule
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              className="p-5 rounded-2xl bg-surface-container-lowest border border-surface-container shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container/30 text-secondary">
                    {ev.category}
                  </span>
                  {ev.isLiveNow && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-error-container text-error animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                      Live Now
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => setSelectedEventModal(ev)}
                  className="font-headline-sm text-base sm:text-lg font-bold text-on-surface hover:text-primary cursor-pointer line-clamp-1 mb-1"
                >
                  {ev.title}
                </h3>
                <p className="font-body-md text-xs sm:text-sm text-on-surface-variant line-clamp-2 mb-3 leading-relaxed">
                  {ev.description}
                </p>

                {/* Venue & Time Info */}
                <div className="space-y-1.5 mb-4 text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>
                      {ev.date} • {ev.timeText}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                    <span className="truncate">
                      {ev.venue} ({ev.room})
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-tertiary flex-shrink-0" />
                    <span>
                      {ev.attendeesCount} Registered • Organized by {ev.organizer}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {ev.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 rounded-md bg-surface-container text-[11px] text-on-surface-variant font-code-telemetry"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-surface-container">
                <button
                  onClick={() => handleNavigateToEvent(ev)}
                  className="flex-1 py-2 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-transform cursor-pointer"
                >
                  <Compass className="w-4 h-4" />
                  <span>Navigate</span>
                </button>

                <button
                  onClick={() => handleRegisterToggle(ev.id)}
                  className={`py-2 px-3.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
                    ev.isRegistered
                      ? 'bg-tertiary-container/20 border-tertiary text-tertiary'
                      : 'border-surface-container bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  {ev.isRegistered ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                  <span>{ev.isRegistered ? 'Registered' : 'Register'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEventModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-surface-container animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary-container/30 text-secondary">
                  {selectedEventModal.category}
                </span>
                <h3 className="font-headline-sm text-lg font-bold text-on-surface mt-1">
                  {selectedEventModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEventModal(null)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="font-body-md text-sm text-on-surface-variant mb-4 leading-relaxed">
              {selectedEventModal.description}
            </p>

            <div className="p-3.5 rounded-xl bg-surface-container-low space-y-2 mb-5 text-xs text-on-surface">
              <p>
                <strong>Date & Time:</strong> {selectedEventModal.date} ({selectedEventModal.timeText})
              </p>
              <p>
                <strong>Venue:</strong> {selectedEventModal.venue}
              </p>
              <p>
                <strong>Room:</strong> {selectedEventModal.room}
              </p>
              <p>
                <strong>Organizer:</strong> {selectedEventModal.organizer}
              </p>
              <p>
                <strong>Attendees:</strong> {selectedEventModal.attendeesCount} participants
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  handleNavigateToEvent(selectedEventModal);
                  setSelectedEventModal(null);
                }}
                className="flex-1 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                <span>Open in 3D Map</span>
              </button>
              <button
                onClick={() => handleRegisterToggle(selectedEventModal.id)}
                className="px-4 py-2.5 rounded-xl border border-surface-container font-bold text-xs text-on-surface hover:bg-surface-container cursor-pointer"
              >
                {selectedEventModal.isRegistered ? 'Cancel Registration' : 'Confirm Registration'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
