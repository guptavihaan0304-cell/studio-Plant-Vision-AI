'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, ChevronRight } from 'lucide-react';
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
            <Link href="/analysis">
                <Button size="lg" className="font-bold">
                    Start Analysis <ChevronRight className="ml-2" />
                </Button>
            </Link>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 text-center">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Identify Species</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Snap a photo to instantly identify any plant with remarkable accuracy.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Diagnose Issues</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Upload an image to detect diseases, pests, and deficiencies.</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Get Expert Advice</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Receive tailored care tips and natural remedies from our AI assistant.</p>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
