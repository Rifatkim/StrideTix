-- ==============================================================================
-- StrideTix: Add Runner Personal Profile & Emergency Contact Columns
-- Migration: 20261105000000_add_runner_profile_fields.sql
-- ==============================================================================

ALTER TABLE public.runner_profiles 
    ADD COLUMN IF NOT EXISTS phone_number TEXT,
    ADD COLUMN IF NOT EXISTS city TEXT,
    ADD COLUMN IF NOT EXISTS emergency_name TEXT,
    ADD COLUMN IF NOT EXISTS emergency_relation TEXT,
    ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
    ADD COLUMN IF NOT EXISTS blood_type TEXT,
    ADD COLUMN IF NOT EXISTS jersey_size TEXT,
    ADD COLUMN IF NOT EXISTS medical_notes TEXT;

-- Pastikan policy RLS mengizinkan runner membaca dan mengupdate data profilnya sendiri
DROP POLICY IF EXISTS "Runners can update own profile" ON public.runner_profiles;
CREATE POLICY "Runners can update own profile" ON public.runner_profiles
    FOR ALL
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);
