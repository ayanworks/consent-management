'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableSearch } from '@/components/ui/table/data-table-search';
import { columns } from './columns';
import {
  useAgreementTableFilters
} from './use-agreement-table-filters';
import { Policy } from '@/constants/data';

export default function AgreementTable({
  data,
  totalData
}: {
  data: Policy[];
  totalData: number;
}) {
  const {
    searchQuery,
    setPage,
    setSearchQuery
  } = useAgreementTableFilters();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4">
        <DataTableSearch
          searchKey="name"
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setPage={setPage}
        />
      </div>
      <DataTable columns={columns} data={data} totalItems={totalData} />
    </div>
  );
}
