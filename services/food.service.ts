import { supabase } from '@/lib/supabase';

export const foodService = {
  async getRestaurants(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('food_items')
      .select('*')
      .eq('trip_id', tripId)
      .eq('item_type', 'restaurante')
      .order('created_at');
    return data ?? [];
  },

  async getFoodItems(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('food_items')
      .select('*')
      .eq('trip_id', tripId)
      .eq('item_type', 'comida')
      .order('category')
      .order('created_at');
    return data ?? [];
  },

  async addRestaurant(tripId: string, restaurant: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('food_items')
      .insert({ ...restaurant, trip_id: tripId, item_type: 'restaurante' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async addFoodItem(tripId: string, item: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('food_items')
      .insert({ ...item, trip_id: tripId, item_type: 'comida' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async toggleItem(itemId: string, checked: boolean) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('food_items').update({ checked }).eq('id', itemId);
    if (error) throw error;
  },

  async deleteItem(itemId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('food_items').delete().eq('id', itemId);
    if (error) throw error;
  },
};
