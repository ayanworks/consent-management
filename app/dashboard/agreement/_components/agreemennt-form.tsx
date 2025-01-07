'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
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

const formSchema = z.object({
  agreement_name: z.string().min(1, { message: 'Agreement name is required.' }),
  policy_id: z.string().min(1, { message: 'Policy is required.' }),
  purpose: z.string().min(1, { message: 'Purpose is required.' }),
  purpose_description: z.string().min(1, { message: 'Description is required.' }),
  data_attributes: z.array(
    z.object({
      name: z.string().min(1, { message: 'Attribute name is required.' }),
      description: z.string().min(1, { message: 'Attribute description is required.' }),
    })
  ),
});

interface Policy {
  policy_id: string;
  policy_name: string;
}

interface AgreementFormProps {
  initialData?: z.infer<typeof formSchema> & { agreement_id?: string; created_at?: string; version?: string };
  onClose?: () => void;
}

export default function AgreementForm({ initialData, onClose }: AgreementFormProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      agreement_name: initialData?.agreement_name || '',
      policy_id: initialData?.policy_id || '',
      purpose: initialData?.purpose || '',
      purpose_description: initialData?.purpose_description || '',
      data_attributes: initialData?.data_attributes || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'data_attributes',
  });

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoadingPolicies(true);
      const { data, error } = await supabase.from('Policy').select('*');
      if (error) {
        console.error('Error fetching policies:', error.message);
      } else {
        setPolicies(data || []);
      }
      setLoadingPolicies(false);
    };

    fetchPolicies();
  }, []);

  const handleSaveAgreement = async (values: z.infer<typeof formSchema>) => {
    try {
      const agreementData = {
        agreement_id: initialData?.agreement_id || uuidv4(),
        ...values,
        is_active: initialData ? initialData.is_active : true, 
        version: initialData ? (parseFloat(initialData.version) + 0.1).toFixed(1) : '1.0', 
        created_at: initialData?.created_at || new Date().toISOString(),
        updated_at: initialData ? new Date().toISOString() : null,
      };

      const { error } = await supabase.from('Agreement').upsert(agreementData, {
        onConflict: 'agreement_id',
      });

      if (error) {
        console.error('Error saving agreement:', error.message);
      } else {
        form.reset();
        onClose?.();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    handleSaveAgreement(values);
  };

  return (
    <div className="min-h-screen">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">
            {initialData ? 'Edit Agreement' : 'Add Agreement'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Create a two-column grid for Agreement Name, Policy, Purpose, and Purpose Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="agreement_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agreement Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter agreement name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="policy_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" className="text-gray-500">
                            Select Policy
                          </option>
                          {loadingPolicies ? (
                            <option disabled className="text-gray-500">
                              Loading policies...
                            </option>
                          ) : (
                            policies.map((policy) => (
                              <option
                                key={policy.policy_id}
                                value={policy.policy_id}
                                className="text-gray-900 hover:bg-blue-100"
                              >
                                {policy.policy_name}
                              </option>
                            ))
                          )}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter purpose" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="purpose_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purpose Description</FormLabel>
                      <FormControl>
                        <textarea
                          placeholder="Enter purpose description"
                          className="w-full rounded-md border border-input bg-transparent p-3 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Data Attributes (kept as is) */}
              <FormItem>
                <FormLabel>Data Attributes</FormLabel>
                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="flex space-x-4">
                      <Input
                        placeholder="Attribute Name"
                        {...form.register(`data_attributes.${index}.name`)}
                        className="w-full"
                      />
                      <Input
                        placeholder="Attribute Description"
                        {...form.register(`data_attributes.${index}.description`)}
                        className="w-full"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={() => remove(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button type="button" onClick={() => append({ name: '', description: '' })} className="mt-2">
                  Add Data Attribute
                </Button>
              </FormItem>

              <div className="flex justify-end">
                <Button type="submit">
                  {initialData ? 'Update Agreement' : 'Add Agreement'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.push('/dashboard/agreement')}
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
