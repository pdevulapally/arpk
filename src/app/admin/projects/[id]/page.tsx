"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUserRole } from '@/hooks/useUserRole';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/ui/admin-sidebar';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import { cols } from '@/lib/firebase-collections';

export default function AdminProjectDetailsPage() {
  const { role, loading } = useUserRole();
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || '');

  const [busy, setBusy] = useState(true);
  const [saving, setSaving] = useState(false);
  const [p, setP] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [status, setStatus] = useState('in-progress');
  const [websiteType, setWebsiteType] = useState('');
  const [features, setFeatures] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [budget, setBudget] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [progress, setProgress] = useState<number>(0);
  const [quoteGBP, setQuoteGBP] = useState<string>('');
  const [invoiceId, setInvoiceId] = useState<string>('');

  useEffect(() => {
    const load = async () => {
      if (loading || role !== 'admin' || !id) return;
      setBusy(true);
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (!snap.exists()) {
          setP(null);
          return;
        }
        const data = { id: snap.id, ...snap.data() } as any;
        setP(data);
        setName(data.name || '');
        setStatus(data.status || 'in-progress');
        setWebsiteType(data.websiteType || '');
        setFeatures(data.features || '');
        setDescription(data.description || '');
        setRequirements(data.requirements || '');
        setBudget((data.budget ?? '').toString());
        setDueDate(data.dueDate || '');
        setClientEmail(data.clientEmail || '');
        setProgress(typeof data.progress === 'number' ? data.progress : 0);
        setInvoiceId(data.invoiceId || '');
        setQuoteGBP(
          typeof data.quoteAmountPence === 'number'
            ? (data.quoteAmountPence / 100).toString()
            : ''
        );
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [loading, role, id]);

  if (loading) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (role !== 'admin') return <main className="max-w-6xl mx-auto px-4 py-12">Access denied.</main>;
  if (busy) return <main className="max-w-6xl mx-auto px-4 py-12">Loading project…</main>;
  if (!p) return <main className="max-w-6xl mx-auto px-4 py-12">Project not found.</main>;

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <AdminSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex items-start justify-between px-4 py-4 md:px-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Edit Project</h1>
              <p className="text-muted-foreground">ID: {p.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="lg:hidden"><SidebarTrigger /></span>
              <Link href="/admin/projects" className="rounded-2xl px-4 py-2 border border-border">Back</Link>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-8 grid gap-6">
            {/* Overview header */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded-full text-xs border ${
                    status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                    status === 'on-hold' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' :
                    status === 'cancelled' ? 'bg-red-500/10 text-red-600 border-red-500/20' :
                    'bg-blue-500/10 text-blue-600 border-blue-500/20'
                  }`}>{status}</span>
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <div className="h-2 w-40 rounded-full bg-muted overflow-hidden">
                    <div className="h-2 bg-primary" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-xs font-medium">{progress}%</span>
                </div>
                {clientEmail && (
                  <a href={`mailto:${clientEmail}`} className="rounded-lg px-3 py-2 border border-border text-sm">Contact client</a>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="text-sm">Project Name</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Status</label>
                  <select className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="in-progress">In progress</option>
                    <option value="on-hold">On hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm">Progress (%)</label>
                  <div className="mt-1 flex items-center gap-3">
                    <input type="range" min={0} max={100} value={progress} onChange={(e)=>setProgress(Number(e.target.value))} className="flex-1" />
                    <input type="number" className="w-20 rounded-lg border border-border bg-background px-2 py-1 text-sm" value={progress} onChange={(e)=>setProgress(Math.max(0, Math.min(100, Number(e.target.value)||0)))} />
                  </div>
                </div>
                <div>
                  <label className="text-sm">Website Type</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={websiteType} onChange={(e) => setWebsiteType(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Features</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={features} onChange={(e) => setFeatures(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Description</label>
                  <textarea className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Requirements</label>
                  <textarea className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" rows={3} value={requirements} onChange={(e) => setRequirements(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Budget (£)</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm">Deadline</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm">Client Email</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60"
                  disabled={saving || !name}
                  onClick={async () => {
                    setSaving(true);
                    try {
                      await updateDoc(doc(db, 'projects', p.id), {
                        name: name.trim(),
                        status,
                        progress,
                        websiteType: websiteType.trim(),
                        features: features.trim(),
                        description: description.trim(),
                        requirements: requirements.trim(),
                        budget: budget ? Number(budget) : 0,
                        dueDate: dueDate.trim(),
                        clientEmail: clientEmail.trim(),
                        quoteAmountPence: quoteGBP ? Math.round(Number(quoteGBP) * 100) : undefined,
                        invoiceId: invoiceId || undefined,
                      } as any);
                      alert('Saved');
                      router.refresh?.();
                    } catch (e: any) {
                      alert(e.message || 'Failed to save');
                    } finally {
                      setSaving(false);
                    }
                  }}
                >{saving ? 'Saving…' : 'Save Changes'}</button>
              </div>
            </div>

            {/* Quote & Payment */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h2 className="text-lg font-semibold mb-3">Quote & Payment</h2>
              <div className="grid gap-3">
                <div>
                  <label className="text-sm">Quote (£)</label>
                  <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" type="number" value={quoteGBP} onChange={(e)=>setQuoteGBP(e.target.value)} placeholder="e.g. 750" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60"
                  disabled={!quoteGBP}
                  onClick={async () => {
                    try {
                      // If no invoice id provided, create one dynamically in Firestore
                      let invId = invoiceId;
                      if (!invId) {
                        const invRef = await addDoc(cols.invoices(), {
                          projectId: p.id,
                          userId: p.userId || undefined,
                          amount: Math.round(Number(quoteGBP) * 100),
                          status: 'pending',
                          description: 'Project deposit',
                        } as any);
                        invId = invRef.id;
                        setInvoiceId(invId);
                        await updateDoc(doc(db, 'projects', p.id), {
                          invoiceId: invId,
                          quoteAmountPence: Math.round(Number(quoteGBP) * 100),
                        } as any);
                      }

                      const res = await fetch('/api/checkout/deposit', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          projectId: p.id,
                          invoiceId: invId,
                          amount: Math.round(Number(quoteGBP) * 100),
                        }),
                      });
                      const json = await res.json();
                      if (!res.ok) throw new Error(json?.error || 'Failed to create payment');
                      alert('Payment intent created. Share with client via client portal.');
                    } catch (e: any) {
                      alert(e.message || 'Failed to create payment');
                    }
                  }}
                >Generate Payment</button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Invoice is created automatically when you generate a payment. The client will then see a Pay button on their dashboard.</p>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}


