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
import PolicyTable from './consent-tables';
import { supabase } from '@/lib/client';

type TPoliciesListingPage = {};

export default async function ConsentListingPage({}: TPoliciesListingPage) {
  
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



  const fetchPolicies = async (
    page: number,
    pageLimit: number,
    search?: string
  ) => {
    try {
      let query = supabase
        .from('Consent_Record')
        .select('*, User(name)', { count: 'exact' }); 
  
      const offset = (page - 1) * pageLimit;
      query = query.range(offset, offset + pageLimit - 1);
  
      if (search) {
        query = query.ilike('consent_id', `%${search}%`);
      }
  
      const { data, count, error } = await query;
      console.log("🚀 ~ ConsentListingPage ~ data:", data)
  
      if (error) {
        console.error('Error fetching data:', error.message);
        return { data: [], totalCount: 0 };
      }
  
      return { data, totalCount: count };
    } catch (error) {
      console.error('Unexpected error:', error);
      return { data: [], totalCount: 0 };
    }
  };
  

  
  // Example usage of the fetchPolicies function
  const { data, totalCount } = await fetchPolicies(filters.page, filters.limit, filters.search);
  
  
  return (
    <PageContainer scrollable>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Heading
            title={`Consent Records (${totalCount})`}
            description="Manage consents (Client-side fetching with React hooks.)"
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
