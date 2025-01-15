'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner'; 

export default function UpdatePolicy() {
  const [formData, setFormData] = useState({
    policy_name: '',
    policy_description: '',
    jurisdiction: '',
    industrySector: '',
    shareData: false,
    version: '1.0'
  });

  const searchParams = useSearchParams();
  const policy_id = searchParams.get('policy_id');
  const router = useRouter();

  useEffect(() => {
    if (policy_id) fetchPolicy(policy_id);
  }, [policy_id]);

  const fetchPolicy = async (id: string) => {
    const { data, error } = await supabase
      .from('Policy')
      .select('*')
      .eq('policy_id', id)
      .single();

    if (data) {
      setFormData({
        policy_name: data.policy_name,
        policy_description: data.policy_description,
        jurisdiction: data.jurisdiction,
        industrySector: data.industrySector,
        shareData: data.shareData || false, 
        version: data.version || '1.0',
      });
    }

    if (error) console.error('Error fetching policy:', error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, shareData: e.target.checked });
  };

  const handleUpdatePolicy = async () => {
    try {
      // Increment version by 0.1 for each update
      const newVersion = `${parseFloat(formData.version) + 0.1}`;

      const updatedPolicy = {
        policy_id: uuidv4(), 
        ...formData,
        version: newVersion,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('Policy')
        .upsert(updatedPolicy, { onConflict: 'policy_id' });

      if (error) {
        console.error('Error updating policy:', error.message);
        toast.error('Failed to update the policy. Please try again.');
      } else {
        toast.success('Policy updated successfully!');
        router.push('/dashboard/policies');  
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred while updating the policy.');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <Card className="mx-auto">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">Edit Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdatePolicy();
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium">Policy Name</label>
                <Input
                  name="policy_name"
                  value={formData.policy_name}
                  onChange={handleInputChange}
                  placeholder="Enter policy name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Description</label>
                <Textarea
                  name="policy_description"
                  value={formData.policy_description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Jurisdiction</label>
                <Input
                  name="jurisdiction"
                  value={formData.jurisdiction}
                  onChange={handleInputChange}
                  placeholder="Enter jurisdiction"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Industry Sector</label>
                <Input
                  name="industrySector"
                  value={formData.industrySector}
                  onChange={handleInputChange}
                  placeholder="Enter industry sector"
                />
              </div>

              {/* Add Checkbox for shareData */}
              <div className="col-span-2">
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="shareData" 
                    checked={formData.shareData} 
                    onChange={handleCheckboxChange}
                    className="h-4 w-4"
                  />
                  <span>Share data with third-party resources</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button type="submit">Update Policy</Button>
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
        </CardContent>
      </Card>
    </div>
  );
}
