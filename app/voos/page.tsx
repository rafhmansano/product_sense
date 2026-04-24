'use client';

import { useRef, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { FileAttachment, Flight } from '@/types';

const EMPTY_FLIGHT: Omit<Flight, 'id' | 'attachments'> = {
  type: 'ida',
  airline: '',
  flightNumber: '',
  origin: '',
  originCode: '',
  destination: '',
  destinationCode: '',
  departureDate: '',
  departureTime: '',
  arrivalDate: '',
  arrivalTime: '',
  duration: '',
  pnr: '',
  seats: '',
  baggage: '',
  checkInAvailable: '',
  boardingPass: '',
  notes: '',
  status: 'pendente',
};

const STATUS_COLORS: Record<Flight['status'], { bg: string; text: string; border: string }> = {
  confirmado: { bg: 'rgba(34,197,94,0.1)', text: 'var(--green)', border: 'var(--green)' },
  pendente: { bg: 'rgba(245,158,11,0.1)', text: 'var(--sunset)', border: 'var(--sunset)' },
  cancelado: { bg: 'rgba(239,68,68,0.1)', text: 'var(--coral)', border: 'var(--coral)' },
};

const STATUS_LABELS: Record<Flight['status'], string> = {
  confirmado: 'Confirmado',
  pendente: 'Pendente',
  cancelado: 'Cancelado',
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
    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          📎 Documentos e Fotos
        </span>
        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            fontSize: '12px',
            padding: '4px 10px',
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
        <p style={{ fontSize: '12px', color: 'var(--red)', margin: '0 0 8px' }}>{error}</p>
      )}

      {attachments.length === 0 ? (
        <p style={{ fontSize: '12px', color: 'var(--ink-subtle)', margin: 0 }}>
          Adicione cartões de embarque, e-tickets ou documentos deste voo.
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
                width: '90px',
              }}
            >
              {att.type.startsWith('image/') ? (
                <a href={att.dataUrl} target="_blank" rel="noopener noreferrer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={att.dataUrl} alt={att.name} style={{ width: '100%', height: '60px', objectFit: 'cover', display: 'block' }} />
                </a>
              ) : (
                <a href={att.dataUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60px', textDecoration: 'none' }}>
                  <span style={{ fontSize: '28px' }}>📄</span>
                </a>
              )}
              <div style={{ padding: '5px 7px' }}>
                <div style={{ fontSize: '10px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{att.name}</div>
                <div style={{ fontSize: '10px', color: 'var(--ink-subtle)' }}>{formatSize(att.size)}</div>
              </div>
              <button
                onClick={() => onRemove(att.id)}
                style={{
                  position: 'absolute', top: '3px', right: '3px', width: '18px', height: '18px',
                  borderRadius: '50%', background: 'rgba(0,0,0,0.55)', border: 'none',
                  color: 'white', fontSize: '11px', cursor: 'pointer',
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

export default function VoosPage() {
  const { flights, addFlight, updateFlight, deleteFlight, addFlightAttachment, removeFlightAttachment } = useAppStore();
  const [form, setForm] = useState<Omit<Flight, 'id' | 'attachments'>>(EMPTY_FLIGHT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Omit<Flight, 'id' | 'attachments'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = () => {
    const errors: Record<string, string> = {};
    if (!form.airline.trim()) errors.airline = 'Informe a companhia aérea';
    if (!form.flightNumber.trim()) errors.flightNumber = 'Informe o número do voo';
    if (!form.departureDate) errors.departureDate = 'Informe a data de partida';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingId) {
      updateFlight(editingId, form);
      setEditingId(null);
    } else {
      const newFlight: Flight = { ...form, id: `id_${Date.now()}`, attachments: [] };
      addFlight(newFlight);
    }
    setForm(EMPTY_FLIGHT);
    setShowForm(false);
  };

  const handleEdit = (flight: Flight) => {
    const { id, attachments: _att, ...rest } = flight;
    setForm(rest);
    setEditingId(id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(EMPTY_FLIGHT);
    setEditingId(null);
    setShowForm(false);
    setFormErrors({});
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este voo?')) {
      deleteFlight(id);
      if (editingId === id) handleCancel();
    }
  };

  const idaFlights = flights.filter((f) => f.type === 'ida');
  const voltaFlights = flights.filter((f) => f.type === 'volta');

  return (
    <AppShell>
      <div style={{ padding: '52px 56px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '44px', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.025em', color: 'var(--ink)', margin: '0 0 6px' }}>Voos</h1>
            <p style={{ fontSize: '17px', color: 'var(--ink-muted)', margin: 0 }}>Gerencie os voos da viagem</p>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={() => setShowForm(true)}>
              + Adicionar Voo
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="card animate-fade-in" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.015em', color: 'var(--ink)', margin: '0 0 24px' }}>
              {editingId ? 'Editar Voo' : 'Novo Voo'}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Tipo</label>
                <select className="input-field" value={form.type} onChange={(e) => handleChange('type', e.target.value)}>
                  <option value="ida">Ida</option>
                  <option value="volta">Volta</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input-field" value={form.status} onChange={(e) => handleChange('status', e.target.value as Flight['status'])}>
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Companhia Aérea</label>
                <input className="input-field" placeholder="Ex: LATAM, GOL, American Airlines" value={form.airline} onChange={(e) => handleChange('airline', e.target.value)} style={formErrors.airline ? { borderColor: 'var(--red)' } : {}} />
                {formErrors.airline && <span style={{ fontSize: '12px', color: 'var(--red)', marginTop: '4px', display: 'block' }}>{formErrors.airline}</span>}
              </div>
              <div>
                <label className="label">Número do Voo</label>
                <input className="input-field" placeholder="Ex: LA8180" value={form.flightNumber} onChange={(e) => handleChange('flightNumber', e.target.value)} style={formErrors.flightNumber ? { borderColor: 'var(--red)' } : {}} />
                {formErrors.flightNumber && <span style={{ fontSize: '12px', color: 'var(--red)', marginTop: '4px', display: 'block' }}>{formErrors.flightNumber}</span>}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Origem</label>
                <input className="input-field" placeholder="Ex: Sao Paulo, SP" value={form.origin} onChange={(e) => handleChange('origin', e.target.value)} />
              </div>
              <div>
                <label className="label">Código (IATA)</label>
                <input className="input-field" placeholder="Ex: GRU" value={form.originCode} onChange={(e) => handleChange('originCode', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Destino</label>
                <input className="input-field" placeholder="Ex: Orlando, FL" value={form.destination} onChange={(e) => handleChange('destination', e.target.value)} />
              </div>
              <div>
                <label className="label">Código (IATA)</label>
                <input className="input-field" placeholder="Ex: MCO" value={form.destinationCode} onChange={(e) => handleChange('destinationCode', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Data de Partida</label>
                <input type="date" className="input-field" value={form.departureDate} onChange={(e) => handleChange('departureDate', e.target.value)} style={formErrors.departureDate ? { borderColor: 'var(--red)' } : {}} />
                {formErrors.departureDate && <span style={{ fontSize: '12px', color: 'var(--red)', marginTop: '4px', display: 'block' }}>{formErrors.departureDate}</span>}
              </div>
              <div>
                <label className="label">Horario de Partida</label>
                <input type="time" className="input-field" value={form.departureTime} onChange={(e) => handleChange('departureTime', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Data de Chegada</label>
                <input type="date" className="input-field" value={form.arrivalDate} onChange={(e) => handleChange('arrivalDate', e.target.value)} />
              </div>
              <div>
                <label className="label">Horario de Chegada</label>
                <input type="time" className="input-field" value={form.arrivalTime} onChange={(e) => handleChange('arrivalTime', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Duração</label>
                <input className="input-field" placeholder="Ex: 10h30" value={form.duration} onChange={(e) => handleChange('duration', e.target.value)} />
              </div>
              <div>
                <label className="label">Código de Reserva (PNR)</label>
                <input className="input-field" placeholder="Ex: ABC123" value={form.pnr} onChange={(e) => handleChange('pnr', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Assentos</label>
                <input className="input-field" placeholder="Ex: 12A, 12B, 12C" value={form.seats} onChange={(e) => handleChange('seats', e.target.value)} />
              </div>
              <div>
                <label className="label">Bagagem</label>
                <input className="input-field" placeholder="Ex: 2x 23kg despachada + 1 mao" value={form.baggage} onChange={(e) => handleChange('baggage', e.target.value)} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Check-in Disponível</label>
                <input className="input-field" placeholder="Ex: 24h antes" value={form.checkInAvailable} onChange={(e) => handleChange('checkInAvailable', e.target.value)} />
              </div>
              <div>
                <label className="label">Cartão de Embarque</label>
                <input className="input-field" placeholder="Ex: Pendente / Emitido" value={form.boardingPass} onChange={(e) => handleChange('boardingPass', e.target.value)} />
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="label">Observações</label>
              <textarea className="input-field" rows={3} placeholder="Notas adicionais sobre o voo..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} style={{ resize: 'vertical' }} />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-primary" onClick={handleSubmit}>
                {editingId ? 'Salvar Alterações' : 'Adicionar Voo'}
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Flight Lists */}
        {flights.length === 0 && !showForm && (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--ink-muted)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✈️</span>
            <p style={{ fontSize: '16px', margin: '0 0 8px' }}>Nenhum voo cadastrado ainda.</p>
            <p style={{ fontSize: '14px', color: 'var(--ink-subtle)', margin: 0 }}>
              Clique em &quot;Adicionar Voo&quot; para começar.
            </p>
          </div>
        )}

        {idaFlights.length > 0 && (
          <FlightSection
            title="Voos de Ida"
            icon="🛫"
            flights={idaFlights}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddAttachment={addFlightAttachment}
            onRemoveAttachment={removeFlightAttachment}
          />
        )}

        {voltaFlights.length > 0 && (
          <FlightSection
            title="Voos de Volta"
            icon="🛬"
            flights={voltaFlights}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddAttachment={addFlightAttachment}
            onRemoveAttachment={removeFlightAttachment}
          />
        )}
      </div>
    </AppShell>
  );
}

function FlightSection({
  title,
  icon,
  flights,
  onEdit,
  onDelete,
  onAddAttachment,
  onRemoveAttachment,
}: {
  title: string;
  icon: string;
  flights: Flight[];
  onEdit: (flight: Flight) => void;
  onDelete: (id: string) => void;
  onAddAttachment: (flightId: string, a: FileAttachment) => void;
  onRemoveAttachment: (flightId: string, aId: string) => void;
}) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', letterSpacing: '-0.015em', color: 'var(--ink)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{icon}</span> {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {flights.map((flight) => (
          <FlightCard
            key={flight.id}
            flight={flight}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddAttachment={onAddAttachment}
            onRemoveAttachment={onRemoveAttachment}
          />
        ))}
      </div>
    </div>
  );
}

function FlightCard({
  flight,
  onEdit,
  onDelete,
  onAddAttachment,
  onRemoveAttachment,
}: {
  flight: Flight;
  onEdit: (flight: Flight) => void;
  onDelete: (id: string) => void;
  onAddAttachment: (flightId: string, a: FileAttachment) => void;
  onRemoveAttachment: (flightId: string, aId: string) => void;
}) {
  const statusColor = STATUS_COLORS[flight.status];

  const formatDate = (date: string) => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  };

  return (
    <div className="card animate-fade-in" style={{ position: 'relative' }}>
      {/* Status Badge */}
      <div style={{
        position: 'absolute', top: '16px', right: '16px', padding: '4px 12px',
        borderRadius: '20px', fontSize: '12px', fontWeight: '600',
        background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}`,
      }}>
        {STATUS_LABELS[flight.status]}
      </div>

      {/* Airline & Flight Number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ocean)' }}>{flight.airline}</span>
        <span style={{ fontSize: '14px', color: 'var(--ink-muted)', fontWeight: '500' }}>{flight.flightNumber}</span>
      </div>

      {/* Route */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px', padding: '12px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ocean)', letterSpacing: '-0.02em' }}>{flight.originCode || '---'}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{flight.origin}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginTop: '4px' }}>{flight.departureTime || '--:--'}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>{formatDate(flight.departureDate)}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1 }}>
          <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>{flight.duration || '--'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '100%' }}>
            <div style={{ flex: 1, height: '2px', background: 'var(--border-strong)' }} />
            <span style={{ fontSize: '16px' }}>✈️</span>
            <div style={{ flex: 1, height: '2px', background: 'var(--border-strong)' }} />
          </div>
        </div>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ocean)', letterSpacing: '-0.02em' }}>{flight.destinationCode || '---'}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{flight.destination}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginTop: '4px' }}>{flight.arrivalTime || '--:--'}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>{formatDate(flight.arrivalDate)}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '12px' }}>
        {flight.pnr && <DetailItem label="PNR" value={flight.pnr} />}
        {flight.seats && <DetailItem label="Assentos" value={flight.seats} />}
        {flight.baggage && <DetailItem label="Bagagem" value={flight.baggage} />}
        {flight.checkInAvailable && <DetailItem label="Check-in" value={flight.checkInAvailable} />}
        {flight.boardingPass && <DetailItem label="Embarque" value={flight.boardingPass} />}
      </div>

      {/* Notes */}
      {flight.notes && (
        <div style={{ padding: '10px 14px', background: 'var(--surface-raised)', borderRadius: '8px', fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
          {flight.notes}
        </div>
      )}

      {/* Attachments */}
      <AttachmentsSection
        attachments={flight.attachments ?? []}
        onAdd={(a) => onAddAttachment(flight.id, a)}
        onRemove={(aId) => onRemoveAttachment(flight.id, aId)}
      />

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '14px' }}>
        <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => onEdit(flight)}>
          Editar
        </button>
        <button className="btn-danger" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => onDelete(flight.id)}>
          Excluir
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '2px' }}>{label}</div>
      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>{value}</div>
    </div>
  );
}
