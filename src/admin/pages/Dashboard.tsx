import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Car, MapPinned, HelpCircle, MessageSquareQuote, ArrowRight, Clock, Inbox } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthContext';
import AdminPageHeader from '../components/AdminPageHeader';
import { LoadingState, ErrorState } from '../components/States';
import StatusBadge from '../components/StatusBadge';
import EnquiryStatusBadge from '../components/EnquiryStatusBadge';
import type { ContentStatus, Enquiry } from '../../lib/types';

interface ModuleStats {
  key: string;
  label: string;
  icon: typeof Compass;
  href: string;
  published: number;
  draft: number;
  total: number;
}

interface ActivityRow {
  table: string;
  label: string;
  href: string;
  updated_at: string;
  status?: ContentStatus;
}

interface EnquiryStats {
  total: number;
  new: number;
  pending: number; // contacted + quoted
  confirmed: number;
  completed: number;
}

const MODULES = [
  { key: 'tours', label: 'Tours', icon: Compass, href: '/admin/tours', nameColumn: 'name', hasStatus: true },
  { key: 'transfers', label: 'Transfers', icon: Car, href: '/admin/transfers', nameColumn: 'name', hasStatus: true },
  { key: 'destinations', label: 'Destinations', icon: MapPinned, href: '/admin/destinations', nameColumn: 'name', hasStatus: true },
  { key: 'faqs', label: 'FAQs', icon: HelpCircle, href: '/admin/faqs', nameColumn: 'question', hasStatus: false },
  { key: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, href: '/admin/testimonials', nameColumn: 'customer_name', hasStatus: false },
] as const;

export default function Dashboard() {
  const { admin } = useAuth();
  const [stats, setStats] = useState<ModuleStats[] | null>(null);
  const [activity, setActivity] = useState<ActivityRow[]>([]);
  const [enquiryStats, setEnquiryStats] = useState<EnquiryStats | null>(null);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const enquiryBase = () => supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('archived', false);
      const [
        { count: total }, { count: newCount }, { count: contacted }, { count: quoted },
        { count: confirmed }, { count: completed },
      ] = await Promise.all([
        enquiryBase(),
        enquiryBase().eq('status', 'new'),
        enquiryBase().eq('status', 'contacted'),
        enquiryBase().eq('status', 'quoted'),
        enquiryBase().eq('status', 'confirmed'),
        enquiryBase().eq('status', 'completed'),
      ]);
      setEnquiryStats({
        total: total ?? 0,
        new: newCount ?? 0,
        pending: (contacted ?? 0) + (quoted ?? 0),
        confirmed: confirmed ?? 0,
        completed: completed ?? 0,
      });

      const { data: recent } = await supabase
        .from('bookings')
        .select('*')
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentEnquiries((recent ?? []) as Enquiry[]);

      const results = await Promise.all(
        MODULES.map(async (mod) => {
          const [{ count: total }, { count: published }, { count: draft }] = await Promise.all([
            supabase.from(mod.key).select('*', { count: 'exact', head: true }),
            mod.hasStatus
              ? supabase.from(mod.key).select('*', { count: 'exact', head: true }).eq('status', 'published')
              : supabase.from(mod.key).select('*', { count: 'exact', head: true }).eq('published', true),
            mod.hasStatus
              ? supabase.from(mod.key).select('*', { count: 'exact', head: true }).eq('status', 'draft')
              : Promise.resolve({ count: 0 }),
          ]);
          return {
            key: mod.key,
            label: mod.label,
            icon: mod.icon,
            href: mod.href,
            total: total ?? 0,
            published: published ?? 0,
            draft: draft ?? 0,
          };
        })
      );
      setStats(results);

      const activityResults = await Promise.all(
        MODULES.map(async (mod) => {
          const { data } = await supabase
            .from(mod.key)
            .select('*')
            .order('updated_at', { ascending: false })
            .limit(5);
          return ((data ?? []) as Record<string, unknown>[]).map((row) => ({
            table: mod.label,
            label: String(row[mod.nameColumn]),
            href: mod.href,
            updated_at: row.updated_at as string,
            status: row.status as ContentStatus | undefined,
          }));
        })
      );
      const merged = activityResults
        .flat()
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 8);
      setActivity(merged);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <AdminPageHeader
        title={`Welcome${admin?.full_name ? `, ${admin.full_name.split(' ')[0]}` : ''}`}
        subtitle="Here's what's happening across the website."
      />

      {loading && <LoadingState label="Loading dashboard..." />}
      {!loading && error && <ErrorState message="Couldn't load your dashboard statistics." onRetry={load} />}

      {!loading && !error && stats && (
        <>
          {enquiryStats && (
            <Link
              to="/admin/enquiries"
              className="block bg-forest-900 rounded-2xl p-5 sm:p-6 mb-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-white">
                  <Inbox size={18} className="text-gold" aria-hidden="true" />
                  <span className="font-display font-semibold">Enquiries</span>
                </div>
                <ArrowRight size={16} className="text-white/40" aria-hidden="true" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {[
                  { label: 'Total', value: enquiryStats.total },
                  { label: 'New', value: enquiryStats.new },
                  { label: 'Pending', value: enquiryStats.pending },
                  { label: 'Confirmed', value: enquiryStats.confirmed },
                  { label: 'Completed', value: enquiryStats.completed },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display text-2xl font-bold text-gold">{s.value}</div>
                    <div className="text-xs text-white/60">{s.label}</div>
                  </div>
                ))}
              </div>
            </Link>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((mod) => (
              <Link
                key={mod.key}
                to={mod.href}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center">
                    <mod.icon size={20} className="text-forest-700" aria-hidden="true" />
                  </div>
                  <ArrowRight size={16} className="text-forest-300" aria-hidden="true" />
                </div>
                <div className="font-display text-2xl font-bold text-forest-900">{mod.total}</div>
                <div className="text-sm text-forest-500 mb-2">{mod.label}</div>
                <div className="text-xs text-forest-400">
                  {mod.published} published
                  {mod.draft > 0 && ` · ${mod.draft} draft`}
                </div>
              </Link>
            ))}
          </div>

          {recentEnquiries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-6">
              <h2 className="font-display font-semibold text-forest-900 mb-4">Recent enquiries</h2>
              <ul className="divide-y divide-gray-100">
                {recentEnquiries.map((e) => (
                  <li key={e.id} className="py-3">
                    <Link to={`/admin/enquiries/${e.id}`} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-forest-900">{e.full_name}</span>
                        <div className="text-xs text-forest-400 mt-0.5">
                          {e.service || e.destination || 'General enquiry'}
                          {e.travel_date && ` · ${new Date(e.travel_date).toLocaleDateString('en-ZA')}`}
                          {e.num_travellers && ` · ${e.num_travellers} traveller${e.num_travellers === 1 ? '' : 's'}`}
                          {' · '}{new Date(e.created_at).toLocaleDateString('en-ZA')}
                        </div>
                      </div>
                      <EnquiryStatusBadge status={e.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
            <h2 className="font-display font-semibold text-forest-900 mb-4">Recent activity</h2>
            {activity.length === 0 ? (
              <p className="text-sm text-forest-500">No content yet — create your first tour, transfer or destination to get started.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {activity.map((row, i) => (
                  <li key={i} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link to={row.href} className="text-sm font-medium text-forest-900 hover:text-gold-dark truncate block">
                        {row.label}
                      </Link>
                      <div className="flex items-center gap-1.5 text-xs text-forest-400 mt-0.5">
                        <Clock size={11} aria-hidden="true" />
                        {row.table} &middot; {new Date(row.updated_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                      </div>
                    </div>
                    {row.status && <StatusBadge status={row.status} />}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
