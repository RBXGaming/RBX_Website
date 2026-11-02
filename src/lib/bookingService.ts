import { supabase, isSupabaseConfigured } from './supabase';
import {
  Booking,
  BookingFormData,
  BookingStatus,
  PaymentStatus,
  GamingType,
  ResourceId,
  AvailabilityCheckResult,
  AppConfig,
} from '../types';
import { siteConfig } from '../config/siteConfig';
import { digitsOnly } from './customerService';

const LOCAL_STORAGE_BOOKINGS_KEY = 'rbx_bookings_data';
const LOCAL_STORAGE_CONFIG_KEY = 'rbx_app_config';

// Default App Config
export const DEFAULT_APP_CONFIG: AppConfig = {
  BOOKING_AMOUNT: 100, // Configurable booking token in ₹
  PAYMENT_DEADLINE_MINUTES: 30, // 30 mins window to pay once approved
  UPI_ID: '8320165115@upi',
  UPI_NAME: 'RBX Gaming Cafe',
  CAFE_PHONE: '+91 83201 65115',
};

// Verified Hardware Capacity
export const PC_RESOURCES: ResourceId[] = ['PC-1', 'PC-2', 'PC-3'];
export const PS5_RESOURCES: ResourceId[] = ['PS5-1', 'PS5-2'];

/**
 * Parses time string ('07:30 PM', '19:30', '02:00 AM') into total minutes from midnight (0 - 1439)
 */
export function parseTimeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const clean = timeStr.trim();

  // 12-hour format e.g. "07:30 PM" or "7:30 PM"
  const match12 = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const meridiem = match12[3].toUpperCase();

    if (meridiem === 'PM' && hours !== 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // 24-hour format e.g. "19:30"
  const match24 = clean.match(/^(\d{1,2}):(\d{2})$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = parseInt(match24[2], 10);
    return hours * 60 + minutes;
  }

  return 0;
}

/**
 * Formats minutes from midnight into 12-hour display string ('07:30 PM')
 */
export function formatMinutesToTime(totalMinutes: number): string {
  const norm = ((totalMinutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(norm / 60);
  const minutes = norm % 60;
  const meridiem = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const mm = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hh = hours12 < 10 ? `0${hours12}` : `${hours12}`;
  return `${hh}:${mm} ${meridiem}`;
}

/**
 * Calculate end time string from start time and duration
 */
export function calculateEndTime(startTimeStr: string, durationHours: number): string {
  const startMin = parseTimeToMinutes(startTimeStr);
  const endMin = startMin + durationHours * 60;
  return formatMinutesToTime(endMin);
}

/**
 * Checks if two time intervals overlap.
 * Returns true if range A and range B intersect.
 */
export function isTimeOverlapping(startA: number, endA: number, startB: number, endB: number): boolean {
  return Math.max(startA, startB) < Math.min(endA, endB);
}

/** Daytime window: 8:30 AM (inclusive) until 10:00 PM (exclusive).
 *  Overnight runs from 10:00 PM until 8:30 AM (wraps past midnight).
 *  Early-morning slots from 8:30 AM onward are billed at the daytime rate. */
export const DAY_START_MINUTES = 8 * 60 + 30; // 08:30
export const NIGHT_START_MINUTES = 22 * 60; // 22:00

export function isDaytimeMinute(totalMinutes: number): boolean {
  const t = ((totalMinutes % 1440) + 1440) % 1440;
  return t >= DAY_START_MINUTES && t < NIGHT_START_MINUTES;
}

/**
 * Split a session into daytime vs overnight minutes.
 * Day: 8:30 AM – 10:00 PM. Night: 10:00 PM – 8:30 AM (wraps past midnight).
 */
export function splitDayNightMinutes(
  startTimeStr: string,
  durationHours: number
): { dayMinutes: number; nightMinutes: number } {
  const startMin = parseTimeToMinutes(startTimeStr);
  const durationMin = Math.max(0, Math.round(durationHours * 60));
  let dayMinutes = 0;
  let nightMinutes = 0;

  for (let i = 0; i < durationMin; i++) {
    if (isDaytimeMinute(startMin + i)) {
      dayMinutes += 1;
    } else {
      nightMinutes += 1;
    }
  }

  return { dayMinutes, nightMinutes };
}

export interface BookingPriceBreakdown {
  ratePerPersonPerHour: number;
  nightRatePerPersonPerHour: number;
  effectivePlayers: number;
  paidHours: number;
  dayHours: number;
  nightHours: number;
  billableDayHours: number;
  billableNightHours: number;
  dayAmount: number;
  nightAmount: number;
  discountAmount: number;
  offerApplied: boolean;
  overnightApplied: boolean;
  isSplitRate: boolean;
  totalPrice: number;
  offerDescription: string;
}

function formatHourPortion(hours: number): string {
  const rounded = Math.round(hours * 100) / 100;
  return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
}

/**
 * Calculate exact price according to verified rules:
 * Daytime (8:30 AM – 10:00 PM):
 * - PC: ₹100/person/hr. 3+1 (4-hour) / 6+2 (8-hour) FREE offer applies to every
 *   PC booking regardless of start time. 3+1 = 4 total hours (3 paid + 1 free),
 *   6+2 = 8 total hours (6 paid + 2 free); free hours are deducted from the daytime portion first.
 *   The FREE portion of the offer is valued at the DAYTIME rate (₹100) whenever the session
 *   contains any daytime portion; only a fully overnight session values it at the night rate.
 * - PS5 Single: ₹120/hr.
 * - PS5 Multi: ₹100/person/hr. (Max 4 players).
 * Overnight (10:00 PM – 9:30 AM):
 * - Flat ₹120/person/hr for PC, PS5 single, and PS5 multi.
 * Sessions that cross 10:00 PM or 9:30 AM are billed per portion.
 *
 * If startTime is omitted, the whole session is treated as daytime (legacy callers).
 */
export function calculateBookingPrice(
  gamingType: GamingType,
  playersCount: number,
  durationHours: number,
  startTime?: string
): BookingPriceBreakdown {
  const nightRate = siteConfig.pricing.overnightHourly;
  let dayRate = siteConfig.pricing.pcHourly;
  let players = playersCount;

  if (gamingType === 'pc') {
    dayRate = siteConfig.pricing.pcHourly;
    players = Math.max(1, Math.min(3, playersCount));
  } else if (gamingType === 'ps5_single') {
    dayRate = siteConfig.pricing.ps5SingleHourly;
    players = 1;
  } else {
    dayRate = siteConfig.pricing.ps5MultiHourly;
    players = Math.max(2, Math.min(4, playersCount));
  }

  const { dayMinutes, nightMinutes } = startTime
    ? splitDayNightMinutes(startTime, durationHours)
    : { dayMinutes: Math.round(durationHours * 60), nightMinutes: 0 };

  const dayHours = dayMinutes / 60;
  const nightHours = nightMinutes / 60;
  const overnightApplied = nightMinutes > 0;
  const isSplitRate = dayMinutes > 0 && nightMinutes > 0;

  let paidHours = durationHours;
  let discountAmount = 0;
  let offerApplied = false;
  let offerDescription = '';
  let billableDayMinutes = dayMinutes;
  let billableNightMinutes = nightMinutes;

  // PC 3+1 / 6+2 FREE offers: 3+1 = 4 total hours (3 paid + 1 free), 6+2 = 8 total hours
  // (6 paid + 2 free) — regardless of start time (day, overnight, or split).
  // For mixed day/night sessions, free hours are deducted from the DAYTIME portion first.
  if (gamingType === 'pc') {
    const freeHours = durationHours === 4 ? 1 : durationHours === 8 ? 2 : 0;
    if (freeHours > 0) {
      const freeMinutes = freeHours * 60;
      const freeDayMinutes = Math.min(dayMinutes, freeMinutes);
      const freeNightMinutes = freeMinutes - freeDayMinutes;

      billableDayMinutes = dayMinutes - freeDayMinutes;
      billableNightMinutes = Math.max(0, nightMinutes - freeNightMinutes);
      paidHours = Math.round((billableDayMinutes + billableNightMinutes) / 60);
      // Offer discount value: the FREE portion must use the DAYTIME PC rate (₹100)
      // whenever the booking contains ANY daytime portion — even if the free minutes
      // spill into the overnight window. Only a fully overnight session (no daytime)
      // values its free portion at the overnight rate (₹120).
      const freeRatePerHour = dayMinutes > 0 ? dayRate : nightRate;
      discountAmount = Math.round((freeMinutes / 60) * freeRatePerHour * players);
      offerApplied = true;
      offerDescription = freeHours === 1
        ? '3+1 FREE — 4 total hours, 3 paid + 1 free'
        : '6+2 FREE — 8 total hours, 6 paid + 2 free';
    }
  }

  const dayAmount = Math.round((billableDayMinutes / 60) * dayRate * players);
  const nightAmount = Math.round((billableNightMinutes / 60) * nightRate * players);
  const totalPrice = dayAmount + nightAmount;

  if (!offerApplied) {
    if (isSplitRate) {
      offerDescription = `Daytime ₹${dayRate}/hr × ${formatHourPortion(dayHours)} hr + Overnight ₹${nightRate}/hr × ${formatHourPortion(nightHours)} hr`;
    } else if (overnightApplied) {
      offerDescription = `Overnight rate ₹${nightRate}/person/hr (${siteConfig.pricing.nightWindowLabel})`;
    } else if (gamingType === 'ps5_single') {
      offerDescription = `Standard PS5 Single Player Rate (₹${dayRate}/hr)`;
    } else if (gamingType === 'ps5_multi') {
      offerDescription = `PS5 Multiplayer Rate (₹${dayRate}/hr × ${players} Players)`;
    } else {
      offerDescription = `PC daytime rate ₹${dayRate}/person/hr`;
    }
  }

  return {
    ratePerPersonPerHour: dayRate,
    nightRatePerPersonPerHour: nightRate,
    effectivePlayers: players,
    paidHours,
    dayHours,
    nightHours,
    billableDayHours: billableDayMinutes / 60,
    billableNightHours: billableNightMinutes / 60,
    dayAmount,
    nightAmount,
    discountAmount,
    offerApplied,
    overnightApplied,
    isSplitRate,
    totalPrice,
    offerDescription,
  };
}

// -----------------------------------------------------------------------------
// LOCAL STORAGE BACKEND (Fallback for Instant Testing & Cloud Migration)
// -----------------------------------------------------------------------------

export function getLocalBookings(): Booking[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_BOOKINGS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function saveLocalBookings(bookings: Booking[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch (e) {}
}

export function getLocalAppConfig(): AppConfig {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_CONFIG_KEY);
    if (!raw) return DEFAULT_APP_CONFIG;
    return { ...DEFAULT_APP_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_APP_CONFIG;
  }
}

export function saveLocalAppConfig(config: AppConfig): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_CONFIG_KEY, JSON.stringify(config));
  } catch (e) {}
}

/**
 * Fetch application dynamic configuration
 */
export async function getAppConfig(): Promise<AppConfig> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('app_config').select('key, value');
      if (!error && data && data.length > 0) {
        const configMap: any = { ...DEFAULT_APP_CONFIG };
        data.forEach((item: { key: string; value: string }) => {
          if (item.key === 'BOOKING_AMOUNT' || item.key === 'PAYMENT_DEADLINE_MINUTES') {
            configMap[item.key] = Number(item.value) || DEFAULT_APP_CONFIG[item.key];
          } else {
            configMap[item.key] = item.value;
          }
        });
        return configMap as AppConfig;
      }
    } catch (err) {
      console.warn('Falling back to local config:', err);
    }
  }

  return getLocalAppConfig();
}

/**
 * Active holding statuses that hold resources and prevent overlapping bookings
 */
export const ACTIVE_HOLDING_STATUSES: BookingStatus[] = [
  'PENDING_APPROVAL',
  'PAYMENT_REQUIRED',
  'PAYMENT_SUBMITTED',
  'CONFIRMED',
];

/**
 * Check if a booking is expired (past payment deadline without submission)
 */
export function isBookingExpired(booking: Booking): boolean {
  if (booking.booking_status === 'PAYMENT_REQUIRED' && booking.payment_deadline) {
    const deadline = new Date(booking.payment_deadline).getTime();
    if (Date.now() > deadline) {
      return true;
    }
  }
  return false;
}

/**
 * Fetch all active bookings for a given date to perform overlap checks
 */
export async function fetchBookingsForDate(dateStr: string): Promise<Booking[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_date', dateStr)
        .in('booking_status', ACTIVE_HOLDING_STATUSES);

      if (!error && data) {
        // Auto-filter expired bookings
        return data.filter((b) => !isBookingExpired(b));
      }
    } catch (err) {
      console.warn('Error fetching bookings from Supabase, using local:', err);
    }
  }

  const local = getLocalBookings();
  return local.filter(
    (b) => b.booking_date === dateStr && ACTIVE_HOLDING_STATUSES.includes(b.booking_status) && !isBookingExpired(b)
  );
}

/**
 * REAL AVAILABILITY CHECKER
 * Checks overlapping bookings and assigns specific free physical resources.
 */
export async function checkAvailability(params: {
  date: string;
  startTime: string;
  duration: number;
  gamingType: GamingType;
  playersCount: number;
}): Promise<AvailabilityCheckResult> {
  const { date, startTime, duration, gamingType, playersCount } = params;
  const startMin = parseTimeToMinutes(startTime);
  const endMin = startMin + duration * 60;

  const existingBookings = await fetchBookingsForDate(date);

  if (gamingType === 'pc') {
    const totalCapacity = PC_RESOURCES.length; // 3
    const requiredPcs = Math.max(1, Math.min(3, playersCount));

    // Find which PCs are occupied during [startMin, endMin]
    const occupiedPcs = new Set<string>();

    existingBookings.forEach((b) => {
      if (b.gaming_type === 'pc' && isTimeOverlapping(startMin, endMin, b.start_minutes, b.end_minutes)) {
        if (b.assigned_resource) occupiedPcs.add(b.assigned_resource);
        if (b.assigned_resources && Array.isArray(b.assigned_resources)) {
          b.assigned_resources.forEach((r) => occupiedPcs.add(r));
        }
      }
    });

    const freePcs = PC_RESOURCES.filter((pcId) => !occupiedPcs.has(pcId));
    const availableCount = freePcs.length;
    const isAvailable = availableCount >= requiredPcs;

    let statusDisplay = '';
    if (availableCount === 0) {
      statusDisplay = 'NO PC SLOTS AVAILABLE FOR THIS TIME';
    } else if (availableCount === 1) {
      statusDisplay = '1 PC AVAILABLE';
    } else if (availableCount === 2) {
      statusDisplay = '2 PCs AVAILABLE';
    } else {
      statusDisplay = '3 PCs AVAILABLE';
    }

    const assignedResources = isAvailable ? freePcs.slice(0, requiredPcs) : [];
    const assignedResource = assignedResources[0] || undefined;

    return {
      isAvailable,
      availableCount,
      totalCapacity,
      assignedResource,
      assignedResources,
      statusDisplay,
    };
  } else {
    // PS5 Gaming (Single or Multi)
    // 1 PS5 Multiplayer booking uses ONE PS5 station, whether 2, 3, or 4 players!
    const totalCapacity = PS5_RESOURCES.length; // 2

    const occupiedPs5s = new Set<string>();

    existingBookings.forEach((b) => {
      if (
        (b.gaming_type === 'ps5_single' || b.gaming_type === 'ps5_multi') &&
        isTimeOverlapping(startMin, endMin, b.start_minutes, b.end_minutes)
      ) {
        if (b.assigned_resource) occupiedPs5s.add(b.assigned_resource);
        if (b.assigned_resources && Array.isArray(b.assigned_resources)) {
          b.assigned_resources.forEach((r) => occupiedPs5s.add(r));
        }
      }
    });

    const freePs5s = PS5_RESOURCES.filter((ps5Id) => !occupiedPs5s.has(ps5Id));
    const availableCount = freePs5s.length;
    const isAvailable = availableCount >= 1;

    let statusDisplay = '';
    if (availableCount === 2) {
      statusDisplay = '2 OF 2 PS5 SETUPS AVAILABLE';
    } else if (availableCount === 1) {
      statusDisplay = '1 OF 2 PS5 SETUPS AVAILABLE';
    } else {
      statusDisplay = 'FULLY BOOKED';
    }

    return {
      isAvailable,
      availableCount,
      totalCapacity,
      assignedResource: isAvailable ? freePs5s[0] : undefined,
      assignedResources: isAvailable ? [freePs5s[0]] : [],
      statusDisplay,
    };
  }
}

/**
 * Create a new customer booking request with status = 'PENDING_APPROVAL'
 */
export async function createBooking(
  formData: BookingFormData
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  try {
    const config = await getAppConfig();
    const startMin = parseTimeToMinutes(formData.timeSlot);
    const endMin = startMin + formData.durationHours * 60;
    const endTimeStr = formatMinutesToTime(endMin);

    // 1. Check availability
    const avail = await checkAvailability({
      date: formData.date,
      startTime: formData.timeSlot,
      duration: formData.durationHours,
      gamingType: formData.gamingType,
      playersCount: formData.playersCount,
    });

    if (!avail.isAvailable) {
      return {
        success: false,
        error: `Selected slot is no longer available (${avail.statusDisplay}). Please choose another time.`,
      };
    }

    // 2. Calculate Pricing
    const priceResult = calculateBookingPrice(
      formData.gamingType,
      formData.playersCount,
      formData.durationHours,
      formData.timeSlot
    );

    // 3. Generate unique Booking ID: RBX-XXXX
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `RBX-${randomDigits}`;

    const newBooking: Booking = {
      id: crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${randomDigits}`,
      booking_id: bookingId,
      customer_name: formData.customerName.trim(),
      mobile_number: formData.phone.replace(/\D/g, ''),
      user_id: formData.userId || undefined,
      email: formData.email?.trim() || undefined,
      gaming_type: formData.gamingType,
      ps5_mode: formData.gamingType === 'ps5_single' ? 'single' : formData.gamingType === 'ps5_multi' ? 'multi' : undefined,
      number_of_players: priceResult.effectivePlayers,
      booking_date: formData.date,
      start_time: formData.timeSlot,
      end_time: endTimeStr,
      start_minutes: startMin,
      end_minutes: endMin,
      duration: formData.durationHours,
      assigned_resource: avail.assignedResource,
      assigned_resources: avail.assignedResources,
      calculated_price: priceResult.totalPrice,
      booking_amount: config.BOOKING_AMOUNT,
      booking_status: 'PENDING_APPROVAL',
      payment_status: 'NOT_REQUIRED',
      admin_notes: formData.gameRequested ? `Preferred Game: ${formData.gameRequested}` : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 4. Save to database or local storage
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('bookings').insert([newBooking]).select().single();
      if (error) {
        console.error('Supabase booking insert error:', error);
        return { success: false, error: error.message };
      }
      return { success: true, booking: data || newBooking };
    } else {
      const current = getLocalBookings();
      current.push(newBooking);
      saveLocalBookings(current);
      return { success: true, booking: newBooking };
    }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Failed to submit booking request.' };
  }
}

/**
 * Lookup a booking by Booking ID (e.g. 'RBX-8291')
 */
export async function getBookingById(bookingId: string): Promise<Booking | null> {
  const cleanId = bookingId.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('booking_id', cleanId)
        .single();

      if (!error && data) {
        // Auto-check expiration
        if (isBookingExpired(data)) {
          data.booking_status = 'EXPIRED';
        }
        return data;
      }
    } catch (err) {
      console.warn('Supabase lookup error:', err);
    }
  }

  const local = getLocalBookings();
  const found = local.find((b) => b.booking_id.toUpperCase() === cleanId);
  if (found) {
    if (isBookingExpired(found)) {
      found.booking_status = 'EXPIRED';
    }
    return found;
  }

  return null;
}

/**
 * Verifies that a caller-provided mobile number matches the one on the booking.
 * Booking details (and the payment section) are only revealed after this check passes.
 */
export async function verifyBookingAccess(
  bookingId: string,
  mobileNumber: string
): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const booking = await getBookingById(bookingId);
  if (!booking) {
    return { success: false, error: 'No booking found with this Booking ID.' };
  }

  if (digitsOnly(booking.mobile_number) !== digitsOnly(mobileNumber)) {
    return { success: false, error: 'Mobile number does not match this booking.' };
  }

  return { success: true, booking };
}

/**
 * Customer submits payment details after admin approval
 */
export async function submitCustomerPayment(params: {
  bookingId: string;
  paymentReference: string;
  paymentMethod: string;
  paymentNotes?: string;
}): Promise<{ success: boolean; booking?: Booking; error?: string }> {
  const { bookingId, paymentReference, paymentMethod, paymentNotes } = params;
  const booking = await getBookingById(bookingId);

  if (!booking) {
    return { success: false, error: 'Booking not found.' };
  }

  if (booking.booking_status !== 'PAYMENT_REQUIRED') {
    return {
      success: false,
      error: `Payment cannot be submitted for booking with status: ${booking.booking_status}.`,
    };
  }

  if (isBookingExpired(booking)) {
    return {
      success: false,
      error: 'Payment window has expired. Please submit a new booking request.',
    };
  }

  const updates = {
    booking_status: 'PAYMENT_SUBMITTED' as BookingStatus,
    payment_status: 'PAYMENT_SUBMITTED' as PaymentStatus,
    payment_reference: paymentReference.trim(),
    payment_method: paymentMethod,
    payment_notes: paymentNotes?.trim() || undefined,
    payment_submitted_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('booking_id', booking.booking_id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, booking: data };
  } else {
    const all = getLocalBookings();
    const idx = all.findIndex((b) => b.booking_id === booking.booking_id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...updates };
      saveLocalBookings(all);
      return { success: true, booking: all[idx] };
    }
    return { success: false, error: 'Failed to update local booking.' };
  }
}

// -----------------------------------------------------------------------------
// WHATSAPP NOTIFICATION FORMATTERS
// -----------------------------------------------------------------------------

export function getNewBookingWhatsAppUrl(booking: Booking): string {
  const msg = `🎮 *RBX Gaming Cafe - New Booking Request*
━━━━━━━━━━━━━━━━━━━━
📌 *Booking ID:* ${booking.booking_id}
👤 *Customer:* ${booking.customer_name}
📱 *Phone:* ${booking.mobile_number}
🕹️ *Gaming:* ${booking.gaming_type === 'pc' ? 'PC (RTX 5060 • 300Hz)' : booking.gaming_type === 'ps5_single' ? 'PS5 Single Player' : 'PS5 Multiplayer'}
👥 *Players:* ${booking.number_of_players}
📅 *Date:* ${booking.booking_date}
⏰ *Start:* ${booking.start_time}
🏁 *End:* ${booking.end_time}
⏳ *Duration:* ${booking.duration} Hour(s)
💰 *Estimated Total:* ₹${booking.calculated_price}
━━━━━━━━━━━━━━━━━━━━
⏳ *Status:* Booking Pending Admin Approval
📍 *Venue:* 115, Rudram Icon, Gota, Ahmedabad (Open 24/7)

Please review my slot request. Thank you!`;

  return `https://wa.me/91${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function getBookingApprovedWhatsAppUrl(booking: Booking): string {
  const msg = `🎮 *RBX Gaming Cafe - Booking Approved*
━━━━━━━━━━━━━━━━━━━━
📌 *Booking ID:* ${booking.booking_id}
👤 *Customer:* ${booking.customer_name}
🕹️ *Gaming:* ${booking.gaming_type}
👥 *Players:* ${booking.number_of_players}
📅 *Date:* ${booking.booking_date}
⏰ *Time:* ${booking.start_time} - ${booking.end_time}
⏳ *Duration:* ${booking.duration} Hour(s)
💰 *Estimated Total:* ₹${booking.calculated_price}
💳 *Booking Advance Due:* ₹${booking.booking_amount}
━━━━━━━━━━━━━━━━━━━━
Please complete the booking payment to confirm your slot.
📍 *Venue:* Gota, Ahmedabad (Open 24/7)`;

  return `https://wa.me/91${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
}

export function getBookingConfirmedWhatsAppUrl(booking: Booking): string {
  const msg = `🎮 *RBX Gaming Cafe - Booking Confirmed*
━━━━━━━━━━━━━━━━━━━━
📌 *Booking ID:* ${booking.booking_id}
👤 *Customer:* ${booking.customer_name}
🕹️ *Gaming:* ${booking.gaming_type}
🖥️ *Assigned Station:* ${booking.assigned_resource || 'Reserved Station'}
👥 *Players:* ${booking.number_of_players}
📅 *Date:* ${booking.booking_date}
⏰ *Time:* ${booking.start_time} - ${booking.end_time}
━━━━━━━━━━━━━━━━━━━━
✅ *Your booking has been confirmed!*
Your gaming rig is reserved. See you at the cafe!
📍 *Venue:* 115, First Floor, Rudram Icon, Gota, Ahmedabad`;

  return `https://wa.me/91${siteConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
}

/**
 * Subscribe to Supabase Realtime changes for a single booking by booking_id.
 * Listens for UPDATE (and other relevant events) on public.bookings.
 * Returns an unsubscribe cleanup function.
 */
export function subscribeToBookingRealtime(
  bookingId: string,
  onUpdate: (updatedBooking: Booking) => void
): () => void {
  const cleanId = bookingId.trim().toUpperCase();
  if (!cleanId) return () => {};

  if (isSupabaseConfigured && supabase) {
    try {
      const channelName = `realtime_booking_${cleanId}_${Date.now()}`;
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bookings',
            filter: `booking_id=eq.${cleanId}`,
          },
          (payload) => {
            if (payload.new && typeof payload.new === 'object') {
              const row = payload.new as Booking;
              if (row.booking_id && row.booking_id.toUpperCase() === cleanId) {
                if (isBookingExpired(row)) {
                  row.booking_status = 'EXPIRED';
                }
                onUpdate(row);
              }
            }
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.warn(`[Realtime] Subscription error for ${cleanId}:`, err);
          }
        });

      return () => {
        try {
          supabase?.removeChannel(channel);
        } catch (e) {
          console.warn('[Realtime] Cleanup channel error:', e);
        }
      };
    } catch (err) {
      console.warn('Failed to subscribe to Supabase Realtime for booking:', err);
    }
  }

  return () => {};
}

