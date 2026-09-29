/**
 * CampusPilot – Marwadi University 3D Digital Twin System
 * Clean, Unified Frontend Architecture
 */

import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeDashboardView } from './components/HomeDashboardView';
import { AIAssistView } from './components/AIAssistView';
import { Map3DView } from './components/Map3DView';
import { EventsView } from './components/EventsView';
import { FacilitiesView } from './components/FacilitiesView';
import { EmergencyView } from './components/EmergencyView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProfileView } from './components/ProfileView';
import { VisionModal } from './components/VisionModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { SpotlightModal } from './components/SpotlightModal';

const MainContent: React.FC = () => {
  const { activeScreen, notifications } = useCampus();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-[#090d15] text-slate-100 antialiased selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Universal Clean Header */}
      <Header
        onOpenNotifications={() => setIsNotifOpen(true)}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main View Area: Full Width Desktop Experience */}
      <div className="flex-1 w-full pt-14 flex overflow-hidden">
        <main className="flex-1 h-full w-full overflow-hidden relative">
          {activeScreen === 'home' && <HomeDashboardView onOpenSpotlight={() => setIsSpotlightOpen(true)} />}
          {activeScreen === 'assistant' && <AIAssistView />}
          {(activeScreen === 'map' || activeScreen === 'navigation') && <Map3DView />}
          {activeScreen === 'events' && <EventsView />}
          {activeScreen === 'facilities' && <FacilitiesView />}
          {activeScreen === 'emergency' && <EmergencyView />}
          {activeScreen === 'analytics' && <AnalyticsView />}
          {activeScreen === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Dock (hidden on large displays) */}
      <BottomNav />

      {/* Global Quick Search (⌘K) Spotlight */}
      <SpotlightModal
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
      />

      {/* Computer Vision Scanner Modal */}
      <VisionModal />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <CampusProvider>
      <MainContent />
    </CampusProvider>
  );
}
