'use client';

import { useParams } from 'next/navigation';
import { useDoc, useFirebase, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Leaf, Calendar, Stethoscope, Droplets, Sun, TrendingUp, NotebookPen } from 'lucide-react';
import { AddGrowthNoteForm } from '@/components/add-growth-note-form';
import { GrowthTimeline } from '@/components/growth-timeline';
import { useState } from 'react';

export default function GrowthTrackerPage() {
  const { analysisId } = useParams();
  const { user, firestore } = useFirebase();
  const [refreshKey, setRefreshKey] = useState(0);

  const analysisRef = useMemoFirebase(() => {
    if (!user || !firestore || !analysisId) return null;
    return doc(firestore, `users/${user.uid}/plantAnalyses`, analysisId as string);
  }, [user, firestore, analysisId]);

  const { data: analysis, isLoading } = useDoc(analysisRef);

  const handleNoteAdded = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  if (isLoading) {
    return <div className="container mx-auto py-8">Loading plant details...</div>;
  }

  if (!analysis) {
    return <div className="container mx-auto py-8">Plant analysis not found.</div>;
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 space-y-8">
      <Card>
        <CardHeader>
            <div className="flex items-center gap-4 mb-4">
                 <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                    <Image src={analysis.plantImageURI} alt={analysis.plantName} layout="fill" className="object-cover"/>
                 </div>
                 <div>
                    <Badge variant={analysis.identifiedDiseases[0] === 'Healthy' ? 'secondary' : 'destructive'}>
                        {analysis.identifiedDiseases[0]}
                    </Badge>
                    <CardTitle className="font-headline text-3xl mt-1">{analysis.plantName}</CardTitle>
                    <CardDescription className="italic">{analysis.scientificName}</CardDescription>
                 </div>
            </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
                <Calendar className="size-5 text-muted-foreground"/>
                <p className="text-xs font-bold">Analyzed</p>
                <p className="text-sm">{new Date(analysis.analysisDate).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
                <TrendingUp className="size-5 text-muted-foreground"/>
                <p className="text-xs font-bold">Growth Rate</p>
                <p className="text-sm">{analysis.growthRate || 'N/A'}</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
                <Droplets className="size-5 text-muted-foreground"/>
                <p className="text-xs font-bold">Water Needs</p>
                <p className="text-sm">{analysis.waterNeeds || 'N/A'}</p>
            </div>
            <div className="flex flex-col items-center gap-1 p-2 bg-muted/50 rounded-lg">
                <Sun className="size-5 text-muted-foreground"/>
                <p className="text-xs font-bold">Sunlight</p>
                <p className="text-sm">{analysis.sunlightRequirements || 'N/A'}</p>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <div className="flex items-center gap-3">
                <NotebookPen className="size-6 text-primary"/>
                <CardTitle className="font-headline text-2xl">Add Growth Note</CardTitle>
            </div>
            <CardDescription>Log progress, watering schedules, or attach a new photo.</CardDescription>
        </CardHeader>
        <CardContent>
            {user && firestore && <AddGrowthNoteForm analysisId={analysis.id} onNoteAdded={handleNoteAdded} />}
        </CardContent>
      </Card>

      <div>
        <h2 className="font-headline text-2xl mb-4">Growth Timeline</h2>
        {user && firestore && <GrowthTimeline userId={user.uid} analysisId={analysis.id} firestore={firestore} refreshKey={refreshKey}/>}
      </div>
    </div>
  );
}

    