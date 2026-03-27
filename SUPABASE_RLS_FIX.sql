-- Fix: Remove circular RLS dependency causing 500 Internal Server Error
-- Issue: GET request to family_members with related families data was returning 500
-- Error: Circular reference between RLS policies on families and family_members tables
-- 
-- Root cause: The policy "Members see own family" on the families table was using
-- a JOIN with family_members to check access, while family_members policy was
-- trying to fetch related families data. This created a circular dependency.
--
-- Solution: Replace the complex JOIN-based policy with a simpler subquery approach
-- that doesn't cause the circular reference during REST API calls with related data.

-- Drop the problematic policy
DROP POLICY IF EXISTS "Members see own family" ON public.families;

-- Create a simpler policy that uses a subquery instead of a JOIN
CREATE POLICY "Members see own family" ON public.families
  FOR SELECT
  USING (
    id IN (
      SELECT family_id FROM public.family_members WHERE user_id = auth.uid()
    )
  );
