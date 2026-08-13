import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Copy } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Tour } from '../../../lib/types';
import { useContentList } from '../../lib/useContentList';
import AdminPageHeader from '../../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';
import { slugify } from '../../../lib/slug';

export default function ToursList() {
  const { showSuccess, showError } = useToast();
  const {
    items, count, page, setPage, pageSize, search, setSearch,
    statusFilter, setStatusFilter, loading, error, refetch,
  } = useContentList<Tour & { destination: { name: string } | null }>({
    table: 'tours',
    select: '*, destination:destinations(name)',
    searchColumns: 'name',
    statusColumn: 'status',
  });

  const [toDelete, setToDelete] = useState<Tour | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [duplicating, setDuplicating] = useState<string | null>(null);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from('tours').delete().eq('id', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (deleteError) {
      showError('Something went wrong while deleting this tour. Please try again.');
    } else {
      showSuccess(`"${toDelete.name}" was deleted.`);
      refetch();
    }
  }

  async function handleDuplicate(tour: Tour) {
    setDuplicating(tour.id);
    const { id, created_at, updated_at, destination, ...rest } = tour as Tour & { destination?: unknown };
    void id; void created_at; void updated_at; void destination;
    const copyName = `${rest.name} (Copy)`;
    const { error: insertError } = await supabase.from('tours').insert({
      ...rest,
      name: copyName,
      slug: `${slugify(copyName)}-${Date.now().toString(36)}`,
      status: 'draft',
      featured: false,
    });
    setDuplicating(null);
    if (insertError) {
      showError('Could not duplicate this tour. Please try again.');
    } else {
      showSuccess(`Duplicated as "${copyName}".`);
      refetch();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Tours"
        subtitle="Manage guided tours and experiences shown on the website."
        action={
          <Link to="/admin/tours/new" className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} aria-hidden="true" />
            New tour
          </Link>
        }
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tours by name..."
        filters={
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-forest-600"
          >
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading tours..." />}
        {!loading && error && <ErrorState message="Couldn't load tours." onRetry={refetch} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState
            title="No tours yet"
            message="Create your first tour to have it appear on the public website once published."
            action={
              <Link to="/admin/tours/new" className="text-sm font-semibold text-forest-800 hover:text-gold-dark">
                Create a tour →
              </Link>
            }
          />
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {/* Desktop table */}
            <table className="w-full text-sm hidden sm:table">
              <thead className="bg-gray-50 text-forest-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Destination</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Updated</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3.5 font-medium text-forest-900">{tour.name}</td>
                    <td className="px-5 py-3.5 text-forest-500">{tour.destination?.name || '—'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={tour.status} /></td>
                    <td className="px-5 py-3.5 text-forest-400 text-xs">{new Date(tour.updated_at).toLocaleDateString('en-ZA')}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => handleDuplicate(tour)} disabled={duplicating === tour.id} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={`Duplicate ${tour.name}`}>
                          <Copy size={15} />
                        </button>
                        <Link to={`/admin/tours/${tour.id}/edit`} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={`Edit ${tour.name}`}>
                          <Pencil size={15} />
                        </Link>
                        <button onClick={() => setToDelete(tour)} className="p-2 text-forest-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label={`Delete ${tour.name}`}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-100">
              {items.map((tour) => (
                <div key={tour.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-medium text-forest-900 text-sm">{tour.name}</span>
                    <StatusBadge status={tour.status} />
                  </div>
                  <p className="text-xs text-forest-500 mb-3">{tour.destination?.name || 'No destination'}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Link to={`/admin/tours/${tour.id}/edit`} className="text-forest-700 font-medium">Edit</Link>
                    <button onClick={() => handleDuplicate(tour)} className="text-forest-700 font-medium">Duplicate</button>
                    <button onClick={() => setToDelete(tour)} className="text-red-600 font-medium">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <Pagination page={page} setPage={setPage} pageSize={pageSize} count={count} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this tour?"
        message={`"${toDelete?.name}" will be permanently removed and will disappear from the website immediately. This cannot be undone.`}
        confirmLabel="Delete tour"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
