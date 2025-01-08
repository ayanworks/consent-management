'use client';
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/lib/client';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; 

const formSchema = z.object({
  policy_name: z.string().min(1, { message: 'Policy name is required.' }),
  policy_description: z.string().min(1, { message: 'Description is required.' }),
  version: z.string(),
  jurisdiction: z.string().min(1, { message: 'Jurisdiction is required.' }),
  industrySector: z.string().min(1, { message: 'Industry sector is required.' }),
});

interface Policy {
  policy_id: string;
  policy_name: string;
  policy_description: string;
  version: string;
  jurisdiction: string;
  industrySector: string;
  created_at: string;
  updated_at?: string;
}

interface PolicyFormProps {
  initialData?: Policy; 
  onClose?: () => void;
}

export default function PolicyForm({ initialData, onClose }: PolicyFormProps) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      policy_name: initialData?.policy_name || '',
      policy_description: initialData?.policy_description || '',
      version: initialData?.version || '1.0',
      jurisdiction: initialData?.jurisdiction || '',
      industrySector: initialData?.industrySector || '',
    },
  });

  const handleAddOrUpdatePolicy = async (values: z.infer<typeof formSchema>) => {
    try {
      const newPolicy = {
        policy_id: isEditMode ? initialData?.policy_id : uuidv4(),
        ...values,
        created_at: initialData?.created_at || new Date().toISOString(),
        updated_at: isEditMode ? new Date().toISOString() : null,
        version: isEditMode
          ? (parseFloat(initialData!.version) + 0.1).toFixed(1)
          : '1.0',
      };

      const { error } = await supabase.from('Policy').upsert(newPolicy, {
        onConflict: 'policy_id',
      });

      if (error) {
        console.error('Error saving policy:', error.message);
        toast.error('Failed to save the policy. Please try again.');
      } else {
        toast.success(isEditMode ? 'Policy updated successfully!' : 'Policy added successfully!');
        form.reset();
        onClose?.();
        router.push('/dashboard/policies');
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      toast.error('Unexpected error occurred while saving the policy.');
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleAddOrUpdatePolicy(values);
  };

  return (
    <div className="min-h-screen">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {isEditMode ? 'Edit Policy' : 'Add Policy'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="policy_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter policy name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policy_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jurisdiction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jurisdiction</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter jurisdiction" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="industrySector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Industry Sector</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter industry sector" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button type="submit">
                  {isEditMode ? 'Update Policy' : 'Add Policy'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/dashboard/policies')}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
