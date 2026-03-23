'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { RESTAURANTS, SUPERMARKETS, FOOD_TIPS, SUPERMARKET_ESSENTIALS } from '@/lib/data';

export default function AlimentacaoPage() {
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});

  const toggleItem = (idx: number) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--navy)',
              margin: 0,
              lineHeight: 1.15,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>🍽️</span> Alimentacao
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--ink-muted)',
              marginTop: '12px',
              fontFamily: 'sans-serif',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Guia completo de alimentacao em Orlando: restaurantes, supermercados e dicas para economizar.
          </p>
        </div>

        {/* Restaurantes Recomendados */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
            Restaurantes Recomendados
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>
                    Restaurante
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>
                    Localizacao
                  </th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>
                    Destaque
                  </th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>
                    Kids
                  </th>
                </tr>
              </thead>
              <tbody>
                {RESTAURANTS.map((r, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: 'var(--navy)' }}>
                      {r.name}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--ink-muted)' }}>
                      {r.location}
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--ink)' }}>
                      {r.highlight}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '16px' }}>
                      {r.kidFriendly ? (
                        <span style={{ color: '#16a34a' }}>&#10003;</span>
                      ) : (
                        <span style={{ color: '#dc2626' }}>&#10007;</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supermercados em Orlando */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
            Supermercados em Orlando
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="stagger-children">
            {SUPERMARKETS.map((s, idx) => (
              <div
                key={idx}
                style={{
                  padding: '16px 20px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--navy)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>🛒</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--navy)', fontFamily: 'sans-serif' }}>
                    {s.name}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', marginTop: '4px', lineHeight: 1.5 }}>
                    {s.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* O Que Comprar no Supermercado */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
            O Que Comprar no Supermercado
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {SUPERMARKET_ESSENTIALS.map((item, idx) => (
              <label
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  background: checkedItems[idx] ? '#f0fdf4' : 'transparent',
                  fontFamily: 'sans-serif',
                }}
                onMouseEnter={(e) => {
                  if (!checkedItems[idx]) e.currentTarget.style.background = '#f8f9fa';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = checkedItems[idx] ? '#f0fdf4' : 'transparent';
                }}
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[idx]}
                  onChange={() => toggleItem(idx)}
                  style={{ width: '18px', height: '18px', accentColor: 'var(--navy)', cursor: 'pointer' }}
                />
                <span
                  style={{
                    fontSize: '14px',
                    color: checkedItems[idx] ? 'var(--ink-muted)' : 'var(--ink)',
                    textDecoration: checkedItems[idx] ? 'line-through' : 'none',
                    lineHeight: 1.5,
                  }}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Dicas de Alimentacao nos Parques */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
            Dicas de Alimentacao nos Parques
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="stagger-children">
            {FOOD_TIPS.map((tip, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px 16px',
                  background: '#fefce8',
                  borderRadius: '10px',
                  border: '1px solid #fef08a',
                }}
              >
                <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', fontFamily: 'sans-serif', lineHeight: 1.5 }}>
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
