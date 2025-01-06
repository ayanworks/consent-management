'use client';

import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'user_id',
    header: 'USER ID'
  },
  {
    accessorKey: 'name',
    header: 'USER NAME',
    // cell: ({ row }) => row.original.User?.name || 'Unknown'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    // cell: ({row}) => row.original.Agreement?.agreement_name || 'Unknown'
  },
  // {
  //   accessorKey: 'consent_status',
  //   header: 'CONSENT STATUS'
  // },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    // cell: ({ row }) => new Date(row.original.created_at).toLocaleString() 
  },
  // {
  //   id: 'actions',
  //   // cell: ({ row }) => <CellAction data={row.original} />
  // }
];
