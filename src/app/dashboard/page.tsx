'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { History, LineChart as LineChartIcon, Leaf, Award } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, Line, Tooltip } from "recharts";
import { useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const chartConfig = {
  health: {
    label: "Health Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

function GardenerProfileCard({ user, analysesCount }: { user: any, analysesCount: number }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary">
            <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
                {user.displayName ? user.displayName.charAt(0) : 'G'}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-3xl">{user.displayName || "Gardener"}</CardTitle>
            <CardDescription>Tracking {analysesCount} plants</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Award className="size-5 text-accent"/>
                    <span className="font-semibold">Gardener Rank</span>
                </div>
                <span className="font-bold text-primary">Plant Novice</span>
            </div>
            <Progress value={25} />
            <p className="text-xs text-muted-foreground text-center">250 XP to next rank</p>
        </div>
      </CardContent>
    </Card>
  )
}

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
      <Card className="h-full flex flex-col justify-center">
        <CardContent>
          <Alert>
            <Leaf className="h-4 w-4" />
            <AlertTitle>Not Enough Data for a Chart</AlertTitle>
            <AlertDescription>
              Save at least two analyses to see a health trend chart for your plants.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <LineChartIcon className="size-8 text-accent" />
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
              top: 10,
              left: 12,
              right: 12,
              bottom: 10
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

  if (!user || !pastAnalyses || pastAnalyses.length === 0) {
    return (
       <div className="col-span-full">
        <Alert>
          <AlertTitle className="font-headline">No History Yet</AlertTitle>
          <AlertDescription>
            You haven't saved any plant analyses. Go to the AI Analysis page to get started!
          </AlertDescription>
        </Alert>
       </div>
    )
  }

  return (
    <>
    <div className="col-span-1 md:col-span-2">
      <div className="grid grid-cols-1 gap-8">
        <GardenerProfileCard user={user} analysesCount={pastAnalyses.length} />
        <HealthChart analyses={pastAnalyses} />
      </div>
    </div>
    <div className="col-span-1 md:col-span-3">
        <h2 className="font-headline text-2xl mb-4">Analysis History</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pastAnalyses.map((analysis) => (
            <Link href={`/growth-tracker/${analysis.id}`} key={analysis.id}>
              <Card className="overflow-hidden group h-full shadow-md hover:shadow-xl transition-shadow duration-300">
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
                <CardFooter className="flex flex-col items-start p-4 bg-white">
                  <Badge variant={analysis.identifiedDiseases[0] === 'Healthy' ? 'secondary' : 'destructive'}>{analysis.identifiedDiseases[0]}</Badge>
                  <h3 className="font-semibold mt-2 font-headline">{analysis.plantName}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(analysis.analysisDate).toLocaleDateString()}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

export default function HistoryPage() {
  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <History className="size-8 text-accent" />
        <div>
          <h1 className="font-headline text-3xl">Growth Tracker</h1>
          <p className="text-muted-foreground">Review your saved plant analyses and track their growth.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <PlantGallery />
      </div>
    </div>
  );
}
