import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Destination } from '../../../lib/types';
import { useContentList } from '../../lib/useContentList';
import AdminPageHeader from '../../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

export default function DestinationsList() {
  const { showSuccess, showError } = useToast();
  const {
    items, count, page, setPage, pageSize, search, setSearch,
    statusFilter, setStatusFilter, loading, error, refetch,
  } = useContentList<Destination>({ table: 'destinations', searchColumns: 'name', statusColumn: 'status' });

  const [toDelete, setToDelete] = useState<Destination | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from('destinations').delete().eq('id', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (deleteError) {
      showError('Something went wrong while deleting this destination. Please try again.');
    } else {
      showSuccess(`"${toDelete.name}" was deleted.`);
      refetch();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Destinations"
        subtitle="Manage the reserves and destinations featured on the Maps page."
        action={
          <Link to="/admin/destinations/new" className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} aria-hidden="true" />
            New destination
          </Link>
        }
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search destinations by name..."
        filters={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-forest-600">
            <option value="all">All statuses</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading destinations..." />}
        {!loading && error && <ErrorState message="Couldn't load destinations." onRetry={refetch} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="No destinations yet" message="Create your first destination." action={<Link to="/admin/destinations/new" className="text-sm font-semibold text-forest-800 hover:text-gold-dark">Create a destination →</Link>} />
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <table className="w-full text-sm hidden sm:table">
              <thead className="bg-gray-50 text-forest-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Tag</th>
                  <th className="text-left px-5 py-3 font-semibold">Featured</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3.5 font-medium text-forest-900">{d.name}</td>
                    <td className="px-5 py-3.5 text-forest-500">{d.tag || '—'}</td>
                    <td className="px-5 py-3.5">{d.featured && <Star size={15} className="text-gold fill-gold" aria-label="Featured" />}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={d.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/destinations/${d.id}/edit`} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={`Edit ${d.name}`}><Pencil size={15} /></Link>
                        <button onClick={() => setToDelete(d)} className="p-2 text-forest-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label={`Delete ${d.name}`}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sm:hidden divide-y divide-gray-100">
              {items.map((d) => (
                <div key={d.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-medium text-forest-900 text-sm flex items-center gap-1.5">
                      {d.name}
                      {d.featured && <Star size={13} className="text-gold fill-gold" aria-label="Featured" />}
                    </span>
                    <StatusBadge status={d.status} />
                  </div>
                  <p className="text-xs text-forest-500 mb-3">{d.tag || 'No tag'}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Link to={`/admin/destinations/${d.id}/edit`} className="text-forest-700 font-medium">Edit</Link>
                    <button onClick={() => setToDelete(d)} className="text-red-600 font-medium">Delete</button>
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
        title="Delete this destination?"
        message={`"${toDelete?.name}" will be permanently removed. Tours linked to it will keep their own data but lose this destination reference.`}
        confirmLabel="Delete destination"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
