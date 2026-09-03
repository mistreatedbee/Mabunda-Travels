import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Transfer } from '../../../lib/types';
import { useContentList } from '../../lib/useContentList';
import AdminPageHeader from '../../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

const TYPE_LABEL: Record<Transfer['type'], string> = {
  airport: 'Airport', private: 'Private', destination: 'Destination', custom: 'Custom',
};

export default function TransfersList() {
  const { showSuccess, showError } = useToast();
  const {
    items, count, page, setPage, pageSize, search, setSearch,
    statusFilter, setStatusFilter, loading, error, refetch,
  } = useContentList<Transfer>({ table: 'transfers', searchColumns: 'name', statusColumn: 'status' });

  const [toDelete, setToDelete] = useState<Transfer | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from('transfers').delete().eq('id', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (deleteError) {
      showError('Something went wrong while deleting this transfer. Please try again.');
    } else {
      showSuccess(`"${toDelete.name}" was deleted.`);
      refetch();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Transfer Services"
        subtitle="Airport and private transfers shown on your Services page."
        action={
          <Link to="/admin/transfers/new" className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} aria-hidden="true" />
            New transfer
          </Link>
        }
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search transfers by name..."
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
        {loading && <LoadingState label="Loading transfers..." />}
        {!loading && error && <ErrorState message="Couldn't load transfers." onRetry={refetch} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="No transfers yet" message="Create your first transfer service." action={<Link to="/admin/transfers/new" className="text-sm font-semibold text-forest-800 hover:text-gold-dark">Create a transfer →</Link>} />
        )}

        {!loading && !error && items.length > 0 && (
          <>
            <table className="w-full text-sm hidden sm:table">
              <thead className="bg-gray-50 text-forest-500 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Name</th>
                  <th className="text-left px-5 py-3 font-semibold">Type</th>
                  <th className="text-left px-5 py-3 font-semibold">Pricing</th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/60">
                    <td className="px-5 py-3.5 font-medium text-forest-900">{t.name}</td>
                    <td className="px-5 py-3.5 text-forest-500">{TYPE_LABEL[t.type]}</td>
                    <td className="px-5 py-3.5 text-forest-500">{t.pricing_type === 'fixed' ? `R${t.price ?? '—'}` : 'Request a quote'}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/admin/transfers/${t.id}/edit`} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={`Edit ${t.name}`}><Pencil size={15} /></Link>
                        <button onClick={() => setToDelete(t)} className="p-2 text-forest-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label={`Delete ${t.name}`}><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="sm:hidden divide-y divide-gray-100">
              {items.map((t) => (
                <div key={t.id} className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="font-medium text-forest-900 text-sm">{t.name}</span>
                    <StatusBadge status={t.status} />
                  </div>
                  <p className="text-xs text-forest-500 mb-3">{TYPE_LABEL[t.type]} &middot; {t.pricing_type === 'fixed' ? `R${t.price ?? '—'}` : 'Request a quote'}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <Link to={`/admin/transfers/${t.id}/edit`} className="text-forest-700 font-medium">Edit</Link>
                    <button onClick={() => setToDelete(t)} className="text-red-600 font-medium">Delete</button>
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
        title="Delete this transfer?"
        message={`"${toDelete?.name}" will be permanently removed and will disappear from the website immediately.`}
        confirmLabel="Delete transfer"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
