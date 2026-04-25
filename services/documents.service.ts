import { supabase } from '@/lib/supabase';

export const documentsService = {
  async getDocuments(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase.from('documents').select('*').eq('trip_id', tripId).order('created_at');
    return data ?? [];
  },

  async addDocument(tripId: string, doc: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('documents').insert({ ...doc, trip_id: tripId }).select().single();
    if (error) throw error;
    return data;
  },

  async updateDocument(docId: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('documents').update(updates).eq('id', docId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteDocument(docId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('documents').delete().eq('id', docId);
    if (error) throw error;
  },
};
