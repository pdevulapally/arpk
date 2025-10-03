"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import { auth } from "@/lib/firebase";
import { addDoc } from "firebase/firestore";
import { cols } from "@/lib/firebase-collections";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

type Step = 1 | 2 | 3 | 4 | 5;

export default function RequestPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [uid, setUid] = useState<string | null>(null);
  const [data, setData] = useState<any>({ goals: [], pages: [], features: [], contact: { name: "", email: "", phone: "" }, projectType: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pageInput, setPageInput] = useState("");
  const [featureInput, setFeatureInput] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  function next(partial: any) { setData((d: any) => ({ ...d, ...partial })); setStep((s) => (s < 5 ? ((s + 1) as Step) : s)); }
  function back() { setStep((s) => (s > 1 ? ((s - 1) as Step) : s)); }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login?next=/request");
        return;
      }
      setUid(user.uid);
      setData((d: any) => ({
        ...d,
        contact: {
          ...(d.contact || {}),
          name: d.contact?.name || user.displayName || "",
          email: d.contact?.email || user.email || "",
          phone: d.contact?.phone || "",
        },
      }));
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  async function submit(finalPartial: any) {
    if (!uid) {
      window.location.href = "/login?next=/request";
      return;
    }
    const payload = { ...data, ...finalPartial, userId: uid, status: 'new' };
    setLoading(true);
    try {
      const docRef = await addDoc(cols.requests(), {
        projectType: payload.projectType || '',
        goals: Array.isArray(payload.goals) ? payload.goals : [],
        pages: Array.isArray(payload.pages) ? payload.pages : [],
        features: Array.isArray(payload.features) ? payload.features : [],
        style: payload.style || '',
        contentStatus: payload.contentStatus || '',
        budgetRange: payload.budgetRange || '',
        timelineTarget: payload.timelineTarget || '',
        uploads: Array.isArray(payload.uploads) ? payload.uploads : [],
        contact: {
          name: payload.contact?.name || '',
          email: payload.contact?.email || '',
          phone: payload.contact?.phone || '',
        },
        userId: uid,
        status: 'new',
      } as any);
      setOk(true);
      setSubmittedId(docRef.id);
      setStep(1);
      setData({ goals: [], pages: [], features: [], contact: { name: "", email: "", phone: "" } });
    } catch (e) {
      console.error('Failed to submit request', e);
      setOk(false);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) return null;

  return (
    <>
    <Header />
    <main className="max-w-3xl mx-auto px-4 py-12">
      {ok === true && (
        <div className="mb-4 rounded-xl border border-green-600/20 bg-green-500/10 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-green-700 dark:text-green-300 text-sm">Request received. We'll be in touch.</p>
            <div className="flex gap-2">
              {submittedId && (
                <Link href={`/dashboard/requests/${submittedId}`} className="rounded-lg px-3 py-1.5 text-sm border border-border hover:bg-accent">View your request</Link>
              )}
              <Link href="/dashboard/requests" className="rounded-lg px-3 py-1.5 text-sm bg-primary text-primary-foreground">Go to dashboard</Link>
            </div>
          </div>
        </div>
      )}
      <h1 className="font-heading text-3xl">Tell us what you need</h1>
      <p className="text-muted-foreground mt-2">Simple questions. No tech jargon. Skip anything you're not sure about.</p>

      <div className="mt-6 bg-card rounded-2xl p-6 space-y-4 border border-border">
        <div className="text-sm text-muted-foreground">Step {step} of 5</div>

        {step === 1 && (
          <div className="space-y-4">
            <label className="block">
              <span>What do you want us to build? <span className="text-red-500">*</span></span>
              <input
                className={`mt-2 w-full bg-background border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground ${errors.projectType ? 'border-red-500' : 'border-border'}`}
                value={data.projectType || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setData((d: any) => ({ ...d, projectType: value }));
                  if (errors.projectType && value.trim()) {
                    setErrors((er) => ({ ...er, projectType: '' }));
                  }
                }}
                placeholder="e.g., Personal website, Online shop, Portfolio, Booking app"
                aria-invalid={!!errors.projectType}
                aria-describedby={errors.projectType ? 'projectType-error' : undefined}
              />
              {errors.projectType && (
                <p id="projectType-error" className="text-xs text-red-500 mt-2">{errors.projectType}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">Write it how you would explain to a friend.</p>
            </label>
            <div className="flex gap-3">
              <button
                className="rounded-2xl px-4 py-2 border border-border hover:bg-accent"
                onClick={() => {
                  const value = (data.projectType || '').trim();
                  if (!value) {
                    setErrors((er) => ({ ...er, projectType: 'Please tell us what you want us to build.' }));
                    return;
                  }
                  next({ projectType: value });
                }}
              >Next</button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="block">
              <span>What should it do? (optional)</span>
              <input className="mt-2 w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" placeholder="e.g., Get more leads, Sell products, Show work" onChange={(e) => setData((d: any) => ({ ...d, goals: e.target.value.split(',').map(v => v.trim()).filter(Boolean) }))} />
              <div className="mt-2 flex flex-wrap gap-2">
                {['Get more leads','Sell online','Show portfolio','Book appointments','Share info'].map((g) => {
                  const selected = Array.isArray(data.goals) && data.goals.includes(g);
                  return (
                    <button
                      key={g}
                      type="button"
                      aria-pressed={selected}
                      className={`rounded-full border border-border px-3 py-1 text-sm hover:bg-accent ${selected ? 'bg-accent' : ''}`}
                      onClick={() => setData((d: any) => {
                        const set = new Set<string>(Array.isArray(d.goals) ? d.goals : []);
                        if (set.has(g)) set.delete(g); else set.add(g);
                        return { ...d, goals: Array.from(set) };
                      })}
                    >{g}</button>
                  );
                })}
              </div>
              {Array.isArray(data.goals) && data.goals.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {data.goals.map((g: string) => (
                    <span key={g} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
                      {g}
                      <button
                        type="button"
                        className="text-muted-foreground hover:text-foreground"
                        aria-label={`Remove ${g}`}
                        onClick={() => setData((d: any) => ({ ...d, goals: (d.goals||[]).filter((x: string) => x !== g) }))}
                      >×</button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">Add your own above, or tap to select. You can skip this.</p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={back}>Back</button>
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={() => next({})}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="block">
              <span>Pages and features (optional)</span>
              <div className="mt-2 grid gap-2">
                <div className="flex gap-2">
                  <input
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground"
                    placeholder="Add a page (e.g., Home, About)"
                    value={pageInput}
                    onChange={(e) => setPageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = pageInput.trim();
                        if (!value) return;
                        setData((d: any) => ({ ...d, pages: Array.from(new Set([...(d.pages||[]), value])) }));
                        setPageInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-xl px-4 py-3 border border-border hover:bg-accent"
                    onClick={() => {
                      const value = pageInput.trim();
                      if (!value) return;
                      setData((d: any) => ({ ...d, pages: Array.from(new Set([...(d.pages||[]), value])) }));
                      setPageInput("");
                    }}
                  >Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Home','About','Services','Contact','Pricing','Blog'].map((p) => (
                    <button key={p} type="button" className="rounded-full border border-border px-3 py-1 text-sm hover:bg-accent" onClick={() => setData((d: any) => ({ ...d, pages: Array.from(new Set([...(d.pages||[]), p])) }))}>{p}</button>
                  ))}
                </div>
                {Array.isArray(data.pages) && data.pages.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.pages.map((p: string) => (
                      <span key={p} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
                        {p}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setData((d: any) => ({ ...d, pages: (d.pages||[]).filter((x: string) => x !== p) }))}
                          aria-label={`Remove ${p}`}
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <input
                    className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground"
                    placeholder="Add a feature (e.g., Contact form, Blog)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const value = featureInput.trim();
                        if (!value) return;
                        setData((d: any) => ({ ...d, features: Array.from(new Set([...(d.features||[]), value])) }));
                        setFeatureInput("");
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-xl px-4 py-3 border border-border hover:bg-accent"
                    onClick={() => {
                      const value = featureInput.trim();
                      if (!value) return;
                      setData((d: any) => ({ ...d, features: Array.from(new Set([...(d.features||[]), value])) }));
                      setFeatureInput("");
                    }}
                  >Add</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {['Contact form','Online payments','Booking','Blog','Chat','Newsletter'].map((f) => (
                    <button key={f} type="button" className="rounded-full border border-border px-3 py-1 text-sm hover:bg-accent" onClick={() => setData((d: any) => ({ ...d, features: Array.from(new Set([...(d.features||[]), f])) }))}>{f}</button>
                  ))}
                </div>
                {Array.isArray(data.features) && data.features.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {data.features.map((f: string) => (
                      <span key={f} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
                        {f}
                        <button
                          type="button"
                          className="text-muted-foreground hover:text-foreground"
                          onClick={() => setData((d: any) => ({ ...d, features: (d.features||[]).filter((x: string) => x !== f) }))}
                          aria-label={`Remove ${f}`}
                        >×</button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">Optional: skip this if you are not sure.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={back}>Back</button>
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={() => next({})}>Next</button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <div className="block">
              <span>Look & feel (optional)</span>
              <input className="mt-2 w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" placeholder="e.g., Modern, minimal, colorful… or paste sites you like" onChange={(e) => setData((d: any) => ({ ...d, style: e.target.value }))} />
              <p className="text-xs text-muted-foreground mt-2">Share vibes or links. Skip if unsure.</p>
            </div>
            <div className="flex gap-3">
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={back}>Back</button>
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={() => next({})}>Next</button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <div className="grid gap-3">
              <div>
                <div className="text-sm">Do you already have text and images?</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    ['Have everything','have_all'],
                    ['Need help with content','need_help'],
                    ['Some ready','some_ready'],
                  ].map(([label, value]) => {
                    const selected = data.contentStatus === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        aria-pressed={selected}
                        className={`rounded-full border border-border px-3 py-1 text-sm hover:bg-accent ${selected ? 'bg-accent' : ''}`}
                        onClick={() => setData((d: any) => ({ ...d, contentStatus: value }))}
                      >{label}</button>
                    );
                  })}
                </div>
              </div>

              <div>
                <input placeholder="Approx budget (any range is fine)" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" onChange={(e) => setData((d: any) => ({ ...d, budgetRange: e.target.value }))} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {['< $1k','$1k–$3k','$3k–$7k','$7k+'].map((b) => {
                    const selected = data.budgetRange === b;
                    return (
                      <button
                        key={b}
                        type="button"
                        aria-pressed={selected}
                        className={`rounded-full border border-border px-3 py-1 text-sm hover:bg-accent ${selected ? 'bg-accent' : ''}`}
                        onClick={() => setData((d: any) => ({ ...d, budgetRange: b }))}
                      >{b}</button>
                    );
                  })}
                </div>
              </div>

              <div>
                <input placeholder="When do you want it live?" className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" onChange={(e) => setData((d: any) => ({ ...d, timelineTarget: e.target.value }))} />
                <div className="mt-2 flex flex-wrap gap-2">
                  {['ASAP','This month','1–3 months','Flexible'].map((t) => {
                    const selected = data.timelineTarget === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        aria-pressed={selected}
                        className={`rounded-full border border-border px-3 py-1 text-sm hover:bg-accent ${selected ? 'bg-accent' : ''}`}
                        onClick={() => setData((d: any) => ({ ...d, timelineTarget: t }))}
                      >{t}</button>
                    );
                  })}
                </div>
              </div>
              <input placeholder="Your name" className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" value={data.contact?.name || ""} onChange={(e) => setData((d: any) => ({ ...d, contact: { ...(d.contact||{}), name: e.target.value } }))} />
              <input placeholder="Your email" type="email" className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" value={data.contact?.email || ""} onChange={(e) => setData((d: any) => ({ ...d, contact: { ...(d.contact||{}), email: e.target.value } }))} />
              <input placeholder="Phone (optional)" className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" value={data.contact?.phone || ""} onChange={(e) => setData((d: any) => ({ ...d, contact: { ...(d.contact||{}), phone: e.target.value } }))} />
            </div>
            <div className="flex gap-3">
              <button className="rounded-2xl px-4 py-2 border border-border hover:bg-accent" onClick={back}>Back</button>
              <button disabled={loading} className="rounded-2xl px-5 py-3 bg-primary text-primary-foreground disabled:opacity-60" onClick={() => submit({})}>{loading ? 'Submitting…' : 'Submit'}</button>
            </div>
            {ok === true && <p className="text-green-600 dark:text-green-400">Request received. We'll be in touch.</p>}
            {ok === false && <p className="text-red-600 dark:text-red-400">Something went wrong.</p>}
          </div>
        )}
      </div>
    </main>
    </>
  );
}


