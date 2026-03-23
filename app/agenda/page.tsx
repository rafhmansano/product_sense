'use client';

import { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { AgendaEvent, EventType, EVENT_COLORS, EVENT_TYPE_LABELS } from '@/types';

const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];

const EMPTY_EVENT = {
  date: '',
  time: '',
  endTime: '',
  title: '',
  description: '',
  type: 'lembrete' as EventType,
};

export default function AgendaPage() {
  const { events, addEvent, updateEvent, deleteEvent, toggleEventComplete } = useAppStore();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_EVENT);
  const [filterDate, setFilterDate] = useState('');

  const sortedEvents = useMemo(() => {
    let filtered = [...events];
    if (filterDate) {
      filtered = filtered.filter((e) => e.date === filterDate);
    }
    return filtered.sort((a, b) => {
      const dateComp = a.date.localeCompare(b.date);
      if (dateComp !== 0) return dateComp;
      return a.time.localeCompare(b.time);
    });
  }, [events, filterDate]);

  const groupedEvents = useMemo(() => {
    const groups: Record<string, AgendaEvent[]> = {};
    for (const event of sortedEvents) {
      const key = event.date || 'Sem data';
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    }
    return groups;
  }, [sortedEvents]);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.date) return;

    if (editingId) {
      updateEvent(editingId, {
        ...form,
        endTime: form.endTime || undefined,
      });
    } else {
      const newEvent: AgendaEvent = {
        id: `id_${Date.now()}`,
        date: form.date,
        time: form.time,
        endTime: form.endTime || undefined,
        title: form.title,
        description: form.description,
        type: form.type,
        completed: false,
      };
      addEvent(newEvent);
    }

    setForm(EMPTY_EVENT);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (event: AgendaEvent) => {
    setForm({
      date: event.date,
      time: event.time,
      endTime: event.endTime || '',
      title: event.title,
      description: event.description,
      type: event.type,
    });
    setEditingId(event.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm(EMPTY_EVENT);
    setEditingId(null);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    deleteEvent(id);
  };

  const formatDate = (dateStr: string) => {
    if (dateStr === 'Sem data') return dateStr;
    try {
      const [year, month, day] = dateStr.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '900px' }} className="animate-fade-in">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '32px',
          }}
        >
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
            <span style={{ fontSize: '36px' }}>📅</span>
            Agenda
          </h1>
          {!showForm && (
            <button
              className="btn-primary"
              onClick={() => {
                setForm(EMPTY_EVENT);
                setEditingId(null);
                setShowForm(true);
              }}
            >
              + Novo Evento
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="card" style={{ marginBottom: '24px', padding: '14px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label className="label" style={{ margin: 0, whiteSpace: 'nowrap' }}>
              Filtrar por data
            </label>
            <input
              className="input-field"
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={{ maxWidth: '200px' }}
            />
            {filterDate && (
              <button
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '12px' }}
                onClick={() => setFilterDate('')}
              >
                Limpar
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="card" style={{ marginBottom: '24px' }}>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--ocean)',
                margin: '0 0 20px 0',
              }}
            >
              {editingId ? 'Editar Evento' : 'Novo Evento'}
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '16px',
              }}
            >
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Titulo</label>
                <input
                  className="input-field"
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Nome do evento"
                />
              </div>
              <div>
                <label className="label">Data</label>
                <input
                  className="input-field"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Tipo</label>
                <select
                  className="input-field"
                  value={form.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {EVENT_TYPE_LABELS[t]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Hora Inicio</label>
                <input
                  className="input-field"
                  type="time"
                  value={form.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                />
              </div>
              <div>
                <label className="label">Hora Fim</label>
                <input
                  className="input-field"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Descricao</label>
                <textarea
                  className="input-field"
                  rows={3}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Detalhes do evento..."
                  style={{ resize: 'vertical' }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-primary" onClick={handleSave}>
                {editingId ? 'Atualizar' : 'Adicionar'}
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Events grouped by day */}
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}>📅</div>
            <p style={{ color: 'var(--ink-muted)', fontSize: '15px', margin: '0 0 20px' }}>
              {filterDate
                ? 'Nenhum evento encontrado para esta data.'
                : 'Nenhum evento na agenda ainda.'}
            </p>
            {!showForm && (
              <button
                className="btn-primary"
                onClick={() => {
                  setForm(EMPTY_EVENT);
                  setEditingId(null);
                  setShowForm(true);
                }}
              >
                Adicionar Primeiro Evento
              </button>
            )}
          </div>
        ) : (
          Object.entries(groupedEvents).map(([dateKey, dayEvents]) => (
            <div key={dateKey} style={{ marginBottom: '28px' }}>
              <h3
                style={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: 'var(--ocean)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  margin: '0 0 12px 0',
                  paddingBottom: '8px',
                  borderBottom: '2px solid var(--border)',
                }}
              >
                {formatDate(dateKey)}
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="card"
                    style={{
                      borderLeft: `4px solid ${EVENT_COLORS[event.type]}`,
                      opacity: event.completed ? 0.6 : 1,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                      }}
                    >
                      {/* Checkbox */}
                      <input
                        type="checkbox"
                        checked={event.completed}
                        onChange={() => toggleEventComplete(event.id)}
                        style={{
                          width: '18px',
                          height: '18px',
                          marginTop: '2px',
                          cursor: 'pointer',
                          accentColor: EVENT_COLORS[event.type],
                          flexShrink: 0,
                        }}
                      />

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            gap: '12px',
                          }}
                        >
                          <div>
                            <div
                              style={{
                                fontSize: '15px',
                                fontWeight: '600',
                                color: 'var(--ink)',
                                textDecoration: event.completed ? 'line-through' : 'none',
                              }}
                            >
                              {event.title}
                            </div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginTop: '4px',
                              }}
                            >
                              {event.time && (
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: 'var(--ink-muted)',
                                    fontWeight: '500',
                                  }}
                                >
                                  {event.time}
                                  {event.endTime ? ` - ${event.endTime}` : ''}
                                </span>
                              )}
                              <span
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  background: `${EVENT_COLORS[event.type]}15`,
                                  color: EVENT_COLORS[event.type],
                                  fontWeight: '600',
                                }}
                              >
                                {EVENT_TYPE_LABELS[event.type]}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                            <button
                              className="btn-secondary"
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              onClick={() => handleEdit(event)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn-danger"
                              style={{ padding: '6px 10px', fontSize: '12px' }}
                              onClick={() => handleDelete(event.id)}
                            >
                              Excluir
                            </button>
                          </div>
                        </div>

                        {event.description && (
                          <p
                            style={{
                              fontSize: '13px',
                              color: 'var(--ink-muted)',
                              margin: '8px 0 0',
                              lineHeight: 1.5,
                            }}
                          >
                            {event.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
