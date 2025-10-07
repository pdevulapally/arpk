"use client";
import Link from 'next/link';
import { CalendarDays, BadgePoundSterling, LayoutGrid, CreditCard, CheckCircle2 } from 'lucide-react';
// Canonical status order and styles
const STATUS_ORDER = ['pending','approved','in progress','client review','final review','completed'] as const;
const STATUS_STYLES: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
  approved: 'bg-green-500/20 text-green-500 border-green-500/50',
  rejected: 'bg-red-500/20 text-red-500 border-red-500/50',
  'on hold': 'bg-blue-500/20 text-blue-500 border-blue-500/50',
  'in progress': 'bg-purple-500/20 text-purple-500 border-purple-500/50',
  'client review': 'bg-orange-500/20 text-orange-500 border-orange-500/50',
  'final review': 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50',
  completed: 'bg-green-500/20 text-green-500 border-green-500/50',
};

function canonicalizeStatus(raw: string | undefined): string {
  const s = String(raw || '').toLowerCase();
  if (s.includes('rejected')) return 'rejected';
  if (s.includes('hold')) return 'on hold';
  if (s.includes('accepted')) return 'approved';
  if (s.includes('approve')) return 'approved';
  if (s.includes('client') && s.includes('review')) return 'client review';
  if (s.includes('final') && s.includes('review')) return 'final review';
  if (s.includes('progress')) return 'in progress';
  if (s.includes('complete')) return 'completed';
  if (s.includes('pending')) return 'pending';
  // Default to approved to skip pending when an admin has accepted
  return 'approved';
}
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ui/client-sidebar';

export default function ClientProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || '');
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [project, setProject] = useState<any | null>(null);
  const [allowed, setAllowed] = useState<boolean>(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login?next=' + encodeURIComponent('/dashboard/projects/' + id));
        return;
      }
      setUid(user.uid);
    });
    return () => unsub();
  }, [id, router]);

  useEffect(() => {
    const load = async () => {
      if (!uid || !id) return;
      setBusy(true);
      try {
        const snap = await getDoc(doc(db, 'projects', id));
        if (!snap.exists()) {
          setProject(null);
          setAllowed(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() } as any;
        setProject(data);
        setAllowed(data.userId === uid || data.clientId === uid);
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [uid, id]);

  if (!uid || busy) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (!project) return <main className="max-w-6xl mx-auto px-4 py-12">Project not found.</main>;
  if (!allowed) return <main className="max-w-6xl mx-auto px-4 py-12">Access denied.</main>;

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false} storageKey="client:sidebar">
        <ClientSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="px-4 md:px-8 xl:px-14 pb-10">
            {/* Header */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-8 shadow-lg">
              <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]">
                <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl"/>
                <div className="absolute -top-24 right-0 h-56 w-56 rounded-full bg-purple-500/10 blur-3xl"/>
              </div>
              <div className="relative flex items-start justify-between">
                <div>
                  <h1 className="font-heading text-2xl md:text-3xl">{project.name || 'Project'}</h1>
                  <p className="text-xs text-muted-foreground mt-1">ID: {project.id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="lg:hidden"><SidebarTrigger /></span>
                  <Link href="/dashboard/projects" className="rounded-2xl px-4 py-2 border border-border">Back</Link>
                </div>
              </div>

              {/* Premium status chip + segmented progress */}
              <div className="mt-5">
                {(() => {
                  const normalized = canonicalizeStatus(project.status);
                  const badgeClass = STATUS_STYLES[normalized] || STATUS_STYLES['in progress'];
                  return (
                    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs shadow-sm backdrop-blur ${badgeClass}`}>
                      <span className="relative inline-flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-40"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-current"></span>
                      </span>
                      <span className="font-medium capitalize">{normalized}</span>
                    </div>
                  );
                })()}

                <div className="mt-4 space-y-2">
                  {(() => {
                    const canonical = canonicalizeStatus(project.status);
                    const rejected = canonical === 'rejected';
                    const onHold = canonical === 'on hold';
                    const currentIndex = Math.max(0, STATUS_ORDER.indexOf((canonical as any)));
                    const fills = STATUS_ORDER.map((_, i) => !rejected && i <= currentIndex);
                    return (
                      <>
                        <div className="grid grid-cols-6 gap-2 md:gap-3">
                          {STATUS_ORDER.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                              <div className={`h-2 w-full rounded-full ${fills[i] ? 'bg-gradient-to-r from-primary to-purple-500' : 'bg-muted'}`}/>
                              {fills[i] && <CheckCircle2 className="h-3 w-3 text-primary" />}
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-6 text-[11px] text-muted-foreground">
                          {STATUS_ORDER.map((s) => (
                            <span key={s} className="capitalize truncate text-center">{s}</span>
                          ))}
                        </div>
                        {(rejected || onHold) && (
                          <div className="mt-2 flex items-center gap-2">
                            {rejected && (
                              <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLES['rejected']}`}>
                                Rejected
                              </span>
                            )}
                            {onHold && (
                              <span className={`inline-flex items-center gap-2 rounded-full border px-2 py-0.5 text-[11px] ${STATUS_STYLES['on hold']}`}>
                                On hold
                              </span>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Progress card */}
            <div className="rounded-xl border border-border bg-card p-5 sm:p-6 mb-6 shadow mt-6 sm:mt-8">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Progress</span>
                <div className="h-2 w-full max-w-[18rem] sm:max-w-[28rem] md:max-w-[36rem] rounded-full bg-muted overflow-hidden">
                  <div className="h-2 bg-primary" style={{ width: `${typeof project.progress === 'number' ? project.progress : 0}%` }} />
                </div>
                <span className="text-sm font-medium">{typeof project.progress === 'number' ? project.progress + '%' : '—'}</span>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid gap-6 md:grid-cols-12">
              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 md:col-span-7 shadow">
                <h2 className="text-sm font-semibold mb-4">Overview</h2>
                <dl className="grid grid-cols-3 gap-3 text-sm">
                  <dt className="col-span-1 text-muted-foreground inline-flex items-center gap-2"><LayoutGrid className="h-4 w-4"/> Website Type</dt>
                  <dd className="col-span-2 font-medium">{project.websiteType || '—'}</dd>
                  <dt className="col-span-1 text-muted-foreground inline-flex items-center gap-2"><CalendarDays className="h-4 w-4"/> Due Date</dt>
                  <dd className="col-span-2 font-medium">{project.dueDate || '—'}</dd>
                  <dt className="col-span-1 text-muted-foreground inline-flex items-center gap-2"><BadgePoundSterling className="h-4 w-4"/> Budget</dt>
                  <dd className="col-span-2 font-medium">{typeof project.budget === 'number' ? `£${project.budget.toLocaleString()}` : '—'}</dd>
                </dl>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 md:col-span-5 shadow">
                <h2 className="text-sm font-semibold mb-3 inline-flex items-center gap-2"><CreditCard className="h-4 w-4"/> Payment</h2>
                {typeof project.quoteAmountPence === 'number' ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground">Total Quote</div>
                      <div className="font-medium justify-self-end">£{(project.quoteAmountPence/100).toLocaleString()}</div>
                      <div className="text-muted-foreground">Deposit (50%)</div>
                      <div className="font-medium justify-self-end">£{(project.quoteAmountPence/200).toLocaleString()}</div>
                    </div>
                    <button
                      className="mt-4 w-full rounded-lg bg-gradient-to-r from-primary to-purple-600 px-4 py-3 text-sm text-white shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[.99] transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                      onClick={async ()=>{
                        try {
                          const res = await fetch('/api/checkout/session', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              projectId: project.id,
                              invoiceId: project.invoiceId || 'auto',
                              amount: Math.round(Number(project.quoteAmountPence) / 2),
                              label: 'Project Deposit (50%)',
                            }),
                          });
                          const json = await res.json();
                          if (!res.ok || !json?.url) throw new Error(json?.error || 'Failed to start payment');
                          window.location.href = json.url as string;
                        } catch(e:any){
                          alert(e.message || 'Unable to start payment');
                        }
                      }}
                    >Pay now</button>
                    {project.invoiceId && project.depositPaid === true && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        Invoice ID: {project.invoiceId} · {" "}
                        <Link href={`/dashboard/invoices/${project.invoiceId}`} className="underline text-primary">View invoice</Link>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Awaiting quote from admin.</p>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 sm:p-6 md:col-span-12">
                <h2 className="text-sm font-semibold mb-3">Details</h2>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Features</div>
                    <div className="font-medium whitespace-pre-wrap break-words">{project.features || '—'}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Requirements</div>
                    <div className="font-medium whitespace-pre-wrap break-words">{project.requirements || '—'}</div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-muted-foreground">Description</div>
                    <div className="font-medium whitespace-pre-wrap break-words">{project.description || '—'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}


