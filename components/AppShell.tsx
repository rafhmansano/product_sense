'use client';

import Navigation from './Navigation';

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--alabaster)' }}>
      <Navigation />
      <main
        style={{
          marginLeft: '220px',
          flex: 1,
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}
