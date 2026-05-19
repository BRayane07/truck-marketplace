-- ═══════════════════════════════════════════════════
-- HONDATI — Supabase Storage (truck photos)
-- Run in SQL Editor after main schema.sql
-- ═══════════════════════════════════════════════════

INSERT INTO storage.buckets (id, name, public)
VALUES ('truck-photos', 'truck-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Providers upload to {user_id}/{filename}
CREATE POLICY "Providers upload truck photos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'truck-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public read truck photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'truck-photos');

CREATE POLICY "Owners delete own truck photos"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'truck-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Migration for existing projects (bookings.payment_status)
ALTER TABLE bookings
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'unpaid'
  CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed'));
