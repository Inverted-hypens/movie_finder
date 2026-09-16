import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  setDoc,
} from 'firebase/firestore'
import type { Movie } from '../types/movie'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const firebaseApp = getApps()[0] ?? initializeApp(firebaseConfig)

export const db = getFirestore(firebaseApp)
export const auth = getAuth(firebaseApp)

function favouritesCollection(userId: string) {
  return collection(db, 'users', userId, 'favourites')
}

function validateUserId(userId: string) {
  if (!userId.trim()) {
    throw new Error('A user ID is required to manage favourites.')
  }
}

function readableError(operation: string, caughtError: unknown) {
  const message = caughtError instanceof Error ? caughtError.message : 'Unknown error'
  return new Error(`Unable to ${operation} favourites: ${message}`)
}

export async function addFavourite(
  userId: string,
  movie: Movie,
): Promise<void> {
  validateUserId(userId)

  try {
    const favouriteReference = doc(favouritesCollection(userId), movie.imdbID)
    await setDoc(favouriteReference, movie)
  } catch (caughtError) {
    throw readableError('add', caughtError)
  }
}

export async function removeFavourite(
  userId: string,
  imdbID: string,
): Promise<void> {
  validateUserId(userId)

  try {
    const favouriteReference = doc(favouritesCollection(userId), imdbID)
    await deleteDoc(favouriteReference)
  } catch (caughtError) {
    throw readableError('remove', caughtError)
  }
}

export async function getFavourites(userId: string): Promise<Movie[]> {
  validateUserId(userId)

  try {
    const snapshot = await getDocs(favouritesCollection(userId))
    return snapshot.docs.map((favourite) => favourite.data() as Movie)
  } catch (caughtError) {
    throw readableError('load', caughtError)
  }
}
