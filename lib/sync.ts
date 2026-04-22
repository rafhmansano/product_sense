import { supabase, isSupabaseConfigured } from './supabase';
import type { TripData } from './store';

/**
 * Cloud sync keyed by the family's trip UUID (stable across devices),
 * not by a per-browser random code. Reads/writes the `data` JSONB
 * column on public.trips (see MIGRATE_TRIPS_DATA_COLUMN.sql).
 *
 * These helpers replace the legacy `code`-based sync that was silently
 * failing because the `trips` table never had a `code` or `data`
 * column. User data was therefore trapped in browser localStorage.
 */

export async function loadTripData(tripId: string): Promise<TripData | null> {
  if (!isSupabaseConfigured() || !supabase) return null;

  const { data, error } = await supabase
    .from('trips')
    .select('data')
    .eq('id', tripId)
    .maybeSingle();

  if (error) {
    console.error('loadTripData error:', error.message);
    return null;
  }

  // `data` is a JSONB column; null when the trip has never been synced.
  const row = data as { data: TripData | null } | null;
  return row?.data ?? null;
}

export async function saveTripData(tripId: string, tripData: TripData): Promise<boolean> {
  if (!isSupabaseConfigured() || !supabase) return false;

  const { error } = await supabase
    .from('trips')
    .update({ data: tripData })
    .eq('id', tripId);

  if (error) {
    console.error('saveTripData error:', error.message);
    return false;
  }
  return true;
}

/**
 * Heuristic: does the given local state look like real user data we
 * should preserve when migrating to the cloud for the first time?
 * We only migrate if the user has actually cadastered something, so
 * we don't clobber legitimate (empty) cloud state with a fresh
 * browser's defaults.
 */
export function hasMeaningfulLocalData(state: TripData): boolean {
  if (state.flights && state.flights.length > 0) return true;
  if (state.hotels && state.hotels.length > 0) return true;
  if (state.carRentals && state.carRentals.length > 0) return true;
  if (state.events && state.events.length > 0) return true;
  if (state.expenses && state.expenses.length > 0) return true;
  if (state.customRestaurants && state.customRestaurants.length > 0) return true;
  if (state.foodItems && state.foodItems.length > 0) return true;
  if (state.trip?.members && state.trip.members.length > 0) return true;
  if (state.trip?.startDate || state.trip?.endDate) return true;
  if (state.trip?.origin || state.trip?.originCode) return true;
  return false;
}

/**
 * Safety net: snapshot the current localStorage Zustand state under a
 * secondary key before any potentially destructive operation. Lets the
 * user recover manually if something goes wrong during migration.
 */
export function backupLocalStateToLocalStorage(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem('family-trip-storage');
    if (!raw) return;
    const timestamp = new Date().toISOString();
    window.localStorage.setItem(
      `family-trip-storage-backup-${timestamp}`,
      raw
    );
    // Keep only the 3 most recent backups
    const keys = Object.keys(window.localStorage)
      .filter((k) => k.startsWith('family-trip-storage-backup-'))
      .sort();
    while (keys.length > 3) {
      const oldest = keys.shift();
      if (oldest) window.localStorage.removeItem(oldest);
    }
  } catch (err) {
    console.warn('backupLocalStateToLocalStorage failed:', err);
  }
}
