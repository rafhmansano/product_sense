'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { Flight } from '@/types';

const EMPTY_FLIGHT: Omit<Flight, 'id'> = {
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

export default function VoosPage() {
  const { flights, addFlight, updateFlight, deleteFlight } = useAppStore();
  const [form, setForm] = useState<Omit<Flight, 'id'>>(EMPTY_FLIGHT);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof Omit<Flight, 'id'>, value: string) => {
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
      const newFlight: Flight = { ...form, id: `id_${Date.now()}` };
      addFlight(newFlight);
    }
    setForm(EMPTY_FLIGHT);
    setShowForm(false);
  };

  const handleEdit = (flight: Flight) => {
    const { id, ...rest } = flight;
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
      <div style={{ padding: '32px 40px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>✈️</span>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--ocean)', margin: 0 }}>Voos</h1>
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
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 20px' }}>
              {editingId ? 'Editar Voo' : 'Novo Voo'}
            </h2>

            {/* Type & Status */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Tipo</label>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  <option value="ida">Ida</option>
                  <option value="volta">Volta</option>
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  className="input-field"
                  value={form.status}
                  onChange={(e) => handleChange('status', e.target.value as Flight['status'])}
                >
                  <option value="pendente">Pendente</option>
                  <option value="confirmado">Confirmado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Airline & Flight Number */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Companhia Aérea</label>
                <input
                  className="input-field"
                  placeholder="Ex: LATAM, GOL, American Airlines"
                  value={form.airline}
                  onChange={(e) => handleChange('airline', e.target.value)}
                  style={formErrors.airline ? { borderColor: '#dc2626' } : {}}
                />
                {formErrors.airline && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{formErrors.airline}</span>}
              </div>
              <div>
                <label className="label">Número do Voo</label>
                <input
                  className="input-field"
                  placeholder="Ex: LA8180"
                  value={form.flightNumber}
                  onChange={(e) => handleChange('flightNumber', e.target.value)}
                  style={formErrors.flightNumber ? { borderColor: '#dc2626' } : {}}
                />
                {formErrors.flightNumber && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{formErrors.flightNumber}</span>}
              </div>
            </div>

            {/* Origin */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Origem</label>
                <input
                  className="input-field"
                  placeholder="Ex: Sao Paulo, SP"
                  value={form.origin}
                  onChange={(e) => handleChange('origin', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Código (IATA)</label>
                <input
                  className="input-field"
                  placeholder="Ex: GRU"
                  value={form.originCode}
                  onChange={(e) => handleChange('originCode', e.target.value)}
                />
              </div>
            </div>

            {/* Destination */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Destino</label>
                <input
                  className="input-field"
                  placeholder="Ex: Orlando, FL"
                  value={form.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Código (IATA)</label>
                <input
                  className="input-field"
                  placeholder="Ex: MCO"
                  value={form.destinationCode}
                  onChange={(e) => handleChange('destinationCode', e.target.value)}
                />
              </div>
            </div>

            {/* Departure */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Data de Partida</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.departureDate}
                  onChange={(e) => handleChange('departureDate', e.target.value)}
                  style={formErrors.departureDate ? { borderColor: '#dc2626' } : {}}
                />
                {formErrors.departureDate && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{formErrors.departureDate}</span>}
              </div>
              <div>
                <label className="label">Horario de Partida</label>
                <input
                  type="time"
                  className="input-field"
                  value={form.departureTime}
                  onChange={(e) => handleChange('departureTime', e.target.value)}
                />
              </div>
            </div>

            {/* Arrival */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Data de Chegada</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.arrivalDate}
                  onChange={(e) => handleChange('arrivalDate', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Horario de Chegada</label>
                <input
                  type="time"
                  className="input-field"
                  value={form.arrivalTime}
                  onChange={(e) => handleChange('arrivalTime', e.target.value)}
                />
              </div>
            </div>

            {/* Duration & PNR */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Duração</label>
                <input
                  className="input-field"
                  placeholder="Ex: 10h30"
                  value={form.duration}
                  onChange={(e) => handleChange('duration', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Código de Reserva (PNR)</label>
                <input
                  className="input-field"
                  placeholder="Ex: ABC123"
                  value={form.pnr}
                  onChange={(e) => handleChange('pnr', e.target.value)}
                />
              </div>
            </div>

            {/* Seats & Baggage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Assentos</label>
                <input
                  className="input-field"
                  placeholder="Ex: 12A, 12B, 12C"
                  value={form.seats}
                  onChange={(e) => handleChange('seats', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Bagagem</label>
                <input
                  className="input-field"
                  placeholder="Ex: 2x 23kg despachada + 1 mao"
                  value={form.baggage}
                  onChange={(e) => handleChange('baggage', e.target.value)}
                />
              </div>
            </div>

            {/* Check-in & Boarding Pass */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Check-in Disponível</label>
                <input
                  className="input-field"
                  placeholder="Ex: 24h antes"
                  value={form.checkInAvailable}
                  onChange={(e) => handleChange('checkInAvailable', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Cartão de Embarque</label>
                <input
                  className="input-field"
                  placeholder="Ex: Pendente / Emitido"
                  value={form.boardingPass}
                  onChange={(e) => handleChange('boardingPass', e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label className="label">Observações</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Notas adicionais sobre o voo..."
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
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
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              color: 'var(--ink-muted)',
            }}
          >
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
          />
        )}

        {voltaFlights.length > 0 && (
          <FlightSection
            title="Voos de Volta"
            icon="🛬"
            flights={voltaFlights}
            onEdit={handleEdit}
            onDelete={handleDelete}
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
}: {
  title: string;
  icon: string;
  flights: Flight[];
  onEdit: (flight: Flight) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>{icon}</span> {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
    </div>
  );
}

function FlightCard({
  flight,
  onEdit,
  onDelete,
}: {
  flight: Flight;
  onEdit: (flight: Flight) => void;
  onDelete: (id: string) => void;
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
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          background: statusColor.bg,
          color: statusColor.text,
          border: `1px solid ${statusColor.border}`,
        }}
      >
        {STATUS_LABELS[flight.status]}
      </div>

      {/* Airline & Flight Number */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--ocean)' }}>
          {flight.airline}
        </span>
        <span style={{ fontSize: '14px', color: 'var(--ink-muted)', fontWeight: '500' }}>
          {flight.flightNumber}
        </span>
      </div>

      {/* Route */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '16px',
          padding: '12px 0',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ocean)', letterSpacing: '-0.02em' }}>
            {flight.originCode || '---'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{flight.origin}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginTop: '4px' }}>
            {flight.departureTime || '--:--'}
          </div>
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
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--ocean)', letterSpacing: '-0.02em' }}>
            {flight.destinationCode || '---'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{flight.destination}</div>
          <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginTop: '4px' }}>
            {flight.arrivalTime || '--:--'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>{formatDate(flight.arrivalDate)}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '12px', marginBottom: '12px' }}>
        {flight.pnr && (
          <DetailItem label="PNR" value={flight.pnr} />
        )}
        {flight.seats && (
          <DetailItem label="Assentos" value={flight.seats} />
        )}
        {flight.baggage && (
          <DetailItem label="Bagagem" value={flight.baggage} />
        )}
        {flight.checkInAvailable && (
          <DetailItem label="Check-in" value={flight.checkInAvailable} />
        )}
        {flight.boardingPass && (
          <DetailItem label="Embarque" value={flight.boardingPass} />
        )}
      </div>

      {/* Notes */}
      {flight.notes && (
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--surface-raised)',
            borderRadius: '8px',
            fontSize: '13px',
            color: 'var(--ink-muted)',
            marginBottom: '12px',
          }}
        >
          {flight.notes}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
        <button
          className="btn-secondary"
          style={{ padding: '6px 14px', fontSize: '13px' }}
          onClick={() => onEdit(flight)}
        >
          Editar
        </button>
        <button
          className="btn-danger"
          style={{ padding: '6px 14px', fontSize: '13px' }}
          onClick={() => onDelete(flight.id)}
        >
          Excluir
        </button>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '2px' }}>
        {label}
      </div>
      <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>
        {value}
      </div>
    </div>
  );
}
