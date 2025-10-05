"use client";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

export default function ProfilePage() {
  const [uid, setUid] = useState<string | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [billing, setBilling] = useState<{ invoices: number; due: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        window.location.href = "/login?next=/profile";
        return;
      }
      setUid(u.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const run = async () => {
      if (!uid) return;
      setLoading(true);
      try {
        const userSnap = await getDoc(doc(db, "users", uid));
        const authUser = auth.currentUser;
        const data = userSnap.exists() ? userSnap.data() as any : {};
        setProfile({
          name: data?.name || data?.displayName || authUser?.displayName || "Unnamed",
          email: data?.email || authUser?.email || "",
          role: data?.role || "user",
          photoURL: data?.photoURL || data?.avatarUrl || authUser?.photoURL || null,
          emailVerified: !!authUser?.emailVerified,
          providerIds: (authUser?.providerData || []).map(p => p.providerId),
          createdAt: authUser?.metadata?.creationTime || null,
          lastSignInAt: authUser?.metadata?.lastSignInTime || null,
          uid,
        });

        // Billing summary
        const iv = query(collection(db, 'invoices'), where('userId', '==', uid));
        const ivSnap = await getDocs(iv);
        const invoices = ivSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        const due = invoices.reduce((sum, inv) => sum + (inv.status === 'due' ? (inv.amount || 0) : 0), 0);
        setBilling({ invoices: invoices.length, due });
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [uid]);

  const initial = useMemo(() => (profile?.name || profile?.email || 'U').slice(0,1).toUpperCase(), [profile]);

  const handleVerifyEmail = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      alert('Verification email sent. Please check your inbox.');
    } catch (e) {
      alert('Failed to send verification email.');
    }
  };

  const handleResetPassword = async () => {
    const email = profile?.email;
    if (!email) return;
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent.');
    } catch (e) {
      alert('Failed to send password reset email.');
    }
  };

  if (!uid || loading) {
    return <main className="max-w-5xl mx-auto px-4 py-12">Loading…</main>;
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-4">
        <Link href="/" className="text-sm text-primary hover:underline">← Back to home</Link>
      </div>
      {/* Header card */}
      <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {profile?.photoURL ? (
            <img src={profile.photoURL} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 grid place-items-center text-lg font-semibold">
              {initial}
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-semibold">{profile?.name}</h1>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] capitalize ${profile?.role==='admin' ? 'bg-purple-500/15 text-purple-600 border-purple-500/30' : 'bg-blue-500/15 text-blue-600 border-blue-500/30'}`}>{profile?.role}</span>
              {profile?.emailVerified ? (
                <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] bg-green-500/15 text-green-600 border-green-500/30">Email verified</span>
              ) : (
                <button onClick={handleVerifyEmail} className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] hover:bg-accent">Verify email</button>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{profile?.email}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/dashboard" className="rounded-lg border px-3 py-2 text-sm hover:bg-accent">Dashboard</Link>
            <button onClick={handleResetPassword} className="rounded-lg border px-3 py-2 text-sm hover:bg-accent">Reset password</button>
          </div>
        </div>
      </section>

      {/* Details grid */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-medium mb-3">Account details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">UID</span><code className="text-xs">{profile?.uid}</code></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Providers</span><span>{(profile?.providerIds || []).join(', ') || 'password'}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Created</span><span>{profile?.createdAt || '-'}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Last sign-in</span><span>{profile?.lastSignInAt || '-'}</span></div>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-medium mb-3">Billing summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Invoices</span><span>{billing?.invoices ?? 0}</span></div>
            <div className="flex items-center justify-between"><span className="text-muted-foreground">Amount due</span><span>£{((billing?.due || 0).toLocaleString())}</span></div>
            <div className="pt-2"><Link href="/dashboard/invoices" className="text-primary text-sm">View invoices</Link></div>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-medium mb-3">Shortcuts</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          <Link href="/dashboard/requests" className="rounded-lg border px-3 py-2 hover:bg-accent">My requests</Link>
          <Link href="/dashboard/projects" className="rounded-lg border px-3 py-2 hover:bg-accent">My projects</Link>
          <Link href="/dashboard/invoices" className="rounded-lg border px-3 py-2 hover:bg-accent">My invoices</Link>
          <Link href="/request" className="rounded-lg border px-3 py-2 hover:bg-accent">New request</Link>
        </div>
      </section>
    </main>
  );
}


