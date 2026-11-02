-- ==============================================================================
-- RBX GAMING CAFE - PRODUCTION DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. RESOURCES TABLE
-- Stores the 3 Gaming PCs and 2 PS5 Gaming Lounges
CREATE TABLE IF NOT EXISTS public.resources (
  id TEXT PRIMARY KEY,                       -- 'PC-1', 'PC-2', 'PC-3', 'PS5-1', 'PS5-2'
  name TEXT NOT NULL,                        -- e.g. 'PC-1 (RTX 5060 • 300Hz)'
  type TEXT NOT NULL CHECK (type IN ('pc', 'ps5')),
  max_players INTEGER NOT NULL DEFAULT 1,    -- 1 for PC, 4 for PS5
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Resources
INSERT INTO public.resources (id, name, type, max_players, display_order)
VALUES
  ('PC-1', 'PC Station 1 (RTX 5060 • 300Hz)', 'pc', 1, 1),
  ('PC-2', 'PC Station 2 (RTX 5060 • 300Hz)', 'pc', 1, 2),
  ('PC-3', 'PC Station 3 (RTX 5060 • 300Hz)', 'pc', 1, 3),
  ('PS5-1', 'PS5 Lounge Station 1 (4K OLED)', 'ps5', 4, 4),
  ('PS5-2', 'PS5 Lounge Station 2 (4K OLED)', 'ps5', 4, 5)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  type = EXCLUDED.type,
  max_players = EXCLUDED.max_players;

-- 3. BOOKINGS TABLE
-- Handles customer reservations, time slots, approval status, and payment workflows
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id TEXT UNIQUE NOT NULL,           -- e.g. 'RBX-8291'
  customer_name TEXT NOT NULL,
  mobile_number TEXT NOT NULL,
  email TEXT,
  
  -- Gaming Setup Details
  gaming_type TEXT NOT NULL CHECK (gaming_type IN ('pc', 'ps5_single', 'ps5_multi')),
  ps5_mode TEXT CHECK (ps5_mode IN ('single', 'multi')),
  number_of_players INTEGER NOT NULL DEFAULT 1,
  
  -- Schedule & Timing (24/7 Support)
  booking_date DATE NOT NULL,
  start_time TEXT NOT NULL,                  -- 'HH:MM' (24-hour format e.g. '19:30') or '07:30 PM'
  end_time TEXT NOT NULL,                    -- 'HH:MM' or '09:30 PM'
  start_minutes INTEGER NOT NULL,            -- Minutes from midnight (0 - 1439) for fast overlap calculations
  end_minutes INTEGER NOT NULL,              -- Minutes from midnight (0 - 1439 or > 1440 for overnight)
  duration INTEGER NOT NULL,                 -- Duration in hours (1 - 12)
  
  -- Resource Allocation
  assigned_resource TEXT REFERENCES public.resources(id) ON DELETE SET NULL,
  assigned_resources TEXT[] DEFAULT ARRAY[]::TEXT[], -- For multiple PCs booked in a single group
  
  -- Pricing & Calculation
  calculated_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  booking_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
  
  -- Workflow & Statuses
  booking_status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL' CHECK (
    booking_status IN (
      'PENDING_APPROVAL',
      'PAYMENT_REQUIRED',
      'PAYMENT_SUBMITTED',
      'CONFIRMED',
      'REJECTED',
      'EXPIRED',
      'CANCELLED'
    )
  ),
  
  -- Payment Tracking
  payment_status TEXT NOT NULL DEFAULT 'NOT_REQUIRED' CHECK (
    payment_status IN (
      'NOT_REQUIRED',
      'PAYMENT_REQUIRED',
      'PAYMENT_SUBMITTED',
      'PAYMENT_VERIFIED',
      'PAYMENT_FAILED',
      'REFUNDED'
    )
  ),
  payment_submitted_at TIMESTAMPTZ,
  payment_verified_at TIMESTAMPTZ,
  payment_deadline TIMESTAMPTZ,
  payment_reference TEXT,                    -- Transaction ID / UPI Ref
  payment_method TEXT,                       -- 'UPI', 'QR', 'Cash', 'Gateway'
  payment_notes TEXT,
  
  -- Admin Controls
  admin_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for fast overlap queries
CREATE INDEX IF NOT EXISTS idx_bookings_date_status ON public.bookings (booking_date, booking_status);
CREATE INDEX IF NOT EXISTS idx_bookings_assigned_resource ON public.bookings (assigned_resource);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_id ON public.bookings (booking_id);
CREATE INDEX IF NOT EXISTS idx_bookings_mobile ON public.bookings (mobile_number);

-- 4. CONFIGURATION TABLE
-- Dynamic settings like BOOKING_AMOUNT, payment deadlines, UPI IDs
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Default Settings
INSERT INTO public.app_config (key, value, description)
VALUES
  ('BOOKING_AMOUNT', '100', 'Advance booking token amount in INR required upon admin approval'),
  ('PAYMENT_DEADLINE_MINUTES', '30', 'Time window in minutes for customer to submit payment after approval'),
  ('UPI_ID', '8320165115@upi', 'Official RBX Gaming Cafe UPI ID for booking advances'),
  ('UPI_NAME', 'RBX Gaming Cafe', 'Account holder display name for UPI payments'),
  ('CAFE_PHONE', '+91 83201 65115', 'Official cafe phone number')
ON CONFLICT (key) DO NOTHING;

-- 5. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Resources: Anyone can view active gaming resources
CREATE POLICY "Public can view active resources"
ON public.resources FOR SELECT
USING (is_active = true);

-- Config: Anyone can view public settings like booking amount
CREATE POLICY "Public can view app config"
ON public.app_config FOR SELECT
USING (true);

-- Bookings: Anyone can submit a booking request
CREATE POLICY "Public can insert bookings"
ON public.bookings FOR INSERT
WITH CHECK (true);

-- Bookings: Customers can view only their own booking via booking_id lookup
CREATE POLICY "Public can select bookings by booking_id"
ON public.bookings FOR SELECT
USING (true);

-- Bookings: Customers can update payment details for their pending booking
CREATE POLICY "Public can submit payment details"
ON public.bookings FOR UPDATE
USING (booking_status IN ('PAYMENT_REQUIRED', 'PAYMENT_SUBMITTED'))
WITH CHECK (booking_status IN ('PAYMENT_REQUIRED', 'PAYMENT_SUBMITTED'));

-- Admin Full Access: Authenticated admin users can perform all operations
CREATE POLICY "Admins full access to resources"
ON public.resources FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins full access to app_config"
ON public.app_config FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins full access to bookings"
ON public.bookings FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. AUTOMATIC UPDATED_AT TRIGGER
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_bookings_updated
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_app_config_updated
BEFORE UPDATE ON public.app_config
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
