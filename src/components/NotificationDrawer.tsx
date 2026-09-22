/**
 * CampusPilot Notifications Drawer Component
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { Bell, X, AlertTriangle, Calendar, Navigation } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead, setActiveScreen } = useCampus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
      <div className="bg-surface-container-lowest w-full max-w-sm h-full shadow-2xl p-space-md flex flex-col justify-between animate-in slide-in-from-right duration-200">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-surface-container mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-headline-sm text-base font-bold text-on-surface">
                Campus Notifications
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-on-surface-variant font-code-telemetry">
              {notifications.filter((n) => n.unread).length} Unread Alerts
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-secondary font-bold hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="space-y-2.5 overflow-y-auto max-h-[75vh]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-colors ${
                  notif.unread
                    ? 'bg-surface-container-low border-primary/30'
                    : 'bg-surface border-surface-container opacity-85'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    {notif.type === 'hazard' ? (
                      <AlertTriangle className="w-4 h-4 text-error flex-shrink-0" />
                    ) : notif.type === 'event' ? (
                      <Calendar className="w-4 h-4 text-secondary flex-shrink-0" />
                    ) : (
                      <Navigation className="w-4 h-4 text-tertiary flex-shrink-0" />
                    )}
                    <h4 className="font-headline-sm text-xs font-bold text-on-surface">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="font-code-telemetry text-[10px] text-on-surface-variant flex-shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="font-body-sm text-xs text-on-surface-variant pl-6">
                  {notif.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onClose();
            setActiveScreen('home');
          }}
          className="w-full py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs cursor-pointer transition-colors"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
};
