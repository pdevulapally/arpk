"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cols } from "@/lib/firebase-collections";
import { getDocs } from "firebase/firestore";
import { useUserRole } from "@/hooks/useUserRole";
import { ArrowLeft, FileText } from "lucide-react";

export default function AdminInvoicesPage() {
  const { role, loading } = useUserRole();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const snap = await getDocs(cols.invoices());
        setInvoices(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })));
      } finally {
        setFetching(false);
      }
    };
    if (role === "admin") load();
  }, [role]);

  if (loading) return <main className="max-w-7xl mx-auto px-4 py-8">Loading…</main>;
  if (role !== "admin") return <main className="max-w-7xl mx-auto px-4 py-8">Admins only.</main>;

  return (
    <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-4 sm:mb-6 flex items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">View and manage client invoices</p>
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

      {fetching && <p className="text-muted-foreground">Fetching…</p>}
      {!fetching && invoices.length === 0 && (
        <div className="rounded-xl border border-border p-6 text-center text-muted-foreground">No invoices found.</div>
      )}

      {!fetching && invoices.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Invoice</th>
                <th className="text-left px-4 py-3">Client</th>
                <th className="text-left px-4 py-3">Amount</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const amount = typeof inv.amount === 'number' ? inv.amount : 0;
                const status = String(inv.status ?? (inv.paid ? 'paid' : 'unpaid')).toLowerCase();
                const badge = status === 'paid'
                  ? 'bg-green-500/15 text-green-600 border-green-500/30'
                  : 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30';
                return (
                  <tr key={inv.id} className="border-t border-border">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <div className="font-medium text-foreground">{inv.title || `Invoice ${inv.id.slice(0,6)}`}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{inv.id}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="truncate max-w-[220px]">{inv.clientEmail || inv.email || '—'}</div>
                    </td>
                    <td className="px-4 py-3">£{(amount/100).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs capitalize ${badge}`}>{status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/dashboard/invoices/${inv.id}`} className="text-primary hover:underline">Open</Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}


