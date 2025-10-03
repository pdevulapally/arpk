"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

export function Footer() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);

    const handleThemeChange = (event: CustomEvent) => {
      setDarkMode(event.detail.isDark);
    };

    window.addEventListener('themeChange', handleThemeChange as EventListener);
    return () => window.removeEventListener('themeChange', handleThemeChange as EventListener);
  }, []);

  return (
    <footer className="bg-muted text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="mb-4">
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
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Premium web and software studio delivering clear outcomes with transparent processes.
            </p>
            <div className="flex gap-4">
              <Link href="/request" className="bg-primary text-primary-foreground px-6 py-3 rounded-2xl font-medium hover:opacity-90 transition-opacity">
                Request a Quote
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/services" className="hover:text-foreground transition-colors">Web Development</Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors">Software Development</Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors">Consulting</Link></li>
              <li><Link href="/services" className="hover:text-foreground transition-colors">Maintenance</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/process" className="hover:text-foreground transition-colors">Our Process</Link></li>
              <li><Link href="/work" className="hover:text-foreground transition-colors">Portfolio</Link></li>
              <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ARPK Studio. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


