"use client";
import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard, FileText, FolderKanban, Receipt, Settings as Cog, Users, LogOut, User as UserIcon, Home as HomeIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function Header() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<{ uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const hoverOpenTimer = useRef<number | null>(null);
  const hoverCloseTimer = useRef<number | null>(null);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (u) {
        let profileName = u.displayName || null;
        let profilePhoto = u.photoURL || null;
        try {
          const snap = await getDoc(doc(db, 'users', u.uid));
          if (snap.exists()) {
            const data = snap.data() as any;
            profileName = data?.name || data?.displayName || profileName;
            profilePhoto = data?.photoURL || data?.avatarUrl || profilePhoto;
            setUserRole(data?.role || 'user');
          }
        } catch {}
        setUser({ uid: u.uid, displayName: profileName, email: u.email, photoURL: profilePhoto });
      } else {
        setUser(null);
        setUserRole(null);
      }
    });
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => { unsub(); document.removeEventListener('click', onDocClick); };
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { isDark: newTheme } 
    }));
  };

  const avatarText = (nameOrEmail: string | null) => {
    if (!nameOrEmail) return 'U';
    const parts = nameOrEmail.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return nameOrEmail[0]?.toUpperCase() || 'U';
  };

  const gradientFor = (seed: string) => {
    // Simple deterministic palette using char code
    const code = seed.charCodeAt(0) || 65;
    const i = code % 5;
    const map = [
      'from-primary/20 to-primary/40',
      'from-purple-500/20 to-purple-500/40',
      'from-blue-500/20 to-blue-500/40',
      'from-green-500/20 to-green-500/40',
      'from-orange-500/20 to-orange-500/40',
    ];
    return map[i];
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center" aria-label="ARPK Home">
          <Image
            src="/Images/ARPK-official-black-logo.png"
            alt="ARPK Logo"
            width={128}
            height={64}
            priority
            className={`h-12 sm:h-16 w-auto ${darkMode ? 'hidden' : 'block'}`}
          />
          <Image
            src="/Images/ARPK-Official-white-Logo.png"
            alt="ARPK Logo"
            width={128}
            height={64}
            priority
            className={`h-12 sm:h-16 w-auto ${darkMode ? 'block' : 'hidden'}`}
          />
        </Link>
        <nav className="hidden sm:flex items-center gap-8 text-sm flex-1 justify-center">
          <Link href="/services" className="text-muted-foreground hover:text-foreground transition-colors">Services</Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
          <Link href="/portfolio" className="text-muted-foreground hover:text-foreground transition-colors">Portfolio</Link>
          <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
        </nav>
        <div className="hidden sm:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {!user ? (
            <>
              <Link href="/request" className="rounded-2xl px-6 py-3 bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity">Get Started</Link>
              <Link href="/login" className="rounded-2xl px-6 py-3 border border-border hover:bg-accent transition-colors">Login</Link>
            </>
          ) : (
            <div
              className="relative z-50"
              ref={menuRef}
              onMouseEnter={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  if (hoverCloseTimer.current) { window.clearTimeout(hoverCloseTimer.current); hoverCloseTimer.current = null; }
                  hoverOpenTimer.current = window.setTimeout(() => setMenuOpen(true), 120);
                }
              }}
              onMouseLeave={() => {
                if (typeof window !== 'undefined' && window.innerWidth >= 768) {
                  if (hoverOpenTimer.current) { window.clearTimeout(hoverOpenTimer.current); hoverOpenTimer.current = null; }
                  hoverCloseTimer.current = window.setTimeout(() => setMenuOpen(false), 180);
                }
              }}
            >
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
                className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 hover:bg-accent"
              >
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-medium text-foreground bg-gradient-to-br ${gradientFor(user.displayName || user.email || 'U')}`} aria-label={user.displayName || user.email || "User"}>
                    {avatarText(user.displayName || user.email)}
                  </div>
                )}
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg overflow-hidden z-50" onClick={(e) => e.stopPropagation()}>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{user.displayName || 'Account'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    {userRole && (
                      <span className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] capitalize ${userRole==='admin' ? 'bg-purple-500/15 text-purple-600 border-purple-500/30' : 'bg-blue-500/15 text-blue-600 border-blue-500/30'}`}>
                        {userRole}
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-border" />
                  <div className="py-1">
                    {userRole === 'admin' ? (
                      // Admin dropdown
                      <>
                        <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Admin dashboard</span>
                        </Link>
                        <Link href="/admin/requests" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4" /> Requests</span>
                        </Link>
                        <Link href="/admin/projects" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><FolderKanban className="h-4 w-4" /> Projects</span>
                        </Link>
                        <Link href="/admin/invoices" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><Receipt className="h-4 w-4" /> Invoices</span>
                        </Link>
                        <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><Users className="h-4 w-4" /> Users</span>
                        </Link>
                        <Link href="/admin/settings" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><Cog className="h-4 w-4" /> Settings</span>
                        </Link>
                      </>
                    ) : (
                      // Client/User dropdown
                      <>
                        <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><LayoutDashboard className="h-4 w-4" /> Client dashboard</span>
                        </Link>
                        <Link href="/dashboard/requests" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><FileText className="h-4 w-4" /> My requests</span>
                        </Link>
                        <Link href="/dashboard/projects" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><FolderKanban className="h-4 w-4" /> My projects</span>
                        </Link>
                        <Link href="/dashboard/invoices" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><Receipt className="h-4 w-4" /> My invoices</span>
                        </Link>
                        <Link href="/profile" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>
                          <span className="inline-flex items-center gap-2"><UserIcon className="h-4 w-4" /> Profile</span>
                        </Link>
                      </>
                    )}
                  </div>
                  <div className="h-px bg-border" />
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-accent">
                    <span className="inline-flex items-center gap-2"><LogOut className="h-4 w-4" /> Sign out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="sm:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          {user && (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 hover:bg-accent">
                {user.photoURL ? (
                  <Image src={user.photoURL} alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-medium text-foreground bg-gradient-to-br ${gradientFor(user.displayName || user.email || 'U')}`} aria-label={user.displayName || user.email || "User"}>
                    {avatarText(user.displayName || user.email)}
                  </div>
                )}
                <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-card shadow-lg overflow-hidden">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{user.displayName || 'Account'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    {userRole && (
                      <span className={`mt-2 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] capitalize ${userRole==='admin' ? 'bg-purple-500/15 text-purple-600 border-purple-500/30' : 'bg-blue-500/15 text-blue-600 border-blue-500/30'}`}>
                        {userRole}
                      </span>
                    )}
                  </div>
                  <div className="h-px bg-border" />
                  <div className="py-1">
                    {userRole === 'admin' ? (
                      <>
                        <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Admin dashboard</Link>
                        <Link href="/admin/requests" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Requests</Link>
                        <Link href="/admin/projects" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Projects</Link>
                        <Link href="/admin/invoices" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Invoices</Link>
                        <Link href="/admin/users" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Users</Link>
                        <Link href="/admin/settings" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Settings</Link>
                      </>
                    ) : (
                      <>
                        <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Client dashboard</Link>
                        <Link href="/dashboard/requests" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>My requests</Link>
                        <Link href="/dashboard/projects" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>My projects</Link>
                        <Link href="/dashboard/invoices" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>My invoices</Link>
                        <Link href="/request" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Make a request</Link>
                      </>
                    )}
                  </div>
                  <div className="h-px bg-border" />
                  <button onClick={() => { setMenuOpen(false); handleSignOut(); }} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-accent">Sign out</button>
                </div>
              )}
            </div>
          )}
          <button className="p-2" onClick={() => setOpen(v => !v)} aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="sm:hidden border-t border-border bg-background px-4 py-4 space-y-4">
          <Link href="/services" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground">Services</Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground">Pricing</Link>
          <Link href="/portfolio" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground">Portfolio</Link>
          <Link href="/contact" onClick={() => setOpen(false)} className="block text-muted-foreground hover:text-foreground">Contact</Link>
          {!user ? (
            <>
              <Link href="/request" className="block rounded-2xl px-6 py-3 bg-primary text-primary-foreground font-medium text-center" onClick={() => setOpen(false)}>Get Started</Link>
              <Link href="/login" className="block rounded-2xl px-6 py-3 border border-border text-center" onClick={() => setOpen(false)}>Login</Link>
            </>
          ) : null}
        </div>
      )}
    </header>
  );
}


