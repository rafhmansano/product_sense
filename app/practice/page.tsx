'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { PRACTICE_QUESTIONS } from '@/lib/framework';

export default function PracticePage() {
  const router = useRouter();
  const createExercise = useAppStore((s) => s.createExercise);
  const [mode, setMode] = useState<'select' | 'custom'>('select');
  const [customQuestion, setCustomQuestion] = useState('');
  const [customCompany, setCustomCompany] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [category, setCategory] = useState('Improvement');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('All');
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(PRACTICE_QUESTIONS.map((q) => q.category)))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  const filtered = PRACTICE_QUESTIONS.filter((q) => {
    if (filterDifficulty !== 'All' && q.difficulty !== filterDifficulty) return false;
    if (filterCategory !== 'All' && q.category !== filterCategory) return false;
    return true;
  });

  const difficultyColors: Record<string, string> = {
    Easy: 'var(--sage)',
    Medium: 'var(--copper)',
    Hard: 'var(--rust)',
  };

  const handleSelectQuestion = (questionId: string) => {
    const q = PRACTICE_QUESTIONS.find((q) => q.id === questionId);
    if (!q) return;
    const id = createExercise(q.question, q.difficulty, q.category, q.company, q.tags);
    router.push(`/practice/${id}`);
  };

  const handleCustomSubmit = () => {
    if (!customQuestion.trim()) return;
    const id = createExercise(customQuestion.trim(), difficulty, category, customCompany.trim() || undefined);
    router.push(`/practice/${id}`);
  };

  return (
    <AppShell>
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              color: 'var(--ink-subtle)',
              fontFamily: 'sans-serif',
              marginBottom: '8px',
            }}
          >
            Practice Mode
          </div>
          <h1
            style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--navy)', margin: 0, lineHeight: 1.15 }}
          >
            Choose Your Exercise
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-muted)', marginTop: '12px', fontFamily: 'sans-serif', maxWidth: '520px', lineHeight: 1.6 }}>
            Pick a curated question or enter your own custom scenario. You&apos;ll be guided through all 5 framework steps.
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {(['select', 'custom'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '10px 24px',
                borderRadius: '8px',
                background: mode === m ? 'var(--navy)' : 'white',
                color: mode === m ? 'white' : 'var(--ink-muted)',
                cursor: 'pointer',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                fontWeight: mode === m ? '600' : '400',
                border: mode !== m ? '1px solid var(--border)' : '1px solid transparent',
                transition: 'all 0.15s ease',
              } as React.CSSProperties}
            >
              {m === 'select' ? '⬡ Question Bank' : '◈ Custom Question'}
            </button>
          ))}
        </div>

        {mode === 'select' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <FilterGroup
                label="Difficulty"
                options={difficulties}
                value={filterDifficulty}
                onChange={setFilterDifficulty}
                colors={difficultyColors}
              />
              <FilterGroup
                label="Category"
                options={categories}
                value={filterCategory}
                onChange={setFilterCategory}
              />
            </div>

            {/* Question grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="stagger-children">
              {filtered.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q.id)}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    padding: '24px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  className="card-interactive"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div
                      style={{
                        padding: '2px 10px',
                        borderRadius: '20px',
                        background: `${difficultyColors[q.difficulty]}15`,
                        color: difficultyColors[q.difficulty],
                        fontSize: '11px',
                        fontFamily: 'sans-serif',
                        fontWeight: '600',
                      }}
                    >
                      {q.difficulty}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
                      {q.category}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--navy)',
                      fontFamily: 'sans-serif',
                      fontWeight: '500',
                      lineHeight: 1.5,
                      margin: '0 0 14px',
                    }}
                  >
                    {q.question}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {q.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '2px 8px',
                            borderRadius: '12px',
                            background: 'var(--border)',
                            color: 'var(--ink-muted)',
                            fontSize: '11px',
                            fontFamily: 'sans-serif',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--copper)', fontFamily: 'sans-serif' }}>
                      {q.company}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '48px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
                No questions match your filters.
              </div>
            )}
          </>
        )}

        {mode === 'custom' && (
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '32px',
              maxWidth: '680px',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontFamily: 'sans-serif',
                  color: 'var(--ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                }}
              >
                Your Product Question *
              </label>
              <textarea
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. How would you improve the onboarding experience for Notion?"
                rows={4}
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '15px',
                  fontFamily: 'sans-serif',
                  color: 'var(--ink)',
                  background: 'var(--surface-raised)',
                  outline: 'none',
                  lineHeight: 1.6,
                  transition: 'border-color 0.15s',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--copper)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Company (optional)
                </label>
                <input
                  value={customCompany}
                  onChange={(e) => setCustomCompany(e.target.value)}
                  placeholder="e.g. Notion, Airbnb..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    color: 'var(--ink)',
                    background: 'var(--surface-raised)',
                    outline: 'none',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--copper)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontFamily: 'sans-serif',
                    color: 'var(--ink)',
                    background: 'var(--surface-raised)',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '28px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontFamily: 'sans-serif', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Category
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Improvement', 'Design', 'Metrics', 'Retention', 'Growth', 'Strategy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '6px 14px',
                      border: '1px solid',
                      borderColor: category === cat ? 'var(--navy)' : 'var(--border)',
                      borderRadius: '20px',
                      background: category === cat ? 'var(--navy)' : 'transparent',
                      color: category === cat ? 'white' : 'var(--ink-muted)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontFamily: 'sans-serif',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleCustomSubmit}
              disabled={!customQuestion.trim()}
              style={{
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '10px',
                background: customQuestion.trim() ? 'var(--navy)' : 'var(--border)',
                color: customQuestion.trim() ? 'white' : 'var(--ink-subtle)',
                cursor: customQuestion.trim() ? 'pointer' : 'not-allowed',
                fontSize: '15px',
                fontFamily: 'sans-serif',
                fontWeight: '600',
                transition: 'all 0.15s ease',
              }}
            >
              Start Exercise →
            </button>
          </div>
        )}
      </div>
    </AppShell>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
  colors,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  colors?: Record<string, string>;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>{label}:</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '4px 12px',
            border: '1px solid',
            borderColor: value === opt ? (colors?.[opt] ?? 'var(--navy)') : 'var(--border)',
            borderRadius: '16px',
            background: value === opt ? `${colors?.[opt] ?? 'var(--navy)'}15` : 'white',
            color: value === opt ? (colors?.[opt] ?? 'var(--navy)') : 'var(--ink-muted)',
            cursor: 'pointer',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            fontWeight: value === opt ? '600' : '400',
            transition: 'all 0.15s ease',
          }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
