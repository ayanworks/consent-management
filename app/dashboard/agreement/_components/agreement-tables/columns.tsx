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
    header: 'DESCRIPTION'
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
    header: 'CREATED AT'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
