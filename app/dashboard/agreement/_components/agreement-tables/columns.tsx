'use client';
import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'agreement_name',
    header: 'AGREEMENT NAME'
  },
  {
    accessorKey: 'purpose',
    header: 'PURPOSE'
  },
  {
    accessorKey: 'purpose_description',
    header: 'DESCRIPTION',
    cell: ({ row }) => {
      const description = row.original.purpose_description;
      const words = description.split(' ');
      const displayText = words.slice(0, 6).join(' ') + (words.length > 6 ? '...' : '');
      return <span>{displayText}</span>;
    }
  },
  {
    accessorKey: 'is_active',
    header: 'ACTIVE STATUS'
  },
  {
    accessorKey: 'version',
    header: 'VERSION'
  },
  {
    accessorKey: 'created_at',
    header: 'CREATED AT',
    // cell: ({ row }) => new Date(row.original.created_at).toLocaleString() 
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
