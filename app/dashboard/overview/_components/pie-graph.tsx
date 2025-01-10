'use client';

import * as React from 'react';
import { TrendingUp } from 'lucide-react';
import { Label, Pie, PieChart } from 'recharts';
import { supabase } from '@/lib/client'; 

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

const chartConfig = {
  users: {
    label: 'Users'
  },
  optIn: {
    label: 'Opt-in',
    color: 'hsl(var(--chart-1))' 
  },
  optOut: {
    label: 'Opt-out',
    color: 'hsl(var(--chart-2))'
  }
} satisfies ChartConfig;

export function ConsentPieGraph() {
  const [agreements, setAgreements] = React.useState<any[]>([]); 
  const [selectedAgreement, setSelectedAgreement] = React.useState<string | null>(null); 
  const [chartData, setChartData] = React.useState([
    { consentType: 'Opt-in', users: 0, fill: 'hsl(var(--chart-1))' },  
    { consentType: 'Opt-out', users: 0, fill: 'hsl(var(--chart-2))' } 
  ]);

  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.users, 0);
  }, [chartData]);

  React.useEffect(() => {
    const fetchAgreements = async () => {
      const { data, error } = await supabase
        .from('Agreement') 
        .select('agreement_id, agreement_name') 
        .order('agreement_name', { ascending: true });

      if (error) {
        console.error('Error fetching agreements:', error);
        return;
      }

      setAgreements(data || []);
    };

    fetchAgreements();
  }, []);

  // Fetch consent data for the selected agreement
  React.useEffect(() => {
    if (!selectedAgreement) return;

    const fetchConsentData = async () => {
      const { data, error } = await supabase
        .from('Consent_Record')
        .select('consent_status')
        .eq('agreement_id', selectedAgreement);

      if (error) {
        console.error('Error fetching consent data:', error);
        return;
      }

      const consentCounts = {
        'Opt-in': 0,
        'Opt-out': 0
      };

      data?.forEach((consent: any) => {
        consentCounts[consent.consent_status] += 1;
      });

      setChartData([
        { consentType: 'Opt-in', users: consentCounts['Opt-in'], fill: 'hsl(var(--chart-1))' },
        { consentType: 'Opt-out', users: consentCounts['Opt-out'], fill: 'hsl(var(--chart-2))' }
      ]);
    };

    fetchConsentData();
  }, [selectedAgreement]);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Consent Agreement Chart</CardTitle>
        <CardDescription>Track user consent responses for a selected agreement</CardDescription>
      </CardHeader>

      {/* Agreement Dropdown */}
      <CardContent className="pb-0">
        <div className="mb-4 flex justify-center items-center">
          {/* <label htmlFor="agreement" className="block text-sm font-medium text-gray-700">
            Select an Agreement
          </label> */}
          {agreements.length === 0 ? (
            <p className="text-sm text-gray-500">Loading agreements...</p>
          ) : (
            <select
              id="agreement"
              name="agreement"
              value={selectedAgreement || ''}
              onChange={(e) => setSelectedAgreement(e.target.value)}
              className="flex h-9 w-[50&] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option
                value=""
                className="text-gray-500"
              >
                Select an Agreement
              </option>
              {agreements.map((agreement) => (
                <option
                  key={agreement.agreement_id}
                  value={agreement.agreement_id}
                  className="bg-transparent text-black"
                >
                  {agreement.agreement_name}
                </option>
              ))}
            </select>
          )}
        </div>
      </CardContent>

      {/* Pie Chart */}
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[360px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="consentType"
              innerRadius={60}
              strokeWidth={5}
              opacity={0.5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Users
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing consent status for the selected agreement
        </div>
      </CardFooter>
    </Card>
  );
}
