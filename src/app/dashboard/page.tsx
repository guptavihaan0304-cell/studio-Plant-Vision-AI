'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { History } from "lucide-react";
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from "firebase/firestore";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
      <div>
        <h2 className="font-headline text-2xl mb-4">Analysis History</h2>
        <PlantGallery />
      </div>
    </div>
  );
}
