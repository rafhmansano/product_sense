'use client';

import Navigation from './Navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navigation />
      <main style={{ paddingTop: '44px', minHeight: '100vh' }}>
        {children}
      </main>
    </div>
  );
}
