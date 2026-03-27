'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import type { FamilyMember } from '@/types';

const ROLE_LABELS: Record<string, string> = {
  pai: 'Pai',
  mae: 'Mae',
  crianca: 'Crianca',
};

const ROLE_ICONS: Record<string, string> = {
  pai: '👨',
  mae: '👩',
  crianca: '👦',
};

export default function FamiliaPage() {
  const { user } = useAuth();
  const trip = useAppStore((s) => s.trip);
  const updateTrip = useAppStore((s) => s.updateTrip);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState<FamilyMember['role']>('crianca');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');

  // Invite state
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [loadingCode, setLoadingCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [emailTo, setEmailTo] = useState('');

  async function loadInviteCode() {
    if (inviteCode) return;
    if (!isSupabaseConfigured() || !supabase) return;
    setLoadingCode(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: memberData } = await supabase
        .from('family_members')
        .select('family_id, family:families(invite_code)')
        .eq('user_id', authUser.id)
        .single();

      if (memberData?.family) {
        const family = memberData.family as unknown as Record<string, string>;
        setInviteCode(family.invite_code || null);
      }
    } catch {
      // ignore
    } finally {
      setLoadingCode(false);
    }
  }

  function handleAddMember() {
    if (!name.trim()) return;
    const newMember: FamilyMember = {
      name: name.trim(),
      role,
      ...(age ? { age: Number(age) } : {}),
      ...(heightCm ? { heightCm: Number(heightCm) } : {}),
    };
    updateTrip({ members: [...trip.members, newMember] });
    resetForm();
  }

  function handleEditMember(index: number) {
    const member = trip.members[index];
    setName(member.name);
    setRole(member.role);
    setAge(member.age?.toString() ?? '');
    setHeightCm(member.heightCm?.toString() ?? '');
    setEditingId(index);
    setShowAddForm(true);
  }

  function handleSaveEdit() {
    if (editingId === null || !name.trim()) return;
    const updated = [...trip.members];
    updated[editingId] = {
      name: name.trim(),
      role,
      ...(age ? { age: Number(age) } : {}),
      ...(heightCm ? { heightCm: Number(heightCm) } : {}),
    };
    updateTrip({ members: updated });
    resetForm();
  }

  function handleDeleteMember(index: number) {
    const updated = trip.members.filter((_, i) => i !== index);
    updateTrip({ members: updated });
  }

  function resetForm() {
    setName('');
    setRole('crianca');
    setAge('');
    setHeightCm('');
    setShowAddForm(false);
    setEditingId(null);
  }

  async function handleCopyCode() {
    if (!inviteCode) return;
    await navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  }

  async function handleCopyLink() {
    if (!inviteCode) return;
    const url = `${window.location.origin}/onboarding?code=${inviteCode}`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Convite — Family Trip Manager',
          text: `Entre na nossa familia no Family Trip Manager! Codigo: ${inviteCode}`,
          url,
        });
        return;
      }
    } catch {
      // fallback to copy
    }
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  }

  function handleEmailInvite() {
    if (!emailTo.trim() || !inviteCode) return;
    const subject = encodeURIComponent('Convite — Family Trip Manager');
    const body = encodeURIComponent(
      `Oi! Estou planejando nossa viagem para Orlando no Family Trip Manager.\n\n` +
      `Para acessar, crie uma conta e use o codigo de convite:\n\n` +
      `Codigo: ${inviteCode}\n\n` +
      `Ou clique neste link:\n${window.location.origin}/onboarding?code=${inviteCode}\n\n` +
      `Ate la! ✈️`
    );
    window.open(`mailto:${emailTo.trim()}?subject=${subject}&body=${body}`, '_blank');
    setEmailTo('');
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>👨‍👩‍👦</span> Familia
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', margin: 0, fontFamily: 'sans-serif' }}>
          Gerencie os membros da viagem e convide outras pessoas
        </p>
      </div>

      {/* Members list */}
      <div className="card" style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0, fontFamily: 'sans-serif' }}>
            Viajantes ({trip.members.length})
          </h2>
          <button
            onClick={() => { resetForm(); setShowAddForm(true); }}
            style={{ padding: '6px 14px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            + Adicionar
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {trip.members.map((member, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                background: 'var(--background)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ fontSize: '28px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '50%', border: '1px solid var(--border)', flexShrink: 0 }}>
                {ROLE_ICONS[member.role] || '👤'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink)', fontFamily: 'sans-serif' }}>
                  {member.name || 'Sem nome'}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
                  <span>{ROLE_LABELS[member.role]}</span>
                  {member.age !== undefined && <span>• {member.age} anos</span>}
                  {member.heightCm !== undefined && <span>• {member.heightCm}cm</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                <button
                  onClick={() => handleEditMember(index)}
                  style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '6px' }}
                  title="Editar"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteMember(index)}
                  style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '6px' }}
                  title="Remover"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}

          {trip.members.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)', fontSize: '14px', fontFamily: 'sans-serif' }}>
              Nenhum viajante cadastrado
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit form */}
      {showAddForm && (
        <div className="card" style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 16px', fontFamily: 'sans-serif' }}>
            {editingId !== null ? 'Editar viajante' : 'Novo viajante'}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="label">Nome</label>
              <input
                className="input-field"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do viajante"
                autoFocus
              />
            </div>
            <div>
              <label className="label">Papel na familia</label>
              <select
                className="input-field"
                value={role}
                onChange={(e) => setRole(e.target.value as FamilyMember['role'])}
              >
                <option value="pai">Pai</option>
                <option value="mae">Mae</option>
                <option value="crianca">Crianca</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="label">Idade</label>
                <input
                  className="input-field"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Ex: 3"
                  min="0"
                  max="99"
                />
              </div>
              <div>
                <label className="label">Altura (cm)</label>
                <input
                  className="input-field"
                  type="number"
                  value={heightCm}
                  onChange={(e) => setHeightCm(e.target.value)}
                  placeholder="Ex: 95"
                  min="0"
                  max="250"
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <button
                onClick={editingId !== null ? handleSaveEdit : handleAddMember}
                style={{ flex: 1, padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}
              >
                {editingId !== null ? 'Salvar' : 'Adicionar'}
              </button>
              <button
                onClick={resetForm}
                style={{ padding: '12px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '14px', cursor: 'pointer' }}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite section */}
      {isSupabaseConfigured() && user && (
        <div className="card" style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 6px', fontFamily: 'sans-serif' }}>
            Convidar para o app
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '0 0 16px', fontFamily: 'sans-serif' }}>
            Convide alguem para acessar e editar os dados da viagem
          </p>

          {!inviteCode ? (
            <button
              onClick={loadInviteCode}
              disabled={loadingCode}
              style={{ padding: '12px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '600', cursor: loadingCode ? 'wait' : 'pointer', width: '100%', opacity: loadingCode ? 0.7 : 1 }}
            >
              {loadingCode ? 'Carregando...' : 'Ver codigo de convite'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Invite code display */}
              <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-muted)', marginBottom: '6px', fontFamily: 'sans-serif' }}>
                  Codigo de convite
                </div>
                <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--ocean)', letterSpacing: '0.15em', fontFamily: 'monospace' }}>
                  {inviteCode}
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  onClick={handleCopyCode}
                  style={{
                    padding: '10px',
                    background: copiedCode ? 'rgba(34, 197, 94, 0.1)' : 'var(--background)',
                    color: copiedCode ? '#16a34a' : 'var(--ink)',
                    border: `1px solid ${copiedCode ? '#86efac' : 'var(--border)'}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                  }}
                >
                  {copiedCode ? '✓ Copiado!' : '📋 Copiar codigo'}
                </button>
                <button
                  onClick={handleCopyLink}
                  style={{
                    padding: '10px',
                    background: copiedLink ? 'rgba(34, 197, 94, 0.1)' : 'var(--background)',
                    color: copiedLink ? '#16a34a' : 'var(--ink)',
                    border: `1px solid ${copiedLink ? '#86efac' : 'var(--border)'}`,
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                  }}
                >
                  {copiedLink ? '✓ Copiado!' : '🔗 Copiar link'}
                </button>
              </div>

              {/* Email invite */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
                <label className="label">Enviar convite por email</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    className="input-field"
                    type="email"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="email@exemplo.com"
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={handleEmailInvite}
                    disabled={!emailTo.trim()}
                    style={{
                      padding: '10px 16px',
                      background: emailTo.trim() ? 'var(--ocean)' : 'var(--border)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: emailTo.trim() ? 'pointer' : 'default',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info card */}
      <div style={{ padding: '16px 18px', background: 'rgba(59, 130, 246, 0.06)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.12)' }}>
        <div style={{ fontSize: '13px', color: 'var(--ocean)', fontFamily: 'sans-serif', lineHeight: 1.5 }}>
          <strong>Dica:</strong> Cadastre todos os viajantes com idade e altura para facilitar a verificacao de restricoes de atrações nos parques. Use o convite para que outros membros da familia possam acessar e editar a viagem.
        </div>
      </div>
    </div>
  );
}
