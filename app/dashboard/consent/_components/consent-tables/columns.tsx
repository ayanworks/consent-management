'use client';

import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'consent_id',
    header: 'CONSENT ID'
  },
  {
    id: 'user',
    header: 'USER',
    cell: ({ row }) => row.original.User?.name || 'Unknown'
  },
  {
    accessorKey: 'agreement_id',
    header: 'AGREEMENT ID'
  },
  {
    accessorKey: 'consent_status',
    header: 'CONSENT STATUS'
  },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    cell: ({ row }) => new Date(row.original.created_at).toLocaleString() 
  },
  {
    id: 'actions',
    // cell: ({ row }) => <CellAction data={row.original} />
  }
];
