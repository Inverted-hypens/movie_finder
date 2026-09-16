import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import type { User, UserCredential } from 'firebase/auth'
import { auth } from './firebaseService'

function readableAuthError(caughtError: unknown): Error {
  const code =
    typeof caughtError === 'object' &&
    caughtError !== null &&
    'code' in caughtError &&
    typeof caughtError.code === 'string'
      ? caughtError.code
      : ''

  const messages: Record<string, string> = {
    'auth/email-already-in-use': 'This email address is already registered.',
    'auth/invalid-credential': 'The email or password is incorrect.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/network-request-failed': 'A network error prevented authentication.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/weak-password': 'Password must be at least six characters.',
  }

  return new Error(
    messages[code] ??
      (caughtError instanceof Error
        ? caughtError.message
        : 'Authentication failed.'),
  )
}

export async function registerUser(
  email: string,
  password: string,
): Promise<UserCredential> {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (caughtError) {
    throw readableAuthError(caughtError)
  }
}

export async function loginUser(
  email: string,
  password: string,
): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (caughtError) {
    throw readableAuthError(caughtError)
  }
}

export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth)
  } catch (caughtError) {
    throw readableAuthError(caughtError)
  }
}

export function subscribeToAuthChanges(
  callback: (user: User | null) => void,
): () => void {
  return onAuthStateChanged(auth, callback)
}
