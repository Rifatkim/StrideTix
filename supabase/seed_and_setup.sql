-- ==============================================================================
-- StrideTix: Database Schema, Seed Users, & Sample Events
-- Jalankan skrip ini langsung di Supabase Dashboard -> SQL Editor
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'runner' CHECK (role IN ('runner', 'organizer', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. RUNNER_PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.runner_profiles (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    avg_weekly_distance_km DOUBLE PRECISION DEFAULT 0,
    longest_run_km DOUBLE PRECISION DEFAULT 0,
    avg_pace_minutes_per_km DOUBLE PRECISION DEFAULT 0,
    weekly_frequency INTEGER DEFAULT 0,
    consistency_score DOUBLE PRECISION DEFAULT 0,
    last_calculated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- 3. EVENT_RECOMMENDATIONS TABLE
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

-- 4. USER_STRAVA_SYNC TABLE
CREATE TABLE IF NOT EXISTS public.user_strava_sync (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    strava_athlete_id TEXT,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    is_sync_active BOOLEAN DEFAULT false,
    last_synced_at TIMESTAMPTZ
);

-- 5. RAW_STRAVA_ACTIVITIES TABLE
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

-- 6. RUNNING_EVENTS TABLE
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

-- 7. EVENT_CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.event_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.running_events(id) ON DELETE CASCADE,
    category_name TEXT NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL,
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    quota INTEGER NOT NULL DEFAULT 100,
    remaining_quota INTEGER NOT NULL DEFAULT 100
);

-- 8. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'expired')),
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (timezone('utc'::text, now()) + interval '2 hours'),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TICKETS TABLE
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

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_running_events_organizer_id ON public.running_events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_running_events_status ON public.running_events(status);
CREATE INDEX IF NOT EXISTS idx_event_categories_event_id ON public.event_categories(event_id);
CREATE INDEX IF NOT EXISTS idx_tickets_order_id ON public.tickets(order_id);
CREATE INDEX IF NOT EXISTS idx_tickets_user_id ON public.tickets(user_id);

-- TRIGGER SYNC DARI auth.users
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

-- ROW LEVEL SECURITY
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.runner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_strava_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.raw_strava_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.running_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- POLICIES
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public users view basic profiles" ON public.users;
  DROP POLICY IF EXISTS "Users update own profile" ON public.users;
  DROP POLICY IF EXISTS "Anyone view published events" ON public.running_events;
  DROP POLICY IF EXISTS "Organizers create events" ON public.running_events;
  DROP POLICY IF EXISTS "Organizers update events" ON public.running_events;
  DROP POLICY IF EXISTS "Anyone view categories" ON public.event_categories;
  DROP POLICY IF EXISTS "Organizers manage categories" ON public.event_categories;
  DROP POLICY IF EXISTS "Users view tickets" ON public.tickets;
  DROP POLICY IF EXISTS "Users view runner profile" ON public.runner_profiles;
END $$;

CREATE POLICY "Public users view basic profiles" ON public.users FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE TO authenticated USING ((select auth.uid()) = id);
CREATE POLICY "Anyone view published events" ON public.running_events FOR SELECT TO authenticated, anon USING (status = 'published' OR (select auth.uid()) = organizer_id);
CREATE POLICY "Organizers create events" ON public.running_events FOR INSERT TO authenticated WITH CHECK ((select auth.uid()) = organizer_id);
CREATE POLICY "Organizers update events" ON public.running_events FOR UPDATE TO authenticated USING ((select auth.uid()) = organizer_id);
CREATE POLICY "Anyone view categories" ON public.event_categories FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "Organizers manage categories" ON public.event_categories FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.running_events WHERE id = event_categories.event_id AND organizer_id = (select auth.uid())));
CREATE POLICY "Users view tickets" ON public.tickets FOR SELECT TO authenticated USING ((select auth.uid()) = user_id OR EXISTS (SELECT 1 FROM public.event_categories ec JOIN public.running_events re ON re.id = ec.event_id WHERE ec.id = tickets.category_id AND re.organizer_id = (select auth.uid())));
CREATE POLICY "Users view runner profile" ON public.runner_profiles FOR ALL TO authenticated USING ((select auth.uid()) = user_id);

-- ==============================================================================
-- SEED USERS & SAMPLE EVENTS
-- ==============================================================================
DO $$
DECLARE
  v_runner_id UUID;
  v_eo_id UUID;
  v_admin_id UUID;
  v_evt1 UUID;
  v_evt2 UUID;
  v_evt3 UUID;
  v_evt4 UUID;
  v_evt5 UUID;
  v_evt6 UUID;
BEGIN
  -- 1. SEED USER: Runner (Bams)
  SELECT id INTO v_runner_id FROM auth.users WHERE lower(email) = 'bambang123@gmail.com';
  IF v_runner_id IS NULL THEN
    v_runner_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change, phone_change,
      phone_change_token, reauthentication_token,
      created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_runner_id, 'authenticated', 'authenticated',
      'bambang123@gmail.com', crypt('buBambang123', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}',
      '{"full_name":"Bams","role":"runner"}',
      '', '', '', '', '', '', '', '',
      now(), now()
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
      v_runner_id::text, v_runner_id,
      format('{"sub":"%s","email":"bambang123@gmail.com"}', v_runner_id)::jsonb,
      'email', now(), now(), now()
    ) ON CONFLICT DO NOTHING;
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('buBambang123', gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = COALESCE(confirmation_token, ''),
        recovery_token = COALESCE(recovery_token, ''),
        email_change_token_new = COALESCE(email_change_token_new, ''),
        email_change_token_current = COALESCE(email_change_token_current, ''),
        email_change = COALESCE(email_change, ''),
        phone_change = COALESCE(phone_change, ''),
        phone_change_token = COALESCE(phone_change_token, ''),
        reauthentication_token = COALESCE(reauthentication_token, ''),
        raw_user_meta_data = '{"full_name":"Bams","role":"runner"}'
    WHERE id = v_runner_id;
  END IF;

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (v_runner_id, 'bambang123@gmail.com', 'Bams', 'runner')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Bams', role = 'runner';

  INSERT INTO public.runner_profiles (user_id, avg_weekly_distance_km, longest_run_km, avg_pace_minutes_per_km, weekly_frequency, consistency_score)
  VALUES (v_runner_id, 24.5, 12.0, 5.8, 3, 85.0)
  ON CONFLICT (user_id) DO UPDATE SET avg_weekly_distance_km = 24.5, longest_run_km = 12.0;

  -- 2. SEED USER: EO (Yosephin)
  SELECT id INTO v_eo_id FROM auth.users WHERE lower(email) IN ('yosep.organizer@gmail.com', 'yosep@gmail.com') ORDER BY created_at DESC LIMIT 1;
  IF v_eo_id IS NULL THEN
    v_eo_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change, phone_change,
      phone_change_token, reauthentication_token,
      created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_eo_id, 'authenticated', 'authenticated',
      'yosep.organizer@gmail.com', crypt('Porsea123', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}',
      '{"full_name":"Yosephin","role":"organizer"}',
      '', '', '', '', '', '', '', '',
      now(), now()
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
      v_eo_id::text, v_eo_id,
      format('{"sub":"%s","email":"yosep.organizer@gmail.com"}', v_eo_id)::jsonb,
      'email', now(), now(), now()
    ) ON CONFLICT DO NOTHING;
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('Porsea123', gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = COALESCE(confirmation_token, ''),
        recovery_token = COALESCE(recovery_token, ''),
        email_change_token_new = COALESCE(email_change_token_new, ''),
        email_change_token_current = COALESCE(email_change_token_current, ''),
        email_change = COALESCE(email_change, ''),
        phone_change = COALESCE(phone_change, ''),
        phone_change_token = COALESCE(phone_change_token, ''),
        reauthentication_token = COALESCE(reauthentication_token, ''),
        raw_user_meta_data = '{"full_name":"Yosephin","role":"organizer"}'
    WHERE id = v_eo_id;
  END IF;

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (v_eo_id, 'yosep.organizer@gmail.com', 'Yosephin', 'organizer')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Yosephin', role = 'organizer';

  -- 3. SEED USER: Admin (Admin StrideTix)
  SELECT id INTO v_admin_id FROM auth.users WHERE lower(email) IN ('admin.stridetix@gmail.com', 'admin@gmail.com') ORDER BY created_at DESC LIMIT 1;
  IF v_admin_id IS NULL THEN
    v_admin_id := gen_random_uuid();
    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change_token_new,
      email_change_token_current, email_change, phone_change,
      phone_change_token, reauthentication_token,
      created_at, updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000', v_admin_id, 'authenticated', 'authenticated',
      'admin.stridetix@gmail.com', crypt('Admin123', gen_salt('bf')),
      now(), '{"provider":"email","providers":["email"]}',
      '{"full_name":"Admin StrideTix","role":"admin"}',
      '', '', '', '', '', '', '', '',
      now(), now()
    );
    INSERT INTO auth.identities (id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (
      v_admin_id::text, v_admin_id,
      format('{"sub":"%s","email":"admin.stridetix@gmail.com"}', v_admin_id)::jsonb,
      'email', now(), now(), now()
    ) ON CONFLICT DO NOTHING;
  ELSE
    UPDATE auth.users
    SET encrypted_password = crypt('Admin123', gen_salt('bf')),
        email_confirmed_at = now(),
        confirmation_token = COALESCE(confirmation_token, ''),
        recovery_token = COALESCE(recovery_token, ''),
        email_change_token_new = COALESCE(email_change_token_new, ''),
        email_change_token_current = COALESCE(email_change_token_current, ''),
        email_change = COALESCE(email_change, ''),
        phone_change = COALESCE(phone_change, ''),
        phone_change_token = COALESCE(phone_change_token, ''),
        reauthentication_token = COALESCE(reauthentication_token, ''),
        raw_user_meta_data = '{"full_name":"Admin StrideTix","role":"admin"}'
    WHERE id = v_admin_id;
  END IF;

  INSERT INTO public.users (id, email, full_name, role)
  VALUES (v_admin_id, 'admin.stridetix@gmail.com', 'Admin StrideTix', 'admin')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Admin StrideTix', role = 'admin';

  -- 4. INSERT REALISTIC RUNNING EVENTS (Created by Yosephin / EO)
  -- Event 1: Jakarta City Marathon 2026
  INSERT INTO public.running_events (organizer_id, title, description, location, city, event_date, banner_url, status)
  VALUES (
    v_eo_id,
    'Jakarta City Marathon 2026',
    'Event marathon prestisius melintasi landmark ikonik ibu kota: Bundaran HI, Monas, dan GBK Senayan.',
    'Plaza Barat Gelora Bung Karno (GBK), Senayan',
    'Jakarta Pusat',
    '2026-11-15',
    'https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80',
    'published'
  ) RETURNING id INTO v_evt1;

  INSERT INTO public.event_categories (event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
    (v_evt1, '5K Fun Run', 5.0, 250000, 500, 342),
    (v_evt1, '10K Challenge', 10.0, 375000, 750, 480),
    (v_evt1, 'Half Marathon', 21.1, 550000, 500, 215),
    (v_evt1, 'Full Marathon', 42.195, 750000, 300, 110);

  -- Event 2: Borobudur Heritage Sunset Run 2026
  INSERT INTO public.running_events (organizer_id, title, description, location, city, event_date, banner_url, status)
  VALUES (
    v_eo_id,
    'Borobudur Heritage Sunset Run 2026',
    'Lari sore eksotis mengelilingi pedesaan Magelang dengan latar siluet kemegahan Candi Borobudur saat senja.',
    'Taman Lumbini, Candi Borobudur',
    'Magelang',
    '2026-12-05',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1600&q=80',
    'published'
  ) RETURNING id INTO v_evt2;

  INSERT INTO public.event_categories (event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
    (v_evt2, '5K Sunset', 5.0, 225000, 400, 280),
    (v_evt2, '10K Heritage', 10.0, 350000, 600, 410),
    (v_evt2, 'Half Marathon', 21.1, 500000, 350, 195);

  -- Event 3: Bandung Highland Trail Run 2026
  INSERT INTO public.running_events (organizer_id, title, description, location, city, event_date, banner_url, status)
  VALUES (
    v_eo_id,
    'Bandung Highland Trail Run 2026',
    'Tantangan lari lintas alam berhawa sejuk menembus hutan pinus Dago Pakar dan bukit Tebing Keraton.',
    'Taman Hutan Raya Ir. H. Djuanda, Dago Pakar',
    'Bandung',
    '2026-11-29',
    'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=1600&q=80',
    'published'
  ) RETURNING id INTO v_evt3;

  INSERT INTO public.event_categories (event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
    (v_evt3, '10K Trail', 10.0, 300000, 300, 210),
    (v_evt3, '21K Trail Adventure', 21.1, 475000, 400, 260),
    (v_evt3, '42K Ultra Trail', 42.195, 650000, 200, 95);

  -- Event 4: Bali Coastal Sunset Marathon 2026
  INSERT INTO public.running_events (organizer_id, title, description, location, city, event_date, banner_url, status)
  VALUES (
    v_eo_id,
    'Bali Coastal Sunset Marathon 2026',
    'Sensasi berlari di tepian pesisir pantai Sanur dengan hembusan angin laut tropis dan pemandangan pulau Bali.',
    'Pantai Mertasari, Sanur',
    'Denpasar',
    '2026-12-20',
    'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1600&q=80',
    'published'
  ) RETURNING id INTO v_evt4;

  INSERT INTO public.event_categories (event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
    (v_evt4, '5K Beach Run', 5.0, 275000, 450, 330),
    (v_evt4, '10K Coastal Challenge', 10.0, 400000, 600, 440),
    (v_evt4, 'Half Marathon', 21.1, 575000, 350, 205);

  -- Event 5: Surabaya Night Urban Run 2026
  INSERT INTO public.running_events (organizer_id, title, description, location, city, event_date, banner_url, status)
  VALUES (
    v_eo_id,
    'Surabaya Night Urban Run 2026',
    'Lari malam gemerlap lampu kota pahlawan melewati Jalan Tunjungan, Siola, dan Balai Pemuda.',
    'Jalan Tunjungan & Balai Pemuda',
    'Surabaya',
    '2026-10-31',
    'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?auto=format&fit=crop&w=1600&q=80',
    'published'
  ) RETURNING id INTO v_evt5;

  INSERT INTO public.event_categories (event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
    (v_evt5, '5K Glow Run', 5.0, 200000, 500, 390),
    (v_evt5, '10K Night Speed', 10.0, 325000, 700, 510);

  -- Event 6: Yogyakarta Malioboro Cultural Run 2026
  INSERT INTO public.running_events (organizer_id, title, description, location, city, event_date, banner_url, status)
  VALUES (
    v_eo_id,
    'Yogyakarta Malioboro Cultural Run 2026',
    'Jelajahi kehangatan budaya Yogyakarta di sepanjang Malioboro hingga Alun-Alun Utara Kraton.',
    'Titik Nol Kilometer, Malioboro',
    'Yogyakarta',
    '2026-11-08',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1600&q=80',
    'published'
  ) RETURNING id INTO v_evt6;

  INSERT INTO public.event_categories (event_id, category_name, distance_km, price, quota, remaining_quota) VALUES
    (v_evt6, '5K Heritage Fun', 5.0, 220000, 400, 290),
    (v_evt6, '10K Kraton Pace', 10.0, 340000, 500, 375);

  -- Sanitize auth.users string columns to avoid GoTrue 500 error: "converting NULL to string is unsupported"
  UPDATE auth.users
  SET confirmation_token = COALESCE(confirmation_token, ''),
      recovery_token = COALESCE(recovery_token, ''),
      email_change_token_new = COALESCE(email_change_token_new, ''),
      email_change_token_current = COALESCE(email_change_token_current, ''),
      email_change = COALESCE(email_change, ''),
      phone_change = COALESCE(phone_change, ''),
      phone_change_token = COALESCE(phone_change_token, ''),
      reauthentication_token = COALESCE(reauthentication_token, ''),
      email_confirmed_at = COALESCE(email_confirmed_at, now());
END $$;
