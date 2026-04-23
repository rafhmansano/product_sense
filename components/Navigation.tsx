'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, BookOpen, Zap, BookMarked, TrendingUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { calculateLevel } from '@/lib/framework';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutGrid },
  { href: '/framework', label: 'Framework', icon: BookOpen },
  { href: '/practice', label: 'Practice', icon: Zap },
  { href: '/library', label: 'Library', icon: BookMarked },
  { href: '/progress', label: 'Progress', icon: TrendingUp },
];

export default function Navigation() {
  const pathname = usePathname();
  const stats = useAppStore((s) => s.stats);
  const { level, progressPercent } = calculateLevel(stats.xp);

  return (
    <nav
      style={{
        background: 'var(--gradient-hero)',
        color: 'white',
        width: '228px',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '0',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '4px 0 24px rgba(14, 29, 61, 0.15)',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '28px 24px 22px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          position: 'relative',
        }}
      >
        {/* Accent glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--gradient-copper)',
          }}
        />
        <div
          style={{
            fontSize: '10px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)',
            marginBottom: '5px',
            fontWeight: '500',
          }}
        >
          Product Sense
        </div>
        <div
          style={{
            fontSize: '17px',
            fontWeight: '700',
            letterSpacing: '-0.025em',
            color: 'white',
            lineHeight: '1.25',
          }}
        >
          Interview<br />Framework
        </div>
      </div>

      {/* Level badge */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          margin: '0 8px',
        }}
      >
        <div
          style={{
            background: 'rgba(255,255,255,0.06)',
            borderRadius: '12px',
            padding: '12px 14px',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--gradient-copper)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: 'white',
                flexShrink: 0,
                boxShadow: 'var(--shadow-copper)',
              }}
            >
              {level}
            </div>
            <div>
              <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: '600' }}>
                Level {level}
              </div>
              <div style={{ fontSize: '13px', color: 'white', fontWeight: '600' }}>
                {stats.xp.toLocaleString()} XP
              </div>
            </div>
          </div>
          {/* XP progress bar */}
          <div
            style={{
              height: '4px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                background: 'var(--gradient-copper)',
                borderRadius: '9999px',
                transition: 'width 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 6px rgba(196,146,13,0.5)',
              }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.25)', marginTop: '5px' }}>
            {stats.xpToNextLevel} XP to next level
          </div>
        </div>
      </div>

      {/* Nav links */}
      <div style={{ flex: 1, padding: '10px 8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                padding: '10px 14px',
                textDecoration: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.45)',
                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                borderRadius: '10px',
                marginBottom: '2px',
                transition: 'all 0.18s ease',
                fontWeight: isActive ? '600' : '400',
                fontSize: '14px',
                letterSpacing: '0.005em',
                position: 'relative',
              }}
            >
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '20px',
                    background: 'var(--gradient-copper)',
                    borderRadius: '0 3px 3px 0',
                  }}
                />
              )}
              <Icon
                size={16}
                style={{
                  opacity: isActive ? 1 : 0.5,
                  flexShrink: 0,
                  strokeWidth: isActive ? 2.5 : 1.8,
                }}
              />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Streak + badges */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          margin: '0 0 0 0',
        }}
      >
        {stats.streak > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '10px',
              padding: '8px 12px',
              background: 'rgba(255,255,255,0.06)',
              borderRadius: '8px',
            }}
          >
            <span style={{ fontSize: '15px' }}>🔥</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: '500' }}>
              {stats.streak}-day streak
            </span>
          </div>
        )}
        {stats.badges.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', padding: '0 4px' }}>
            {stats.badges.slice(0, 4).map((badgeId) => (
              <div
                key={badgeId}
                title={badgeId.replace(/_/g, ' ')}
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                }}
              >
                ✦
              </div>
            ))}
            {stats.badges.length > 4 && (
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '8px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '10px',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                +{stats.badges.length - 4}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
