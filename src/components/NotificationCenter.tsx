import React, { useState } from 'react';
import { 
  X, Bell, Check, Trash2, Volume2, VolumeX, Smartphone, 
  ExternalLink, Sparkles, Navigation 
} from 'lucide-react';
import { AppNotification } from '../types/foodDelivery';
import { soundManager } from '../utils/soundEffects';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotificationOrder: (orderId?: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotificationOrder,
}) => {
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default'
  );
  const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

  if (!isOpen) return null;

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission();
        setBrowserPermission(res);
        if (res === 'granted') {
          new Notification('SavorLocal Push Activated 🎉', {
            body: 'You will receive real-time order updates, courier telemetry, and exclusive local chef perks!',
            icon: '/favicon.ico'
          });
          soundManager.playSuccess();
        }
      } catch {
        // Ignore
      }
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
    if (next) soundManager.playNotification();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end animate-in fade-in duration-150">
      <div 
        className="w-full max-w-sm bg-[#0e1015] border-l border-zinc-800 h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-sm font-bold text-white">Notifications</h3>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleToggleSound}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
              title={soundEnabled ? 'Mute chimes' : 'Enable audio chimes'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-zinc-500" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Push Permission Request Banner */}
        <div className="p-3.5 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-white">System Push Notifications</p>
              <p className="text-[11px] text-zinc-400">
                {browserPermission === 'granted' ? 'Native Push Enabled' : 'Get background alerts'}
              </p>
            </div>
          </div>

          {browserPermission !== 'granted' && (
            <button
              onClick={handleRequestPushPermission}
              className="px-2.5 py-1 rounded-md bg-amber-500 hover:bg-amber-400 text-black font-semibold text-[11px] transition-colors cursor-pointer"
            >
              Enable
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <Bell className="w-10 h-10 text-zinc-700 mb-2" />
              <p className="text-xs font-semibold text-zinc-300">All caught up</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Order updates and reward milestones will show here.</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  if (item.orderId) {
                    onSelectNotificationOrder(item.orderId);
                    onClose();
                  }
                }}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  item.read
                    ? 'bg-zinc-950/60 border-zinc-850 text-zinc-400'
                    : 'bg-zinc-900/90 border-amber-500/40 text-zinc-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    <span>{item.title}</span>
                  </h4>
                  <span className="text-[10px] text-zinc-500 whitespace-nowrap">{item.timestamp}</span>
                </div>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
                  {item.message}
                </p>
                {item.orderId && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                    <Navigation className="w-3 h-3" />
                    <span>View Live Tracker</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-zinc-800 bg-[#090a0d] flex items-center justify-between text-xs text-zinc-400">
            <button
              onClick={onMarkAllAsRead}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="hover:text-red-400 transition-colors cursor-pointer flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
