import { supabase } from '@/lib/supabase';

export const budgetService = {
  async getCategories(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('budget_categories')
      .select('*')
      .eq('trip_id', tripId)
      .order('sort_order');
    return data ?? [];
  },

  async upsertCategory(tripId: string, category: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('budget_categories')
      .upsert({ ...category, trip_id: tripId }, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateCategory(categoryId: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('budget_categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
