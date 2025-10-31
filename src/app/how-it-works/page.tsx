'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Cog, Leaf, Microscope, Pill, BrainCircuit, MessageSquare, Languages, Database, BarChart, FlaskConical, Target, Telescope } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto max-w-4xl py-8">
      <Card className="bg-card/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto bg-accent/30 p-3 rounded-full w-fit">
            <Cog className="size-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl mt-4">How It Works</CardTitle>
          <CardDescription className="max-w-xl mx-auto">
            A behind-the-scenes look at the AI technology powering PlantVision AI. Our app uses advanced generative AI models to provide you with expert-level plant care.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Leaf className="size-6 text-primary" />
                  <span>Plant & Species Identification</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>When you upload an image, we convert it into a format the AI can understand. This is sent to a powerful vision model with a specific prompt: "You are an expert botanist... identify the plant in this image." The model analyzes the pixels and patterns, compares them to its vast knowledge base of plants, and returns the common and scientific names, along with basic care info like growth rate and water needs.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Microscope className="size-6 text-primary" />
                  <span>Disease Diagnosis</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>Simultaneously, the same image is sent to another AI prompt specialized for plant pathology. The prompt instructs the model: "You are an expert plant pathologist... analyze this image and diagnose any diseases." It looks for signs of distress like discoloration, spots, or pests. If it finds an issue, it provides a diagnosis. If not, it simply returns "Healthy."</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Pill className="size-6 text-primary" />
                  <span>Care & Remedy Suggestions</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>Once we have the plant's name and its diagnosis, we make a third AI call. This time, we send only text: the plant name and the diagnosis result. The prompt is: "You are an expert in organic remedies... suggest natural care tips based on this plant and its issue." The AI then generates a tailored set of recommendations.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <MessageSquare className="size-6 text-primary" />
                  <span>AI Assistant Chat</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>The AI Assistant is a conversational model. When you send a message, we send your query along with the entire chat history to the AI. A system prompt at the beginning tells the model: "You are a friendly and knowledgeable AI Plant Care Assistant." This gives it the context to answer your questions in a helpful, conversational way.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Languages className="size-6 text-primary" />
                  <span>Language Translation</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>When you select a language, the app uses another specialized AI flow. We send the English UI text and your target language to a translation model. The prompt is simple: "Translate the following text into [Your Language]: '[English Text]'." The AI returns the translated text, which we then display in the user interface.</p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <FlaskConical className="size-6 text-primary" />
                  <span>AI & Machine Learning</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>The app uses Convolutional Neural Networks (CNN), a class of deep learning models ideal for image analysis. The CNN learns to identify features like leaf shapes, textures, and color patterns from images. For disease detection, it analyzes anomalies such as spots, discoloration, and textural changes to classify different health issues.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Database className="size-6 text-primary" />
                  <span>Training Dataset</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <p>Our model has been trained on a diverse and extensive dataset of over 50,000+ images of plants. This includes a wide variety of species in different environments and health conditions, ensuring the AI can make accurate identifications and diagnoses across many scenarios.</p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Target className="size-6 text-primary" />
                  <span>Real-World Applications</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Home Gardening:</strong> Helping hobbyists care for their indoor and outdoor plants.</li>
                  <li><strong>Agriculture:</strong> Assisting farmers with early detection of crop diseases, potentially improving yields.</li>
                  <li><strong>Nursery Management:</strong> Enabling nursery staff to quickly identify and manage pest or disease outbreaks.</li>
                  <li><strong>Smart Farming:</strong> Integrating with automated systems for precision care and monitoring.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9">
              <AccordionTrigger className="font-headline text-xl">
                <div className="flex items-center gap-3">
                  <Telescope className="size-6 text-primary" />
                  <span>Future Scope</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground pl-9">
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Smart Plant Sensors:</strong> Integrating with IoT sensors to gather real-time data on soil moisture, light, and nutrients.</li>
                  <li><strong>Plant Health Prediction:</strong> Using historical data to predict potential health issues before they become visible.</li>
                  <li><strong>Automated Watering Systems:</strong> Connecting the app to smart irrigation systems to water plants automatically based on their needs.</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
