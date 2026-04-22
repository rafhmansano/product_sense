'use client';

import { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { BudgetCategoryId } from '@/types';
import { DEFAULT_BUDGET_CATEGORIES } from '@/lib/data';

const budgetCategoryMap = Object.fromEntries(
  DEFAULT_BUDGET_CATEGORIES.map((c) => [c.id, c])
) as Record<BudgetCategoryId, (typeof DEFAULT_BUDGET_CATEGORIES)[0]>;

export default function GastosPage() {
  const { expenses, addExpense, updateExpense, deleteExpense, exchangeRate } = useAppStore();

  // Add form state
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [category, setCategory] = useState<BudgetCategoryId>('alimentacao');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [amountError, setAmountError] = useState('');

  // Filter state
  const [filterCategory, setFilterCategory] = useState<BudgetCategoryId | 'all'>('all');

  // Delete confirmation state
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState('');
  const [editCurrency, setEditCurrency] = useState<'USD' | 'BRL'>('USD');
  const [editCategory, setEditCategory] = useState<BudgetCategoryId>('alimentacao');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editAmountError, setEditAmountError] = useState('');

  const runningTotalBRL = useMemo(() => {
    return expenses.reduce((sum, exp) => {
      return sum + (exp.currency === 'BRL' ? exp.amount : exp.amount * exchangeRate);
    }, 0);
  }, [expenses, exchangeRate]);

  const filteredExpenses = useMemo(() => {
    const filtered =
      filterCategory === 'all'
        ? [...expenses]
        : expenses.filter((e) => e.category === filterCategory);
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, filterCategory]);

  const groupedByDate = useMemo(() => {
    const groups: Record<string, typeof filteredExpenses> = {};
    for (const exp of filteredExpenses) {
      if (!groups[exp.date]) groups[exp.date] = [];
      groups[exp.date].push(exp);
    }
    return Object.entries(groups).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [filteredExpenses]);

  function dailyTotalBRL(items: typeof expenses) {
    return items.reduce(
      (sum, e) => sum + (e.currency === 'BRL' ? e.amount : e.amount * exchangeRate),
      0
    );
  }

  function handleAdd() {
    const parsed = parseFloat(amount);
    if (!amount.trim()) { setAmountError('Informe o valor do gasto'); return; }
    if (isNaN(parsed) || parsed <= 0) { setAmountError('O valor deve ser maior que zero'); return; }
    setAmountError('');
    addExpense({
      id: `exp_${Date.now()}`,
      amount: parsed,
      currency,
      category,
      description: description.trim(),
      date,
      budgetCategoryId: category,
    });
    setAmount('');
    setDescription('');
  }

  function handleStartEdit(exp: (typeof expenses)[0]) {
    setEditingId(exp.id);
    setEditAmount(String(exp.amount));
    setEditCurrency(exp.currency);
    setEditCategory(exp.category as BudgetCategoryId);
    setEditDescription(exp.description);
    setEditDate(exp.date);
    setEditAmountError('');
    setConfirmDeleteId(null);
  }

  function handleSaveEdit() {
    const parsed = parseFloat(editAmount);
    if (!editAmount.trim() || isNaN(parsed) || parsed <= 0) {
      setEditAmountError('Valor inválido');
      return;
    }
    updateExpense(editingId!, {
      amount: parsed,
      currency: editCurrency,
      category: editCategory as BudgetCategoryId,
      budgetCategoryId: editCategory,
      description: editDescription.trim(),
      date: editDate,
    });
    setEditingId(null);
  }

  function formatDate(d: string) {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    });
  }

  const inputStyle = {
    padding: '7px 10px',
    border: '1px solid var(--border)',
    borderRadius: '7px',
    fontSize: '13px',
    outline: 'none',
    fontFamily: 'sans-serif',
    background: 'white',
    boxSizing: 'border-box' as const,
  };

  return (
    <AppShell>
      <div
        style={{ padding: '40px 48px', maxWidth: '900px' }}
        className="animate-fade-in"
      >
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--navy)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span style={{ fontSize: '28px' }}>🧾</span> Gastos
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '8px', fontFamily: 'sans-serif' }}>
            Registre e acompanhe todos os gastos da viagem.
          </p>
        </div>

        {/* Running Total */}
        <div
          className="card"
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', fontWeight: '600', marginBottom: '4px' }}>
              Total gasto (convertido em BRL)
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--navy)', letterSpacing: '-0.02em' }}>
              R$ {runningTotalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', textAlign: 'right' }}>
            <div>Taxa: 1 USD = R$ {exchangeRate.toFixed(2)}</div>
            <div style={{ marginTop: '4px' }}>{expenses.length} registro{expenses.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* Add Form */}
        <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '20px', fontFamily: 'sans-serif' }}>
            Adicionar gasto
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '12px', marginBottom: '12px', alignItems: 'end' }}>
            {/* Amount */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '6px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor</label>
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setAmountError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                style={{ width: '100%', padding: '10px 12px', border: `1px solid ${amountError ? '#dc2626' : 'var(--border)'}`, borderRadius: '8px', fontSize: '15px', fontWeight: '600', outline: 'none', boxSizing: 'border-box' }}
              />
              {amountError && <span style={{ fontSize: '12px', color: '#dc2626', marginTop: '4px', display: 'block', fontFamily: 'sans-serif' }}>{amountError}</span>}
            </div>

            {/* Currency Toggle */}
            <div>
              <div style={{ display: 'flex', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                {(['USD', 'BRL'] as const).map((c) => (
                  <button key={c} onClick={() => setCurrency(c)} style={{ padding: '10px 16px', fontSize: '13px', fontWeight: '700', border: 'none', borderLeft: c === 'BRL' ? '1px solid var(--border)' : 'none', cursor: 'pointer', fontFamily: 'sans-serif', background: currency === c ? '#1B3A6B' : 'white', color: currency === c ? 'white' : 'var(--ink-muted)', transition: 'all 0.15s' }}>{c}</button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '6px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoria</label>
              <select className="input-field" value={category} onChange={(e) => setCategory(e.target.value as BudgetCategoryId)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white', fontFamily: 'sans-serif', boxSizing: 'border-box' }}>
                {DEFAULT_BUDGET_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '6px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</label>
              <input className="input-field" type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '6px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição</label>
            <input className="input-field" type="text" placeholder="Ex: Almoco no Magic Kingdom" value={description} onChange={(e) => setDescription(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box' }} />
          </div>

          {/* Confirm Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handleAdd} style={{ padding: '12px 36px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
              ✓ Confirmar gasto
            </button>
          </div>
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Filtrar:</span>
          <select className="input-field" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as BudgetCategoryId | 'all')} style={{ padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '13px', outline: 'none', background: 'white', fontFamily: 'sans-serif' }}>
            <option value="all">Todas as categorias</option>
            {DEFAULT_BUDGET_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
            ))}
          </select>
        </div>

        {/* Expense List */}
        {groupedByDate.length === 0 && (
          <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>💸</div>
            <div style={{ fontSize: '15px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Nenhum gasto registrado ainda. Adicione o primeiro acima!</div>
          </div>
        )}

        {groupedByDate.map(([dateKey, items]) => {
          const dayTotal = dailyTotalBRL(items);
          return (
            <div key={dateKey} style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', padding: '0 4px' }}>
                <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--navy)', fontFamily: 'sans-serif', textTransform: 'capitalize' }}>{formatDate(dateKey)}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Total: R$ {dayTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
              </div>

              <div className="card" style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', overflow: 'hidden' }}>
                {items.map((exp, idx) => {
                  const cat = budgetCategoryMap[exp.category as BudgetCategoryId];
                  const isEditing = editingId === exp.id;
                  const isConfirming = confirmDeleteId === exp.id;
                  const borderBottom = idx < items.length - 1 ? '1px solid var(--border)' : 'none';

                  if (isEditing) {
                    return (
                      <div key={exp.id} style={{ padding: '16px 20px', borderBottom, background: '#F8FAFF' }}>
                        {/* Edit row - grid of fields */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr 1fr', gap: '10px', marginBottom: '10px', alignItems: 'end' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '4px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Valor</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={editAmount}
                              onChange={(e) => { setEditAmount(e.target.value); setEditAmountError(''); }}
                              autoFocus
                              style={{ ...inputStyle, width: '100%', fontWeight: '600', border: `1px solid ${editAmountError ? '#dc2626' : 'var(--border)'}` }}
                            />
                            {editAmountError && <span style={{ fontSize: '11px', color: '#dc2626', fontFamily: 'sans-serif' }}>{editAmountError}</span>}
                          </div>

                          <div>
                            <div style={{ display: 'flex', borderRadius: '7px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                              {(['USD', 'BRL'] as const).map((c) => (
                                <button key={c} onClick={() => setEditCurrency(c)} style={{ padding: '7px 12px', fontSize: '12px', fontWeight: '700', border: 'none', borderLeft: c === 'BRL' ? '1px solid var(--border)' : 'none', cursor: 'pointer', fontFamily: 'sans-serif', background: editCurrency === c ? '#1B3A6B' : 'white', color: editCurrency === c ? 'white' : 'var(--ink-muted)' }}>{c}</button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '4px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categoria</label>
                            <select value={editCategory} onChange={(e) => setEditCategory(e.target.value as BudgetCategoryId)} style={{ ...inputStyle, width: '100%' }}>
                              {DEFAULT_BUDGET_CATEGORIES.map((c) => (
                                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '4px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Data</label>
                            <input type="date" value={editDate} onChange={(e) => setEditDate(e.target.value)} style={{ ...inputStyle, width: '100%' }} />
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--ink-muted)', marginBottom: '4px', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Descrição</label>
                            <input
                              type="text"
                              placeholder="Descrição"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                              style={{ ...inputStyle, width: '100%' }}
                            />
                          </div>
                          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-end' }}>
                            <button
                              onClick={handleSaveEdit}
                              style={{ padding: '7px 18px', background: '#1B3A6B', color: 'white', border: 'none', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}
                            >
                              ✓ Salvar
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              style={{ padding: '7px 14px', background: 'transparent', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '7px', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif' }}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={exp.id}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom, transition: 'background 0.15s', background: isConfirming ? '#FFF7F7' : undefined }}
                      onMouseEnter={(e) => { if (!isConfirming) e.currentTarget.style.background = 'rgba(0,0,0,0.015)'; }}
                      onMouseLeave={(e) => { if (!isConfirming) e.currentTarget.style.background = 'transparent'; }}
                    >
                      {/* Expense info */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: 0 }}>
                        <div style={{ minWidth: '100px', fontSize: '15px', fontWeight: '700', color: 'var(--navy)', fontFamily: 'sans-serif' }}>
                          {exp.currency === 'BRL' ? 'R$' : '$'}{' '}
                          {exp.amount.toLocaleString(exp.currency === 'BRL' ? 'pt-BR' : 'en-US', { minimumFractionDigits: 2 })}
                          <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--ink-subtle)', marginLeft: '4px' }}>{exp.currency}</span>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--ink-muted)', background: 'var(--border)', padding: '3px 10px', borderRadius: '9999px', fontFamily: 'sans-serif', whiteSpace: 'nowrap' }}>
                          {cat ? `${cat.icon} ${cat.name}` : exp.category}
                        </div>
                        {exp.description && (
                          <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {exp.description}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      {isConfirming ? (
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px', flexShrink: 0 }}>
                          <span style={{ fontSize: '12px', color: '#EF4444', fontFamily: 'sans-serif', alignSelf: 'center', fontWeight: '600' }}>Excluir?</span>
                          <button onClick={() => { deleteExpense(exp.id); setConfirmDeleteId(null); }} style={{ padding: '6px 14px', background: '#EF4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif' }}>Sim</button>
                          <button onClick={() => setConfirmDeleteId(null)} style={{ padding: '6px 14px', background: 'transparent', color: 'var(--ink-muted)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif' }}>Cancelar</button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '12px', flexShrink: 0 }}>
                          <button
                            onClick={() => handleStartEdit(exp)}
                            style={{ padding: '6px 14px', background: 'transparent', color: 'var(--navy)', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#F0F4FF'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(exp.id)}
                            style={{ padding: '6px 14px', background: 'transparent', color: '#EF4444', border: '1px solid #FCA5A5', borderRadius: '8px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', fontFamily: 'sans-serif', transition: 'all 0.15s' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#FEF2F2'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
