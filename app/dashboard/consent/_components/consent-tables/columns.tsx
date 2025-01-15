'use client';

import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy>[] = [
  // {
  //   accessorKey: 'consent_id',
  //   header: 'CONSENT ID'
  // },
  {
    id: 'user',
    header: 'USER',
    cell: ({ row }) => row.original.User?.name || 'Unknown'
  },
  {
    accessorKey: 'agreement_name',
    header: 'AGREEMENT NAME',
    cell: ({row}) => row.original.Agreement?.agreement_name || 'Unknown'
  },
  {
    accessorKey: 'consent_status',
    header: 'CONSENT STATUS'
  },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    // cell: ({ row }) => new Date(row.original.created_at).toLocaleString() 
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
    }
  },
  {
    accessorKey: 'updated_at',
    header: 'UPDATED AT',
    // cell: ({ row }) => new Date(row.original.created_at).toLocaleString() 
    cell: ({ row }) => {
      if(row.original.updated_at) {
        const date = new Date(row.original.updated_at);
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
      }
      return null
    }
  },
  {
    id: 'actions',
    // cell: ({ row }) => <CellAction data={row.original} />
  }
];
