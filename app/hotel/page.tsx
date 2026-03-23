'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { Hotel } from '@/types';

const EMPTY_HOTEL: Omit<Hotel, 'id'> = {
  name: '',
  address: '',
  mapsUrl: '',
  checkInDate: '',
  checkInTime: '',
  checkOutDate: '',
  checkOutTime: '',
  reservationCode: '',
  roomType: '',
  breakfast: '',
  pool: '',
  parking: '',
  distanceToParks: '',
  shuttle: '',
  wifi: '',
  crib: '',
  cancellationPolicy: '',
  contactPhone: '',
  contactEmail: '',
  notes: '',
};

const FAMILY_TIPS = [
  {
    icon: '🍼',
    title: 'Berco',
    text: 'Solicite o berco na reserva ou ligue com antecedencia para garantir disponibilidade.',
  },
  {
    icon: '🧊',
    title: 'Geladeira',
    text: 'Peca uma geladeira no quarto para guardar leite, sucos e lanches das criancas.',
  },
  {
    icon: '🏊',
    title: 'Piscina',
    text: 'Verifique os horarios da piscina e se ha area rasa para criancas pequenas.',
  },
  {
    icon: '🧹',
    title: 'Limpeza',
    text: 'Peca limpeza extra e toalhas adicionais - criancas fazem bagunca!',
  },
  {
    icon: '🔌',
    title: 'Tomadas',
    text: 'Leve adaptadores de tomada e protetores para as que ficam baixas.',
  },
  {
    icon: '🚐',
    title: 'Shuttle',
    text: 'Hoteis com shuttle gratuito para os parques economizam em estacionamento.',
  },
];

export default function HotelPage() {
  const { hotel, setHotel, updateHotel } = useAppStore();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<Omit<Hotel, 'id'>>(() => {
    if (!hotel) return EMPTY_HOTEL;
    const { id: _id, ...rest } = hotel;
    return rest;
  });

  const handleChange = (field: keyof Omit<Hotel, 'id'>, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.name) return;

    if (hotel) {
      updateHotel(form);
    } else {
      const newHotel: Hotel = { ...form, id: `id_${Date.now()}` };
      setHotel(newHotel);
    }
    setEditMode(false);
  };

  const handleEdit = () => {
    if (hotel) {
      const { id, ...rest } = hotel;
      setForm(rest);
    }
    setEditMode(true);
  };

  const handleCancel = () => {
    if (hotel) {
      const { id, ...rest } = hotel;
      setForm(rest);
    } else {
      setForm(EMPTY_HOTEL);
    }
    setEditMode(false);
  };

  const formatDate = (date: string) => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  };

  const showForm = editMode || !hotel;

  return (
    <AppShell>
      <div style={{ padding: '32px 40px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏨</span>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--ocean)', margin: 0 }}>Hotel</h1>
          </div>
          {hotel && !editMode && (
            <button className="btn-primary" onClick={handleEdit}>
              Editar Hotel
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="card animate-fade-in" style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 20px' }}>
              {hotel ? 'Editar Hotel' : 'Adicionar Hotel'}
            </h2>

            {/* Name & Reservation Code */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Nome do Hotel</label>
                <input
                  className="input-field"
                  placeholder="Ex: Holiday Inn Orlando"
                  value={form.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Codigo da Reserva</label>
                <input
                  className="input-field"
                  placeholder="Ex: HI-123456"
                  value={form.reservationCode}
                  onChange={(e) => handleChange('reservationCode', e.target.value)}
                />
              </div>
            </div>

            {/* Address & Maps URL */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Endereco</label>
                <input
                  className="input-field"
                  placeholder="Ex: 5711 Major Blvd, Orlando, FL 32819"
                  value={form.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Link Google Maps</label>
                <input
                  className="input-field"
                  placeholder="https://maps.google.com/..."
                  value={form.mapsUrl}
                  onChange={(e) => handleChange('mapsUrl', e.target.value)}
                />
              </div>
            </div>

            {/* Check-in */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Data Check-in</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.checkInDate}
                  onChange={(e) => handleChange('checkInDate', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Horario Check-in</label>
                <input
                  type="time"
                  className="input-field"
                  value={form.checkInTime}
                  onChange={(e) => handleChange('checkInTime', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Data Check-out</label>
                <input
                  type="date"
                  className="input-field"
                  value={form.checkOutDate}
                  onChange={(e) => handleChange('checkOutDate', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Horario Check-out</label>
                <input
                  type="time"
                  className="input-field"
                  value={form.checkOutTime}
                  onChange={(e) => handleChange('checkOutTime', e.target.value)}
                />
              </div>
            </div>

            {/* Room Type & Breakfast */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Tipo de Quarto</label>
                <input
                  className="input-field"
                  placeholder="Ex: Suite Familia, 2 camas queen"
                  value={form.roomType}
                  onChange={(e) => handleChange('roomType', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Cafe da Manha</label>
                <input
                  className="input-field"
                  placeholder="Ex: Incluso, buffet das 7h as 10h"
                  value={form.breakfast}
                  onChange={(e) => handleChange('breakfast', e.target.value)}
                />
              </div>
            </div>

            {/* Pool & Parking */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Piscina</label>
                <input
                  className="input-field"
                  placeholder="Ex: Sim, aquecida, area infantil"
                  value={form.pool}
                  onChange={(e) => handleChange('pool', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Estacionamento</label>
                <input
                  className="input-field"
                  placeholder="Ex: Gratuito, self-parking"
                  value={form.parking}
                  onChange={(e) => handleChange('parking', e.target.value)}
                />
              </div>
            </div>

            {/* Distance & Shuttle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Distancia aos Parques</label>
                <input
                  className="input-field"
                  placeholder="Ex: 15 min de carro ate Disney"
                  value={form.distanceToParks}
                  onChange={(e) => handleChange('distanceToParks', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Shuttle</label>
                <input
                  className="input-field"
                  placeholder="Ex: Gratuito para Disney e Universal"
                  value={form.shuttle}
                  onChange={(e) => handleChange('shuttle', e.target.value)}
                />
              </div>
            </div>

            {/* WiFi & Crib */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Wi-Fi</label>
                <input
                  className="input-field"
                  placeholder="Ex: Gratuito, senha no check-in"
                  value={form.wifi}
                  onChange={(e) => handleChange('wifi', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Berco</label>
                <input
                  className="input-field"
                  placeholder="Ex: Disponivel mediante solicitacao"
                  value={form.crib}
                  onChange={(e) => handleChange('crib', e.target.value)}
                />
              </div>
            </div>

            {/* Cancellation Policy */}
            <div style={{ marginBottom: '16px' }}>
              <label className="label">Politica de Cancelamento</label>
              <input
                className="input-field"
                placeholder="Ex: Cancelamento gratuito ate 48h antes"
                value={form.cancellationPolicy}
                onChange={(e) => handleChange('cancellationPolicy', e.target.value)}
              />
            </div>

            {/* Contact */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label className="label">Telefone de Contato</label>
                <input
                  className="input-field"
                  placeholder="Ex: +1 (407) 555-1234"
                  value={form.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                />
              </div>
              <div>
                <label className="label">E-mail de Contato</label>
                <input
                  className="input-field"
                  placeholder="Ex: reservas@hotel.com"
                  value={form.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                />
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginBottom: '20px' }}>
              <label className="label">Observacoes</label>
              <textarea
                className="input-field"
                rows={3}
                placeholder="Notas adicionais sobre o hotel..."
                value={form.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-primary" onClick={handleSubmit}>
                {hotel ? 'Salvar Alteracoes' : 'Adicionar Hotel'}
              </button>
              {hotel && (
                <button className="btn-secondary" onClick={handleCancel}>
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hotel Card Display */}
        {hotel && !editMode && (
          <div className="card animate-fade-in" style={{ marginBottom: '32px' }}>
            {/* Hotel Name & Reservation */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '22px', fontWeight: '700', color: 'var(--ocean)', margin: '0 0 4px' }}>
                  {hotel.name}
                </h2>
                {hotel.address && (
                  <p style={{ fontSize: '14px', color: 'var(--ink-muted)', margin: 0 }}>
                    {hotel.address}
                    {hotel.mapsUrl && (
                      <>
                        {' '}
                        <a
                          href={hotel.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--sky)', textDecoration: 'none', fontWeight: '500' }}
                        >
                          Ver no mapa
                        </a>
                      </>
                    )}
                  </p>
                )}
              </div>
              {hotel.reservationCode && (
                <div
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    background: 'rgba(59,130,246,0.1)',
                    border: '1px solid var(--sky)',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--sky)',
                  }}
                >
                  {hotel.reservationCode}
                </div>
              )}
            </div>

            {/* Check-in / Check-out */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                padding: '16px 0',
                borderTop: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                marginBottom: '20px',
              }}
            >
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '4px' }}>
                  Check-in
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)' }}>
                  {formatDate(hotel.checkInDate) || '--/--/----'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                  {hotel.checkInTime || '--:--'}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>
                  {hotel.checkInDate && hotel.checkOutDate
                    ? `${Math.ceil((new Date(hotel.checkOutDate).getTime() - new Date(hotel.checkInDate).getTime()) / (1000 * 60 * 60 * 24))} noites`
                    : '-- noites'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '120px' }}>
                  <div style={{ flex: 1, height: '2px', background: 'var(--border)' }} />
                  <span style={{ fontSize: '16px' }}>🏨</span>
                  <div style={{ flex: 1, height: '2px', background: 'var(--border)' }} />
                </div>
              </div>

              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '4px' }}>
                  Check-out
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--coral)' }}>
                  {formatDate(hotel.checkOutDate) || '--/--/----'}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>
                  {hotel.checkOutTime || '--:--'}
                </div>
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
              {hotel.roomType && <DetailItem icon="🛏️" label="Tipo de Quarto" value={hotel.roomType} />}
              {hotel.breakfast && <DetailItem icon="🍳" label="Cafe da Manha" value={hotel.breakfast} />}
              {hotel.pool && <DetailItem icon="🏊" label="Piscina" value={hotel.pool} />}
              {hotel.parking && <DetailItem icon="🅿️" label="Estacionamento" value={hotel.parking} />}
              {hotel.distanceToParks && <DetailItem icon="🎢" label="Distancia aos Parques" value={hotel.distanceToParks} />}
              {hotel.shuttle && <DetailItem icon="🚐" label="Shuttle" value={hotel.shuttle} />}
              {hotel.wifi && <DetailItem icon="📶" label="Wi-Fi" value={hotel.wifi} />}
              {hotel.crib && <DetailItem icon="🍼" label="Berco" value={hotel.crib} />}
              {hotel.cancellationPolicy && <DetailItem icon="📋" label="Cancelamento" value={hotel.cancellationPolicy} />}
              {hotel.contactPhone && <DetailItem icon="📞" label="Telefone" value={hotel.contactPhone} />}
              {hotel.contactEmail && <DetailItem icon="📧" label="E-mail" value={hotel.contactEmail} />}
            </div>

            {/* Notes */}
            {hotel.notes && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'var(--surface-raised)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  color: 'var(--ink-muted)',
                }}
              >
                {hotel.notes}
              </div>
            )}
          </div>
        )}

        {/* No Hotel Empty State */}
        {!hotel && !editMode && (
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '60px 24px',
              color: 'var(--ink-muted)',
            }}
          >
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🏨</span>
            <p style={{ fontSize: '16px', margin: '0 0 8px' }}>Nenhum hotel cadastrado ainda.</p>
            <p style={{ fontSize: '14px', color: 'var(--ink-subtle)', margin: 0 }}>
              Preencha os dados acima para registrar sua hospedagem.
            </p>
          </div>
        )}

        {/* Family Tips */}
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Dicas para Familias com Criancas Pequenas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {FAMILY_TIPS.map((tip, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginBottom: '4px' }}>
                    {tip.title}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>
                    {tip.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '2px' }}>
          {label}
        </div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>
          {value}
        </div>
      </div>
    </div>
  );
}
