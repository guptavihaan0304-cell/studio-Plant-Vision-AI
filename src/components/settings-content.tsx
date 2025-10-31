'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { Settings as SettingsIcon, BrainCircuit, Heart, Shield, Paintbrush, Moon, Sun, Laptop, User, LogOut } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback } from './ui/avatar';


export function SettingsPageContent() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const auth = useAuth();
  const { user } = useUser();
  const router = useRouter();
  
  // State for settings - in a real app, this would come from a user context or database
  const [aiScanAccuracy, setAiScanAccuracy] = useState("standard");
  const [isRealTimeScan, setIsRealTimeScan] = useState(true);
  const [isVoiceAssistant, setIsVoiceAssistant] = useState(false);
  const [isOrganicOnly, setIsOrganicOnly] = useState(false);
  const [skillLevel, setSkillLevel] = useState("beginner");
  const [isPetSafe, setIsPetSafe] = useState(true);
  const [isChildSafe, setIsChildSafe] = useState(true);

  const handleSaveChanges = () => {
    toast({
        title: "Settings Saved",
        description: "Your new preferences have been saved successfully.",
    });
  };

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/profile');
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card className="glassmorphic-panel">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit soft-glow">
            <SettingsIcon className="size-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary mt-4">Profile & Settings</CardTitle>
          <CardDescription className="max-w-xl mx-auto">
            Customize your PlantVision AI experience and manage your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
            {user && (
                <div className="flex items-center gap-4 mb-8 p-4 bg-primary/5 rounded-lg">
                     <Avatar className="h-16 w-16 border-2 border-primary glow-effect">
                        <AvatarFallback className="bg-secondary text-primary text-2xl font-bold">
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : <User />}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-bold font-headline">{user.displayName}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            )}
          <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <BrainCircuit className="size-6 text-primary" />
                  <span>AI & Scanning</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9 space-y-6 pt-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="scan-accuracy" className="flex-1">AI Scan Accuracy</Label>
                  <Select value={aiScanAccuracy} onValueChange={setAiScanAccuracy}>
                    <SelectTrigger className="w-[180px] rounded-full" id="scan-accuracy">
                      <SelectValue placeholder="Select accuracy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eco">Eco (Low Power)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="ultra">Ultra-Precision</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="real-time-scan">Real-Time AI Scan</Label>
                  <Switch id="real-time-scan" checked={isRealTimeScan} onCheckedChange={setIsRealTimeScan} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="voice-assistant">AI Voice Assistant</Label>
                  <Switch id="voice-assistant" checked={isVoiceAssistant} onCheckedChange={setIsVoiceAssistant} />
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Heart className="size-6 text-primary" />
                  <span>Plant Care Preferences</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9 space-y-6 pt-4">
                 <div className="flex items-center justify-between">
                  <Label htmlFor="organic-mode">Organic-Only Mode</Label>
                  <Switch id="organic-mode" checked={isOrganicOnly} onCheckedChange={setIsOrganicOnly} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="skill-level" className="flex-1">Gardening Skill Level</Label>
                  <Select value={skillLevel} onValueChange={setSkillLevel}>
                    <SelectTrigger className="w-[180px] rounded-full" id="skill-level">
                      <SelectValue placeholder="Select your skill level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Shield className="size-6 text-primary" />
                  <span>Safety Settings</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9 space-y-6 pt-4">
                 <div className="flex items-center justify-between">
                  <Label htmlFor="pet-safe">Pet-Safe Plant Warning</Label>
                  <Switch id="pet-safe" checked={isPetSafe} onCheckedChange={setIsPetSafe} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="child-safe">Child-Safe Toxicity Alert</Label>
                  <Switch id="child-safe" checked={isChildSafe} onCheckedChange={setIsChildSafe} />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Paintbrush className="size-6 text-primary" />
                  <span>Appearance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9 space-y-6 pt-4">
                 <div className="flex items-center justify-between">
                    <Label>Theme</Label>
                    <div className="flex items-center gap-2">
                        <Button variant={theme === 'light' ? 'secondary' : 'ghost'} size="icon" className="rounded-full" onClick={() => setTheme('light')}><Sun/></Button>
                        <Button variant={theme === 'dark' ? 'secondary' : 'ghost'} size="icon" className="rounded-full" onClick={() => setTheme('dark')}><Moon/></Button>
                        <Button variant={theme === 'system' ? 'secondary' : 'ghost'} size="icon" className="rounded-full" onClick={() => setTheme('system')}><Laptop/></Button>
                    </div>
                 </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </CardContent>
        <CardFooter className="flex-col gap-4 pt-8">
            <Button size="lg" onClick={handleSaveChanges} className="w-full rounded-full glow-effect">Save Changes</Button>
             <Button size="lg" variant="outline" onClick={handleSignOut} className="w-full rounded-full flex items-center gap-2">
                <LogOut className="size-4"/>
                Sign Out
            </Button>
          </CardFooter>
      </Card>
    </div>
  );
}
