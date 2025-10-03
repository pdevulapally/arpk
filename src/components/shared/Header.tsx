"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function Header() {
  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<{ uid: string; displayName: string | null; email: string | null; photoURL: string | null } | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
          }
        } catch {}
        setUser({ uid: u.uid, displayName: profileName, email: u.email, photoURL: profilePhoto });
      } else {
        setUser(null);
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
        <Link href="/" className="flex items-center">
          <img 
            src="/Images/ARPK-official-black-logo.png" 
            alt="ARPK" 
            className={`h-12 sm:h-16 w-auto ${darkMode ? 'hidden' : 'block'}`}
          />
          <img 
            src="/Images/ARPK-Official-white-Logo.png" 
            alt="ARPK" 
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
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenuOpen(v => !v)} className="flex items-center gap-2 rounded-full border border-border bg-card px-2 py-1 hover:bg-accent">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <div className={`h-8 w-8 rounded-full grid place-items-center text-sm font-medium text-foreground bg-gradient-to-br ${gradientFor(user.displayName || user.email || 'U')}`}>
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
                  </div>
                  <div className="h-px bg-border" />
                  <div className="py-1">
                    <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Client dashboard</Link>
                    <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Admin dashboard</Link>
                    <Link href="/request" className="block px-4 py-2 text-sm hover:bg-accent" onClick={() => setMenuOpen(false)}>Make a request</Link>
                  </div>
                  <div className="h-px bg-border" />
                  <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-accent">Sign out</button>
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
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className={`h-9 w-9 rounded-full grid place-items-center text-sm font-medium text-foreground bg-gradient-to-br ${gradientFor(user.displayName || user.email || 'U')}`}>
                    {avatarText(user.displayName || user.email)}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-foreground">{user.displayName || 'Account'}</div>
                  <div className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</div>
                </div>
              </div>
              <div className="h-px bg-border" />
              <Link href="/dashboard" className="block px-2 py-2 rounded-md hover:bg-accent" onClick={() => setOpen(false)}>Client dashboard</Link>
              <Link href="/admin" className="block px-2 py-2 rounded-md hover:bg-accent" onClick={() => setOpen(false)}>Admin dashboard</Link>
              <Link href="/request" className="block px-2 py-2 rounded-md hover:bg-accent" onClick={() => setOpen(false)}>Make a request</Link>
              <button onClick={() => { setOpen(false); handleSignOut(); }} className="w-full text-left px-2 py-2 rounded-md hover:bg-accent text-red-600">Sign out</button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}


