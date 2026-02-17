'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '8px' }}>
            Solutions Library
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--navy)', margin: 0, lineHeight: 1.15 }}>
            Your Exercise Archive
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-muted)', marginTop: '12px', fontFamily: 'sans-serif', maxWidth: '520px', lineHeight: 1.6 }}>
            Review your completed frameworks, revisit your thinking, and track improvement over time.
          </p>
        </div>

        {/* Filters + search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['all', 'completed', 'in_progress', 'draft'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '6px 16px',
                  border: '1px solid',
                  borderColor: filter === f ? 'var(--navy)' : 'var(--border)',
                  borderRadius: '20px',
                  background: filter === f ? 'var(--navy)' : 'white',
                  color: filter === f ? 'white' : 'var(--ink-muted)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontFamily: 'sans-serif',
                  fontWeight: filter === f ? '600' : '400',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {f === 'all' ? 'All' : f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                <span
                  style={{
                    padding: '1px 6px',
                    borderRadius: '10px',
                    background: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--border)',
                    fontSize: '11px',
                    color: filter === f ? 'white' : 'var(--ink-muted)',
                  }}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions..."
            style={{
              padding: '8px 14px',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '13px',
              fontFamily: 'sans-serif',
              color: 'var(--ink)',
              background: 'white',
              outline: 'none',
              width: '240px',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--copper)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Exercise list */}
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '16px',
            }}
          >
            <div style={{ fontSize: '40px', marginBottom: '16px', opacity: 0.2 }}>◇</div>
            <h3 style={{ fontSize: '18px', color: 'var(--navy)', fontWeight: '600', margin: '0 0 8px' }}>
              {exercises.length === 0 ? 'No exercises yet' : 'No results found'}
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', marginBottom: '24px' }}>
              {exercises.length === 0
                ? 'Start practicing to build your library of solutions.'
                : 'Try adjusting your search or filter.'}
            </p>
            {exercises.length === 0 && (
              <Link
                href="/practice"
                style={{
                  display: 'inline-block',
                  padding: '10px 24px',
                  background: 'var(--navy)',
                  color: 'white',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontFamily: 'sans-serif',
                  fontWeight: '600',
                }}
              >
                Start First Exercise
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'box-shadow 0.15s ease',
      }}
    >
      {/* Card header */}
      <div
        style={{ padding: '20px 24px', cursor: 'pointer' }}
        onClick={onToggle}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <StatusPill status={exercise.status} score={exercise.score} />
              <span
                style={{
                  padding: '2px 10px',
                  borderRadius: '20px',
                  background: `${difficultyColors[exercise.difficulty]}15`,
                  color: difficultyColors[exercise.difficulty],
                  fontSize: '11px',
                  fontFamily: 'sans-serif',
                  fontWeight: '600',
                }}
              >
                {exercise.difficulty}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
                {exercise.category}
              </span>
              {exercise.company && (
                <span style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
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
                fontFamily: 'sans-serif',
                lineHeight: 1.4,
              }}
            >
              {exercise.question}
            </h3>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
                {new Date(exercise.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
                {completedSteps}/5 steps written
              </span>
              {exercise.xpEarned && exercise.xpEarned > 0 && (
                <span style={{ fontSize: '12px', color: 'var(--copper)', fontFamily: 'sans-serif', fontWeight: '500' }}>
                  +{exercise.xpEarned} XP
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px', flexShrink: 0 }}>
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
                  fontSize: '16px',
                  fontWeight: '700',
                  color: scoreColor,
                  fontFamily: 'sans-serif',
                  background: `${scoreColor}08`,
                }}
              >
                {exercise.score}%
              </div>
            )}
            <span style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
              {isExpanded ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Step progress mini bar */}
        <div style={{ display: 'flex', gap: '4px', marginTop: '12px' }}>
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
          {/* Step-by-step answers */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '20px' }}>
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
                        borderRadius: '50%',
                        background: hasContent ? step.color : 'var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        color: hasContent ? 'white' : 'var(--ink-muted)',
                        fontFamily: 'sans-serif',
                        fontWeight: '600',
                        flexShrink: 0,
                      }}
                    >
                      {step.number}
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: step.color, fontFamily: 'sans-serif' }}>
                      {step.title}
                    </span>
                  </div>
                  {hasContent ? (
                    <div
                      style={{
                        padding: '12px 16px',
                        background: 'white',
                        border: '1px solid var(--border)',
                        borderRadius: '8px',
                        fontSize: '13px',
                        color: 'var(--ink)',
                        fontFamily: 'sans-serif',
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        maxHeight: '200px',
                        overflow: 'auto',
                      }}
                    >
                      {stepData!.content}
                    </div>
                  ) : (
                    <div style={{ fontSize: '13px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', fontStyle: 'italic', paddingLeft: '32px' }}>
                      Not written yet.
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onContinue}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '8px',
                background: 'var(--navy)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'sans-serif',
                fontWeight: '600',
              }}
            >
              {exercise.status === 'completed' ? 'Review Exercise' : 'Continue Exercise'}
            </button>
            <button
              onClick={onDelete}
              style={{
                padding: '8px 20px',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                background: 'white',
                color: 'var(--rust)',
                cursor: 'pointer',
                fontSize: '13px',
                fontFamily: 'sans-serif',
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
    completed: { bg: 'var(--sage)15', color: 'var(--sage)', label: 'Completed' },
    in_progress: { bg: '#4A6FA515', color: '#4A6FA5', label: 'In Progress' },
    draft: { bg: 'var(--border)', color: 'var(--ink-muted)', label: 'Draft' },
    reviewed: { bg: 'var(--purple)15', color: 'var(--purple)', label: 'Reviewed' },
  };
  const c = config[status as keyof typeof config] ?? config.draft;
  return (
    <div
      style={{
        padding: '2px 10px',
        borderRadius: '20px',
        background: c.bg,
        color: c.color,
        fontSize: '11px',
        fontFamily: 'sans-serif',
        fontWeight: '600',
        textTransform: 'capitalize',
      }}
    >
      {c.label}
    </div>
  );
}
