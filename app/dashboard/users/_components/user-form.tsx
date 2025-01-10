'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UserForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('User')  
        .select('email, user_id') 
        .eq('email', email);  

      if (fetchError) {
        throw new Error('Error fetching user data');
      }

      if (data.length > 0) {
        setError('User already exists with this email.');
      } else {
        const {data,  error: insertError } = await supabase
          .from('User')  
          .insert([{ email, name }]).select(); 
        console.log("🚀 ~ handleSubmit ~ data:", data)

        if (insertError) {
          throw new Error('Error inserting user');
        } else {
          setSuccess('User added successfully');
          setEmail('');
          setName('');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium">Name</label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium">Email</label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2"
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}
        {success && <div className="text-green-500">{success}</div>}
        <div className="flex justify-end mt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Add User'}
          </Button>
        </div>
      </form>
    </div>
  );
}
