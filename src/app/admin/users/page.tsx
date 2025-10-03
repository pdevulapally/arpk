"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { cols } from "@/lib/firebase-collections";
import { getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useUserRole } from "@/hooks/useUserRole";
import { ArrowLeft, User2 } from "lucide-react";

type UserRow = {
  id: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function AdminUsersPage() {
  const { role, loading } = useUserRole();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [fetching, setFetching] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setFetching(true);
        const snap = await getDocs(cols.users());
        setUsers(snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as UserRow[]);
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
          <h1 className="font-heading text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage registered users and roles</p>
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
      {!fetching && users.length === 0 && (
        <div className="rounded-xl border border-border p-6 text-center text-muted-foreground">No users found.</div>
      )}

      <div className="grid gap-3">
        {users.map((u) => {
          const displayName = (u.name && String(u.name).trim().length > 0)
            ? String(u.name)
            : (u.email ? String(u.email).split('@')[0] : u.id.slice(0, 6));
          return (
          <div key={u.id} className="rounded-xl border border-border p-4 bg-card flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                <User2 className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{displayName}</div>
                <div className="text-sm text-muted-foreground truncate">{u.email || '—'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <select
                className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                value={String(u.role || 'user')}
                disabled={busyId === u.id}
                onChange={async (e) => {
                  const newRole = e.target.value;
                  setBusyId(u.id);
                  try {
                    await updateDoc(doc(db, 'users', u.id), { role: newRole === 'user' ? 'client' : newRole });
                    setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
                  } finally {
                    setBusyId(null);
                  }
                }}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
                <option value="client">client</option>
              </select>
            </div>
          </div>
          );
        })}
      </div>
    </main>
  );
}


