'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import type { ChecklistItem } from '@/types';

type ListKey = 'suitcaseItems' | 'backpackItems' | 'pharmacyItems' | 'groceryItems';

export default function ChecklistPage({
  listKey,
  title,
  emoji,
  description,
}: {
  listKey: ListKey;
  title: string;
  emoji: string;
  description: string;
}) {
  const items = useAppStore((s) => s[listKey]);
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const addChecklistItem = useAppStore((s) => s.addChecklistItem);
  const deleteChecklistItem = useAppStore((s) => s.deleteChecklistItem);

  const [newItem, setNewItem] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Group by category
  const categories = Array.from(new Set(items.map((i) => i.category)));
  const grouped = categories.map((cat) => ({
    category: cat,
    items: items.filter((i) => i.category === cat),
  }));

  const totalItems = items.length;
  const checkedItems = items.filter((i) => i.checked).length;
  const pct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  function handleAdd() {
    if (!newItem.trim()) return;
    const item: ChecklistItem = {
      id: `${listKey}-${Date.now()}`,
      name: newItem.trim(),
      checked: false,
      category: newCategory.trim() || 'Outros',
    };
    addChecklistItem(listKey, item);
    setNewItem('');
    setNewCategory('');
    setShowForm(false);
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--ink)', margin: 0, lineHeight: 1.15, display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '32px' }}>{emoji}</span> {title}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '10px', fontFamily: 'sans-serif', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>

      {/* Progress */}
      <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', fontFamily: 'sans-serif' }}>
            {checkedItems} de {totalItems} itens prontos
          </span>
          <span style={{ fontSize: '14px', fontWeight: '700', color: pct === 100 ? 'var(--green)' : 'var(--ocean)', fontFamily: 'sans-serif' }}>
            {pct}%
          </span>
        </div>
        <div style={{ height: '8px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--sky)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
        </div>
      </div>

      {/* Add item button */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary"
          style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
        >
          + Adicionar item
        </button>
      ) : (
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
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
              placeholder="Categoria (opcional)"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="input-field"
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handleAdd} className="btn-primary" style={{ padding: '8px 20px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                Adicionar
              </button>
              <button onClick={() => { setShowForm(false); setNewItem(''); setNewCategory(''); }} className="btn-secondary" style={{ padding: '8px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      {grouped.map((group) => {
        const groupChecked = group.items.filter((i) => i.checked).length;
        return (
          <div key={group.category} className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0, fontFamily: 'sans-serif' }}>
                {group.category}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
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
                    onChange={() => toggleChecklistItem(listKey, item.id)}
                    style={{ width: '18px', height: '18px', accentColor: 'var(--green)', cursor: 'pointer', flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: '14px',
                      color: item.checked ? 'var(--ink-subtle)' : 'var(--ink)',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      fontFamily: 'sans-serif',
                      flex: 1,
                      lineHeight: 1.4,
                    }}
                  >
                    {item.name}
                  </span>
                  <button
                    onClick={() => deleteChecklistItem(listKey, item.id)}
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
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
