'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { History, LineChart as LineChartIcon, Leaf, Award, User } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { LineChart, CartesianGrid, XAxis, Line, Tooltip, YAxis } from "recharts";
import { useMemo } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const chartConfig = {
  health: {
    label: "Health Score",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const ranks = [
    { name: "Sprout", minXp: 0 },
    { name: "Seedling", minXp: 100 },
    { name: "Gardener", minXp: 250 },
    { name: "Botanist", minXp: 500 },
];

function calculateRank(xp: number) {
    let currentRank = ranks[0];
    for (let i = ranks.length - 1; i >= 0; i--) {
        if (xp >= ranks[i].minXp) {
            currentRank = ranks[i];
            break;
        }
    }
    
    const nextRankIndex = ranks.findIndex(r => r.minXp > xp);
    const nextRank = nextRankIndex !== -1 ? ranks[nextRankIndex] : null;

    const progress = nextRank ? Math.floor(((xp - currentRank.minXp) / (nextRank.minXp - currentRank.minXp)) * 100) : 100;
    const xpToNext = nextRank ? nextRank.minXp - xp : 0;
    
    return {
        rankName: currentRank.name,
        progress,
        xpToNext
    };
}


function GardenerProfileCard({ user, analysesCount }: { user: any, analysesCount: number }) {
  const xp = analysesCount * 50; // Each analysis is 50 XP
  const { rankName, progress, xpToNext } = calculateRank(xp);
    
  if (!user || user.isAnonymous) {
      return (
        <Card className="glassmorphic-panel">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Create a Profile</CardTitle>
                <CardDescription>Sign up to track your plants and earn rewards!</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert className="bg-secondary/20 border-secondary/50">
                    <Leaf className="h-4 w-4 text-primary" />
                    <AlertTitle className="text-primary/90">Welcome, Guest!</AlertTitle>
                    <AlertDescription>
                        Create an account to save your plant analyses, track their growth, and level up your gardener rank.
                    </AlertDescription>
                </Alert>
            </CardContent>
            <CardFooter>
                 <Button asChild className="w-full rounded-full glow-effect">
                    <Link href="/profile">Sign Up / Login</Link>
                </Button>
            </CardFooter>
        </Card>
      )
  }
  return (
    <Card className="glassmorphic-panel">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary glow-effect">
            <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="font-headline text-3xl text-primary">{user.displayName || "Gardener"}</CardTitle>
            <CardDescription>Tracking {analysesCount} {analysesCount === 1 ? 'plant' : 'plants'}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Award className="size-5 text-primary"/>
                    <span className="font-semibold">Rank</span>
                </div>
                <span className="font-bold text-primary">{rankName}</span>
            </div>
            <Progress value={progress} className="h-2"/>
            <p className="text-xs text-muted-foreground text-center">
                {xpToNext > 0 ? `${xpToNext} XP to next rank` : "You've reached the highest rank!"}
            </p>
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

  if (chartData.length < 1) {
    return (
      <Card className="h-full flex flex-col justify-center glassmorphic-panel">
        <CardContent>
          <Alert className="bg-secondary/20 border-secondary/50">
            <Leaf className="h-4 w-4 text-primary" />
            <AlertTitle className="text-primary/90">Not Enough Data</AlertTitle>
            <AlertDescription>
              Save at least one analysis to see a health trend chart for your plants.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }
  
  const xAxisDomain = chartData.length === 1 ? [chartData[0].date, chartData[0].date] : undefined;

  return (
    <Card className="glassmorphic-panel">
      <CardHeader>
        <div className="flex items-center gap-4">
          <LineChartIcon className="size-8 text-primary" />
          <div>
            <CardTitle className="font-headline text-3xl text-primary">Health Trend</CardTitle>
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
              left: 0,
              right: 20,
              bottom: 10
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)"/>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
              domain={xAxisDomain}
              type="category"
              stroke="hsl(var(--foreground) / 0.6)"
            />
            <YAxis domain={[0, 100]} hide={true} />
            <Tooltip
              cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={<ChartTooltipContent 
                indicator="line"
                formatter={(value, name, item) => (
                  <div className="space-y-1">
                    <p className="font-bold text-primary">{item.payload.plantName}</p>
                    <p>Health: {item.payload.diagnosis}</p>
                    <p className="text-muted-foreground text-xs">{item.payload.date}</p>
                  </div>
                )}
                hideLabel
                className="glassmorphic-panel"
              />}
            />
            <Line
              dataKey="health"
              type="monotone"
              stroke="url(#healthGradient)"
              strokeWidth={3}
              dot={(props) => <circle {...props} r={5} fill="hsl(var(--primary))" />}
            />
            <defs>
                <linearGradient id="healthGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--secondary))" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" />
                </linearGradient>
            </defs>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function PlantGallery() {
  const { user, firestore, isUserLoading } = useFirebase();

  const analysesQuery = useMemoFirebase(() => {
    if (!user || !firestore || user.isAnonymous) return null;
    return query(collection(firestore, `users/${user.uid}/plantAnalyses`), orderBy('analysisDate', 'desc'));
  }, [user, firestore]);

  const { data: pastAnalyses, isLoading: isLoadingAnalyses } = useCollection(analysesQuery);

  if (isUserLoading || isLoadingAnalyses) {
    return <p>Loading history...</p>;
  }

  const analyses = pastAnalyses || [];

  return (
    <>
    <div className="col-span-1 md:col-span-2">
      <div className="grid grid-cols-1 gap-8">
        <GardenerProfileCard user={user} analysesCount={analyses.length} />
        {analyses.length > 0 && <HealthChart analyses={analyses} />}
      </div>
    </div>
    <div className="col-span-1 md:col-span-3">
        <h2 className="font-headline text-2xl mb-4 text-primary">My Plants</h2>
        {(!user || user.isAnonymous) && (
             <Alert className="bg-secondary/20 border-secondary/50">
              <AlertTitle className="font-headline text-primary/90">Sign Up to Track Your Plants</AlertTitle>
              <AlertDescription>
                Create a free account to save your plant analyses and watch them grow over time. Your personal plant dashboard awaits!
              </AlertDescription>
            </Alert>
        )}
        {user && !user.isAnonymous && analyses.length === 0 && (
             <Alert className="bg-secondary/20 border-secondary/50">
              <AlertTitle className="font-headline text-primary/90">No Plants Yet</AlertTitle>
              <AlertDescription>
                You haven't saved any plant analyses. Go to the Scan page to get started!
              </AlertDescription>
            </Alert>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {user && !user.isAnonymous && analyses.map((analysis) => (
            <Link href={`/growth-tracker/${analysis.id}`} key={analysis.id}>
              <Card className="overflow-hidden group h-full glassmorphic-panel hover:border-primary/80 transition-all duration-300">
                <CardContent className="p-0">
                  <div className="overflow-hidden">
                    <Image
                      src={analysis.plantImageURI}
                      alt={analysis.plantName}
                      width={400}
                      height={300}
                      className="object-cover aspect-[4/3] transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start p-4">
                  <Badge variant={analysis.identifiedDiseases[0] === 'Healthy' ? 'secondary' : 'destructive'}>{analysis.identifiedDiseases[0]}</Badge>
                  <h3 className="font-semibold mt-2 font-headline text-lg">{analysis.plantName}</h3>
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

export default function PlantsPage() {
    const { user } = useFirebase();
  return (
    <div className="container mx-auto max-w-7xl py-8 space-y-8">
      <div className="flex items-center gap-4">
        <History className="size-8 text-primary" />
        <div>
          <h1 className="font-headline text-4xl text-primary">My Garden</h1>
          <p className="text-muted-foreground">
             Review your saved plant analyses and track their growth.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <PlantGallery />
      </div>
    </div>
  );
}
