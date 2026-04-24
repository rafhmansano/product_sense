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
  'concluido': { label: 'Concluído', bg: '#dcfce7', color: '#16a34a', icon: '\u2713' },
  'pendente': { label: 'Pendente', bg: '#fef9c3', color: '#ca8a04', icon: '\u26A0' },
  'nao-iniciado': { label: 'Não Iniciado', bg: '#fee2e2', color: 'var(--red)', icon: '\u2717' },
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
      <div style={{ padding: '52px 56px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '44px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.025em', color: 'var(--ink)', margin: '0 0 6px' }}>Documentos</h1>
          <p style={{ fontSize: '17px', color: 'var(--ink-muted)', margin: 0 }}>
            Controle todos os documentos necessários para a viagem. Clique no status para atualizar o progresso.
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
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--blue)' }}>
              Progresso Geral
            </span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: progressPercent === 100 ? '#16a34a' : 'var(--blue)' }}>
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
                  : 'linear-gradient(90deg, var(--blue), #4A6FA5)',
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
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--blue)', margin: 0 }}>
              Lista de Documentos
            </h2>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '8px 20px',
                background: 'var(--blue)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
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
                <label className="label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-subtle)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-subtle)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Responsável
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
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-subtle)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Observações
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
                  background: 'var(--blue)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
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
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--blue)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--blue)' }}>
                      {doc.name}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--ink-subtle)',
                        padding: '2px 8px',
                        background: '#f1f5f9',
                        borderRadius: '4px',
                      }}
                    >
                      {doc.owner}
                    </span>
                  </div>
                  {doc.notes && (
                    <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px', lineHeight: 1.5 }}>
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
                    color: 'var(--red)',
                    border: '1px solid #fecaca',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#fee2e2';
                    e.currentTarget.style.borderColor = 'var(--red)';
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
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: 0 }}>
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
