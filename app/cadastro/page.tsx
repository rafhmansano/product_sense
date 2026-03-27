'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CadastroPage() {
    const { signUp, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
                const { data, error: err } = await signUp(email, password, fullName);
                if (err) throw err;
                // If email confirmation is disabled, Supabase returns a session immediately
          if (data?.session) {
                    router.push('/');
          } else {
                    setSuccess(true);
          }
        } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'Erro ao criar conta');
        } finally {
                setLoading(false);
        }
  }

  if (success) {
        return (
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '20px' }}>
                          <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                                      <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>div>
                                      <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 12px' }}>Verifique seu email</h1>h1>
                                      <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
                                                    Enviamos um link de confirmacao para <strong>{email}</strong>strong>. Clique no link para ativar sua conta.
                                      </p>p>
                                    <Link href="/login" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', background: 'var(--ocean)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                                                Voltar para login
                                    </Link>Link>
                          </div>div>
                </div>div>
              );
  }
  
    return (
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '20px' }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>div>
                                  <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 8px' }}>Criar Conta</h1>h1>
                                  <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Crie sua conta para comecar a planejar</p>p>
                        </div>div>
                        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
                                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                              <div>
                                                            <label className="label">Nome completo</label>label>
                                                            <input className="input-field" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Seu nome" required />
                                              </div>div>
                                              <div>
                                                            <label className="label">Email</label>label>
                                                            <input className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
                                              </div>div>
                                              <div>
                                                            <label className="label">Senha</label>label>
                                                            <input className="input-field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Minimo 6 caracteres" minLength={6} required />
                                              </div>div>
                                    {error && (
                          <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626', fontFamily: 'sans-serif' }}>
                            {error}
                          </div>div>
                                              )}
                                              <button type="submit" disabled={loading} style={{ padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                                                {loading ? 'Criando...' : 'Criar conta'}
                                              </button>button>
                                  </form>form>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
                                              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                              <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>ou</span>span>
                                              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
                                  </div>div>
                                  <button onClick={() => signInWithGoogle()} style={{ width: '100%', padding: '12px', background: 'white', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'sans-serif' }}>
                                              Criar conta com Google
                                  </button>button>
                        </div>div>
                        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
                                  Ja tem conta?{' '}
                                  <Link href="/login" style={{ color: 'var(--ocean)', textDecoration: 'none', fontWeight: '600' }}>
                                              Fazer login
                                  </Link>Link>
                        </p>p>
                </div>div>
          </div>div>
        );
}</strong>
