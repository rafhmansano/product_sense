'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import type { ChecklistItem } from '@/types';

export default function MalaPage() {
  const trip = useAppStore((s) => s.trip);
  const suitcaseItems = useAppStore((s) => s.suitcaseItems);
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const addChecklistItem = useAppStore((s) => s.addChecklistItem);
  const deleteChecklistItem = useAppStore((s) => s.deleteChecklistItem);

  const members = trip.members ?? [];
  const hasPassengers = members.length > 0;

  const [activePassenger, setActivePassenger] = useState<string>('geral');
  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  const currentItems = activePassenger === 'geral'
    ? suitcaseItems.filter((i) => !i.passenger)
    : suitcaseItems.filter((i) => i.passenger === activePassenger);

  const totalItems = currentItems.length;
  const checkedItems = currentItems.filter((i) => i.checked).length;
  const pct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const categories = Array.from(new Set(currentItems.map((i) => i.category)));
  const grouped = categories.map((cat) => ({
    category: cat,
    items: currentItems.filter((i) => i.category === cat),
  }));

  function handleAdd() {
    if (!newItem.trim()) return;
    const item: ChecklistItem = {
      id: `suit-${Date.now()}`,
      name: newItem.trim(),
      checked: false,
      category: newCategory.trim() || 'Outros',
      passenger: activePassenger === 'geral' ? undefined : activePassenger,
    };
    addChecklistItem('suitcaseItems', item);
    setNewItem('');
    setNewCategory('');
    setShowForm(false);
  }

  const tabBtn = (key: string, label: string, count?: { checked: number; total: number }) => {
    const isActive = activePassenger === key;
    return (
      <button
        key={key}
        onClick={() => setActivePassenger(key)}
        style={{
          padding: '8px 18px',
          borderRadius: 'var(--radius-full)',
          border: isActive ? 'none' : '1px solid var(--border)',
          background: isActive ? 'var(--blue)' : 'var(--surface)',
          color: isActive ? 'white' : 'var(--ink)',
          fontWeight: '500',
          fontSize: '14px',
          cursor: 'pointer',
          transition: 'all 0.15s',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          boxShadow: isActive ? '0 2px 8px rgba(0,113,227,0.3)' : 'var(--shadow-xs)',
        }}
      >
        {label}
        {count && count.total > 0 && (
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: '9999px',
            background: isActive ? 'rgba(255,255,255,0.25)' : 'var(--surface-sunken)',
            color: isActive ? 'white' : 'var(--ink-muted)',
          }}>
            {count.checked}/{count.total}
          </span>
        )}
      </button>
    );
  };

  return (
    <AppShell>
      <div style={{ padding: '52px 56px', maxWidth: '900px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.025em', color: 'var(--ink)', margin: '0 0 6px' }}>
            🧳 Mala de Viagem
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--ink-muted)', margin: 0 }}>
            {hasPassengers
              ? 'Checklist individualizado por passageiro. Selecione o passageiro para ver e gerenciar seus itens.'
              : 'Checklist completo de itens para levar na mala. Marque cada item conforme for separando.'}
          </p>
        </div>

        {/* Passenger tabs (only when members exist) */}
        {hasPassengers && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {tabBtn('geral', '📋 Geral', {
              checked: suitcaseItems.filter((i) => !i.passenger && i.checked).length,
              total: suitcaseItems.filter((i) => !i.passenger).length,
            })}
            {members.map((m) => {
              const memberItems = suitcaseItems.filter((i) => i.passenger === m.name);
              return tabBtn(m.name, m.name, {
                checked: memberItems.filter((i) => i.checked).length,
                total: memberItems.length,
              });
            })}
          </div>
        )}

        {/* Progress card */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>
              {checkedItems} de {totalItems} itens prontos
              {hasPassengers && activePassenger !== 'geral' && (
                <span style={{ color: 'var(--ink-muted)', fontWeight: '400', marginLeft: '6px' }}>
                  — {activePassenger}
                </span>
              )}
            </span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: pct === 100 ? 'var(--green)' : 'var(--blue)' }}>
              {pct}%
            </span>
          </div>
          <div style={{ height: '8px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: pct === 100 ? 'var(--green)' : 'var(--blue)',
              borderRadius: '9999px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          {hasPassengers && activePassenger === 'geral' && members.length > 0 && (
            <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {members.map((m) => {
                const mi = suitcaseItems.filter((i) => i.passenger === m.name);
                const mc = mi.filter((i) => i.checked).length;
                const mp = mi.length > 0 ? Math.round((mc / mi.length) * 100) : 0;
                return (
                  <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--ink-muted)' }}>
                    <span style={{ fontWeight: '500', color: 'var(--ink)' }}>{m.name}</span>
                    <span>{mc}/{mi.length}</span>
                    <div style={{ width: '48px', height: '4px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${mp}%`, background: mp === 100 ? 'var(--green)' : 'var(--blue)', borderRadius: '9999px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Add item */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary"
            style={{ marginBottom: '20px' }}
          >
            + Adicionar item{hasPassengers && activePassenger !== 'geral' ? ` para ${activePassenger}` : ''}
          </button>
        ) : (
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="Nome do item"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="input-field"
                autoFocus
              />
              <input
                type="text"
                placeholder="Categoria (ex: Roupas, Higiene…)"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                className="input-field"
              />
              {hasPassengers && activePassenger !== 'geral' && (
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-muted)' }}>
                  ✓ Será adicionado à lista de <strong>{activePassenger}</strong>
                </p>
              )}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleAdd} className="btn-primary">Adicionar</button>
                <button
                  onClick={() => { setShowForm(false); setNewItem(''); setNewCategory(''); }}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* No passengers hint */}
        {!hasPassengers && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 16px', marginBottom: '20px',
            background: 'var(--blue-xlight)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--blue-light)',
          }}>
            <span style={{ fontSize: '18px' }}>💡</span>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.5 }}>
              Configure os membros da família em <strong>Família</strong> para habilitar checklists individuais por passageiro.
            </p>
          </div>
        )}

        {/* Checklist items grouped by category */}
        {grouped.length > 0 ? (
          grouped.map((group) => {
            const groupChecked = group.items.filter((i) => i.checked).length;
            return (
              <div key={group.category} className="card" style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>
                    {group.category}
                  </h2>
                  <span style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>
                    {groupChecked}/{group.items.length}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: item.checked ? '#f0fdf4' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleChecklistItem('suitcaseItems', item.id)}
                        style={{ width: '18px', height: '18px', accentColor: 'var(--green)', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <span
                        style={{
                          fontSize: '14px',
                          color: item.checked ? 'var(--ink-subtle)' : 'var(--ink)',
                          textDecoration: item.checked ? 'line-through' : 'none',
                          flex: 1,
                          lineHeight: 1.4,
                        }}
                      >
                        {item.name}
                      </span>
                      <button
                        onClick={() => deleteChecklistItem('suitcaseItems', item.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--ink-subtle)',
                          cursor: 'pointer',
                          fontSize: '16px',
                          padding: '4px',
                          opacity: 0.4,
                          flexShrink: 0,
                        }}
                        title="Remover item"
                        aria-label={`Remover ${item.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.3 }}>🧳</div>
            <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: 0 }}>
              {hasPassengers && activePassenger !== 'geral'
                ? `Nenhum item para ${activePassenger}. Clique em "+ Adicionar" para criar a lista personalizada.`
                : 'Nenhum item ainda. Clique em "+ Adicionar" para começar.'}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
