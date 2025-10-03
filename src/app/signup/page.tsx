"use client";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Link from 'next/link';
import { auth, db } from '@/src/lib/firebase';
import { useState } from 'react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as any;
    setLoading(true); setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, form.email.value, form.password.value);
      await setDoc(doc(db, 'users', cred.user.uid), { role: 'client', name: form.name.value, email: form.email.value });
      window.location.href = '/dashboard';
    } catch (e: any) {
      setError(e?.message ?? 'Signup failed');
    } finally { setLoading(false); }
  }
  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl">Sign up</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input name="name" placeholder="Full name" required className="bg-transparent border border-white/15 rounded-xl px-4 py-3" />
        <input name="email" placeholder="Email" type="email" required className="bg-transparent border border-white/15 rounded-xl px-4 py-3" />
        <input name="password" placeholder="Password" type="password" required className="bg-transparent border border-white/15 rounded-xl px-4 py-3" />
        <button disabled={loading} className="rounded-2xl px-5 py-3 bg-accent text-surface disabled:opacity-60">{loading ? 'Creating…' : 'Create account'}</button>
        {error && <p className="text-red-400">{error}</p>}
        <p className="text-sm text-muted">Already have an account? <Link href="/login" className="underline">Log in</Link></p>
      </form>
    </main>
  );
}


