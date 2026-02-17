'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { calculateLevel } from '@/lib/framework';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◎' },
  { href: '/framework', label: 'Framework', icon: '⬡' },
  { href: '/practice', label: 'Practice', icon: '◈' },
  { href: '/library', label: 'Library', icon: '◇' },
  { href: '/progress', label: 'Progress', icon: '★' },
];

export default function Navigation() {
  const pathname = usePathname();
  const stats = useAppStore((s) => s.stats);
  const { level, progressPercent } = calculateLevel(stats.xp);

  return (
    <nav
      style={{
        background: 'var(--navy)',
        color: 'white',
        width: '220px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: '4px',
            fontFamily: 'sans-serif',
          }}
        >
          Product Sense
        </div>
        <div
          style={{
            fontSize: '18px',
            fontWeight: '700',
            letterSpacing: '-0.03em',
            color: 'white',
            lineHeight: '1.2',
          }}
        >
          Interview<br />Framework
        </div>
      </div>

      {/* Level badge */}
      <div
        style={{
          padding: '16px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--copper), var(--copper-light))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: '700',
              color: 'white',
              flexShrink: 0,
              fontFamily: 'sans-serif',
            }}
          >
            {level}
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', letterSpacing: '0.05em' }}>
              LEVEL {level}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', fontFamily: 'sans-serif' }}>
              {stats.xp.toLocaleString()} XP
            </div>
          </div>
        </div>
        {/* XP progress bar */}
        <div
          style={{
            height: '3px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '9999px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, var(--copper), var(--copper-light))',
              borderRadius: '9999px',
              transition: 'width 0.6s ease',
            }}
          />
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontFamily: 'sans-serif', marginTop: '4px' }}>
          {stats.xpToNextLevel} XP to Level {level + 1}
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, padding: '12px 0' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 24px',
                textDecoration: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--copper)' : '2px solid transparent',
                transition: 'all 0.15s ease',
                fontFamily: 'sans-serif',
                fontSize: '14px',
                fontWeight: isActive ? '500' : '400',
                letterSpacing: '0.01em',
              }}
            >
              <span style={{ fontSize: '16px', opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Streak + badges */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {stats.streak > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px' }}>🔥</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'sans-serif' }}>
              {stats.streak}-day streak
            </span>
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {stats.badges.slice(0, 4).map((badgeId) => (
            <div
              key={badgeId}
              title={badgeId.replace(/_/g, ' ')}
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
              }}
            >
              ◈
            </div>
          ))}
          {stats.badges.length > 4 && (
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                color: 'rgba(255,255,255,0.5)',
                fontFamily: 'sans-serif',
              }}
            >
              +{stats.badges.length - 4}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
