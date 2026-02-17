'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { calculateLevel, FRAMEWORK_STEPS, BADGES } from '@/lib/framework';
import { StepId } from '@/types';

function StatCard({ label, value, sub, color }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div
      style={{
        background: 'white',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: 'var(--ink-subtle)',
          fontFamily: 'sans-serif',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '28px',
          fontWeight: '700',
          letterSpacing: '-0.03em',
          color: color ?? 'var(--navy)',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
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
        style={{
          padding: '2px 10px',
          borderRadius: '20px',
          background: `${color}15`,
          color,
          fontSize: '12px',
          fontWeight: '600',
          fontFamily: 'sans-serif',
        }}
      >
        {score}%
      </div>
    );
  }
  if (status === 'in_progress') {
    return (
      <div
        style={{
          padding: '2px 10px',
          borderRadius: '20px',
          background: '#4A6FA515',
          color: '#4A6FA5',
          fontSize: '11px',
          fontFamily: 'sans-serif',
        }}
      >
        In progress
      </div>
    );
  }
  return (
    <div
      style={{
        padding: '2px 10px',
        borderRadius: '20px',
        background: 'var(--border)',
        color: 'var(--ink-muted)',
        fontSize: '11px',
        fontFamily: 'sans-serif',
      }}
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
  common: '#6B6B6B',
  uncommon: '#4A6FA5',
  rare: '#7C5CBF',
  legendary: '#B5860A',
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
            Welcome back
          </div>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: 'var(--navy)',
              margin: 0,
              lineHeight: 1.15,
            }}
          >
            Your Product Sense<br />Command Center
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--ink-muted)',
              marginTop: '12px',
              fontFamily: 'sans-serif',
              maxWidth: '520px',
              lineHeight: 1.6,
            }}
          >
            Master the 5-step framework used by top product managers at world-class companies.
            Practice, score, and level up your product thinking.
          </p>
        </div>

        {/* XP Level Bar */}
        <div
          style={{
            background: 'var(--navy)',
            borderRadius: '16px',
            padding: '24px 28px',
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
          }}
        >
          <div
            style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--copper), var(--copper-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: '700',
              color: 'white',
              flexShrink: 0,
              fontFamily: 'sans-serif',
            }}
          >
            {level}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
              <span style={{ color: 'white', fontSize: '16px', fontWeight: '600', fontFamily: 'sans-serif' }}>
                Level {level} — {getLevelTitle(level)}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: 'sans-serif' }}>
                {stats.xp.toLocaleString()} XP
              </span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progressPercent}%`,
                  background: 'linear-gradient(90deg, var(--copper), var(--copper-light))',
                  borderRadius: '9999px',
                  transition: 'width 0.8s ease',
                }}
              />
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontFamily: 'sans-serif', marginTop: '6px' }}>
              {stats.xpToNextLevel} XP to Level {level + 1}
            </div>
          </div>
          {stats.streak > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0 20px',
                borderLeft: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: '24px' }}>🔥</span>
              <span style={{ color: 'white', fontSize: '18px', fontWeight: '700', fontFamily: 'sans-serif', lineHeight: 1.2 }}>
                {stats.streak}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontFamily: 'sans-serif' }}>
                day streak
              </span>
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '40px' }}
          className="stagger-children"
        >
          <StatCard label="Exercises" value={stats.totalExercises} sub={`${completedCount} completed`} />
          <StatCard
            label="Avg. Score"
            value={stats.completedExercises > 0 ? `${stats.averageScore}%` : '—'}
            sub="across all steps"
            color="var(--sage)"
          />
          <StatCard label="Longest Streak" value={`${stats.longestStreak}d`} sub="days in a row" color="var(--rust)" />
          <StatCard label="Badges" value={earnedBadges.length} sub={`of ${BADGES.length} total`} color="var(--copper)" />
        </div>

        {/* Two column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          {/* Step Mastery */}
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: 0, fontFamily: 'sans-serif' }}>
                Step Mastery
              </h2>
              <Link href="/framework" style={{ fontSize: '12px', color: 'var(--copper)', textDecoration: 'none', fontFamily: 'sans-serif' }}>
                Study guide →
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {FRAMEWORK_STEPS.map((step) => {
                const mastery = stats.stepMastery[step.id as StepId] ?? 0;
                return (
                  <div key={step.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <span style={{ fontSize: '13px', color: 'var(--ink)', fontFamily: 'sans-serif' }}>
                        <span style={{ opacity: 0.5 }}>{step.number}. </span>{step.title}
                      </span>
                      <span style={{ fontSize: '12px', color: mastery > 0 ? step.color : 'var(--ink-subtle)', fontFamily: 'sans-serif', fontWeight: '500' }}>
                        {mastery > 0 ? `${mastery}%` : 'Not started'}
                      </span>
                    </div>
                    <div style={{ height: '4px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${mastery}%`,
                          background: step.color,
                          borderRadius: '9999px',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent exercises */}
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: 0, fontFamily: 'sans-serif' }}>
                Recent Exercises
              </h2>
              <Link href="/library" style={{ fontSize: '12px', color: 'var(--copper)', textDecoration: 'none', fontFamily: 'sans-serif' }}>
                View all →
              </Link>
            </div>
            {recentExercises.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px', opacity: 0.3 }}>◎</div>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', fontFamily: 'sans-serif', margin: '0 0 16px' }}>
                  No exercises yet. Start practicing!
                </p>
                <Link
                  href="/practice"
                  style={{
                    display: 'inline-block',
                    padding: '8px 20px',
                    background: 'var(--navy)',
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '13px',
                    fontFamily: 'sans-serif',
                  }}
                >
                  Start your first exercise
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentExercises.map((ex) => (
                  <Link
                    key={ex.id}
                    href={`/practice/${ex.id}`}
                    style={{
                      display: 'block',
                      padding: '12px 14px',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '13px',
                            color: 'var(--navy)',
                            fontFamily: 'sans-serif',
                            fontWeight: '500',
                            lineHeight: 1.4,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {ex.question}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginTop: '3px' }}>
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
                  <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', textAlign: 'center', paddingTop: '4px' }}>
                    {inProgressCount} exercise{inProgressCount > 1 ? 's' : ''} in progress
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Badges */}
        {earnedBadges.length > 0 && (
          <div
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '40px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: 0, fontFamily: 'sans-serif' }}>
                Earned Badges
              </h2>
              <Link href="/progress" style={{ fontSize: '12px', color: 'var(--copper)', textDecoration: 'none', fontFamily: 'sans-serif' }}>
                View progress →
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
                    gap: '8px',
                    padding: '8px 14px',
                    border: `1px solid ${rarityColors[badge.rarity]}40`,
                    borderRadius: '24px',
                    background: `${rarityColors[badge.rarity]}0A`,
                  }}
                >
                  <span style={{ fontSize: '16px' }}>{badge.icon}</span>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: rarityColors[badge.rarity], fontFamily: 'sans-serif' }}>
                      {badge.name}
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {badge.rarity} · +{badge.xpReward} XP
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link
            href="/practice"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'var(--navy)',
              color: 'white',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'sans-serif',
            }}
          >
            ◈ Start New Exercise
          </Link>
          <Link
            href="/framework"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 28px',
              background: 'white',
              color: 'var(--navy)',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '600',
              fontFamily: 'sans-serif',
              border: '1px solid var(--border)',
            }}
          >
            ⬡ Study the Framework
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
