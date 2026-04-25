'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';

type NavChild = { href: string; label: string; emoji: string };
type NavGroup = { label: string; href?: string; children?: NavChild[] };

const NAV_GROUPS: NavGroup[] = [
  { label: 'Início', href: '/' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'Parques', href: '/parques' },
  {
    label: 'Viagem',
    children: [
      { href: '/voos', label: 'Voos', emoji: '✈️' },
      { href: '/hotel', label: 'Hotel', emoji: '🏨' },
      { href: '/carro', label: 'Carro', emoji: '🚗' },
    ],
  },
  {
    label: 'Finanças',
    children: [
      { href: '/orcamento', label: 'Orçamento', emoji: '💰' },
      { href: '/gastos', label: 'Gastos', emoji: '🧾' },
    ],
  },
  {
    label: 'Listas',
    children: [
      { href: '/listas', label: 'Compras', emoji: '🛒' },
      { href: '/mala', label: 'Mala', emoji: '🧳' },
      { href: '/mochila', label: 'Mochila', emoji: '🎒' },
    ],
  },
  {
    label: 'Guia',
    children: [
      { href: '/alimentacao', label: 'Alimentação', emoji: '🍽️' },
      { href: '/documentos', label: 'Documentos', emoji: '📋' },
      { href: '/dicas', label: 'Dicas', emoji: '💡' },
    ],
  },
  { label: 'Família', href: '/familia' },
];

function useTripInfo() {
  const flights = useAppStore((s) => s.flights);
  const familyName = useAppStore((s) => s.familyName);
  const familyInviteCode = useAppStore((s) => s.familyInviteCode);
  const outbound = flights.find((f) => f.type === 'ida');
  const dateStr = outbound?.departureDate || (flights.length > 0 ? flights[0].departureDate : '');
  const yearNum = dateStr ? new Date(dateStr + 'T00:00:00').getFullYear() : NaN;
  return { familyName, year: isNaN(yearNum) ? null : yearNum, familyInviteCode };
}

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { familyName, year, familyInviteCode } = useTripInfo();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMobileOpen(false); setOpenGroup(null); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  function openDropdown(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenGroup(label);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenGroup(null), 150);
  }
  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  async function handleSignOut() {
    await signOut();
    router.push('/login');
  }

  async function handleShare() {
    if (!familyInviteCode) return;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/onboarding?code=${familyInviteCode}`
      : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try { await navigator.share({ title: 'Family Trip Manager', url: shareUrl }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  function isGroupActive(group: NavGroup): boolean {
    if (group.href) return pathname === group.href || (group.href !== '/' && pathname.startsWith(group.href));
    return group.children?.some((c) => pathname === c.href || pathname.startsWith(c.href)) ?? false;
  }

  const NAV_H = 44;

  return (
    <>
      {/* ── Apple-style top nav bar ── */}
      <nav style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        height: `${NAV_H}px`,
        background: 'rgba(22,22,23,0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        zIndex: 1000,
        fontFamily: 'inherit',
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '0',
        }}>

          {/* Brand mark */}
          <Link href="/" style={{
            color: 'rgba(255,255,255,0.85)',
            textDecoration: 'none',
            fontSize: '18px',
            lineHeight: 1,
            marginRight: '20px',
            flexShrink: 0,
          }}>
            ✈️
          </Link>

          {/* ── Desktop nav items ── */}
          <div className="nav-desktop-items" style={{ display: 'flex', alignItems: 'center', flex: 1, height: '100%' }}>
            {NAV_GROUPS.map((group) => {
              const active = isGroupActive(group);
              const isOpen = openGroup === group.label;

              // Simple direct link
              if (group.href && !group.children) {
                return (
                  <Link key={group.label} href={group.href}
                    style={{
                      display: 'flex', alignItems: 'center',
                      height: '100%', padding: '0 11px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      color: active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.68)',
                      fontWeight: active ? '500' : '400',
                      letterSpacing: '-0.01em',
                      whiteSpace: 'nowrap',
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = active ? 'white' : 'rgba(255,255,255,0.68)')}
                  >
                    {group.label}
                  </Link>
                );
              }

              // Dropdown group
              return (
                <div key={group.label}
                  style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
                  onMouseEnter={() => openDropdown(group.label)}
                  onMouseLeave={scheduleClose}
                >
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '3px',
                    height: '100%', padding: '0 11px',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px',
                    color: active ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.68)',
                    fontWeight: active ? '500' : '400',
                    letterSpacing: '-0.01em',
                    whiteSpace: 'nowrap',
                    transition: 'color 0.15s',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = active ? 'white' : 'rgba(255,255,255,0.68)')}
                  >
                    {group.label}
                    <span style={{
                      fontSize: '8px', opacity: 0.55, marginTop: '1px',
                      display: 'inline-block',
                      transition: 'transform 0.15s',
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}>▾</span>
                  </button>

                  {/* Dropdown panel */}
                  {isOpen && (
                    <div
                      onMouseEnter={cancelClose}
                      onMouseLeave={scheduleClose}
                      style={{
                        position: 'absolute',
                        top: `${NAV_H}px`,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(255,255,255,0.98)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        borderRadius: '14px',
                        boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 0 0 0.5px rgba(0,0,0,0.06)',
                        padding: '8px',
                        minWidth: '172px',
                        zIndex: 1001,
                        animation: 'navFadeIn 0.14s ease',
                      }}
                    >
                      {group.children?.map((child) => {
                        const childActive = pathname === child.href || pathname.startsWith(child.href);
                        return (
                          <Link key={child.href} href={child.href}
                            style={{
                              display: 'flex', alignItems: 'center', gap: '10px',
                              padding: '9px 14px', borderRadius: '9px',
                              textDecoration: 'none',
                              fontSize: '14px',
                              color: childActive ? '#0071E3' : '#1D1D1F',
                              fontWeight: childActive ? '500' : '400',
                              background: childActive ? 'rgba(0,113,227,0.07)' : 'transparent',
                              transition: 'background 0.1s',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => { if (!childActive) e.currentTarget.style.background = '#F5F5F7'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = childActive ? 'rgba(0,113,227,0.07)' : 'transparent'; }}
                          >
                            <span style={{ fontSize: '16px', width: '22px', textAlign: 'center', flexShrink: 0 }}>{child.emoji}</span>
                            {child.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── Right side: share + sign out ── */}
          <div className="nav-desktop-items" style={{ display: 'flex', alignItems: 'center', gap: '2px', marginLeft: 'auto', flexShrink: 0 }}>
            {familyName && (
              <span style={{
                fontSize: '12px', color: 'rgba(255,255,255,0.38)',
                padding: '0 10px', marginRight: '2px',
                borderRight: '0.5px solid rgba(255,255,255,0.12)',
                whiteSpace: 'nowrap', letterSpacing: '-0.01em',
              }}>
                {familyName}
              </span>
            )}

            {isSupabaseConfigured() && familyInviteCode && (
              <button onClick={handleShare}
                title={copied ? 'Link copiado!' : 'Convidar para família'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  padding: '5px 12px',
                  background: copied ? 'rgba(52,199,89,0.15)' : 'rgba(255,255,255,0.1)',
                  border: `0.5px solid ${copied ? 'rgba(52,199,89,0.4)' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '20px',
                  color: copied ? '#30D158' : 'rgba(255,255,255,0.85)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; } }}
                onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; } }}
              >
                <span style={{ fontSize: '13px' }}>{copied ? '✓' : '🔗'}</span>
                {copied ? 'Copiado!' : 'Convidar'}
              </button>
            )}

            {isSupabaseConfigured() && user && (
              <button onClick={handleSignOut} title="Sair da conta"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px',
                  background: 'none', border: 'none',
                  borderRadius: '50%',
                  color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'color 0.15s, background 0.15s',
                  marginLeft: '2px',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#FF453A'; e.currentTarget.style.background = 'rgba(255,69,58,0.12)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; e.currentTarget.style.background = 'none'; }}
              >
                ⏻
              </button>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            className="nav-mobile-burger"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menu"
            style={{
              display: 'none',
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '8px',
              flexDirection: 'column', gap: '4px',
              marginLeft: 'auto',
            }}
          >
            <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.85)', borderRadius: '1px' }} />
            <span style={{ display: 'block', width: '18px', height: '1.5px', background: 'rgba(255,255,255,0.85)', borderRadius: '1px' }} />
            <span style={{ display: 'block', width: '12px', height: '1.5px', background: 'rgba(255,255,255,0.5)', borderRadius: '1px' }} />
          </button>
        </div>
      </nav>

      {/* ── Mobile backdrop ── */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 1100,
        }} />
      )}

      {/* ── Mobile drawer (slides from right) ── */}
      <nav style={{
        position: 'fixed',
        top: 0, right: 0, bottom: 0,
        width: '300px', maxWidth: '85vw',
        background: 'rgba(20,20,20,0.97)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        zIndex: 1101,
        display: 'flex',
        flexDirection: 'column',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        overflowY: 'auto',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        borderLeft: '0.5px solid rgba(255,255,255,0.08)',
      }}>
        {/* Drawer header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '15px', fontWeight: '600', letterSpacing: '-0.02em' }}>
            ✈️ Orlando {year || '2026'}
          </span>
          <button onClick={() => setMobileOpen(false)} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none',
            color: 'rgba(255,255,255,0.7)', cursor: 'pointer',
            width: '30px', height: '30px', borderRadius: '50%',
            fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* Mobile nav items */}
        <div style={{ flex: 1, padding: '10px 12px', overflowY: 'auto' }}>
          {NAV_GROUPS.map((group) => {
            if (group.href && !group.children) {
              const active = isGroupActive(group);
              return (
                <Link key={group.label} href={group.href} style={{
                  display: 'block',
                  padding: '11px 16px', borderRadius: '10px', marginBottom: '2px',
                  textDecoration: 'none',
                  fontSize: '16px',
                  color: active ? '#0A84FF' : 'rgba(255,255,255,0.85)',
                  fontWeight: active ? '500' : '400',
                  background: active ? 'rgba(10,132,255,0.12)' : 'transparent',
                }}>
                  {group.label}
                </Link>
              );
            }
            return (
              <div key={group.label} style={{ marginBottom: '4px' }}>
                <div style={{
                  fontSize: '11px', fontWeight: '600',
                  letterSpacing: '0.07em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  padding: '14px 16px 6px',
                }}>
                  {group.label}
                </div>
                {group.children?.map((child) => {
                  const active = pathname === child.href || pathname.startsWith(child.href);
                  return (
                    <Link key={child.href} href={child.href} style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '10px 16px', borderRadius: '10px', marginBottom: '2px',
                      textDecoration: 'none',
                      fontSize: '15px',
                      color: active ? '#0A84FF' : 'rgba(255,255,255,0.75)',
                      fontWeight: active ? '500' : '400',
                      background: active ? 'rgba(10,132,255,0.12)' : 'transparent',
                    }}>
                      <span style={{ fontSize: '18px', flexShrink: 0 }}>{child.emoji}</span>
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Mobile actions */}
        <div style={{
          padding: '12px 16px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 0px))',
          borderTop: '0.5px solid rgba(255,255,255,0.08)',
          display: 'flex', flexDirection: 'column', gap: '8px',
        }}>
          {familyName && (
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)', padding: '0 4px 4px', letterSpacing: '-0.01em' }}>
              {familyName}
            </div>
          )}
          {isSupabaseConfigured() && familyInviteCode && (
            <button onClick={handleShare} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '12px 16px',
              background: copied ? 'rgba(52,199,89,0.12)' : 'rgba(255,255,255,0.07)',
              border: `0.5px solid ${copied ? 'rgba(52,199,89,0.3)' : 'rgba(255,255,255,0.1)'}`,
              borderRadius: '12px',
              color: copied ? '#30D158' : 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              fontSize: '14px', fontWeight: '500',
              width: '100%',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: '16px' }}>{copied ? '✓' : '🔗'}</span>
              {copied ? 'Link copiado!' : 'Convidar para família'}
            </button>
          )}
          {isSupabaseConfigured() && user && (
            <button onClick={handleSignOut} style={{
              display: 'flex', alignItems: 'center', gap: '10px',
              padding: '11px 16px',
              background: 'rgba(255,59,48,0.08)',
              border: '0.5px solid rgba(255,59,48,0.2)',
              borderRadius: '12px',
              color: '#FF453A',
              cursor: 'pointer',
              fontSize: '14px',
              width: '100%',
            }}>
              Sair da conta
            </button>
          )}
        </div>
      </nav>

      {/* Keyframe + responsive CSS */}
      <style>{`
        @keyframes navFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @media (max-width: 800px) {
          .nav-desktop-items { display: none !important; }
          .nav-mobile-burger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
