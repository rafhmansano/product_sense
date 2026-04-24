'use client';

import AppShell from '@/components/AppShell';
import OnboardingTour from '@/components/OnboardingTour';
import { useAppStore } from '@/lib/store';
import Link from 'next/link';

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateStr + 'T00:00:00');
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function QuickCard({
  emoji,
  label,
  value,
  sub,
  color,
  href,
}: {
  emoji: string;
  label: string;
  value: string;
  sub?: string;
  color: string;
  href: string;
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div
        className="card"
        style={{
          padding: '18px',
          borderRadius: '16px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          cursor: 'pointer',
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{ fontSize: '28px', marginBottom: '8px' }}>{emoji}</div>
        <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--ink-subtle)', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '16px', fontWeight: '700', color, lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', flex: 1 }}>
          {value}
        </div>
        {sub && (
          <div style={{ fontSize: '12px', color: 'var(--ink-muted)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {sub}
          </div>
        )}
      </div>
    </Link>
  );
}

function ProgressBar({ value, max, color, height = 8 }: { value: number; max: number; color: string; height?: number }) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div style={{ height: `${height}px`, background: 'var(--border)', borderRadius: '9999px', overflow: 'hidden', width: '100%' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '9999px', transition: 'width 0.8s ease' }} />
    </div>
  );
}

const EVENT_EMOJIS: Record<string, string> = {
  logistica: '🚐',
  hospedagem: '🏨',
  parque: '🎢',
  show: '🎭',
  restaurante: '🍽️',
  lembrete: '📌',
  saude: '🏥',
  financeiro: '💰',
};

interface TodayItem {
  time: string;
  icon: string;
  title: string;
  subtitle: string;
  color: string;
  href: string;
}

export default function Dashboard() {
  const {
    trip,
    flights,
    hotels,
    carRentals,
    events,
    budgetCategories,
    expenses,
    documents,
    exchangeRate,
  } = useAppStore();

  const today = getTodayString();

  // Derive trip dates from flights if trip dates not set manually
  const outboundFlight = flights.find((f) => f.type === 'ida');
  const returnFlight = flights.find((f) => f.type === 'volta');
  const departureDate = trip.startDate || outboundFlight?.departureDate || '';
  const returnDate = trip.endDate || returnFlight?.departureDate || '';

  // Countdown
  const hasStartDate = departureDate !== '';
  const daysLeft = hasStartDate ? getDaysUntil(departureDate) : null;

  // Documents progress
  const docsCompleted = documents.filter((d) => d.status === 'concluido').length;
  const docsTotal = documents.length;

  // Budget totals
  const totalPlannedBRL = budgetCategories.reduce((sum, c) => sum + c.plannedBRL + c.plannedUSD * exchangeRate, 0);
  const totalSpentBRL = expenses.reduce((sum, e) => sum + (e.currency === 'BRL' ? e.amount : e.amount * exchangeRate), 0);

  // Next 3 upcoming events
  const now = new Date();
  const upcomingEvents = [...events]
    .filter((e) => {
      const eventDate = new Date(e.date + 'T' + (e.time || '00:00'));
      return eventDate >= now && !e.completed;
    })
    .sort((a, b) => {
      const da = new Date(a.date + 'T' + (a.time || '00:00'));
      const db = new Date(b.date + 'T' + (b.time || '00:00'));
      return da.getTime() - db.getTime();
    })
    .slice(0, 3);

  // === TODAY'S PLAN ===
  const todayItems: TodayItem[] = [];

  flights.filter((f) => f.departureDate === today).forEach((f) => {
    todayItems.push({
      time: f.departureTime || '',
      icon: '🛫',
      title: `Embarque ${f.airline} ${f.flightNumber}`,
      subtitle: `${f.originCode || f.origin} → ${f.destinationCode || f.destination}`,
      color: 'var(--ocean)',
      href: '/voos',
    });
  });

  flights.filter((f) => f.arrivalDate === today).forEach((f) => {
    todayItems.push({
      time: f.arrivalTime || '',
      icon: '🛬',
      title: `Chegada ${f.airline} ${f.flightNumber}`,
      subtitle: `${f.originCode || f.origin} → ${f.destinationCode || f.destination}`,
      color: 'var(--sky)',
      href: '/voos',
    });
  });

  hotels.filter((h) => h.checkInDate === today).forEach((h) => {
    todayItems.push({
      time: h.checkInTime || '',
      icon: '🏨',
      title: `Check-in: ${h.name}`,
      subtitle: h.address || '',
      color: 'var(--sunset)',
      href: '/hotel',
    });
  });

  hotels.filter((h) => h.checkOutDate === today).forEach((h) => {
    todayItems.push({
      time: h.checkOutTime || '',
      icon: '🧳',
      title: `Check-out: ${h.name}`,
      subtitle: h.address || '',
      color: 'var(--coral)',
      href: '/hotel',
    });
  });

  carRentals.filter((c) => c.pickupDate === today).forEach((c) => {
    todayItems.push({
      time: c.pickupTime || '',
      icon: '🚗',
      title: `Retirar carro: ${c.company}`,
      subtitle: c.pickupLocation || '',
      color: 'var(--purple)',
      href: '/carro',
    });
  });

  carRentals.filter((c) => c.returnDate === today).forEach((c) => {
    todayItems.push({
      time: c.returnTime || '',
      icon: '🔑',
      title: `Devolver carro: ${c.company}`,
      subtitle: c.returnLocation || '',
      color: 'var(--purple)',
      href: '/carro',
    });
  });

  events
    .filter((e) => e.date === today && !e.completed)
    .forEach((e) => {
      todayItems.push({
        time: e.time || '',
        icon: EVENT_EMOJIS[e.type] || '📌',
        title: e.title,
        subtitle: e.description || '',
        color: 'var(--ink)',
        href: '/agenda',
      });
    });

  todayItems.sort((a, b) => {
    if (!a.time) return 1;
    if (!b.time) return -1;
    return a.time.localeCompare(b.time);
  });

  const hasTodayItems = todayItems.length > 0;

  // Quick card values for hotels/cars
  const hotelValue =
    hotels.length === 0
      ? 'Não definido'
      : hotels.length === 1
      ? hotels[0].name
      : `${hotels.length} hospedagens`;

  const hotelSub =
    hotels.length > 0
      ? hotels[0].checkInDate
        ? `Check-in: ${new Date(hotels[0].checkInDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}`
        : 'Cadastrado'
      : 'Adicione a hospedagem';

  const carValue =
    carRentals.length === 0
      ? 'Não definido'
      : carRentals.length === 1
      ? carRentals[0].company
      : `${carRentals.length} alugueis`;

  const carSub =
    carRentals.length > 0
      ? carRentals[0].vehicleCategory || 'Reservado'
      : 'Adicione o aluguel';

  const flightStatus =
    flights.length === 0 ? 'Nenhum voo' : flights.length === 1 ? '1 voo registrado' : `${flights.length} voos registrados`;

  const flightSub =
    flights.length > 0
      ? flights.some((f) => f.status === 'confirmado')
        ? 'Confirmado ✓'
        : 'Pendente'
      : 'Adicione seus voos';

  return (
    <AppShell>
      <OnboardingTour />
      <div className="animate-fade-in dashboard-content" style={{ padding: '40px 48px', maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-subtle)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ✈️ {trip.originCode} → {trip.destinationCode} · {trip.destination}
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: '700', letterSpacing: '-0.03em', color: 'var(--ink)', margin: 0, lineHeight: 1.15 }}>
            Family Trip Manager
          </h1>
          <p style={{ fontSize: '15px', color: 'var(--ink-muted)', marginTop: '8px', lineHeight: 1.5 }}>
            Tudo sobre a viagem da família em um só lugar. 🌴
          </p>
        </div>

        {/* TODAY'S PLAN — shown when there are events today (replaces/supplements countdown) */}
        {hasTodayItems ? (
          <div
            style={{
              background: 'linear-gradient(135deg, #1A2744, #2E4A8C)',
              borderRadius: '20px',
              padding: '28px 32px',
              marginBottom: '32px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', right: '24px', top: '50%', transform: 'translateY(-50%)', fontSize: '64px', opacity: 0.1, lineHeight: 1 }}>
              📅
            </div>
            <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.85, marginBottom: '8px' }}>
              {new Date(today + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
            <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px', letterSpacing: '-0.01em' }}>
              Programação de Hoje
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {todayItems.map((item, i) => (
                <Link key={i} href={item.href} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '12px 16px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                  >
                    {item.time && (
                      <div style={{ fontSize: '13px', fontWeight: '700', opacity: 0.9, minWidth: '38px' }}>
                        {item.time}
                      </div>
                    )}
                    <span style={{ fontSize: '22px', flexShrink: 0 }}>{item.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.title}
                      </div>
                      {item.subtitle && (
                        <div style={{ fontSize: '12px', opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                          {item.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Countdown Banner — shown when no events today */
          <div
            style={{
              background: 'linear-gradient(135deg, var(--ocean), var(--sky))',
              borderRadius: '20px',
              padding: '32px 36px',
              marginBottom: '32px',
              color: 'white',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)', fontSize: '72px', opacity: 0.15, lineHeight: 1 }}>
              🏰
            </div>
            {hasStartDate && daysLeft !== null ? (
              <>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.85, marginBottom: '4px' }}>
                  {daysLeft > 0 ? 'Contagem regressiva' : daysLeft === 0 ? 'Hoje é o dia!' : 'Viagem em andamento'}
                </div>
                <div style={{ fontSize: '56px', fontWeight: '800', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                  {daysLeft > 0 ? daysLeft : daysLeft === 0 ? '🎉' : Math.abs(daysLeft)}
                  {daysLeft > 0 && (
                    <span style={{ fontSize: '22px', fontWeight: '500', marginLeft: '8px', opacity: 0.85 }}>
                      {daysLeft === 1 ? 'dia' : 'dias'}
                    </span>
                  )}
                  {daysLeft < 0 && (
                    <span style={{ fontSize: '22px', fontWeight: '500', marginLeft: '8px', opacity: 0.85 }}>
                      {Math.abs(daysLeft) === 1 ? 'dia viajando' : 'dias viajando'}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                  {new Date(departureDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  {returnDate && (
                    <> — {new Date(returnDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.85, marginBottom: '8px' }}>
                  Contagem regressiva
                </div>
                <div style={{ fontSize: '24px', fontWeight: '600' }}>
                  Defina a data da viagem
                </div>
                <div style={{ fontSize: '14px', opacity: 0.8, marginTop: '4px' }}>
                  Cadastre seus voos ou defina as datas manualmente.
                </div>
              </>
            )}
          </div>
        )}

        {/* Quick Info Cards */}
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', marginBottom: '32px' }}
          className="stagger-children quick-cards-grid"
        >
          <QuickCard emoji="✈️" label="Voos" value={flightStatus} sub={flightSub} color="var(--ocean)" href="/voos" />
          <QuickCard emoji="🏨" label="Hotel" value={hotelValue} sub={hotelSub} color="var(--sunset)" href="/hotel" />
          <QuickCard emoji="🚗" label="Carro" value={carValue} sub={carSub} color="var(--purple)" href="/carro" />
          <QuickCard
            emoji="📄"
            label="Documentos"
            value={`${docsCompleted} / ${docsTotal}`}
            sub={docsCompleted === docsTotal && docsTotal > 0 ? 'Tudo pronto! ✓' : 'concluídos'}
            color="var(--green)"
            href="/documentos"
          />
          <QuickCard
            emoji="💰"
            label="Orçamento"
            value={`R$ ${totalSpentBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            sub={`de R$ ${totalPlannedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} planejado`}
            color="var(--coral)"
            href="/orcamento"
          />
        </div>

        {/* Two column: Upcoming Events + Budget/Documents */}
        <div className="dashboard-two-col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Next Events */}
          <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>
                📅 Próximos Eventos
              </h2>
              <Link href="/agenda" style={{ fontSize: '12px', color: 'var(--ocean)', textDecoration: 'none' }}>
                Ver agenda →
              </Link>
            </div>
            {upcomingEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '28px 0' }}>
                <div style={{ fontSize: '36px', marginBottom: '10px', opacity: 0.3 }}>🗓️</div>
                <p style={{ color: 'var(--ink-muted)', fontSize: '14px', margin: '0 0 14px' }}>
                  Nenhum evento próximo.
                </p>
                <Link href="/agenda" className="btn-primary" style={{ display: 'inline-block', padding: '8px 20px', background: 'var(--ocean)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '13px' }}>
                  Adicionar evento
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingEvents.map((ev) => (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: '10px', background: 'var(--background)' }}>
                    <div style={{ fontSize: '22px', flexShrink: 0 }}>{EVENT_EMOJIS[ev.type] || '📌'}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ev.title}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ink-subtle)', marginTop: '2px' }}>
                        {new Date(ev.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
                        {ev.time && ` as ${ev.time}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Budget + Documents Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Budget Progress */}
            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>💸 Orçamento Geral</h2>
                <Link href="/orcamento" style={{ fontSize: '12px', color: 'var(--ocean)', textDecoration: 'none' }}>
                  Detalhes →
                </Link>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Gasto</span>
                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    R$ {totalSpentBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    {' / '}
                    R$ {totalPlannedBRL.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </span>
                </div>
                <ProgressBar
                  value={totalSpentBRL}
                  max={totalPlannedBRL}
                  color={
                    totalPlannedBRL > 0 && totalSpentBRL / totalPlannedBRL > 0.9
                      ? 'var(--coral)'
                      : totalPlannedBRL > 0 && totalSpentBRL / totalPlannedBRL > 0.7
                      ? 'var(--sunset)'
                      : 'var(--green)'
                  }
                  height={10}
                />
              </div>
              {totalPlannedBRL > 0 && (
                <div style={{ fontSize: '12px', color: 'var(--ink-subtle)' }}>
                  {Math.round((totalSpentBRL / totalPlannedBRL) * 100)}% utilizado
                  {totalSpentBRL < totalPlannedBRL && (
                    <> · R$ {(totalPlannedBRL - totalSpentBRL).toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} disponível</>
                  )}
                </div>
              )}
            </div>

            {/* Documents Status */}
            <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: 0 }}>📋 Documentos</h2>
                <Link href="/documentos" style={{ fontSize: '12px', color: 'var(--ocean)', textDecoration: 'none' }}>
                  Ver todos →
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: docsCompleted === docsTotal && docsTotal > 0 ? 'linear-gradient(135deg, var(--green), #34d399)' : 'linear-gradient(135deg, var(--sky), var(--ocean))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '16px', fontWeight: '700', flexShrink: 0,
                }}>
                  {docsTotal > 0 ? `${Math.round((docsCompleted / docsTotal) * 100)}%` : '—'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)', marginBottom: '6px' }}>
                    {docsCompleted} de {docsTotal} concluídos
                  </div>
                  <ProgressBar value={docsCompleted} max={docsTotal} color={docsCompleted === docsTotal && docsTotal > 0 ? 'var(--green)' : 'var(--sky)'} height={6} />
                  <div style={{ fontSize: '12px', color: 'var(--ink-subtle)', marginTop: '4px' }}>
                    {documents.filter((d) => d.status === 'pendente').length > 0 && (
                      <>{documents.filter((d) => d.status === 'pendente').length} pendente(s)</>
                    )}
                    {documents.filter((d) => d.status === 'nao-iniciado').length > 0 && (
                      <>
                        {documents.filter((d) => d.status === 'pendente').length > 0 ? ' · ' : ''}
                        {documents.filter((d) => d.status === 'nao-iniciado').length} não iniciado(s)
                      </>
                    )}
                    {docsCompleted === docsTotal && docsTotal > 0 && 'Tudo pronto! 🎉'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Family Members */}
        <div className="card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '16px', padding: '24px', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', color: 'var(--ink)', margin: '0 0 16px' }}>
            👨‍👩‍👦 Viajantes
          </h2>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {trip.members.map((member, i) => {
              const ROLE_EMOJI_MAP: Record<string, string> = { pai: '👨', mae: '👩', bebe: '👶', crianca: '👦', adolescente: '🧑', avo: '👴', 'avó': '👵', tio: '👨', tia: '👩', outro: '👤' };
              const ROLE_LABEL_MAP: Record<string, string> = { pai: 'Pai', mae: 'Mãe', bebe: 'Bebê', crianca: 'Criança', adolescente: 'Adolescente', avo: 'Avô', 'avó': 'Avó', tio: 'Tio', tia: 'Tia', outro: 'Outro' };
              const roleEmoji = ROLE_EMOJI_MAP[member.role] || '👤';
              const roleLabel = ROLE_LABEL_MAP[member.role] || member.role;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: 'var(--background)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <span style={{ fontSize: '24px' }}>{roleEmoji}</span>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--ink)' }}>{member.name || roleLabel}</div>
                    <div style={{ fontSize: '11px', color: 'var(--ink-subtle)' }}>
                      {roleLabel}
                      {member.age !== undefined && ` · ${member.age} anos`}
                      {member.heightCm !== undefined && ` · ${member.heightCm}cm`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/agenda" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--ocean)', color: 'white', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
            📅 Ver Agenda
          </Link>
          <Link href="/orcamento" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--surface)', color: 'var(--ink)', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', border: '1px solid var(--border)' }}>
            💰 Gerenciar Gastos
          </Link>
          <Link href="/parques" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', background: 'var(--surface)', color: 'var(--ink)', borderRadius: '10px', textDecoration: 'none', fontSize: '14px', fontWeight: '600', border: '1px solid var(--border)' }}>
            🎢 Guia dos Parques
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
