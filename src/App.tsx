/**
 * CampusPilot – AI-Powered Intelligent Campus Assistance System
 * Main Application Shell and Screen Router
 */

import React, { useState } from 'react';
import { CampusProvider, useCampus } from './context/CampusContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SidebarNav } from './components/SidebarNav';
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

const MainContent: React.FC = () => {
  const { activeScreen, notifications } = useCampus();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-surface text-on-surface antialiased">
      {/* Top Universal App Header */}
      <Header
        onOpenNotifications={() => setIsNotifOpen(true)}
        unreadCount={unreadCount}
      />

      {/* Main Body: Desktop Sidebar + Screen Content Area */}
      <div className="flex-1 w-full pt-16 flex overflow-hidden">
        {/* Desktop Sidebar Navigation */}
        <SidebarNav />

        {/* Dynamic Screen View Container */}
        <main className="flex-1 h-full w-full overflow-hidden relative">
          {activeScreen === 'home' && <HomeDashboardView />}
          {activeScreen === 'assistant' && <AIAssistView />}
          {(activeScreen === 'map' || activeScreen === 'navigation') && <Map3DView />}
          {activeScreen === 'events' && <EventsView />}
          {activeScreen === 'facilities' && <FacilitiesView />}
          {activeScreen === 'emergency' && <EmergencyView />}
          {activeScreen === 'analytics' && <AnalyticsView />}
          {activeScreen === 'profile' && <ProfileView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Dock */}
      <BottomNav />

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
