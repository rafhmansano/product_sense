'use client';

import { useEffect, useRef, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { FileAttachment, TripDocument } from '@/types';

const STATUS_CYCLE: Record<string, TripDocument['status']> = {
  'nao-iniciado': 'pendente',
  'pendente': 'concluido',
  'concluido': 'nao-iniciado',
};

const STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: string }> = {
  'concluido': { label: 'Concluído', bg: '#dcfce7', color: '#16a34a', icon: '✓' },
  'pendente': { label: 'Pendente', bg: '#fef9c3', color: '#ca8a04', icon: '⚠' },
  'nao-iniciado': { label: 'Não Iniciado', bg: '#fee2e2', color: 'var(--red)', icon: '✗' },
};

function readFileWithProgress(file: File, onProgress: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 90));
    };
    reader.onload = () => { onProgress(100); resolve(reader.result as string); };
    reader.onerror = reject;
    onProgress(5);
    reader.readAsDataURL(file);
  });
}

function openAttachment(att: FileAttachment) {
  try {
    const [header, b64] = att.dataUrl.split(',');
    const mime = header.match(/:(.*?);/)?.[1] || att.type;
    const bytes = atob(b64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: mime });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch {
    const link = document.createElement('a');
    link.href = att.dataUrl;
    link.download = att.name;
    link.click();
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function AttachmentsSection({
  attachments,
  onAdd,
  onRemove,
}: {
  attachments: FileAttachment[];
  onAdd: (a: FileAttachment) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  // Optimistic pending attachments shown immediately before store confirms
  const [pending, setPending] = useState<FileAttachment[]>([]);

  // Once the parent's attachments prop includes a pending item, remove it from pending
  useEffect(() => {
    if (pending.length > 0) {
      setPending((prev) => prev.filter((p) => !attachments.some((a) => a.id === p.id)));
    }
  }, [attachments, pending.length]);

  const allAttachments = [...attachments, ...pending];

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        setError(`"${file.name}" excede 10 MB. Escolha um arquivo menor.`);
        continue;
      }
      try {
        const dataUrl = await readFileWithProgress(file, setProgress);
        const att: FileAttachment = {
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
          addedAt: new Date().toISOString(),
        };
        // Show immediately in UI, then save to store
        setPending((prev) => [...prev, att]);
        onAdd(att);
      } catch {
        setError(`Erro ao carregar "${file.name}". Tente novamente.`);
      }
    }
    setUploading(false);
    setProgress(0);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--ink-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          📎 Anexos {allAttachments.length > 0 && `(${allAttachments.length})`}
        </span>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            fontSize: '12px', padding: '3px 10px',
            border: '1px dashed var(--border-strong)',
            borderRadius: '20px',
            background: 'transparent',
            color: 'var(--blue)',
            cursor: uploading ? 'wait' : 'pointer',
            opacity: uploading ? 0.6 : 1,
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { if (!uploading) e.currentTarget.style.background = 'rgba(0,113,227,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {uploading ? 'Carregando…' : '+ Adicionar'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf,.doc,.docx"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {/* Progress bar */}
      {uploading && (
        <div style={{ height: '4px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{
            height: '100%',
            width: `${Math.max(progress, 8)}%`,
            background: 'linear-gradient(90deg, var(--blue), #4A90E2)',
            borderRadius: '9999px',
            transition: 'width 0.25s ease',
          }} />
        </div>
      )}

      {error && (
        <p style={{ fontSize: '12px', color: 'var(--red)', margin: '0 0 8px' }}>{error}</p>
      )}

      {allAttachments.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--ink-subtle)', margin: 0, fontStyle: 'italic' }}>
          Imagens, PDFs ou documentos escaneados
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {allAttachments.map((att) => {
            const isPending = pending.some((p) => p.id === att.id);
            return (
              <div
                key={att.id}
                style={{
                  position: 'relative',
                  border: `1px solid ${isPending ? 'var(--blue)' : 'var(--border)'}`,
                  borderRadius: '10px',
                  overflow: 'hidden',
                  background: isPending ? 'rgba(0,113,227,0.04)' : 'var(--background)',
                  width: '88px',
                  cursor: isPending ? 'default' : 'pointer',
                  opacity: isPending ? 0.75 : 1,
                  transition: 'opacity 0.3s',
                }}
                onClick={() => !isPending && openAttachment(att)}
                title={isPending ? 'Salvando…' : `${att.name} — clique para abrir`}
              >
                {att.type.startsWith('image/') ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    style={{ width: '100%', height: '56px', objectFit: 'cover', display: 'block' }}
                  />
                ) : (
                  <div style={{
                    height: '56px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isPending ? 'rgba(0,113,227,0.08)' : '#f1f5f9',
                    fontSize: '26px',
                  }}>
                    {att.type === 'application/pdf' ? '📄' : '📝'}
                  </div>
                )}
                <div style={{ padding: '4px 6px' }}>
                  <div style={{ fontSize: '10px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {isPending ? 'Salvando…' : att.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--ink-subtle)' }}>{formatSize(att.size)}</div>
                </div>
                {!isPending && (
                  <button
                    onClick={(e) => { e.stopPropagation(); onRemove(att.id); }}
                    style={{
                      position: 'absolute', top: '3px', right: '3px',
                      width: '18px', height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      color: 'white', fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      lineHeight: 1,
                    }}
                    title="Remover anexo"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, onClick }: { status: TripDocument['status']; onClick: () => void }) {
  const config = STATUS_CONFIG[status];
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '5px',
        padding: '4px 12px', borderRadius: '20px',
        background: config.bg, color: config.color,
        fontSize: '12px', fontWeight: '600',
        border: 'none', cursor: 'pointer',
        transition: 'opacity 0.15s', flexShrink: 0,
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
  const { documents, updateDocument, addDocument, deleteDocument, addDocumentAttachment, removeDocumentAttachment } = useAppStore();

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
    addDocument({
      id: `doc-${Date.now()}`,
      name: newName.trim(),
      owner: newOwner.trim() || 'Todos',
      status: 'nao-iniciado',
      notes: newNotes.trim(),
      attachments: [],
    });
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
            Controle todos os documentos da viagem. Clique no status para atualizar e anexe cópias digitais diretamente.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--blue)' }}>Progresso Geral</span>
            <span style={{ fontSize: '14px', fontWeight: '600', color: progressPercent === 100 ? '#16a34a' : 'var(--blue)' }}>
              {concluidos}/{total} ({progressPercent}%)
            </span>
          </div>
          <div style={{ height: '10px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progressPercent}%`,
              background: progressPercent === 100
                ? 'linear-gradient(90deg, #16a34a, #22c55e)'
                : 'linear-gradient(90deg, var(--blue), #4A6FA5)',
              borderRadius: '9999px', transition: 'width 0.6s ease',
            }} />
          </div>
        </div>

        {/* Documents List */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>Lista de Documentos</h2>
            <button
              className="btn-primary"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? 'Cancelar' : '+ Adicionar'}
            </button>
          </div>

          {/* Add Document Form */}
          {showForm && (
            <div style={{
              padding: '20px', background: 'var(--background)',
              borderRadius: '12px', marginBottom: '20px',
              display: 'flex', flexDirection: 'column', gap: '12px',
            }}>
              <div>
                <label className="label">Nome do Documento</label>
                <input className="input-field" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ex: Passaporte — Pai" autoFocus />
              </div>
              <div>
                <label className="label">Responsável</label>
                <input className="input-field" type="text" value={newOwner} onChange={(e) => setNewOwner(e.target.value)} placeholder="Ex: Rafael, Jac, Todos" />
              </div>
              <div>
                <label className="label">Observações</label>
                <input className="input-field" type="text" value={newNotes} onChange={(e) => setNewNotes(e.target.value)} placeholder="Ex: Validade mínima 6 meses" />
              </div>
              <button className="btn-primary" onClick={handleAddDocument} style={{ alignSelf: 'flex-start' }}>
                Salvar Documento
              </button>
            </div>
          )}

          {/* Document Items */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }} className="stagger-children">
            {documents.map((doc) => (
              <div
                key={doc.id}
                style={{
                  padding: '16px 18px',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  transition: 'border-color 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,113,227,0.3)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
              >
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--ink)' }}>
                        {doc.name}
                      </span>
                      <span style={{
                        fontSize: '11px', color: 'var(--ink-subtle)',
                        padding: '2px 8px', background: '#f1f5f9', borderRadius: '4px',
                      }}>
                        {doc.owner}
                      </span>
                    </div>
                    {doc.notes && (
                      <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                        {doc.notes}
                      </div>
                    )}
                  </div>
                  <StatusBadge status={doc.status} onClick={() => handleCycleStatus(doc.id, doc.status)} />
                  <button
                    onClick={() => handleDelete(doc.id, doc.name)}
                    style={{
                      padding: '5px 10px',
                      background: 'transparent', color: 'var(--red)',
                      border: '1px solid #fecaca', borderRadius: '6px',
                      fontSize: '12px', cursor: 'pointer', flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.borderColor = 'var(--red)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = '#fecaca'; }}
                  >
                    Excluir
                  </button>
                </div>

                {/* Attachments */}
                <AttachmentsSection
                  attachments={doc.attachments ?? []}
                  onAdd={(att) => addDocumentAttachment(doc.id, att)}
                  onRemove={(attId) => removeDocumentAttachment(doc.id, attId)}
                />
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
