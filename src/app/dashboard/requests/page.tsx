"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ui/client-sidebar';

export default function ClientRequestsPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = '/login?next=/dashboard/requests';
        return;
      }
      setUid(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      setBusy(true);
      try {
        const q = query(collection(db, 'requests'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [uid]);

  if (!uid) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <ClientSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex items-start justify-between px-4 py-4 md:px-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl">Your Requests</h1>
              <p className="text-muted-foreground">Track all requests you have submitted.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="lg:hidden"><SidebarTrigger /></span>
              <Link href="/request" className="rounded-2xl px-4 py-2 bg-primary text-primary-foreground">New request</Link>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-8 grid gap-3">
            {busy && <div className="text-sm text-muted-foreground">Loading…</div>}
            {!busy && items.length === 0 && (
              <div className="text-sm text-muted-foreground">No requests yet.</div>
            )}
            {!busy && items.map((r) => (
              <Link key={r.id} href={`/dashboard/requests/${r.id}`} className="rounded-xl border border-border bg-card p-4 hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.projectType || r.title || 'Request'}</div>
                    <div className="text-xs text-muted-foreground">{r.status || 'submitted'}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">View</div>
                </div>
              </Link>
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}


