-- TEMPORARY FIX: Disable RLS on family_members table to resolve redirect loop issue
-- The circular dependency issue between families and family_members RLS policies
-- was causing getMyFamily() queries to fail, resulting in users being stuck
-- in an infinite redirect loop between dashboard and onboarding pages.

-- Solution: Disable RLS on family_members table (families RLS was already disabled)
-- This allows the client to query family_members without RLS restrictions

-- Note: This is a temporary workaround for development. In production,
-- proper RLS policies should be implemented without circular dependencies.

ALTER TABLE public.family_members DISABLE ROW LEVEL SECURITY;
