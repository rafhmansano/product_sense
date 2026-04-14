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

export default function TripProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
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
      // No Supabase: use localStorage-only mode
      initializedRef.current = true;
      setLoading(false);
      return;
    }

    // Auth required but user not logged in — middleware handles redirect,
    // but we still need to stop loading
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

        // 2. Get (or create) the family's trip — this is the stable
        //    cross-device identifier we'll use for cloud sync.
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
          // Cannot sync without a trip — fall back to localStorage-only
          console.error('No trip available for sync; using localStorage only.');
          initializedRef.current = true;
          setLoading(false);
          return;
        }

        tripIdRef.current = trip.id;

        // 3. Safety net: backup the current localStorage state before
        //    any load/migration so the user can always recover.
        backupLocalStateToLocalStorage();

        // 4. Load cloud data for this trip
        const cloudData = await loadTripData(trip.id);

        if (cloudData) {
          // Cloud has authoritative data — hydrate from it.
          hydrateFromCloud(cloudData);
          lastSavedRef.current = JSON.stringify(cloudData);
        } else {
          // Cloud is empty. If the current browser has meaningful
          // local data, push it to the cloud (one-shot migration).
          // Otherwise start with the default (empty) state.
          const localData = getTripData();
          if (hasMeaningfulLocalData(localData)) {
            console.info('Migrating local state to cloud for trip', trip.id);
            const ok = await saveTripData(trip.id, localData);
            if (ok) {
              lastSavedRef.current = JSON.stringify(localData);
            }
          } else {
            // Fresh browser with no data — persist the defaults so
            // subsequent loads are consistent.
            await saveTripData(trip.id, localData);
            lastSavedRef.current = JSON.stringify(localData);
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
        setSyncStatus('saved');
        setTimeout(() => setSyncStatus('idle'), 2000);
      } else {
        setSyncStatus('error');
        setTimeout(() => setSyncStatus('idle'), 3000);
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

  // Reload from cloud on tab focus (so changes from another device
  // show up when the user comes back to this tab).
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
        }
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [hydrateFromCloud]);

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

  return (
    <>
      {children}
      {isSupabaseConfigured() && syncStatus !== 'idle' && (
        <div style={{
          position: 'fixed', bottom: '16px', right: '16px', padding: '8px 14px', borderRadius: '8px',
          fontSize: '12px', fontFamily: 'sans-serif', zIndex: 1000,
          background: syncStatus === 'saving' ? 'var(--ocean)' : syncStatus === 'saved' ? 'var(--green)' : 'var(--coral)',
          color: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', transition: 'opacity 0.3s',
        }}>
          {syncStatus === 'saving' && 'Salvando...'}
          {syncStatus === 'saved' && 'Salvo na nuvem ✓'}
          {syncStatus === 'error' && 'Erro ao salvar'}
        </div>
      )}
    </>
  );
}
