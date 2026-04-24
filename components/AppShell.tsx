'use client';

import Navigation from './Navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', overflowX: 'hidden' }}>
      <Navigation />
      <main className="main-content" style={{ paddingTop: '44px', minHeight: '100vh', overflowX: 'hidden' }}>
        {children}
      </main>
    </div>
  );
}
