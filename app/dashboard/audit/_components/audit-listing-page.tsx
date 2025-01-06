// "use client"

// import { useEffect, useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { buttonVariants } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Policy } from '@/constants/data';
import { searchParamsCache } from '@/lib/searchparams';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import PolicyTable from './audit-tables';
import { supabase } from '@/lib/client';

type TPoliciesListingPage = {};

export default async function AuditListingPage({}: TPoliciesListingPage) {
  
  // Get query parameters from searchParamsCache
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('q');
  const pageLimit = searchParamsCache.get('limit');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search })
  };

  // const fetchPolicies = async (
  //   page: number,
  //   pageLimit: number,
  //   search?: string
  // ) => {
  //   try {
  //     let query = supabase.from('Consent_Record').select('*', { count: 'exact' });
  //     const offset = (page - 1) * pageLimit;
  //     query = query.range(offset, offset + pageLimit - 1);
  
  //     if (search) {
  //       query = query.ilike('consent_id', `%${search}%`);
  //     }
  //     const { data, count, error } = await query;
  //     if (error) {
  //       console.error('Error fetching data:', error.message);
  //       return { data: [], totalCount: 0 };
  //     }
  //     return { data, totalCount: count };
  //   } catch (error) {
  //     console.error('Unexpected error:', error);
  //     return { data: [], totalCount: 0 };
  //   }
  // };



  const fetchUserEmail = async (
    page: number,
    pageLimit: number,
    search?: string
  ) => {
    try {
      // Step 1: Fetch entity_id from audit_log
      let query = supabase
        .from('audit_log')
        .select('*, entity_id, log_id', { count: 'exact' });
  
      const offset = (page - 1) * pageLimit;
      query = query.range(offset, offset + pageLimit - 1);
  
      if (search) {
        query = query.ilike('log_id', `%${search}%`);
      }
  
      const { data, count, error } = await query;
      console.log("🚀 ~ UserListingPage ~ data:", data);
  
      if (error) {
        console.error('Error fetching data:', error.message);
        return { data: [], totalCount: 0 };
      }
  
      const usersWithEmails = await Promise.all(data.map(async (item) => {
        // Fetch user_id from consent table using entity_id as consent_id
        const { data: consentData, error: consentError } = await supabase
          .from('Consent_Record')
          .select('user_id')
          .eq('consent_id', item.entity_id)
          .single();
  
        if (consentError) {
          console.error('Error fetching user_id:', consentError.message);
          return null; 
        }
  
        // Fetch email from users table using user_id
        const { data: userData, error: userError } = await supabase
          .from('User')
          .select('email')
          .eq('user_id', consentData.user_id)
          .single();
  
        if (userError) {
          console.error('Error fetching email:', userError.message);
          return null; 
        }
  
        return {
          ...item,
          email: userData?.email || 'No email found'
        };
      }));
  
      // Step 3: Return the data
      return { data: usersWithEmails.filter(Boolean), totalCount: count };
  
    } catch (error) {
      console.error('Unexpected error:', error);
      return { data: [], totalCount: 0 };
    }
  };
  
  

  
  // Example usage of the fetchPolicies function
  const { data, totalCount } = await fetchUserEmail(filters.page, filters.limit, filters.search);
  console.log("🚀 ~ AuditListingPage ~ data:", data)
  
  
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Audits (${totalCount})`}
            description="Manage audits"
          />

          {/* <Link
            href={'/dashboard/agreement/new'}
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Link> */}
        </div>
        <Separator />
        {/* Show loading spinner or skeleton loader if loading */}
        <PolicyTable data={data} totalData={totalCount??0} />
      </div>
    </PageContainer>
  );
}
