'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { TripDocument } from '@/types';

const STATUS_CYCLE: Record<string, TripDocument['status']> = {
  'nao-iniciado': 'pendente',
  'pendente': 'concluido',
  'concluido': 'nao-iniciado',
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  'concluido': { label: 'Concluido', bg: '#dcfce7', color: '#16a34a', icon: '\u2713' },
  'pendente': { label: 'Pendente', bg: '#fef9c3', color: '#ca8a04', icon: '\u26A0' },
  'nao-iniciado': { label: 'Nao Iniciado', bg: '#fee2e2', color: '#dc2626', icon: '\u2717' },
};

function StatusBadge({ status, onClick }: { status: TripDocument['status']; onClick: () => void }) {
  const config = STATUS_CONFIG[status];
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '4px 12px',
        borderRadius: '20px',
        background: config.bg,
        color: config.color,
        fontSize: '12px',
        fontWeight: '600',
        fontFamily: 'sans-serif',
        border: 'none',
        cursor: 'pointer',
        transition: 'opacity 0.15s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
      title="Clique para alterar status"
    >
      <span>{config.icon}</span>
      {config.label}
    </button>
  );
}

export default function DocumentosPage() {
  const { documents, updateDocument, addDocument, deleteDocument } = useAppStore();

  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newOwner, setNewOwner] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const concluidos = documents.filter((d) => d.status === 'concluido').length;
  const total = documents.length;
  const progressPercent = total > 0 ? Math.round((concluidos / total) * 100) : 0;

  const handleCycleStatus = (id: string, currentStatus: TripDocument['status']) => {
    updateDocument(id, { status: STATUS_CYCLE[currentStatus] });
  };

  const handleAddDocument = () => {
    if (!newName.trim()) return;
    const doc: TripDocument = {
      id: `doc-${Date.now()}`,
      name: newName.trim(),
      owner: newOwner.trim() || 'Todos',
      status: 'nao-iniciado',
      notes: newNotes.trim(),
    };
    addDocument(doc);
    setNewName('');
    setNewOwner('');
    setNewNotes('');
    setShowForm(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir "${name}"?`)) {
      deleteDocument(id);
    }
  };

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--navy)',
              margin: 0,
              lineHeight: 1.15,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '32px' }}>📋</span> Documentos e Checklist
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--ink-muted)',
              marginTop: '12px',
              fontFamily: 'sans-serif',
              maxWidth: '600px',
              lineHeight: 1.6,
            }}
          >
            Controle todos os documentos necessarios para a viagem. Clique no status para atualizar o progresso.
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className="card"
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--navy)', fontFamily: 'sans-serif' }}>
              Progresso Geral
            </span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: progressPercent === 100 ? '#16a34a' : 'var(--navy)', fontFamily: 'sans-serif' }}>
              {concluidos}/{total} ({progressPercent}%)
            </span>
          </div>
          <div style={{ height: '10px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: progressPercent === 100
                  ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                  : 'linear-gradient(90deg, var(--navy), #4A6FA5)',
                borderRadius: '9999px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
        </div>

        {/* Documents List */}
        <div
          className="card"
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--navy)', margin: 0, fontFamily: 'sans-serif' }}>
              Lista de Documentos
            </h2>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '8px 20px',
                background: 'var(--navy)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                fontFamily: 'sans-serif',
                cursor: 'pointer',
                transition: 'opacity 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              {showForm ? 'Cancelar' : '+ Adicionar Documento'}
            </button>
          </div>

          {/* Add Document Form */}
          {showForm && (
            <div
              style={{
                padding: '20px',
                background: '#f8f9fa',
                borderRadius: '10px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div>
                <label className="label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Nome do Documento
                </label>
                <input
                  className="input-field"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ex: Passaporte - Pai"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Responsavel
                </label>
                <input
                  className="input-field"
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="Ex: Rafael, Jac, Todos"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Observacoes
                </label>
                <input
                  className="input-field"
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Ex: Validade minima 6 meses"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <button
                className="btn-primary"
                onClick={handleAddDocument}
                style={{
                  alignSelf: 'flex-start',
                  padding: '10px 24px',
                  background: 'var(--navy)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  fontFamily: 'sans-serif',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Salvar Documento
              </button>
            </div>
          )}

          {/* Document Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="stagger-children">
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 18px',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--navy)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--navy)', fontFamily: 'sans-serif' }}>
                      {doc.name}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--ink-subtle)',
                        fontFamily: 'sans-serif',
                        padding: '2px 8px',
                        background: '#f1f5f9',
                        borderRadius: '4px',
                      }}
                    >
                      {doc.owner}
                    </span>
                  </div>
                  {doc.notes && (
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', marginTop: '4px', lineHeight: 1.5 }}>
                      {doc.notes}
                    </div>
                  )}
                </div>
                <StatusBadge
                  status={doc.status}
                  onClick={() => handleCycleStatus(doc.id, doc.status)}
                />
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(doc.id, doc.name)}
                  style={{
                    padding: '6px 12px',
                    background: 'transparent',
                    color: '#dc2626',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontFamily: 'sans-serif',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.borderColor = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.borderColor = '#fecaca';
                  }}
                  title="Excluir documento"
                >
                  Excluir
                </button>
              </div>
            ))}
            {documents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>📋</div>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', fontFamily: 'sans-serif', margin: 0 }}>
                  Nenhum documento adicionado ainda.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
