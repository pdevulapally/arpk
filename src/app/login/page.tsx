"use client";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { useState } from 'react';
import { Header } from '@/components/shared/Header';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function onGoogle() {
    setLoading(true); setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      const role = (snap.data() as any)?.role as ('admin' | 'client' | undefined);
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (e: any) {
      setError(e?.message ?? 'Google sign-in failed');
    } finally { setLoading(false); }
  }
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as any;
    setLoading(true); setError(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, form.email.value, form.password.value);
      const uid = cred.user.uid;
      const snap = await getDoc(doc(db, 'users', uid));
      const role = (snap.data() as any)?.role as ('admin' | 'client' | undefined);
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (e: any) {
      setError(e?.message ?? 'Login failed');
    } finally { setLoading(false); }
  }
  return (
    <>
    <Header />
    <main className="relative px-4 sm:px-6 py-16 sm:py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="max-w-md mx-auto">
        <div className="text-center">
          <h1 className="font-heading text-4xl tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Welcome back</h1>
          <p className="text-muted-foreground mt-2">Log in to manage your projects and requests</p>
        </div>

        <div className="mt-8 relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/40 via-border to-transparent">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:18px_18px] opacity-[0.06]" />
            <form onSubmit={onSubmit} className="relative z-10 p-6 sm:p-8 grid gap-4">
              {/* Social first */}
              <button type="button" disabled={loading} onClick={onGoogle} className="inline-flex items-center justify-center gap-3 rounded-full border border-border px-6 py-3 text-foreground hover:bg-accent/30 disabled:opacity-60">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12 c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20 c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.689,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.197l-6.191-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946 l-6.59,5.078C9.61,39.556,16.319,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.098,5.571c0.001-0.001,0.002-0.001,0.003-0.002 l6.191,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                Continue with Google
              </button>

              {/* Divider */}
              <div className="relative py-2">
                <div className="h-px w-full bg-border" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card/80 px-3 text-xs text-muted-foreground">or</span>
                </div>
              </div>

              {/* Email form */}
              <input name="email" placeholder="Email" type="email" required className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" />
              <input name="password" placeholder="Password" type="password" required className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex items-center justify-between">
                <Link href="/reset" className="text-sm underline text-muted-foreground hover:text-foreground">Forgot password?</Link>
                <button disabled={loading} className="rounded-full px-6 py-3 bg-primary text-primary-foreground disabled:opacity-60">{loading ? 'Logging in…' : 'Log in'}</button>
              </div>
            </form>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center mt-4">No account? <Link href="/signup" className="underline">Sign up</Link></p>
      </div>
    </main>
    </>
  );
}


