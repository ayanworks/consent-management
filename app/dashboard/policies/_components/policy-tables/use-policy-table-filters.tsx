'use client';

import { searchParams } from '@/lib/searchparams';
import { useQueryState } from 'nuqs';

export function usePolicyTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    'q',
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault('')
  );


  const [page, setPage] = useQueryState(
    'page',
    searchParams.page.withDefault(1)
  );

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
  };
}
