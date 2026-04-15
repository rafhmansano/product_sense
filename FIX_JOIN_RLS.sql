-- Fix: invite code join flow.
--
-- Two bugs addressed here:
--
--   (1) Chicken-and-egg: a non-member cannot SELECT from public.families,
--       so looking up the family by invite_code returned null →
--       "Codigo de convite invalido". Solved by calling a SECURITY
--       DEFINER function that bypasses RLS.
--
--   (2) Foreign key failure: family_members.user_id references
--       public.profiles(id), but some auth.users accounts don't have
--       a matching profiles row (the on_auth_user_created trigger
--       failed or was never installed on their signup). Inserting
--       into family_members then fails with:
--           "violates foreign key constraint family_members_user_id_fkey"
--       Solved by:
--         a) backfilling profiles for any auth.users without one,
--         b) reinstalling the trigger defensively,
--         c) having the RPC itself upsert the caller's profile
--            before inserting the membership row.
--
-- Run this in: Supabase Dashboard → SQL Editor → New query.
-- Idempotent: safe to re-run.

-- ---------------------------------------------------------------------------
-- 1. Backfill missing profile rows for existing auth.users
-- ---------------------------------------------------------------------------
insert into public.profiles (id, full_name)
select u.id,
       coalesce(u.raw_user_meta_data->>'full_name', u.email)
  from auth.users u
  left join public.profiles p on p.id = u.id
 where p.id is null;

-- ---------------------------------------------------------------------------
-- 2. Reinstall the new-user trigger defensively
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------------
-- 3. SECURITY DEFINER RPC: look up + join in one atomic call
--    Also upserts the caller's profile row as a safety net.
-- ---------------------------------------------------------------------------
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
  v_user_name   text;
  v_existing_id uuid;
begin
  -- Must be authenticated
  v_user_id := auth.uid();
  if v_user_id is null then
    return json_build_object('error', 'Not authenticated');
  end if;

  -- Make sure the caller has a profiles row (FK target for family_members).
  -- This is belt-and-suspenders in case the handle_new_user trigger failed
  -- for this account.
  select coalesce(raw_user_meta_data->>'full_name', email)
    into v_user_name
    from auth.users
   where id = v_user_id;

  insert into public.profiles (id, full_name)
  values (v_user_id, v_user_name)
  on conflict (id) do nothing;

  -- Look up family by invite code (bypasses RLS because SECURITY DEFINER)
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
