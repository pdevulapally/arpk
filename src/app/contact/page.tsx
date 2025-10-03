"use client";
import { useState } from "react";
import { Header } from "@/components/shared/Header";
import { Footer } from "@/components/shared/Footer";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<boolean | null>(null);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget as any;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      subject: form.subject.value || undefined,
      message: form.message.value,
    };
    setLoading(true);
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: JSON.stringify(payload) });
      setOk(res.ok);
      if (res.ok) form.reset();
    } finally {
      setLoading(false);
    }
  }
  return (
    <>
      <Header />
      <main className="relative px-4 sm:px-6 py-16 sm:py-20">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/4 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-heading text-4xl sm:text-5xl tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">Contact us</h1>
          <p className="text-muted-foreground mt-3">We usually reply within one business day.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Premium card form */}
          <div className="lg:col-span-3">
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-br from-primary/40 via-border to-transparent">
              <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:18px_18px] opacity-[0.06]" />
                <form onSubmit={onSubmit} className="relative z-10 p-6 sm:p-10 grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="name" placeholder="Your name" required className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" />
                    <input name="email" placeholder="Email" type="email" required className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" />
                  </div>
                  <input name="subject" placeholder="Subject (optional)" className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" />
                  <textarea name="message" placeholder="Tell us a bit about your project or question" required rows={6} className="bg-background border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground" />
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">By submitting, you agree to be contacted about your project.</p>
                    <button disabled={loading} className="rounded-full px-6 py-3 bg-primary text-primary-foreground disabled:opacity-60">
                      {loading ? 'Sending…' : 'Send message'}
                    </button>
                  </div>
                  {ok === true && <p className="text-green-600 dark:text-green-400">Sent. Thank you!</p>}
                  {ok === false && <p className="text-red-600 dark:text-red-400">Something went wrong.</p>}
                </form>
              </div>
            </div>
          </div>

          {/* Contact details / CTA */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border/60 bg-card/80 p-6 sm:p-8 h-full">
              <h2 className="font-heading text-xl">Prefer email or a call?</h2>
              <p className="text-muted-foreground mt-2 text-sm">We keep it simple and clear.
              </p>
              <div className="mt-5 space-y-3 text-sm">
                <div className="rounded-xl border border-border px-4 py-3">Email: <a className="underline" href="mailto:arpkwebsitedevelopment@gmail.com">arpkwebsitedevelopment@gmail.com</a></div>
                <div className="rounded-xl border border-border px-4 py-3">Request: <a className="underline" href="/request">Start your project</a></div>
              </div>
              <div className="mt-6 rounded-2xl bg-muted p-4 text-sm">
                We’ll propose a plan and timeline tailored to your goals.
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
    </>
  );
}


