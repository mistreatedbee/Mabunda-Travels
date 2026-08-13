import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

const PAGE_SIZE = 15;

interface UseContentListOptions {
  table: string;
  select?: string;
  /** Column(s) to run an ILIKE search against — an array is OR'd together (e.g. name/email/phone). */
  searchColumns: string | string[];
  /** Column driving the status filter — 'status' (draft/published/archived) or a boolean column like 'published'. */
  statusColumn?: string;
  /** Extra static equality filters applied on every fetch (e.g. { archived: false }). */
  filters?: Record<string, string | boolean>;
  orderColumn?: string;
  orderAscending?: boolean;
}

/**
 * Shared list-page data hook: search + status filter + pagination against a
 * Supabase table. Used by every admin list page (Tours, Transfers,
 * Destinations, FAQs, Testimonials, Enquiries) so the pattern only lives once.
 */
export function useContentList<T>({
  table,
  select = '*',
  searchColumns,
  statusColumn,
  filters,
  orderColumn = 'updated_at',
  orderAscending = false,
}: UseContentListOptions) {
  const [items, setItems] = useState<T[]>([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filtersKey = filters ? JSON.stringify(filters) : '';

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase.from(table).select(select, { count: 'exact' });

    const trimmed = search.trim();
    if (trimmed) {
      const columns = Array.isArray(searchColumns) ? searchColumns : [searchColumns];
      query = query.or(columns.map((col) => `${col}.ilike.%${trimmed}%`).join(','));
    }
    if (statusColumn && statusFilter !== 'all') {
      const value = statusFilter === 'true' ? true : statusFilter === 'false' ? false : statusFilter;
      query = query.eq(statusColumn, value);
    }
    if (filters) {
      for (const [column, value] of Object.entries(filters)) {
        query = query.eq(column, value);
      }
    }

    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error: queryError, count: totalCount } = await query
      .order(orderColumn, { ascending: orderAscending })
      .range(from, to);

    if (queryError) {
      setError(queryError.message);
      setItems([]);
    } else {
      setItems((data ?? []) as unknown as T[]);
      setCount(totalCount ?? 0);
    }
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, select, search, searchColumns, statusColumn, statusFilter, filtersKey, orderColumn, orderAscending, page]);

  useEffect(() => {
    const handle = window.setTimeout(fetchPage, search ? 300 : 0);
    return () => window.clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchPage]);

  // Reset to page 0 whenever the search or filters change.
  useEffect(() => {
    setPage(0);
  }, [search, statusFilter, filtersKey]);

  return {
    items,
    count,
    page,
    setPage,
    pageSize: PAGE_SIZE,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    loading,
    error,
    refetch: fetchPage,
  };
}
