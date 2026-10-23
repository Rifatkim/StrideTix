-- ==============================================================================
-- MIGRATION: 20261023000000_cleanup_legacy_strava_tables.sql
-- Proyek: StrideTix
-- Deskripsi: Pembersihan tabel legacy Strava OAuth (user_strava_sync & raw_strava_activities)
--             karena Strava OAuth merupakan fitur upcoming (post-MVP).
--             Seluruh aktivitas kebugaran distandarisasi ke Universal Fitness Sync
--             (user_fitness_sync & raw_fitness_activities) sesuai PRD Section 16.2.
-- ==============================================================================

-- 1. PASTIKAN TABEL KANONIKAL UNIVERSAL FITNESS SUDAH ADA
CREATE TABLE IF NOT EXISTS public.user_fitness_sync (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    sync_source TEXT NOT NULL DEFAULT 'manual' CHECK (sync_source IN ('manual', 'gpx_upload', 'csv_upload', 'strava', 'preset_persona')),
    athlete_name TEXT DEFAULT 'Pelari StrideTix',
    device_or_app TEXT DEFAULT 'Manual Assessment',
    total_activities_synced INTEGER DEFAULT 0,
    is_sync_active BOOLEAN DEFAULT true,
    last_synced_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.raw_fitness_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    activity_name TEXT NOT NULL DEFAULT 'Aktivitas Lari',
    activity_type TEXT NOT NULL DEFAULT 'Run',
    distance_meters DOUBLE PRECISION NOT NULL DEFAULT 0,
    moving_time_seconds INTEGER NOT NULL DEFAULT 0,
    average_speed_mps DOUBLE PRECISION DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    source TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'gpx', 'csv', 'strava', 'preset')),
    raw_payload JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. MIGRASI DATA DARI TABEL LAMA KE TABEL BARU (JIKA TABEL LAMA ADA & MEMILIKI DATA)
DO $$
BEGIN
    -- Migrasi status user_strava_sync -> user_fitness_sync
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'user_strava_sync'
    ) THEN
        INSERT INTO public.user_fitness_sync (
            user_id, sync_source, athlete_name, device_or_app, is_sync_active, last_synced_at
        )
        SELECT 
            s.user_id,
            COALESCE(
                NULLIF(s.access_token, ''), 
                CASE WHEN s.strava_athlete_id IS NOT NULL THEN 'strava' ELSE 'manual' END
            ),
            COALESCE(s.strava_athlete_id, 'Pelari StrideTix'),
            'Legacy Migrated Data',
            COALESCE(s.is_sync_active, true),
            COALESCE(s.last_synced_at, now())
        FROM public.user_strava_sync s
        ON CONFLICT (user_id) DO NOTHING;
    END IF;

    -- Migrasi histori raw_strava_activities -> raw_fitness_activities
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'raw_strava_activities'
    ) THEN
        INSERT INTO public.raw_fitness_activities (
            user_id, activity_name, activity_type, distance_meters, moving_time_seconds, average_speed_mps, start_date, source, raw_payload
        )
        SELECT 
            r.user_id,
            COALESCE((r.raw_payload->>'name')::text, 'Aktivitas Lari'),
            COALESCE((r.raw_payload->>'type')::text, 'Run'),
            COALESCE(r.distance_meters, 0),
            COALESCE(r.moving_time_seconds, 0),
            COALESCE(r.average_speed, 0),
            r.start_date,
            'gpx',
            COALESCE(r.raw_payload, '{}'::jsonb)
        FROM public.raw_strava_activities r;
    END IF;
END $$;

-- 3. HAPUS TABEL-TABEL LEGACY STRAVA OAUTH (DROP POLICIES, INDEXES, & TABLES)
DO $$
BEGIN
    -- Drop RLS policies
    DROP POLICY IF EXISTS "Users manage own strava sync" ON public.user_strava_sync;
    DROP POLICY IF EXISTS "Users view own strava activities" ON public.raw_strava_activities;
    
    -- Drop indexes
    DROP INDEX IF EXISTS public.idx_raw_strava_activities_user_id;
    
    -- Drop tables
    DROP TABLE IF EXISTS public.raw_strava_activities CASCADE;
    DROP TABLE IF EXISTS public.user_strava_sync CASCADE;
END $$;

-- 4. PASTIKAN INDEX DAN RLS PADA TABEL UNIVERSAL FITNESS TERPASANG DENGAN BENAR
CREATE INDEX IF NOT EXISTS idx_fitness_activities_user_date 
    ON public.raw_fitness_activities(user_id, start_date DESC);

CREATE INDEX IF NOT EXISTS idx_fitness_activities_type 
    ON public.raw_fitness_activities(activity_type);

ALTER TABLE public.user_fitness_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_fitness_activities ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users manage own fitness sync" ON public.user_fitness_sync;
    DROP POLICY IF EXISTS "Users view and manage own fitness activities" ON public.raw_fitness_activities;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Users manage own fitness sync" ON public.user_fitness_sync
    FOR ALL TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users view and manage own fitness activities" ON public.raw_fitness_activities
    FOR ALL TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);
