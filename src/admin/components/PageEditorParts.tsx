import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Pencil } from 'lucide-react';
import StatusBadge from './StatusBadge';

export function SectionShell({
  step,
  title,
  description,
  icon: Icon,
  preview,
  children,
}: {
  step: number;
  title: string;
  description: string;
  icon: LucideIcon;
  preview?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-64 flex-shrink-0 bg-forest-50 border-b lg:border-b-0 lg:border-r border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-3">
            <span className="w-8 h-8 rounded-full bg-forest-800 text-white text-sm font-bold flex items-center justify-center">
              {step}
            </span>
            <Icon size={18} className="text-forest-700" aria-hidden="true" />
          </div>
          <h2 className="font-display font-semibold text-forest-900 text-sm">{title}</h2>
          <p className="text-xs text-forest-500 mt-1 leading-relaxed">{description}</p>
          {preview && <div className="mt-4">{preview}</div>}
        </div>
        <div className="flex-1 p-5 sm:p-6 space-y-4">{children}</div>
      </div>
    </section>
  );
}

export function ContentPreviewCard({
  image,
  title,
  subtitle,
  editHref,
  status,
}: {
  image?: string;
  title: string;
  subtitle: string;
  editHref: string;
  status?: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all">
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-forest-100 flex-shrink-0">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-forest-300">
            <ImageIcon size={18} aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-forest-900 truncate">{title}</div>
        <div className="text-xs text-forest-500 line-clamp-2">{subtitle}</div>
      </div>
      {status && <StatusBadge status={status as 'published' | 'draft' | 'archived'} />}
      <Link
        to={editHref}
        className="flex items-center gap-1 text-xs font-semibold text-forest-700 hover:text-gold-dark px-2 py-1.5 rounded-lg hover:bg-forest-50"
      >
        <Pencil size={13} aria-hidden="true" />
        Edit
      </Link>
    </div>
  );
}

export function CharCount({ current, max, warnAt }: { current: number; max: number; warnAt?: number }) {
  const warn = warnAt ?? max - 10;
  const over = current > max;
  return (
    <p className={`text-xs mt-1 ${over ? 'text-red-600' : current >= warn ? 'text-amber-600' : 'text-forest-400'}`}>
      {current}/{max} characters{over ? ' — too long' : ''}
    </p>
  );
}

export function SearchPreview({
  title,
  url,
  description,
}: {
  title: string;
  url: string;
  description: string;
}) {
  function truncate(text: string, max: number) {
    return text.length > max ? `${text.slice(0, max - 1)}…` : text;
  }

  return (
    <div className="border border-gray-100 rounded-xl p-4 bg-gray-50 font-sans">
      <p className="text-[#1a0dab] text-lg leading-snug">{truncate(title, 60)}</p>
      <p className="text-[#006621] text-sm mb-1 truncate">{url}</p>
      <p className="text-[#545454] text-sm leading-snug">{truncate(description, 160)}</p>
    </div>
  );
}

export function SocialPreview({
  siteHost,
  title,
  description,
  imageUrl,
}: {
  siteHost: string;
  title: string;
  description: string;
  imageUrl?: string;
}) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden max-w-sm">
      {imageUrl ? (
        <img src={imageUrl} alt="" className="w-full h-40 object-cover" />
      ) : (
        <div className="w-full h-32 bg-forest-100 flex items-center justify-center text-forest-400 text-xs">
          No sharing image set
        </div>
      )}
      <div className="p-3 bg-gray-50">
        <p className="text-[11px] text-forest-400 uppercase">{siteHost}</p>
        <p className="text-sm font-semibold text-forest-900 line-clamp-2">{title}</p>
        <p className="text-xs text-forest-500 line-clamp-2 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
