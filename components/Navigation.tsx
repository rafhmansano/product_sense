'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/voos', label: 'Voos', icon: '✈️' },
  { href: '/hotel', label: 'Hotel', icon: '🏨' },
  { href: '/carro', label: 'Carro', icon: '🚗' },
  { href: '/agenda', label: 'Agenda', icon: '📅' },
  { href: '/orcamento', label: 'Orcamento', icon: '💰' },
  { href: '/gastos', label: 'Gastos', icon: '🧾' },
  { href: '/parques', label: 'Parques', icon: '🏰' },
  { href: '/alimentacao', label: 'Alimentacao', icon: '🍽️' },
  { href: '/documentos', label: 'Documentos', icon: '📋' },
  { href: '/dicas', label: 'Dicas', icon: '💡' },
];

// Primary tabs shown in bottom nav (5 items max for good mobile UX)
const mobileMainItems = [
  { href: '/', label: 'Home', icon: '🏠' },
  { href: '/agenda', label: 'Agenda', icon: '📅' },
  { href: '/parques', label: 'Parques', icon: '🏰' },
  { href: '/orcamento', label: 'Gastos', icon: '💰' },
];

const mobileMoreItems = [
  { href: '/voos', label: 'Voos', icon: '✈️' },
  { href: '/hotel', label: 'Hotel', icon: '🏨' },
  { href: '/carro', label: 'Carro', icon: '🚗' },
  { href: '/gastos', label: 'Gastos', icon: '🧾' },
  { href: '/alimentacao', label: 'Alimentacao', icon: '🍽️' },
  { href: '/documentos', label: 'Documentos', icon: '📋' },
  { href: '/dicas', label: 'Dicas', icon: '💡' },
];

export default function Navigation() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isMoreActive = mobileMoreItems.some(
    (item) => pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
  );

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

        {/* Trip info */}
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '12px' }}>
          <div style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>GRU → MCO</div>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>👨‍👩‍👦 Rafael, Jac + Filho</div>
        </div>

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

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>
          Family Trip Manager v1.0
        </div>
      </nav>

      {/* Mobile "More" overlay */}
      {moreOpen && (
        <div
          className="mobile-nav-overlay"
          style={{
            display: 'none',
            position: 'fixed',
            inset: 0,
            zIndex: 60,
          }}
        >
          {/* Backdrop */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.4)',
            }}
            onClick={() => setMoreOpen(false)}
          />
          {/* Menu panel */}
          <div
            style={{
              position: 'absolute',
              bottom: '64px',
              left: '8px',
              right: '8px',
              background: 'var(--ocean)',
              borderRadius: '16px',
              padding: '8px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '4px',
              paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {mobileMoreItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMoreOpen(false)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '12px 4px',
                    textDecoration: 'none',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: isActive ? '600' : '400',
                  }}
                >
                  <span style={{ fontSize: '22px' }}>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav
        className="mobile-nav"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          background: 'var(--ocean)',
          zIndex: 50,
          padding: '6px 4px',
          paddingBottom: 'calc(6px + env(safe-area-inset-bottom, 0px))',
          justifyContent: 'space-around',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {mobileMainItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                padding: '6px 10px',
                textDecoration: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                fontSize: '10px',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              <span style={{ fontSize: '20px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
        {/* More button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '6px 10px',
            background: 'none',
            border: 'none',
            color: isMoreActive || moreOpen ? 'white' : 'rgba(255,255,255,0.5)',
            fontSize: '10px',
            fontWeight: isMoreActive ? '600' : '400',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '20px' }}>{'•••'}</span>
          Mais
        </button>
      </nav>
    </>
  );
}
