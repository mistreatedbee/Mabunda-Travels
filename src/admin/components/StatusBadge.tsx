import type { ContentStatus } from '../../lib/types';

const STYLES: Record<ContentStatus, string> = {
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  published: 'bg-forest-50 text-forest-700 border-forest-200',
  archived: 'bg-gray-100 text-gray-600 border-gray-200',
};

export default function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STYLES[status]}`}>
      {status}
    </span>
  );
}
