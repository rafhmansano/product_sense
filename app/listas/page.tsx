'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import ChecklistPage from '@/components/ChecklistPage';

export default function ListasPage() {
  const [tab, setTab] = useState<'farmacia' | 'mercado'>('farmacia');

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '900px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--ink)', margin: 0, lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🛒</span> Listas de Compras
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '10px', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
            Itens de farmacia e mercado para comprar em Orlando.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: '4px', background: 'var(--border)', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
          <button
            onClick={() => setTab('farmacia')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'farmacia' ? 'white' : 'transparent',
              color: tab === 'farmacia' ? 'var(--ink)' : 'var(--ink-muted)',
              fontWeight: tab === 'farmacia' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'sans-serif',
              boxShadow: tab === 'farmacia' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            💊 Farmacia
          </button>
          <button
            onClick={() => setTab('mercado')}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              border: 'none',
              background: tab === 'mercado' ? 'white' : 'transparent',
              color: tab === 'mercado' ? 'var(--ink)' : 'var(--ink-muted)',
              fontWeight: tab === 'mercado' ? '600' : '400',
              fontSize: '14px',
              cursor: 'pointer',
              fontFamily: 'sans-serif',
              boxShadow: tab === 'mercado' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            🛒 Mercado
          </button>
        </div>

        {/* Content */}
        {tab === 'farmacia' ? (
          <ChecklistPage
            listKey="pharmacyItems"
            title="Farmacia"
            emoji="💊"
            description="Medicamentos e itens de saude para comprar na farmacia (Walgreens, CVS)."
          />
        ) : (
          <ChecklistPage
            listKey="groceryItems"
            title="Mercado"
            emoji="🛒"
            description="Lista de compras do supermercado (Publix, Walmart, Target)."
          />
        )}
      </div>
    </AppShell>
  );
}
