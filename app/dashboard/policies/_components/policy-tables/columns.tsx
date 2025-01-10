'use client';
import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'policy_name',
    header: 'POLICY NAME	'
  },
  // {
  //   accessorKey: 'policy_description',
  //   header: 'DESCRIPTION',
  //   cell: ({ row }) => {
  //     const description = row.original.policy_description;
  //     const words = description.split(' ');
  //     const displayText = words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '');
  //     return <span>{displayText}</span>;
  //   },
  // },
  {
    accessorKey: 'version',
    header: 'VERSION'
  },
  {
    accessorKey: 'jurisdiction',
    header: 'JURISDICTION'
  },
  {
    accessorKey: 'industrySector',
    header: 'SECTOR'
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
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
