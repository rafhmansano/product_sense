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

    const { data, error } = await supabase.rpc('create_family_with_member', {
      p_name: name,
    });

    if (error) throw new Error(error.message);
    return data as { id: string; name: string; invite_code: string };
  },

  async joinFamily(inviteCode: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase.rpc('join_family_by_code', {
      p_invite_code: inviteCode.toUpperCase(),
    });

    if (error) {
      // Map Postgres exceptions to user-friendly messages
      if (error.message.includes('Codigo de convite invalido')) {
        throw new Error('Codigo de convite invalido');
      }
      if (error.message.includes('ja pertence')) {
        throw new Error('Voce ja pertence a uma familia');
      }
      throw new Error(error.message);
    }
    return data as { id: string; name: string; invite_code: string };
  },

  async getInviteCode(familyId: string) {
    if (!supabase) return null;

    const { data, error } = await supabase.rpc('get_family_invite_code', {
      p_family_id: familyId,
    });

    if (error) throw new Error(error.message);
    return data as string;
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
