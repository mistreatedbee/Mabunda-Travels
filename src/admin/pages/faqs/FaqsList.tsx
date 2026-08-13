import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { Faq } from '../../../lib/types';
import AdminPageHeader from '../../components/AdminPageHeader';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

const CATEGORY_LABEL: Record<Faq['category'], string> = { general: 'General', booking: 'Booking' };

export default function FaqsList() {
  const { showSuccess, showError } = useToast();
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [toDelete, setToDelete] = useState<Faq | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [reordering, setReordering] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(false);
    const { data, error: queryError } = await supabase.from('faqs').select('*').order('display_order', { ascending: true });
    if (queryError) setError(true);
    else setItems((data ?? []) as Faq[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;

    const a = items[index];
    const b = items[target];
    setReordering(a.id);

    const [{ error: e1 }, { error: e2 }] = await Promise.all([
      supabase.from('faqs').update({ display_order: b.display_order }).eq('id', a.id),
      supabase.from('faqs').update({ display_order: a.display_order }).eq('id', b.id),
    ]);

    setReordering(null);
    if (e1 || e2) {
      showError('Could not reorder FAQs. Please try again.');
    } else {
      const next = [...items];
      [next[index], next[target]] = [next[target], next[index]];
      setItems(next);
    }
  }

  async function togglePublished(faq: Faq) {
    const { error: updateError } = await supabase.from('faqs').update({ published: !faq.published }).eq('id', faq.id);
    if (updateError) {
      showError('Could not update this FAQ. Please try again.');
    } else {
      setItems((prev) => prev.map((f) => (f.id === faq.id ? { ...f, published: !f.published } : f)));
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const { error: deleteError } = await supabase.from('faqs').delete().eq('id', toDelete.id);
    setDeleting(false);
    setToDelete(null);
    if (deleteError) {
      showError('Something went wrong while deleting this FAQ. Please try again.');
    } else {
      showSuccess('FAQ deleted.');
      load();
    }
  }

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        subtitle="Manage frequently asked questions shown on the Home and Contact pages."
        action={
          <Link to="/admin/faqs/new" className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
            <Plus size={16} aria-hidden="true" />
            New FAQ
          </Link>
        }
      />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading FAQs..." />}
        {!loading && error && <ErrorState message="Couldn't load FAQs." onRetry={load} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="No FAQs yet" message="Create your first FAQ." action={<Link to="/admin/faqs/new" className="text-sm font-semibold text-forest-800 hover:text-gold-dark">Create an FAQ →</Link>} />
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {items.map((faq, i) => (
              <li key={faq.id} className="flex items-start gap-3 p-4 sm:p-5">
                <div className="flex flex-col gap-0.5 pt-0.5">
                  <button onClick={() => move(i, -1)} disabled={i === 0 || reordering === faq.id} className="p-1 text-forest-400 hover:text-forest-800 disabled:opacity-30" aria-label="Move up">
                    <ArrowUp size={14} />
                  </button>
                  <button onClick={() => move(i, 1)} disabled={i === items.length - 1 || reordering === faq.id} className="p-1 text-forest-400 hover:text-forest-800 disabled:opacity-30" aria-label="Move down">
                    <ArrowDown size={14} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-medium text-forest-900 text-sm">{faq.question}</span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-forest-50 text-forest-600">
                      {CATEGORY_LABEL[faq.category]}
                    </span>
                    {!faq.published && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">Hidden</span>
                    )}
                  </div>
                  <p className="text-sm text-forest-500 line-clamp-2">{faq.answer}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => togglePublished(faq)} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={faq.published ? 'Unpublish' : 'Publish'}>
                    {faq.published ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <Link to={`/admin/faqs/${faq.id}/edit`} className="p-2 text-forest-400 hover:text-forest-800 hover:bg-gray-100 rounded-lg" aria-label={`Edit "${faq.question}"`}>
                    <Pencil size={15} />
                  </Link>
                  <button onClick={() => setToDelete(faq)} className="p-2 text-forest-400 hover:text-red-600 hover:bg-red-50 rounded-lg" aria-label={`Delete "${faq.question}"`}>
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this FAQ?"
        message="This FAQ will be permanently removed and disappear from the website immediately."
        confirmLabel="Delete FAQ"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
