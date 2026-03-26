import { supabase } from '@/lib/supabase';

export const familyService = {
  async getMyFamily() {
    if (!supabase) return null;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase
      .from('family_members')
      .select('*, family:families(*)')
      .eq('user_id', user.id)
      .single();

    return data;
  },

  async createFamily(name: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: family, error } = await supabase
      .from('families')
      .insert({ name, created_by: user.id })
      .select()
      .single();

    if (error) throw error;

    await supabase.from('family_members').insert({
      family_id: family.id,
      user_id: user.id,
      role: 'admin',
    });

    return family;
  },

  async joinFamily(inviteCode: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: family, error } = await supabase
      .from('families')
      .select('id')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (error || !family) throw new Error('Codigo de convite invalido');

    const { error: joinError } = await supabase
      .from('family_members')
      .insert({ family_id: family.id, user_id: user.id, role: 'member' });

    if (joinError) throw joinError;
    return family;
  },

  async getMembers(familyId: string) {
    if (!supabase) return [];
    const { data } = await supabase
      .from('family_members')
      .select('*, profile:profiles(full_name, avatar_url)')
      .eq('family_id', familyId);

    return data ?? [];
  },

  async updateMember(memberId: string, updates: { nickname?: string; member_role?: string; age?: number; height_cm?: number }) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase
      .from('family_members')
      .update(updates)
      .eq('id', memberId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
