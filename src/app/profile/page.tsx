'use client';

import { useEffect, useState } from 'react';
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
import { useAuth, useUser } from '@/firebase';
import {
  initiateAnonymousSignIn,
  initiateEmailSignUp,
  initiateEmailSignIn,
} from '@/firebase/non-blocking-login';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Sprout, User, KeyRound, MailCheck, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { SettingsPageContent } from '@/components/settings-content';

function AuthComponent() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);

  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    await initiateAnonymousSignIn(auth);
    router.push('/dashboard');
    setIsLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (isSigningUp) {
      if (password !== confirmPassword) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: 'Passwords do not match.',
        });
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: 'Password must be at least 6 characters long.',
        });
        setIsLoading(false);
        return;
      }
      const signUpSuccessful = await initiateEmailSignUp(auth, email, password, username);
      if (signUpSuccessful) {
        setAwaitingVerification(true);
        toast({
            title: 'Verification Email Sent',
            description: 'Please check your inbox to verify your account before logging in.',
            duration: 10000,
        })
      } else {
         toast({
          variant: 'destructive',
          title: 'Sign Up Failed',
          description: 'Could not create account. The email might already be in use.',
        });
      }
      setIsLoading(false);
    } else {
        const signInSuccessful = await initiateEmailSignIn(auth, email, password);
        if(!signInSuccessful) {
             toast({
                variant: 'destructive',
                title: 'Sign In Failed',
                description: 'Incorrect email or password, or your email has not been verified.',
            });
            setIsLoading(false);
        } else {
          router.push('/dashboard');
        }
    }
  };

  if (awaitingVerification) {
      return (
         <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md mx-auto glassmorphic-panel text-center">
             <CardHeader>
                <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit soft-glow">
                  <MailCheck className="text-primary size-10" />
                </div>
                <CardTitle className="font-headline text-3xl text-primary">Verify Your Email</CardTitle>
                <CardDescription>
                    We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to finish setting up your account.
                </CardDescription>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground">You can close this page after verifying.</p>
             </CardContent>
             <CardFooter>
                 <Button variant="outline" className="w-full rounded-full" onClick={() => {
                     setAwaitingVerification(false);
                     setIsSigningUp(false);
                     if (auth.currentUser) {
                       signOut(auth);
                     }
                 }}>
                    Back to Login
                 </Button>
             </CardFooter>
          </Card>
        </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md mx-auto glassmorphic-panel">
        <CardHeader className="text-center">
            <div className="mx-auto bg-primary/20 p-3 rounded-full w-fit soft-glow">
              <Sprout className="text-primary size-10" />
            </div>
          <CardTitle className="font-headline text-3xl text-primary">
            {isSigningUp ? 'Create an Account' : 'Welcome Back'}
          </CardTitle>
          <CardDescription>
            {isSigningUp ? 'Join to save your plant analyses.' : 'Sign in to access your dashboard.'}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleEmailAuth}>
          <CardContent className="space-y-4">
             {isSigningUp && (
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 rounded-full"
                    />
                </div>
             )}
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
                    className="pl-10 rounded-full"
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
                    className="pl-10 rounded-full"
                />
            </div>
             {isSigningUp && (
                <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-10 rounded-full"
                    />
                </div>
             )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full rounded-full glow-effect" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 animate-spin" />}
              {isLoading ? 'Please wait...' : (isSigningUp ? 'Sign Up' : 'Sign In')}
            </Button>
            
            <div className="flex items-center w-full">
                <Separator className="flex-1" />
                <span className="px-4 text-xs text-muted-foreground">OR</span>
                <Separator className="flex-1" />
            </div>

            <Button
              variant="outline"
              className="w-full rounded-full"
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
                <Button variant="link" className="p-0 h-auto text-primary" onClick={() => {
                    setIsSigningUp(!isSigningUp);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                    setUsername('');
                }}>
                {isSigningUp ? 'Sign In' : 'Sign Up'}
                </Button>
            </p>
         </div>
      </Card>
    </div>
  );
}


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    if (!isUserLoading) {
        setAuthChecked(true);
    }
  }, [isUserLoading]);

  if (!authChecked) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <Loader2 className="size-12 animate-spin text-primary" />
        </div>
    )
  }

  if (user && !user.isAnonymous) {
    return <SettingsPageContent />;
  }

  return <AuthComponent />;
}

    