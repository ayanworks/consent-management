'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Options } from 'nuqs';
import { useTransition } from 'react';

interface DataTableSearchProps {
  searchKey: string;
  searchQuery: string;
  setSearchQuery: (
    value: string | ((old: string) => string | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
  setPage: <Shallow>(
    value: number | ((old: number) => number | null) | null,
    options?: Options | undefined
  ) => Promise<URLSearchParams>;
}

export function DataTableSearch({
  searchKey,
  searchQuery,
  setSearchQuery,
  setPage
}: DataTableSearchProps) {
  const [isLoading, startTransition] = useTransition();

  const handleSearch = (value: string) => {
    setSearchQuery(value, { startTransition });
    setPage(1); // Reset page to 1 when search changes
  };

  const handleClear = () => {
    setSearchQuery('', { startTransition });
    setPage(1); // Reset page to 1 when search is cleared
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        placeholder={`Search ${searchKey}...`}
        value={searchQuery ?? ''}
        onChange={(e) => handleSearch(e.target.value)}
        className={cn('w-[300px]', isLoading && 'animate-pulse')}
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="text-md text-gray-600 hover:text-gray-700"
        >
          Clear
        </button>
      )}
    </div>
  );
}
