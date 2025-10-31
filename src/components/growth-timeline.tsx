'use client';

import { useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, doc, getDoc, Firestore } from "firebase/firestore";
import Image from "next/image";
import { Bot, Pencil, MessageSquare, Microscope, Leaf } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

interface GrowthTimelineProps {
  userId: string;
  analysisId: string;
  firestore: Firestore;
  refreshKey: number;
}

export function GrowthTimeline({ userId, analysisId, firestore, refreshKey }: GrowthTimelineProps) {
  const growthTrackersQuery = useMemoFirebase(() => {
    if (!userId || !analysisId || !firestore) return null;
    return query(
      collection(firestore, `users/${userId}/plantAnalyses/${analysisId}/growthTrackers`),
      orderBy('noteDate', 'desc')
    );
  }, [userId, analysisId, firestore, refreshKey]);

  const analysisRef = useMemoFirebase(() => {
    if (!firestore || !userId || !analysisId) return null;
    return doc(firestore, `users/${userId}/plantAnalyses`, analysisId as string);
  }, [firestore, userId, analysisId]);

  const { data: notes, isLoading: isLoadingNotes } = useCollection(growthTrackersQuery);
  const [initialAnalysis, setInitialAnalysis] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);

  useEffect(() => {
    const fetchAnalysis = async () => {
      if (analysisRef) {
        setIsLoadingAnalysis(true);
        try {
          const docSnap = await getDoc(analysisRef);
          if (docSnap.exists()) {
            setInitialAnalysis({ ...docSnap.data(), id: docSnap.id });
          }
        } catch (error) {
          console.error("Error fetching initial analysis:", error);
        } finally {
          setIsLoadingAnalysis(false);
        }
      } else {
        setIsLoadingAnalysis(false);
      }
    };
    fetchAnalysis();
  }, [analysisRef]);
  
  const timelineItems = useMemo(() => {
    // Don't compute until both are done loading
    if (isLoadingNotes || isLoadingAnalysis) {
      return null;
    }
    
    const combinedItems = [
      ...(notes || []).map(note => ({ ...note, type: 'note', date: note.noteDate })),
      ...(initialAnalysis ? [{...initialAnalysis, type: 'analysis', date: initialAnalysis.analysisDate}] : [])
    ];
    
    // Sort items by date, newest first
    return combinedItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notes, initialAnalysis, isLoadingNotes, isLoadingAnalysis]);

  if (timelineItems === null) {
    return <p>Loading timeline...</p>;
  }

  if (timelineItems.length === 0) {
    return <div className="text-center text-muted-foreground py-8">No growth notes or analyses yet. Start by adding a note!</div>;
  }
  
  return (
    <div className="space-y-8">
      {timelineItems.map((item: any, index: number) => (
        <div key={`${item.type}-${item.id}`} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="bg-primary rounded-full p-2 text-primary-foreground">
              {item.type === 'note' ? <Pencil className="size-5" /> : <Bot className="size-5" />}
            </div>
            {/* Don't render the line for the last item */}
            {index < timelineItems.length - 1 && <div className="w-px h-full bg-border flex-grow mt-2"></div>}
          </div>
          <div className="flex-1 pb-8">
            <p className="text-sm text-muted-foreground">
              {new Date(item.date).toLocaleString()}
            </p>
            <div className="mt-2 p-4 rounded-lg bg-card border">
              {item.type === 'note' ? (
                <>
                  <p className="font-semibold flex items-center gap-2"><MessageSquare className="size-4 text-primary"/> User Note</p>
                  <p className="mt-2 text-muted-foreground">{item.note}</p>
                  {item.imageUrl && (
                    <div className="mt-4 relative aspect-video max-w-xs">
                      <Image src={item.imageUrl} alt="Note image" layout="fill" className="rounded-md object-cover" />
                    </div>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                    <p className="font-semibold flex items-center gap-2"><Bot className="size-4 text-primary"/> AI Analysis Created</p>
                    <div className="flex items-center gap-2 text-sm">
                        <Microscope className="size-4 text-muted-foreground"/>
                        <strong>Diagnosis:</strong>
                        <span className={item.identifiedDiseases[0] === 'Healthy' ? 'text-green-600' : 'text-destructive'}>
                            {item.identifiedDiseases[0]}
                        </span>
                    </div>
                     <div className="flex items-start gap-2 text-sm">
                        <Leaf className="size-4 text-muted-foreground mt-1"/>
                        <strong>Remedy:</strong>
                        <span className="text-muted-foreground">{item.remedySuggestions}</span>
                    </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
