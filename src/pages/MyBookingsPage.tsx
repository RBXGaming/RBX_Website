import React, { useState, useEffect, useCallback } from 'react';
import {
  UserRound,
  Smartphone,
  LogIn,
  RefreshCw,
  Clock,
  Calendar,
  Ticket,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  PencilLine,
  Save,
  X,
  ShieldCheck,
} from 'lucide-react';
import { CustomerProfile, Booking } from '../types';
import { getCustomerBookings, saveCustomerName, logoutCustomer, digitsOnly } from '../lib/customerService';
import { Button } from '../components/common/Button';

interface MyBookingsPageProps {
  customer: CustomerProfile | null;
  onLoginRequest: () => void;
  onNavigate?: (page: string) => void;
  onCustomerLoggedOut?: () => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const ACTIVE_STATUSES = ['PENDING_APPROVAL', 'PAYMENT_REQUIRED', 'PAYMENT_SUBMITTED', 'CONFIRMED'];

function isPastBooking(b: Booking, todayStr: string): boolean {
  if (b.booking_date < todayStr) return true;
  if (!ACTIVE_STATUSES.includes(b.booking_status)) return true;
  return false;
}

const statusStyles: Record<string, string> = {
  PENDING_APPROVAL: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  PAYMENT_REQUIRED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  PAYMENT_SUBMITTED: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  CONFIRMED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/30',
  EXPIRED: 'bg-rbx-dark-700/60 text-rbx-dark-300 border-white/10',
  CANCELLED: 'bg-rbx-dark-700/60 text-rbx-dark-300 border-white/10',
};

function BookingCard({ booking, onOpen }: { booking: Booking; onOpen: (id: string) => void }) {
  const platformLabel =
    booking.gaming_type === 'pc' ? 'RTX 5060 PC' : booking.gaming_type === 'ps5_single' ? 'PS5 Single' : 'PS5 Multi';
  return (
    <div className="p-5 rounded-2xl glass-panel border-rbx-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono font-bold text-rbx-red text-sm">{booking.booking_id}</span>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[booking.booking_status] || statusStyles.EXPIRED}`}>
            {booking.booking_status.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-rbx-dark-200">
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" /> {booking.booking_date}
          </span>
          <span className="inline-flex items-center gap-1.5 font-semibold">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> {booking.start_time} - {booking.end_time}
          </span>
          <span>🎮 {platformLabel} • {booking.number_of_players} player(s)</span>
        </div>
        <div className="text-xs text-rbx-dark-400">
          Station:{' '}
          <span className="text-emerald-400 font-bold">
            {booking.assigned_resources?.join(', ') || booking.assigned_resource || 'Reserved'}
          </span>{' '}
          • <span className="text-white font-bold">₹{booking.calculated_price}</span> total
        </div>
      </div>
      <button
        type="button"
        onClick={() => onOpen(booking.booking_id)}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-rbx-dark-700 hover:bg-rbx-red text-white text-xs font-bold border border-white/10 hover:border-rbx-red transition-all shrink-0 cursor-pointer"
      >
        <ExternalLink className="w-3.5 h-3.5" /> VIEW / PAY
      </button>
    </div>
  );
}
export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  customer,
  onLoginRequest,
  onNavigate,
  onCustomerLoggedOut,
  onToast,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [nameDraft, setNameDraft] = useState<string>('');
  const [savingName, setSavingName] = useState<boolean>(false);

  const loadBookings = useCallback(async () => {
    if (!customer) {
      setBookings([]);
      return;
    }
    setLoading(true);
    const list = await getCustomerBookings();
    setBookings(list);
    setLoading(false);
  }, [customer]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  if (!customer) {
    return (
      <div className="pt-28 pb-24 bg-rbx-bg min-h-[60vh]">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rbx-red/15 text-rbx-red border border-rbx-red/40 flex items-center justify-center mx-auto shadow-glow-subtle">
            <LogIn className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white font-display uppercase tracking-tight mt-5">My Bookings</h1>
          <p className="text-sm text-rbx-dark-300 mt-2">
            Log in with your mobile OTP to view your current, upcoming and past bookings.
          </p>
          <div className="mt-6">
            <Button size="lg" variant="primary" onClick={onLoginRequest}>LOGIN WITH MOBILE OTP</Button>
          </div>
        </div>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const activeBookings = bookings.filter((b) => !isPastBooking(b, todayStr));
  const pastBookings = bookings.filter((b) => isPastBooking(b, todayStr));

  const handleOpenBooking = (bookingId: string) => onNavigate?.(`track?id=${bookingId}`);

  const handleSaveName = async () => {
    if (!nameDraft.trim()) {
      onToast?.('error', 'Name Required', 'Please enter your name.');
      return;
    }
    setSavingName(true);
    const res = await saveCustomerName(nameDraft);
    setSavingName(false);
    if (res.success && res.profile) {
      setEditingName(false);
      onToast?.('success', 'Name Updated', 'Your name has been updated.');
    } else {
      onToast?.('error', 'Update Failed', res.error || 'Could not update name.');
    }
  };

  const handleLogout = async () => {
    await logoutCustomer();
    onCustomerLoggedOut?.();
    onNavigate?.('home');
  };

  return (
    <div className="pt-24 pb-24 bg-rbx-bg">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rbx-red">Customer Account</span>
            <h1 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight mt-1">My Bookings</h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rbx-dark-800 hover:bg-red-500/20 text-xs font-bold text-rbx-dark-300 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" /> Logout
          </button>
        </div>

        <div className="p-6 sm:p-7 rounded-3xl glass-panel border-rbx-border mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-rbx-red/25 to-rbx-dark-700 text-rbx-red border border-rbx-red/40 flex items-center justify-center shrink-0 shadow-glow-subtle">
              <UserRound className="w-8 h-8" />
            </div>
            <div className="flex-1 min-w-0">
              {editingName ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    className="w-56 px-3.5 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rbx-red/60"
                    placeholder="Your name"
                  />
                  <button
                    onClick={handleSaveName}
                    disabled={savingName}
                    className="px-4 py-2.5 rounded-xl bg-rbx-red text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Save className="w-3.5 h-3.5 inline mr-1" /> {savingName ? 'SAVING' : 'SAVE'}
                  </button>
                  <button
                    onClick={() => setEditingName(false)}
                    className="px-3 py-2.5 rounded-xl bg-rbx-dark-700 text-rbx-dark-300 text-xs font-bold border border-white/10 cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-display">{customer.name || 'Guest'}</h2>
                  <button
                    onClick={() => { setNameDraft(customer.name || ''); setEditingName(true); }}
                    className="p-1.5 rounded-lg bg-rbx-dark-700 text-rbx-dark-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                    title="Edit name"
                  >
                    <PencilLine className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-rbx-dark-300">
                <span className="inline-flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" /> +91 {digitsOnly(customer.mobile_number).slice(-10)}
                </span>
                {customer.first_login_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> First login: {new Date(customer.first_login_at).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={loadBookings}>Refresh</Button>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
            CURRENT &amp; UPCOMING ({activeBookings.length})
          </h3>
          {loading ? (
            <div className="text-xs text-rbx-dark-300 py-8 text-center">Loading your bookings...</div>
          ) : activeBookings.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel border-rbx-border text-center text-sm text-rbx-dark-300">
              No active bookings yet. Reserve your station and it will appear here.
            </div>
          ) : (
            <div className="space-y-4">
              {activeBookings.map((b) => <BookingCard key={b.id} booking={b} onOpen={handleOpenBooking} />)}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-black text-white font-display uppercase tracking-wider mb-4 flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-rbx-dark-600 text-rbx-dark-300 flex items-center justify-center">
              <Ticket className="w-3.5 h-3.5" />
            </span>
            PAST BOOKINGS ({pastBookings.length})
          </h3>
          {pastBookings.length === 0 ? (
            <div className="p-8 rounded-2xl glass-panel border-rbx-border text-center text-sm text-rbx-dark-300">
              No past bookings yet.
            </div>
          ) : (
            <div className="space-y-4">
              {pastBookings.map((b) => <BookingCard key={b.id} booking={b} onOpen={handleOpenBooking} />)}
            </div>
          )}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-xs text-rbx-dark-400">
          <AlertCircle className="w-3.5 h-3.5 text-rbx-red" />
          <span>Need a new session?{' '}
            <button
              onClick={() => onNavigate?.('booking')}
              className="text-rbx-red font-bold hover:underline cursor-pointer"
            >
              Reserve your station here
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};
