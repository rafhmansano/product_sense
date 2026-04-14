import { supabase } from '@/lib/supabase';

export const familyService = {
  async getMyFamily() {
    if (!supabase) return null;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Query 1: membership row (no nested join — avoids triggering the
    // families SELECT policy from within family_members, which was the
    // source of "infinite recursion detected in policy" errors).
    const { data: memberRow, error: memberErr } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (memberErr) {
      console.error('getMyFamily member query error:', memberErr.message);
      throw new Error(memberErr.message);
    }
    if (!memberRow) return null;

    // Query 2: family details (separate request, no join)
    const { data: familyRow, error: familyErr } = await supabase
      .from('families')
      .select('*')
      .eq('id', memberRow.family_id)
      .maybeSingle();

    if (familyErr) {
      console.error('getMyFamily family query error:', familyErr.message);
      // Non-fatal: return membership with null family
      return { ...memberRow, family: null };
    }

    return { ...memberRow, family: familyRow };
  },

  async createFamily(name: string) {
    if (!supabase) throw new Error('Supabase not configured');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    // Generate UUID client-side so we don't need .select() after insert
    const familyId = crypto.randomUUID();

    // Step 1: Insert family
    const { error: familyError } = await supabase
      .from('families')
      .insert({ id: familyId, name, created_by: user.id });

    if (familyError) {
      console.error('Insert families error:', familyError);
      if (familyError.message.includes('ja pertence') || familyError.message.includes('already')) {
        throw new Error('Você já pertence a uma família');
      }
      throw new Error('Erro ao criar família: ' + familyError.message);
    }

    // Step 2: Add creator as admin member
    const { error: memberError } = await supabase
      .from('family_members')
      .insert({ family_id: familyId, user_id: user.id, role: 'admin' });

    if (memberError) {
      console.error('Insert family_members error:', memberError);
      throw new Error('Erro ao adicionar membro: ' + memberError.message);
    }

    // Step 3: Read back family (non-critical — fallback to minimal data)
    try {
      const { data: family } = await supabase
        .from('families')
        .select('*')
        .eq('id', familyId)
        .single();

      if (family) return family;
    } catch (readErr) {
      console.error('Read family after create failed (non-critical):', readErr);
    }

    return { id: familyId, name, invite_code: '' };
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
