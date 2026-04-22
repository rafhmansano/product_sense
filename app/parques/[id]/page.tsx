'use client';

import { use } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { PARKS_DATA } from '@/lib/data';

const SUITABILITY_COLORS: Record<string, string> = {
  perfeito: '#22C55E',
  ok: '#3B82F6',
  cuidado: '#F59E0B',
  restrito: '#EF4444',
};

const SUITABILITY_LABELS: Record<string, string> = {
  perfeito: 'Perfeito 3 anos',
  ok: 'OK com adulto',
  cuidado: 'Cuidado',
  restrito: 'Restrito',
};

function SuitabilityBadge({
  suitability,
  heightRestriction,
}: {
  suitability: string;
  heightRestriction?: number;
}) {
  const color = SUITABILITY_COLORS[suitability] ?? '#888';
  const label = SUITABILITY_LABELS[suitability] ?? suitability;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '20px',
        background: `${color}18`,
        color,
        fontSize: '12px',
        fontWeight: 600,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
      {heightRestriction && (
        <span style={{ fontWeight: 400 }}>&middot; min {heightRestriction}cm</span>
      )}
    </span>
  );
}

export default function ParkDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const park = PARKS_DATA.find((p) => p.id === id);

  if (!park) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ color: 'var(--ink)' }}>Parque nao encontrado</h2>
          <Link href="/parques" className="btn-secondary" style={{ marginTop: '16px', display: 'inline-block' }}>
            ← Voltar aos Parques
          </Link>
        </div>
      </AppShell>
    );
  }

  const perfeitoCount = park.attractions.filter((a) => a.suitability === 'perfeito').length;
  const restritoCount = park.attractions.filter((a) => a.suitability === 'restrito').length;

  return (
    <AppShell>
      <div className="animate-fade-in" style={{ padding: '32px 40px', maxWidth: '960px' }}>
        {/* Back link */}
        <Link
          href="/parques"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '14px',
            color: 'var(--ink-muted)',
            textDecoration: 'none',
            marginBottom: '24px',
            transition: 'color 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--ocean)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.color = 'var(--ink-muted)';
          }}
        >
          ← Voltar aos Parques
        </Link>

        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '8px',
          }}
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              background: `${park.color}18`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            {park.icon}
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                fontWeight: 800,
                color: park.color,
                letterSpacing: '-0.03em',
              }}
            >
              {park.name}
            </h1>
            <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--ink-muted)' }}>
              {park.description}
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
            margin: '20px 0 32px',
          }}
        >
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: `${SUITABILITY_COLORS.perfeito}12`,
              border: `1px solid ${SUITABILITY_COLORS.perfeito}30`,
              fontSize: '13px',
              color: SUITABILITY_COLORS.perfeito,
              fontWeight: 600,
            }}
          >
            ✅ {perfeitoCount} perfeitas para 3 anos
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: `${SUITABILITY_COLORS.restrito}12`,
              border: `1px solid ${SUITABILITY_COLORS.restrito}30`,
              fontSize: '13px',
              color: SUITABILITY_COLORS.restrito,
              fontWeight: 600,
            }}
          >
            🚫 {restritoCount} restritas por altura
          </div>
          <div
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              background: 'var(--sky)',
              border: '1px solid var(--border)',
              fontSize: '13px',
              color: 'var(--ink-muted)',
              fontWeight: 600,
            }}
          >
            🎢 {park.attractions.length} atracoes no total
          </div>
        </div>

        {/* Atracoes Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              margin: '0 0 20px',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            🎢 Atracoes
          </h2>

          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {park.attractions.map((attr) => (
              <div
                key={attr.name}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  borderLeft: `3px solid ${SUITABILITY_COLORS[attr.suitability]}`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      flexWrap: 'wrap',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: 'var(--ink)',
                      }}
                    >
                      {attr.name}
                    </span>
                    <SuitabilityBadge
                      suitability={attr.suitability}
                      heightRestriction={attr.heightRestriction}
                    />
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      color: 'var(--ink-muted)',
                      lineHeight: 1.5,
                    }}
                  >
                    {attr.description}
                  </p>
                  {attr.tip && (
                    <p
                      style={{
                        margin: '6px 0 0',
                        fontSize: '12px',
                        color: 'var(--sunset)',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      💡 {attr.tip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Roteiro Recomendado Section */}
        {park.route && park.route.length > 0 && (
          <section style={{ marginBottom: '40px' }}>
            <h2
              style={{
                margin: '0 0 20px',
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--ink)',
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              🗺️ Roteiro Recomendado
            </h2>

            <div style={{ position: 'relative', paddingLeft: '28px' }}>
              {/* Timeline line */}
              <div
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '8px',
                  bottom: '8px',
                  width: '2px',
                  background: `${park.color}30`,
                  borderRadius: '1px',
                }}
              />

              <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {park.route.map((step, i) => (
                  <div
                    key={i}
                    style={{
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    {/* Timeline dot */}
                    <div
                      style={{
                        position: 'absolute',
                        left: '-24px',
                        top: '4px',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: park.color,
                        border: '2px solid white',
                        boxShadow: `0 0 0 2px ${park.color}40`,
                        flexShrink: 0,
                      }}
                    />

                    <div
                      className="card"
                      style={{
                        flex: 1,
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: park.color,
                          fontVariantNumeric: 'tabular-nums',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {step.time}
                      </span>
                      <span
                        style={{
                          fontSize: '14px',
                          color: 'var(--ink)',
                          lineHeight: 1.5,
                        }}
                      >
                        {step.activity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Dicas Section */}
        <section style={{ marginBottom: '40px' }}>
          <h2
            style={{
              margin: '0 0 20px',
              fontSize: '20px',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            💡 Dicas
          </h2>

          <div
            className="stagger-children"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '12px',
            }}
          >
            {park.tips.map((tip, i) => (
              <div
                key={i}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '18px',
                    lineHeight: 1,
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                >
                  📌
                </span>
                <p
                  style={{
                    margin: 0,
                    fontSize: '14px',
                    color: 'var(--ink)',
                    lineHeight: 1.6,
                  }}
                >
                  {tip}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Back button */}
        <div style={{ paddingTop: '8px' }}>
          <Link
            href="/parques"
            className="btn-secondary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
            }}
          >
            ← Voltar ao Guia dos Parques
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
