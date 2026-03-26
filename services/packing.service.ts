import { supabase } from '@/lib/supabase';

export const packingService = {
  async getItems(tripId: string, listType: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('packing_items')
      .select('*')
      .eq('trip_id', tripId)
      .eq('list_type', listType)
      .order('category')
      .order('created_at');
    return data ?? [];
  },

  async addItem(tripId: string, item: { list_type: string; name: string; category?: string }) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('packing_items')
      .insert({ ...item, trip_id: tripId })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleItem(itemId: string, checked: boolean) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('packing_items').update({ checked }).eq('id', itemId);
    if (error) throw error;
  },

  async deleteItem(itemId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('packing_items').delete().eq('id', itemId);
    if (error) throw error;
  },
};
