-- ==============================================================================
-- RBX GAMING CAFE - CUSTOMER ACCOUNTS & MOBILE OTP LOGIN (SUPABASE MIGRATION)
-- ==============================================================================
-- Run this in Supabase Dashboard -> SQL Editor AFTER supabase/schema.sql.
-- Idempotent (safe to re-run). It does NOT touch pricing, offers, availability,
-- approval, payment, realtime or station-assignment logic in any way.
--
-- WHAT THIS ADDS
--   1. public.customers        - profiles for OTP-authenticated customers
--   2. public.bookings.user_id - links bookings to the authenticated customer
--   3. public.admin_users      - whitelist of admin auth users (used by RLS)
--   4. public.is_admin()       - SECURITY DEFINER helper used by policies
--   5. Row Level Security for all of the above
--
-- PHONE OTP SETUP (Supabase Dashboard - one time, no code needed):
--   1. Authentication -> Sign In / Providers -> Phone: ENABLE it.
--   2. Configure a REAL SMS provider (Twilio / MessageBird / Vonage / Textlocal)
--      with your Account SID, Auth Token and Sender phone number.
--   3. Keep "Mock SMS" / testing mode OFF in production so real OTPs are sent.
--   4. Review Authentication -> Rate Limits (OTP attempts / resend cooldown).
--   5. Phone format used by the app: E.164 (+91XXXXXXXXXX, India).
--   NOTE: OTPs are generated, sent and verified entirely by Supabase Auth.
--   This app never stores or fakes OTP codes, and only the ANON key is used in
--   the frontend - the service-role key must stay server-side only.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. ADMIN WHITELIST
--    >>> BEFORE RUNNING: replace the email below with your REAL admin login
--    email (the one used on the Admin page), or insert it later with:
--      INSERT INTO public.admin_users (user_id, email)
--      SELECT id, lower(email) FROM auth.users WHERE lower(email) = 'you@mail.com'
--      ON CONFLICT (user_id) DO NOTHING;
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
-- No public policies on admin_users: it is only reachable through is_admin().

INSERT INTO public.admin_users (user_id, email)
SELECT id, lower(email)
FROM auth.users
WHERE lower(email) = 'admin@rbxgamingcafe.com'
ON CONFLICT (user_id) DO NOTHING;


-- ------------------------------------------------------------------------------
-- 2. is_admin() helper (SECURITY DEFINER avoids recursive RLS lookups)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users a
    WHERE a.user_id = (SELECT auth.uid())
  );
$$;

-- ------------------------------------------------------------------------------
-- 3. CUSTOMERS TABLE (profiles for OTP-authenticated customers)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  mobile_number TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  email TEXT,
  first_login_at TIMESTAMPTZ,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_mobile ON public.customers (mobile_number);
CREATE INDEX IF NOT EXISTS idx_customers_last_login ON public.customers (last_login_at DESC);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- A customer can only ever see / edit their OWN profile row.
-- DROP-then-CREATE keeps the script idempotent (CREATE POLICY has no
-- IF NOT EXISTS in Postgres). Re-running just recreates the identical
-- policies, so customer privacy rules are unchanged.
DROP POLICY IF EXISTS "Customers select own profile" ON public.customers;
CREATE POLICY "Customers select own profile"
ON public.customers FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Customers insert own profile" ON public.customers;
CREATE POLICY "Customers insert own profile"
ON public.customers FOR INSERT
TO authenticated
WITH CHECK (id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Customers update own profile" ON public.customers;
CREATE POLICY "Customers update own profile"
ON public.customers FOR UPDATE
TO authenticated
USING (id = (SELECT auth.uid()))
WITH CHECK (id = (SELECT auth.uid()));

-- Whitelisted admins can read every profile (Admin Customers table).
DROP POLICY IF EXISTS "Admins manage all customers" ON public.customers;
CREATE POLICY "Admins manage all customers"
ON public.customers FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- updated_at trigger (reuses handle_updated_at() from schema.sql)
DROP TRIGGER IF EXISTS on_customers_updated ON public.customers;
CREATE TRIGGER on_customers_updated
BEFORE UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 4. LINK BOOKINGS TO CUSTOMERS (additive only - no existing columns changed)
-- ------------------------------------------------------------------------------
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings (user_id);

-- ------------------------------------------------------------------------------
-- 5. OPTIONAL HARDENING (NOT applied - read before enabling)
-- ------------------------------------------------------------------------------
-- The existing policy "Public can select bookings by booking_id" USING (true)
-- is intentionally LEFT AS-IS because anonymous visitors rely on it for
-- (a) slot availability checks and (b) Booking-ID tracking; removing it would
-- break those flows. The requirement "customer mobile must match before showing
-- booking details/payment" is enforced in the app (BookingStatusPage gate).
--
-- If DB-level privacy for bookings is wanted later, move tracking behind an RPC
-- and tighten SELECT, e.g.:
--
-- CREATE OR REPLACE FUNCTION public.get_booking_tracked(p_booking_id TEXT, p_mobile TEXT)
-- RETURNS SETOF public.bookings
-- LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
--   SELECT * FROM public.bookings
--   WHERE booking_id = p_booking_id
--     AND regexp_replace(mobile_number, '\D', '', 'g') =
--         regexp_replace(p_mobile, '\D', '', 'g')
-- $$;
-- ...then REPLACE the broad public SELECT policy with a restricted one.
-- Left as an explicitly documented follow-up; NOT changed in this task.
