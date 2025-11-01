'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Zap, Loader2, ScanLine, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { cn } from '@/lib/utils';

interface CameraScanProps {
  onCapture: (imageDataUri: string) => void;
  disabled: boolean;
}

export function CameraScan({ onCapture, disabled }: CameraScanProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const startVideoStream = useCallback(async () => {
     if (typeof window === 'undefined' || !navigator.mediaDevices) {
        setHasCameraPermission(false);
        return;
      }
      
      try {
        // Try to get the back camera first
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: { exact: "environment" } } 
        });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.warn('Back camera not found, trying front camera...');
        try {
            // Fallback to front camera
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            setHasCameraPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (finalError) {
             console.error('Error accessing any camera:', finalError);
            setHasCameraPermission(false);
            toast({
                variant: 'destructive',
                title: 'Camera Access Denied',
                description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
        }
      }
  }, [toast]);


  useEffect(() => {
    startVideoStream();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [startVideoStream]);

  const handleCapture = () => {
    setIsScanning(true);
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        if (context) {
            context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const imageDataUri = canvas.toDataURL('image/jpeg');
            onCapture(imageDataUri);
        }
    }
  };
  
  const isLoading = disabled || isScanning;

  if (hasCameraPermission === null) {
      return (
        <div className="flex items-center justify-center h-full min-h-[400px] bg-black text-white">
            <Loader2 className="animate-spin" /> <p className="ml-2">Initializing Camera...</p>
        </div>
      );
  }

  if (hasCameraPermission === false) {
      return (
          <div className="p-4">
            <Alert variant="destructive">
                <Camera className="h-4 w-4" />
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                    Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
                </AlertDescription>
            </Alert>
          </div>
      )
  }

  return (
    <div className="w-full bg-black relative aspect-[9/16] sm:aspect-video overflow-hidden rounded-2xl">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-between p-4">
            <div className="w-full text-center p-2 bg-black/50 rounded-lg">
                <h3 className="font-headline text-white text-lg">Live Plant Scanner</h3>
                <p className="text-white/80 text-sm">Position the plant in the frame and hold steady.</p>
            </div>
            
            <div className={cn("absolute inset-1/4 border-2 border-dashed border-white/50 rounded-lg pointer-events-none transition-colors duration-500",
                isLoading && "border-primary"
            )}>
                 {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <Leaf className="size-16 text-primary pulse-leaf" />
                    </div>
                 )}
            </div>

            <Button onClick={handleCapture} disabled={isLoading} size="lg" className="w-20 h-20 rounded-full border-4 border-white/50 bg-primary/80 hover:bg-primary z-20">
                {isLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                ) : (
                    <p className="font-bold text-lg">🌿</p>
                )}
                <span className="sr-only">Scan Plant</span>
            </Button>
        </div>
    </div>
  );
}
