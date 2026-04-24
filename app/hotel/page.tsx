'use client';

import { useRef, useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { FileAttachment, Hotel } from '@/types';

const EMPTY_HOTEL: Omit<Hotel, 'id' | 'attachments'> = {
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
  { icon: '🍼', title: 'Berco', text: 'Solicite o berco na reserva ou ligue com antecedencia para garantir disponibilidade.' },
  { icon: '🧊', title: 'Geladeira', text: 'Peca uma geladeira no quarto para guardar leite, sucos e lanches das criancas.' },
  { icon: '🏊', title: 'Piscina', text: 'Verifique os horarios da piscina e se ha area rasa para criancas pequenas.' },
  { icon: '🧹', title: 'Limpeza', text: 'Peca limpeza extra e toalhas adicionais - criancas fazem bagunca!' },
  { icon: '🔌', title: 'Tomadas', text: 'Leve adaptadores de tomada e protetores para as que ficam baixas.' },
  { icon: '🚐', title: 'Shuttle', text: 'Hoteis com shuttle gratuito para os parques economizam em estacionamento.' },
];

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
          Nenhum documento anexado. Adicione confirmações de reserva, vouchers ou fotos.
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
                  <img
                    src={att.dataUrl}
                    alt={att.name}
                    style={{ width: '100%', height: '70px', objectFit: 'cover', display: 'block' }}
                  />
                </a>
              ) : (
                <a
                  href={att.dataUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '70px', textDecoration: 'none' }}
                >
                  <span style={{ fontSize: '32px' }}>📄</span>
                </a>
              )}
              <div style={{ padding: '6px 8px' }}>
                <div style={{ fontSize: '11px', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {att.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--ink-subtle)' }}>
                  {formatSize(att.size)}
                </div>
              </div>
              <button
                onClick={() => onRemove(att.id)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)',
                  border: 'none',
                  color: 'white',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
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

function HotelForm({
  initial,
  onSave,
  onCancel,
  title,
}: {
  initial: Omit<Hotel, 'id' | 'attachments'>;
  onSave: (data: Omit<Hotel, 'id' | 'attachments'>) => void;
  onCancel: () => void;
  title: string;
}) {
  const [form, setForm] = useState(initial);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 20px' }}>
        {title}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Nome do Hotel</label>
          <input className="input-field" placeholder="Ex: Holiday Inn Orlando" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div>
          <label className="label">Codigo da Reserva</label>
          <input className="input-field" placeholder="Ex: HI-123456" value={form.reservationCode} onChange={(e) => handleChange('reservationCode', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Endereco</label>
          <input className="input-field" placeholder="Ex: 5711 Major Blvd, Orlando, FL 32819" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
        </div>
        <div>
          <label className="label">Link Google Maps</label>
          <input className="input-field" placeholder="https://maps.google.com/..." value={form.mapsUrl} onChange={(e) => handleChange('mapsUrl', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Data Check-in</label>
          <input type="date" className="input-field" value={form.checkInDate} onChange={(e) => handleChange('checkInDate', e.target.value)} />
        </div>
        <div>
          <label className="label">Horario Check-in</label>
          <input type="time" className="input-field" value={form.checkInTime} onChange={(e) => handleChange('checkInTime', e.target.value)} />
        </div>
        <div>
          <label className="label">Data Check-out</label>
          <input type="date" className="input-field" value={form.checkOutDate} onChange={(e) => handleChange('checkOutDate', e.target.value)} />
        </div>
        <div>
          <label className="label">Horario Check-out</label>
          <input type="time" className="input-field" value={form.checkOutTime} onChange={(e) => handleChange('checkOutTime', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Tipo de Quarto</label>
          <input className="input-field" placeholder="Ex: Suite Familia, 2 camas queen" value={form.roomType} onChange={(e) => handleChange('roomType', e.target.value)} />
        </div>
        <div>
          <label className="label">Cafe da Manha</label>
          <input className="input-field" placeholder="Ex: Incluso, buffet das 7h as 10h" value={form.breakfast} onChange={(e) => handleChange('breakfast', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Piscina</label>
          <input className="input-field" placeholder="Ex: Sim, aquecida, area infantil" value={form.pool} onChange={(e) => handleChange('pool', e.target.value)} />
        </div>
        <div>
          <label className="label">Estacionamento</label>
          <input className="input-field" placeholder="Ex: Gratuito, self-parking" value={form.parking} onChange={(e) => handleChange('parking', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Distancia aos Parques</label>
          <input className="input-field" placeholder="Ex: 15 min de carro ate Disney" value={form.distanceToParks} onChange={(e) => handleChange('distanceToParks', e.target.value)} />
        </div>
        <div>
          <label className="label">Shuttle</label>
          <input className="input-field" placeholder="Ex: Gratuito para Disney e Universal" value={form.shuttle} onChange={(e) => handleChange('shuttle', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Wi-Fi</label>
          <input className="input-field" placeholder="Ex: Gratuito, senha no check-in" value={form.wifi} onChange={(e) => handleChange('wifi', e.target.value)} />
        </div>
        <div>
          <label className="label">Berco</label>
          <input className="input-field" placeholder="Ex: Disponivel mediante solicitacao" value={form.crib} onChange={(e) => handleChange('crib', e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label className="label">Politica de Cancelamento</label>
        <input className="input-field" placeholder="Ex: Cancelamento gratuito ate 48h antes" value={form.cancellationPolicy} onChange={(e) => handleChange('cancellationPolicy', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label className="label">Telefone de Contato</label>
          <input className="input-field" placeholder="Ex: +1 (407) 555-1234" value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
        </div>
        <div>
          <label className="label">E-mail de Contato</label>
          <input className="input-field" placeholder="Ex: reservas@hotel.com" value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label className="label">Observacoes</label>
        <textarea className="input-field" rows={3} placeholder="Notas adicionais sobre o hotel..." value={form.notes} onChange={(e) => handleChange('notes', e.target.value)} style={{ resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', gap: '12px' }}>
        <button className="btn-primary" onClick={() => { if (form.name) onSave(form); }}>
          Salvar Hotel
        </button>
        <button className="btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

function HotelCard({
  hotel,
  onEdit,
  onDelete,
  onAddAttachment,
  onRemoveAttachment,
}: {
  hotel: Hotel;
  onEdit: (hotel: Hotel) => void;
  onDelete: (id: string) => void;
  onAddAttachment: (hotelId: string, a: FileAttachment) => void;
  onRemoveAttachment: (hotelId: string, aId: string) => void;
}) {
  const formatDate = (date: string) => {
    if (!date) return '';
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}`;
  };

  const nights =
    hotel.checkInDate && hotel.checkOutDate
      ? Math.ceil(
          (new Date(hotel.checkOutDate).getTime() - new Date(hotel.checkInDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

  return (
    <div className="card animate-fade-in" style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ocean)', margin: '0 0 4px' }}>
            {hotel.name}
          </h2>
          {hotel.address && (
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', margin: 0 }}>
              {hotel.address}
              {hotel.mapsUrl && (
                <> {' '}<a href={hotel.mapsUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--sky)', textDecoration: 'none', fontWeight: '500' }}>Ver no mapa</a></>
              )}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {hotel.reservationCode && (
            <div style={{ padding: '4px 12px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid var(--sky)', fontSize: '13px', fontWeight: '600', color: 'var(--sky)' }}>
              {hotel.reservationCode}
            </div>
          )}
          <button className="btn-secondary" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => onEdit(hotel)}>
            Editar
          </button>
          <button className="btn-danger" style={{ padding: '6px 14px', fontSize: '13px' }} onClick={() => { if (confirm('Excluir este hotel?')) onDelete(hotel.id); }}>
            Excluir
          </button>
        </div>
      </div>

      {/* Check-in / Check-out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '16px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '20px' }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '4px' }}>Check-in</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--green)' }}>{formatDate(hotel.checkInDate) || '--/--/----'}</div>
          <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>{hotel.checkInTime || '--:--'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>{nights !== null ? `${nights} noite${nights !== 1 ? 's' : ''}` : '-- noites'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', width: '120px' }}>
            <div style={{ flex: 1, height: '2px', background: 'var(--border)' }} />
            <span style={{ fontSize: '16px' }}>🏨</span>
            <div style={{ flex: 1, height: '2px', background: 'var(--border)' }} />
          </div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '4px' }}>Check-out</div>
          <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--coral)' }}>{formatDate(hotel.checkOutDate) || '--/--/----'}</div>
          <div style={{ fontSize: '14px', color: 'var(--ink-muted)', marginTop: '2px' }}>{hotel.checkOutTime || '--:--'}</div>
        </div>
      </div>

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
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

      {hotel.notes && (
        <div style={{ padding: '12px 16px', background: 'var(--surface-raised)', borderRadius: '8px', fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
          {hotel.notes}
        </div>
      )}

      <AttachmentsSection
        attachments={hotel.attachments ?? []}
        onAdd={(a) => onAddAttachment(hotel.id, a)}
        onRemove={(aId) => onRemoveAttachment(hotel.id, aId)}
      />
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
      <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
      <div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>{value}</div>
      </div>
    </div>
  );
}

export default function HotelPage() {
  const { hotels, addHotel, updateHotel, deleteHotel, addHotelAttachment, removeHotelAttachment } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formInitial, setFormInitial] = useState<Omit<Hotel, 'id' | 'attachments'>>(EMPTY_HOTEL);

  const handleAddNew = () => {
    setFormInitial(EMPTY_HOTEL);
    setEditingId(null);
    setShowForm(true);
  };

  const handleEdit = (hotel: Hotel) => {
    const { id: _id, attachments: _att, ...rest } = hotel;
    setFormInitial(rest);
    setEditingId(hotel.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSave = (data: Omit<Hotel, 'id' | 'attachments'>) => {
    if (editingId) {
      updateHotel(editingId, data);
    } else {
      addHotel({ ...data, id: `id_${Date.now()}`, attachments: [] });
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
      <div style={{ padding: '32px 40px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '32px' }}>🏨</span>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--ocean)', margin: 0 }}>Hotel</h1>
              {hotels.length > 0 && (
                <p style={{ fontSize: '13px', color: 'var(--ink-muted)', margin: '2px 0 0' }}>
                  {hotels.length} {hotels.length === 1 ? 'hospedagem cadastrada' : 'hospedagens cadastradas'}
                </p>
              )}
            </div>
          </div>
          {!showForm && (
            <button className="btn-primary" onClick={handleAddNew}>
              + Adicionar Hotel
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <HotelForm
            initial={formInitial}
            title={editingId ? 'Editar Hotel' : 'Novo Hotel'}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        )}

        {/* Hotel Cards */}
        {hotels.length === 0 && !showForm ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--ink-muted)' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🏨</span>
            <p style={{ fontSize: '16px', margin: '0 0 8px' }}>Nenhum hotel cadastrado ainda.</p>
            <p style={{ fontSize: '14px', color: 'var(--ink-subtle)', margin: '0 0 20px' }}>
              Adicione quantas hospedagens precisar — um hotel por destino.
            </p>
            <button className="btn-primary" onClick={handleAddNew}>Adicionar Hotel</button>
          </div>
        ) : (
          hotels.map((hotel) => (
            <HotelCard
              key={hotel.id}
              hotel={hotel}
              onEdit={handleEdit}
              onDelete={deleteHotel}
              onAddAttachment={addHotelAttachment}
              onRemoveAttachment={removeHotelAttachment}
            />
          ))
        )}

        {/* Family Tips */}
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: 'var(--ocean)', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>💡</span> Dicas para Familias com Criancas Pequenas
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {FAMILY_TIPS.map((tip, index) => (
              <div key={index} className="card" style={{ padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>{tip.icon}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginBottom: '4px' }}>{tip.title}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: '1.5' }}>{tip.text}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
