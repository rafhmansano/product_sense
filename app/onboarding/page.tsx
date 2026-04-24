'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { familyService } from '@/services/family.service';
import { tripService } from '@/services/trip.service';

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div style={{ fontSize: '16px', color: 'var(--ink-muted)' }}>Carregando...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const { user, signOut } = useAuth();
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get('code');

  const [mode, setMode] = useState<'choose' | 'create' | 'join'>(codeFromUrl ? 'join' : 'choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState(codeFromUrl?.toUpperCase() || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Auto-fill invite code from URL
  useEffect(() => {
    if (codeFromUrl) {
      setInviteCode(codeFromUrl.toUpperCase());
      setMode('join');
    }
  }, [codeFromUrl]);

  // Check if user already has a family and redirect to home
  useEffect(() => {
    const checkFamily = async () => {
      try {
        const myFamily = await familyService.getMyFamily();
        if (myFamily && myFamily.family) {
          window.location.href = '/';
          return;
        }
      } catch {
        // User doesn't have a family yet
      }
    };
    checkFamily();
  }, []);

  async function handleCreateFamily() {
    if (!familyName.trim()) return;
    setError('');
    setLoading(true);
    try {
      const family = await familyService.createFamily(familyName.trim());
      // Create default trip (non-critical — TripProvider also creates one)
      try {
        await tripService.createTrip(family.id, {
          name: 'Orlando 2026',
          destination: 'Orlando, FL',
          destination_code: 'MCO',
        });
      } catch (tripErr) {
        console.error('Default trip creation failed (non-critical):', tripErr);
      }
      window.location.href = '/';
    } catch (err: unknown) {
      console.error('Create family error:', err);
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || 'Erro ao criar família. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinFamily() {
    if (!inviteCode.trim()) return;
    setError('');
    setLoading(true);
    try {
      await familyService.joinFamily(inviteCode.trim());
      window.location.href = '/';
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Codigo invalido';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👨‍👩‍👦</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 8px' }}>Configurar Familia</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)' }}>
            Ola{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}! Configure sua familia para comecar.
          </p>
        </div>

        {mode === 'choose' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <button
              onClick={() => setMode('create')}
              className="card"
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <span style={{ fontSize: '32px' }}>🏠</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)' }}>Criar nova familia</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px' }}>Voce sera o administrador e podera convidar membros</div>
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="card"
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <span style={{ fontSize: '32px' }}>🔗</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)' }}>Entrar com codigo</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px' }}>Use o codigo de convite que voce recebeu</div>
              </div>
            </button>

            <button
              onClick={async () => { await signOut(); window.location.href = '/login'; }}
              style={{ padding: '10px', background: 'none', border: 'none', color: 'var(--ink-subtle)', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}
            >
              Sair da conta
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px' }}>Criar nova familia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Nome da familia</label>
                <input className="input-field" type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Ex: Familia Santos" autoFocus />
              </div>
              {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCreateFamily} disabled={loading} style={{ flex: 1, padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Criando...' : 'Criar familia'}
                </button>
                <button onClick={() => { setMode('choose'); setError(''); }} style={{ padding: '12px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px' }}>Entrar em uma familia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Codigo de convite</label>
                <input className="input-field" type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="Ex: AB12CD34" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '18px', textAlign: 'center' }} autoFocus />
              </div>
              {codeFromUrl && (
                <div style={{ padding: '10px 14px', background: 'rgba(59, 130, 246, 0.06)', border: '1px solid rgba(59, 130, 246, 0.15)', borderRadius: '8px', fontSize: '13px', color: 'var(--ocean)' }}>
                  Codigo preenchido automaticamente a partir do link de convite
                </div>
              )}
              {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleJoinFamily} disabled={loading} style={{ flex: 1, padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Entrando...' : 'Entrar na familia'}
                </button>
                <button onClick={() => { setMode('choose'); setError(''); }} style={{ padding: '12px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
