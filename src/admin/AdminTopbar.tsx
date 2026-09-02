import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Inbox, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Notification } from '../lib/types';

const RECENT_LIMIT = 15;

/** Notification bell + dropdown, shared by the desktop and mobile admin topbars. Read state is per-admin. */
export default function AdminTopbar({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[] | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  async function load() {
    if (!admin) return;
    const { data: recent } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(RECENT_LIMIT);

    const ids = (recent ?? []).map((n) => n.id);
    const { data: reads } = ids.length
      ? await supabase.from('notification_reads').select('notification_id').eq('admin_id', admin.id).in('notification_id', ids)
      : { data: [] };

    const readIds = new Set((reads ?? []).map((r) => r.notification_id));
    setNotifications((recent ?? []).map((n) => ({ ...n, read: readIds.has(n.id) })));
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [admin?.id]);

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
    if (next) load();
  }

  async function handleSelect(n: Notification) {
    if (!n.read && admin) {
      await supabase.from('notification_reads').insert({ notification_id: n.id, admin_id: admin.id });
      setNotifications((prev) => prev?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? null);
    }
    setOpen(false);
    if (n.resource_type === 'bookings' && n.resource_id) {
      navigate(`/admin/enquiries/${n.resource_id}`);
    }
  }

  async function markAllRead() {
    if (!admin || !notifications) return;
    const unreadIds = notifications.filter((n) => !n.read).map((n) => n.id);
    if (!unreadIds.length) return;
    await supabase.from('notification_reads').insert(unreadIds.map((id) => ({ notification_id: id, admin_id: admin.id })));
    setNotifications((prev) => prev?.map((x) => ({ ...x, read: true })) ?? null);
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
