import { supabase } from '@/lib/supabase';

export const tripService = {
  async getTrips(familyId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('family_id', familyId)
      .order('start_date', { ascending: true });

    return data ?? [];
  },

  async getTrip(tripId: string) {
    if (!supabase) return null;
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    return data;
  },

  async getTripByShareCode(shareCode: string) {
    if (!supabase) return null;
    const { data } = await supabase
      .from('trips')
      .select('*')
      .eq('share_code', shareCode.toUpperCase())
      .single();

    return data;
  },

  async createTrip(familyId: string, tripData: {
    name: string;
    destination: string;
    destination_code?: string;
    origin?: string;
    origin_code?: string;
    start_date?: string;
    end_date?: string;
  }) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('trips')
      .insert({ ...tripData, family_id: familyId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTrip(tripId: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  subscribeToTrip(tripId: string, callback: () => void) {
    if (!supabase) return null;
    return supabase
      .channel(`trip-${tripId}`)
      .on('postgres_changes', { event: '*', schema: 'public', filter: `trip_id=eq.${tripId}` }, callback)
      .subscribe();
  },
};
