'use client';

import { useRef, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { CarRental, FileAttachment } from '@/types';

const EMPTY_CAR: Omit<CarRental, 'id' | 'attachments'> = {
  company: '',
  vehicleCategory: '',
  pickupLocation: '',
  returnLocation: '',
  pickupDate: '',
  pickupTime: '',
  returnDate: '',
  returnTime: '',
  reservationCode: '',
  insurance: '',
  childSeat: '',
  gps: '',
  fuelPolicy: '',
  totalPrice: '',
  paymentMethod: '',
  notes: '',
};

const ALERTS = [
  { icon: '📋', text: 'CNH com Traducao Juramentada obrigatoria', color: '#EF4444' },
  { icon: '🚙', text: 'SUV ou Minivan recomendado para familia', color: '#F59E0B' },
  { icon: '👶', text: 'Cadeirinha infantil obrigatoria (crianca abaixo 4 anos FL)', color: '#EF4444' },
  { icon: '🛣️', text: 'Tollroads: configurar SunPass', color: '#3B82F6' },
  { icon: '🅿️', text: 'Estacionamento parques ~$30/dia', color: '#8B5CF6' },
];

const FIELD_LABELS: Record<keyof Omit<CarRental, 'id' | 'attachments'>, string> = {
  company: 'Locadora',
  vehicleCategory: 'Categoria do Veiculo',
  pickupLocation: 'Local de Retirada',
  returnLocation: 'Local de Devolucao',
  pickupDate: 'Data de Retirada',
  pickupTime: 'Hora de Retirada',
  returnDate: 'Data de Devolucao',
  returnTime: 'Hora de Devolucao',
  reservationCode: 'Codigo da Reserva',
  insurance: 'Seguro',
  childSeat: 'Cadeirinha Infantil',
  gps: 'GPS',
  fuelPolicy: 'Politica de Combustivel',
  totalPrice: 'Preco Total',
  paymentMethod: 'Forma de Pagamento',
  notes: 'Observacoes',
};

const FIELD_TYPES: Partial<Record<keyof Omit<CarRental, 'id' | 'attachments'>, string>> = {
  pickupDate: 'date',
  pickupTime: 'time',
  returnDate: 'date',
  returnTime: 'time',
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
  const [error, setError] = useState('');

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError('');
    setUploading(true);
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        setError(`"${file.name}" excede 5 MB. Escolha um arquivo menor.`);
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        onAdd({
          id: `att_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          name: file.name,
          type: file.type,
          size: file.size,
          dataUrl,
          addedAt: new Date().toISOString(),
        });
      } catch {
        setError(`Erro ao carregar "${file.name}".`);
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div style={{ marginTop: '20px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          📎 Documentos e Fotos
        </span>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            fontSize: '12px',
            padding: '5px 12px',
            border: '1px dashed var(--border-strong)',
            borderRadius: '6px',
            background: 'transparent',
            color: 'var(--ocean)',
            cursor: 'pointer',
          }}
        >
          {uploading ? 'Carregando...' : '+ Adicionar'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {error && (
        <p style={{ fontSize: '12px', color: '#dc2626', margin: '0 0 8px' }}>{error}</p>
      )}

      {attachments.length === 0 ? (
        <p style={{ fontSize: '13px', color: 'var(--ink-subtle)', margin: 0 }}>
          Nenhum documento anexado. Adicione o contrato de aluguel, vouchers ou fotos.
        </p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {attachments.map((att) => (
            <div
              key={att.id}
              style={{
                position: 'relative',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                overflow: 'hidden',
                background: 'var(--surface-raised)',
                width: '100px',
              }}
            >
              {att.type.startsWith('image/') ? (
                <a href={att.dataUrl} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={att.dataUrl} alt={att.name} style={{ width: '100%', height: '70px', objectFit: 'cover', display: 'block' }} />
                </a>
              ) : (
                <a href={att.dataUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70px', textDecoration: 'none' }}>
                  <span style={{ fontSize: '32px' }}>📄</span>
                </a>
              )}
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--ink-subtle)' }}>{formatSize(att.size)}</div>
              </div>
              <button
                onClick={() => onRemove(att.id)}
                style={{
                  position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px',
                  borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none',
                  color: 'white', fontSize: '12px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CarForm({
  initial,
  title,
  onSave,
  onCancel,
}: {
  initial: Omit<CarRental, 'id' | 'attachments'>;
  title: string;
  onSave: (data: Omit<CarRental, 'id' | 'attachments'>) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const fieldKeys = Object.keys(EMPTY_CAR) as (keyof Omit<CarRental, 'id' | 'attachments'>)[];

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 20px 0' }}>
        {title}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {fieldKeys.map((key) => (
          <div key={key} style={key === 'notes' ? { gridColumn: '1 / -1' } : undefined}>
            <label className="label">{FIELD_LABELS[key]}</label>
            {key === 'notes' ? (
              <textarea
                className="input-field"
                rows={3}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
                style={{ resize: 'vertical' }}
              />
            ) : (
              <input
                className="input-field"
                type={FIELD_TYPES[key] || 'text'}
                value={form[key]}
                onChange={(e) => handleChange(key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button className="btn-primary" onClick={() => { if (form.company) onSave(form); }}>
          Salvar
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function CarCard({
  car,
  onEdit,
  onDelete,
  onAddAttachment,
  onRemoveAttachment,
}: {
  car: CarRental;
  onEdit: (car: CarRental) => void;
  onDelete: (id: string) => void;
  onAddAttachment: (carId: string, a: FileAttachment) => void;
  onRemoveAttachment: (carId: string, aId: string) => void;
}) {
  const fieldKeys = Object.keys(EMPTY_CAR) as (keyof Omit<CarRental, 'id' | 'attachments'>)[];

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--ocean)', margin: 0 }}>
          🚗 {car.company || 'Aluguel de Carro'}
          {car.vehicleCategory && (
            <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--ink-muted)', marginLeft: '8px' }}>
              · {car.vehicleCategory}
            </span>
          )}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => onEdit(car)}>
            Editar
          </button>
          <button className="btn-danger" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => { if (confirm('Excluir este aluguel?')) onDelete(car.id); }}>
            Excluir
          </button>
        </div>
      </div>

      {car.reservationCode && (
        <div style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--sky)', color: 'white', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.04em' }}>
          Reserva: {car.reservationCode}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        {fieldKeys
          .filter((key) => key !== 'notes' && key !== 'company' && key !== 'vehicleCategory' && car[key])
          .map((key) => (
            <div key={key}>
              <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--ink-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
                {FIELD_LABELS[key]}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>
                {car[key]}
              </div>
            </div>
          ))}
      </div>

      {car.notes && (
        <div style={{ marginTop: '16px', padding: '14px 16px', background: 'var(--surface-raised)', borderRadius: '8px', borderLeft: '3px solid var(--sky)' }}>
          <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--ink-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>
            Observacoes
          </div>
          <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>{car.notes}</div>
        </div>
      )}

      <AttachmentsSection
        attachments={car.attachments ?? []}
        onAdd={(a) => onAddAttachment(car.id, a)}
        onRemove={(aId) => onRemoveAttachment(car.id, aId)}
      />
    </div>
  );
}

export default function CarroPage() {
  const { carRentals, addCarRental, updateCarRental, deleteCarRental, addCarAttachment, removeCarAttachment } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInitial, setFormInitial] = useState<Omit<CarRental, 'id' | 'attachments'>>(EMPTY_CAR);

  const handleAddNew = () => {
    setFormInitial(EMPTY_CAR);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (car: CarRental) => {
    const { id: _id, attachments: _att, ...rest } = car;
    setFormInitial(rest);
    setEditingId(car.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = (data: Omit<CarRental, 'id' | 'attachments'>) => {
    if (editingId) {
      updateCarRental(editingId, data);
    } else {
      addCarRental({ ...data, id: `id_${Date.now()}`, attachments: [] });
    }
    setShowForm(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '900px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--ocean)', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '36px' }}>🚗</span>
              Aluguel de Carro
            </h1>
            {carRentals.length > 0 && (
              <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '4px 0 0 48px' }}>
                {carRentals.length} {carRentals.length === 1 ? 'aluguel cadastrado' : 'alugueis cadastrados'}
              </p>
            )}
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={handleAddNew}>
              + Adicionar Aluguel
            </button>
          )}
        </div>

        {/* Alerts */}
        <div className="card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--ocean)', margin: '0 0 14px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Alertas Importantes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ALERTS.map((alert, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '8px', background: `${alert.color}0A`, borderLeft: `3px solid ${alert.color}` }}>
                <span style={{ fontSize: '16px' }}>{alert.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>{alert.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <CarForm
            initial={formInitial}
            title={editingId ? 'Editar Aluguel' : 'Novo Aluguel de Carro'}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Car Cards */}
        {carRentals.length === 0 && !showForm ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🚗</div>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px', margin: '0 0 8px' }}>
              Nenhum aluguel de carro cadastrado ainda.
            </p>
            <p style={{ color: 'var(--ink-subtle)', fontSize: '13px', margin: '0 0 20px' }}>
              Adicione quantos alugueis precisar — ideal para viagens com escalas ou múltiplos destinos.
            </p>
            <button className="btn-primary" onClick={handleAddNew}>
              Adicionar Aluguel de Carro
            </button>
          </div>
        ) : (
          carRentals.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onEdit={handleEdit}
              onDelete={deleteCarRental}
              onAddAttachment={addCarAttachment}
              onRemoveAttachment={removeCarAttachment}
            />
          ))
        )}
      </div>
    </AppShell>
  );
}
