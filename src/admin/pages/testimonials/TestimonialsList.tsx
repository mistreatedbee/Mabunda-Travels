import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Testimonial } from '../../../lib/types';
import { useContentList } from '../../lib/useContentList';
import AdminPageHeader from '../../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex text-gold" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={13} className={i < rating ? 'fill-gold' : 'text-gray-200'} aria-hidden="true" />
      ))}
    </span>
  );
}

export default function TestimonialsList() {
  const { showSuccess, showError } = useToast();
  const {
    items, count, page, setPage, pageSize, search, setSearch,
    statusFilter, setStatusFilter, loading, error, refetch,
  } = useContentList<Testimonial>({ table: 'testimonials', searchColumns: 'customer_name', statusColumn: 'published' });

  const [toDelete, setToDelete] = useState<Testimonial | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from('testimonials').delete().eq('id', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (deleteError) {
      showError('Something went wrong while deleting this testimonial. Please try again.');
    } else {
      showSuccess(`Testimonial from "${toDelete.customer_name}" was deleted.`);
      refetch();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        subtitle="Manage customer reviews shown on the Home page."
        action={
          <Link to="/admin/testimonials/new" className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} aria-hidden="true" />
            New testimonial
          </Link>
        }
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by customer name..."
        filters={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-forest-600">
            <option value="all">All</option>
            <option value="true">Published</option>
            <option value="false">Hidden</option>
          </select>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading testimonials..." />}
        {!loading && error && <ErrorState message="Couldn't load testimonials." onRetry={refetch} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="No testimonials yet" message="Add your first customer testimonial." action={<Link to="/admin/testimonials/new" className="text-sm font-semibold text-forest-800 hover:text-gold-dark">Add a testimonial →</Link>} />
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {items.map((t) => (
              <li key={t.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-forest-900 text-sm">{t.customer_name}</span>
                    <Stars rating={t.rating} />
                    {t.featured && <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark">Featured</span>}
                    {!t.published && <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Hidden</span>}
                  </div>
                  <p className="text-sm text-forest-500 line-clamp-2">{t.review}</p>
                  {t.customer_location && <p className="text-xs text-forest-400 mt-1">{t.customer_location}{t.source ? ` · via ${t.source}` : ''}</p>}
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link to={`/admin/testimonials/${t.id}/edit`} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={`Edit testimonial from ${t.customer_name}`}><Pencil size={15} /></Link>
                  <button onClick={() => setToDelete(t)} className="p-2 text-forest-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label={`Delete testimonial from ${t.customer_name}`}><Trash2 size={15} /></button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Pagination page={page} setPage={setPage} pageSize={pageSize} count={count} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this testimonial?"
        message={`The testimonial from "${toDelete?.customer_name}" will be permanently removed.`}
        confirmLabel="Delete testimonial"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
