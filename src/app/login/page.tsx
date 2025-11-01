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
import { User, KeyRound, MailCheck, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { signOut } from 'firebase/auth';
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [awaitingVerification, setAwaitingVerification] = useState(false);
  
  // This state helps prevent a "flicker" on page load if the user is already signed in.
  const [hasCheckedUser, setHasCheckedUser] = useState(false);


  useEffect(() => {
    if (!isUserLoading) {
      setHasCheckedUser(true);
      if (user) {
        // Redirect verified, non-anonymous users to the dashboard.
        // Anonymous users or those pending verification can stay on /login if they need to sign up/in properly.
        if (!user.isAnonymous && user.emailVerified) {
          router.push('/dashboard');
        }
      }
    }
  }, [user, isUserLoading, router]);


  const handleAnonymousSignIn = async () => {
    setIsLoading(true);
    initiateAnonymousSignIn(auth);
    // The useEffect will handle the redirect
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
        }
        // For successful sign-in, the useEffect will handle the redirect.
    }
  };
  
  // Display a loading spinner until the initial user check is complete.
  if (!hasCheckedUser) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <Loader2 className="size-12 animate-spin text-primary" />
        </div>
    )
  }
  
  if (awaitingVerification) {
      return (
         <div className="flex items-center justify-center min-h-screen bg-background p-4">
          <Card className="w-full max-w-md mx-4 shadow-xl text-center rounded-2xl">
             <CardHeader>
                <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-4">
                  <MailCheck className="text-primary size-10" />
                </div>
                <CardTitle className="font-headline text-3xl">Verify Your Email</CardTitle>
                <CardDescription>
                    We've sent a verification link to <strong>{email}</strong>. Please check your inbox and click the link to finish setting up your account.
                </CardDescription>
             </CardHeader>
             <CardContent>
                <p className="text-sm text-muted-foreground">You can close this page after verifying.</p>
             </CardContent>
             <CardFooter>
                 <Button variant="outline" className="w-full" onClick={() => {
                     setAwaitingVerification(false);
                     setIsSigningUp(false);
                     if (auth.currentUser) {
                        signOut(auth); // Clear any partial auth state
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
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-md mx-4 shadow-xl rounded-2xl">
        <CardHeader className="text-center">
            <div className="mx-auto bg-secondary p-3 rounded-full w-fit mb-4">
              <Logo className="text-primary size-10" />
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
             {isSigningUp && (
                <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        id="username"
                        type="text"
                        placeholder="Username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>
             )}
            <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
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
                 <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
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
             {isSigningUp && (
                <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={isLoading}
                        className="pl-10"
                    />
                </div>
             )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isLoading}>
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
