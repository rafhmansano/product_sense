import { supabase, isSupabaseConfigured } from './supabase';
import type { TripData } from './store';

export function generateTripCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getTripCodeFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  return params.get('t');
}

export function setTripCodeInURL(code: string) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.searchParams.set('t', code);
  window.history.replaceState({}, '', url.toString());
}

export function getShareURL(code: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.origin);
  url.searchParams.set('t', code);
  return url.toString();
}

export async function loadTripFromCloud(code: string): Promise<TripData | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data, error } = await supabase
    .from('trips')
    .select('data')
    .eq('code', code)
    .single();

  if (error || !data) return null;
  return data.data as TripData;
}

export async function saveTripToCloud(code: string, tripData: TripData): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase
    .from('trips')
    .upsert(
      {
        code,
        data: tripData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'code' }
    );

  return !error;
}

export async function createTripInCloud(code: string, tripData: TripData): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase
    .from('trips')
    .insert({
      code,
      data: tripData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  return !error;
}
