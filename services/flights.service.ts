import { supabase } from '@/lib/supabase';

export const flightsService = {
  async getFlights(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase.from('flights').select('*').eq('trip_id', tripId).order('departure_at');
    return data ?? [];
  },

  async addFlight(tripId: string, flight: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('flights').insert({ ...flight, trip_id: tripId }).select().single();
    if (error) throw error;
    return data;
  },

  async updateFlight(flightId: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('flights').update(updates).eq('id', flightId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteFlight(flightId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('flights').delete().eq('id', flightId);
    if (error) throw error;
  },
};
