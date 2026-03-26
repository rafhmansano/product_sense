import { supabase } from '@/lib/supabase';

export const accommodationService = {
  async getAccommodation(tripId: string) {
    if (!supabase) return null;
    const { data } = await supabase.from('accommodations').select('*').eq('trip_id', tripId).single();
    return data;
  },

  async upsertAccommodation(tripId: string, accommodation: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const existing = await this.getAccommodation(tripId);
    if (existing) {
      const { data, error } = await supabase.from('accommodations').update(accommodation).eq('id', existing.id).select().single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase.from('accommodations').insert({ ...accommodation, trip_id: tripId }).select().single();
      if (error) throw error;
      return data;
    }
  },
};
