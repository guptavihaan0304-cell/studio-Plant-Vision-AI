'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, User, CornerDownLeft, Loader2, Volume2, Waves } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { chatWithAssistant } from '@/ai/flows/assistant-flow';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUser, useDoc, useMemoFirebase, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';

type Message = {
  role: 'user' | 'model';
  content: { text: string }[];
  audioDataUri?: string;
  isAudioLoading?: boolean;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!user || user.isAnonymous || !firestore) return null;
    return doc(firestore, `users/${user.uid}`);
  }, [user, firestore]);

  const { data: userProfile } = useDoc(userDocRef);

  const isVoiceAssistantEnabled = userProfile?.isVoiceAssistant ?? false;

  const playAudio = useCallback((audioDataUri: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioDataUri;
      audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
    }
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: [{ text: input }] };
    const assistantMessagePlaceholder: Message = { role: 'model', content: [{ text: '' }], isAudioLoading: isVoiceAssistantEnabled };
    
    setMessages((prev) => [...prev, userMessage, assistantMessagePlaceholder]);
    
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Get text reply from assistant
      const response = await chatWithAssistant({ query: currentInput, history: messages });
      
      let audioDataUri: string | undefined = undefined;

      // Only get audio if the feature is enabled
      if (isVoiceAssistantEnabled) {
          try {
              const audioResponse = await textToSpeech({ text: response.reply });
              audioDataUri = audioResponse.audioDataUri;
          } catch(audioError) {
              console.error("Text to speech failed:", audioError);
              toast({
                  variant: 'destructive',
                  title: 'Audio Error',
                  description: 'Could not generate voice for the response.'
              });
          }
      }
      
      // Update the placeholder message with the actual content
      setMessages((prev) => {
          const newMessages = [...prev];
          const lastMessageIndex = newMessages.length - 1;
          if(newMessages[lastMessageIndex].role === 'model') {
            newMessages[lastMessageIndex].content[0].text = response.reply;
            newMessages[lastMessageIndex].isAudioLoading = false;
            if (audioDataUri) {
                newMessages[lastMessageIndex].audioDataUri = audioDataUri;
                // Autoplay the audio
                playAudio(audioDataUri);
            }
          }
          return newMessages;
      });

    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get a response from the assistant. Please try again.',
      });
      // remove the user message and placeholder if the assistant fails
      setMessages((prev) => prev.slice(0, -2));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 flex flex-col h-[calc(100vh-10rem)]">
      <Card className="flex-1 flex flex-col shadow-xl">
        <CardHeader className="text-center">
           <div className="mx-auto bg-secondary p-3 rounded-full w-fit">
             <Bot className="size-8 text-primary" />
           </div>
          <CardTitle className="font-headline text-3xl mt-4">AI Plant Care Assistant</CardTitle>
          <CardDescription>
            Ask me anything about plant care, diseases, or general gardening tips!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-y-auto p-6">
          <div className="flex-grow space-y-4">
            {messages.length === 0 && !isLoading && (
              <div className="text-center text-muted-foreground h-full flex flex-col justify-center items-center">
                  <Bot className="size-16 mb-4"/>
                  <p className="font-headline">I'm ready to help. Ask me a question!</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'model' && (
                  <Avatar className="w-8 h-8 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.content[0].text ? (
                    <p className="text-sm whitespace-pre-wrap">{message.content[0].text}</p>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Thinking...</span>
                    </div>
                  )}

                  {(message.isAudioLoading || message.audioDataUri) && (
                    <div className="border-t border-border mt-2 pt-2 flex items-center justify-end">
                       {message.isAudioLoading ? (
                           <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Waves className="size-4 animate-pulse" />
                                <span>Generating audio...</span>
                            </div>
                       ) : message.audioDataUri ? (
                           <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => playAudio(message.audioDataUri!)}>
                               <Volume2 className="size-4" />
                               <span className="sr-only">Play audio</span>
                           </Button>
                       ) : null}
                    </div>
                  )}
                </div>
                 {message.role === 'user' && (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      <User size={20} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && messages[messages.length-1]?.role !== 'model' && (
                <div className="flex items-start gap-3 justify-start">
                   <Avatar className="w-8 h-8 border-2 border-primary/50">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={20} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
            )}
          </div>
        </CardContent>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about plant care..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <CornerDownLeft className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </Card>
      <audio ref={audioRef} className="hidden" />
    </div>
  );
}
