'use client';


import { useEffect } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { familyService } from '@/services/family.service';
import { tripService } from '@/services/trip.service';

export default function OnboardingPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [familyName, setFamilyName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [inviteCodeResult, setInviteCodeResult] = useState('');

    // Check if user already has a family and redirect to home
  useEffect(() => {
    const checkFamily = async () => {
      try {
        const myFamily = await familyService.getMyFamily();
        if (myFamily && myFamily.family) {
          // User already belongs to a family, redirect to home
          router.push('/');
        }
      } catch (error) {
        // User doesn't have a family yet, allow them to create/join
        console.log('No existing family found');
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
      // Create default trip
      await tripService.createTrip(family.id, {
        name: 'Orlando 2026',
        destination: 'Orlando, FL',
        destination_code: 'MCO',
        origin: 'Sao Paulo, SP',
        origin_code: 'GRU',
      });
      router.push('/');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar familia';
      setError(msg);
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
      router.push('/');
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
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
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
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', fontFamily: 'sans-serif' }}>Criar nova familia</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', marginTop: '4px' }}>Voce sera o administrador e podera convidar membros</div>
              </div>
            </button>

            <button
              onClick={() => setMode('join')}
              className="card"
              style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '16px' }}
            >
              <span style={{ fontSize: '32px' }}>🔗</span>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', fontFamily: 'sans-serif' }}>Entrar com codigo</div>
                <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', marginTop: '4px' }}>Use o codigo de convite que voce recebeu</div>
              </div>
            </button>

            <button
              onClick={() => signOut()}
              style={{ padding: '10px', background: 'none', border: 'none', color: 'var(--ink-subtle)', fontSize: '13px', cursor: 'pointer', fontFamily: 'sans-serif', marginTop: '8px' }}
            >
              Sair da conta
            </button>
          </div>
        )}

        {mode === 'create' && (
          <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>Criar nova familia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Nome da familia</label>
                <input className="input-field" type="text" value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder="Ex: Familia Santos" autoFocus />
              </div>
              {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626', fontFamily: 'sans-serif' }}>{error}</div>}
              {inviteCodeResult && (
                <div style={{ padding: '14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#16a34a', fontFamily: 'sans-serif', marginBottom: '4px' }}>Codigo de convite da familia:</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#15803d', letterSpacing: '0.15em', fontFamily: 'monospace' }}>{inviteCodeResult}</div>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontFamily: 'sans-serif', marginTop: '4px' }}>Compartilhe com sua familia!</div>
                </div>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleCreateFamily} disabled={loading} style={{ flex: 1, padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Criando...' : 'Criar familia'}
                </button>
                <button onClick={() => { setMode('choose'); setError(''); setInviteCodeResult(''); }} style={{ padding: '12px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}>
                  Voltar
                </button>
              </div>
            </div>
          </div>
        )}

        {mode === 'join' && (
          <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>Entrar em uma familia</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label className="label">Codigo de convite</label>
                <input className="input-field" type="text" value={inviteCode} onChange={(e) => setInviteCode(e.target.value.toUpperCase())} placeholder="Ex: AB12CD34" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '18px', textAlign: 'center' }} autoFocus />
              </div>
              {error && <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626', fontFamily: 'sans-serif' }}>{error}</div>}
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
