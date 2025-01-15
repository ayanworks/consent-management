'use client';

import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy & { email?: string }>[] = [
  // {
  //   accessorKey: 'log_id',
  //   header: 'LOG ID',
  // },
  {
    accessorKey: 'agreement_name',
    header: 'AGREEMENT NAME',
    // cell: ({ row }) => row.original.User?.name || 'Unknown'
  },
  {
    accessorKey: 'entity_type',
    header: 'ENTITY TYPE',
    // cell: ({row}) => row.original.Agreement?.agreement_name || 'Unknown'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL',
    cell: ({ row }) => row.original.email || 'No email found',
  },
  {
    accessorKey: 'action',
    header: 'ACTION',
    // cell: ({ row }) => new Date(row.original.created_at).toLocaleString()
  },
  {
    accessorKey: 'consent_status',
    header: 'CONSENT STATUS'
  },
  {
    accessorKey: 'updated_at',
    header: 'UPDATED AT',
    // cell: ({ row }) => new Date(row.original.updated_at).toLocaleString()
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      const formatter = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
      });
  
      return formatter.format(date);
    },
  },
  // {
  //   id: 'actions',
  //   // cell: ({ row }) => <CellAction data={row.original} />
  // }
];
