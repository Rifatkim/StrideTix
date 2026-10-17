-- =========================================================================
-- STRIDETIX SUPABASE STORAGE SETUP
-- Bucket: 'event-posters' (Public Bucket untuk Banner Poster Lomba Lari)
-- =========================================================================

-- 1. Buat bucket 'event-posters' jika belum ada, atau pastikan statusnya public
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'event-posters',
    'event-posters',
    true,
    5242880, -- Maksimal 5MB per file foto poster
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- 2. Bersihkan policy lama agar tidak terjadi duplikasi error
DROP POLICY IF EXISTS "Public view event posters" ON storage.objects;
DROP POLICY IF EXISTS "Anyone view event posters" ON storage.objects;
DROP POLICY IF EXISTS "Allow upload event posters" ON storage.objects;
DROP POLICY IF EXISTS "Allow update event posters" ON storage.objects;
DROP POLICY IF EXISTS "Allow delete event posters" ON storage.objects;

-- 3. Policy SELECT: Siapapun (publik & calon pelari) dapat melihat foto poster lomba
CREATE POLICY "Public view event posters"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'event-posters');

-- 4. Policy INSERT: Memperbolehkan upload foto poster baru
CREATE POLICY "Allow upload event posters"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'event-posters');

-- 5. Policy UPDATE: Memperbolehkan pembaruan file poster (wajib untuk operasi upsert)
CREATE POLICY "Allow update event posters"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'event-posters')
WITH CHECK (bucket_id = 'event-posters');

-- 6. Policy DELETE: Memperbolehkan penghapusan foto poster
CREATE POLICY "Allow delete event posters"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'event-posters');
