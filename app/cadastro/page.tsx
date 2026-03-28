'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function translateError(msg: string): string {
  const map: Record<string, string> = {
    'User already registered': 'Este email já está cadastrado',
    'Password should be at least': 'A senha deve ter pelo menos 6 caracteres',
    'Unable to validate email address': 'Email inválido',
    'Signup requires a valid password': 'A senha é obrigatória',
    'Too many requests': 'Muitas tentativas. Aguarde um momento e tente novamente.',
    'Network request failed': 'Erro de conexão. Verifique sua internet.',
    'already been registered': 'Este email já está cadastrado',
  };
  for (const [key, value] of Object.entries(map)) {
    if (msg.toLowerCase().includes(key.toLowerCase())) return value;
  }
  return msg;
}

export default function CadastroPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ fullName?: string; email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate(): boolean {
    const errors: { fullName?: string; email?: string; password?: string } = {};
    if (!fullName.trim()) errors.fullName = 'Informe seu nome';
    if (!email.trim()) errors.email = 'Informe seu email';
    if (!password) errors.password = 'Informe uma senha';
    else if (password.length < 6) errors.password = 'A senha deve ter pelo menos 6 caracteres';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function clearFieldError(field: string) {
    setFieldErrors((p) => ({ ...p, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const { data, error: err } = await signUp(email, password, fullName);
      if (err) throw err;
      if (data?.session) {
        window.location.href = '/';
      } else {
        setSuccess(true);
      }
    } catch (err: unknown) {
      setError(translateError(err instanceof Error ? err.message : 'Erro ao criar conta'));
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 12px' }}>Verifique seu email</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
            Enviamos um link de confirmação para <strong>{email}</strong>. Clique no link para ativar sua conta.
          </p>
          <Link href="/login" style={{ display: 'inline-block', marginTop: '24px', padding: '12px 24px', background: 'var(--ocean)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            Voltar para login
          </Link>
        </div>
      </div>
    );
  }

  const fieldStyle = (hasError: boolean) => hasError ? { borderColor: '#dc2626' } : {};

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: '20px' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>✈️</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 8px' }}>Criar Conta</h1>
          <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Crie sua conta para começar a planejar</p>
        </div>
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '16px', padding: '28px' }}>
          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="label">Nome completo</label>
              <input className="input-field" type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); clearFieldError('fullName'); }} placeholder="Seu nome" style={fieldStyle(!!fieldErrors.fullName)} />
              {fieldErrors.fullName && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{fieldErrors.fullName}</span>}
            </div>
            <div>
              <label className="label">Email</label>
              <input className="input-field" type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearFieldError('email'); }} placeholder="seu@email.com" style={fieldStyle(!!fieldErrors.email)} />
              {fieldErrors.email && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{fieldErrors.email}</span>}
            </div>
            <div>
              <label className="label">Senha</label>
              <input className="input-field" type="password" value={password} onChange={(e) => { setPassword(e.target.value); clearFieldError('password'); }} placeholder="Mínimo 6 caracteres" style={fieldStyle(!!fieldErrors.password)} />
              {fieldErrors.password && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{fieldErrors.password}</span>}
            </div>
            {error && (
              <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '8px', fontSize: '13px', color: '#dc2626', fontFamily: 'sans-serif' }}>
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>ou</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>
          <button onClick={() => signInWithGoogle()} style={{ width: '100%', padding: '12px', background: 'white', color: 'var(--ink)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', fontFamily: 'sans-serif' }}>
            Criar conta com Google
          </button>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color: 'var(--ocean)', textDecoration: 'none', fontWeight: '600' }}>
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}
