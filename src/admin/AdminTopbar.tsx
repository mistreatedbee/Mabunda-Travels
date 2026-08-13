import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Inbox, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Notification } from '../lib/types';

/** Notification bell + dropdown, shared by the desktop and mobile admin topbars. */
export default function AdminTopbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  async function refreshUnreadCount() {
    const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('read', false);
    setUnreadCount(count ?? 0);
  }

  useEffect(() => {
    refreshUnreadCount();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function togglePanel() {
    const next = !open;
    setOpen(next);
    if (next) {
      const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(10);
      setNotifications((data ?? []) as Notification[]);
    }
  }

  async function handleSelect(n: Notification) {
    if (!n.read) {
      await supabase.from('notifications').update({ read: true }).eq('id', n.id);
      setNotifications((prev) => prev?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? null);
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    setOpen(false);
    if (n.resource_type === 'bookings' && n.resource_id) {
      navigate(`/admin/enquiries/${n.resource_id}`);
    }
  }

  async function markAllRead() {
    await supabase.from('notifications').update({ read: true }).eq('read', false);
    setNotifications((prev) => prev?.map((x) => ({ ...x, read: true })) ?? null);
    setUnreadCount(0);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={togglePanel}
        className={`relative p-2 rounded-lg transition-colors ${
          variant === 'dark' ? 'text-white/80 hover:text-white hover:bg-white/10' : 'text-forest-500 hover:text-forest-900 hover:bg-gray-100'
        }`}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'}
        aria-expanded={open}
      >
        <Bell size={19} aria-hidden="true" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-forest-900 text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h2 className="font-display font-semibold text-forest-900 text-sm">Notifications</h2>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs font-medium text-forest-600 hover:text-gold-dark">
                <Check size={12} aria-hidden="true" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications === null ? (
              <p className="text-sm text-forest-400 text-center py-8">Loading...</p>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center px-4">
                <Inbox size={22} className="text-forest-300" aria-hidden="true" />
                <p className="text-sm text-forest-400">No notifications yet</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((n) => (
                  <li key={n.id}>
                    <button
                      onClick={() => handleSelect(n)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-forest-50/50' : ''}`}
                    >
                      <div className="flex items-start gap-2">
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 flex-shrink-0" aria-hidden="true" />}
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-forest-900">{n.title}</p>
                          {n.message && <p className="text-xs text-forest-500 mt-0.5 line-clamp-2">{n.message}</p>}
                          <p className="text-[11px] text-forest-400 mt-1">
                            {new Date(n.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
