import { collection, CollectionReference, DocumentData, FirestoreDataConverter, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ContactSubmission, Invoice, Project, RequestDoc, UserDoc } from '@/lib/types';

function withCreatedAt<T extends { createdAt?: unknown }>(data: T): T {
  return {
    ...data,
    createdAt: data.createdAt ?? serverTimestamp(),
  } as T;
}

function createConverter<T>(): FirestoreDataConverter<T> {
  return {
    toFirestore(data: T): DocumentData {
      return withCreatedAt(data as any);
    },
    fromFirestore(snap) {
      return snap.data() as T;
    },
  };
}

function col<T>(path: string): CollectionReference<T> {
  return collection(db, path).withConverter(createConverter<T>());
}

export const cols = {
  contactSubmissions: () => col<ContactSubmission>('contactSubmissions'),
  contacts: () => col<Record<string, unknown>>('contacts'),
  notifications: () => col<Record<string, unknown>>('notifications'),
  projects: () => col<Project>('projects'),
  requests: () => col<RequestDoc>('requests'),
  settings: () => col<Record<string, unknown>>('settings'),
  users: () => col<UserDoc>('users'),
  invoices: () => col<Invoice>('invoices'), // new collection allowed
  payouts: () => col<{ projectId: string; amount: number; createdAt?: unknown }>('payouts'), // new collection allowed
};


