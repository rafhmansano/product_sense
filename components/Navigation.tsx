'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

export default function Navigation() {
  const pathname = usePathname();

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
          <div style={{ color: 'rgba(255,255,255,0.7)' }}>👨‍👩‍👧 Rafael, Jac + Filho(a)</div>
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
          justifyContent: 'space-around',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {navItems.slice(0, 6).map((item) => {
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
                padding: '4px 8px',
                textDecoration: 'none',
                color: isActive ? 'white' : 'rgba(255,255,255,0.5)',
                fontSize: '10px',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
