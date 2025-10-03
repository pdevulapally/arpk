"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserRole } from "@/hooks/useUserRole";
import { CheckCircle2, CircleX, FileText, ArrowLeft } from "lucide-react";

export default function AdminRequestDetailPage() {
  const { role, loading } = useUserRole();
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [data, setData] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [quote, setQuote] = useState<string>("");
  const [status, setStatus] = useState<string>("new");

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const ref = doc(db, "requests", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const value = { id: snap.id, ...(snap.data() as any) };
        setData(value);
        setQuote(value.quoteAmount ?? "");
        setStatus(value.status ?? "new");
      }
    };
    if (role === 'admin') load();
  }, [id, role]);

  if (loading) return <main className="max-w-5xl mx-auto px-4 py-8">Loading…</main>;
  if (role !== 'admin') return <main className="max-w-5xl mx-auto px-4 py-8">Admins only.</main>;
  if (!data) return <main className="max-w-5xl mx-auto px-4 py-8">Not found.</main>;

  const saveStatus = async (next: string) => {
    setSaving(true);
    try {
      await updateDoc(doc(db, 'requests', id), { status: next });
      setStatus(next);
    } finally {
      setSaving(false);
    }
  };

  const saveQuote = async () => {
    setSaving(true);
    try {
      const amount = Number(quote);
      await updateDoc(doc(db, 'requests', id), { quoteAmount: amount, status: 'quoted' });
      setStatus('quoted');
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/admin/requests" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4"/> Back
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold">Request Details</h1>
        </div>
        <div className="grid grid-cols-2 sm:auto-cols-max sm:grid-flow-col gap-2 w-full sm:w-auto">
          <button onClick={() => saveStatus('accepted')} disabled={saving} className="inline-flex justify-center items-center gap-2 rounded-lg bg-green-600 text-white px-3 h-10 disabled:opacity-50">
            <CheckCircle2 className="h-4 w-4"/> Accept
          </button>
          <button onClick={() => saveStatus('rejected')} disabled={saving} className="inline-flex justify-center items-center gap-2 rounded-lg bg-red-600 text-white px-3 h-10 disabled:opacity-50">
            <CircleX className="h-4 w-4"/> Reject
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border border-border p-6 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary"/>
            <h2 className="font-semibold">Overview</h2>
          </div>
          <div className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Contact</p>
              <p className="text-foreground">{data?.contact?.name} — {data?.contact?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Project Type</p>
              <p className="text-foreground">{data?.projectType || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Budget Range</p>
              <p className="text-foreground">{data?.budgetRange || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Timeline</p>
              <p className="text-foreground">{data?.timelineTarget || 'N/A'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="text-foreground capitalize">{status}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="font-semibold mb-3">Quote Project</h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="number"
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Enter quote amount (£)"
              className="w-full sm:w-64 rounded-lg border border-border bg-background px-3 py-2"
            />
            <button onClick={saveQuote} disabled={saving || !quote} className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 h-10 py-2 disabled:opacity-50 w-full sm:w-auto justify-center">
              Save Quote
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Client will see this amount on their dashboard once approved.</p>
        </div>

        <div className="rounded-xl border border-border p-6 bg-card">
          <h2 className="font-semibold mb-3">Requested Items</h2>
          <div className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <p className="text-muted-foreground">Goals</p>
              <ul className="list-disc ml-5 mt-1">
                {(data?.goals ?? []).map((g: string, i: number) => (<li key={i}>{g}</li>))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground">Pages</p>
              <ul className="list-disc ml-5 mt-1">
                {(data?.pages ?? []).map((p: string, i: number) => (<li key={i}>{p}</li>))}
              </ul>
            </div>
            <div>
              <p className="text-muted-foreground">Features</p>
              <ul className="list-disc ml-5 mt-1">
                {(data?.features ?? []).map((f: string, i: number) => (<li key={i}>{f}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
