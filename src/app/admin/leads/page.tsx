"use client";
import { useUserRole } from '@/hooks/useUserRole';

export default function AdminLeads() {
  const { role, loading } = useUserRole();
  if (loading) return <main className="max-w-6xl mx-auto px-4 py-12">Loading…</main>;
  if (role !== 'admin') return <main className="max-w-6xl mx-auto px-4 py-12">Admins only.</main>;
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-heading text-3xl">Leads</h1>
      <p className="text-muted">Requests and contact submissions will appear here.</p>
    </main>
  );
}


