'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { tripService } from '@/services/trip.service';
import Link from 'next/link';

export default function SharedTripPage() {
  const params = useParams();
  const shareCode = params.shareCode as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await tripService.getTripByShareCode(shareCode);
        if (data) {
          setTrip(data);
        } else {
          setError(true);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [shareCode]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', gap: '16px' }}>
        <div style={{ fontSize: '40px' }}>✈️</div>
        <div style={{ fontSize: '16px', color: 'var(--ink-muted)' }}>Carregando viagem compartilhada...</div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', gap: '16px', padding: '20px' }}>
        <div style={{ fontSize: '48px' }}>🔍</div>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: 0 }}>Viagem nao encontrada</h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', textAlign: 'center' }}>
          O codigo <strong>{shareCode}</strong> nao corresponde a nenhuma viagem.
        </p>
        <Link href="/login" style={{ padding: '12px 24px', background: 'var(--ocean)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', marginTop: '12px' }}>
          Fazer login
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: '40px 20px' }}>
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '14px', color: 'var(--ink-subtle)', marginBottom: '8px' }}>Viagem compartilhada (somente leitura)</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 8px' }}>
            {(trip.name as string) || 'Viagem'}
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-muted)' }}>
            {(trip.origin as string) || ''} → {(trip.destination as string) || ''}
          </p>
          {trip.start_date && (
            <p style={{ fontSize: '14px', color: 'var(--ink-subtle)', marginTop: '4px' }}>
              {new Date((trip.start_date as string) + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
              {trip.end_date && <> — {new Date((trip.end_date as string) + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</>}
            </p>
          )}
        </div>

        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '15px', color: 'var(--ink-muted)', lineHeight: 1.6, margin: '0 0 20px' }}>
            Para editar esta viagem, faca login e entre na familia com o codigo de convite.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/login" style={{ padding: '12px 24px', background: 'var(--ocean)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Fazer login
            </Link>
            <Link href="/cadastro" style={{ padding: '12px 24px', background: 'white', color: 'var(--ocean)', border: '1px solid var(--border)', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
