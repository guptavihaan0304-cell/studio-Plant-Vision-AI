'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, ChevronRight, Bot, History, MessageSquare } from 'lucide-react';
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
    </div>
  );
}
