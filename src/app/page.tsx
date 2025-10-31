'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Bot, History, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
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
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
              Scroll down and click the options you need
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="flex flex-col w-full hover:border-primary/50 hover:bg-accent/20 transition-colors">
            <Link href="/analysis" className="flex flex-col flex-grow p-6">
                <CardHeader className="p-0">
                    <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
                        <Bot className="size-8 text-primary"/>
                    </div>
                    <CardTitle className="font-headline text-center">AI Analysis</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center p-0 mt-4">
                    <p>Snap a photo to identify species, diagnose issues, and get care tips.</p>
                </CardContent>
            </Link>
          </Card>
          <Card className="flex flex-col w-full hover:border-primary/50 hover:bg-accent/20 transition-colors">
             <Link href="/assistant" className="flex flex-col flex-grow p-6">
                <CardHeader className="p-0">
                     <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
                        <MessageSquare className="size-8 text-primary"/>
                    </div>
                    <CardTitle className="font-headline text-center">AI Assistant</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center p-0 mt-4">
                    <p>Chat with our AI expert for personalized plant care advice.</p>
                </CardContent>
            </Link>
          </Card>
          <Card className="flex flex-col w-full hover:border-primary/50 hover:bg-accent/20 transition-colors">
             <Link href="/dashboard" className="flex flex-col flex-grow p-6">
                <CardHeader className="p-0">
                     <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit mb-2">
                        <History className="size-8 text-primary"/>
                    </div>
                    <CardTitle className="font-headline text-center">Growth Tracker</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow text-center p-0 mt-4">
                    <p>Review your past plant analyses and track their progress over time.</p>
                </CardContent>
            </Link>
          </Card>
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
