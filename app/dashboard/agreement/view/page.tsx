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

interface Agreement {
  agreement_id: string;
  agreement_name: string;
  policy_id: string;
  purpose: string;
  purpose_description: string;
  data_attributes: Array<{ [key: string]: any }>;
  version: string;
  is_active: boolean;
  created_at: string;
}

const AgreementView: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const agreementId = searchParams.get('agreement_id');
  const [agreement, setAgreement] = useState<Agreement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgreement = async () => {
      if (agreementId) {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('Agreement')
            .select('*')
            .eq('agreement_id', agreementId)
            .single();

          if (error) throw error;
          setAgreement(data);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch agreement details');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAgreement();
  }, [agreementId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Loading agreement details...
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
    <div className="max-h-screen dark:bg-[#06040B] p-6 flex justify-center items-center overflow-y-auto">
      <div className="w-full min-h-screen overflow-y-auto">
        <Card className="overflow-y-auto h-full">
          <CardHeader>
            <CardTitle className="text-left text-2xl font-bold text-gray-900 dark:text-gray-200">
              Agreement Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {agreement ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Agreement ID:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.agreement_id}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Agreement Name:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.agreement_name}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Policy ID:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.policy_id}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Purpose:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.purpose}
                  </p>
                </div>
                <div className="flex justify-between items-start gap-20">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Purpose Description:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.purpose_description}
                  </p>
                </div>
                <div className="flex justify-between items-start">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Attributes:
                  </p>
                  <div className="text-gray-900 dark:text-gray-200 text-left w-full overflow-x-auto mr-auto flex justify-end items-end">
                    {Array.isArray(agreement.data_attributes) ? (
                      <table className="min-w-[50px] table-auto">
                        <tbody>
                          {agreement.data_attributes.map((attribute, index) => (
                            <tr key={index}>
                              {Object.entries(attribute).map(([key, value]) => (
                                <td key={key} className="px-4 py-2 border-b">
                                  <span className="font-semibold">{key}:</span> {String(value)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>Invalid data</p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Version:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.version}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Active Status:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {agreement.is_active ? "Active" : "Inactive"}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-gray-700 dark:text-gray-400 font-semibold">
                    Created At:
                  </p>
                  <p className="text-gray-900 dark:text-gray-200">
                    {new Date(agreement.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Agreement not found.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={() => router.push('/dashboard/agreement')}
              className="ml-auto"
            >
              Back to Agreements
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AgreementView;
