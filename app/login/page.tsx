'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function translateError(msg: string): string {
  const map: Record<string, string> = {
    'Invalid login credentials': 'Email ou senha incorretos',
    'Email not confirmed': 'Email ainda não foi confirmado. Verifique sua caixa de entrada.',
    'User not found': 'Usuário não encontrado',
    'Too many requests': 'Muitas tentativas. Aguarde um momento e tente novamente.',
    'Network request failed': 'Erro de conexão. Verifique sua internet.',
    'Invalid email': 'Email inválido',
    'Signup requires a valid password': 'A senha é obrigatória',
  };
  for (const [key, value] of Object.entries(map)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return msg;
}

export default function LoginPage() {
  const { signIn, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  function validate(): boolean {
    const errors: { email?: string; password?: string } = {};
    if (!email.trim()) errors.email = 'Informe seu email';
    if (!password) errors.password = 'Informe sua senha';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { error: err } = await signIn(email, password);
      if (err) throw err;
      router.push('/');
    } catch (err: unknown) {
      setError(translateError(err instanceof Error ? err.message : 'Erro ao fazer login'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 8px' }}>Family Trip Manager</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Entre para gerenciar sua viagem em família</p>
        </div>

        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }} placeholder="seu@email.com" style={fieldErrors.email ? { borderColor: '#dc2626' } : {}} />
              {fieldErrors.email && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{fieldErrors.email}</span>}
            </div>
            <div>
              <label className="label">Senha</label>
              <input className="input-field" type="password" value={password} onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: undefined })); }} placeholder="Sua senha" style={fieldErrors.password ? { borderColor: '#dc2626' } : {}} />
              {fieldErrors.password && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{fieldErrors.password}</span>}
            </div>

            {error && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626', fontFamily: 'sans-serif' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <button
            onClick={() => signInWithGoogle()}
            style={{ width: '100%', padding: '12px', background: 'white', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'sans-serif' }}
          >
            Entrar com Google
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
          Não tem conta?{' '}
          <Link href="/cadastro" style={{ color: 'var(--ocean)', textDecoration: 'none', fontWeight: '600' }}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
