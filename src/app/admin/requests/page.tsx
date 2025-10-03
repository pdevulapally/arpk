"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, getDocs, updateDoc, doc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cols } from "@/lib/firebase-collections";
import { useUserRole } from "@/hooks/useUserRole";
import { Check, X, ArrowRight, FileText, ArrowLeft } from "lucide-react";

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
      <div className="mb-4 sm:mb-6 flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Requests</h1>
          <p className="text-muted-foreground">Review incoming project requests</p>
        </div>
        <Link href="/admin" className="hidden sm:inline-flex items-center gap-2 text-sm rounded-lg border border-border px-3 py-2 hover:bg-accent">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
        </Link>
      </div>
      <div className="sm:hidden mb-4">
        <Link href="/admin" className="inline-flex w-full justify-center items-center gap-2 rounded-lg border border-border px-3 h-10 hover:bg-accent">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>
      </div>

      <div className="grid gap-4">
        {fetching && <p className="text-muted-foreground">Fetching…</p>}
        {!fetching && requests.length === 0 && (
          <div className="rounded-xl border border-border p-6 text-center text-muted-foreground">No requests yet.</div>
        )}
        {requests.map((r) => {
          const normalizedStatus = String(r.status ?? 'new').toLowerCase();
          const isAccepted = normalizedStatus === 'accepted';
          const isRejected = normalizedStatus === 'rejected';
          const statusClasses = isAccepted
            ? 'bg-green-500/15 text-green-600 border-green-500/30'
            : isRejected
            ? 'bg-red-500/15 text-red-600 border-red-500/30'
            : 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30';

          return (
            <div key={r.id} className="rounded-xl border border-border p-3 sm:p-4 bg-card">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-foreground truncate text-base sm:text-sm">{r.projectType || 'Project Request'}</h3>
                  </div>
                  <p className="text-[13px] sm:text-sm text-muted-foreground mt-1 truncate">
                    From: {r?.contact?.name}
                    {r?.contact?.email ? (
                      <span className="ml-1 break-words">· {r?.contact?.email}</span>
                    ) : null}
                  </p>
                  <p className="text-[13px] sm:text-sm text-muted-foreground mt-1">
                    <span className="mr-2">Status:</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] sm:text-xs capitalize ${statusClasses}`}>
                      {normalizedStatus}
                    </span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:auto-cols-max sm:grid-flow-col gap-2 w-full sm:w-auto">
                  <Link href={`/admin/requests/${r.id}`} className="inline-flex justify-center items-center gap-2 rounded-lg border border-border px-3 h-9 hover:bg-accent transition-colors w-full">
                    View <ArrowRight className="h-3 w-3" />
                  </Link>
                  <button
                    onClick={() => updateStatus(r.id, 'accepted')}
                    disabled={busyId === r.id || isAccepted}
                    className={`inline-flex justify-center items-center gap-2 rounded-lg px-3 h-9 w-full sm:w-auto disabled:opacity-70 ${
                      'bg-green-600 text-white'
                    }`}
                  >
                    <Check className="h-4 w-4"/> {isAccepted ? 'Accepted' : 'Accept'}
                  </button>
                  <button
                    onClick={() => updateStatus(r.id, 'rejected')}
                    disabled={busyId === r.id || isRejected}
                    className={`inline-flex justify-center items-center gap-2 rounded-lg px-3 h-9 w-full sm:w-auto disabled:opacity-70 ${
                      'bg-red-600 text-white'
                    }`}
                  >
                    <X className="h-4 w-4"/> {isRejected ? 'Rejected' : 'Reject'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
