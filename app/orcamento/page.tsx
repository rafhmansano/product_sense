'use client';

import { useState, useMemo } from 'react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { BudgetCategory, BudgetCategoryId } from '@/types';

export default function OrcamentoPage() {
  const {
    budgetCategories,
    updateBudgetCategory,
    expenses,
    exchangeRate,
    setExchangeRate,
  } = useAppStore();

  const [editingRate, setEditingRate] = useState(false);
  const [rateValue, setRateValue] = useState(String(exchangeRate));
  const [editingCell, setEditingCell] = useState<{
    id: BudgetCategoryId;
    field: 'plannedBRL' | 'plannedUSD';
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Calculate spent per budget category (normalized to BRL)
  const spentByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    for (const exp of expenses) {
      const catId = exp.budgetCategoryId;
      const amountBRL =
        exp.currency === 'BRL' ? exp.amount : exp.amount * exchangeRate;
      map[catId] = (map[catId] || 0) + amountBRL;
    }
    return map;
  }, [expenses, exchangeRate]);

  const totalPlannedBRL = budgetCategories.reduce(
    (sum, c) => sum + c.plannedBRL,
    0
  );
  const totalPlannedUSD = budgetCategories.reduce(
    (sum, c) => sum + c.plannedUSD,
    0
  );
  const totalSpentBRL = Object.values(spentByCategory).reduce(
    (sum, v) => sum + v,
    0
  );
  const totalPlannedAll = totalPlannedBRL + totalPlannedUSD * exchangeRate;

  function handleRateSave() {
    const parsed = parseFloat(rateValue);
    if (!isNaN(parsed) && parsed > 0) {
      setExchangeRate(parsed);
    }
    setEditingRate(false);
  }

  function handleCellEdit(id: BudgetCategoryId, field: 'plannedBRL' | 'plannedUSD', current: number) {
    setEditingCell({ id, field });
    setEditValue(String(current));
  }

  function handleCellSave() {
    if (!editingCell) return;
    const parsed = parseFloat(editValue);
    if (!isNaN(parsed) && parsed >= 0) {
      updateBudgetCategory(editingCell.id, { [editingCell.field]: parsed });
    }
    setEditingCell(null);
  }

  function getProgressColor(percent: number): string {
    if (percent > 100) return '#EF4444';
    if (percent >= 80) return '#EAB308';
    return '#22C55E';
  }

  // Donut chart SVG
  function DonutChart() {
    const spentPercent =
      totalPlannedAll > 0
        ? Math.min((totalSpentBRL / totalPlannedAll) * 100, 100)
        : 0;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDash = (spentPercent / 100) * circumference;
    const color = getProgressColor(
      totalPlannedAll > 0 ? (totalSpentBRL / totalPlannedAll) * 100 : 0
    );

    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth="12"
          />
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${strokeDash} ${circumference}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
          <text
            x="70"
            y="66"
            textAnchor="middle"
            style={{ fontSize: '20px', fontWeight: '700', fill: 'var(--navy)' }}
          >
            {spentPercent.toFixed(0)}%
          </text>
          <text
            x="70"
            y="84"
            textAnchor="middle"
            style={{ fontSize: '11px', fill: 'var(--ink-muted)' }}
          >
            utilizado
          </text>
        </svg>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
            Gasto: <strong style={{ color: 'var(--navy)' }}>R$ {totalSpentBRL.toFixed(2)}</strong>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
            Planejado: <strong style={{ color: 'var(--navy)' }}>R$ {totalPlannedAll.toFixed(2)}</strong>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
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
            <span style={{ fontSize: '28px' }}>💰</span> Orçamento
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: 'var(--ink-muted)',
              marginTop: '8px',
              fontFamily: 'sans-serif',
            }}
          >
            Planejamento e acompanhamento do orcamento da viagem.
          </p>
        </div>

        {/* Top row: Exchange Rate + Donut */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px',
            marginBottom: '32px',
          }}
        >
          {/* Exchange Rate Card */}
          <div className="card" style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--navy)', marginBottom: '16px', fontFamily: 'sans-serif' }}>
              Taxa de Cambio (USD → BRL)
            </div>
            {editingRate ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>1 USD =</span>
                <input
                  className="input-field"
                  type="number"
                  step="0.01"
                  value={rateValue}
                  onChange={(e) => setRateValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRateSave()}
                  autoFocus
                  style={{
                    width: '100px',
                    padding: '8px 12px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    outline: 'none',
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>BRL</span>
                <button
                  className="btn-primary"
                  onClick={handleRateSave}
                  style={{
                    padding: '8px 16px',
                    background: 'var(--navy)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Salvar
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setEditingRate(false)}
                  style={{
                    padding: '8px 16px',
                    background: 'white',
                    color: 'var(--navy)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                onClick={() => {
                  setRateValue(String(exchangeRate));
                  setEditingRate(true);
                }}
              >
                <div
                  style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: 'var(--navy)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  1 USD = R$ {exchangeRate.toFixed(2)}
                </div>
                <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
                  (clique para editar)
                </span>
              </div>
            )}
          </div>

          {/* Donut Summary Card */}
          <div className="card" style={{
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            padding: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <DonutChart />
          </div>
        </div>

        {/* Budget Categories Table */}
        <div className="card" style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', marginBottom: '20px', fontFamily: 'sans-serif' }}>
            Categorias do Orçamento
          </div>

          {/* Table Header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
              gap: '12px',
              padding: '10px 16px',
              borderBottom: '2px solid var(--border)',
              marginBottom: '4px',
            }}
          >
            {['Categoria', 'Planejado (BRL)', 'Planejado (USD)', 'Gasto (BRL)', 'Progresso'].map(
              (header) => (
                <div
                  key={header}
                  style={{
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: 'var(--ink-subtle)',
                    fontFamily: 'sans-serif',
                    fontWeight: '600',
                  }}
                >
                  {header}
                </div>
              )
            )}
          </div>

          {/* Rows */}
          {budgetCategories.map((cat) => {
            const spent = spentByCategory[cat.id] || 0;
            const totalPlanned = cat.plannedBRL + cat.plannedUSD * exchangeRate;
            const percent = totalPlanned > 0 ? (spent / totalPlanned) * 100 : 0;
            const barColor = getProgressColor(percent);

            return (
              <div
                key={cat.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
                  gap: '12px',
                  padding: '12px 16px',
                  borderBottom: '1px solid var(--border)',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = 'rgba(0,0,0,0.015)')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = 'transparent')
                }
              >
                {/* Category Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '18px' }}>{cat.icon}</span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'var(--navy)',
                      fontFamily: 'sans-serif',
                    }}
                  >
                    {cat.name}
                  </span>
                </div>

                {/* Planned BRL */}
                <div>
                  {editingCell?.id === cat.id &&
                  editingCell?.field === 'plannedBRL' ? (
                    <input
                      className="input-field"
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellSave()}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--ink)',
                        fontFamily: 'sans-serif',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid transparent',
                      }}
                      onClick={() => handleCellEdit(cat.id, 'plannedBRL', cat.plannedBRL)}
                      title="Clique para editar"
                    >
                      R$ {cat.plannedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {/* Planned USD */}
                <div>
                  {editingCell?.id === cat.id &&
                  editingCell?.field === 'plannedUSD' ? (
                    <input
                      className="input-field"
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={handleCellSave}
                      onKeyDown={(e) => e.key === 'Enter' && handleCellSave()}
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '4px 8px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        fontSize: '13px',
                        outline: 'none',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '13px',
                        color: 'var(--ink)',
                        fontFamily: 'sans-serif',
                        cursor: 'pointer',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid transparent',
                      }}
                      onClick={() => handleCellEdit(cat.id, 'plannedUSD', cat.plannedUSD)}
                      title="Clique para editar"
                    >
                      $ {cat.plannedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  )}
                </div>

                {/* Spent */}
                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: percent > 100 ? '#EF4444' : 'var(--ink)',
                    fontFamily: 'sans-serif',
                  }}
                >
                  R$ {spent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>

                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      flex: 1,
                      height: '8px',
                      background: 'var(--border)',
                      borderRadius: '9999px',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(percent, 100)}%`,
                        background: barColor,
                        borderRadius: '9999px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: barColor,
                      fontFamily: 'sans-serif',
                      minWidth: '42px',
                      textAlign: 'right',
                    }}
                  >
                    {percent.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}

          {/* Total Row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 2fr',
              gap: '12px',
              padding: '14px 16px',
              background: 'rgba(0,0,0,0.02)',
              borderRadius: '0 0 8px 8px',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--navy)',
                fontFamily: 'sans-serif',
              }}
            >
              Total
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--navy)',
                fontFamily: 'sans-serif',
              }}
            >
              R$ {totalPlannedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--navy)',
                fontFamily: 'sans-serif',
              }}
            >
              $ {totalPlannedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '700',
                color: totalSpentBRL > totalPlannedAll ? '#EF4444' : 'var(--navy)',
                fontFamily: 'sans-serif',
              }}
            >
              R$ {totalSpentBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: getProgressColor(
                  totalPlannedAll > 0 ? (totalSpentBRL / totalPlannedAll) * 100 : 0
                ),
                fontFamily: 'sans-serif',
                textAlign: 'right',
                paddingRight: '4px',
              }}
            >
              {totalPlannedAll > 0
                ? `${((totalSpentBRL / totalPlannedAll) * 100).toFixed(0)}% do total`
                : '0%'}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
