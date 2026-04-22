'use client';

import { useState, useEffect } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { familyService } from '@/services/family.service';
import type { FamilyMember } from '@/types';

const ROLE_LABELS: Record<string, string> = {
  pai: 'Pai',
  mae: 'Mãe',
  bebe: 'Bebê',
  crianca: 'Criança',
  adolescente: 'Adolescente',
  avo: 'Avô',
  'avó': 'Avó',
  tio: 'Tio',
  tia: 'Tia',
  outro: 'Outro',
};

const ROLE_ICONS: Record<string, string> = {
  pai: '👨',
  mae: '👩',
  bebe: '👶',
  crianca: '👦',
  adolescente: '🧑',
  avo: '👴',
  'avó': '👵',
  tio: '👨',
  tia: '👩',
  outro: '👤',
};

export default function FamiliaPage() {
  const { user } = useAuth();
  const trip = useAppStore((s) => s.trip);
  const updateTrip = useAppStore((s) => s.updateTrip);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [role, setRole] = useState<FamilyMember['role']>('outro');
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');

  const [nameError, setNameError] = useState('');

  // Family name editing
  const [familyId, setFamilyId] = useState<string | null>(null);
  const [familyNameValue, setFamilyNameValue] = useState('');
  const [editingFamilyName, setEditingFamilyName] = useState(false);
  const [savingFamilyName, setSavingFamilyName] = useState(false);
  const [familyNameError, setFamilyNameError] = useState('');

  const familyName = useAppStore((s) => s.familyName);
  const setFamilyNameStore = useAppStore((s) => s.setFamilyName);
  const setFamilyInviteCodeStore = useAppStore((s) => s.setFamilyInviteCode);

  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;
    async function loadFamily() {
      if (!supabase) return;
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) return;

        // Load family_members row (no nested join to avoid RLS issues)
        const { data: memberRow, error: memberErr } = await supabase
          .from('family_members')
          .select('family_id, role')
          .eq('user_id', authUser.id)
          .maybeSingle();

        if (memberErr || !memberRow) {
          console.error('Failed to load family member:', memberErr?.message);
          return;
        }

        setFamilyId(memberRow.family_id);

        // Load family details separately
        const { data: familyRow } = await supabase
          .from('families')
          .select('name, created_by, invite_code')
          .eq('id', memberRow.family_id)
          .maybeSingle();

        if (familyRow) {
          setFamilyNameValue(familyRow.name || '');
          const frow = familyRow as { name?: string; invite_code?: string };
          if (frow.invite_code) {
            setFamilyInviteCodeStore(frow.invite_code);
          }
        }
      } catch (err) {
        console.error('loadFamily error:', err);
      }
    }
    loadFamily();
  }, []);

  async function handleSaveFamilyName() {
    if (!familyNameValue.trim()) {
      setFamilyNameError('Informe o nome da família');
      return;
    }
    setFamilyNameError('');
    setSavingFamilyName(true);
    try {
      // Resolve familyId if not loaded yet (fallback via familyService)
      let targetFamilyId = familyId;
      if (!targetFamilyId) {
        const member = await familyService.getMyFamily();
        const memberRecord = member as { family_id?: string } | null;
        if (memberRecord?.family_id) {
          targetFamilyId = memberRecord.family_id;
          setFamilyId(targetFamilyId);
        }
      }
      if (!targetFamilyId) {
        throw new Error('Não foi possível identificar sua família. Recarregue a página.');
      }
      await familyService.updateFamilyName(targetFamilyId, familyNameValue.trim());
      setFamilyNameStore(familyNameValue.trim());
      setEditingFamilyName(false);
    } catch (err) {
      setFamilyNameError(err instanceof Error ? err.message : 'Erro ao salvar');
    } finally {
      setSavingFamilyName(false);
    }
  }

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

      // Step 1: resolve family_id (no nested join — avoids RLS recursion)
      let targetFamilyId = familyId;
      if (!targetFamilyId) {
        const { data: memberRow } = await supabase
          .from('family_members')
          .select('family_id')
          .eq('user_id', authUser.id)
          .maybeSingle();
        targetFamilyId = memberRow?.family_id ?? null;
        if (targetFamilyId) setFamilyId(targetFamilyId);
      }
      if (!targetFamilyId) return;

      // Step 2: fetch invite_code from families (separate query)
      const { data: familyRow } = await supabase
        .from('families')
        .select('invite_code')
        .eq('id', targetFamilyId)
        .maybeSingle();

      if (familyRow?.invite_code) {
        setInviteCode(familyRow.invite_code);
        setFamilyInviteCodeStore(familyRow.invite_code);
      }
    } catch (err) {
      console.error('loadInviteCode error:', err);
    } finally {
      setLoadingCode(false);
    }
  }

  function handleAddMember() {
    if (!name.trim()) {
      setNameError('Informe o nome do viajante');
      return;
    }
    setNameError('');
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
    if (editingId === null) return;
    if (!name.trim()) {
      setNameError('Informe o nome do viajante');
      return;
    }
    setNameError('');
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
    const member = trip.members[index];
    if (!confirm(`Tem certeza que deseja remover "${member.name || 'este viajante'}"?`)) return;
    const updated = trip.members.filter((_, i) => i !== index);
    updateTrip({ members: updated });
  }

  function resetForm() {
    setName('');
    setRole('outro');
    setAge('');
    setHeightCm('');
    setShowAddForm(false);
    setEditingId(null);
    setNameError('');
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
    <AppShell>
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ink)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>👨‍👩‍👦</span> Família
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--ink-muted)', margin: 0, fontFamily: 'sans-serif' }}>
          Gerencie os membros da viagem e convide outras pessoas
        </p>
      </div>

      {/* Family name */}
      {isSupabaseConfigured() && (familyName || familyNameValue) && (
        <div className="card" style={{ background: 'white', borderRadius: '16px', border: '1px solid var(--border)', padding: '20px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '4px' }}>
                Nome da família
              </div>
              {editingFamilyName ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    className="input-field"
                    type="text"
                    value={familyNameValue}
                    onChange={(e) => { setFamilyNameValue(e.target.value); setFamilyNameError(''); }}
                    autoFocus
                    style={familyNameError ? { borderColor: '#dc2626' } : {}}
                  />
                  {familyNameError && <span style={{ fontSize: '12px', color: '#dc2626', fontFamily: 'sans-serif' }}>{familyNameError}</span>}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={handleSaveFamilyName}
                      disabled={savingFamilyName}
                      style={{ padding: '8px 16px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: savingFamilyName ? 'wait' : 'pointer', opacity: savingFamilyName ? 0.7 : 1 }}
                    >
                      {savingFamilyName ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      onClick={() => { setEditingFamilyName(false); setFamilyNameValue(familyName || ''); setFamilyNameError(''); }}
                      style={{ padding: '8px 16px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ink)', fontFamily: 'sans-serif' }}>
                  {familyName || familyNameValue || 'Sem nome'}
                </div>
              )}
            </div>
            {!editingFamilyName && (
              <button
                onClick={() => { setFamilyNameValue(familyName || familyNameValue || ''); setEditingFamilyName(true); }}
                style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', flexShrink: 0 }}
                title="Editar nome da família"
                aria-label="Editar nome da família"
              >
                ✏️
              </button>
            )}
          </div>
        </div>
      )}

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
                  aria-label={`Editar ${member.name || 'viajante'}`}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDeleteMember(index)}
                  style={{ padding: '6px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '6px' }}
                  title="Remover"
                  aria-label={`Remover ${member.name || 'viajante'}`}
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
                onChange={(e) => { setName(e.target.value); setNameError(''); }}
                placeholder="Nome do viajante"
                autoFocus
                style={nameError ? { borderColor: '#dc2626' } : {}}
              />
              {nameError && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{nameError}</span>}
            </div>
            <div>
              <label className="label">Papel na família</label>
              <select
                className="input-field"
                value={role}
                onChange={(e) => setRole(e.target.value as FamilyMember['role'])}
              >
                <option value="pai">Pai</option>
                <option value="mae">Mãe</option>
                <option value="bebe">Bebê (0-2)</option>
                <option value="crianca">Criança (3-11)</option>
                <option value="adolescente">Adolescente (12-17)</option>
                <option value="avo">Avô</option>
                <option value="avó">Avó</option>
                <option value="tio">Tio</option>
                <option value="tia">Tia</option>
                <option value="outro">Outro</option>
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
          <strong>Dica:</strong> Cadastre todos os viajantes com idade e altura para facilitar a verificação de restrições de atrações nos parques. Use o convite para que outros membros da familia possam acessar e editar a viagem.
        </div>
      </div>
    </div>
    </AppShell>
  );
}
