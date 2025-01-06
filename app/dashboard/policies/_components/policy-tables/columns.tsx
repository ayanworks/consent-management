'use client';
import { Policy } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Policy>[] = [
  {
    accessorKey: 'policy_name',
    header: 'POLICY NAME	'
  },
  {
    accessorKey: 'policy_description',
    header: 'DESCRIPTION'
  },
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
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
