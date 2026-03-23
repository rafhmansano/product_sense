'use client';

import { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import {
  ExpenseCategoryId,
  EXPENSE_CATEGORY_LABELS,
  EXPENSE_TO_BUDGET,
} from '@/types';

const categoryOptions = Object.entries(EXPENSE_CATEGORY_LABELS) as [
  ExpenseCategoryId,
  string,
][];

export default function GastosPage() {
  const { expenses, addExpense, deleteExpense, exchangeRate } = useAppStore();

  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'BRL'>('USD');
  const [category, setCategory] = useState<ExpenseCategoryId>('comida-almoco');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [filterCategory, setFilterCategory] = useState<
    ExpenseCategoryId | 'all'
  >('all');

  // Running total in BRL
  const runningTotalBRL = useMemo(() => {
    return expenses.reduce((sum, exp) => {
      return (
        sum +
        (exp.currency === 'BRL' ? exp.amount : exp.amount * exchangeRate)
      );
    }, 0);
  }, [expenses, exchangeRate]);

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    const filtered =
      filterCategory === 'all'
        ? [...expenses]
        : expenses.filter((e) => e.category === filterCategory);
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [expenses, filterCategory]);

  // Group by date
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

  // Daily totals in BRL
  function dailyTotalBRL(items: typeof expenses) {
    return items.reduce(
      (sum, e) =>
        sum + (e.currency === 'BRL' ? e.amount : e.amount * exchangeRate),
      0
    );
  }

  function handleAdd() {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return;

    addExpense({
      id: `exp_${Date.now()}`,
      amount: parsed,
      currency,
      category,
      description: description.trim(),
      date,
      budgetCategoryId: EXPENSE_TO_BUDGET[category],
    });

    setAmount('');
    setDescription('');
  }

  function formatDate(d: string) {
    const dt = new Date(d + 'T12:00:00');
    return dt.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
    });
  }

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
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-muted)',
              marginTop: '8px',
              fontFamily: 'sans-serif',
            }}
          >
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
            <div
              style={{
                fontSize: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--ink-subtle)',
                fontFamily: 'sans-serif',
                fontWeight: '600',
                marginBottom: '4px',
              }}
            >
              Total gasto (convertido em BRL)
            </div>
            <div
              style={{
                fontSize: '28px',
                fontWeight: '700',
                color: 'var(--navy)',
                letterSpacing: '-0.02em',
              }}
            >
              R$ {runningTotalBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div
            style={{
              fontSize: '13px',
              color: 'var(--ink-muted)',
              fontFamily: 'sans-serif',
              textAlign: 'right',
            }}
          >
            <div>Taxa: 1 USD = R$ {exchangeRate.toFixed(2)}</div>
            <div style={{ marginTop: '4px' }}>
              {expenses.length} registro{expenses.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Quick Add Form */}
        <div
          className="card"
          style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: 'var(--navy)',
              marginBottom: '20px',
              fontFamily: 'sans-serif',
            }}
          >
            Adicionar gasto
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
              alignItems: 'end',
            }}
          >
            {/* Amount */}
            <div>
              <label
                className="label"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--ink-muted)',
                  marginBottom: '6px',
                  fontFamily: 'sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Valor
              </label>
              <input
                className="input-field"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontWeight: '600',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Currency Toggle */}
            <div>
              <div
                style={{
                  display: 'flex',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  border: '1px solid var(--border)',
                }}
              >
                <button
                  onClick={() => setCurrency('USD')}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                    background: currency === 'USD' ? 'var(--navy)' : 'white',
                    color: currency === 'USD' ? 'white' : 'var(--ink-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  USD
                </button>
                <button
                  onClick={() => setCurrency('BRL')}
                  style={{
                    padding: '10px 16px',
                    fontSize: '13px',
                    fontWeight: '700',
                    border: 'none',
                    borderLeft: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                    background: currency === 'BRL' ? 'var(--navy)' : 'white',
                    color: currency === 'BRL' ? 'white' : 'var(--ink-muted)',
                    transition: 'all 0.15s',
                  }}
                >
                  BRL
                </button>
              </div>
            </div>

            {/* Category */}
            <div>
              <label
                className="label"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--ink-muted)',
                  marginBottom: '6px',
                  fontFamily: 'sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Categoria
              </label>
              <select
                className="input-field"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as ExpenseCategoryId)
                }
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  background: 'white',
                  fontFamily: 'sans-serif',
                  boxSizing: 'border-box',
                }}
              >
                {categoryOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label
                className="label"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--ink-muted)',
                  marginBottom: '6px',
                  fontFamily: 'sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Data
              </label>
              <input
                className="input-field"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'sans-serif',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              alignItems: 'end',
            }}
          >
            {/* Description */}
            <div style={{ flex: 1 }}>
              <label
                className="label"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--ink-muted)',
                  marginBottom: '6px',
                  fontFamily: 'sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Descricao
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Ex: Almoco no Magic Kingdom"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  fontFamily: 'sans-serif',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Add Button */}
            <button
              className="btn-primary"
              onClick={handleAdd}
              style={{
                padding: '10px 28px',
                background: 'var(--navy)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'sans-serif',
                whiteSpace: 'nowrap',
              }}
            >
              + Adicionar
            </button>
          </div>
        </div>

        {/* Filter */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--ink-muted)',
              fontFamily: 'sans-serif',
            }}
          >
            Filtrar:
          </span>
          <select
            className="input-field"
            value={filterCategory}
            onChange={(e) =>
              setFilterCategory(e.target.value as ExpenseCategoryId | 'all')
            }
            style={{
              padding: '8px 12px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              outline: 'none',
              background: 'white',
              fontFamily: 'sans-serif',
            }}
          >
            <option value="all">Todas as categorias</option>
            {categoryOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Expense List Grouped by Date */}
        {groupedByDate.length === 0 && (
          <div
            className="card"
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '48px 24px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>💸</div>
            <div
              style={{
                fontSize: '15px',
                color: 'var(--ink-muted)',
                fontFamily: 'sans-serif',
              }}
            >
              Nenhum gasto registrado ainda. Adicione o primeiro acima!
            </div>
          </div>
        )}

        {groupedByDate.map(([dateKey, items]) => {
          const dayTotal = dailyTotalBRL(items);
          return (
            <div key={dateKey} style={{ marginBottom: '24px' }}>
              {/* Date Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                  padding: '0 4px',
                }}
              >
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--navy)',
                    fontFamily: 'sans-serif',
                    textTransform: 'capitalize',
                  }}
                >
                  {formatDate(dateKey)}
                </div>
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'var(--ink-muted)',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Total: R$ {dayTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>

              {/* Expense Items */}
              <div
                className="card"
                style={{
                  background: 'white',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                }}
              >
                {items.map((exp, idx) => (
                  <div
                    key={exp.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom:
                        idx < items.length - 1
                          ? '1px solid var(--border)'
                          : 'none',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = 'transparent')
                    }
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flex: 1,
                      }}
                    >
                      {/* Amount + Currency */}
                      <div
                        style={{
                          minWidth: '100px',
                          fontSize: '15px',
                          fontWeight: '700',
                          color: 'var(--navy)',
                          fontFamily: 'sans-serif',
                        }}
                      >
                        {exp.currency === 'BRL' ? 'R$' : '$'}{' '}
                        {exp.amount.toLocaleString(
                          exp.currency === 'BRL' ? 'pt-BR' : 'en-US',
                          { minimumFractionDigits: 2 }
                        )}
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: 'var(--ink-subtle)',
                            marginLeft: '4px',
                          }}
                        >
                          {exp.currency}
                        </span>
                      </div>

                      {/* Category Label */}
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: 'var(--ink-muted)',
                          background: 'var(--border)',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          fontFamily: 'sans-serif',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {EXPENSE_CATEGORY_LABELS[exp.category]}
                      </div>

                      {/* Description */}
                      {exp.description && (
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'var(--ink-muted)',
                            fontFamily: 'sans-serif',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {exp.description}
                        </div>
                      )}
                    </div>

                    {/* Delete Button */}
                    <button
                      className="btn-danger"
                      onClick={() => deleteExpense(exp.id)}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        color: '#EF4444',
                        border: '1px solid #FCA5A5',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        fontFamily: 'sans-serif',
                        marginLeft: '12px',
                        transition: 'all 0.15s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#FEF2F2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      Excluir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
