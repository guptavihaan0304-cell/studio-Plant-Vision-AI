'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Leaf, ChevronRight, Bot, History, MessageSquare, Microscope } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  const [showOnboarding, setShowOnboarding] = useState(true);

  const handleContinueClick = () => {
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center py-12">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-6">
            <Leaf className="size-16 text-primary" />
          </div>
          <h1 className="text-5xl font-bold font-headline text-primary mb-4">
            Welcome to PlantVision AI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Your intelligent partner in plant care. Let's get you started.
          </p>
        </div>

        <Carousel className="w-full max-w-2xl mx-auto">
          <CarouselContent>
            <CarouselItem>
              <Card className="bg-card/80">
                <CardHeader className="items-center text-center">
                  <div className="p-3 bg-accent/30 rounded-full">
                    <Microscope className="size-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">Identify & Diagnose</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Upload a photo of your plant, and our AI will identify its species and check for any diseases or issues.</p>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-card/80">
                <CardHeader className="items-center text-center">
                   <div className="p-3 bg-accent/30 rounded-full">
                    <MessageSquare className="size-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">Chat with an Expert</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Ask our AI Assistant anything about plant care, from watering schedules to pest control, and get instant advice.</p>
                </CardContent>
              </Card>
            </CarouselItem>
            <CarouselItem>
              <Card className="bg-card/80">
                <CardHeader className="items-center text-center">
                   <div className="p-3 bg-accent/30 rounded-full">
                    <History className="size-10 text-primary" />
                  </div>
                  <CardTitle className="font-headline text-2xl mt-4">Track Your Garden</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p>Every analysis is automatically saved to your history, so you can monitor your plant's health over time.</p>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div className="text-center mt-12">
          <Button size="lg" onClick={handleContinueClick}>
            Continue
            <ChevronRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center py-16">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-6">
                <Leaf className="size-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold font-headline text-primary mb-4">
                Welcome to PlantVision AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Your intelligent partner in plant care. Identify plants, diagnose diseases, and get expert advice to help your green friends thrive.
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/analysis" className="flex">
            <Card className="flex flex-col w-full hover:border-primary/50 hover:bg-accent/20 transition-colors">
                <CardHeader>
                    <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
                        <Bot className="size-8 text-primary"/>
                    </div>
                    <CardTitle className="font-headline text-center">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <p>Snap a photo to identify species, diagnose issues, and get care tips.</p>
                </CardContent>
            </Card>
          </Link>
          <Link href="/assistant" className="flex">
             <Card className="flex flex-col w-full hover:border-primary/50 hover:bg-accent/20 transition-colors">
                <CardHeader>
                     <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
                        <MessageSquare className="size-8 text-primary"/>
                    </div>
                    <CardTitle className="font-headline text-center">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <p>Chat with our AI expert for personalized plant care advice.</p>
                </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard" className="flex">
             <Card className="flex flex-col w-full hover:border-primary/50 hover:bg-accent/20 transition-colors">
                <CardHeader>
                     <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
                        <History className="size-8 text-primary"/>
                    </div>
                    <CardTitle className="font-headline text-center">My History</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center">
                    <p>Review your past plant analyses and track their progress over time.</p>
                </CardContent>
            </Card>
          </Link>
        </div>

        <div className="text-center mt-12">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              As Seen On
            </h2>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-muted-foreground">
              <span className="font-bold text-xl font-headline">GreenThumb Weekly</span>
              <span className="font-bold text-xl font-headline">PLANTAE</span>
              <span className="font-bold text-xl font-headline">Modern Farmer</span>
              <span className="font-bold text-xl font-headline">EcoLife</span>
            </div>
        </div>
    </div>
  );
}
