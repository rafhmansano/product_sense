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
  common: '#6B6B6B',
  uncommon: '#4A6FA5',
  rare: '#7C5CBF',
  legendary: '#B5860A',
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
  const unearnedBadges = BADGES.filter((b) => !stats.badges.includes(b.id));

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
      <div style={{ padding: '40px 48px', maxWidth: '1100px' }} className="animate-fade-in">
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '8px' }}>
            Gamification
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--navy)', margin: 0, lineHeight: 1.15 }}>
            Your Progress &<br />Achievements
          </h1>
        </div>

        {/* Level card */}
        <div
          style={{
            background: 'var(--navy)',
            borderRadius: '20px',
            padding: '32px 36px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              fontSize: '200px',
              opacity: 0.03,
              lineHeight: 1,
              color: 'white',
              fontFamily: 'Georgia, serif',
              userSelect: 'none',
            }}
          >
            {level}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--copper), var(--copper-light))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '800',
                color: 'white',
                flexShrink: 0,
                fontFamily: 'sans-serif',
                boxShadow: '0 4px 20px rgba(181,134,10,0.3)',
              }}
            >
              {level}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>
                Current Level
              </div>
              <div style={{ fontSize: '24px', fontWeight: '700', color: 'white', letterSpacing: '-0.02em', marginBottom: '12px' }}>
                {LEVEL_TITLES[Math.min(level, 10)]}
              </div>
              <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '8px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif' }}>
                  {stats.xp.toLocaleString()} XP total
                </span>
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif' }}>
                  {stats.xpToNextLevel} XP to Level {level + 1}
                </span>
              </div>
            </div>

            {/* Right stats */}
            <div style={{ display: 'flex', gap: '24px', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '28px' }}>
              <StatBlock label="Streak" value={`${stats.streak}d`} sub="current" />
              <StatBlock label="Best" value={`${stats.longestStreak}d`} sub="longest" />
              <StatBlock label="Badges" value={earnedBadges.length.toString()} sub={`of ${BADGES.length}`} />
            </div>
          </div>
        </div>

        {/* Two columns: stats + chart */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Performance stats */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
              Performance Stats
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <MiniStat label="Total Exercises" value={stats.totalExercises} color="var(--navy)" />
              <MiniStat label="Completed" value={stats.completedExercises} color="var(--sage)" />
              <MiniStat label="Average Score" value={`${stats.averageScore}%`} color="var(--copper)" />
              <MiniStat label="XP Earned" value={stats.xp.toLocaleString()} color="var(--copper-light)" />
            </div>
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '12px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                By Difficulty
              </div>
              {Object.entries(completedByDifficulty).map(([diff, count]) => {
                const colors: Record<string, string> = { Easy: 'var(--sage)', Medium: 'var(--copper)', Hard: 'var(--rust)' };
                const max = Math.max(...Object.values(completedByDifficulty), 1);
                return (
                  <div key={diff} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: colors[diff], fontFamily: 'sans-serif', fontWeight: '600', width: '50px' }}>{diff}</span>
                    <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(count / max) * 100}%`,
                          background: colors[diff],
                          borderRadius: '9999px',
                          transition: 'width 0.5s ease',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', width: '20px', textAlign: 'right' }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step mastery radar */}
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 20px', fontFamily: 'sans-serif' }}>
              Step Mastery
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {FRAMEWORK_STEPS.map((step) => {
                const mastery = stats.stepMastery[step.id as StepId] ?? 0;
                return (
                  <div key={step.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '14px' }}>{step.icon}</span>
                        <span style={{ fontSize: '13px', color: 'var(--ink)', fontFamily: 'sans-serif' }}>{step.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: mastery > 0 ? step.color : 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>
                          {mastery > 0 ? `${mastery}%` : '—'}
                        </span>
                        {mastery >= 80 && (
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '8px', background: `${step.color}15`, color: step.color, fontFamily: 'sans-serif' }}>
                            Expert
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ height: '6px', background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden' }}>
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
        </div>

        {/* Recent XP chart */}
        {xpHistory.length > 0 && (
          <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: '0 0 24px', fontFamily: 'sans-serif' }}>
              Recent XP Earned
            </h2>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '120px' }}>
              {xpHistory.map((h, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '11px', color: 'var(--copper)', fontFamily: 'sans-serif', fontWeight: '600' }}>{h.xp}</span>
                  <div
                    style={{
                      width: '100%',
                      height: `${(h.xp / maxXp) * 100}px`,
                      background: 'linear-gradient(180deg, var(--copper-light), var(--copper))',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.6s ease',
                      minHeight: '4px',
                    }}
                  />
                  <span style={{ fontSize: '10px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif' }}>{h.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges grid */}
        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: '12px', padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--navy)', margin: 0, fontFamily: 'sans-serif' }}>
              All Badges
            </h2>
            <span style={{ fontSize: '13px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>
              {earnedBadges.length} / {BADGES.length} unlocked
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {sortedBadges.map((badge) => {
              const earned = stats.badges.includes(badge.id as BadgeId);
              const color = rarityColors[badge.rarity];
              return (
                <div
                  key={badge.id}
                  style={{
                    padding: '20px',
                    border: `1px solid ${earned ? `${color}30` : 'var(--border)'}`,
                    borderRadius: '12px',
                    background: earned ? `${color}06` : 'var(--surface-raised)',
                    opacity: earned ? 1 : 0.5,
                    position: 'relative',
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {!earned && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        fontSize: '12px',
                        color: 'var(--ink-subtle)',
                      }}
                    >
                      🔒
                    </div>
                  )}
                  <div style={{ fontSize: '28px', marginBottom: '10px' }}>{badge.icon}</div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: earned ? color : 'var(--ink-muted)', fontFamily: 'sans-serif', marginBottom: '4px' }}>
                    {badge.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontFamily: 'sans-serif', lineHeight: 1.5, marginBottom: '10px' }}>
                    {badge.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: earned ? color : 'var(--ink-subtle)',
                        fontFamily: 'sans-serif',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        background: earned ? `${color}15` : 'transparent',
                      }}
                    >
                      {badge.rarity}
                    </span>
                    <span style={{ fontSize: '12px', color: earned ? 'var(--copper)' : 'var(--ink-subtle)', fontFamily: 'sans-serif', fontWeight: '500' }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ fontSize: '22px', fontWeight: '700', color: 'white', fontFamily: 'sans-serif', lineHeight: 1.1 }}>{value}</div>
      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontFamily: 'sans-serif', marginTop: '2px' }}>{sub}</div>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={{ padding: '14px', background: 'var(--surface-raised)', borderRadius: '8px' }}>
      <div style={{ fontSize: '11px', color: 'var(--ink-subtle)', fontFamily: 'sans-serif', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: '700', color, fontFamily: 'sans-serif', letterSpacing: '-0.02em' }}>
        {value}
      </div>
    </div>
  );
}
