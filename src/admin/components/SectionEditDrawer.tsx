import { useEffect, type ReactNode } from 'react';
import { X, Loader2, Save } from 'lucide-react';

interface SectionEditDrawerProps {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onSave: () => void;
  saving?: boolean;
  children: ReactNode;
}

/** Slide-over panel for editing a single homepage section. */
export default function SectionEditDrawer({
  open,
  title,
  subtitle,
  onClose,
  onSave,
  saving = false,
  children,
}: SectionEditDrawerProps) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-labelledby="section-drawer-title">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close editor"
      />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100">
          <div>
            <h2 id="section-drawer-title" className="font-display font-semibold text-forest-900 text-lg">
              {title}
            </h2>
            {subtitle && <p className="text-sm text-forest-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-forest-500 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">{children}</div>

        <div className="border-t border-gray-100 px-5 py-4 flex gap-3 justify-end bg-gray-50/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-forest-700 hover:bg-white border border-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gold hover:bg-gold-dark text-forest-900 disabled:opacity-60 transition-colors"
          >
            {saving ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <Save size={16} aria-hidden="true" />}
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
