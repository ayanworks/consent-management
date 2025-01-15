'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Policy } from '@/constants/data';
import { Edit, MoreHorizontal, View } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface CellActionProps {
  data: Policy;
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
          onClick={() => router.push(`/dashboard/policies/view?policy_id=${data.policy_id}`)}
        >
          <View className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/dashboard/policies/update?policy_id=${data.policy_id}`)}
        >
          <Edit className="mr-2 h-4 w-4" /> Update
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
