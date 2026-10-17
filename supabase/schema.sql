-- ==============================================================================
-- StrideTix Database Schema
-- Sesuai Diagram UML / ERD Arsitektur StrideTix
-- ==============================================================================

-- 1. USERS TABLE (Sinkron dengan auth.users Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'runner' CHECK (role IN ('runner', 'organizer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. RUNNER_PROFILES TABLE (1-to-1 training summary)
CREATE TABLE IF NOT EXISTS public.runner_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    avg_weekly_distance_km DOUBLE PRECISION DEFAULT 0,
    longest_run_km DOUBLE PRECISION DEFAULT 0,
    avg_pace_minutes_per_km DOUBLE PRECISION DEFAULT 0,
    weekly_frequency INTEGER DEFAULT 0,
    consistency_score DOUBLE PRECISION DEFAULT 0,
    last_calculated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. EVENT_RECOMMENDATIONS TABLE (1-to-N dari users)
CREATE TABLE IF NOT EXISTS public.event_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    recommended_category TEXT NOT NULL,
    readiness_level TEXT NOT NULL,
    confidence_level TEXT NOT NULL,
    ai_explanation TEXT,
    calculated_metrics JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. USER_STRAVA_SYNC TABLE (1-to-1 sync Strava token - legacy/optional)
CREATE TABLE IF NOT EXISTS public.user_strava_sync (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    strava_athlete_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    is_sync_active BOOLEAN DEFAULT false,
    last_synced_at TIMESTAMPTZ
);

-- 4b. USER_FITNESS_SYNC TABLE (Universal Sync: GPX, CSV, Manual, & Strava)
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

-- 5. RAW_STRAVA_ACTIVITIES TABLE (1-to-N aktivitas lari - legacy/optional)
CREATE TABLE IF NOT EXISTS public.raw_strava_activities (
    strava_activity_id TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    distance_meters DOUBLE PRECISION DEFAULT 0,
    moving_time_seconds INTEGER DEFAULT 0,
    average_speed DOUBLE PRECISION DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL,
    raw_payload JSONB DEFAULT '{}'::jsonb,
    PRIMARY KEY (strava_activity_id, user_id)
);

-- 5b. RAW_FITNESS_ACTIVITIES TABLE (1-to-N aktivitas lari GPX, CSV, Manual)
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

-- 6. RUNNING_EVENTS TABLE (Event lari dibuat organizer)
CREATE TABLE IF NOT EXISTS public.running_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    event_date DATE NOT NULL,
    banner_url TEXT,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. EVENT_CATEGORIES TABLE (Kategori jarak lomba 1-to-N dari event)
CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.running_events(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    quota INTEGER NOT NULL DEFAULT 100,
    remaining_quota INTEGER NOT NULL DEFAULT 100
);

-- 8. ORDERS TABLE (Pemesanan tiket 1-to-N dari user)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + interval '2 hours'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TICKETS TABLE (E-Ticket lomba)
CREATE TABLE IF NOT EXISTS public.tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.event_categories(id) ON DELETE RESTRICT,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    ticket_code TEXT NOT NULL UNIQUE,
    qr_code_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'checked_in', 'cancelled')),
    checked_in_at TIMESTAMPTZ
);

-- ==============================================================================
-- INDEXES UNTUK PERFORMA QUERY
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_event_recommendations_user_id ON public.event_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_raw_strava_activities_user_id ON public.raw_strava_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_raw_fitness_activities_user_date ON public.raw_fitness_activities(user_id, start_date DESC);
CREATE INDEX IF NOT EXISTS idx_running_events_organizer_id ON public.running_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_running_events_status ON public.running_events(status);
CREATE INDEX IF NOT EXISTS idx_event_categories_event_id ON public.event_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_category_id ON public.tickets(category_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_code ON public.tickets(ticket_code);

-- ==============================================================================
-- AUTOMATIC USER SYNC TRIGGER DARI auth.users KE public.users
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'runner')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;

  -- Buat profil pelari default jika rolenya runner
  IF COALESCE(NEW.raw_user_meta_data->>'role', 'runner') = 'runner' THEN
    INSERT INTO public.runner_profiles (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strava_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_fitness_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_strava_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_fitness_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.running_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- Policy USERS:
CREATE POLICY "Public users can view basic profiles" ON public.users
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- Policy RUNNER_PROFILES:
CREATE POLICY "Runners can view own profile" ON public.runner_profiles
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

CREATE POLICY "Runners can update own profile" ON public.runner_profiles
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy EVENT_RECOMMENDATIONS:
CREATE POLICY "Users view own recommendations" ON public.event_recommendations
  FOR SELECT TO authenticated USING ((select auth.uid()) = user_id);

CREATE POLICY "Users manage own recommendations" ON public.event_recommendations
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy USER_STRAVA_SYNC:
CREATE POLICY "Users manage own strava sync" ON public.user_strava_sync
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy USER_FITNESS_SYNC:
CREATE POLICY "Users manage own fitness sync" ON public.user_fitness_sync
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy RAW_STRAVA_ACTIVITIES:
CREATE POLICY "Users view own strava activities" ON public.raw_strava_activities
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy RAW_FITNESS_ACTIVITIES:
CREATE POLICY "Users manage own fitness activities" ON public.raw_fitness_activities
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy RUNNING_EVENTS:
CREATE POLICY "Anyone can view published events" ON public.running_events
  FOR SELECT TO authenticated, anon
  USING (status = 'published' OR (select auth.uid()) = organizer_id);

CREATE POLICY "Organizers can create events" ON public.running_events
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = organizer_id);

CREATE POLICY "Organizers can update own events" ON public.running_events
  FOR UPDATE TO authenticated
  USING ((select auth.uid()) = organizer_id)
  WITH CHECK ((select auth.uid()) = organizer_id);

-- Policy EVENT_CATEGORIES:
CREATE POLICY "Anyone can view event categories" ON public.event_categories
  FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Organizers can manage categories" ON public.event_categories
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.running_events
    WHERE id = event_categories.event_id AND organizer_id = (select auth.uid())
  ));

-- Policy ORDERS:
CREATE POLICY "Users can view and create own orders" ON public.orders
  FOR ALL TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy TICKETS:
CREATE POLICY "Users and Organizers can view tickets" ON public.tickets
  FOR SELECT TO authenticated
  USING (
    (select auth.uid()) = user_id
    OR EXISTS (
      SELECT 1 FROM public.event_categories ec
      JOIN public.running_events re ON re.id = ec.event_id
      WHERE ec.id = tickets.category_id AND re.organizer_id = (select auth.uid())
    )
  );

CREATE POLICY "Users can create own tickets" ON public.tickets
  FOR INSERT TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Organizers can check-in tickets" ON public.tickets
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.event_categories ec
    JOIN public.running_events re ON re.id = ec.event_id
    WHERE ec.id = tickets.category_id AND re.organizer_id = (select auth.uid())
  ));
