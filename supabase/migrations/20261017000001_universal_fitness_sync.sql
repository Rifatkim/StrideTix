-- ==============================================================================
-- MIGRATION: 20261017000001_universal_fitness_sync.sql
-- Proyek: StrideTix - Universal Fitness Sync (GPX, CSV, Manual, & Strava)
-- ==============================================================================

-- 1. USER_FITNESS_SYNC TABLE (Status sinkronisasi kebugaran pelari multi-sumber)
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

-- 2. RAW_FITNESS_ACTIVITIES TABLE (Log riwayat aktivitas lari dari GPX, CSV, Manual)
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

-- 3. INDEX UNTUK PERFORMA QUERY HISTORI LARI
CREATE INDEX IF NOT EXISTS idx_fitness_activities_user_date 
    ON public.raw_fitness_activities(user_id, start_date DESC);

CREATE INDEX IF NOT EXISTS idx_fitness_activities_type 
    ON public.raw_fitness_activities(activity_type);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.user_fitness_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_fitness_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own fitness sync" ON public.user_fitness_sync
    FOR ALL TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users view and manage own fitness activities" ON public.raw_fitness_activities
    FOR ALL TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- 5. UPGRADE RUNNER_PROFILES TABLE TO SUPPORT RICH FITNESS METRICS
ALTER TABLE public.runner_profiles 
    ADD COLUMN IF NOT EXISTS total_runs INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sync_source TEXT DEFAULT 'manual';
