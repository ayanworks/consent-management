'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Agreement } from '@/constants/data'; // Assuming you have the `Agreement` type defined in your constants
import { Edit, MoreHorizontal, View } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: Agreement; // Change the type to Agreement
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/agreement/view?agreement_id=${data.agreement_id}`)} // Update route for agreements
        >
          <View className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/agreement/update?agreement_id=${data.agreement_id}`)} // Update route for agreements
        >
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
