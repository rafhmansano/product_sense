'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import ShareButton from './ShareButton';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/familia', label: 'Familia', icon: '👨‍👩‍👦' },
  { href: '/voos', label: 'Voos', icon: '✈️' },
  { href: '/hotel', label: 'Hotel', icon: '🏨' },
  { href: '/carro', label: 'Carro', icon: '🚗' },
  { href: '/agenda', label: 'Agenda', icon: '📅' },
  { href: '/orcamento', label: 'Orcamento', icon: '💰' },
  { href: '/gastos', label: 'Gastos', icon: '🧾' },
  { href: '/parques', label: 'Parques', icon: '🏰' },
  { href: '/alimentacao', label: 'Alimentacao', icon: '🍽️' },
  { href: '/mala', label: 'Mala', icon: '🧳' },
  { href: '/mochila', label: 'Mochila', icon: '🎒' },
  { href: '/listas', label: 'Compras', icon: '🛒' },
  { href: '/documentos', label: 'Documentos', icon: '📋' },
  { href: '/dicas', label: 'Dicas', icon: '💡' },
];

function FamilyInfo() {
  const members = useAppStore((s) => s.trip.members);
  const trip = useAppStore((s) => s.trip);

  const memberDisplay = members.length > 0
    ? members.map((m) => m.name || m.role).join(', ')
    : 'Sem viajantes';

  return (
    <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
      <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>
        {trip.originCode || 'GRU'} → {trip.destinationCode || 'MCO'}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.4 }}>
        {memberDisplay}
      </div>
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      {/* Desktop sidebar */}
      <nav
        className="desktop-sidebar"
        style={{
          background: 'var(--ocean)',
          color: 'white',
          width: '220px',
          minHeight: '100vh',
          flexDirection: 'column',
          position: 'fixed',
          left: 0,
          top: 0,
          zIndex: 50,
          borderRight: '1px solid rgba(255,255,255,0.06)',
          overflowY: 'auto',
        }}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
            Family Trip
          </div>
          <div style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.02em', color: 'white', lineHeight: 1.2 }}>
            Orlando<br />2026 ✈️
          </div>
        </div>

        {/* Trip info with dynamic member names */}
        <FamilyInfo />

        {/* Nav links */}
        <div style={{ flex: 1, padding: '8px 0' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 20px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.55)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--sky)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                <span style={{ fontSize: '15px' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Share */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <ShareButton />
        </div>

        {/* Footer */}
        <div style={{ padding: '10px 20px', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
          Family Trip Manager v1.0
        </div>
      </nav>

      {/* Mobile top header with hamburger */}
      <header
        className="mobile-header"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'var(--ocean)',
          height: '56px',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* Hamburger button */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu"
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '-8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
          }}
        >
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'white', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '22px', height: '2px', background: 'white', borderRadius: '1px' }} />
          <span style={{ display: 'block', width: '16px', height: '2px', background: 'white', borderRadius: '1px' }} />
        </button>

        {/* Title */}
        <div style={{ fontSize: '15px', fontWeight: '600', color: 'white', letterSpacing: '-0.01em' }}>
          Family Trip ✈️
        </div>

        {/* Spacer to balance layout */}
        <div style={{ width: '38px' }} />
      </header>

      {/* Mobile drawer backdrop */}
      <div
        className="mobile-drawer-backdrop"
        onClick={() => setDrawerOpen(false)}
        style={{
          display: 'none',
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 200,
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Mobile drawer */}
      <nav
        className="mobile-drawer"
        style={{
          display: 'none',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          maxWidth: '85vw',
          background: 'var(--ocean)',
          zIndex: 201,
          flexDirection: 'column',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {/* Drawer header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>
              Family Trip
            </div>
            <div style={{ fontSize: '17px', fontWeight: '700', letterSpacing: '-0.02em', color: 'white', lineHeight: 1.2 }}>
              Orlando 2026 ✈️
            </div>
          </div>
          {/* Close button */}
          <button
            onClick={() => setDrawerOpen(false)}
            aria-label="Fechar menu"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '8px',
              fontSize: '18px',
              lineHeight: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Trip info with dynamic member names */}
        <FamilyInfo />

        {/* Nav links */}
        <div style={{ flex: 1, padding: '12px 0' }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setDrawerOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '13px 20px',
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--sky)' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '400',
                }}
              >
                <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Share */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <ShareButton />
        </div>

        {/* Footer */}
        <div style={{
          padding: '10px 20px',
          paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.3)',
        }}>
          Family Trip Manager v1.0
        </div>
      </nav>
    </>
  );
}
