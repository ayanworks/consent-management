// 'use client';

// import { useRouter, useSearchParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';
// import { supabase } from '@/lib/client';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';

// export default function UpdateAgreement() {
//   const [formData, setFormData] = useState({
//     agreement_name: '',
//     policy_id: '',
//     purpose: '',
//     purpose_description: '',
//     version: '1.0',
//     is_active: true,
//   });
//   const searchParams = useSearchParams();
//   const agreement_id = searchParams.get('agreement_id');
//   const router = useRouter();

//   useEffect(() => {
//     if (agreement_id) fetchAgreement(agreement_id);
//   }, [agreement_id]);

//   const fetchAgreement = async (id: string) => {
//     const { data, error } = await supabase
//       .from('Agreement')
//       .select('*')
//       .eq('agreement_id', id)
//       .single();

//     if (data) {
//       setFormData({
//         agreement_name: data.agreement_name,
//         policy_id: data.policy_id,
//         purpose: data.purpose,
//         purpose_description: data.purpose_description,
//         version: data.version || '1.0', 
//         is_active: data.is_active,
//       });
//     }

//     if (error) console.error('Error fetching agreement:', error);
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === 'checkbox' ? checked : value,
//     });
//   };

//   const handleUpdateAgreement = async () => {
//     try {
//       const newVersion = (parseFloat(formData.version) + 0.1).toFixed(1); 
//       const updatedAgreement = {
//         agreement_id: uuidv4(),
//         ...formData,
//         version: newVersion,
//         updated_at: new Date().toISOString(),
//       };

//       const { data, error } = await supabase
//         .from('Agreement')
//         .upsert(updatedAgreement, { onConflict: 'agreement_id' });

//       if (error) {
//         console.error('Error updating agreement:', error.message);
//       } else {
//         router.push('/dashboard/agreement');
//       }
//     } catch (error) {
//       console.error('Unexpected error:', error);
//     }
//   };

//   return (
//     <div className='min-h-screen'>
//       <Card className="max-w-4xl mx-auto">
//         <CardHeader>
//           <CardTitle className="text-left text-2xl font-bold">Edit Agreement</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               handleUpdateAgreement();
//             }}
//             className="space-y-6"
//           >
//             <div>
//               <label className="block text-sm font-medium">Agreement Name</label>
//               <Input
//                 name="agreement_name"
//                 value={formData.agreement_name}
//                 onChange={handleInputChange}
//                 placeholder="Enter agreement name"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Policy ID</label>
//               <Input
//                 name="policy_id"
//                 value={formData.policy_id}
//                 onChange={handleInputChange}
//                 placeholder="Enter associated policy ID"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Purpose</label>
//               <Input
//                 name="purpose"
//                 value={formData.purpose}
//                 onChange={handleInputChange}
//                 placeholder="Enter purpose"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Purpose Description</label>
//               <Input
//                 name="purpose_description"
//                 value={formData.purpose_description}
//                 onChange={handleInputChange}
//                 placeholder="Enter purpose description"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium">Active</label>
//               <input
//                 type="checkbox"
//                 name="is_active"
//                 checked={formData.is_active}
//                 onChange={handleInputChange}
//                 className="h-4 w-4"
//               />
//             </div>
//             <Button type="submit">Update Agreement</Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function UpdateAgreement() {
  const [formData, setFormData] = useState({
    agreement_name: '',
    policy_id: '',
    purpose: '',
    purpose_description: '',
    version: '1.0',
    is_active: true,
    data_attributes: [{ name: '', description: '' }],
  });
  const searchParams = useSearchParams();
  const agreement_id = searchParams.get('agreement_id');
  const router = useRouter();

  useEffect(() => {
    if (agreement_id) fetchAgreement(agreement_id);
  }, [agreement_id]);

  const fetchAgreement = async (id: string) => {
    const { data, error } = await supabase
      .from('Agreement')
      .select('*')
      .eq('agreement_id', id)
      .single();

    if (data) {
      setFormData({
        agreement_name: data.agreement_name,
        policy_id: data.policy_id,
        purpose: data.purpose,
        purpose_description: data.purpose_description,
        version: data.version || '1.0',
        is_active: data.is_active,
        data_attributes: data.data_attributes || [{ name: '', description: '' }],
      });
    }

    if (error) console.error('Error fetching agreement:', error);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleDataAttributeChange = (index: number, field: string, value: string) => {
    const updatedAttributes = [...formData.data_attributes];
    updatedAttributes[index][field] = value;
    setFormData({
      ...formData,
      data_attributes: updatedAttributes,
    });
  };

  const addDataAttribute = () => {
    setFormData({
      ...formData,
      data_attributes: [...formData.data_attributes, { name: '', description: '' }],
    });
  };

  const removeDataAttribute = (index: number) => {
    const updatedAttributes = formData.data_attributes.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      data_attributes: updatedAttributes,
    });
  };

  const handleUpdateAgreement = async () => {
    try {
      const newVersion = (parseFloat(formData.version) + 0.1).toFixed(1);
      const updatedAgreement = {
        agreement_id: uuidv4(),
        ...formData,
        version: newVersion,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('Agreement')
        .upsert(updatedAgreement, { onConflict: 'agreement_id' });

      if (error) {
        console.error('Error updating agreement:', error.message);
      } else {
        router.push('/dashboard/agreement');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Card className="max-w-4xl mx-auto h-[86vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-left text-2xl font-bold">Edit Agreement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[80vh]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateAgreement();
              }}
              className="space-y-6"
            >
              {/* Two-column grid for Agreement Name, Policy ID, Purpose, and Purpose Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium">Agreement Name</label>
                  <Input
                    name="agreement_name"
                    value={formData.agreement_name}
                    onChange={handleInputChange}
                    placeholder="Enter agreement name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Policy ID</label>
                  <Input
                    name="policy_id"
                    value={formData.policy_id}
                    onChange={handleInputChange}
                    placeholder="Enter associated policy ID"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Purpose</label>
                  <Input
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Enter purpose"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Purpose Description</label>
                  <Textarea
                    name="purpose_description"
                    value={formData.purpose_description}
                    onChange={handleInputChange}
                    placeholder="Enter purpose description"
                  />
                </div>
              </div>

              {/* Active Checkbox */}
              <div>
                <label className="block text-sm font-medium">Active</label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="h-4 w-4"
                />
              </div>

              {/* Data Attributes Section */}
              <div>
                <label className="block text-sm font-medium">Data Attributes</label>
                {formData.data_attributes.map((attr, index) => (
                  <div key={index} className="flex space-x-2 mt-2">
                    <Input
                      placeholder="Attribute Name"
                      value={attr.name}
                      onChange={(e) => handleDataAttributeChange(index, 'name', e.target.value)}
                    />
                    <Input
                      placeholder="Attribute Description"
                      value={attr.description}
                      onChange={(e) => handleDataAttributeChange(index, 'description', e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeDataAttribute(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addDataAttribute} className="mt-2">
                  Add Data Attribute
                </Button>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button type="submit">
                  Update Agreement
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
