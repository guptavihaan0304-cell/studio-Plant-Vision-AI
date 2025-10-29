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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/firebase';
import {
  initiateAnonymousSignIn,
  initiateEmailSignIn,
  initiateEmailSignUp,
} from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Leaf } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      router.push('/');
    }
  });

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    initiateAnonymousSignIn(auth);
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    initiateEmailSignIn(auth, email, password);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Sign Up Failed',
        description: 'Password must be at least 6 characters long.',
      });
      return;
    }
    setIsLoading(true);
    initiateEmailSignUp(auth, email, password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4 md:p-0">
        <div className="flex justify-center mb-6">
          <Leaf className="text-primary size-12" />
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your saved plant analyses.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSignIn}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-login">Email</Label>
                    <Input
                      id="email-login"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input
                      id="password-login"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleAnonymousSignIn}
                    disabled={isLoading}
                    type="button"
                  >
                    {isLoading ? 'Please wait...' : 'Continue as Guest'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Create an Account</CardTitle>
                <CardDescription>
                  Join to save your plant analyses and track their health.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleEmailSignUp}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-signup">Email</Label>
                    <Input
                      id="email-signup"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-signup">Password</Label>
                    <Input
                      id="password-signup"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
