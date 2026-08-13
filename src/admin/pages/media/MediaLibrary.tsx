import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import type { MediaItem } from '../../../lib/types';
import { useContentList } from '../../lib/useContentList';
import AdminPageHeader from '../../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../../components/States';
import ConfirmDialog from '../../components/ConfirmDialog';
import { useToast } from '../../components/Toast';

const FOLDERS = [
  { value: 'all', label: 'All folders' },
  { value: 'tours', label: 'Tours' },
  { value: 'transfers', label: 'Transfers' },
  { value: 'destinations', label: 'Destinations' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'seo', label: 'SEO' },
];

function formatSize(bytes: number | null): string {
  if (!bytes) return '';
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary() {
  const { showSuccess, showError } = useToast();
  const [folder, setFolder] = useState('all');

  const {
    items, count, page, setPage, pageSize, search, setSearch, loading, error, refetch,
  } = useContentList<MediaItem>({
    table: 'media',
    searchColumns: ['alt_text', 'description'],
    filters: folder !== 'all' ? { folder } : undefined,
    orderColumn: 'created_at',
  });

  const [toDelete, setToDelete] = useState<MediaItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);

    const { error: storageError } = await supabase.storage.from('media').remove([toDelete.storage_path]);
    const { error: rowError } = await supabase.from('media').delete().eq('id', toDelete.id);

    setDeleting(false);
    setToDelete(null);

    if (storageError || rowError) {
      showError('Something went wrong while deleting this image. Please try again.');
    } else {
      showSuccess('Image deleted.');
      refetch();
    }
  }

  async function saveField(item: MediaItem, field: 'alt_text' | 'description', value: string) {
    setSavingId(item.id);
    const { error } = await supabase.from('media').update({ [field]: value }).eq('id', item.id);
    setSavingId(null);
    if (error) showError('Could not save changes. Please try again.');
  }

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        subtitle="Every image uploaded across Tours, Transfers, Destinations and Testimonials, in one place."
      />

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by alt text or description..."
        filters={
          <select value={folder} onChange={(e) => setFolder(e.target.value)} className="px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-forest-600">
            {FOLDERS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        }
      />

      {loading && <LoadingState label="Loading media..." />}
      {!loading && error && <ErrorState message="Couldn't load the media library." onRetry={refetch} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="No images yet"
          message="Images you upload from Tours, Transfers, Destinations or Testimonials will appear here automatically."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="relative">
                <img src={item.url} alt={item.alt_text} className="w-full h-40 object-cover" loading="lazy" />
                <button
                  onClick={() => setToDelete(item)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                  aria-label="Delete image"
                >
                  <Trash2 size={13} />
                </button>
                {item.folder && (
                  <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full capitalize">
                    {item.folder}
                  </span>
                )}
              </div>
              <div className="p-3 space-y-2">
                <input
                  defaultValue={item.alt_text}
                  onBlur={(e) => e.target.value !== item.alt_text && saveField(item, 'alt_text', e.target.value)}
                  placeholder="Alt text"
                  aria-label="Alt text"
                  disabled={savingId === item.id}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-forest-600"
                />
                <input
                  defaultValue={item.description || ''}
                  onBlur={(e) => e.target.value !== (item.description || '') && saveField(item, 'description', e.target.value)}
                  placeholder="Description (optional)"
                  aria-label="Description"
                  disabled={savingId === item.id}
                  className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-forest-600"
                />
                <p className="text-[11px] text-forest-400">
                  {formatSize(item.file_size)}{item.file_size && ' · '}{new Date(item.created_at).toLocaleDateString('en-ZA')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={page} setPage={setPage} pageSize={pageSize} count={count} />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this image?"
        message="If this image is still used on a tour, transfer, destination or testimonial, deleting it here will break that image there too — you'll need to re-upload a replacement on that item."
        confirmLabel="Delete image"
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
