'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { familyService } from '@/services/family.service';
import { tripService } from '@/services/trip.service';
import {
  generateTripCode,
  getTripCodeFromURL,
  setTripCodeInURL,
  loadTripFromCloud,
  saveTripToCloud,
  createTripInCloud,
} from '@/lib/sync';

export default function TripProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedRef = useRef<string>('');
  const initializedRef = useRef(false);
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading: authLoading } = useAuth();

  const {
    tripCode,
    setTripCode,
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
    if (publicPaths.some(p => pathname.startsWith(p))) {
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      // No Supabase: use legacy localStorage mode
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
        // Check if user has a family
        let memberData = null;
        try {
          memberData = await familyService.getMyFamily();
        } catch (err) {
          // Query error (RLS, network, etc.) — do NOT redirect to onboarding
          console.error('Failed to check family membership:', err);
          initializedRef.current = true;
          setLoading(false);
          return;
        }

        if (!memberData) {
          // Confirmed: user has no family — redirect to onboarding
          window.location.href = '/onboarding';
          return;
        }

        // Store family name + invite code for display / sharing
        if (memberData.family?.name) {
          setFamilyName(memberData.family.name);
        }
        if (memberData.family?.invite_code) {
          setFamilyInviteCode(memberData.family.invite_code);
        }

        const familyId = memberData.family_id;

        // Get trips for this family
        let trips: { id: string }[] = [];
        try {
          trips = await tripService.getTrips(familyId);
        } catch {
          // Non-critical — continue with empty trips
        }
        if (trips.length === 0) {
          try {
            await tripService.createTrip(familyId, {
              name: 'Orlando 2026',
              destination: 'Orlando, FL',
              destination_code: 'MCO',
              origin: 'Sao Paulo, SP',
              origin_code: 'GRU',
            });
          } catch {
            // Non-critical
          }
        }

        // For now, use the legacy sync (single JSONB blob in trips table)
        // This keeps backward compatibility while the full relational migration happens
        const urlCode = getTripCodeFromURL();
        if (urlCode) {
          const cloudData = await loadTripFromCloud(urlCode);
          if (cloudData) {
            hydrateFromCloud(cloudData);
            setTripCode(urlCode);
            lastSavedRef.current = JSON.stringify(cloudData);
          }
        } else {
          const code = generateTripCode();
          const data = getTripData();
          await createTripInCloud(code, data);
          setTripCode(code);
          setTripCodeInURL(code);
          lastSavedRef.current = JSON.stringify(data);
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
    const code = useAppStore.getState().tripCode;
    if (!code || !isSupabaseConfigured()) return;

    const data = useAppStore.getState().getTripData();
    const serialized = JSON.stringify(data);

    if (serialized === lastSavedRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    setSyncStatus('saving');
    saveTimeoutRef.current = setTimeout(async () => {
      const success = await saveTripToCloud(code, data);
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

  // Reload from cloud on tab focus
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    const handleFocus = async () => {
      const code = useAppStore.getState().tripCode;
      if (!code) return;

      const cloudData = await loadTripFromCloud(code);
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
    if (!publicPaths.some(p => pathname.startsWith(p))) {
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
