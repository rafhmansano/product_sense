'use client';

import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const WATCHED_TABLES = [
  'flights', 'accommodations', 'car_rentals', 'events',
  'budget_categories', 'expenses', 'documents', 'packing_items', 'food_items',
];

export function useTripRealtime(tripId: string | null, onUpdate: () => void) {
  useEffect(() => {
    if (!tripId || !isSupabaseConfigured() || !supabase) return;

    let channel = supabase.channel(`realtime-trip-${tripId}`);

    for (const table of WATCHED_TABLES) {
      channel = channel.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table,
        filter: `trip_id=eq.${tripId}`,
      }, onUpdate);
    }

    channel.subscribe();

    return () => {
      supabase!.removeChannel(channel);
    };
  }, [tripId, onUpdate]);
}
