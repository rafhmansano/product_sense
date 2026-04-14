-- FIX: Remove infinite recursion in family_members / families RLS policies
--
-- Problem: The original policies on public.family_members reference
-- public.family_members inside EXISTS(...), triggering Postgres's
-- "infinite recursion detected in policy for relation" error.
--
-- Solution: Use a SECURITY DEFINER helper function that bypasses RLS
-- and returns the set of family_ids the current user belongs to. All
-- policies then reference this function instead of family_members
-- directly, which breaks the recursive evaluation.
--
-- Safe to run multiple times (idempotent).

-- 1. Helper function: returns family_ids the current user is a member of.
--    SECURITY DEFINER lets it read family_members without re-triggering
--    the RLS policy that is calling us.
create or replace function public.current_user_family_ids()
returns setof uuid
language sql
stable
security definer
set search_path = public
as $$
  select family_id from public.family_members where user_id = auth.uid();
$$;

grant execute on function public.current_user_family_ids() to authenticated, anon;

-- 2. Helper function: is the current user an admin of a given family?
create or replace function public.current_user_is_family_admin(p_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.family_members
    where family_id = p_family_id
      and user_id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.current_user_is_family_admin(uuid) to authenticated, anon;

-- 3. Drop the old recursive policies (if they exist)
drop policy if exists "Members see family members"  on public.family_members;
drop policy if exists "Users join families"          on public.family_members;
drop policy if exists "Admin manages members"        on public.family_members;
drop policy if exists "Admin deletes members"        on public.family_members;

drop policy if exists "Members see own family"       on public.families;
drop policy if exists "Users create family"          on public.families;
drop policy if exists "Admin updates family"         on public.families;

-- 4. Re-create family_members policies using the helper (no self-reference)
alter table public.family_members enable row level security;

create policy "Members see family members" on public.family_members
  for select
  using (family_id in (select public.current_user_family_ids()));

create policy "Users join families" on public.family_members
  for insert
  with check (user_id = auth.uid());

create policy "Admin manages members" on public.family_members
  for update
  using (public.current_user_is_family_admin(family_id));

create policy "Admin deletes members" on public.family_members
  for delete
  using (public.current_user_is_family_admin(family_id));

-- 5. Re-create families policies using the helper
alter table public.families enable row level security;

create policy "Members see own family" on public.families
  for select
  using (
    created_by = auth.uid()
    or id in (select public.current_user_family_ids())
  );

create policy "Users create family" on public.families
  for insert
  with check (created_by = auth.uid());

-- Admin OR creator can update the family (e.g. rename)
create policy "Admin or creator updates family" on public.families
  for update
  using (
    created_by = auth.uid()
    or public.current_user_is_family_admin(id)
  );
