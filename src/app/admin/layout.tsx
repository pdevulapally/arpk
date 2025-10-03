'use client';

import * as React from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-background relative overflow-x-hidden overflow-y-hidden">
      {/* Subtle premium backdrop accents using existing theme colors */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-15%] left-[-10%] h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-15%] right-[-10%] h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
      </div>
      <div className="mx-auto">
        {children}
      </div>
    </div>
  );
}


