-- ═══════════════════════════════════════════════════
-- HONDATI — Supabase Database Schema
-- ═══════════════════════════════════════════════════
-- Run this SQL in your Supabase project:
-- Dashboard → SQL Editor → New Query → paste & run
-- ═══════════════════════════════════════════════════

-- ─── 1. PROFILES (extends Supabase auth.users) ───
-- Stores extra user info like name, phone, role
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'provider')),
  avatar_url  TEXT,
  city        TEXT DEFAULT 'Casablanca',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 2. TRUCKS (provider listings) ───
-- Each truck belongs to a provider (user with role=provider)
CREATE TABLE IF NOT EXISTS trucks (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,           -- e.g. "Camion 3T - Casablanca"
  description   TEXT,
  truck_type    TEXT NOT NULL,           -- e.g. "pickup", "3t", "10t"
  capacity_tons NUMERIC(4,1),            -- e.g. 3.0
  price_per_km  NUMERIC(8,2),
  price_flat    NUMERIC(8,2),           -- flat rate option
  pricing_type  TEXT DEFAULT 'both' CHECK (pricing_type IN ('per_km', 'flat', 'both')),
  city          TEXT DEFAULT 'Casablanca',
  whatsapp      TEXT,                    -- provider's WhatsApp number
  is_available  BOOLEAN DEFAULT TRUE,
  photos        TEXT[],                  -- array of image URLs
  license_verified BOOLEAN DEFAULT FALSE,
  id_verified   BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 3. BOOKINGS ───
-- A customer requests a truck owner
CREATE TABLE IF NOT EXISTS bookings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID NOT NULL REFERENCES profiles(id),
  truck_id        UUID NOT NULL REFERENCES trucks(id),
  pickup_address  TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  moving_date     DATE NOT NULL,
  items_description TEXT,
  floors          INTEGER DEFAULT 0,
  needs_helpers   BOOLEAN DEFAULT FALSE,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','completed','cancelled')),
  payment_method  TEXT DEFAULT 'cash' CHECK (payment_method IN ('cash', 'wallet')),
  payment_status  TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed')),
  price_agreed    NUMERIC(10,2),
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─── 4. REVIEWS ───
-- Customers review providers after completed bookings
CREATE TABLE IF NOT EXISTS reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id),
  reviewer_id UUID NOT NULL REFERENCES profiles(id),
  truck_id    UUID NOT NULL REFERENCES trucks(id),
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(booking_id, reviewer_id) -- one review per booking per person
);

-- ─── ROW LEVEL SECURITY (RLS) ───
-- RLS means each user can only see/edit their own data

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: anyone can read, only owner can edit
CREATE POLICY "Public profiles readable" ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Trucks: anyone can read available trucks, only owner manages theirs
CREATE POLICY "Public trucks readable" ON trucks FOR SELECT USING (TRUE);
CREATE POLICY "Providers manage own trucks" ON trucks FOR ALL USING (auth.uid() = owner_id);

-- Bookings: customer sees their own, provider sees bookings for their trucks
CREATE POLICY "Customers see own bookings" ON bookings FOR SELECT
  USING (auth.uid() = customer_id);
CREATE POLICY "Providers see their truck bookings" ON bookings FOR SELECT
  USING (auth.uid() IN (SELECT owner_id FROM trucks WHERE id = truck_id));
CREATE POLICY "Customers create bookings" ON bookings FOR INSERT
  WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Update own bookings" ON bookings FOR UPDATE
  USING (auth.uid() = customer_id OR auth.uid() IN (SELECT owner_id FROM trucks WHERE id = truck_id));

-- Reviews: anyone can read, only reviewer manages theirs
CREATE POLICY "Public reviews readable" ON reviews FOR SELECT USING (TRUE);
CREATE POLICY "Reviewers manage own reviews" ON reviews FOR ALL USING (auth.uid() = reviewer_id);

-- ─── AUTO-CREATE PROFILE ON SIGNUP ───
-- This function runs automatically when someone signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, phone, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── SAMPLE DATA (optional, for testing) ───
-- You can delete this section after setup
