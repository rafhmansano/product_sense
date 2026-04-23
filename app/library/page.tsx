'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { FRAMEWORK_STEPS } from '@/lib/framework';
import { Exercise, StepId } from '@/types';

export default function LibraryPage() {
  const { exercises, deleteExercise } = useAppStore();
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'completed' | 'in_progress' | 'draft'>('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = exercises.filter((e) => {
    if (filter !== 'all' && e.status !== filter) return false;
    if (search && !e.question.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all: exercises.length,
    completed: exercises.filter((e) => e.status === 'completed').length,
    in_progress: exercises.filter((e) => e.status === 'in_progress').length,
    draft: exercises.filter((e) => e.status === 'draft').length,
  };

  const difficultyColors: Record<string, string> = {
    Easy: 'var(--sage)',
    Medium: 'var(--copper)',
    Hard: 'var(--rust)',
  };

  return (
    <AppShell>
      <div className="page-content animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-label">Solutions Library</div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.04em', color: 'var(--navy)', margin: 0, lineHeight: 1.12 }}>
            Your Exercise Archive
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-muted)', marginTop: '14px', maxWidth: '520px', lineHeight: 1.65 }}>
            Review your completed frameworks, revisit your thinking, and track improvement over time.
          </p>
        </div>

        {/* Filters + search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <div
            style={{
              display: 'flex',
              gap: '4px',
              padding: '4px',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            {(['all', 'completed', 'in_progress', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '7px 14px',
                  border: 'none',
                  borderRadius: '9px',
                  background: filter === f ? 'var(--gradient-navy)' : 'transparent',
                  color: filter === f ? 'white' : 'var(--ink-muted)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: filter === f ? '600' : '400',
                  transition: 'all 0.18s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: filter === f ? 'var(--shadow-navy)' : 'none',
                }}
              >
                {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                <span
                  style={{
                    padding: '1px 7px',
                    borderRadius: '10px',
                    background: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                    fontSize: '11px',
                    color: filter === f ? 'white' : 'var(--ink-subtle)',
                    fontWeight: '600',
                  }}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-subtle)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions..."
              style={{
                padding: '8px 14px 8px 34px',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'var(--ink)',
                background: 'white',
                outline: 'none',
                width: '240px',
                boxShadow: 'var(--shadow-xs)',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                fontFamily: 'var(--font-sans)',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--copper)';
                e.target.style.boxShadow = '0 0 0 3px var(--copper-glow)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
              }}
            />
          </div>
        </div>

        {/* Exercise list */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '18px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.2 }}>◇</div>
            <h3 style={{ fontSize: '18px', color: 'var(--navy)', fontWeight: '700', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
              {exercises.length === 0 ? 'No exercises yet' : 'No results found'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', marginBottom: '28px' }}>
              {exercises.length === 0
                ? 'Start practicing to build your library of solutions.'
                : 'Try adjusting your search or filter.'}
            </p>
            {exercises.length === 0 && (
              <Link href="/practice" className="btn-primary">
                Start First Exercise
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                isExpanded={expanded === ex.id}
                onToggle={() => setExpanded(expanded === ex.id ? null : ex.id)}
                onContinue={() => router.push(`/practice/${ex.id}`)}
                onDelete={() => {
                  if (confirm('Delete this exercise?')) deleteExercise(ex.id);
                }}
                difficultyColors={difficultyColors}
              />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function ExerciseCard({
  exercise,
  isExpanded,
  onToggle,
  onContinue,
  onDelete,
  difficultyColors,
}: {
  exercise: Exercise;
  isExpanded: boolean;
  onToggle: () => void;
  onContinue: () => void;
  onDelete: () => void;
  difficultyColors: Record<string, string>;
}) {
  const scoreColor =
    exercise.score !== undefined
      ? exercise.score >= 80
        ? 'var(--sage)'
        : exercise.score >= 60
          ? 'var(--copper)'
          : 'var(--rust)'
      : 'var(--ink-subtle)';

  const completedSteps = exercise.steps.filter((s) => s.content.trim().length > 0).length;

  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '14px',
        overflow: 'hidden',
        transition: 'box-shadow 0.18s ease',
        boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-xs)',
      }}
    >
      {/* Card header */}
      <div
        style={{ padding: '20px 24px', cursor: 'pointer' }}
        onClick={onToggle}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <StatusPill status={exercise.status} score={exercise.score} />
              <span
                className="badge-pill"
                style={{ background: `${difficultyColors[exercise.difficulty]}14`, color: difficultyColors[exercise.difficulty], border: `1px solid ${difficultyColors[exercise.difficulty]}22` }}
              >
                {exercise.difficulty}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--ink-subtle)' }}>
                {exercise.category}
              </span>
              {exercise.company && (
                <span style={{ fontSize: '11px', color: 'var(--ink-subtle)' }}>
                  · {exercise.company}
                </span>
              )}
            </div>
            <h3
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--navy)',
                margin: '0 0 8px',
                lineHeight: 1.4,
                letterSpacing: '-0.01em',
              }}
            >
              {exercise.question}
            </h3>
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>
                {new Date(exercise.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>
                {completedSteps}/5 steps
              </span>
              {exercise.xpEarned && exercise.xpEarned > 0 && (
                <span style={{ fontSize: '12px', color: 'var(--copper)', fontWeight: '600' }}>
                  +{exercise.xpEarned} XP
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
            {exercise.score !== undefined && (
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  border: `2px solid ${scoreColor}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '800',
                  color: scoreColor,
                  background: `${scoreColor}08`,
                  letterSpacing: '-0.02em',
                }}
              >
                {exercise.score}%
              </div>
            )}
            <span style={{ color: 'var(--ink-subtle)', display: 'flex', alignItems: 'center' }}>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
        </div>

        {/* Step progress mini bar */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '14px' }}>
          {FRAMEWORK_STEPS.map((step) => {
            const hasContent = exercise.steps.find((s) => s.stepId === step.id)?.content?.trim().length ?? 0 > 0;
            return (
              <div
                key={step.id}
                title={step.title}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '9999px',
                  background: hasContent ? step.color : 'var(--border)',
                  transition: 'background 0.2s',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div
          className="animate-fade-in"
          style={{
            borderTop: '1px solid var(--border)',
            padding: '24px',
            background: 'var(--surface-raised)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '20px' }}>
            {FRAMEWORK_STEPS.map((step) => {
              const stepData = exercise.steps.find((s) => s.stepId === step.id);
              const hasContent = stepData?.content?.trim().length ?? 0 > 0;
              return (
                <div key={step.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '7px',
                        background: hasContent ? step.color : 'var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        color: hasContent ? 'white' : 'var(--ink-muted)',
                        fontWeight: '700',
                        flexShrink: 0,
                      }}
                    >
                      {step.number}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: step.color }}>
                      {step.title}
                    </span>
                  </div>
                  {hasContent ? (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        fontSize: '13px',
                        color: 'var(--ink)',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        maxHeight: '200px',
                        overflow: 'auto',
                      }}
                    >
                      {stepData!.content}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--ink-subtle)', fontStyle: 'italic', paddingLeft: '32px' }}>
                      Not written yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onContinue}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '9px 20px' }}
            >
              {exercise.status === 'completed' ? 'Review Exercise' : 'Continue Exercise'}
            </button>
            <button
              onClick={onDelete}
              style={{
                padding: '9px 20px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'white',
                color: 'var(--rust)',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.15s ease',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusPill({ status, score }: { status: string; score?: number }) {
  const config = {
    completed: { bg: 'var(--sage)14', color: 'var(--sage)', label: 'Completed', border: 'var(--sage)25' },
    in_progress: { bg: '#4A7BC414', color: '#4A7BC4', label: 'In Progress', border: '#4A7BC425' },
    draft: { bg: 'var(--border)', color: 'var(--ink-muted)', label: 'Draft', border: 'transparent' },
    reviewed: { bg: 'var(--purple)14', color: 'var(--purple)', label: 'Reviewed', border: 'var(--purple)25' },
  };
  const c = config[status as keyof typeof config] ?? config.draft;
  return (
    <div
      className="badge-pill"
      style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </div>
  );
}
