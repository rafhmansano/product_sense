'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import ShareButton from './ShareButton';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '⌂' },
  { href: '/familia', label: 'Família', icon: '◎' },
  { href: '/voos', label: 'Voos', icon: '◈' },
  { href: '/hotel', label: 'Hotel', icon: '◫' },
  { href: '/carro', label: 'Carro', icon: '◉' },
  { href: '/agenda', label: 'Agenda', icon: '◷' },
  { href: '/orcamento', label: 'Orçamento', icon: '◑' },
  { href: '/gastos', label: 'Gastos', icon: '◐' },
  { href: '/parques', label: 'Parques', icon: '◆' },
  { href: '/alimentacao', label: 'Alimentação', icon: '◇' },
  { href: '/mala', label: 'Mala', icon: '◻' },
  { href: '/mochila', label: 'Mochila', icon: '◼' },
  { href: '/listas', label: 'Compras', icon: '◈' },
  { href: '/documentos', label: 'Documentos', icon: '◱' },
  { href: '/dicas', label: 'Dicas', icon: '◎' },
];

// Map emoji for display (unicode shapes don't render well)
const navEmoji: Record<string, string> = {
  '/':            '🏠',
  '/familia':     '👨‍👩‍👦',
  '/voos':        '✈️',
  '/hotel':       '🏨',
  '/carro':       '🚗',
  '/agenda':      '📅',
  '/orcamento':   '💰',
  '/gastos':      '🧾',
  '/parques':     '🏰',
  '/alimentacao': '🍽️',
  '/mala':        '🧳',
  '/mochila':     '🎒',
  '/listas':      '🛒',
  '/documentos':  '📋',
  '/dicas':       '💡',
};

function FamilyInfo() {
  const members = useAppStore((s) => s.trip.members);
  const flights = useAppStore((s) => s.flights);
  const familyName = useAppStore((s) => s.familyName);

  const outbound = flights.find((f) => f.type === 'ida');
  const hasFlights = flights.length > 0;
  const routeDisplay = outbound
    ? `${outbound.originCode} → ${outbound.destinationCode}`
    : hasFlights
      ? `${flights[0].originCode} → ${flights[0].destinationCode}`
      : null;

  const memberDisplay =
    members.length > 0
      ? members.map((m) => m.name || m.role).join(', ')
      : null;

  if (!familyName && !routeDisplay && !memberDisplay) return null;

  return (
    <div style={{
      padding: '10px 16px 12px',
      marginBottom: '4px',
      borderBottom: '0.5px solid rgba(0,0,0,0.08)',
    }}>
      {familyName && (
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#1D1D1F', letterSpacing: '-0.01em', marginBottom: '2px' }}>
          {familyName}
        </div>
      )}
      {routeDisplay && (
        <div style={{ fontSize: '11px', color: '#86868B', fontVariantNumeric: 'tabular-nums' }}>
          {routeDisplay}
        </div>
      )}
      {memberDisplay && (
        <div style={{ fontSize: '11px', color: '#6E6E73', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {memberDisplay}
        </div>
      )}
    </div>
  );
}

function useTripYear() {
  const flights = useAppStore((s) => s.flights);
  const outbound = flights.find((f) => f.type === 'ida');
  const dateStr = outbound?.departureDate || (flights.length > 0 ? flights[0].departureDate : '');
  if (dateStr) {
    const year = new Date(dateStr + 'T00:00:00').getFullYear();
    if (!isNaN(year)) return year;
  }
  return null;
}

function NavLink({ href, label, isActive }: { href: string; label: string; isActive: boolean }) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        margin: '1px 8px',
        textDecoration: 'none',
        color: isActive ? '#0071E3' : 'rgba(29,29,31,0.75)',
        background: isActive ? 'rgba(0,113,227,0.08)' : 'transparent',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: isActive ? '500' : '400',
        letterSpacing: '-0.005em',
        transition: 'background 0.12s, color 0.12s',
      }}
    >
      <span style={{ fontSize: '15px', width: '20px', textAlign: 'center', flexShrink: 0, lineHeight: 1 }}>
        {navEmoji[href]}
      </span>
      {label}
    </Link>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const year = useTripYear();

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  useEffect(() => { setDrawerOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const sidebarStyle: React.CSSProperties = {
    background: 'rgba(246,246,248,0.97)',
    backdropFilter: 'blur(24px) saturate(180%)',
    WebkitBackdropFilter: 'blur(24px) saturate(180%)',
    borderRight: '0.5px solid rgba(0,0,0,0.1)',
    width: '240px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 50,
  };

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <nav className="desktop-sidebar" style={sidebarStyle}>

        {/* Logo */}
        <div style={{ padding: '20px 20px 14px', borderBottom: '0.5px solid rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#86868B', fontWeight: '500', marginBottom: '3px' }}>
            Family Trip
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', letterSpacing: '-0.025em', color: '#1D1D1F', lineHeight: 1.2 }}>
            Orlando {year || '2026'} ✈️
          </div>
        </div>

        {/* Trip info */}
        <FamilyInfo />

        {/* Nav links */}
        <div style={{ flex: 1, padding: '6px 0', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return <NavLink key={item.href} href={item.href} label={item.label} isActive={isActive} />;
          })}
        </div>

        {/* Bottom: share + sign out */}
        <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <ShareButton />
          {isSupabaseConfigured() && user && (
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', width: '100%',
                padding: '7px 12px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: '#6E6E73',
                cursor: 'pointer',
                fontSize: '13px',
                transition: 'background 0.12s, color 0.12s',
                textAlign: 'left',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#FF3B30'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#6E6E73'; }}
            >
              <span style={{ fontSize: '14px' }}>🚪</span> Sair
            </button>
          )}
        </div>
      </nav>

      {/* ── Mobile header ── */}
      <header
        className="mobile-header"
        style={{
          display: 'none',
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(246,246,248,0.95)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          height: '56px',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '0.5px solid rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
          style={{
            background: 'rgba(0,0,0,0.06)',
            border: 'none',
            borderRadius: '8px',
            color: '#1D1D1F',
            cursor: 'pointer',
            padding: '8px 10px',
            display: 'flex', flexDirection: 'column', gap: '4px',
          }}
        >
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: '#1D1D1F', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '16px', height: '1.5px', background: '#1D1D1F', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '10px', height: '1.5px', background: 'rgba(29,29,31,0.5)', borderRadius: '1px' }} />
        </button>

        <div style={{ fontSize: '15px', fontWeight: '600', color: '#1D1D1F', letterSpacing: '-0.02em' }}>
          Family Trip ✈️
        </div>

        <div style={{ width: '38px' }} />
      </header>

      {/* ── Mobile backdrop ── */}
      <div
        className="mobile-drawer-backdrop"
        onClick={() => setDrawerOpen(false)}
        style={{
          display: 'none', position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.25s ease',
        }}
      />

      {/* ── Mobile drawer ── */}
      <nav
        className="mobile-drawer"
        style={{
          display: 'none', position: 'fixed',
          top: 0, left: 0, bottom: 0,
          width: '280px', maxWidth: '85vw',
          background: 'rgba(246,246,248,0.98)',
          backdropFilter: 'blur(24px)',
          zIndex: 201,
          flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          boxShadow: drawerOpen ? '4px 0 40px rgba(0,0,0,0.12)' : 'none',
          borderRight: '0.5px solid rgba(0,0,0,0.1)',
        }}
      >
        {/* Drawer header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '0.5px solid rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#86868B', fontWeight: '500', marginBottom: '3px' }}>
              Family Trip
            </div>
            <div style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.025em', color: '#1D1D1F' }}>
              Orlando {year || '2026'} ✈️
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
            style={{
              background: 'rgba(0,0,0,0.06)', border: 'none', color: '#1D1D1F',
              cursor: 'pointer', padding: '8px', borderRadius: '8px',
              fontSize: '16px', lineHeight: 1,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '34px', height: '34px',
            }}
          >
            ✕
          </button>
        </div>

        <FamilyInfo />

        {/* Drawer nav */}
        <div style={{ flex: 1, padding: '8px 0' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 16px', margin: '1px 8px',
                  textDecoration: 'none',
                  color: isActive ? '#0071E3' : 'rgba(29,29,31,0.75)',
                  background: isActive ? 'rgba(0,113,227,0.08)' : 'transparent',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: isActive ? '500' : '400',
                  transition: 'background 0.12s',
                }}
              >
                <span style={{ fontSize: '19px', width: '26px', textAlign: 'center', flexShrink: 0 }}>
                  {navEmoji[item.href]}
                </span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Share */}
        <div style={{ padding: '10px 16px', borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
          <ShareButton />
        </div>

        {/* Logout */}
        {isSupabaseConfigured() && user && (
          <div style={{ padding: '4px 16px 12px' }}>
            <button
              onClick={handleSignOut}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
                padding: '11px 16px',
                background: 'rgba(255,59,48,0.06)',
                border: 'none',
                borderRadius: '10px',
                color: '#FF3B30',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: '17px' }}>🚪</span> Sair da conta
            </button>
          </div>
        )}

        <div style={{
          padding: '8px 20px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          fontSize: '11px',
          color: '#AEAEB2',
        }}>
          Family Trip Manager v1.0
        </div>
      </nav>
    </>
  );
}
