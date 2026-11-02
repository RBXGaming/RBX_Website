export type GamingType = 'pc' | 'ps5_single' | 'ps5_multi';

export type BookingStatus =
  | 'PENDING_APPROVAL'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_SUBMITTED'
  | 'CONFIRMED'
  | 'REJECTED'
  | 'EXPIRED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'NOT_REQUIRED'
  | 'PAYMENT_REQUIRED'
  | 'PAYMENT_SUBMITTED'
  | 'PAYMENT_VERIFIED'
  | 'PAYMENT_FAILED'
  | 'REFUNDED';

export type ResourceId = 'PC-1' | 'PC-2' | 'PC-3' | 'PS5-1' | 'PS5-2';

export interface Resource {
  id: ResourceId;
  name: string;
  type: 'pc' | 'ps5';
  max_players: number;
  is_active: boolean;
  display_order: number;
}

export interface Booking {
  id: string;
  booking_id: string;
  customer_name: string;
  mobile_number: string;
  /** Authenticated Supabase customer who created this booking (null for legacy/anonymous bookings). */
  user_id?: string;
  email?: string;
  gaming_type: GamingType;
  ps5_mode?: 'single' | 'multi';
  number_of_players: number;
  booking_date: string; // YYYY-MM-DD
  start_time: string; // e.g. '07:30 PM' or '19:30'
  end_time: string; // e.g. '09:30 PM' or '21:30'
  start_minutes: number; // 0 - 1439
  end_minutes: number; // 0 - 2880 (handles overnight)
  duration: number; // hours (1 - 8)
  assigned_resource?: ResourceId | string;
  assigned_resources?: (ResourceId | string)[];
  calculated_price: number;
  booking_amount: number;
  booking_status: BookingStatus;
  payment_status: PaymentStatus;
  payment_submitted_at?: string;
  payment_verified_at?: string;
  payment_deadline?: string;
  payment_reference?: string;
  payment_method?: string;
  payment_notes?: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface AppConfig {
  BOOKING_AMOUNT: number;
  PAYMENT_DEADLINE_MINUTES: number;
  UPI_ID: string;
  UPI_NAME: string;
  CAFE_PHONE: string;
  [key: string]: any;
}

export interface AvailabilityCheckResult {
  isAvailable: boolean;
  availableCount: number;
  totalCapacity: number;
  assignedResource?: ResourceId | string;
  assignedResources?: (ResourceId | string)[];
  statusDisplay: string;
  isPendingHold?: boolean;
}

export interface PricingPlan {
  id: string;
  title: string;
  subtitle?: string;
  type: GamingType;
  rate: number;
  unit: string;
  specs?: string[];
  description: string;
  popular?: boolean;
  features: string[];
}

export interface GameItem {
  id: string;
  title: string;
  category: 'pc' | 'ps5_single' | 'ps5_multi' | 'ps5_fighting' | 'fps' | 'battleroyale' | 'sports' | 'action' | 'racing' | 'strategy';
  platform: ('PC' | 'PS5')[];
  image: string;
  popular?: boolean;
  tagline: string;
  station?: string; // 'All PC Stations' | 'PS5-1' | 'PS5-2'
  ps5Category?: 'SINGLE PLAYER STORY MODE' | 'MULTIPLAYER STORY MODE' | 'MULTIPLAYER FIGHTING GAMES';
  players?: string; // '2 PLAYER' | '4 PLAYER' | 'ONLINE PLAYER'
}

export interface PS5CategoryGroup {
  id: string;
  categoryTitle: string;
  description: string;
  ps5_1: {
    title: string;
    players?: string;
  }[];
  ps5_2: {
    title: string;
    players?: string;
  }[];
}

export interface OfferItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
  discountText: string;
  validity: string;
  highlight?: boolean;
}

export interface MembershipTier {
  id: string;
  name: string;
  price: string;
  period: string;
  popular?: boolean;
  perks: string[];
  discountRate: string;
  bonusHours: string;
  color: string;
}

export interface TournamentItem {
  id: string;
  title: string;
  game: string;
  gameImage: string;
  date: string;
  time: string;
  entryFee: string;
  prizePool: string;
  format: string;
  teamSize: string;
  slotsTotal: number;
  slotsFilled: number;
  status: 'Registration Open' | 'Upcoming' | 'Completed';
  rules: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'pc' | 'ps5' | 'arena' | 'cafe' | 'events';
  image: string;
  caption: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  gamePlayed: string;
  comment: string;
  avatar: string;
  verified: boolean;
}

export interface BookingFormData {
  gamingType: GamingType;
  playersCount: number;
  date: string;
  timeSlot: string;
  durationHours: number;
  customerName: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  gameRequested?: string;
  /** Supabase authenticated customer id — links the booking to the account. */
  userId?: string;
}

export interface CustomerProfile {
  id: string;
  mobile_number: string;
  name: string;
  email?: string | null;
  first_login_at?: string;
  last_login_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
