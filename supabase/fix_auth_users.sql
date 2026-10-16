-- ==============================================================================
-- StrideTix: Fix "Database error querying schema" on Login (EO & Admin)
-- Jalankan skrip ini langsung di Supabase Dashboard -> SQL Editor -> Run
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Perbaiki kolom token string di auth.users yang bernilai NULL.
-- Supabase GoTrue (server auth berbasis Go) akan crash dengan pesan
-- "500: Database error querying schema" jika kolom-kolom ini NULL.
UPDATE auth.users
SET
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  email_change = COALESCE(email_change, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  reauthentication_token = COALESCE(reauthentication_token, ''),
  email_confirmed_at = COALESCE(email_confirmed_at, now())
WHERE confirmation_token IS NULL
   OR recovery_token IS NULL
   OR email_change_token_new IS NULL
   OR email_change IS NULL
   OR reauthentication_token IS NULL;

-- 2. Pastikan password & metadata untuk akun EO (Yosep)
UPDATE auth.users
SET encrypted_password = crypt('Porsea123', gen_salt('bf')),
    email_confirmed_at = now(),
    raw_user_meta_data = '{"full_name":"Yosephin","role":"organizer","organizer_name":"Yosephin"}'
WHERE lower(email) = 'yosep@gmail.com';

-- 3. Pastikan password & metadata untuk akun Admin
UPDATE auth.users
SET encrypted_password = crypt('Admin123', gen_salt('bf')),
    email_confirmed_at = now(),
    raw_user_meta_data = '{"full_name":"Admin","role":"admin"}'
WHERE lower(email) = 'admin@gmail.com';

-- 4. Sinkronkan identity_data di auth.identities
UPDATE auth.identities
SET identity_data = format('{"sub":"%s","email":"%s","email_verified":true}', user_id, (SELECT email FROM auth.users WHERE auth.users.id = auth.identities.user_id))::jsonb
WHERE user_id IN (
  SELECT id FROM auth.users WHERE lower(email) IN ('yosep@gmail.com', 'admin@gmail.com')
);

-- 5. Pastikan role di public.users sesuai
UPDATE public.users
SET role = 'organizer', full_name = 'Yosephin'
WHERE lower(email) = 'yosep@gmail.com';

UPDATE public.users
SET role = 'admin', full_name = 'Admin'
WHERE lower(email) = 'admin@gmail.com';
