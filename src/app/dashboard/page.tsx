'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const chartData = [
  { month: 'January', health: 85 },
  { month: 'February', health: 88 },
  { month: 'March', health: 80 },
  { month: 'April', health: 92 },
  { month: 'May', health: 95 },
  { month: 'June', health: 98 },
];

const chartConfig = {
  health: {
    label: 'Health Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

function HealthHistoryChart() {
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis domain={[0, 100]} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Bar dataKey="health" fill="var(--color-health)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}

function PlantGallery() {
  const { user, firestore } = useFirebase();

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/plantAnalyses`), orderBy('analysisDate', 'desc'));
  }, [user, firestore]);

  const { data: pastAnalyses, isLoading } = useCollection(analysesQuery);

  if (isLoading) {
    return <p>Loading analyses...</p>;
  }

  if (!pastAnalyses || pastAnalyses.length === 0) {
    return (
       <Alert>
        <AlertTitle className="font-headline">No Analyses Yet</AlertTitle>
        <AlertDescription>
          You haven't saved any plant analyses. Go to the AI Analysis page to get started!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {pastAnalyses.map((analysis) => (
        <Card key={analysis.id} className="overflow-hidden group">
          <CardContent className="p-0">
            <div className="overflow-hidden">
               <Image
                src={analysis.plantImageURI}
                alt={analysis.plantName}
                width={400}
                height={300}
                className="object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <Badge variant={analysis.identifiedDiseases[0] === 'Healthy' ? 'secondary' : 'destructive'}>{analysis.identifiedDiseases[0]}</Badge>
            <h3 className="font-semibold mt-2 font-headline">{analysis.plantName}</h3>
            <p className="text-sm text-muted-foreground">{new Date(analysis.analysisDate).toLocaleDateString()}</p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <LayoutDashboard className="size-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl">Health Tracker</h1>
          <p className="text-muted-foreground">Monitor your plants' progress and review past analyses.</p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Plant Health Over Time</CardTitle>
          <CardDescription>Visual representation of a sample plant's health progress.</CardDescription>
        </CardHeader>
        <CardContent>
          <HealthHistoryChart />
        </CardContent>
      </Card>
      <div>
        <h2 className="font-headline text-2xl mb-4">Analysis History</h2>
        <PlantGallery />
      </div>
    </div>
  );
}
