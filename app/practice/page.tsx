'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, BookOpen } from 'lucide-react';
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
      <div className="page-content animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-label">Practice Mode</div>
          <h1
            style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.04em', color: 'var(--navy)', margin: 0, lineHeight: 1.12 }}
          >
            Choose Your Exercise
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-muted)', marginTop: '14px', maxWidth: '520px', lineHeight: 1.65 }}>
            Pick a curated question or enter your own custom scenario. You&apos;ll be guided through all 5 framework steps.
          </p>
        </div>

        {/* Mode toggle */}
        <div
          style={{
            display: 'flex',
            gap: '4px',
            marginBottom: '32px',
            padding: '4px',
            background: 'white',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            width: 'fit-content',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          {(['select', 'custom'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '9px 22px',
                borderRadius: '9px',
                background: mode === m ? 'var(--gradient-navy)' : 'transparent',
                color: mode === m ? 'white' : 'var(--ink-muted)',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: mode === m ? '600' : '400',
                border: 'none',
                transition: 'all 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                boxShadow: mode === m ? 'var(--shadow-navy)' : 'none',
              } as React.CSSProperties}
            >
              {m === 'select' ? <BookOpen size={14} /> : <Zap size={14} />}
              {m === 'select' ? 'Question Bank' : 'Custom Question'}
            </button>
          ))}
        </div>

        {mode === 'select' && (
          <>
            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <FilterGroup
                label="Difficulty"
                options={difficulties}
                value={filterDifficulty}
                onChange={setFilterDifficulty}
                colors={difficultyColors}
              />
              <div style={{ width: '1px', height: '20px', background: 'var(--border)' }} />
              <FilterGroup
                label="Category"
                options={categories}
                value={filterCategory}
                onChange={setFilterCategory}
              />
            </div>

            {/* Question grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} className="stagger-children">
              {filtered.map((q) => (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q.id)}
                  style={{
                    background: 'white',
                    border: '1px solid var(--border)',
                    borderRadius: '14px',
                    padding: '22px 24px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                  className="card-interactive"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-strong)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div
                      className="badge-pill"
                      style={{ background: `${difficultyColors[q.difficulty]}15`, color: difficultyColors[q.difficulty], border: `1px solid ${difficultyColors[q.difficulty]}25` }}
                    >
                      {q.difficulty}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontWeight: '500' }}>
                      {q.category}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: '15px',
                      color: 'var(--navy)',
                      fontWeight: '500',
                      lineHeight: 1.55,
                      margin: '0 0 16px',
                    }}
                  >
                    {q.question}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {q.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            padding: '2px 9px',
                            borderRadius: '12px',
                            background: 'var(--surface-raised)',
                            border: '1px solid var(--border)',
                            color: 'var(--ink-muted)',
                            fontSize: '11px',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--copper)', fontWeight: '600' }}>
                      {q.company}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {filtered.length === 0 && (
              <div style={{ textAlign: 'center', padding: '64px', color: 'var(--ink-muted)' }}>
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
              borderRadius: '16px',
              padding: '36px',
              maxWidth: '680px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '11px',
                  color: 'var(--ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  fontWeight: '600',
                  marginBottom: '10px',
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
                  borderRadius: '10px',
                  fontSize: '15px',
                  color: 'var(--ink)',
                  background: 'var(--surface-raised)',
                  outline: 'none',
                  lineHeight: 1.65,
                  transition: 'border-color 0.15s, box-shadow 0.15s',
                  fontFamily: 'var(--font-sans)',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--copper)';
                  e.target.style.boxShadow = '0 0 0 3px var(--copper-glow)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600', marginBottom: '10px' }}>
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
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: 'var(--ink)',
                    background: 'var(--surface-raised)',
                    outline: 'none',
                    fontFamily: 'var(--font-sans)',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--copper)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600', marginBottom: '10px' }}>
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    fontSize: '14px',
                    color: 'var(--ink)',
                    background: 'var(--surface-raised)',
                    outline: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-sans)',
                  }}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600', marginBottom: '10px' }}>
                Category
              </label>
              <div style={{ display: 'flex', gap: '7px', flexWrap: 'wrap' }}>
                {['Improvement', 'Design', 'Metrics', 'Retention', 'Growth', 'Strategy'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    style={{
                      padding: '6px 16px',
                      border: '1px solid',
                      borderColor: category === cat ? 'var(--navy)' : 'var(--border)',
                      borderRadius: '20px',
                      background: category === cat ? 'var(--gradient-navy)' : 'transparent',
                      color: category === cat ? 'white' : 'var(--ink-muted)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      fontWeight: category === cat ? '600' : '400',
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
              className={customQuestion.trim() ? 'btn-primary' : ''}
              style={!customQuestion.trim() ? {
                width: '100%',
                padding: '14px',
                border: 'none',
                borderRadius: '10px',
                background: 'var(--border)',
                color: 'var(--ink-subtle)',
                cursor: 'not-allowed',
                fontSize: '15px',
                fontWeight: '600',
                fontFamily: 'var(--font-sans)',
              } : {
                width: '100%',
                padding: '14px',
                justifyContent: 'center',
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontWeight: '500' }}>{label}:</span>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          style={{
            padding: '4px 12px',
            border: '1px solid',
            borderColor: value === opt ? (colors?.[opt] ?? 'var(--navy)') : 'var(--border)',
            borderRadius: '16px',
            background: value === opt ? `${colors?.[opt] ?? 'var(--navy)'}12` : 'white',
            color: value === opt ? (colors?.[opt] ?? 'var(--navy)') : 'var(--ink-muted)',
            cursor: 'pointer',
            fontSize: '12px',
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
