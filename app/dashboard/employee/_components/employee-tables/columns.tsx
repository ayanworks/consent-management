'use client';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'first_name',
    header: 'NAME'
  },
  {
    accessorKey: 'country',
    header: 'COUNTRY'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL'
  },
  {
    accessorKey: 'job',
    header: 'COMPANY'
  },
  {
    accessorKey: 'gender',
    header: 'GENDER'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
