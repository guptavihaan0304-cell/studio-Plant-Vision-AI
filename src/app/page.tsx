'use client';

import { useState } from 'react';
import { UploadCloud, Leaf, Microscope, Pill, BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

import { identifyPlantSpecies, type IdentifyPlantSpeciesOutput } from '@/ai/flows/identify-plant-species';
import { diagnosePlantDisease, type DiagnosePlantDiseaseOutput } from '@/ai/flows/diagnose-plant-disease';
import { suggestPlantCareRemedies, type SuggestPlantCareRemediesOutput } from '@/ai/flows/suggest-plant-care-remedies';
import { useToast } from '@/hooks/use-toast';

type AnalysisState = {
  identification: IdentifyPlantSpeciesOutput['plantIdentification'] | null;
  diagnosis: DiagnosePlantDiseaseOutput | null;
  remedies: SuggestPlantCareRemediesOutput | null;
};

export default function AnalysisPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisState | null>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setAnalysis(null);
        handleAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalysis = async (imageDataUri: string) => {
    setIsLoading(true);
    setAnalysis(null);

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
          diagnosis: diagnosisResult.diagnosis
      });

      setAnalysis({
        identification: identificationResult.plantIdentification,
        diagnosis: diagnosisResult,
        remedies: remediesResult,
      });

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
      <Card className="text-center bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit">
            <BrainCircuit className="size-8 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">AI Plant Analysis</CardTitle>
          <CardDescription className="max-w-md mx-auto">
            Upload a photo of your plant, and our AI will identify it, diagnose any issues, and suggest care remedies.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="border-2 border-dashed border-primary/50 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 min-h-[250px] cursor-pointer hover:bg-accent/10 transition-colors"
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
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 text-muted-foreground">
                <Loader2 className="size-12 animate-spin text-primary" />
                <p className="font-semibold font-headline">Analyzing your plant...</p>
                <p className="text-sm">This may take a moment. Please wait.</p>
              </div>
            ) : imagePreview ? (
              <div className="relative w-full max-w-sm">
                <Image
                  src={imagePreview}
                  alt="Plant preview"
                  width={400}
                  height={400}
                  className="rounded-lg object-contain max-h-[300px]"
                />
              </div>
            ) : (
              <>
                <UploadCloud className="size-12 text-primary/80" />
                <p className="text-lg font-semibold font-headline">Click or drag to upload an image</p>
                <p className="text-muted-foreground">For best results, use a clear, well-lit photo.</p>
                <Button disabled={isLoading} onClick={handleUploadClick} >
                  {isLoading ? 'Loading...' : 'Upload Image'}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <div className="mt-8 space-y-8">
          {analysis.identification && (
            <Card>
              <CardHeader className="flex flex-row items-start gap-4">
                <Leaf className="size-8 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="font-headline text-2xl">Plant Identification</CardTitle>
                  <CardDescription>Species & Care Information</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-x-6 gap-y-4 text-left">
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
              </CardContent>
            </Card>
          )}

          {analysis.diagnosis && (
             <Card>
              <CardHeader className="flex flex-row items-start gap-4">
                <Microscope className="size-8 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="font-headline text-2xl">Health Diagnosis</CardTitle>
                  <CardDescription>AI-powered disease and deficiency detection.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-left space-y-2">
                <p>{analysis.diagnosis.diagnosis}</p>
              </CardContent>
            </Card>
          )}

          {analysis.remedies && (
            <Card>
              <CardHeader className="flex flex-row items-start gap-4">
                <Pill className="size-8 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="font-headline text-2xl">Care & Remedy Suggestions</CardTitle>
                  <CardDescription>Natural and organic solutions for a healthy plant.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="text-left space-y-2">
                 <p>{analysis.remedies.remedies}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
