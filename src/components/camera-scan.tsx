'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Zap, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface CameraScanProps {
  onCapture: (imageDataUri: string) => void;
  disabled: boolean;
}

export function CameraScan({ onCapture, disabled }: CameraScanProps) {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      // Only run on client
      if (typeof window === 'undefined' || !navigator.mediaDevices) {
        setHasCameraPermission(false);
        return;
      }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    // Cleanup function to stop the video stream
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }

  }, [toast]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        
        // Get the image data from the canvas
        const imageDataUri = canvas.toDataURL('image/jpeg');
        onCapture(imageDataUri);
      }
    }
  };

  if (hasCameraPermission === null) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin" /> <p className="ml-2">Initializing Camera...</p></div>
  }

  if (hasCameraPermission === false) {
      return (
          <Alert variant="destructive">
              <Camera className="h-4 w-4" />
              <AlertTitle>Camera Access Required</AlertTitle>
              <AlertDescription>
                Please allow camera access in your browser to use this feature. You may need to refresh the page after granting permission.
              </AlertDescription>
            </Alert>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden relative">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          <canvas ref={canvasRef} className="hidden" />
      </div>
      <Button onClick={handleCapture} disabled={disabled}>
        {disabled ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          <>
            <Zap className="mr-2 h-4 w-4" />
            Scan Plant
          </>
        )}
      </Button>
    </div>
  );
}
