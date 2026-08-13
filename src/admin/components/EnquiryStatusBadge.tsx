import type { EnquiryStatus } from '../../lib/types';

const STYLES: Record<EnquiryStatus, string> = {
  new: 'bg-blue-50 text-blue-700 border-blue-200',
  contacted: 'bg-amber-50 text-amber-700 border-amber-200',
  quoted: 'bg-purple-50 text-purple-700 border-purple-200',
  confirmed: 'bg-forest-50 text-forest-700 border-forest-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

export default function EnquiryStatusBadge({ status }: { status: EnquiryStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${STYLES[status]}`}>
      {status}
    </span>
  );
}
