"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { SidebarProvider, SidebarInset, SidebarTrigger, SidebarOverlay } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ui/client-sidebar';

export default function ClientDashboard() {
  const { role, loading } = useUserRole();
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [stats, setStats] = useState({ requests: 0, projects: 0, invoices: 0, due: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = '/login?next=/dashboard';
        return;
      }
      setUid(user.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!uid || (role !== 'client' && role !== 'user')) return;
      setBusy(true);
      try {
        const rq = query(collection(db, 'requests'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
        const rqSnap = await getDocs(rq);
        const requests = rqSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const pj = query(collection(db, 'projects'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
        const pjSnap = await getDocs(pj);
        const projects = pjSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const iv = query(collection(db, 'invoices'), where('userId', '==', uid), orderBy('createdAt', 'desc'));
        const ivSnap = await getDocs(iv);
        const invoices = ivSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        const due = invoices.reduce((sum, inv: any) => sum + (inv.status === 'due' ? (inv.amount || 0) : 0), 0);

        setStats({ requests: requests.length, projects: projects.length, invoices: invoices.length, due });
        setRecentRequests(requests.slice(0, 5));
        setRecentProjects(projects.slice(0, 5));
        setRecentInvoices(invoices.slice(0, 5));
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [uid, role]);

  if (loading || !uid) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (role !== 'client' && role !== 'user') return <main className="max-w-6xl mx-auto px-4 py-12">Access denied.</main>;

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <ClientSidebar />
        <SidebarOverlay />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between px-4 py-4 md:px-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl">Welcome</h1>
              <p className="text-muted-foreground">Your projects, requests, and invoices at a glance.</p>
            </div>
            <div className="flex w-full sm:w-auto items-center gap-2">
              <span className="lg:hidden"><SidebarTrigger /></span>
              <Link href="/request" className="inline-flex items-center justify-center w-full sm:w-auto h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-0 active:scale-[.99]">New request</Link>
            </div>
          </div>

          <div className="px-4 md:px-6 mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">Requests</div>
          <div className="text-2xl font-semibold mt-1">{busy ? '…' : stats.requests}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">Projects</div>
          <div className="text-2xl font-semibold mt-1">{busy ? '…' : stats.projects}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">Invoices</div>
          <div className="text-2xl font-semibold mt-1">{busy ? '…' : stats.invoices}</div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="text-sm text-muted-foreground">Amount Due</div>
          <div className="text-2xl font-semibold mt-1">{busy ? '…' : `£${(stats.due || 0).toLocaleString()}`}</div>
        </div>
          </div>

          <div className="px-4 md:px-6 mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Requests</h3>
            <Link href="/dashboard/requests" className="text-sm text-primary">View all</Link>
              </div>
              <div className="space-y-3">
            {recentRequests.length === 0 && <div className="text-sm text-muted-foreground">No requests yet.</div>}
            {recentRequests.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="font-medium">{r.projectType || r.title || 'Request'}</div>
                  <div className="text-xs text-muted-foreground">{r.status || 'submitted'}</div>
                </div>
                <Link href={`/dashboard/requests/${r.id}`} className="text-sm text-primary">Open</Link>
              </div>
            ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Projects</h3>
            <Link href="/dashboard/projects" className="text-sm text-primary">View all</Link>
              </div>
              <div className="space-y-3">
            {recentProjects.length === 0 && <div className="text-sm text-muted-foreground">No projects yet.</div>}
            {recentProjects.map((p: any) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="font-medium">{p.name || p.title || 'Project'}</div>
                  <div className="text-xs text-muted-foreground">{p.status || 'in-progress'}</div>
                </div>
                <Link href={`/dashboard/projects/${p.id}`} className="text-sm text-primary">Open</Link>
              </div>
            ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent Invoices</h3>
            <Link href="/dashboard/invoices" className="text-sm text-primary">View all</Link>
              </div>
              <div className="space-y-3">
            {recentInvoices.length === 0 && <div className="text-sm text-muted-foreground">No invoices yet.</div>}
            {recentInvoices.map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <div className="font-medium">Invoice #{inv.number || inv.id.slice(0,6)}</div>
                  <div className="text-xs text-muted-foreground">{inv.status || 'pending'}</div>
                </div>
                <div className="text-sm">£{(inv.amount || 0).toLocaleString()}</div>
              </div>
            ))}
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
