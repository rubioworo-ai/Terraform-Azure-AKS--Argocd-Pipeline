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

    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-sm px-4">
      <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-xl border border-slate-800 flex items-start space-x-3.5 relative overflow-hidden">
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-orange-500" />

        <div className="w-9 h-9 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
          <Bell size={18} />
        </div>

        <div className="flex-grow pr-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-400 mb-0.5">QuickBite Alert</div>
          <p className="text-sm text-slate-100 font-light leading-snug">
            {notification.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer focus:outline-none shrink-0"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
