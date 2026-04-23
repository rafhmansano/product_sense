'use client';

import AppShell from '@/components/AppShell';
import { useAppStore } from '@/lib/store';
import { BADGES, FRAMEWORK_STEPS, calculateLevel } from '@/lib/framework';
import { BadgeId, StepId } from '@/types';

const LEVEL_TITLES = [
  '', 'Aspiring PM', 'Product Thinker', 'Framework Learner', 'Problem Solver',
  'Strategic Mind', 'Product Craftsman', 'Senior Practitioner', 'Framework Expert',
  'Product Strategist', 'Framework Master',
];

const rarityColors: Record<string, string> = {
  common: '#6B6B7B',
  uncommon: '#4A7BC4',
  rare: '#8B68CC',
  legendary: '#C4920D',
};

const rarityOrder: Record<string, number> = {
  legendary: 0,
  rare: 1,
  uncommon: 2,
  common: 3,
};

export default function ProgressPage() {
  const stats = useAppStore((s) => s.stats);
  const exercises = useAppStore((s) => s.exercises);
  const { level, progressPercent } = calculateLevel(stats.xp);

  const earnedBadges = BADGES.filter((b) => stats.badges.includes(b.id));

  const sortedBadges = [...BADGES].sort(
    (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
  );

  const completedByDifficulty = {
    Easy: exercises.filter((e) => e.status === 'completed' && e.difficulty === 'Easy').length,
    Medium: exercises.filter((e) => e.status === 'completed' && e.difficulty === 'Medium').length,
    Hard: exercises.filter((e) => e.status === 'completed' && e.difficulty === 'Hard').length,
  };

  const xpHistory = exercises
    .filter((e) => e.status === 'completed' && e.xpEarned)
    .slice(-7)
    .map((e) => ({ date: new Date(e.completedAt!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), xp: e.xpEarned ?? 0 }));

  const maxXp = Math.max(...xpHistory.map((h) => h.xp), 1);

  return (
    <AppShell>
      <div className="page-content animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '36px' }}>
          <div className="section-label">Gamification</div>
          <h1 style={{ fontSize: '38px', fontWeight: '800', letterSpacing: '-0.04em', color: 'var(--navy)', margin: 0, lineHeight: 1.12 }}>
            Your Progress &<br />Achievements
          </h1>
        </div>

        {/* Level card */}
        <div
          style={{
            background: 'var(--gradient-hero)',
            borderRadius: '20px',
            padding: '32px 36px',
            marginBottom: '28px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-navy)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              fontSize: '200px',
              opacity: 0.025,
              lineHeight: 1,
              color: 'white',
              fontFamily: 'Georgia, serif',
              userSelect: 'none',
            }}
          >
            {level}
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: '-40px',
              left: '240px',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(196,146,13,0.07)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'var(--gradient-copper)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '800',
                color: 'white',
                flexShrink: 0,
                boxShadow: 'var(--shadow-copper)',
                letterSpacing: '-0.03em',
              }}
            >
              {level}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: '600', marginBottom: '4px' }}>
                Current Level
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', letterSpacing: '-0.03em', marginBottom: '14px' }}>
                {LEVEL_TITLES[Math.min(level, 10)]}
              </div>
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>
                  {stats.xp.toLocaleString()} XP total
                </span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.35)' }}>
                  {stats.xpToNextLevel} XP to Level {level + 1}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '32px' }}>
              <StatBlock label="Streak" value={`${stats.streak}d`} sub="current" />
              <StatBlock label="Best" value={`${stats.longestStreak}d`} sub="longest" />
              <StatBlock label="Badges" value={earnedBadges.length.toString()} sub={`of ${BADGES.length}`} />
            </div>
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '28px' }}>
          {/* Performance stats */}
          <div className="content-card">
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Performance Stats
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <MiniStat label="Total Exercises" value={stats.totalExercises} color="var(--navy)" />
              <MiniStat label="Completed" value={stats.completedExercises} color="var(--sage)" />
              <MiniStat label="Average Score" value={`${stats.averageScore}%`} color="var(--copper)" />
              <MiniStat label="XP Earned" value={stats.xp.toLocaleString()} color="var(--copper)" />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500' }}>
                By Difficulty
              </div>
              {Object.entries(completedByDifficulty).map(([diff, count]) => {
                const colors: Record<string, string> = { Easy: 'var(--sage)', Medium: 'var(--copper)', Hard: 'var(--rust)' };
                const max = Math.max(...Object.values(completedByDifficulty), 1);
                return (
                  <div key={diff} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: colors[diff], fontWeight: '700', width: '52px' }}>{diff}</span>
                    <div className="progress-track" style={{ flex: 1 }}>
                      <div className="progress-fill" style={{ width: `${(count / max) * 100}%`, background: colors[diff] }} />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--ink-muted)', width: '20px', textAlign: 'right', fontWeight: '600' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step mastery */}
          <div className="content-card">
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 20px', letterSpacing: '-0.01em' }}>
              Step Mastery
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FRAMEWORK_STEPS.map((step) => {
                const mastery = stats.stepMastery[step.id as StepId] ?? 0;
                return (
                  <div key={step.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{step.icon}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', fontWeight: '500' }}>{step.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: mastery > 0 ? step.color : 'var(--ink-subtle)' }}>
                          {mastery > 0 ? `${mastery}%` : '—'}
                        </span>
                        {mastery >= 80 && (
                          <span style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '8px', background: `${step.color}15`, color: step.color, fontWeight: '600' }}>
                            Expert
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${mastery}%`, background: step.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* XP chart */}
        {xpHistory.length > 0 && (
          <div className="content-card" style={{ marginBottom: '28px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: '0 0 24px', letterSpacing: '-0.01em' }}>
              Recent XP Earned
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '120px' }}>
              {xpHistory.map((h, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: 'var(--copper)', fontWeight: '700' }}>{h.xp}</span>
                  <div
                    style={{
                      width: '100%',
                      height: `${(h.xp / maxXp) * 100}px`,
                      background: 'var(--gradient-copper)',
                      borderRadius: '5px 5px 0 0',
                      transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      minHeight: '4px',
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--ink-subtle)' }}>{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges grid */}
        <div className="content-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--navy)', margin: 0, letterSpacing: '-0.01em' }}>
              All Badges
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>
              {earnedBadges.length} / {BADGES.length} unlocked
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {sortedBadges.map((badge) => {
              const earned = stats.badges.includes(badge.id as BadgeId);
              const color = rarityColors[badge.rarity];
              return (
                <div
                  key={badge.id}
                  style={{
                    padding: '20px',
                    border: `1px solid ${earned ? `${color}28` : 'var(--border)'}`,
                    borderRadius: '14px',
                    background: earned ? `${color}06` : 'var(--surface-raised)',
                    opacity: earned ? 1 : 0.5,
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: earned ? `0 2px 12px ${color}10` : 'none',
                  }}
                >
                  {!earned && (
                    <div style={{ position: 'absolute', top: '14px', right: '14px', fontSize: '12px', color: 'var(--ink-subtle)' }}>
                      🔒
                    </div>
                  )}
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{badge.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: earned ? color : 'var(--ink-muted)', marginBottom: '5px' }}>
                    {badge.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', lineHeight: 1.55, marginBottom: '12px' }}>
                    {badge.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: earned ? color : 'var(--ink-subtle)',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: earned ? `${color}14` : 'transparent',
                      }}
                    >
                      {badge.rarity}
                    </span>
                    <span style={{ fontSize: '12px', color: earned ? 'var(--copper)' : 'var(--ink-subtle)', fontWeight: '600' }}>
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatBlock({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '600' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: '800', color: 'white', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>{sub}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ padding: '14px 16px', background: 'var(--surface-raised)', borderRadius: '10px', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '500' }}>
        {label}
      </div>
      <div style={{ fontSize: '22px', fontWeight: '800', color, letterSpacing: '-0.03em' }}>
        {value}
      </div>
    </div>
  );
}
