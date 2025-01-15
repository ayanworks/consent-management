'use client';

import React, { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { supabase } from '@/lib/client';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Validation schema for the consent form
const formSchema = z.object({
  user_id: z.string().min(1, { message: 'User ID is required.' }),
  agreement_id: z.string().min(1, { message: 'Agreement ID is required.' }),
  consent_status: z.enum(['Opt-in', 'Opt-out'], { message: 'Consent status is required.' }),
});

interface ConsentFormProps {
  initialData?: z.infer<typeof formSchema> & { consent_id?: string; created_at?: string; updated_at?: string };
  onClose?: () => void;
}

export default function ConsentForm({ initialData, onClose }: ConsentFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userOptions, setUserOptions] = useState<any[]>([]);
  const [agreementOptions, setAgreementOptions] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_id: initialData?.user_id || '',
      agreement_id: initialData?.agreement_id || '',
      consent_status: initialData?.consent_status || 'Opt-in',
    },
  });

  useEffect(() => {
    const fetchUsersAndAgreements = async () => {
      try {
        // Fetch Users
        const { data: users, error: userError } = await supabase.from('User').select('user_id, name');
        if (userError) throw new Error(userError.message);
        setUserOptions(users || []);

        // Fetch Agreements
        const { data: agreements, error: agreementError } = await supabase.from('Agreement').select('agreement_id, agreement_name');
        if (agreementError) throw new Error(agreementError.message);
        setAgreementOptions(agreements || []);
      } catch (err) {
        setError('Error fetching users or agreements');
        console.error(err);
      }
    };

    fetchUsersAndAgreements();
  }, []);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Insert new consent record
      const { error } = await supabase.from('Consent_Record').insert([
        {
          user_id: values.user_id,
          agreement_id: values.agreement_id,
          consent_status: values.consent_status,
        },
      ]);

      if (error) {
        throw new Error('Error inserting consent');
      } else {
        setSuccess('Consent added successfully');
      }

      // Reset form and close
      form.reset();
      onClose?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">Add Consent</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* User ID Field */}
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                        <option value="">Select User</option>
                        {userOptions.map((user) => (
                          <option key={user.user_id} value={user.user_id}>
                            {user.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Agreement ID Field */}
              <FormField
                control={form.control}
                name="agreement_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agreement</FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                        <option value="">Select Agreement</option>
                        {agreementOptions.map((agreement) => (
                          <option key={agreement.agreement_id} value={agreement.agreement_id}>
                            {agreement.agreement_name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Consent Status Field */}
              <FormField
                control={form.control}
                name="consent_status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Consent Status</FormLabel>
                    <FormControl>
                      <select {...field} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm">
                        <option value="Opt-in">Opt-in</option>
                        <option value="Opt-out">Opt-out</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Add Consent'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                  className="ml-2"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>

          {/* Display success or error messages */}
          {success && <div className="text-green-500 mt-4">{success}</div>}
          {error && <div className="text-red-500 mt-4">{error}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
