'use client';

import { useState } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { RESTAURANTS, SUPERMARKETS, FOOD_TIPS, SUPERMARKET_ESSENTIALS } from '@/lib/data';
import type { CustomRestaurant, FoodItem } from '@/types';

export default function AlimentacaoPage() {
  const customRestaurants = useAppStore((s) => s.customRestaurants);
  const addRestaurant = useAppStore((s) => s.addRestaurant);
  const deleteRestaurant = useAppStore((s) => s.deleteRestaurant);
  const foodItems = useAppStore((s) => s.foodItems);
  const addFoodItem = useAppStore((s) => s.addFoodItem);
  const deleteFoodItem = useAppStore((s) => s.deleteFoodItem);
  const toggleFoodItem = useAppStore((s) => s.toggleFoodItem);

  const [showRestForm, setShowRestForm] = useState(false);
  const [restForm, setRestForm] = useState({ name: '', location: '', parkOrArea: '', internalLocation: '', highlight: '', kidFriendly: true });

  const [showFoodForm, setShowFoodForm] = useState(false);
  const [foodForm, setFoodForm] = useState({ name: '', category: 'parque-snack' as FoodItem['category'], notes: '' });

  function handleAddRestaurant() {
    if (!restForm.name.trim()) return;
    const r: CustomRestaurant = {
      id: `rest-${Date.now()}`,
      ...restForm,
    };
    addRestaurant(r);
    setRestForm({ name: '', location: '', parkOrArea: '', internalLocation: '', highlight: '', kidFriendly: true });
    setShowRestForm(false);
  }

  function handleAddFood() {
    if (!foodForm.name.trim()) return;
    const item: FoodItem = {
      id: `food-${Date.now()}`,
      name: foodForm.name.trim(),
      category: foodForm.category,
      notes: foodForm.notes.trim(),
      checked: false,
    };
    addFoodItem(item);
    setFoodForm({ name: '', category: 'parque-snack', notes: '' });
    setShowFoodForm(false);
  }

  const foodCategories: Record<string, string> = {
    'parque-snack': 'Comida no Parque',
    'mercado': 'Comprar no Mercado',
    'farmacia': 'Comprar na Farmacia',
    'outro': 'Outros',
  };

  return (
    <AppShell>
      <div style={{ padding: '52px 56px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: '700', letterSpacing: '-0.025em', color: 'var(--ink)', margin: '0 0 6px' }}>
            Alimentação
          </h1>
          <p style={{ fontSize: '17px', color: 'var(--ink-muted)', margin: 0 }}>
            Restaurantes, comidas nos parques, supermercados e dicas para economizar.
          </p>
        </div>

        {/* === CUSTOM RESTAURANTS (user added) === */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>
              Meus Restaurantes
            </h2>
            <button
              onClick={() => setShowRestForm(!showRestForm)}
              style={{ padding: '6px 14px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              + Adicionar
            </button>
          </div>

          {showRestForm && (
            <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '10px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="input-field" placeholder="Nome do restaurante *" value={restForm.name} onChange={(e) => setRestForm({ ...restForm, name: e.target.value })} autoFocus />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input className="input-field" placeholder="Parque / Area (ex: Magic Kingdom)" value={restForm.parkOrArea} onChange={(e) => setRestForm({ ...restForm, parkOrArea: e.target.value })} />
                <input className="input-field" placeholder="Localizacao interna (ex: Adventureland)" value={restForm.internalLocation} onChange={(e) => setRestForm({ ...restForm, internalLocation: e.target.value })} />
              </div>
              <input className="input-field" placeholder="Localizacao geral (ex: Disney Springs)" value={restForm.location} onChange={(e) => setRestForm({ ...restForm, location: e.target.value })} />
              <input className="input-field" placeholder="Destaque / observacao" value={restForm.highlight} onChange={(e) => setRestForm({ ...restForm, highlight: e.target.value })} />
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--ink)' }}>
                <input type="checkbox" checked={restForm.kidFriendly} onChange={(e) => setRestForm({ ...restForm, kidFriendly: e.target.checked })} style={{ width: '16px', height: '16px' }} />
                Kid-friendly
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleAddRestaurant} style={{ padding: '8px 20px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Salvar
                </button>
                <button onClick={() => setShowRestForm(false)} style={{ padding: '8px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {customRestaurants.length === 0 && !showRestForm ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)', fontSize: '14px' }}>
              Nenhum restaurante adicionado. Clique em "+ Adicionar" para registrar restaurantes e comidas que voce quer experimentar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {customRestaurants.map((r) => (
                <div key={r.id} style={{ padding: '14px 16px', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ fontSize: '22px', flexShrink: 0 }}>🍴</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink)' }}>
                      {r.name}
                      {r.kidFriendly && <span style={{ color: 'var(--green)', marginLeft: '6px', fontSize: '12px' }}> Kids ✓</span>}
                    </div>
                    {(r.parkOrArea || r.internalLocation) && (
                      <div style={{ fontSize: '12px', color: 'var(--sky-dark)', marginTop: '2px' }}>
                        {[r.parkOrArea, r.internalLocation].filter(Boolean).join(' > ')}
                      </div>
                    )}
                    {r.location && (
                      <div style={{ fontSize: '12px', color: 'var(--ink-subtle)', marginTop: '2px' }}>
                        {r.location}
                      </div>
                    )}
                    {r.highlight && (
                      <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px' }}>
                        {r.highlight}
                      </div>
                    )}
                  </div>
                  <button onClick={() => deleteRestaurant(r.id)} style={{ background: 'none', border: 'none', color: 'var(--ink-subtle)', cursor: 'pointer', fontSize: '16px', padding: '4px', opacity: 0.4, flexShrink: 0 }} title="Remover">
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === FOOD ITEMS (user added) === */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>
              Minha Lista de Comidas
            </h2>
            <button
              onClick={() => setShowFoodForm(!showFoodForm)}
              style={{ padding: '6px 14px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
            >
              + Adicionar
            </button>
          </div>

          {showFoodForm && (
            <div style={{ padding: '16px', background: 'var(--background)', borderRadius: '10px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input className="input-field" placeholder="Nome do item *" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} autoFocus />
              <select className="input-field" value={foodForm.category} onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value as FoodItem['category'] })}>
                <option value="parque-snack">Comida no Parque</option>
                <option value="mercado">Comprar no Mercado</option>
                <option value="farmacia">Comprar na Farmacia</option>
                <option value="outro">Outros</option>
              </select>
              <input className="input-field" placeholder="Observacoes (opcional)" value={foodForm.notes} onChange={(e) => setFoodForm({ ...foodForm, notes: e.target.value })} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handleAddFood} style={{ padding: '8px 20px', background: 'var(--ocean)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
                  Salvar
                </button>
                <button onClick={() => setShowFoodForm(false)} style={{ padding: '8px 20px', background: 'white', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {foodItems.length === 0 && !showFoodForm ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--ink-muted)', fontSize: '14px' }}>
              Nenhum item adicionado. Adicione comidas para experimentar nos parques ou itens para comprar.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(foodCategories).map(([catKey, catLabel]) => {
                const catItems = foodItems.filter((f) => f.category === catKey);
                if (catItems.length === 0) return null;
                return (
                  <div key={catKey}>
                    <h3 style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--ink-subtle)', margin: '0 0 8px' }}>
                      {catLabel}
                    </h3>
                    {catItems.map((item) => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', background: item.checked ? '#f0fdf4' : 'transparent' }}>
                        <input type="checkbox" checked={item.checked} onChange={() => toggleFoodItem(item.id)} style={{ width: '18px', height: '18px', accentColor: 'var(--green)', cursor: 'pointer', flexShrink: 0 }} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '14px', color: item.checked ? 'var(--ink-subtle)' : 'var(--ink)', textDecoration: item.checked ? 'line-through' : 'none' }}>
                            {item.name}
                          </span>
                          {item.notes && (
                            <div style={{ fontSize: '12px', color: 'var(--ink-subtle)', marginTop: '2px' }}>
                              {item.notes}
                            </div>
                          )}
                        </div>
                        <button onClick={() => deleteFoodItem(item.id)} style={{ background: 'none', border: 'none', color: 'var(--ink-subtle)', cursor: 'pointer', fontSize: '16px', padding: '4px', opacity: 0.4, flexShrink: 0 }} title="Remover">
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* === SUGGESTED RESTAURANTS (read-only) === */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px' }}>
            Restaurantes Recomendados
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>Restaurante</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>Localizacao</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>Destaque</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>Kids</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)' }}>Mapa</th>
                </tr>
              </thead>
              <tbody>
                {RESTAURANTS.map((r, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: 'var(--ink)' }}>{r.name}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--ink-muted)' }}>{r.location}</td>
                    <td style={{ padding: '12px', fontSize: '13px', color: 'var(--ink)' }}>{r.highlight}</td>
                    <td style={{ padding: '12px', textAlign: 'center', fontSize: '16px' }}>
                      {r.kidFriendly ? <span style={{ color: '#16a34a' }}>&#10003;</span> : <span style={{ color: 'var(--red)' }}>&#10007;</span>}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      {r.mapsUrl && (
                        <a
                          href={r.mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--blue)', textDecoration: 'none', fontSize: '13px', fontWeight: '500', whiteSpace: 'nowrap' }}
                        >
                          🗺️ Ver
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supermercados */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px' }}>
            Supermercados em Orlando
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SUPERMARKETS.map((s, idx) => (
              <div key={idx} style={{ padding: '16px 20px', border: '1px solid var(--border)', borderRadius: '10px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px', flexShrink: 0 }}>🛒</span>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--ink)' }}>{s.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginTop: '4px', lineHeight: 1.5 }}>{s.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dicas */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 20px' }}>
            Dicas de Alimentacao nos Parques
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FOOD_TIPS.map((tip, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 16px', background: '#fefce8', borderRadius: '10px', border: '1px solid #fef08a' }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
                <span style={{ fontSize: '14px', color: 'var(--ink)', lineHeight: 1.5 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
