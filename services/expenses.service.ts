import { supabase } from '@/lib/supabase';

export const expensesService = {
  async getExpenses(tripId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('expenses')
      .select('*, added_by_profile:profiles(full_name)')
      .eq('trip_id', tripId)
      .order('expense_date', { ascending: false });
    return data ?? [];
  },

  async addExpense(tripId: string, expense: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('expenses')
      .insert({ ...expense, trip_id: tripId, added_by: user?.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateExpense(expenseId: string, updates: Record<string, unknown>) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('expenses').update(updates).eq('id', expenseId).select().single();
    if (error) throw error;
    return data;
  },

  async deleteExpense(expenseId: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('expenses').delete().eq('id', expenseId);
    if (error) throw error;
  },
};
