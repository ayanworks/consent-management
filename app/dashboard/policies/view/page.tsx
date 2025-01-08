'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/client';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Policy {
  policy_id: string;
  policy_name: string;
  policy_description: string;
  version: string;
  jurisdiction: string;
  industrySector: string;
  created_at: string;
  updated_at: string;
}

const PolicyView: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const policyId = searchParams.get('policy_id');
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      if (policyId) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('Policy')
            .select('*')
            .eq('policy_id', policyId)
            .single();

          if (error) throw error;
          setPolicy(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch policy details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPolicy();
  }, [policyId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading policy details...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-red-600 dark:text-red-400">Error: {error}</p>
      </div>
    );

  return (
    <div className="max-h-screen dark:bg-[#06040B] p-5 flex justify-center items-center overflow-y-auto">
    <div className="w-full min-h-screen overflow-y-auto">
      <Card className="overflow-y-auto h-full">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold text-gray-900 dark:text-gray-200">
            Policy Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          {policy ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Policy ID:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {policy.policy_id}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Policy Name:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {policy.policy_name}
                </p>
              </div>
              <div className="flex justify-between items-start gap-28">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Policy Description:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {policy.policy_description}
                </p>
              </div>
              <div className="flex justify-between items-center gap-20">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Policy Version:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {policy.version}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Jurisdiction:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {policy.jurisdiction}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Industry Sector:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {policy.industrySector}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-gray-700 dark:text-gray-400 font-semibold">
                  Created At:
                </p>
                <p className="text-gray-900 dark:text-gray-200">
                  {new Date(policy.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Policy not found.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => router.push('/dashboard/policies')}
            className="ml-auto"
          >
            Back to Policies
          </Button>
        </CardFooter>
      </Card>
    </div>
  </div>
  );
};

export default PolicyView;
