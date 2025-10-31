'use client';
import {
  Auth,
  signInAnonymously,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

/** Initiate anonymous sign-in (non-blocking). */
export function initiateAnonymousSignIn(authInstance: Auth): void {
  signInAnonymously(authInstance);
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
    await authInstance.signOut();
    
    return true;
  } catch (error) {
    console.error("Sign up failed:", error);
    // In a real app, you'd want to use the toast hook or another way
    // to display this error to the user.
    return false;
  }
}

/** Initiate email/password sign-in (non-blocking). */
export function initiateEmailSignIn(authInstance: Auth, email: string, password: string): void {
  signInWithEmailAndPassword(authInstance, email, password);
}
