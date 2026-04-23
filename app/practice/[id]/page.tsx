'use client';

import { useState, useEffect, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Lightbulb, CheckCircle, Star, Zap, BookMarked, LayoutGrid } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { FRAMEWORK_STEPS, SCORE_RUBRICS, PRACTICE_QUESTIONS } from '@/lib/framework';
import { StepId } from '@/types';

const STEP_ORDER: StepId[] = ['clarification', 'segmentation', 'problem', 'solutions', 'metrics'];

export default function ExerciseSession({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { exercises, updateExerciseStep, completeExercise, deleteExercise } = useAppStore();
  const exercise = exercises.find((e) => e.id === id);

  const [activeStep, setActiveStep] = useState<StepId>('clarification');
  const [content, setContent] = useState<Record<StepId, string>>({
    clarification: '',
    segmentation: '',
    problem: '',
    solutions: '',
    metrics: '',
  });
  const [scores, setScores] = useState<Record<StepId, number>>({
    clarification: 0,
    segmentation: 0,
    problem: 0,
    solutions: 0,
    metrics: 0,
  });
  const [mode, setMode] = useState<'write' | 'score' | 'results'>('write');
  const [showHints, setShowHints] = useState(false);
  const [autoSaved, setAutoSaved] = useState(false);

  useEffect(() => {
    if (exercise) {
      const loaded: Record<StepId, string> = {
        clarification: '',
        segmentation: '',
        problem: '',
        solutions: '',
        metrics: '',
      };
      exercise.steps.forEach((s) => {
        loaded[s.stepId] = s.content;
      });
      setContent(loaded);
      if (exercise.status === 'completed') {
        setMode('results');
      }
    }
  }, [exercise?.id]);

  const saveStep = useCallback(
    (stepId: StepId, text: string) => {
      if (text.trim()) {
        updateExerciseStep(id, stepId, text);
        setAutoSaved(true);
        setTimeout(() => setAutoSaved(false), 2000);
      }
    },
    [id, updateExerciseStep]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      saveStep(activeStep, content[activeStep]);
    }, 1500);
    return () => clearTimeout(timer);
  }, [content, activeStep, saveStep]);

  if (!exercise) {
    return (
      <AppShell>
        <div style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.2 }}>◎</div>
          <p style={{ color: 'var(--ink-muted)', marginBottom: '24px' }}>Exercise not found.</p>
          <Link href="/practice" style={{ color: 'var(--copper)', textDecoration: 'none', fontWeight: '500' }}>
            ← Back to Practice
          </Link>
        </div>
      </AppShell>
    );
  }

  const step = FRAMEWORK_STEPS.find((s) => s.id === activeStep)!;
  const rubric = SCORE_RUBRICS.find((r) => r.stepId === activeStep)!;
  const currentStepIndex = STEP_ORDER.indexOf(activeStep);
  const allStepsWritten = STEP_ORDER.every((s) => content[s].trim().length > 50);
  const hints = PRACTICE_QUESTIONS.find((q) => q.question === exercise.question)?.hints ?? [];

  const handleScoreChange = (stepId: StepId, criteriaIndex: number, points: number) => {
    const stepScore = Math.min(100, Math.round(points));
    setScores((prev) => ({ ...prev, [stepId]: stepScore }));
  };

  const handleComplete = () => {
    completeExercise(id, scores);
    setMode('results');
  };

  const totalScore = Math.round(STEP_ORDER.reduce((sum, s) => sum + scores[s], 0) / STEP_ORDER.length);

  if (mode === 'results') {
    return <ResultsView exercise={exercise} scores={scores} totalScore={exercise.score ?? totalScore} />;
  }

  return (
    <AppShell>
      <div style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        {/* Top bar */}
        <div
          style={{
            padding: '14px 28px',
            background: 'white',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link
              href="/practice"
              style={{ color: 'var(--ink-muted)', textDecoration: 'none', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '500' }}
            >
              <ArrowLeft size={14} />
              Practice
            </Link>
            <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
            <div>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--navy)',
                  maxWidth: '480px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  letterSpacing: '-0.01em',
                }}
              >
                {exercise.question}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ink-subtle)' }}>
                {exercise.difficulty} · {exercise.category}
                {exercise.company ? ` · ${exercise.company}` : ''}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {autoSaved && (
              <span style={{ fontSize: '12px', color: 'var(--sage)', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
                <CheckCircle size={12} /> Saved
              </span>
            )}
            {mode === 'write' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setShowHints(!showHints)}
                  style={{
                    padding: '7px 14px',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    background: showHints ? 'var(--copper)' : 'white',
                    color: showHints ? 'white' : 'var(--ink-muted)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Lightbulb size={12} />
                  Hints {hints.length > 0 ? `(${hints.length})` : ''}
                </button>
                {allStepsWritten && (
                  <button
                    onClick={() => setMode('score')}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '7px 16px' }}
                  >
                    <Star size={12} />
                    Score My Answer
                  </button>
                )}
              </div>
            )}
            {mode === 'score' && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setMode('write')}
                  className="btn-secondary"
                  style={{ fontSize: '12px', padding: '7px 14px' }}
                >
                  ← Back to Writing
                </button>
                <button
                  onClick={handleComplete}
                  style={{
                    padding: '7px 16px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'var(--sage)',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <CheckCircle size={12} />
                  Complete Exercise
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Step sidebar */}
          <div
            style={{
              width: '200px',
              background: 'var(--surface-raised)',
              borderRight: '1px solid var(--border)',
              padding: '16px 0',
              flexShrink: 0,
              overflowY: 'auto',
            }}
          >
            {FRAMEWORK_STEPS.map((s) => {
              const isActive = s.id === activeStep;
              const hasContent = content[s.id as StepId].trim().length > 0;
              const isScored = mode === 'score' && scores[s.id as StepId] > 0;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveStep(s.id as StepId)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '11px 18px',
                    border: 'none',
                    background: isActive ? 'white' : 'transparent',
                    borderLeft: isActive ? `3px solid ${s.color}` : '3px solid transparent',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '16px' }}>{s.icon}</span>
                    {hasContent && mode === 'write' && (
                      <span style={{ fontSize: '8px', color: s.color }}>●</span>
                    )}
                    {mode === 'score' && isScored && (
                      <span style={{ fontSize: '11px', color: s.color, fontWeight: '700' }}>
                        {scores[s.id as StepId]}%
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: '12px',
                      color: isActive ? 'var(--navy)' : 'var(--ink-muted)',
                      fontWeight: isActive ? '600' : '400',
                      marginTop: '4px',
                    }}
                  >
                    {s.number}. {s.title}
                  </span>
                </button>
              );
            })}

            {/* Progress indicator */}
            <div style={{ padding: '16px 18px', borderTop: '1px solid var(--border)', marginTop: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginBottom: '8px', fontWeight: '500' }}>
                Progress
              </div>
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(STEP_ORDER.filter((s) => content[s].trim().length > 50).length / STEP_ORDER.length) * 100}%`,
                    background: 'var(--sage)',
                  }}
                />
              </div>
              <div style={{ fontSize: '10px', color: 'var(--ink-subtle)', marginTop: '5px' }}>
                {STEP_ORDER.filter((s) => content[s].trim().length > 50).length} / {STEP_ORDER.length} steps
              </div>
            </div>
          </div>

          {/* Write / Score area */}
          <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
            {mode === 'write' && (
              <WriteMode
                step={step}
                content={content[activeStep]}
                onChange={(text) => setContent((prev) => ({ ...prev, [activeStep]: text }))}
                hints={hints}
                showHints={showHints}
                currentStepIndex={currentStepIndex}
                onNext={() => {
                  const next = STEP_ORDER[currentStepIndex + 1];
                  if (next) setActiveStep(next);
                }}
                onPrev={() => {
                  const prev = STEP_ORDER[currentStepIndex - 1];
                  if (prev) setActiveStep(prev);
                }}
                isLast={currentStepIndex === STEP_ORDER.length - 1}
                allDone={allStepsWritten}
                onGoToScore={() => setMode('score')}
              />
            )}

            {mode === 'score' && (
              <ScoreMode
                step={step}
                content={content[activeStep]}
                rubric={rubric}
                score={scores[activeStep]}
                onScore={(v) => setScores((prev) => ({ ...prev, [activeStep]: v }))}
                onNext={() => {
                  const next = STEP_ORDER[currentStepIndex + 1];
                  if (next) setActiveStep(next);
                }}
                isLast={currentStepIndex === STEP_ORDER.length - 1}
              />
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function WriteMode({
  step,
  content,
  onChange,
  hints,
  showHints,
  currentStepIndex,
  onNext,
  onPrev,
  isLast,
  allDone,
  onGoToScore,
}: {
  step: (typeof FRAMEWORK_STEPS)[0];
  content: string;
  onChange: (t: string) => void;
  hints: string[];
  showHints: boolean;
  currentStepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  isLast: boolean;
  allDone: boolean;
  onGoToScore: () => void;
}) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px' }}>
      {/* Step header */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
          marginBottom: '24px',
          padding: '20px 24px',
          background: `${step.color}08`,
          border: `1px solid ${step.color}18`,
          borderRadius: '14px',
          boxShadow: `0 2px 12px ${step.color}08`,
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: step.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0,
            color: 'white',
            boxShadow: `0 3px 12px ${step.color}40`,
          }}
        >
          {step.icon}
        </div>
        <div>
          <div style={{ fontSize: '11px', color: step.color, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700', marginBottom: '4px' }}>
            Step {step.number} — {step.subtitle}
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--navy)', margin: '0 0 8px', letterSpacing: '-0.025em' }}>
            {step.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.65, margin: 0 }}>
            {step.description}
          </p>
        </div>
      </div>

      {/* Hints */}
      {showHints && hints.length > 0 && (
        <div
          className="animate-fade-in"
          style={{
            padding: '16px 20px',
            background: 'white',
            border: '1px solid var(--copper)25',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 2px 12px var(--copper-glow)',
          }}
        >
          <div style={{ fontSize: '11px', color: 'var(--copper)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Lightbulb size={12} /> Hints
          </div>
          <ul style={{ margin: 0, padding: '0 0 0 16px' }}>
            {hints.map((hint, i) => (
              <li key={i} style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: '6px' }}>
                {hint}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key questions reference */}
      <div
        style={{
          padding: '12px 16px',
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          marginBottom: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '7px',
          alignItems: 'center',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <span style={{ fontSize: '11px', color: 'var(--ink-subtle)', flexShrink: 0, fontWeight: '500' }}>
          Consider:
        </span>
        {step.keyQuestions.slice(0, 3).map((q, i) => (
          <span
            key={i}
            style={{
              padding: '3px 10px',
              background: `${step.color}10`,
              borderRadius: '12px',
              fontSize: '12px',
              color: 'var(--ink)',
              border: `1px solid ${step.color}18`,
            }}
          >
            {q}
          </span>
        ))}
      </div>

      {/* Writing area */}
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Write your ${step.title.toLowerCase()} here...\n\nBe specific and structured. Use bullet points if helpful.\n\nRemember: ${step.tips[0]}`}
        style={{
          width: '100%',
          minHeight: '320px',
          padding: '20px',
          border: '1px solid var(--border)',
          borderRadius: '14px',
          fontSize: '15px',
          fontFamily: 'var(--font-sans)',
          color: 'var(--ink)',
          background: 'white',
          outline: 'none',
          lineHeight: 1.75,
          transition: 'border-color 0.15s, box-shadow 0.15s',
          boxShadow: 'var(--shadow-xs)',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = step.color;
          e.target.style.boxShadow = `0 0 0 3px ${step.color}20`;
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)';
          e.target.style.boxShadow = 'var(--shadow-xs)';
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>
          {content.length} characters · {content.split(/\s+/).filter(Boolean).length} words
          {content.trim().length < 50 && content.length > 0 && (
            <span style={{ color: 'var(--rust)', marginLeft: '8px', fontWeight: '500' }}>Write more to proceed</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {currentStepIndex > 0 && (
            <button
              onClick={onPrev}
              className="btn-secondary"
              style={{ fontSize: '13px', padding: '8px 18px' }}
            >
              ← Prev
            </button>
          )}
          {!isLast ? (
            <button
              onClick={onNext}
              disabled={content.trim().length < 20}
              style={{
                padding: '8px 20px',
                border: 'none',
                borderRadius: '8px',
                background: content.trim().length >= 20 ? step.color : 'var(--border)',
                color: 'white',
                cursor: content.trim().length >= 20 ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: '600',
                transition: 'all 0.15s ease',
              }}
            >
              Next Step →
            </button>
          ) : (
            allDone && (
              <button
                onClick={onGoToScore}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '8px 20px' }}
              >
                <Star size={13} />
                Score My Answer
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ScoreMode({
  step,
  content,
  rubric,
  score,
  onScore,
  onNext,
  isLast,
}: {
  step: (typeof FRAMEWORK_STEPS)[0];
  content: string;
  rubric: (typeof SCORE_RUBRICS)[0];
  score: number;
  onScore: (v: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div className="animate-fade-in" style={{ maxWidth: '780px' }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: step.color, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '700', marginBottom: '6px' }}>
          Self-Evaluation — {step.title}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--navy)', margin: 0, letterSpacing: '-0.03em' }}>
          How well did you cover this step?
        </h2>
      </div>

      {/* Your answer */}
      <div className="content-card" style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '12px' }}>
          Your Answer
        </div>
        <div
          style={{
            fontSize: '14px',
            color: 'var(--ink)',
            lineHeight: 1.75,
            maxHeight: '200px',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {content || <span style={{ color: 'var(--ink-subtle)', fontStyle: 'italic' }}>No answer written for this step.</span>}
        </div>
      </div>

      {/* Rubric criteria */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '13px', color: 'var(--ink-muted)', marginBottom: '14px', fontWeight: '500' }}>
          Evaluate yourself against these criteria:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {rubric.criteria.map((c, i) => (
            <div
              key={i}
              style={{
                padding: '16px',
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--navy)', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                    {c.label}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--ink-muted)', lineHeight: 1.55 }}>
                    {c.description}
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', flexShrink: 0, marginLeft: '12px', fontWeight: '500' }}>
                  max {c.maxPoints}pts
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score slider */}
      <div className="content-card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--navy)', letterSpacing: '-0.01em' }}>
            Your Score for {step.title}
          </span>
          <span
            style={{
              fontSize: '26px',
              fontWeight: '800',
              color: score >= 80 ? 'var(--sage)' : score >= 60 ? 'var(--copper)' : score > 0 ? 'var(--rust)' : 'var(--ink-subtle)',
              letterSpacing: '-0.03em',
            }}
          >
            {score}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={score}
          onChange={(e) => onScore(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: step.color,
            height: '6px',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--rust)', fontWeight: '500' }}>Needs work</span>
          <span style={{ fontSize: '11px', color: 'var(--copper)', fontWeight: '500' }}>Good</span>
          <span style={{ fontSize: '11px', color: 'var(--sage)', fontWeight: '500' }}>Excellent</span>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          {[
            { label: 'Missed it', value: 25, color: 'var(--rust)' },
            { label: 'Partial', value: 50, color: 'var(--copper)' },
            { label: 'Good', value: 75, color: '#4A7BC4' },
            { label: 'Excellent', value: 100, color: 'var(--sage)' },
          ].map((b) => (
            <button
              key={b.label}
              onClick={() => onScore(b.value)}
              style={{
                flex: 1,
                padding: '8px',
                border: `1px solid ${score === b.value ? b.color : 'var(--border)'}`,
                borderRadius: '9px',
                background: score === b.value ? `${b.color}14` : 'var(--surface-raised)',
                color: score === b.value ? b.color : 'var(--ink-muted)',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: score === b.value ? '700' : '400',
                transition: 'all 0.15s ease',
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {!isLast && (
        <button
          onClick={onNext}
          style={{
            width: '100%',
            padding: '13px',
            border: 'none',
            borderRadius: '11px',
            background: step.color,
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '700',
            transition: 'all 0.15s ease',
            boxShadow: `0 4px 16px ${step.color}40`,
          }}
        >
          Score Next Step →
        </button>
      )}
    </div>
  );
}

function ResultsView({
  exercise,
  scores,
  totalScore,
}: {
  exercise: NonNullable<ReturnType<typeof useAppStore.getState>['exercises'][0]>;
  scores: Record<StepId, number>;
  totalScore: number;
}) {
  const router = useRouter();
  const scoreColor = totalScore >= 80 ? 'var(--sage)' : totalScore >= 60 ? 'var(--copper)' : 'var(--rust)';
  const xpEarned = exercise.xpEarned ?? 0;

  return (
    <AppShell>
      <div className="page-content animate-fade-in" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div
            style={{
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              background: `${scoreColor}12`,
              border: `3px solid ${scoreColor}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '28px',
              fontWeight: '800',
              color: scoreColor,
              letterSpacing: '-0.03em',
              boxShadow: `0 4px 20px ${scoreColor}25`,
            }}
          >
            {totalScore}
          </div>
          <h1 style={{ fontSize: '30px', fontWeight: '800', color: 'var(--navy)', letterSpacing: '-0.03em', margin: '0 0 8px' }}>
            Exercise Complete!
          </h1>
          <p style={{ fontSize: '16px', color: 'var(--ink-muted)', margin: '0 0 20px' }}>
            {totalScore >= 80 ? 'Outstanding work — you nailed this framework!' :
              totalScore >= 60 ? 'Good effort — keep practicing to sharpen your thinking.' :
                'Keep going — every exercise builds the habit.'}
          </p>
          {xpEarned > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 24px',
                background: 'var(--gradient-copper)',
                borderRadius: '28px',
                color: 'white',
                fontSize: '15px',
                fontWeight: '700',
                boxShadow: 'var(--shadow-copper)',
              }}
            >
              <Star size={15} />
              +{xpEarned} XP earned
            </div>
          )}
        </div>

        {/* Score breakdown */}
        <div className="content-card" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            Score by Step
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {FRAMEWORK_STEPS.map((step) => {
              const s = scores[step.id as StepId] ?? exercise.score ?? 0;
              const sc = s >= 80 ? 'var(--sage)' : s >= 60 ? 'var(--copper)' : 'var(--rust)';
              return (
                <div key={step.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '16px' }}>{step.icon}</span>
                      <span style={{ fontSize: '14px', color: 'var(--navy)', fontWeight: '500' }}>
                        {step.title}
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: sc, letterSpacing: '-0.02em' }}>
                      {s}%
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${s}%`, background: sc }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review your answers */}
        <div className="content-card" style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            Your Answers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {FRAMEWORK_STEPS.map((step) => {
              const stepContent = exercise.steps.find((s) => s.stepId === step.id)?.content ?? '';
              return (
                <div key={step.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{step.icon}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: step.color }}>
                      {step.title}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '13px',
                      color: stepContent ? 'var(--ink)' : 'var(--ink-subtle)',
                      lineHeight: 1.7,
                      margin: 0,
                      whiteSpace: 'pre-wrap',
                      fontStyle: stepContent ? 'normal' : 'italic',
                    }}
                  >
                    {stepContent || 'No answer written.'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => router.push('/practice')}
            className="btn-primary"
            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
          >
            <Zap size={15} />
            New Exercise
          </button>
          <button
            onClick={() => router.push('/library')}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
          >
            <BookMarked size={15} />
            View Library
          </button>
          <button
            onClick={() => router.push('/')}
            className="btn-secondary"
            style={{ flex: 1, justifyContent: 'center', padding: '14px' }}
          >
            <LayoutGrid size={15} />
            Dashboard
          </button>
        </div>
      </div>
    </AppShell>
  );
}
