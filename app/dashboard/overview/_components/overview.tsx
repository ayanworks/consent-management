'use client'

import { AreaGraph } from './area-graph';
import { BarGraph } from './bar-graph';
import { PieGraph } from './pie-graph';
import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from '@/components/layout/page-container';
import { RecentSales } from './recent-sales';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/client';

export default function OverViewPage() {

  const [totalPolicies, setTotalPolicies] = useState<number>(0);
  const [totalAgreements, setTotalAgreements] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalConsents, setTotalConsents] = useState<number>(0);
  const [totalAudits, setTotalAudits] = useState<number>(0);

  useEffect(() => {
    const fetchTotalPolicies = async () => {
      const { data, error } = await supabase
        .from('Policy')
        .select('policy_id', { count: 'exact' });
      
      if (error) {
        console.error('Error fetching policies:', error.message);
        return;
      }
      
      setTotalPolicies(data?.length || 0); 
    };

    fetchTotalPolicies();
  }, []); 

  useEffect(() => {
    const fetchTotalAgreements = async () => {
      const { data, error } = await supabase
        .from('Agreement')
        .select('agreement_id', { count: 'exact' });
      
      if (error) {
        console.error('Error fetching policies:', error.message);
        return;
      }
      
      setTotalAgreements(data?.length || 0); 
    };

    fetchTotalAgreements();
  }, []); 

  useEffect(() => {
    const fetchTotalUsers = async () => {
      const { count, error } = await supabase
        .from('User') 
        .select('*', { count: 'exact' });  
      console.log("🚀 ~ fetchTotalUsers ~ count:", count)

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setTotalUsers(count || 0); 
    };

    fetchTotalUsers();
  }, []); 

  useEffect(() => {
    const fetchTotalConsents = async () => {
      const { count, error } = await supabase
        .from('Consent_Record') 
        .select('*', { count: 'exact' });  
      console.log("🚀 ~ fetchTotalConsents ~ count:", count)

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setTotalConsents(count || 0); 
    };

    fetchTotalConsents();
  }, []); 

  useEffect(() => {
    const fetchTotalAudits = async () => {
      const { count, error } = await supabase
        .from('audit_log') 
        .select('*', { count: 'exact' });  
      console.log("🚀 ~ fetchTotalAudits ~ count:", count)

      if (error) {
        console.error('Error fetching users:', error.message);
        return;
      }

      setTotalAudits(count || 0); 
    };

    fetchTotalAudits();
  }, []); 

  return (
    <PageContainer scrollable>
      <div className="space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, Welcome back 👋
          </h2>
          {/* <div className="hidden items-center space-x-2 md:flex">
            <CalendarDateRangePicker />
            <Button>Download</Button>
          </div> */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg> */}
                  <img width="30" height="30" src="https://img.icons8.com/ios/50/privacy-policy.png" alt="privacy-policy"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalPolicies}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of policies
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg> */}
                  <img width="30" height="30" src="https://img.icons8.com/ios/50/agreement.png" alt="agreement"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAgreements}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of agreements
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg> */}
                  <img width="30" height="30" src="https://img.icons8.com/ios-glyphs/30/group.png" alt="group"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of users
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Consents</CardTitle>
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg> */}
                  <img width="35" height="35" src="https://img.icons8.com/external-outline-wichaiwi/64/1A1A1A/external-consent-general-data-protection-regulation-gdpr-outline-wichaiwi.png" alt="external-consent-general-data-protection-regulation-gdpr-outline-wichaiwi"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalConsents}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of consents
                  </p>
                </CardContent>
              </Card>
              {/* <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Audit Records</CardTitle> */}
                  {/* <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg> */}
                  {/* <img width="30" height="30" src="https://img.icons8.com/ios/50/1A1A1A/accounting.png" alt="accounting"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalAudits}</div>
                  <p className="text-xs text-muted-foreground">
                    Total number of audit records
                  </p>
                </CardContent>
              </Card> */}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                {/* <PieGraph /> */}
              </div>
              {/* <Card className="col-span-4 md:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card> */}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
