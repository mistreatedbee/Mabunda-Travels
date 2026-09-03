import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, ArchiveRestore, Users2 } from 'lucide-react';
import type { Enquiry } from '../../../lib/types';
import { useContentList } from '../../lib/useContentList';
import AdminPageHeader from '../../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import EnquiryStatusBadge from '../../components/EnquiryStatusBadge';

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function EnquiriesList() {
  const [showArchived, setShowArchived] = useState(false);

  const {
    items, count, page, setPage, pageSize, search, setSearch,
    statusFilter, setStatusFilter, loading, error, refetch,
  } = useContentList<Enquiry>({
    table: 'bookings',
    searchColumns: ['full_name', 'email', 'phone'],
    statusColumn: 'status',
    filters: { archived: showArchived },
    orderColumn: 'created_at',
  });

  return (
    <div>
      <AdminPageHeader
        title="Customer Enquiries"
        subtitle="When someone fills in the booking form on your website, it appears here."
        action={
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-forest-700 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
          >
            {showArchived ? <ArchiveRestore size={16} aria-hidden="true" /> : <Archive size={16} aria-hidden="true" />}
            {showArchived ? 'Show active' : 'Show archived'}
          </button>
        }
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or phone..."
        filters={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-forest-600">
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading enquiries..." />}
        {!loading && error && <ErrorState message="Couldn't load enquiries." onRetry={refetch} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState
            title={showArchived ? 'No archived enquiries' : 'No enquiries yet'}
            message={showArchived ? 'Archived enquiries will appear here.' : 'New enquiries submitted through the Contact page will appear here.'}
          />
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <table className="w-full text-sm hidden sm:table">
              <thead className="bg-gray-50 text-forest-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Customer</th>
                  <th className="text-left px-5 py-3 font-semibold">Service</th>
                  <th className="text-left px-5 py-3 font-semibold">Travel date</th>
                  <th className="text-left px-5 py-3 font-semibold">Travellers</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Received</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((e) => (
                  <tr key={e.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3.5">
                      <Link to={`/admin/enquiries/${e.id}`} className="font-medium text-forest-900 hover:text-gold-dark">{e.full_name}</Link>
                      <div className="text-xs text-forest-400">{e.email}</div>
                    </td>
                    <td className="px-5 py-3.5 text-forest-500">{e.service || e.destination || '—'}</td>
                    <td className="px-5 py-3.5 text-forest-500">{e.travel_date ? new Date(e.travel_date).toLocaleDateString('en-ZA') : '—'}</td>
                    <td className="px-5 py-3.5 text-forest-500">{e.num_travellers ?? '—'}</td>
                    <td className="px-5 py-3.5"><EnquiryStatusBadge status={e.status} /></td>
                    <td className="px-5 py-3.5 text-forest-400 text-xs">{new Date(e.created_at).toLocaleDateString('en-ZA')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sm:hidden divide-y divide-gray-100">
              {items.map((e) => (
                <Link key={e.id} to={`/admin/enquiries/${e.id}`} className="block p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-medium text-forest-900 text-sm">{e.full_name}</span>
                    <EnquiryStatusBadge status={e.status} />
                  </div>
                  <p className="text-xs text-forest-500 mb-1">{e.service || e.destination || 'General enquiry'}</p>
                  <div className="flex items-center gap-3 text-xs text-forest-400">
                    {e.travel_date && <span>{new Date(e.travel_date).toLocaleDateString('en-ZA')}</span>}
                    {e.num_travellers && <span className="flex items-center gap-1"><Users2 size={11} />{e.num_travellers}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <Pagination page={page} setPage={setPage} pageSize={pageSize} count={count} />
    </div>
  );
}
