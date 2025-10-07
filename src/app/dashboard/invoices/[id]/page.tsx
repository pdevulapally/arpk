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
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    // Premium theme
    const brand = {
      primary: '#5b21b6', // purple-800
      primaryLight: '#7c3aed', // purple-600
      text: '#0f172a',
      muted: '#64748b',
      border: '#e5e7eb',
      surface: '#ffffff',
      bgSoft: '#fafafa',
    } as const;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 56;

    // Decorative gradient header band
    doc.setFillColor(brand.primary);
    doc.rect(0, 0, pageWidth, 120, 'F');
    doc.setFillColor(brand.primaryLight);
    doc.rect(pageWidth * 0.45, 0, pageWidth * 0.55, 120, 'F');

    // Brand / Logo text
    doc.setTextColor('#ffffff');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('ARPK Studio', margin, 50);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('arpk.studio • arpkwebsitedevelopment@gmail.com', margin, 70);

    // Invoice title + number on right
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text('INVOICE', pageWidth - margin, 50, { align: 'right' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${String(inv.id).slice(0, 8)}`, pageWidth - margin, 70, { align: 'right' });

    // Bill To and Meta section
    const topY = 140;
    const columnGap = 40;
    const colWidth = (pageWidth - margin * 2 - columnGap) / 2;

    // Left column - Bill To
    doc.setTextColor(brand.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Bill To', margin, topY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(brand.muted);
    doc.setFontSize(10);
    const billName = inv.clientName || 'Client';
    const billEmail = inv.clientEmail || '';
    const billLines = [billName, billEmail].filter(Boolean) as string[];
    let cursorY = topY + 16;
    billLines.forEach((l) => { doc.text(String(l), margin, cursorY); cursorY += 14; });

    // Right column - Invoice details
    const createdAt = new Date(inv.createdAt?.toDate ? inv.createdAt.toDate() : Date.now());
    const rightX = margin + colWidth + columnGap;
    doc.setTextColor(brand.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Details', rightX, topY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(brand.muted);
    doc.setFontSize(10);
    const metaRows: [string, string][] = [
      ['Date', createdAt.toLocaleDateString()],
      ['Status', String(inv.status || 'paid').toUpperCase()],
      ['Project', String(inv.projectId || '—')],
      ['Invoice ID', String(inv.id)],
    ];
    let metaY = topY + 16;
    metaRows.forEach(([k, v]) => {
      doc.text(`${k}:`, rightX, metaY);
      doc.setTextColor(brand.text);
      doc.text(v, rightX + 80, metaY);
      doc.setTextColor(brand.muted);
      metaY += 14;
    });

    // Items table (single summary row if no breakdown present)
    const tableTop = Math.max(cursorY, metaY) + 24;
    const tableX = margin;
    const tableW = pageWidth - margin * 2;
    const rowH = 28;
    const col1 = tableX + 16; // description
    const col2 = tableX + tableW * 0.65; // amount

    // Table header
    doc.setDrawColor(brand.border);
    doc.setFillColor(brand.bgSoft);
    doc.roundedRect(tableX, tableTop, tableW, rowH, 8, 8, 'FD');
    doc.setTextColor(brand.text);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Description', col1, tableTop + 18);
    doc.text('Amount', col2, tableTop + 18);

    // Table row
    const tableRowY = tableTop + rowH + 2;
    doc.setFillColor(brand.surface);
    doc.roundedRect(tableX, tableRowY, tableW, rowH, 8, 8, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(brand.muted);
    const description = inv.description || `Project ${inv.projectId || ''} – Services rendered`;
    doc.text(description, col1, tableRowY + 18);
    doc.setTextColor(brand.text);
    const amountText = `£${amountGBP.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    doc.text(amountText, col2, tableRowY + 18);

    // Summary card
    const summaryTop = tableRowY + rowH + 24;
    const summaryW = 280;
    const summaryX = pageWidth - margin - summaryW;
    doc.setDrawColor(brand.border);
    doc.setFillColor(brand.surface);
    doc.roundedRect(summaryX, summaryTop, summaryW, 110, 10, 10, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(brand.muted);
    doc.setFontSize(10);
    doc.text('Subtotal', summaryX + 16, summaryTop + 24);
    doc.text('Tax (0%)', summaryX + 16, summaryTop + 44);
    doc.text('Total', summaryX + 16, summaryTop + 78);
    doc.setTextColor(brand.text);
    doc.setFont('helvetica', 'bold');
    doc.text(amountText, summaryX + summaryW - 16, summaryTop + 24, { align: 'right' });
    doc.text('£0.00', summaryX + summaryW - 16, summaryTop + 44, { align: 'right' });
    doc.setFontSize(14);
    doc.setTextColor(brand.primary);
    doc.text(amountText, summaryX + summaryW - 16, summaryTop + 78, { align: 'right' });

    // Footer
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(brand.muted);
    doc.text('Thank you for your business. If you have any questions, contact arpkwebsitedevelopment@gmail.com', margin, pageHeight - 40);

    doc.save(`invoice-${inv.id}.pdf`);
  };

  return (
    <div className="h-screen flex overflow-hidden">
      <SidebarProvider defaultOpen={false} storageKey="client:sidebar">
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


