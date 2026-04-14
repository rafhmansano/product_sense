'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { familyService } from '@/services/family.service';
import { tripService } from '@/services/trip.service';
import {
  loadTripData,
  saveTripData,
  hasMeaningfulLocalData,
  backupLocalStateToLocalStorage,
} from '@/lib/sync';
import type { TripData } from '@/lib/store';

type SyncStatus = 'idle' | 'saving' | 'saved' | 'synced' | 'error';

interface MigrationSummary {
  flights: number;
  hotel: boolean;
  carRental: boolean;
  events: number;
  expenses: number;
  members: number;
  restaurants: number;
  foodItems: number;
}

function buildSummary(data: TripData): MigrationSummary {
  return {
    flights: data.flights?.length ?? 0,
    hotel: !!data.hotel,
    carRental: !!data.carRental,
    events: data.events?.length ?? 0,
    expenses: data.expenses?.length ?? 0,
    members: data.trip?.members?.length ?? 0,
    restaurants: data.customRestaurants?.length ?? 0,
    foodItems: data.foodItems?.length ?? 0,
  };
}

function formatSyncTime(date: Date | null): string {
  if (!date) return '';
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 5) return 'agora';
  if (diffSec < 60) return `há ${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `há ${diffMin}min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `há ${diffHr}h`;
  return date.toLocaleString('pt-BR');
}

export default function TripProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const [migrationSummary, setMigrationSummary] = useState<MigrationSummary | null>(null);
  const [, forceTick] = useState(0);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const initializedRef = useRef(false);
  const tripIdRef = useRef<string | null>(null);
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();

  const {
    setFamilyName,
    setFamilyInviteCode,
    hydrateFromCloud,
    getTripData,
  } = useAppStore();

  // Main initialization
  useEffect(() => {
    if (authLoading) return;
    if (initializedRef.current) return;

    // Skip for public routes
    const publicPaths = ['/login', '/cadastro', '/compartilhado', '/onboarding'];
    if (publicPaths.some((p) => pathname.startsWith(p))) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      initializedRef.current = true;
      setLoading(false);
      return;
    }

    if (!user) {
      setLoading(false);
      return;
    }

    async function init() {
      try {
        // 1. Load family membership
        let memberData = null;
        try {
          memberData = await familyService.getMyFamily();
        } catch (err) {
          console.error('Failed to check family membership:', err);
          initializedRef.current = true;
          setLoading(false);
          return;
        }

        if (!memberData) {
          window.location.href = '/onboarding';
          return;
        }

        if (memberData.family?.name) {
          setFamilyName(memberData.family.name);
        }
        if (memberData.family?.invite_code) {
          setFamilyInviteCode(memberData.family.invite_code);
        }

        const familyId = memberData.family_id;

        // 2. Get (or create) the family's trip
        let trips: Array<{ id: string }> = [];
        try {
          trips = await tripService.getTrips(familyId);
        } catch (err) {
          console.error('getTrips failed:', err);
        }

        let trip = trips[0] ?? null;
        if (!trip) {
          try {
            trip = await tripService.createTrip(familyId, {
              name: 'Orlando 2026',
              destination: 'Orlando, FL',
              destination_code: 'MCO',
            });
          } catch (err) {
            console.error('createTrip failed:', err);
          }
        }

        if (!trip?.id) {
          console.error('No trip available for sync; using localStorage only.');
          initializedRef.current = true;
          setLoading(false);
          return;
        }

        tripIdRef.current = trip.id;

        // 3. Backup localStorage as a safety net
        backupLocalStateToLocalStorage();

        // 4. Load cloud data
        const cloudData = await loadTripData(trip.id);

        if (cloudData) {
          // Cloud has authoritative data — hydrate from it.
          hydrateFromCloud(cloudData);
          lastSavedRef.current = JSON.stringify(cloudData);
          setLastSyncedAt(new Date());
          setSyncStatus('synced');
        } else {
          // Cloud is empty. If the current browser has meaningful
          // local data, push it to the cloud (one-shot migration).
          const localData = getTripData();
          if (hasMeaningfulLocalData(localData)) {
            console.info('Migrating local state to cloud for trip', trip.id);
            setSyncStatus('saving');
            const ok = await saveTripData(trip.id, localData);
            if (ok) {
              lastSavedRef.current = JSON.stringify(localData);
              setLastSyncedAt(new Date());
              setSyncStatus('synced');
              // Show the one-shot migration confirmation banner
              setMigrationSummary(buildSummary(localData));
            } else {
              setSyncStatus('error');
            }
          } else {
            // Fresh browser with no data — persist defaults.
            const ok = await saveTripData(trip.id, localData);
            if (ok) {
              lastSavedRef.current = JSON.stringify(localData);
              setLastSyncedAt(new Date());
              setSyncStatus('synced');
            }
          }
        }
      } catch (err) {
        console.error('TripProvider init error:', err);
      }

      initializedRef.current = true;
      setLoading(false);
    }

    init();
  }, [authLoading, user, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save on store changes (debounced)
  const saveToCloud = useCallback(() => {
    const tripId = tripIdRef.current;
    if (!tripId || !isSupabaseConfigured()) return;

    const data = useAppStore.getState().getTripData();
    const serialized = JSON.stringify(data);

    if (serialized === lastSavedRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSyncStatus('saving');
    saveTimeoutRef.current = setTimeout(async () => {
      const success = await saveTripData(tripId, data);
      if (success) {
        lastSavedRef.current = serialized;
        setLastSyncedAt(new Date());
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('synced'), 1500);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('synced'), 3000);
      }
    }, 1500);
  }, []);

  // Subscribe to store changes
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const unsub = useAppStore.subscribe(() => {
      if (!loading) {
        saveToCloud();
      }
    });

    return () => unsub();
  }, [loading, saveToCloud]);

  // Reload from cloud on tab focus
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const handleFocus = async () => {
      const tripId = tripIdRef.current;
      if (!tripId) return;

      const cloudData = await loadTripData(tripId);
      if (cloudData) {
        const serialized = JSON.stringify(cloudData);
        if (serialized !== lastSavedRef.current) {
          hydrateFromCloud(cloudData);
          lastSavedRef.current = serialized;
          setLastSyncedAt(new Date());
          setSyncStatus('synced');
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [hydrateFromCloud]);

  // Tick every 30s so "há Xmin" stays current in the badge
  useEffect(() => {
    const interval = setInterval(() => forceTick((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, []);

  // Show loading for auth + data init
  if ((loading || authLoading) && isSupabaseConfigured()) {
    const publicPaths = ['/login', '/cadastro', '/compartilhado', '/onboarding'];
    if (!publicPaths.some((p) => pathname.startsWith(p))) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', gap: '16px' }}>
          <div style={{ fontSize: '40px' }}>✈️</div>
          <div style={{ fontSize: '16px', color: 'var(--ink-muted)', fontFamily: 'sans-serif' }}>Carregando viagem...</div>
        </div>
      );
    }
  }

  // Persistent sync status indicator (bottom-right). Always visible
  // after the first successful save, so the user knows at a glance
  // whether their data is safely in the cloud.
  const showStatus = isSupabaseConfigured() && syncStatus !== 'idle';
  const statusConfig = (() => {
    switch (syncStatus) {
      case 'saving':
        return { bg: 'var(--ocean)', label: 'Salvando...', icon: '⏳' };
      case 'saved':
        return { bg: '#16a34a', label: 'Salvo agora ✓', icon: '✓' };
      case 'synced':
        return { bg: 'rgba(22, 163, 74, 0.92)', label: `Sincronizado ${formatSyncTime(lastSyncedAt)}`, icon: '☁' };
      case 'error':
        return { bg: '#dc2626', label: 'Erro ao salvar', icon: '⚠' };
      default:
        return { bg: 'var(--ocean)', label: '', icon: '' };
    }
  })();

  return (
    <>
      {children}

      {/* One-shot migration confirmation banner */}
      {migrationSummary && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            maxWidth: '560px',
            width: 'calc(100% - 32px)',
            zIndex: 2000,
            background: 'white',
            border: '2px solid #16a34a',
            borderRadius: '14px',
            padding: '18px 20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <div style={{ fontSize: '28px', lineHeight: 1 }}>☁✓</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#16a34a', marginBottom: '6px' }}>
                Dados sincronizados com a nuvem!
              </div>
              <div style={{ fontSize: '13px', color: 'var(--ink)', lineHeight: 1.5 }}>
                Os seguintes dados deste navegador foram enviados para o Supabase e agora estarão disponíveis em qualquer outro dispositivo onde você fizer login:
              </div>
              <ul style={{ margin: '10px 0 0', padding: '0 0 0 18px', fontSize: '13px', color: 'var(--ink)', lineHeight: 1.7 }}>
                {migrationSummary.flights > 0 && <li><strong>{migrationSummary.flights}</strong> voo(s)</li>}
                {migrationSummary.hotel && <li><strong>1</strong> hotel</li>}
                {migrationSummary.carRental && <li><strong>1</strong> aluguel de carro</li>}
                {migrationSummary.events > 0 && <li><strong>{migrationSummary.events}</strong> evento(s) da agenda</li>}
                {migrationSummary.expenses > 0 && <li><strong>{migrationSummary.expenses}</strong> despesa(s)</li>}
                {migrationSummary.members > 0 && <li><strong>{migrationSummary.members}</strong> membro(s) da família</li>}
                {migrationSummary.restaurants > 0 && <li><strong>{migrationSummary.restaurants}</strong> restaurante(s) personalizado(s)</li>}
                {migrationSummary.foodItems > 0 && <li><strong>{migrationSummary.foodItems}</strong> item(ns) de alimentação</li>}
              </ul>
            </div>
            <button
              onClick={() => setMigrationSummary(null)}
              aria-label="Fechar"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '22px',
                color: 'var(--ink-muted)',
                padding: '0 4px',
                lineHeight: 1,
                flexShrink: 0,
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Persistent sync status badge (bottom-right) */}
      {showStatus && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            padding: '8px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            fontWeight: 500,
            zIndex: 1000,
            background: statusConfig.bg,
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>{statusConfig.icon}</span>
          <span>{statusConfig.label}</span>
        </div>
      )}
    </>
  );
}
