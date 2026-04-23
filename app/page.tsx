'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Zap, BookOpen, ArrowRight } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { calculateLevel, FRAMEWORK_STEPS, BADGES } from '@/lib/framework';
import { StepId } from '@/types';

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="stat-card" style={{ borderTop: `3px solid ${accent ?? 'var(--navy)'}` }}>
      <div
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--ink-subtle)',
          fontWeight: '500',
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '30px',
          fontWeight: '800',
          letterSpacing: '-0.04em',
          color: accent ?? 'var(--navy)',
          lineHeight: 1.05,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--ink-subtle)', marginTop: '4px' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, score }: { status: string; score?: number }) {
  if (status === 'completed' && score !== undefined) {
    const color = score >= 80 ? 'var(--sage)' : score >= 60 ? 'var(--copper)' : 'var(--rust)';
    return (
      <div
        className="badge-pill"
        style={{ background: `${color}18`, color, border: `1px solid ${color}30` }}
      >
        {score}%
      </div>
    );
  }
  if (status === 'in_progress') {
    return (
      <div
        className="badge-pill"
        style={{ background: '#4A7BC418', color: '#4A7BC4', border: '1px solid #4A7BC430' }}
      >
        In progress
      </div>
    );
  }
  return (
    <div
      className="badge-pill"
      style={{ background: 'var(--border)', color: 'var(--ink-subtle)', border: '1px solid transparent' }}
    >
      Draft
    </div>
  );
}

function getLevelTitle(level: number): string {
  const titles = [
    '', 'Aspiring PM', 'Product Thinker', 'Framework Learner', 'Problem Solver',
    'Strategic Mind', 'Product Craftsman', 'Senior Practitioner', 'Framework Expert',
    'Product Strategist', 'Framework Master',
  ];
  return titles[Math.min(level, 10)] || 'Framework Master';
}

const rarityColors: Record<string, string> = {
  common: '#6B6B7B',
  uncommon: '#4A7BC4',
  rare: '#8B68CC',
  legendary: '#C4920D',
};

export default function Dashboard() {
  const { stats, exercises, updateStreak } = useAppStore();
  const { level, progressPercent } = calculateLevel(stats.xp);

  useEffect(() => {
    updateStreak();
  }, [updateStreak]);

  const recentExercises = exercises.slice(0, 4);
  const completedCount = exercises.filter((e) => e.status === 'completed').length;
  const inProgressCount = exercises.filter((e) => e.status === 'in_progress').length;
  const earnedBadges = BADGES.filter((b) => stats.badges.includes(b.id));

  return (
    <AppShell>
      <div className="page-content animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div className="section-label">Welcome back</div>
          <h1
            style={{
              fontSize: '38px',
              fontWeight: '800',
              letterSpacing: '-0.04em',
              color: 'var(--navy)',
              margin: 0,
              lineHeight: 1.12,
            }}
          >
            Your Product Sense<br />Command Center
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--ink-muted)',
              marginTop: '14px',
              maxWidth: '520px',
              lineHeight: 1.65,
            }}
          >
            Master the 5-step framework used by top product managers at world-class companies.
            Practice, score, and level up your product thinking.
          </p>
        </div>

        {/* XP Level Bar */}
        <div
          style={{
            background: 'var(--gradient-hero)',
            borderRadius: '18px',
            padding: '26px 32px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            boxShadow: 'var(--shadow-navy)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              right: '120px',
              width: '160px',
              height: '160px',
              borderRadius: '50%',
              background: 'rgba(196,146,13,0.06)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--gradient-copper)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '800',
              color: 'white',
              flexShrink: 0,
              boxShadow: 'var(--shadow-copper)',
              letterSpacing: '-0.02em',
            }}
          >
            {level}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: '700', letterSpacing: '-0.01em' }}>
                Level {level} — {getLevelTitle(level)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px' }}>
                {stats.xp.toLocaleString()} XP
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'var(--gradient-copper)',
                  borderRadius: '9999px',
                  transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: '0 0 8px rgba(196,146,13,0.5)',
                }}
              />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '6px' }}>
              {stats.xpToNextLevel} XP to Level {level + 1}
            </div>
          </div>

          {stats.streak > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 24px',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: '26px' }}>🔥</span>
              <span style={{ color: 'white', fontSize: '20px', fontWeight: '800', lineHeight: 1.2, letterSpacing: '-0.02em' }}>
                {stats.streak}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500' }}>
                day streak
              </span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}
          className="stagger-children"
        >
          <StatCard label="Exercises" value={stats.totalExercises} sub={`${completedCount} completed`} accent="var(--navy)" />
          <StatCard
            label="Avg. Score"
            value={stats.completedExercises > 0 ? `${stats.averageScore}%` : '—'}
            sub="across all steps"
            accent="var(--sage)"
          />
          <StatCard label="Best Streak" value={`${stats.longestStreak}d`} sub="days in a row" accent="var(--rust)" />
          <StatCard label="Badges" value={earnedBadges.length} sub={`of ${BADGES.length} total`} accent="var(--copper)" />
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          {/* Step Mastery */}
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: 0, letterSpacing: '-0.01em' }}>
                Step Mastery
              </h2>
              <Link href="/framework" style={{ fontSize: '12px', color: 'var(--copper)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px' }}>
                Study guide <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FRAMEWORK_STEPS.map((step) => {
                const mastery = stats.stepMastery[step.id as StepId] ?? 0;
                return (
                  <div key={step.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: '500' }}>
                        <span style={{ opacity: 0.4, fontSize: '12px' }}>{step.number}. </span>{step.title}
                      </span>
                      <span style={{ fontSize: '12px', color: mastery > 0 ? step.color : 'var(--ink-subtle)', fontWeight: '600' }}>
                        {mastery > 0 ? `${mastery}%` : 'Not started'}
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${mastery}%`, background: step.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent exercises */}
          <div className="content-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: 0, letterSpacing: '-0.01em' }}>
                Recent Exercises
              </h2>
              <Link href="/library" style={{ fontSize: '12px', color: 'var(--copper)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px' }}>
                View all <ArrowRight size={11} />
              </Link>
            </div>
            {recentExercises.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.2 }}>◎</div>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: '0 0 18px' }}>
                  No exercises yet. Start practicing!
                </p>
                <Link href="/practice" className="btn-primary" style={{ fontSize: '13px', padding: '10px 20px' }}>
                  Start your first exercise
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {recentExercises.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/practice/${ex.id}`}
                    style={{
                      display: 'block',
                      padding: '12px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      transition: 'all 0.18s ease',
                      background: 'var(--surface-raised)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-strong)';
                      e.currentTarget.style.background = 'white';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--surface-raised)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'var(--navy)',
                            fontWeight: '500',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ex.question}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginTop: '3px' }}>
                          {new Date(ex.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {ex.company ? ` · ${ex.company}` : ''}
                          {` · ${ex.difficulty}`}
                        </div>
                      </div>
                      <StatusBadge status={ex.status} score={ex.score} />
                    </div>
                  </Link>
                ))}
                {inProgressCount > 0 && (
                  <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', textAlign: 'center', paddingTop: '4px' }}>
                    {inProgressCount} exercise{inProgressCount > 1 ? 's' : ''} in progress
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div className="content-card" style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: 0, letterSpacing: '-0.01em' }}>
                Earned Badges
              </h2>
              <Link href="/progress" style={{ fontSize: '12px', color: 'var(--copper)', textDecoration: 'none', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '3px' }}>
                View progress <ArrowRight size={11} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {earnedBadges.map((badge) => (
                <div
                  key={badge.id}
                  title={badge.description}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 16px',
                    border: `1px solid ${rarityColors[badge.rarity]}35`,
                    borderRadius: '28px',
                    background: `${rarityColors[badge.rarity]}08`,
                  }}
                >
                  <span style={{ fontSize: '18px' }}>{badge.icon}</span>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: rarityColors[badge.rarity] }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-subtle)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500' }}>
                      {badge.rarity} · +{badge.xpReward} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', gap: '14px' }}>
          <Link href="/practice" className="btn-primary btn-shimmer">
            <Zap size={15} />
            Start New Exercise
          </Link>
          <Link href="/framework" className="btn-secondary">
            <BookOpen size={15} />
            Study the Framework
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
