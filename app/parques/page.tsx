'use client';

import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { PARKS_DATA } from '@/lib/data';

const SUITABILITY_COLORS: Record<string, string> = {
  perfeito: '#22C55E',
  ok: '#3B82F6',
  cuidado: '#F59E0B',
  restrito: '#EF4444',
};

function ParkCard({ park }: { park: (typeof PARKS_DATA)[number] }) {
  const kidFriendlyCount = park.attractions.filter(
    (a) => a.suitability === 'perfeito' || a.suitability === 'ok'
  ).length;

  return (
    <Link href={`/parques/${park.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="card"
        style={{
          padding: '24px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          borderTop: `4px solid ${park.color}`,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          height: '100%',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
          (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLElement).style.boxShadow = '';
        }}
      >
        <div style={{ fontSize: '40px', lineHeight: 1 }}>{park.icon}</div>

        <div>
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}
          >
            {park.name}
          </h3>
          <p
            style={{
              margin: '6px 0 0',
              fontSize: '14px',
              color: 'var(--ink-muted)',
              lineHeight: 1.5,
            }}
          >
            {park.description}
          </p>
        </div>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 10px',
              borderRadius: '20px',
              background: `${SUITABILITY_COLORS.perfeito}15`,
              color: SUITABILITY_COLORS.perfeito,
              fontSize: '12px',
              fontWeight: 600,
            }}
          >
            ✅ {kidFriendlyCount} atracoes kids
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {park.attractions.slice(0, 5).map((attr) => (
            <span
              key={attr.name}
              style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: SUITABILITY_COLORS[attr.suitability],
              }}
              title={`${attr.name} - ${attr.suitability}`}
            />
          ))}
          {park.attractions.length > 5 && (
            <span style={{ fontSize: '11px', color: 'var(--ink-muted)', lineHeight: '8px' }}>
              +{park.attractions.length - 5}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ParquesPage() {
  return (
    <AppShell>
      <div className="animate-fade-in" style={{ padding: '32px 40px', maxWidth: '1200px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--ink)',
              letterSpacing: '-0.03em',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>🏰</span>
            Guia dos Parques
          </h1>
          <p
            style={{
              margin: '8px 0 0',
              fontSize: '15px',
              color: 'var(--ink-muted)',
              lineHeight: 1.6,
            }}
          >
            Tudo sobre cada parque com foco em criancas de 3 anos. Atracoes, roteiros e dicas
            praticas para a familia.
          </p>
        </div>

        <div
          className="stagger-children"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {PARKS_DATA.map((park) => (
            <ParkCard key={park.id} park={park} />
          ))}
        </div>

        <div
          style={{
            marginTop: '40px',
            padding: '20px 24px',
            borderRadius: '12px',
            background: 'var(--sky)',
            border: '1px solid var(--border)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '13px',
              color: 'var(--ink-muted)',
              lineHeight: 1.6,
            }}
          >
            <strong>Legenda de adequacao:</strong>{' '}
            <span style={{ color: SUITABILITY_COLORS.perfeito }}>● Perfeito</span> &mdash;
            ideal para 3 anos &nbsp;|&nbsp;{' '}
            <span style={{ color: SUITABILITY_COLORS.ok }}>● OK com adulto</span> &mdash;
            possivel com acompanhante &nbsp;|&nbsp;{' '}
            <span style={{ color: SUITABILITY_COLORS.cuidado }}>● Cuidado</span> &mdash;
            avaliar antes &nbsp;|&nbsp;{' '}
            <span style={{ color: SUITABILITY_COLORS.restrito }}>● Restrito</span> &mdash;
            restricao de altura
          </p>
        </div>
      </div>
    </AppShell>
  );
}
