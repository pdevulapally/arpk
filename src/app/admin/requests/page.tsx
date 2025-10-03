"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cols } from "@/lib/firebase-collections";
import { useUserRole } from "@/hooks/useUserRole";
import { Check, X, ArrowRight, FileText } from "lucide-react";

export default function AdminRequestsPage() {
  const { role, loading } = useUserRole();
  const [requests, setRequests] = useState<any[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const snap = await getDocs(collection(db, "requests"));
        setRequests(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      } finally {
        setFetching(false);
      }
    };
    if (role === 'admin') load();
  }, [role]);

  if (loading) return <main className="max-w-7xl mx-auto px-4 py-8">Loading…</main>;
  if (role !== 'admin') return <main className="max-w-7xl mx-auto px-4 py-8">Admins only.</main>;

  const updateStatus = async (id: string, status: 'accepted' | 'rejected') => {
    setBusyId(id);
    try {
      if (status === 'accepted') {
        const r = requests.find(x => x.id === id);
        // Create project directly with client credentials (passes admin rules)
        const projectRef = await addDoc(cols.projects(), {
          name: r?.projectType || 'Project',
          status: 'in-progress',
          userId: r?.userId || undefined,
          clientEmail: r?.contact?.email || undefined,
          progress: 0,
          dueDate: r?.timelineTarget || '',
          websiteType: r?.projectType || '',
          features: Array.isArray(r?.features) ? r.features.join(', ') : '',
          description: r?.style || '',
          requirements: Array.isArray(r?.pages) ? r.pages.join(', ') : '',
          budget: 0,
        } as any);
        await updateDoc(doc(db, 'requests', id), { status, projectId: projectRef.id });
        setRequests(prev => prev.map(rr => rr.id === id ? { ...rr, status, projectId: projectRef.id } : rr));
      } else {
        await updateDoc(doc(db, 'requests', id), { status });
        setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      }
    } finally {
      setBusyId(null);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Requests</h1>
        <p className="text-muted-foreground">Review incoming project requests</p>
      </div>

      <div className="grid gap-4">
        {fetching && <p className="text-muted-foreground">Fetching…</p>}
        {!fetching && requests.length === 0 && (
          <div className="rounded-xl border border-border p-6 text-center text-muted-foreground">No requests yet.</div>
        )}
        {requests.map((r) => (
          <div key={r.id} className="rounded-xl border border-border p-4 bg-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold text-foreground">{r.projectType || 'Project Request'}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">From: {r?.contact?.name} · {r?.contact?.email}</p>
                <p className="text-sm text-muted-foreground">Status: {r.status ?? 'new'}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/requests/${r.id}`} className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 hover:bg-accent transition-colors">
                  View <ArrowRight className="h-3 w-3" />
                </Link>
                <button onClick={() => updateStatus(r.id, 'accepted')} disabled={busyId === r.id} className="inline-flex items-center gap-2 rounded-lg bg-green-600 text-white px-3 py-2 disabled:opacity-50">
                  <Check className="h-4 w-4"/> Accept
                </button>
                <button onClick={() => updateStatus(r.id, 'rejected')} disabled={busyId === r.id} className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-3 py-2 disabled:opacity-50">
                  <X className="h-4 w-4"/> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
