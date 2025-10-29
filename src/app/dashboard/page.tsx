'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { LayoutDashboard } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';

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
  const pastAnalyses = [
    {
      plant: PlaceHolderImages[0],
      name: 'Echeveria',
      date: 'June 15, 2024',
      status: 'Healthy',
      statusVariant: 'secondary',
    },
    {
      plant: PlaceHolderImages[1],
      name: 'Monstera Deliciosa',
      date: 'June 12, 2024',
      status: 'Nutrient Deficiency',
      statusVariant: 'destructive',
    },
    {
      plant: PlaceHolderImages[2],
      name: 'Fiddle Leaf Fig',
      date: 'June 1, 2024',
      status: 'Healthy',
      statusVariant: 'secondary',
    },
    {
      plant: PlaceHolderImages[3],
      name: 'Snake Plant',
      date: 'May 28, 2024',
      status: 'Watering Issue',
      statusVariant: 'destructive',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {pastAnalyses.map((analysis) => (
        <Card key={analysis.plant.id} className="overflow-hidden group">
          <CardContent className="p-0">
            <div className="overflow-hidden">
               <Image
                src={analysis.plant.imageUrl}
                alt={analysis.plant.description}
                width={400}
                height={300}
                data-ai-hint={analysis.plant.imageHint}
                className="object-cover aspect-[4/3] transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start p-4">
            <Badge variant={analysis.statusVariant as any}>{analysis.status}</Badge>
            <h3 className="font-semibold mt-2 font-headline">{analysis.name}</h3>
            <p className="text-sm text-muted-foreground">{analysis.date}</p>
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
