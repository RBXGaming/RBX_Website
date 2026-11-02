import { supabase, isSupabaseConfigured } from './supabase';
import {
  Booking,
  BookingStatus,
  PaymentStatus,
  GamingType,
  ResourceId,
  AppConfig,
} from '../types';
import {
  getLocalBookings,
  saveLocalBookings,
  getLocalAppConfig,
  saveLocalAppConfig,
  getAppConfig,
  PC_RESOURCES,
  PS5_RESOURCES,
} from './bookingService';

export interface BookingFilters {
  date?: string;
  gamingType?: GamingType | 'all';
  status?: BookingStatus | 'all';
  searchQuery?: string;
}

/**
 * Fetch all bookings matching optional filters
 */
export async function fetchAdminBookings(filters?: BookingFilters): Promise<Booking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters?.date) {
        query = query.eq('booking_date', filters.date);
      }
      if (filters?.gamingType && filters.gamingType !== 'all') {
        query = query.eq('gaming_type', filters.gamingType);
      }
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('booking_status', filters.status);
      }

      const { data, error } = await query;
      if (!error && data) {
        let list = data as Booking[];
        if (filters?.searchQuery) {
          const q = filters.searchQuery.toLowerCase().trim();
          list = list.filter(
            (b) =>
              b.booking_id.toLowerCase().includes(q) ||
              b.customer_name.toLowerCase().includes(q) ||
              b.mobile_number.includes(q)
          );
        }
        return list;
      }
    } catch (err) {
      console.warn('Supabase admin fetch error:', err);
    }
  }

  // Fallback to local storage
  let list = getLocalBookings().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  if (filters?.date) {
    list = list.filter((b) => b.booking_date === filters.date);
  }
  if (filters?.gamingType && filters.gamingType !== 'all') {
    list = list.filter((b) => b.gaming_type === filters.gamingType);
  }
  if (filters?.status && filters.status !== 'all') {
    list = list.filter((b) => b.booking_status === filters.status);
  }
  if (filters?.searchQuery) {
    const q = filters.searchQuery.toLowerCase().trim();
    list = list.filter(
      (b) =>
        b.booking_id.toLowerCase().includes(q) ||
        b.customer_name.toLowerCase().includes(q) ||
        b.mobile_number.includes(q)
    );
  }

  return list;
}

/**
 * Approve a pending booking -> changes status to 'PAYMENT_REQUIRED'
 * and sets payment deadline.
 */
export async function approveBooking(
  bookingId: string,
  adminNotes?: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const config = await getAppConfig();
  const deadlineMinutes = config.PAYMENT_DEADLINE_MINUTES || 30;
  const deadlineDate = new Date(Date.now() + deadlineMinutes * 60 * 1000).toISOString();

  const updates: Partial<Booking> = {
    booking_status: 'PAYMENT_REQUIRED',
    payment_status: 'PAYMENT_REQUIRED',
    payment_deadline: deadlineDate,
    admin_notes: adminNotes !== undefined ? adminNotes : undefined,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, booking: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  const all = getLocalBookings();
  const idx = all.findIndex((b) => b.booking_id === bookingId);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveLocalBookings(all);
    return { success: true, booking: all[idx] };
  }

  return { success: false, error: 'Booking not found.' };
}

/**
 * Reject a booking -> status becomes 'REJECTED' (releases hold)
 */
export async function rejectBooking(
  bookingId: string,
  adminNotes?: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const updates: Partial<Booking> = {
    booking_status: 'REJECTED',
    admin_notes: adminNotes || 'Booking request was declined by RBX admin.',
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, booking: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  const all = getLocalBookings();
  const idx = all.findIndex((b) => b.booking_id === bookingId);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveLocalBookings(all);
    return { success: true, booking: all[idx] };
  }

  return { success: false, error: 'Booking not found.' };
}

/**
 * Cancel a booking -> status becomes 'CANCELLED' (releases hold)
 */
export async function cancelBooking(
  bookingId: string,
  adminNotes?: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const updates: Partial<Booking> = {
    booking_status: 'CANCELLED',
    admin_notes: adminNotes || 'Booking was cancelled.',
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, booking: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  const all = getLocalBookings();
  const idx = all.findIndex((b) => b.booking_id === bookingId);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveLocalBookings(all);
    return { success: true, booking: all[idx] };
  }

  return { success: false, error: 'Booking not found.' };
}

/**
 * Verify payment -> ONLY action that changes status to 'CONFIRMED'
 */
export async function verifyPayment(
  bookingId: string,
  adminNotes?: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const updates: Partial<Booking> = {
    booking_status: 'CONFIRMED',
    payment_status: 'PAYMENT_VERIFIED',
    payment_verified_at: new Date().toISOString(),
    admin_notes: adminNotes || 'Payment verified by RBX management.',
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, booking: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  const all = getLocalBookings();
  const idx = all.findIndex((b) => b.booking_id === bookingId);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveLocalBookings(all);
    return { success: true, booking: all[idx] };
  }

  return { success: false, error: 'Booking not found.' };
}

/**
 * Reject payment -> resets status back to 'PAYMENT_REQUIRED'
 */
export async function rejectPayment(
  bookingId: string,
  rejectionReason: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const updates: Partial<Booking> = {
    booking_status: 'PAYMENT_REQUIRED',
    payment_status: 'PAYMENT_FAILED',
    admin_notes: `Payment rejected: ${rejectionReason}`,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('booking_id', bookingId)
        .select()
        .single();

      if (error) return { success: false, error: error.message };
      return { success: true, booking: data };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  const all = getLocalBookings();
  const idx = all.findIndex((b) => b.booking_id === bookingId);
  if (idx !== -1) {
    all[idx] = { ...all[idx], ...updates };
    saveLocalBookings(all);
    return { success: true, booking: all[idx] };
  }

  return { success: false, error: 'Booking not found.' };
}

/**
 * Update dynamic app configuration (BOOKING_AMOUNT, etc.)
 */
export async function updateAppConfig(
  newConfig: Partial<AppConfig>
): Promise<{ success: boolean; error?: string }> {
  if (isSupabaseConfigured && supabase) {
    try {
      const entries = Object.entries(newConfig);
      for (const [key, value] of entries) {
        await supabase
          .from('app_config')
          .upsert({ key, value: String(value), updated_at: new Date().toISOString() });
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  const current = getLocalAppConfig();
  const merged = { ...current, ...newConfig };
  saveLocalAppConfig(merged);
  return { success: true };
}

/**
 * Build 24-Hour Resource Calendar Matrix for PC-1/2/3 and PS5-1/2
 */
export interface ResourceScheduleItem {
  resourceId: ResourceId;
  resourceName: string;
  type: 'pc' | 'ps5';
  bookings: {
    bookingId: string;
    customerName: string;
    startTime: string;
    endTime: string;
    startMinutes: number;
    endMinutes: number;
    status: BookingStatus;
    gamingType: GamingType;
    players: number;
  }[];
}

export async function fetchResourceScheduleForDate(dateStr: string): Promise<ResourceScheduleItem[]> {
  const allBookings = await fetchAdminBookings({ date: dateStr });
  const activeBookings = allBookings.filter(
    (b) => !['REJECTED', 'CANCELLED', 'EXPIRED'].includes(b.booking_status)
  );

  const allResources: { id: ResourceId; name: string; type: 'pc' | 'ps5' }[] = [
    { id: 'PC-1', name: 'PC-1 (RTX 5060 • 300Hz)', type: 'pc' },
    { id: 'PC-2', name: 'PC-2 (RTX 5060 • 300Hz)', type: 'pc' },
    { id: 'PC-3', name: 'PC-3 (RTX 5060 • 300Hz)', type: 'pc' },
    { id: 'PS5-1', name: 'PS5-1 (4K Lounge)', type: 'ps5' },
    { id: 'PS5-2', name: 'PS5-2 (4K Lounge)', type: 'ps5' },
  ];

  return allResources.map((res) => {
    const resBookings = activeBookings
      .filter(
        (b) =>
          b.assigned_resource === res.id ||
          (b.assigned_resources && b.assigned_resources.includes(res.id))
      )
      .map((b) => ({
        bookingId: b.booking_id,
        customerName: b.customer_name,
        startTime: b.start_time,
        endTime: b.end_time,
        startMinutes: b.start_minutes,
        endMinutes: b.end_minutes,
        status: b.booking_status,
        gamingType: b.gaming_type,
        players: b.number_of_players,
      }));

    return {
      resourceId: res.id,
      resourceName: res.name,
      type: res.type,
      bookings: resBookings,
    };
  });
}

/**
 * Real-time Supabase subscription for Admin Dashboard.
 * Listens for INSERT, UPDATE, and DELETE events across all bookings.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToAdminBookingsRealtime(handlers: {
  onInsert?: (newBooking: Booking) => void;
  onUpdate?: (updatedBooking: Booking) => void;
  onDelete?: (deletedBookingId: string) => void;
}): () => void {
  if (isSupabaseConfigured && supabase) {
    try {
      const channelName = `admin_bookings_realtime_${Date.now()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            if (payload.new && typeof payload.new === 'object') {
              handlers.onInsert?.(payload.new as Booking);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            if (payload.new && typeof payload.new === 'object') {
              handlers.onUpdate?.(payload.new as Booking);
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: 'bookings',
          },
          (payload) => {
            if (payload.old && typeof payload.old === 'object') {
              const old = payload.old as { id?: string; booking_id?: string };
              handlers.onDelete?.(old.booking_id || old.id || '');
            }
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.warn('[Admin Realtime] Subscription error:', err);
          }
        });

      return () => {
        try {
          supabase?.removeChannel(channel);
        } catch (e) {
          console.warn('[Admin Realtime] Cleanup error:', e);
        }
      };
    } catch (err) {
      console.warn('Failed to subscribe to admin realtime bookings:', err);
    }
  }

  return () => {};
}

// ============================================================================
// CUSTOMER ACCOUNTS (Admin Customers table)
// ============================================================================

export interface CustomerWithStats {
  id: string;
  name: string;
  mobile_number: string;
  email?: string | null;
  first_login_at?: string | null;
  last_login_at?: string | null;
  total_bookings: number;
  active_bookings: number;
  last_booking_date?: string | null;
}

const ACTIVE_CUSTOMER_BOOKING_STATUSES: BookingStatus[] = [
  'PENDING_APPROVAL',
  'PAYMENT_REQUIRED',
  'PAYMENT_SUBMITTED',
  'CONFIRMED',
];

function normalizeMobileDigits(value?: string | null): string {
  return (value || '').replace(/\D/g, '');
}

interface BookingLiteRow {
  id: string;
  user_id: string | null;
  mobile_number: string;
  customer_name: string;
  booking_date: string;
  booking_status: BookingStatus;
}

interface BookingStats {
  total: number;
  active: number;
  lastDate: string | null;
}

function bumpStats(
  map: Map<string, BookingStats>,
  key: string,
  row: BookingLiteRow
): void {
  const entry = map.get(key) || { total: 0, active: 0, lastDate: null };
  entry.total += 1;
  if (ACTIVE_CUSTOMER_BOOKING_STATUSES.includes(row.booking_status)) entry.active += 1;
  if (row.booking_date && (!entry.lastDate || row.booking_date > entry.lastDate)) {
    entry.lastDate = row.booking_date;
  }
  map.set(key, entry);
}

/**
 * Fetch all customers with booking statistics for the Admin Customers table.
 *
 * Primary source: `public.customers` (requires the admin policy from
 * supabase/customer_auth_migration.sql - the admin login must be whitelisted in
 * admin_users). Fallback: aggregates derived from bookings alone, so the tab
 * still works before the migration/whitelist is applied.
 */
export async function fetchCustomersWithStats(): Promise<{
  customers: CustomerWithStats[];
  source: 'profiles' | 'bookings' | 'none';
}> {
  if (!isSupabaseConfigured || !supabase) return { customers: [], source: 'none' };

  // 1. Lightweight booking rows for counting (admins already have read access).
  let bookingRows: BookingLiteRow[] = [];
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id, user_id, mobile_number, customer_name, booking_date, booking_status')
      .order('created_at', { ascending: false });
    if (!error && data) bookingRows = data as BookingLiteRow[];
  } catch {
    bookingRows = [];
  }

  const statsByUser = new Map<string, BookingStats>();
  const statsByMobile = new Map<string, BookingStats>();
  for (const row of bookingRows) {
    if (row.user_id) bumpStats(statsByUser, row.user_id, row);
    const mobileKey = normalizeMobileDigits(row.mobile_number).slice(-10);
    if (mobileKey) bumpStats(statsByMobile, mobileKey, row);
  }

  // 2. Real customer profiles (RLS: admin sees all, customer sees only own).
  try {
    const { data: profiles, error } = await supabase
      .from('customers')
      .select('*')
      .order('last_login_at', { ascending: false, nullsFirst: false });

    if (!error && profiles) {
      // If profiles came back empty while bookings carry user_ids, RLS is
      // almost certainly hiding rows (admin not whitelisted) -> use fallback.
      const hasLinkedBookings = bookingRows.some((b) => !!b.user_id);
      if (profiles.length > 0 || !hasLinkedBookings) {
        const list: CustomerWithStats[] = (profiles as Record<string, unknown>[]).map((p) => {
          const pid = String(p.id ?? '');
          const mobileKey = normalizeMobileDigits(p.mobile_number as string).slice(-10);
          const s =
            statsByUser.get(pid) ||
            statsByMobile.get(mobileKey) || { total: 0, active: 0, lastDate: null };
          return {
            id: pid,
            name: (p.name as string) || '',
            mobile_number: ((p.mobile_number as string) || '').slice(-10),
            email: (p.email as string | null) ?? null,
            first_login_at: (p.first_login_at as string | null) ?? null,
            last_login_at: (p.last_login_at as string | null) ?? null,
            total_bookings: s.total,
            active_bookings: s.active,
            last_booking_date: s.lastDate,
          };
        });
        return { customers: list, source: 'profiles' };
      }
    }
  } catch {
    // customers table missing (migration not run) -> fall through to fallback.
  }

  // 3. Fallback: derive customer rows from bookings (rows are newest-first).
  const grouped = new Map<string, CustomerWithStats>();
  for (const row of bookingRows) {
    const mobileKey = normalizeMobileDigits(row.mobile_number).slice(-10);
    const key = row.user_id || `m:${mobileKey}`;
    const s =
      (row.user_id && statsByUser.get(row.user_id)) ||
      statsByMobile.get(mobileKey) || { total: 1, active: 0, lastDate: row.booking_date || null };
    const existing = grouped.get(key);
    if (existing) {
      if (!existing.name && row.customer_name) existing.name = row.customer_name;
      continue;
    }
    grouped.set(key, {
      id: row.user_id || key,
      name: row.customer_name || '',
      mobile_number: mobileKey,
      email: null,
      first_login_at: null,
      last_login_at: null,
      total_bookings: s.total,
      active_bookings: s.active,
      last_booking_date: s.lastDate,
    });
  }

  return { customers: Array.from(grouped.values()), source: 'bookings' };
}

