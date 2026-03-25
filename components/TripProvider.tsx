'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAppStore } from '@/lib/store';
import { isSupabaseConfigured } from '@/lib/supabase';
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

  const {
    tripCode,
    setTripCode,
    hydrateFromCloud,
    getTripData,
  } = useAppStore();

  // Initialize trip code and load data
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    async function init() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        return;
      }

      const urlCode = getTripCodeFromURL();

      if (urlCode) {
        // Load existing trip from cloud
        const cloudData = await loadTripFromCloud(urlCode);
        if (cloudData) {
          hydrateFromCloud(cloudData);
          setTripCode(urlCode);
          lastSavedRef.current = JSON.stringify(cloudData);
        } else {
          // Code in URL but trip not found - create it with current data
          const data = getTripData();
          await createTripInCloud(urlCode, data);
          setTripCode(urlCode);
          lastSavedRef.current = JSON.stringify(data);
        }
      } else {
        // No code - generate one and create trip
        const code = generateTripCode();
        const data = getTripData();
        await createTripInCloud(code, data);
        setTripCode(code);
        setTripCodeInURL(code);
        lastSavedRef.current = JSON.stringify(data);
      }

      setLoading(false);
    }

    init();
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save on store changes (debounced)
  const saveToCloud = useCallback(() => {
    const code = useAppStore.getState().tripCode;
    if (!code || !isSupabaseConfigured()) return;

    const data = useAppStore.getState().getTripData();
    const serialized = JSON.stringify(data);

    // Skip if nothing changed
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

  // Reload from cloud when tab regains focus
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

  if (loading && isSupabaseConfigured()) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--background)',
          gap: '16px',
        }}
      >
        <div style={{ fontSize: '40px' }}>✈️</div>
        <div
          style={{
            fontSize: '16px',
            color: 'var(--ink-muted)',
            fontFamily: 'sans-serif',
          }}
        >
          Carregando viagem...
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Sync status indicator */}
      {isSupabaseConfigured() && syncStatus !== 'idle' && (
        <div
          style={{
            position: 'fixed',
            bottom: '16px',
            right: '16px',
            padding: '8px 14px',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'sans-serif',
            zIndex: 1000,
            background:
              syncStatus === 'saving'
                ? 'var(--ocean)'
                : syncStatus === 'saved'
                ? 'var(--green)'
                : 'var(--coral)',
            color: 'white',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            transition: 'opacity 0.3s',
          }}
        >
          {syncStatus === 'saving' && 'Salvando...'}
          {syncStatus === 'saved' && 'Salvo na nuvem ✓'}
          {syncStatus === 'error' && 'Erro ao salvar'}
        </div>
      )}
    </>
  );
}
