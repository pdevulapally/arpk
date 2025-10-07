"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ui/client-sidebar';

export default function ClientProjectsPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = '/login?next=/dashboard/projects';
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
        const q = query(collection(db, 'projects'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
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
      <SidebarProvider defaultOpen={false} storageKey="client:sidebar">
        <ClientSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 px-4 py-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 p-0 grid place-items-center text-muted-foreground hover:text-foreground" />
              <div>
                <h1 className="font-heading text-2xl md:text-3xl">Your Projects</h1>
                <p className="text-muted-foreground">All projects associated with your account.</p>
              </div>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <Link href="/request" className="inline-flex items-center justify-center w-full sm:w-auto h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 active:scale-[.99] text-center">New request</Link>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-8 grid gap-3">
            {busy && <div className="text-sm text-muted-foreground">Loading…</div>}
            {!busy && items.length === 0 && (
              <div className="text-sm text-muted-foreground">No projects yet.</div>
            )}
            {!busy && items.map((p) => (
              <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="rounded-xl border border-border bg-card p-4 hover:bg-accent transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name || p.title || 'Project'}</div>
                    <div className="text-xs text-muted-foreground">{p.status || 'in-progress'}</div>
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


