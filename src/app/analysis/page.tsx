'use client';

import { useState } from 'react';
import { UploadCloud, Leaf, Microscope, Pill, BrainCircuit, Loader2, Bookmark, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

import { identifyPlantSpecies, type IdentifyPlantSpeciesOutput } from '@/ai/flows/identify-plant-species';
import { diagnosePlantDisease, type DiagnosePlantDiseaseOutput } from '@/ai/flows/diagnose-plant-disease';
import { suggestPlantCareRemedies, type SuggestPlantCareRemediesOutput } from '@/ai/flows/suggest-plant-care-remedies';
import { useToast } from '@/hooks/use-toast';
import { useFirebase } from '@/firebase';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { collection } from 'firebase/firestore';
import { CameraScan } from '@/components/camera-scan';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

type AnalysisState = {
  identification: IdentifyPlantSpeciesOutput['plantIdentification'] | null;
  diagnosis: DiagnosePlantDiseaseOutput | null;
  remedies: SuggestPlantCareRemediesOutput | null;
};

export default function AnalysisPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const { toast } = useToast();
  const { user, firestore } = useFirebase();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUri = reader.result as string;
        setImagePreview(imageDataUri);
        setAnalysis(null);
        handleAnalysis(imageDataUri);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBookmark = () => {
    if (!user || user.isAnonymous || !analysis || !analysis.identification || !analysis.diagnosis || !firestore) {
      toast({
        variant: 'destructive',
        title: 'Sign Up to Save',
        description: 'You need to create an account to save your analyses.',
      });
      return;
    }

    const analysisData = {
      userAccountId: user.uid,
      plantName: analysis.identification.commonName,
      scientificName: analysis.identification.scientificName,
      analysisDate: new Date().toISOString(),
      identifiedDiseases: [analysis.diagnosis.diagnosis.primaryDiagnosis],
      remedySuggestions: analysis.remedies?.remedies || 'N/A',
      plantImageURI: imagePreview,
      ...analysis.identification,
    };
    
    const collectionRef = collection(firestore, 'users', user.uid, 'plantAnalyses');
    addDocumentNonBlocking(collectionRef, analysisData);

    toast({
      title: 'Analysis Saved',
      description: 'Your plant analysis has been saved to your garden.',
    });
  };

  const handleAnalysis = async (imageDataUri: string) => {
    setIsLoading(true);
    setAnalysis(null);
    setImagePreview(imageDataUri);
    setIsCameraOpen(false);

    try {
      const [identificationResult, diagnosisResult] = await Promise.all([
        identifyPlantSpecies({ photoDataUri: imageDataUri }),
        diagnosePlantDisease({ photoDataUri: imageDataUri }),
      ]);

      if (!identificationResult?.plantIdentification || !diagnosisResult?.diagnosis) {
        throw new Error('AI analysis failed to return complete data.');
      }
      
      const remediesResult = await suggestPlantCareRemedies({
          plantName: identificationResult.plantIdentification.commonName,
          diagnosis: diagnosisResult.diagnosis.primaryDiagnosis
      });
      
      const newAnalysis = {
        identification: identificationResult.plantIdentification,
        diagnosis: diagnosisResult,
        remedies: remediesResult,
      };

      setAnalysis(newAnalysis);

    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'There was an error analyzing your plant. Please try again.',
      });
      setImagePreview(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUploadClick = () => {
    document.getElementById('plant-upload')?.click();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="text-center shadow-lg rounded-3xl">
        <CardHeader>
          <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
            <BrainCircuit className="size-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">AI Plant Analysis</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Use your camera for a live scan or upload a photo. Our AI will identify your plant, diagnose issues, and suggest care.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
            <div
                className="border-2 border-dashed border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px] cursor-pointer hover:bg-secondary transition-colors"
                onClick={() => setIsCameraOpen(true)}
            >
                <Camera className="size-12 text-primary/80" />
                <p className="text-lg font-semibold font-headline">Live Camera Scan</p>
                <p className="text-muted-foreground">Get real-time feedback from our AI.</p>
                <Button disabled={isLoading} onClick={() => setIsCameraOpen(true)} className="rounded-full">
                  📸 Start Camera
                </Button>
            </div>
            <div
                className="border-2 border-dashed border-primary/50 rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 min-h-[300px] cursor-pointer hover:bg-secondary transition-colors"
                onClick={handleUploadClick}
            >
                <input
                id="plant-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                disabled={isLoading}
                />
                <UploadCloud className="size-12 text-primary/80" />
                <p className="text-lg font-semibold font-headline">Upload an Image</p>
                <p className="text-muted-foreground">Use a clear, well-lit photo for best results.</p>
                <Button disabled={isLoading} onClick={handleUploadClick} className="rounded-full">
                  🖼️ Upload Image
                </Button>
            </div>
        </CardContent>
      </Card>
      
        <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
            <DialogContent className="max-w-5xl p-0 border-0">
                <DialogHeader className="p-4 sr-only">
                    <DialogTitle>Live Plant Scan</DialogTitle>
                    <DialogDescription>
                        The camera is active. Position your plant in the frame and capture an image for analysis.
                    </DialogDescription>
                </DialogHeader>
                <CameraScan onCapture={handleAnalysis} disabled={isLoading} />
            </DialogContent>
        </Dialog>

      {isLoading && (
          <Card className="mt-8 text-center rounded-3xl">
              <CardContent className="p-8">
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <Leaf className="size-12 text-primary pulse-leaf" />
                    <p className="font-semibold font-headline text-lg">Analyzing your plant...</p>
                    <p className="text-sm">This may take a moment. Please wait.</p>
                    {imagePreview && 
                      <Image 
                        src={imagePreview}
                        alt="Analyzing plant"
                        width={200}
                        height={200}
                        className="rounded-lg object-cover mt-4 shadow-md"
                      />
                    }
                </div>
              </CardContent>
          </Card>
      )}

      {analysis && imagePreview && !isLoading && (
        <div className="mt-8 space-y-8">
           <Card className="rounded-3xl">
              <CardHeader>
                  <CardTitle className="font-headline text-2xl">Analysis Complete</CardTitle>
              </CardHeader>
              <CardContent>
                   <div className="relative w-full max-w-sm mx-auto">
                      <Image
                        src={imagePreview}
                        alt="Plant preview"
                        width={400}
                        height={400}
                        className="rounded-lg object-contain max-h-[300px]"
                      />
                    </div>
              </CardContent>
           </Card>
          
          <Card className="shadow-lg rounded-3xl">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-start gap-4">
                  <Leaf className="size-8 text-primary flex-shrink-0" />
                  <div>
                    <CardTitle className="font-headline text-2xl">Plant Identification</CardTitle>
                    <CardDescription>Species & Care Information</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleBookmark} title="Save analysis" className="rounded-full">
                  <Bookmark className="size-6" />
                  <span className="sr-only">Save Analysis</span>
                </Button>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4 text-left">
                {analysis.identification && (
                  <>
                  <div>
                    <h3 className="font-bold text-lg font-headline">{analysis.identification.commonName}</h3>
                    <p className="italic text-muted-foreground">{analysis.identification.scientificName}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Growth</p>
                      <p>{analysis.identification.growthRate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Water</p>
                      <p>{analysis.identification.waterNeeds}</p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground">Sunlight</p>
                      <p>{analysis.identification.sunlightRequirements}</p>
                    </div>
                  </div>
                  </>
                )}
              </CardContent>
            </Card>

          {analysis.diagnosis && (
             <Card className="shadow-lg rounded-3xl">
              <CardHeader className="flex flex-row items-start gap-4">
                <Microscope className="size-8 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="font-headline text-2xl">Health Diagnosis</CardTitle>
                  <CardDescription>AI-powered disease and deficiency detection.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-left space-y-4">
                <div>
                  <h4 className="font-bold">Diagnosis</h4>
                  <p>{analysis.diagnosis.diagnosis.primaryDiagnosis}</p>
                </div>
                <div>
                  <h4 className="font-bold">Confidence</h4>
                  <p>{analysis.diagnosis.diagnosis.confidence}</p>
                </div>
                 <div>
                  <h4 className="font-bold">Reasoning</h4>
                  <p className="text-muted-foreground">{analysis.diagnosis.diagnosis.reasoning}</p>
                </div>
                {analysis.diagnosis.diagnosis.possibleOtherDiseases && analysis.diagnosis.diagnosis.possibleOtherDiseases.length > 0 && (
                  <div>
                    <h4 className="font-bold">Other Possibilities</h4>
                    <ul className="list-disc list-inside text-muted-foreground">
                      {analysis.diagnosis.diagnosis.possibleOtherDiseases.map((disease, i) => <li key={i}>{disease}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {analysis.remedies && (
            <Card className="shadow-lg rounded-3xl">
              <CardHeader className="flex flex-row items-start gap-4">
                <Pill className="size-8 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="font-headline text-2xl">Care & Remedy Suggestions</CardTitle>
                  <CardDescription>Natural and organic solutions for a healthy plant.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-left space-y-2">
                 <p className="whitespace-pre-wrap">{analysis.remedies.remedies}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
