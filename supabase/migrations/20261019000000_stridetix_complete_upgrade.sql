-- ==============================================================================
-- StrideTix: Complete Upgrade Migration
-- Version: 20261019000000_stridetix_complete_upgrade.sql
-- Kepatuhan: prd.md, techstack.md, design.md
-- ==============================================================================

-- 1. EXTEND RUNNING_EVENTS TABLE (Waktu Flag-off, Penyelenggara, & Regulasi)
ALTER TABLE public.running_events 
    ADD COLUMN IF NOT EXISTS start_time TEXT DEFAULT '05:30 WIB',
    ADD COLUMN IF NOT EXISTS organizer_name TEXT DEFAULT 'Stride Organizer',
    ADD COLUMN IF NOT EXISTS rules_and_terms JSONB DEFAULT '[]'::jsonb;

-- 2. EXTEND TICKETS TABLE (Data Peserta, Kontak Darurat, & Panitia Pemeriksa)
ALTER TABLE public.tickets 
    ADD COLUMN IF NOT EXISTS participant_name TEXT,
    ADD COLUMN IF NOT EXISTS phone_number TEXT,
    ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
    ADD COLUMN IF NOT EXISTS blood_type TEXT,
    ADD COLUMN IF NOT EXISTS checked_in_by UUID REFERENCES public.users(id) ON DELETE SET NULL;

-- 3. EXTEND RUNNER_PROFILES TABLE (Universal Fitness Metrics)
ALTER TABLE public.runner_profiles 
    ADD COLUMN IF NOT EXISTS total_runs INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS sync_source TEXT DEFAULT 'manual';

-- 4. CREATE USER_FITNESS_SYNC TABLE (Multi-source Fitness Assessment Status)
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

-- 5. CREATE RAW_FITNESS_ACTIVITIES TABLE (Log Aktivitas Lari Multi-sumber)
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

-- Index Performa Query Fitness
CREATE INDEX IF NOT EXISTS idx_fitness_activities_user_date 
    ON public.raw_fitness_activities(user_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_fitness_activities_type 
    ON public.raw_fitness_activities(activity_type);

-- 6. ENABLE RLS FOR NEW FITNESS TABLES
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

-- 7. SEED SAMPLE EVENTS & CATEGORIES (Idempotent: Hanya jika belum ada)
DO $$
DECLARE
    v_org_id UUID;
    v_evt1 UUID;
    v_evt2 UUID;
    v_evt3 UUID;
    v_evt4 UUID;
    v_evt5 UUID;
    v_evt6 UUID;
BEGIN
    -- Pilih organizer yang ada di database
    SELECT id INTO v_org_id FROM public.users WHERE role = 'organizer' LIMIT 1;
    IF v_org_id IS NULL THEN
        SELECT id INTO v_org_id FROM public.users LIMIT 1;
    END IF;

    IF v_org_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.running_events LIMIT 1) THEN
        -- Event 1: Borobudur Heritage Marathon 2026
        INSERT INTO public.running_events (id, organizer_id, title, organizer_name, description, location, city, event_date, start_time, banner_url, status)
        VALUES (
            'e1111111-1111-1111-1111-111111111111',
            v_org_id,
            'Borobudur Heritage Marathon 2026',
            'Heritage Race Series',
            'Rasakan sensasi berlari melintasi pedesaan Magelang yang asri dengan pemandangan megah Candi Borobudur di pagi hari.',
            'Taman Lumbini, Kompleks Candi Borobudur',
            'Magelang',
            '2026-11-15',
            '05:00 WIB',
            '/images/events/borobudur-marathon.jpg',
            'published'
        ) RETURNING id INTO v_evt1;

        INSERT INTO public.event_categories (id, event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
            ('c1111111-1111-1111-1111-111111111111', v_evt1, 'Full Marathon', 42.195, 750000, 500, 480),
            ('c1111111-1111-1111-1111-111111111112', v_evt1, 'Half Marathon', 21.097, 500000, 1000, 920),
            ('c1111111-1111-1111-1111-111111111113', v_evt1, '10K', 10.0, 350000, 1500, 1400);

        -- Event 2: Jakarta City Night Run 2026
        INSERT INTO public.running_events (id, organizer_id, title, organizer_name, description, location, city, event_date, start_time, banner_url, status)
        VALUES (
            'e2222222-2222-2222-2222-222222222222',
            v_org_id,
            'Jakarta City Night Run 2026',
            'Urban Athletics ID',
            'Lari malam spektakuler mengitari gemerlap gedung pencakar langit Sudirman-Thamrin dengan pencahayaan visual glow-in-the-dark.',
            'Gelora Bung Karno (Gate 7)',
            'Jakarta Pusat',
            '2026-12-05',
            '19:00 WIB',
            '/images/events/city-marathon.jpg',
            'published'
        ) RETURNING id INTO v_evt2;

        INSERT INTO public.event_categories (id, event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
            ('c2222222-2222-2222-2222-222222222221', v_evt2, '5K', 5.0, 250000, 2000, 1850),
            ('c2222222-2222-2222-2222-222222222222', v_evt2, '10K', 10.0, 350000, 1500, 1320);

        -- Event 3: Bali Coastal Sunset 10K
        INSERT INTO public.running_events (id, organizer_id, title, organizer_name, description, location, city, event_date, start_time, banner_url, status)
        VALUES (
            'e3333333-3333-3333-3333-333333333333',
            v_org_id,
            'Bali Coastal Sunset 10K',
            'Bali Island Runners',
            'Menikmati hembusan angin laut dan panorama matahari terbenam magis di sepanjang pesisir Pantai Sanur.',
            'Pantai Mertasari, Sanur',
            'Denpasar',
            '2026-10-25',
            '16:30 WITA',
            '/images/events/sunset-run.jpg',
            'published'
        ) RETURNING id INTO v_evt3;

        INSERT INTO public.event_categories (id, event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
            ('c3333333-3333-3333-3333-333333333331', v_evt3, '5K', 5.0, 200000, 800, 750),
            ('c3333333-3333-3333-3333-333333333332', v_evt3, '10K', 10.0, 300000, 1200, 1100);

        -- Event 4: Bandung Highland Trail 21K
        INSERT INTO public.running_events (id, organizer_id, title, organizer_name, description, location, city, event_date, start_time, banner_url, status)
        VALUES (
            'e4444444-4444-4444-4444-444444444444',
            v_org_id,
            'Bandung Highland Trail 21K',
            'Parijs Trail Adventure',
            'Tantangan trail running melintasi perbukitan pinus yang sejuk dan jalur alami Gunung Manglayang.',
            'Batu Kuda, Manglayang',
            'Bandung',
            '2026-11-29',
            '05:30 WIB',
            '/images/events/trail-run.jpg',
            'published'
        ) RETURNING id INTO v_evt4;

        INSERT INTO public.event_categories (id, event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
            ('c4444444-4444-4444-4444-444444444441', v_evt4, '10K', 10.0, 350000, 500, 480),
            ('c4444444-4444-4444-4444-444444444442', v_evt4, 'Half Marathon', 21.097, 500000, 400, 350);

        -- Event 5: Surabaya Ultra Mile 2026
        INSERT INTO public.running_events (id, organizer_id, title, organizer_name, description, location, city, event_date, start_time, banner_url, status)
        VALUES (
            'e5555555-5555-5555-5555-555555555555',
            v_org_id,
            'Surabaya Ultra Mile 2026',
            'Suroboyo Runners Community',
            'Lomba lari jalan raya dengan rute datar mengelilingi landmark bersejarah Kota Pahlawan.',
            'Taman Surya, Balai Kota',
            'Surabaya',
            '2026-12-20',
            '05:00 WIB',
            '/images/events/city-marathon.jpg',
            'published'
        ) RETURNING id INTO v_evt5;

        INSERT INTO public.event_categories (id, event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
            ('c5555555-5555-5555-5555-555555555551', v_evt5, '10K', 10.0, 300000, 1000, 950),
            ('c5555555-5555-5555-5555-555555555552', v_evt5, 'Half Marathon', 21.097, 450000, 800, 720),
            ('c5555555-5555-5555-5555-555555555553', v_evt5, 'Full Marathon', 42.195, 650000, 500, 450);

        -- Event 6: Yogyakarta Heritage Fun Run 2026
        INSERT INTO public.running_events (id, organizer_id, title, organizer_name, description, location, city, event_date, start_time, banner_url, status)
        VALUES (
            'e6666666-6666-6666-6666-666666666666',
            v_org_id,
            'Yogyakarta Heritage Fun Run 2026',
            'Jogja Istimewa Runners',
            'Event lari santai untuk seluruh keluarga melintasi jalan Malioboro dan kawasan Titik Nol Kilometer.',
            'Alun-Alun Utara Kraton',
            'Yogyakarta',
            '2026-11-08',
            '06:00 WIB',
            '/images/events/borobudur-marathon.jpg',
            'published'
        ) RETURNING id INTO v_evt6;

        INSERT INTO public.event_categories (id, event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
            ('c6666666-6666-6666-6666-666666666661', v_evt6, '5K', 5.0, 175000, 2500, 2300);
    END IF;
END $$;
