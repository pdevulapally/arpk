"use client";
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useState } from 'react';

export default function ResetPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as any;
    setLoading(true); setMsg(null);
    try {
      await sendPasswordResetEmail(auth, form.email.value);
      setMsg('Email sent. Check your inbox.');
    } finally { setLoading(false); }
  }
  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl">Reset password</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input name="email" placeholder="Email" type="email" required className="bg-transparent border border-white/15 rounded-xl px-4 py-3" />
        <button disabled={loading} className="rounded-2xl px-5 py-3 bg-accent text-surface disabled:opacity-60">{loading ? 'Sending…' : 'Send reset email'}</button>
        {msg && <p className="text-green-400">{msg}</p>}
      </form>
    </main>
  );
}


