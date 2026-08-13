import type { AuditAction, AuditLogEntry } from '../../lib/types';
import { useContentList } from '../lib/useContentList';
import AdminPageHeader from '../components/AdminPageHeader';
import ListToolbar, { Pagination } from '../components/ListToolbar';
import { LoadingState, EmptyState, ErrorState } from '../components/States';

const ACTION_STYLES: Record<AuditAction, string> = {
  insert: 'bg-forest-50 text-forest-700 border-forest-200',
  update: 'bg-amber-50 text-amber-700 border-amber-200',
  delete: 'bg-red-50 text-red-600 border-red-200',
  login: 'bg-blue-50 text-blue-700 border-blue-200',
};

const RESOURCE_TYPES = ['tours', 'transfers', 'destinations', 'faqs', 'testimonials', 'bookings', 'settings', 'seo_pages', 'media', 'admins'];

export default function AuditLog() {
  const {
    items, count, page, setPage, pageSize, search, setSearch, loading, error, refetch,
  } = useContentList<AuditLogEntry>({
    table: 'audit_logs',
    select: '*, admin:admins(email, full_name)',
    searchColumns: 'resource_label',
    orderColumn: 'created_at',
  });

  return (
    <div>
      <AdminPageHeader
        title="Audit Log"
        subtitle="Every create, update, delete and login across the dashboard — read-only, recorded automatically."
      />

      <ListToolbar search={search} onSearchChange={setSearch} searchPlaceholder="Search by resource name..." />

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading && <LoadingState label="Loading audit log..." />}
        {!loading && error && <ErrorState message="Couldn't load the audit log." onRetry={refetch} />}
        {!loading && !error && items.length === 0 && (
          <EmptyState title="No activity yet" message="Actions taken across the dashboard will appear here." />
        )}

        {!loading && !error && items.length > 0 && (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-forest-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-5 py-3 font-semibold">Admin</th>
                <th className="text-left px-5 py-3 font-semibold">Action</th>
                <th className="text-left px-5 py-3 font-semibold">Resource</th>
                <th className="text-left px-5 py-3 font-semibold">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3.5 text-forest-900 font-medium">
                    {log.admin?.full_name || log.admin?.email || <span className="text-forest-400 italic font-normal">System</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${ACTION_STYLES[log.action]}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-forest-600">
                    <span className="text-forest-400">{log.resource_type}</span>
                    {log.resource_label && <> · {log.resource_label}</>}
                  </td>
                  <td className="px-5 py-3.5 text-forest-400 text-xs">
                    {new Date(log.created_at).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Pagination page={page} setPage={setPage} pageSize={pageSize} count={count} />

      <p className="text-xs text-forest-400 mt-4">
        Resource types: {RESOURCE_TYPES.join(', ')}. IP addresses aren't captured — doing so accurately would require routing every action through a server endpoint, which isn't how this dashboard is built.
      </p>
    </div>
  );
}
