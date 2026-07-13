import React, { useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Notification } from "../types";

interface NotificationToastProps {
  notification: Notification | null;
  onClose: () => void;
}

export default function NotificationToast({ notification, onClose }: NotificationToastProps) {
  useEffect(() => {
    if (!notification) return;

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-sm px-4 animate-slide-in">
      <div className="bg-gray-950 text-white rounded-lg p-3 shadow-lg border border-gray-800 flex items-start space-x-3 relative overflow-hidden">
        {/* Highlight bar */}
        <div className="absolute top-0 left-0 bottom-0 w-1 bg-orange-600" />

        {/* Alarm/Bell Icon */}
        <div className="w-8 h-8 rounded-lg bg-orange-600/10 text-orange-400 flex items-center justify-center shrink-0">
          <Bell size={14} className="animate-swing" />
        </div>

        {/* Text Area */}
        <div className="flex-grow pr-4 py-0.5">
          <div className="text-[9px] font-bold uppercase tracking-widest text-orange-500 mb-0.5">QuickBite Alert</div>
          <p className="text-xs text-gray-100 font-semibold leading-tight">
            {notification.message}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-1 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer focus:outline-none shrink-0"
          id="btn-close-notification"
        >
          <X size={12} />
        </button>

        {/* Dynamic progress bar animation */}
        <div className="absolute bottom-0 left-1 right-0 h-0.5 bg-gray-900">
          <div className="h-full bg-orange-600 animate-shrink-width" />
        </div>
      </div>
    </div>
  );
}
