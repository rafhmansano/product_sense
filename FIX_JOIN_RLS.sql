-- Fix: invite code join flow fails because non-members can't SELECT
-- from public.families (RLS blocks the lookup).
--
-- Solution: a SECURITY DEFINER function that runs as the DB owner,
-- bypassing RLS for the family lookup, then inserts the membership.
-- This is safe because the caller must be authenticated (auth.uid() check)
-- and the invite_code acts as the shared secret.
--
-- Run this in: Supabase Dashboard → SQL Editor → New query

create or replace function public.join_family_by_invite_code(p_code text)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  v_family_id   uuid;
  v_family_name text;
  v_invite_code text;
  v_user_id     uuid;
  v_existing_id uuid;
begin
  -- Must be authenticated
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('error', 'Not authenticated');
  end if;

  -- Look up family by invite code (bypasses RLS — SECURITY DEFINER)
  select id, name, invite_code
    into v_family_id, v_family_name, v_invite_code
    from public.families
   where invite_code = upper(trim(p_code));

  if v_family_id is null then
    return json_build_object('error', 'Codigo de convite invalido');
  end if;

  -- Already a member?
  select id into v_existing_id
    from public.family_members
   where family_id = v_family_id
     and user_id   = v_user_id;

  if v_existing_id is not null then
    return json_build_object('error', 'Voce ja pertence a esta familia');
  end if;

  -- Join the family
  insert into public.family_members (family_id, user_id, role)
  values (v_family_id, v_user_id, 'member');

  return json_build_object(
    'id',          v_family_id,
    'name',        v_family_name,
    'invite_code', v_invite_code
  );
end;
$$;

-- Allow authenticated users to call this function
grant execute on function public.join_family_by_invite_code(text) to authenticated;
