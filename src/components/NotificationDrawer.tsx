/**
 * CampusPilot Notifications Drawer Component
 * High-clarity slide-over drawer with zero noise.
 */

import React from 'react';
import { useCampus } from '../context/CampusContext';
import { Bell, X, AlertCircle, Calendar, Navigation } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useCampus();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="bg-[#0e1320] border-l border-white/[0.08] w-full max-w-sm h-full shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-150">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-semibold text-white">
                Notifications
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="text-slate-500">
              {notifications.filter((n) => n.unread).length} Unread
            </span>
            <button
              onClick={markAllNotificationsRead}
              className="text-sky-400 hover:underline cursor-pointer"
            >
              Mark all read
            </button>
          </div>

          {/* List */}
          <div className="space-y-2 overflow-y-auto max-h-[75vh]">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3 rounded-xl border transition-colors ${
                  notif.unread
                    ? 'bg-black/40 border-sky-500/25'
                    : 'bg-black/20 border-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    {notif.type === 'hazard' ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : notif.type === 'event' ? (
                      <Calendar className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <h4 className="text-xs font-semibold text-white">
                      {notif.title}
                    </h4>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">
                    {notif.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-400 pl-5.5 leading-relaxed">
                  {notif.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-medium cursor-pointer transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};
