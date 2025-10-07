"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { ClientSidebar } from "@/components/ui/client-sidebar";

export default function ClientInvoicesPage() {
  const [uid, setUid] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        window.location.href = "/login?next=/dashboard/invoices";
        return;
      }
      setUid(u.uid);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      setBusy(true);
      try {
        const q = query(collection(db, "invoices"), where("userId", "==", uid), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[]);
      } finally {
        setBusy(false);
      }
    };
    load();
  }, [uid]);

  if (!uid) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false} storageKey="client:sidebar">
        <ClientSidebar />
        <SidebarInset className="relative z-10 flex-1 min-w-0 w-full overflow-y-auto">
          <div className="px-4 md:px-8 xl:px-14 pb-10">
            <div className="flex items-center justify-between py-6">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="h-9 w-9 p-0 grid place-items-center text-muted-foreground hover:text-foreground" />
                <h1 className="font-heading text-2xl md:text-3xl">Invoices</h1>
              </div>
            </div>

            <div className="grid gap-3">
              {busy && <div className="text-sm text-muted-foreground">Loading…</div>}
              {!busy && items.length === 0 && (
                <div className="text-sm text-muted-foreground">No invoices yet.</div>
              )}
              {!busy && items.map((inv) => (
                <div key={inv.id} className="rounded-xl border border-border bg-card p-4 flex items-center justify-between">
                  <div>
                    <div className="font-medium">Invoice #{inv.id.slice(0,6)}</div>
                    <div className="text-xs text-muted-foreground">Amount: £{((inv.amount||0)/100).toLocaleString()} • {inv.status || "pending"}</div>
                  </div>
                  <Link href={`/dashboard/invoices/${inv.id}`} className="text-sm text-primary">View / Download</Link>
                </div>
              ))}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}


