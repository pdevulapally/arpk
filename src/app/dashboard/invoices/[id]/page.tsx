"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/ui/client-sidebar";

export default function InvoiceDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [inv, setInv] = useState<any | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        window.location.href = `/login?next=/dashboard/invoices/${id}`;
        return;
      }
      setUid(u.uid);
    });
    return () => unsub();
  }, [id]);

  useEffect(() => {
    const load = async () => {
      if (!uid || !id) return;
      setBusy(true);
      try {
        const snap = await getDoc(doc(db, "invoices", id));
        if (!snap.exists()) { setInv(null); return; }
        const data = { id: snap.id, ...snap.data() } as any;
        if (data.userId && data.userId !== uid) { setInv(null); return; }
        setInv(data);
      } finally { setBusy(false); }
    };
    load();
  }, [uid, id]);

  if (!uid || busy) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (!inv) return <main className="max-w-6xl mx-auto px-4 py-12">Invoice not found.</main>;

  const amountGBP = typeof inv.amount === 'number' ? inv.amount/100 : 0;

  const download = async () => {
    const blob = new Blob([
      `Invoice ${inv.id}\nProject: ${inv.projectId || ''}\nAmount: £${amountGBP.toLocaleString()}\nStatus: ${inv.status || 'paid'}\nDate: ${new Date().toLocaleString()}`
    ], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `invoice-${inv.id}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false}>
        <ClientSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="px-4 md:px-8 xl:px-14 pb-10">
            <div className="flex items-start justify-between py-6">
              <div>
                <h1 className="font-heading text-2xl md:text-3xl">Invoice #{inv.id.slice(0,6)}</h1>
                <p className="text-xs text-muted-foreground">Project: {inv.projectId || '—'}</p>
              </div>
              <span className="lg:hidden"><SidebarTrigger /></span>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Amount</div>
                  <div className="font-medium">£{amountGBP.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Status</div>
                  <div className="font-medium capitalize">{inv.status || 'paid'}</div>
                </div>
                <div className="sm:col-span-2">
                  <button onClick={download} className="mt-2 rounded-lg bg-gradient-to-r from-primary to-purple-600 px-4 py-2 text-sm text-white shadow hover:opacity-95">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}


