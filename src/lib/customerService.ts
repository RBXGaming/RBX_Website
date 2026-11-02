import { supabase, isSupabaseConfigured } from './supabase';
import { CustomerProfile, Booking } from '../types';

// India country code for Supabase phone OTP (E.164 format)
const COUNTRY_CODE = '+91';

/** Strips everything except digits from a phone string. */
export function digitsOnly(value: string): string {
  return (value || '').replace(/\D/g, '');
}

/** Converts a raw 10-digit Indian mobile number into E.164 format required by Supabase Auth. */
export function toE164(value: string): string {
  const digits = digitsOnly(value);
  return `${COUNTRY_CODE}${digits.slice(-10)}`;
}

function notConfiguredError() {
  return {
    success: false,
    error:
      'Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable mobile OTP login.',
  };
}

/**
 * Sends a real SMS OTP to the customer's mobile via Supabase Auth.
 * Supabase sends the 6-digit code through the configured SMS provider
 * (Twilio / Vonage / MessageBird / etc). No OTP is ever stored by this app.
 */
export async function sendOtp(rawPhone: string): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return notConfiguredError();

  const digits = digitsOnly(rawPhone);
  if (digits.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      phone: toE164(rawPhone),
      options: { channel: 'sms' },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to send OTP. Please try again.' };
  }
}

async function fetchCustomerById(userId: string): Promise<CustomerProfile | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    if (error) {
      console.warn('Failed to fetch customer profile:', error);
      return null;
    }
    return (data as CustomerProfile | null) ?? null;
  } catch (err) {
    console.warn('Customer profile fetch error:', err);
    return null;
  }
}

/**
 * Verifies the OTP code sent to the customer's mobile.
 * Returns the customer profile plus isNewUser = true when the customer has no
 * name on record yet (first-time logins must enter their name).
 */
export async function verifyOtp(
  rawPhone: string,
  token: string
): Promise<{ success: boolean; profile?: CustomerProfile; isNewUser?: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return notConfiguredError();

  const digits = digitsOnly(rawPhone);
  if (digits.length < 10) {
    return { success: false, error: 'Please enter a valid 10-digit mobile number.' };
  }
  if (!token.trim()) {
    return { success: false, error: 'Please enter the 6-digit OTP received on your mobile.' };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: toE164(rawPhone),
      token: token.trim(),
      type: 'sms',
    });

    if (error) return { success: false, error: error.message };

    const user = data?.user;
    if (!user) return { success: false, error: 'Could not retrieve your account after verification.' };

    const now = new Date().toISOString();
    let profile: CustomerProfile | null = await fetchCustomerById(user.id);
    const isNewUser = !profile || !(profile.name || '').trim();

    if (profile) {
      const { data: updated, error: updErr } = await supabase
        .from('customers')
        .update({ mobile_number: digits, last_login_at: now, updated_at: now })
        .eq('id', user.id)
        .select()
        .single();
      if (!updErr && updated) profile = updated as CustomerProfile;
    } else {
      // The DB trigger normally auto-creates the row; fallback insert just in case.
      const { data: inserted, error: insErr } = await supabase
        .from('customers')
        .upsert(
          {
            id: user.id,
            mobile_number: digits,
            name: typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '',
            email: user.email || null,
            first_login_at: now,
            last_login_at: now,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();
      if (!insErr && inserted) profile = inserted as CustomerProfile;
    }

    return profile
      ? { success: true, profile, isNewUser }
      : { success: false, error: 'Could not load customer profile.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Verification failed. Please try again.' };
  }
}
/**
 * Reads the persisted Supabase session for the currently logged-in customer.
 * Session persistence is handled entirely by Supabase Auth (localStorage + auto
 * token refresh), so returning customers stay logged in across visits.
 */
export async function getCurrentCustomer(): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data } = await supabase.auth.getSession();
    const user = data?.session?.user;
    if (!user?.id) return null;

    let profile = await fetchCustomerById(user.id);

    if (!profile && user.phone) {
      const now = new Date().toISOString();
      const { data: inserted, error } = await supabase
        .from('customers')
        .upsert(
          {
            id: user.id,
            mobile_number: digitsOnly(user.phone),
            name: typeof user.user_metadata?.name === 'string' ? user.user_metadata.name : '',
            email: user.email || null,
            first_login_at: now,
            last_login_at: now,
          },
          { onConflict: 'id' }
        )
        .select()
        .single();
      if (!error && inserted) profile = inserted as CustomerProfile;
    }

    return profile;
  } catch (err) {
    console.warn('getCurrentCustomer error:', err);
    return null;
  }
}

/** Updates the customer name (used for first-time login name capture). */
export async function saveCustomerName(
  name: string
): Promise<{ success: boolean; profile?: CustomerProfile; error?: string }> {
  if (!isSupabaseConfigured || !supabase) return notConfiguredError();
  const clean = (name || '').trim();
  if (!clean) return { success: false, error: 'Please enter your name.' };

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData?.session?.user?.id;
    if (!userId) return { success: false, error: 'You are not logged in. Please log in again.' };

    const { data, error } = await supabase
      .from('customers')
      .update({ name: clean, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, profile: (data as CustomerProfile) ?? undefined };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to update your name.' };
  }
}

/** Returns all bookings linked to the authenticated customer. */
export async function getCustomerBookings(): Promise<Booking[]> {
  if (!isSupabaseConfigured || !supabase) return [];

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData?.session?.user;
    if (!user?.id) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('booking_date', { ascending: false });

    if (!error && data) return data as Booking[];

    // Fallback: local-storage bookings that match this customer mobile number.
    const base = user.phone ? digitsOnly(user.phone) : '';
    try {
      const raw = localStorage.getItem('rbx_bookings_data');
      if (raw) {
        const all = JSON.parse(raw) as Booking[];
        return all
          .filter((b) => base && digitsOnly(b.mobile_number) === base)
          .sort((a, b) => new Date(b.booking_date || 0).getTime() - new Date(a.booking_date || 0).getTime());
      }
    } catch (e) {}
  } catch (err) {
    console.warn('getCustomerBookings error:', err);
  }
  return [];
}

/** Logs the customer out of Supabase Auth (customer sessions are separate from admin). */
export async function logoutCustomer(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
  }
}

export type CustomerAuthListener = (profile: CustomerProfile | null) => void;

/** Reacts to Supabase auth state changes and reflects the current customer profile. */
export function subscribeToCustomerAuth(onChange: CustomerAuthListener): () => void {
  if (!isSupabaseConfigured || !supabase) return () => {};

  const { data } = supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      onChange(null);
    } else if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      getCurrentCustomer().then((profile) => onChange(profile));
    }
  });

  return () => {
    try {
      data.subscription.unsubscribe();
    } catch (e) {}
  };
}
