'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { GENERAL_TIPS } from '@/lib/data';

export default function DicasPage() {
  const [expandedCategories, setExpandedCategories] = useState<Record<number, boolean>>(
    () => Object.fromEntries(GENERAL_TIPS.map((_, idx) => [idx, true]))
  );

  const toggleCategory = (idx: number) => {
    setExpandedCategories((prev) => ({ ...prev, [idx]: !prev[idx] }));
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
            <span style={{ fontSize: '32px' }}>💡</span> Dicas Gerais
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
            Dicas essenciais organizadas por categoria para aproveitar ao maximo sua viagem em familia para Orlando.
          </p>
        </div>

        {/* Tips by Category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} className="stagger-children">
          {GENERAL_TIPS.map((category, idx) => {
            const isExpanded = expandedCategories[idx] ?? true;
            return (
              <div
                key={idx}
                className="card"
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#cbd5e1')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {/* Category Header - Collapsible */}
                <button
                  onClick={() => toggleCategory(idx)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '20px 24px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#f8f9fa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span style={{ fontSize: '28px', flexShrink: 0 }}>{category.icon}</span>
                  <span
                    style={{
                      flex: 1,
                      fontSize: '18px',
                      fontWeight: '600',
                      color: 'var(--navy)',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    {category.category}
                  </span>
                  <span
                    style={{
                      fontSize: '12px',
                      color: 'var(--ink-subtle)',
                      fontFamily: 'sans-serif',
                      marginRight: '8px',
                    }}
                  >
                    {category.tips.length} {category.tips.length === 1 ? 'dica' : 'dicas'}
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: 'var(--ink-subtle)',
                      transition: 'transform 0.2s',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      flexShrink: 0,
                    }}
                  >
                    ▼
                  </span>
                </button>

                {/* Tips List */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '0 24px 20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    {category.tips.map((tip, tipIdx) => (
                      <div
                        key={tipIdx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '12px',
                          padding: '10px 14px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          borderLeft: '3px solid var(--navy)',
                        }}
                      >
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            background: 'var(--navy)',
                            flexShrink: 0,
                            marginTop: '7px',
                          }}
                        />
                        <span
                          style={{
                            fontSize: '14px',
                            color: 'var(--ink)',
                            fontFamily: 'sans-serif',
                            lineHeight: 1.6,
                          }}
                        >
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
