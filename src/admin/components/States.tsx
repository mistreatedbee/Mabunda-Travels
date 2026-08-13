import type { ReactNode } from 'react';
import { Loader2, Inbox, AlertCircle, RotateCcw } from 'lucide-react';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-forest-500" role="status">
      <Loader2 size={28} className="animate-spin text-forest-700" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  action,
}: {
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6">
      <div className="w-14 h-14 rounded-full bg-forest-50 flex items-center justify-center">
        <Inbox size={24} className="text-forest-400" aria-hidden="true" />
      </div>
      <h3 className="font-display font-semibold text-forest-900">{title}</h3>
      <p className="text-sm text-forest-500 max-w-sm">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16 text-center px-6" role="alert">
      <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
        <AlertCircle size={24} className="text-red-500" aria-hidden="true" />
      </div>
      <p className="text-sm text-forest-700 max-w-sm">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 text-sm font-medium text-forest-800 hover:text-gold-dark mt-1"
        >
          <RotateCcw size={14} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  );
}
