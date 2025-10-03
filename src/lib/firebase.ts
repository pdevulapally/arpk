import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, serverTimestamp, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { env } from '@/lib/env';

const firebaseConfig = {
  apiKey: env.client.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.client.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.client.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.client.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.client.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.client.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const now = serverTimestamp;
export { Timestamp };


