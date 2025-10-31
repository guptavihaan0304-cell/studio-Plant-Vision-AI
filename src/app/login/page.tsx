'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import {
  initiateAnonymousSignIn,
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Leaf, User, KeyRound } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { Separator } from '@/components/ui/separator';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/');
    }
  });

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    initiateAnonymousSignIn(auth);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigningUp && password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }
    setIsLoading(true);
    if (isSigningUp) {
        initiateEmailSignUp(auth, email, password);
    } else {
        initiateEmailSignIn(auth, email, password);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4 shadow-xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-4">
              <Leaf className="text-primary size-10" />
            </div>
          <CardTitle className="font-headline text-3xl">
            {isSigningUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSigningUp ? 'Join to save your plant analyses.' : 'Sign in to access your dashboard.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailAuth}>
          <CardContent className="space-y-4">
            <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                />
            </div>
            <div className="relative">
                 <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                 <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10"
                />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Please wait...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
            </Button>
            
            <div className="flex items-center w-full">
                <Separator className="flex-1" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full"
              onClick={handleAnonymousSignIn}
              disabled={isLoading}
              type="button"
            >
              Continue as Guest
            </Button>

          </CardFooter>
        </form>
         <div className="p-6 pt-0 text-center">
            <p className="text-sm">
                {isSigningUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <Button variant="link" className="p-0 h-auto" onClick={() => {
                    setIsSigningUp(!isSigningUp);
                    setEmail('');
                    setPassword('');
                }}>
                {isSigningUp ? 'Sign In' : 'Sign Up'}
                </Button>
            </p>
         </div>
      </Card>
    </div>
  );
}
