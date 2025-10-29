'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { History, LineChart as LineChartIcon, Leaf } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, Line, Tooltip } from "recharts";
import { useMemo } from "react";

const chartConfig = {
  health: {
    label: "Health Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;


function HealthChart({ analyses }: { analyses: any[] }) {
  const chartData = useMemo(() => {
    return analyses
      .map(analysis => ({
        date: new Date(analysis.analysisDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        health: analysis.identifiedDiseases[0] === 'Healthy' ? 100 : 25,
        plantName: analysis.plantName,
        diagnosis: analysis.identifiedDiseases[0],
      }))
      .reverse(); // reverse to show oldest to newest
  }, [analyses]);

  if (chartData.length < 2) {
    return (
      <Alert>
         <Leaf className="h-4 w-4" />
        <AlertTitle>Not Enough Data for a Chart</AlertTitle>
        <AlertDescription>
          Save at least two analyses to see a health trend chart for your plants.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <LineChartIcon className="size-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-3xl">Health Trend</CardTitle>
            <CardDescription>Visualizing your plant's health over time.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
            />
            <Tooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="line"
                formatter={(value, name, item) => (
                  <div className="space-y-1">
                    <p className="font-bold">{item.payload.plantName}</p>
                    <p>Health: {item.payload.diagnosis}</p>
                    <p className="text-muted-foreground text-xs">{item.payload.date}</p>
                  </div>
                )}
                hideLabel
              />}
            />
            <Line
              dataKey="health"
              type="monotone"
              stroke="var(--color-health)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function PlantGallery() {
  const { user, firestore } = useFirebase();

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, `users/${user.uid}/plantAnalyses`), orderBy('analysisDate', 'desc'));
  }, [user, firestore]);

  const { data: pastAnalyses, isLoading } = useCollection(analysesQuery);

  if (isLoading) {
    return <p>Loading history...</p>;
  }

  if (!pastAnalyses || pastAnalyses.length === 0) {
    return (
       <Alert>
        <AlertTitle className="font-headline">No History Yet</AlertTitle>
        <AlertDescription>
          You haven't saved any plant analyses. Go to the AI Analysis page to get started!
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-8">
      <HealthChart analyses={pastAnalyses} />
      <div>
        <h2 className="font-headline text-2xl mb-4">Analysis History</h2>
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
      </div>
    </div>
  );
}

export default function HistoryPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <History className="size-8 text-primary" />
        <div>
          <h1 className="font-headline text-3xl">My History</h1>
          <p className="text-muted-foreground">Review your saved plant analyses.</p>
        </div>
      </div>
      <PlantGallery />
    </div>
  );
}
