import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Home, Inbox, Compass, MessageSquareQuote, HelpCircle, Settings,
  Car, MapPinned, ArrowRight, Sparkles,
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthContext';
import AdminPageHeader from '../components/AdminPageHeader';
import { LoadingState, ErrorState } from '../components/States';
import EnquiryStatusBadge from '../components/EnquiryStatusBadge';
import type { Enquiry } from '../../lib/types';

const QUICK_ACTIONS = [
  {
    to: '/admin/tours',
    icon: Compass,
    title: 'Activities & Tours',
    description: 'Add or update the activity cards on your homepage (e.g. safaris, boat cruises).',
  },
  {
    to: '/admin/testimonials',
    icon: MessageSquareQuote,
    title: 'Customer Reviews',
    description: 'Add what happy travellers have said — shown on the homepage.',
  },
  {
    to: '/admin/faqs',
    icon: HelpCircle,
    title: 'Questions & Answers',
    description: 'Update common questions visitors ask before booking.',
  },
  {
    to: '/admin/settings',
    icon: Settings,
    title: 'Business Details',
    description: 'Change your phone number, email, office hours and WhatsApp link.',
    adminOnly: true,
  },
  {
    to: '/admin/transfers',
    icon: Car,
    title: 'Transfer Services',
    description: 'Manage airport and private transfer options on the Services page.',
  },
  {
    to: '/admin/destinations',
    icon: MapPinned,
    title: 'Maps & Game Reserves',
    description: 'Update reserve names and details shown on the Maps page.',
  },
] as const;

export default function Dashboard() {
  const { admin } = useAuth();
  const [newEnquiries, setNewEnquiries] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(false);
      try {
        const [{ count }, { data: recent }] = await Promise.all([
          supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('archived', false).eq('status', 'new'),
          supabase.from('bookings').select('*').eq('archived', false).order('created_at', { ascending: false }).limit(5),
        ]);
        setNewEnquiries(count ?? 0);
        setRecentEnquiries((recent ?? []) as Enquiry[]);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const canEditHomepage = admin?.role === 'super_admin' || admin?.role === 'admin';

  return (
    <div>
      <AdminPageHeader
        title={`Hello${admin?.full_name ? `, ${admin.full_name.split(' ')[0]}` : ''}`}
        subtitle="Use this dashboard to update your website. Changes go live as soon as you save."
      />

      {loading && <LoadingState label="Loading…" />}
      {!loading && error && <ErrorState message="Could not load your dashboard. Please refresh the page." />}

      {!loading && !error && (
        <>
          <div className="bg-forest-50 border border-forest-100 rounded-2xl p-5 sm:p-6 mb-6">
            <h2 className="font-display font-semibold text-forest-900 flex items-center gap-2 mb-2">
              <Sparkles size={18} className="text-gold" aria-hidden="true" />
              How to update your website
            </h2>
            <ol className="text-sm text-forest-700 space-y-2 list-decimal list-inside leading-relaxed">
              {canEditHomepage && (
                <li>
                  Open <strong>Edit Homepage</strong> to change headlines, photos and text visitors see first.
                </li>
              )}
              <li>
                Use <strong>Activities & Tours</strong>, <strong>Customer Reviews</strong> and <strong>Questions & Answers</strong> to update the rest of the homepage content.
              </li>
              <li>
                Open <strong>Business Details</strong> to change your phone number, email and opening hours.
              </li>
              <li>
                Check <strong>Customer Enquiries</strong> when someone submits a booking form on the website.
              </li>
            </ol>
          </div>

          {canEditHomepage && (
            <Link
              to="/admin/homepage"
              className="block bg-gradient-to-r from-forest-800 to-forest-900 rounded-2xl p-5 sm:p-6 mb-6 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-white">
                  <Home size={20} className="text-gold" aria-hidden="true" />
                  <span className="font-display font-semibold text-lg">Edit Homepage</span>
                </div>
                <ArrowRight size={18} className="text-white/40 group-hover:text-gold transition-colors" aria-hidden="true" />
              </div>
              <p className="text-sm text-white/75 leading-relaxed">
                Change your main banner, welcome text, section headings and Google search settings — all in one place.
              </p>
            </Link>
          )}

          <Link
            to="/admin/enquiries"
            className="block bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 mb-6 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-forest-900">
                <Inbox size={18} className="text-forest-600" aria-hidden="true" />
                <span className="font-display font-semibold">Customer Enquiries</span>
              </div>
              <ArrowRight size={16} className="text-forest-300 group-hover:text-gold transition-colors" aria-hidden="true" />
            </div>
            <p className="text-sm text-forest-500 mb-3">
              Booking requests sent through the website contact form.
            </p>
            {newEnquiries > 0 ? (
              <p className="text-sm font-semibold text-gold-dark bg-gold/15 inline-block px-3 py-1 rounded-full">
                {newEnquiries} new {newEnquiries === 1 ? 'enquiry' : 'enquiries'} waiting for you
              </p>
            ) : (
              <p className="text-sm text-forest-400">No new enquiries right now.</p>
            )}
          </Link>

          <h2 className="font-display font-semibold text-forest-900 mb-3">Update website content</h2>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {QUICK_ACTIONS.filter((a) => !a.adminOnly || canEditHomepage).map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-forest-50 flex items-center justify-center flex-shrink-0">
                    <action.icon size={20} className="text-forest-700" aria-hidden="true" />
                  </div>
                  <ArrowRight size={16} className="text-forest-300 group-hover:text-gold transition-colors mt-1" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-forest-900 text-sm mb-1">{action.title}</h3>
                <p className="text-xs text-forest-500 leading-relaxed">{action.description}</p>
              </Link>
            ))}
          </div>

          {recentEnquiries.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-forest-900">Latest enquiries</h2>
                <Link to="/admin/enquiries" className="text-xs font-semibold text-forest-700 hover:text-gold-dark">
                  View all
                </Link>
              </div>
              <ul className="divide-y divide-gray-100">
                {recentEnquiries.map((e) => (
                  <li key={e.id} className="py-3">
                    <Link to={`/admin/enquiries/${e.id}`} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-forest-900">{e.full_name}</span>
                        <div className="text-xs text-forest-400 mt-0.5">
                          {e.service || e.destination || 'General enquiry'}
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
        </>
      )}
    </div>
  );
}
