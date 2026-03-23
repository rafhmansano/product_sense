'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { CarRental } from '@/types';

const EMPTY_CAR: Omit<CarRental, 'id'> = {
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

const FIELD_LABELS: Record<keyof Omit<CarRental, 'id'>, string> = {
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

const FIELD_TYPES: Partial<Record<keyof Omit<CarRental, 'id'>, string>> = {
  pickupDate: 'date',
  pickupTime: 'time',
  returnDate: 'date',
  returnTime: 'time',
};

export default function CarroPage() {
  const { carRental, setCarRental, updateCarRental } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<CarRental, 'id'>>(EMPTY_CAR);

  const handleStartEdit = () => {
    if (carRental) {
      const { id, ...rest } = carRental;
      setForm(rest);
    }
    setEditing(true);
  };

  const handleStartNew = () => {
    setForm(EMPTY_CAR);
    setEditing(true);
  };

  const handleSave = () => {
    if (carRental) {
      updateCarRental(form);
    } else {
      setCarRental({ ...form, id: `id_${Date.now()}` });
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditing(false);
  };

  const handleChange = (key: keyof Omit<CarRental, 'id'>, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fieldKeys = Object.keys(EMPTY_CAR) as (keyof Omit<CarRental, 'id'>)[];

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '900px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--ocean)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '36px' }}>🚗</span>
            Aluguel de Carro
          </h1>
        </div>

        {/* Alerts Section */}
        <div className="card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
          <h3
            style={{
              fontSize: '14px',
              fontWeight: '700',
              color: 'var(--ocean)',
              margin: '0 0 14px 0',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            Alertas Importantes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {ALERTS.map((alert, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: `${alert.color}0A`,
                  borderLeft: `3px solid ${alert.color}`,
                }}
              >
                <span style={{ fontSize: '16px' }}>{alert.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--ink)' }}>
                  {alert.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Form / Display */}
        {editing ? (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--ocean)',
                margin: '0 0 20px 0',
              }}
            >
              {carRental ? 'Editar Aluguel' : 'Novo Aluguel de Carro'}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              {fieldKeys.map((key) => (
                <div
                  key={key}
                  style={key === 'notes' ? { gridColumn: '1 / -1' } : undefined}
                >
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
              <button className="btn-primary" onClick={handleSave}>
                Salvar
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        ) : carRental ? (
          <div className="card" style={{ marginBottom: '24px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <h3
                style={{
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--ocean)',
                  margin: 0,
                }}
              >
                {carRental.company || 'Aluguel de Carro'}
              </h3>
              <button className="btn-secondary" onClick={handleStartEdit}>
                Editar
              </button>
            </div>

            {carRental.reservationCode && (
              <div
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'var(--sky)',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginBottom: '20px',
                  letterSpacing: '0.04em',
                }}
              >
                Reserva: {carRental.reservationCode}
              </div>
            )}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              {fieldKeys
                .filter((key) => key !== 'notes' && carRental[key])
                .map((key) => (
                  <div key={key}>
                    <div
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        color: 'var(--ink-subtle)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        marginBottom: '4px',
                      }}
                    >
                      {FIELD_LABELS[key]}
                    </div>
                    <div
                      style={{
                        fontSize: '14px',
                        fontWeight: '500',
                        color: 'var(--ink)',
                      }}
                    >
                      {carRental[key]}
                    </div>
                  </div>
                ))}
            </div>

            {carRental.notes && (
              <div
                style={{
                  marginTop: '20px',
                  padding: '14px 16px',
                  background: 'var(--surface-raised)',
                  borderRadius: '8px',
                  borderLeft: '3px solid var(--sky)',
                }}
              >
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: 'var(--ink-subtle)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '4px',
                  }}
                >
                  Observacoes
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.6 }}>
                  {carRental.notes}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px', marginBottom: '24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>🚗</div>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px', margin: '0 0 20px' }}>
              Nenhum aluguel de carro cadastrado ainda.
            </p>
            <button className="btn-primary" onClick={handleStartNew}>
              Adicionar Aluguel de Carro
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
