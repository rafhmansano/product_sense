import { supabase } from '@/lib/supabase';

export const familyService = {
  async getMyFamily() {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('family_members')
      .select('*, family:families(*)')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('getMyFamily error:', error.message);
      throw new Error(error.message);
    }

    return data;
  },

  async createFamily(name: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Generate UUID client-side so we don't need .select() after insert
    const familyId = crypto.randomUUID();

    // Step 1: Insert family (RLS allows insert when created_by = auth.uid())
    const { error: familyError } = await supabase
      .from('families')
      .insert({ id: familyId, name, created_by: user.id });

    if (familyError) {
      if (familyError.message.includes('ja pertence')) {
        throw new Error('Voce ja pertence a uma familia');
      }
      throw new Error(familyError.message);
    }

    // Step 2: Add creator as admin member (RLS allows insert when user_id = auth.uid())
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({ family_id: familyId, user_id: user.id, role: 'admin' });

    if (memberError) throw new Error(memberError.message);

    // Step 3: Now we CAN read the family (user is a member now + is creator)
    const { data: family } = await supabase
      .from('families')
      .select('*')
      .eq('id', familyId)
      .single();

    return family ?? { id: familyId, name, invite_code: '' };
  },

  async joinFamily(inviteCode: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data: family, error: lookupError } = await supabase
      .from('families')
      .select('id, name, invite_code')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (lookupError || !family) {
      throw new Error('Codigo de convite invalido');
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('family_members')
      .select('id')
      .eq('family_id', family.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      throw new Error('Voce ja pertence a esta familia');
    }

    const { error: joinError } = await supabase
      .from('family_members')
      .insert({ family_id: family.id, user_id: user.id, role: 'member' });

    if (joinError) throw new Error(joinError.message);
    return family;
  },

  async getInviteCode(familyId: string) {
    if (!supabase) return null;

    const { data } = await supabase
      .from('families')
      .select('invite_code')
      .eq('id', familyId)
      .single();

    return data?.invite_code ?? null;
  },

  async getMembers(familyId: string) {
    if (!supabase) return [];

    const { data } = await supabase
      .from('family_members')
      .select('*, profile:profiles(full_name, avatar_url)')
      .eq('family_id', familyId);

    return data ?? [];
  },

  async updateFamilyName(familyId: string, name: string) {
    if (!supabase) throw new Error('Supabase not configured');

    const { error } = await supabase
      .from('families')
      .update({ name })
      .eq('id', familyId);

    if (error) throw new Error(error.message);
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
