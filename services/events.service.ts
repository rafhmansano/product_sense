import { supabase } from '@/lib/supabase';

export const eventsService = {
  async getEvents(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase.from('events').select('*').eq('trip_id', tripId).order('event_date');
    return data ?? [];
  },

  async addEvent(tripId: string, event: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('events').insert({ ...event, trip_id: tripId }).select().single();
    if (error) throw error;
    return data;
  },

  async updateEvent(eventId: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('events').update(updates).eq('id', eventId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteEvent(eventId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) throw error;
  },
};
