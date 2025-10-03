"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/ui/admin-sidebar';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function AdminProjectsPage() {
  const { role, loading } = useUserRole();
  const [busy, setBusy] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  const [clientEmail, setClientEmail] = useState('');
  const [name, setName] = useState('');
  const [websiteType, setWebsiteType] = useState('');
  const [features, setFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (loading || role !== 'admin') return;
      setBusy(true);
      try {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [loading, role]);

  if (loading) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (role !== 'admin') return <main className="max-w-6xl mx-auto px-4 py-12">Access denied.</main>;

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <AdminSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex items-start justify-between px-4 py-4 md:px-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Projects</h1>
              <p className="text-muted-foreground">Create and manage client projects</p>
            </div>
            <span className="lg:hidden"><SidebarTrigger /></span>
          </div>

          <div className="px-4 md:px-6 pb-8 grid gap-6">
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold mb-3">Create Project</h2>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="text-sm">Client Email</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="client@example.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Project Name</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Project name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Website Type</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="Select website type" value={websiteType} onChange={(e) => setWebsiteType(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Features</label>
                  <textarea className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" rows={2} placeholder="List features" value={features} onChange={(e) => setFeatures(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Description</label>
                  <textarea className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" rows={3} placeholder="Project description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Requirements</label>
                  <textarea className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" rows={3} placeholder="Project requirements..." value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Project Budget (£)</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" type="number" placeholder="Enter project budget..." value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Project Deadline</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" placeholder="YYYY-MM-DD" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 flex gap-2 justify-end">
                <button
                  className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60"
                  disabled={creating || !name || !clientEmail}
                  onClick={async () => {
                    setCreating(true);
                    try {
                      const res = await fetch('/api/admin/projects/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          clientEmail: clientEmail.trim(),
                          name: name.trim(),
                          websiteType: websiteType.trim() || undefined,
                          features: features.trim() || undefined,
                          description: description.trim() || undefined,
                          requirements: requirements.trim() || undefined,
                          budget: budget ? Number(budget) : undefined,
                          dueDate: dueDate.trim() || undefined,
                        }),
                      });
                      const json = await res.json();
                      if (!res.ok || !json?.ok) throw new Error(json?.error || 'Failed to create project');
                      alert('Project created: ' + json.projectId);
                      // refresh list
                      const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
                      const snap = await getDocs(q);
                      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })) as any[]);
                      setClientEmail(''); setName(''); setWebsiteType(''); setFeatures(''); setDescription(''); setRequirements(''); setBudget(''); setDueDate('');
                    } catch (e: any) {
                      alert(e.message || 'Failed to create project');
                    } finally {
                      setCreating(false);
                    }
                  }}
                >{creating ? 'Creating…' : 'Create Project'}</button>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold mb-3">All Projects</h2>
              <div className="grid gap-3">
                {busy && <div className="text-sm text-muted-foreground">Loading…</div>}
                {!busy && items.length === 0 && <div className="text-sm text-muted-foreground">No projects yet.</div>}
                {!busy && items.map((p) => (
                  <div key={p.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <div>
                      <div className="font-medium">{p.name || 'Project'}</div>
                      <div className="text-xs text-muted-foreground">{p.status || 'in-progress'} {p.userId ? `• Assigned` : (p.clientEmail ? `• Pending signup (${p.clientEmail})` : '')}</div>
                    </div>
                    <Link href={`/admin/projects/${p.id}`} className="text-sm text-primary">View</Link>
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


