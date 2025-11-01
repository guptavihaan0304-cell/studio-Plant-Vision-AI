'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, History, MessageSquare, Sprout } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function WelcomePage() {
  return (
    <div className="container mx-auto max-w-5xl py-12">
        <header className="text-center mb-16">
            <div className="inline-block bg-primary/20 text-primary p-4 rounded-full mb-4">
                <Sprout className="size-12" />
            </div>
            <h1 className="text-5xl font-bold font-headline text-foreground mb-4">
                Smart Plant Doctor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Your intelligent partner in plant care. Identify plants, diagnose diseases, and get expert advice to help your green friends thrive.
            </p>
        </header>
        
        <main>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                href="/analysis"
                icon={Bot}
                title="AI Analysis"
                description="Snap a photo to identify species, diagnose issues, and get care tips."
              />
              <FeatureCard 
                href="/assistant"
                icon={MessageSquare}
                title="AI Assistant"
                description="Chat with our AI expert for personalized plant care advice."
              />
              <FeatureCard 
                href="/dashboard"
                icon={History}
                title="My Garden"
                description="Review your past plant analyses and track their progress over time."
              />
          </div>

          <div className="mt-20 text-center">
            <h2 className="text-3xl font-headline font-bold mb-8">Featured Plants</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {PlaceHolderImages.slice(0, 8).map((image) => (
                  <div key={image.id} className="rounded-2xl overflow-hidden shadow-lg group">
                      <Image
                          src={image.imageUrl}
                          alt={image.description}
                          width={400}
                          height={400}
                          className="object-cover aspect-square w-full h-full group-hover:scale-105 transition-transform duration-300"
                          data-ai-hint={image.imageHint}
                      />
                  </div>
              ))}
            </div>
          </div>
        </main>
    </div>
  );
}

function FeatureCard({ href, icon: Icon, title, description }: { href: string; icon: React.ElementType; title: string; description: string; }) {
  return (
    <Link href={href} className="group block">
      <Card className="flex flex-col w-full h-full hover:border-primary/50 bg-card hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-xl hover:-translate-y-1 rounded-2xl">
          <CardHeader className="items-center text-center">
              <div className="bg-secondary group-hover:bg-background rounded-full p-3 mb-2 transition-colors">
                  <Icon className="size-7 text-primary"/>
              </div>
              <CardTitle className="font-headline text-xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-muted-foreground pt-0">
              <p>{description}</p>
          </CardContent>
      </Card>
    </Link>
  )
}
