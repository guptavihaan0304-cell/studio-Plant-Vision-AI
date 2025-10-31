'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance).catch(error => {
      console.error("Anonymous sign in failed:", error);
  });
}

/** Initiate email/password sign-up (non-blocking) and send verification email. */
export async function initiateEmailSignUp(
  authInstance: Auth,
  email: string,
  password: string,
  username: string
): Promise<boolean> {
  try {
    const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
    const user = userCredential.user;
    
    // Update profile with username
    await updateProfile(user, { displayName: username });
    
    // Send verification email
    await sendEmailVerification(user);

    // Sign the user out until they are verified
    await signOut(authInstance);
    
    return true;
  } catch (error) {
    console.error("Sign up failed:", error);
    return false;
  }
}

/** Initiate email/password sign-in (non-blocking). */
export async function initiateEmailSignIn(authInstance: Auth, email: string, password: string): Promise<boolean> {
  try {
      await signInWithEmailAndPassword(authInstance, email, password);
      // The onAuthStateChanged listener in the provider will handle the redirect.
      return true;
  } catch(error) {
      console.error("Sign in failed:", error);
      return false;
  }
}

    