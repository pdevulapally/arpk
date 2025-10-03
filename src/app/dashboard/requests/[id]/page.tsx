"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { ClientSidebar } from '@/components/ui/client-sidebar';

export default function ClientRequestDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || '');
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [req, setReq] = useState<any | null>(null);
  const [allowed, setAllowed] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const [fProjectType, setFProjectType] = useState('');
  const [fGoals, setFGoals] = useState('');
  const [fPages, setFPages] = useState('');
  const [fFeatures, setFFeatures] = useState('');
  const [fStyle, setFStyle] = useState('');
  const [fTimeline, setFTimeline] = useState('');
  const [fName, setFName] = useState('');
  const [fEmail, setFEmail] = useState('');
  const [fPhone, setFPhone] = useState('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace('/login?next=' + encodeURIComponent('/dashboard/requests/' + id));
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
        const snap = await getDoc(doc(db, 'requests', id));
        if (!snap.exists()) {
          setReq(null);
          setAllowed(false);
          return;
        }
        const data = { id: snap.id, ...snap.data() } as any;
        setReq(data);
        setAllowed(data.userId === uid);
        // prime edit fields
        setFProjectType(data.projectType || '');
        setFGoals(Array.isArray(data.goals) ? data.goals.join(', ') : '');
        setFPages(Array.isArray(data.pages) ? data.pages.join(', ') : '');
        setFFeatures(Array.isArray(data.features) ? data.features.join(', ') : '');
        setFStyle(data.style || '');
        setFTimeline(data.timelineTarget || '');
        setFName(data.contact?.name || '');
        setFEmail(data.contact?.email || '');
        setFPhone(data.contact?.phone || '');
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [uid, id]);

  if (!uid || busy) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (!req) return <main className="max-w-6xl mx-auto px-4 py-12">Request not found.</main>;
  if (!allowed) return <main className="max-w-6xl mx-auto px-4 py-12">Access denied.</main>;
  const isAccepted = String(req.status || '').toLowerCase() === 'accepted';

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <ClientSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="flex items-start justify-between px-4 py-4 md:px-6">
            <div>
              <h1 className="font-heading text-2xl md:text-3xl">Request Details</h1>
              <p className="text-muted-foreground">ID: {req.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="lg:hidden"><SidebarTrigger /></span>
              <Link href="/dashboard/requests" className="rounded-2xl px-4 py-2 border border-border">Back</Link>
            </div>
          </div>

          <div className="px-4 md:px-6 pb-8 grid gap-4">
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Project type</div>
                  <div className="font-medium">{req.projectType || '—'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium capitalize">{req.status || 'new'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Goals</div>
                  <div className="font-medium">{Array.isArray(req.goals) && req.goals.length ? req.goals.join(', ') : '—'}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Timeline</div>
                  <div className="font-medium">{req.timelineTarget || '—'}</div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-muted-foreground">Contact</div>
                  <div className="font-medium">{req.contact?.name || '—'} • {req.contact?.email || '—'} {req.contact?.phone ? ('• ' + req.contact.phone) : ''}</div>
                </div>
              </div>
            </div>

            {/* Edit section */}
            {allowed && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Edit Request</h2>
                  <button
                    className="rounded-lg px-3 py-2 text-sm border border-border hover:bg-accent"
                    onClick={() => setEditing(e => !e)}
                  >{editing ? 'Cancel' : 'Edit'}</button>
                </div>
                {isAccepted && (
                  <p className="mb-3 text-xs text-muted-foreground">This request is accepted. You can update your contact details; other fields are locked.</p>
                )}
                {editing && (
                  <div className="grid gap-3">
                    <div className="grid sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">What do you want us to build?</label>
                        <input disabled={isAccepted} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60" value={fProjectType} onChange={e=>setFProjectType(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Timeline</label>
                        <input disabled={isAccepted} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60" value={fTimeline} onChange={e=>setFTimeline(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Goals (comma separated)</label>
                      <input disabled={isAccepted} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60" value={fGoals} onChange={e=>setFGoals(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Pages (comma separated)</label>
                      <input disabled={isAccepted} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60" value={fPages} onChange={e=>setFPages(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Features (comma separated)</label>
                      <input disabled={isAccepted} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60" value={fFeatures} onChange={e=>setFFeatures(e.target.value)} />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Look & feel</label>
                      <input disabled={isAccepted} className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm disabled:opacity-60" value={fStyle} onChange={e=>setFStyle(e.target.value)} />
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Name</label>
                        <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={fName} onChange={e=>setFName(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Email</label>
                        <input type="email" className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={fEmail} onChange={e=>setFEmail(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Phone</label>
                        <input className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" value={fPhone} onChange={e=>setFPhone(e.target.value)} />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-60"
                        disabled={saving}
                        onClick={async ()=>{
                          setSaving(true);
                          try {
                            const payload:any = {
                              // Only allow structure edits if not accepted
                              ...(isAccepted ? {} : {
                                projectType: fProjectType,
                                goals: fGoals.split(',').map(s=>s.trim()).filter(Boolean),
                                pages: fPages.split(',').map(s=>s.trim()).filter(Boolean),
                                features: fFeatures.split(',').map(s=>s.trim()).filter(Boolean),
                                style: fStyle,
                                timelineTarget: fTimeline,
                              }),
                              contact: { name: fName, email: fEmail, phone: fPhone },
                            };
                            await updateDoc(doc(db,'requests', req.id), payload);
                            alert('Request updated');
                            setEditing(false);
                            // refresh local state
                            setReq({ ...req, ...payload });
                          } catch(e:any){
                            alert(e.message || 'Failed to update');
                          } finally {
                            setSaving(false);
                          }
                        }}
                      >{saving ? 'Saving…' : 'Save changes'}</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {req.projectId && (
              <div className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">A project has been created for this request.</div>
                <Link href={`/dashboard/projects/${req.projectId}`} className="rounded-2xl px-4 py-2 border border-border">View project</Link>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}


