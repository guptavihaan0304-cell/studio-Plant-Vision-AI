'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Bot, History, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
        <div className="text-center py-16">
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-6 shadow-lg">
                <Leaf className="size-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold font-headline text-primary mb-4">
                Welcome to PlantVision AI
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Your intelligent partner in plant care. Identify plants, diagnose diseases, and get expert advice to help your green friends thrive.
            </p>
             <p className="text-sm font-bold font-headline text-muted-foreground max-w-2xl mx-auto">
              Scroll down and click the options you need
            </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
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
                      <CardTitle className="font-headline text-center text-primary group-hover:text-accent-foreground">Growth Tracker</CardTitle>
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
