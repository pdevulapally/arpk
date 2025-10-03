"use client";
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';

export function useUserRole() {
  const [role, setRole] = useState<"client" | "admin" | "user" | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { setRole(null); setLoading(false); return; }
      const ref = doc(db, 'users', user.uid);
      const snap = await getDoc(ref);
      setRole((snap.data() as any)?.role ?? "user");
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { role, loading };
}


