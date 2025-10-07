"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Home, FileText, FolderKanban, Receipt, Settings, User as UserIcon, LogOut, LayoutDashboard } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarOverlay,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export function ClientSidebar() {
  const pathname = usePathname();
  const { setOpen } = useSidebar();
  const [user, setUser] = useState<{ uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        let name = u.displayName || null;
        let photo = u.photoURL || null;
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            const data = snap.data() as any;
            name = data?.name || data?.displayName || name;
            photo = data?.photoURL || data?.avatarUrl || photo;
          }
        } catch {}
        setUser({ uid: u.uid, displayName: name, email: u.email, photoURL: photo });
      } else {
        setUser(null);
      }
    });
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => { unsub(); document.removeEventListener('click', onDocClick); };
  }, []);

  const avatarText = (nameOrEmail: string | null) => {
    if (!nameOrEmail) return 'U';
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameOrEmail[0]?.toUpperCase() || 'U';
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setMenuOpen(false);
    window.location.href = "/";
  };
  const items = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard/requests", label: "Requests", icon: FileText },
    { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
    { href: "/dashboard/invoices", label: "Invoices", icon: Receipt },
    { href: "/profile", label: "Account", icon: Settings },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="px-2 py-2 flex items-center justify-between">
          <div className="text-sm font-semibold">Client</div>
          <div className="lg:hidden">
            {/* Inside-sidebar burger toggle */}
            <SidebarMenuButton onClick={() => setOpen(false)} className="h-9 w-9 p-0 flex items-center justify-center">
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </SidebarMenuButton>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) setOpen(false); }}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} className="py-3">
                      <span className="flex items-center gap-3">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user && (
          <div className="mt-auto px-2 py-3 border-t border-border pb-[calc(env(safe-area-inset-bottom)_+_12px)]" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
              className="w-full flex items-center justify-between gap-2 rounded-xl border border-border bg-card px-3 py-2.5 hover:bg-accent"
            >
              <span className="flex items-center gap-2">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full grid place-items-center text-sm font-medium text-foreground bg-primary/20">
                    {avatarText(user.displayName || user.email)}
                  </div>
                )}
                <span className="text-sm truncate max-w-[150px]">{user.displayName || 'Account'}</span>
              </span>
              <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
            </button>
            {menuOpen && (
              <div className="mt-2 rounded-lg border border-border bg-card shadow-sm overflow-hidden">
                <Link href="/dashboard" className="block px-3 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Dashboard</span>
                </Link>
                <Link href="/profile" className="block px-3 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                  <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" /> Profile</span>
                </Link>
                <div className="h-px bg-border" />
                <button onClick={handleSignOut} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-accent">
                  <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </SidebarContent>
      {/* Mobile overlay to close when clicking outside */}
      <SidebarOverlay />
    </Sidebar>
  );
}


