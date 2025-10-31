'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Bot, History, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

export default function WelcomePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center py-16">
             <Carousel 
                className="w-full max-w-2xl mx-auto mb-8"
                opts={{
                    loop: true,
                    align: "start"
                }}
                plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                    })
                ]}
            >
                <CarouselContent>
                    {PlaceHolderImages.map((image) => (
                        <CarouselItem key={image.id} className="md:basis-1/2 lg:basis-1/3">
                            <Card className="overflow-hidden">
                                <CardContent className="p-0">
                                    <Image
                                        src={image.imageUrl}
                                        alt={image.description}
                                        width={400}
                                        height={300}
                                        className="object-cover aspect-[4/3]"
                                        data-ai-hint={image.imageHint}
                                    />
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-[-50px]"/>
                <CarouselNext className="right-[-50px]" />
            </Carousel>
            
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-6 shadow-lg">
                <Sprout className="size-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold font-headline text-primary mb-4">
                Welcome to PlantVision AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Your intelligent partner in plant care. Identify plants, diagnose diseases, and get expert advice to help your green friends thrive.
            </p>
             <p className="text-sm font-bold font-headline text-muted-foreground max-w-2xl mx-auto mb-12">
              Select an option below to get started.
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 pt-16">
            <Card className="flex flex-col w-full h-full hover:border-primary/50 hover:bg-accent/10 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
                <Link href="/analysis" className="group flex flex-col h-full">
                  <CardHeader className="p-6">
                      <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-2 group-hover:bg-accent/20 transition-colors">
                          <Bot className="size-8 text-primary group-hover:text-accent-foreground"/>
                      </div>
                      <CardTitle className="font-headline text-center text-primary group-hover:text-accent-foreground">AI Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center p-6 pt-0">
                      <p>Snap a photo to identify species, diagnose issues, and get care tips.</p>
                  </CardContent>
                </Link>
            </Card>
            <Card className="flex flex-col w-full h-full hover:border-primary/50 hover:bg-accent/10 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
              <Link href="/assistant" className="group flex flex-col h-full">
                  <CardHeader className="p-6">
                       <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-2 group-hover:bg-accent/20 transition-colors">
                          <MessageSquare className="size-8 text-primary group-hover:text-accent-foreground"/>
                      </div>
                      <CardTitle className="font-headline text-center text-primary group-hover:text-accent-foreground">AI Assistant</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center p-6 pt-0">
                      <p>Chat with our AI expert for personalized plant care advice.</p>
                  </CardContent>
              </Link>
            </Card>
            <Card className="flex flex-col w-full h-full hover:border-primary/50 hover:bg-accent/10 transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1">
              <Link href="/dashboard" className="group flex flex-col h-full">
                  <CardHeader className="p-6">
                       <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-2 group-hover:bg-accent/20 transition-colors">
                          <History className="size-8 text-primary group-hover:text-accent-foreground"/>
                      </div>
                      <CardTitle className="font-headline text-center text-primary group-hover:text-accent-foreground">Dashboard</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow text-center p-6 pt-0">
                      <p>Review your past plant analyses and track their progress over time.</p>
                  </CardContent>
              </Link>
            </Card>
        </div>
    </div>
  );
}

    