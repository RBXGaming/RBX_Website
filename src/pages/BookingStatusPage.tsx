import React, { useState, useEffect } from 'react';
import {
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Copy,
  MessageSquare,
  QrCode,
  CreditCard,
  MapPin,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
} from 'lucide-react';
import { Booking, BookingStatus, PaymentStatus, CustomerProfile } from '../types';
import {
  getBookingById,
  submitCustomerPayment,
  verifyBookingAccess,
  getBookingApprovedWhatsAppUrl,
  getBookingConfirmedWhatsAppUrl,
  getNewBookingWhatsAppUrl,
  getAppConfig,
  subscribeToBookingRealtime,
} from '../lib/bookingService';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';

interface BookingStatusPageProps {
  initialBookingId?: string;
  onNavigate?: (page: string) => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  customer?: CustomerProfile | null;
}

export const BookingStatusPage: React.FC<BookingStatusPageProps> = ({
  initialBookingId = '',
  onNavigate,
  onToast,
  customer,
}) => {
  const [searchId, setSearchId] = useState<string>(initialBookingId);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null);
  const [verifiedMobile, setVerifiedMobile] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Payment form state
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState<boolean>(false);

  // App Config
  const [appConfig, setAppConfig] = useState<any>({
    BOOKING_AMOUNT: 100,
    UPI_ID: '8320165115@upi',
    UPI_NAME: 'RBX Gaming Cafe',
  });

  // Countdown timer for payment deadline
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    getAppConfig().then((cfg) => setAppConfig(cfg));
  }, []);

  const handleSearch = async (idToSearch?: string) => {
    const targetId = (idToSearch || searchId).trim().toUpperCase();
    if (!targetId) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const found = await getBookingById(targetId);
      if (found) {
        setBooking(null);
        setPendingBooking(found);
        setVerifiedMobile('');
        // If the logged-in customer's mobile matches, unlock instantly — they already
        // proved phone ownership via OTP.
        if (customer && customer.mobile_number) {
          const digits = customer.mobile_number.replace(/\D/g, '');
          const bookingDigits = (found.mobile_number || '').replace(/\D/g, '');
          if (digits === bookingDigits) {
            setVerifiedMobile(digits);
            setBooking(found);
            setPendingBooking(null);
          }
        }
      } else {
        setBooking(null);
        setPendingBooking(null);
        setErrorMsg(`No booking found with ID "${targetId}". Please verify your booking code.`);
      }
    } catch (err: any) {
      setErrorMsg('Failed to lookup booking details.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyMobile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const targetId = searchId.trim().toUpperCase();
    if (!targetId || !pendingBooking) return;

    setLoading(true);
    setErrorMsg('');
    try {
      const res = await verifyBookingAccess(targetId, verifiedMobile);
      if (res.success && res.booking) {
        setBooking(res.booking);
        setPendingBooking(null);
      } else {
        setErrorMsg(res.error || 'Mobile number does not match this booking.');
      }
    } catch (err: any) {
      setErrorMsg('Unable to verify mobile number. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load from props or URL query parameter
  useEffect(() => {
    let targetId = initialBookingId;
    if (!targetId && typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      targetId = params.get('id') || params.get('booking_id') || '';
    }

    if (targetId) {
      setSearchId(targetId);
      handleSearch(targetId);
    }
  }, [initialBookingId]);

  // REAL-TIME SUPABASE SYNCHRONIZATION FOR THIS BOOKING
  useEffect(() => {
    if (!booking?.booking_id) return;

    const currentBookingId = booking.booking_id;
    setIsLiveConnected(true);

    const unsubscribe = subscribeToBookingRealtime(currentBookingId, (updatedBooking) => {
      setBooking((prevBooking) => {
        if (!prevBooking) return updatedBooking;

        // Detect critical status changes and inform the customer
        if (prevBooking.booking_status !== updatedBooking.booking_status) {
          if (
            prevBooking.booking_status === 'PENDING_APPROVAL' &&
            updatedBooking.booking_status === 'PAYMENT_REQUIRED'
          ) {
            onToast?.(
              'success',
              'Booking Approved!',
              'Your slot has been approved! Please submit your advance payment to confirm.'
            );
          } else if (
            prevBooking.booking_status === 'PAYMENT_SUBMITTED' &&
            updatedBooking.booking_status === 'CONFIRMED'
          ) {
            onToast?.(
              'success',
              'Booking Confirmed!',
              'Payment verified by management! Your gaming rig is reserved.'
            );
          } else if (updatedBooking.booking_status === 'REJECTED') {
            onToast?.(
              'error',
              'Booking Request Declined',
              updatedBooking.admin_notes || 'Your booking request was declined.'
            );
          } else if (updatedBooking.booking_status === 'CANCELLED') {
            onToast?.('info', 'Booking Cancelled', 'This booking has been cancelled.');
          } else if (updatedBooking.booking_status === 'EXPIRED') {
            onToast?.('error', 'Booking Expired', 'Payment window expired. Held slot was released.');
          }
        }

        return { ...prevBooking, ...updatedBooking };
      });
    });

    // Fallback sync on window focus and every 20s
    const handleFocus = () => {
      getBookingById(currentBookingId).then((latest) => {
        if (latest) setBooking((prev) => (prev ? { ...prev, ...latest } : latest));
      });
    };
    window.addEventListener('focus', handleFocus);

    const fallbackInterval = setInterval(() => {
      getBookingById(currentBookingId).then((latest) => {
        if (latest) setBooking((prev) => (prev ? { ...prev, ...latest } : latest));
      });
    }, 20000);

    return () => {
      unsubscribe();
      window.removeEventListener('focus', handleFocus);
      clearInterval(fallbackInterval);
    };
  }, [booking?.booking_id, onToast]);

  // Payment deadline timer update
  useEffect(() => {
    if (!booking || booking.booking_status !== 'PAYMENT_REQUIRED' || !booking.payment_deadline) {
      setTimeLeft('');
      return;
    }

    const interval = setInterval(() => {
      const deadline = new Date(booking.payment_deadline!).getTime();
      const diff = deadline - Date.now();

      if (diff <= 0) {
        setTimeLeft('EXPIRED');
        setBooking((prev) => (prev ? { ...prev, booking_status: 'EXPIRED' } : null));
        clearInterval(interval);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs < 10 ? '0' : ''}${secs}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking?.booking_status, booking?.payment_deadline]);

  const handleCopy = (text: string, label: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (onToast) onToast('info', 'Copied!', `${label} copied to clipboard.`);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    if (!paymentReference.trim()) {
      if (onToast) onToast('error', 'Required Field', 'Please enter your UPI transaction / reference ID.');
      return;
    }

    setIsSubmittingPayment(true);
    try {
      const res = await submitCustomerPayment({
        bookingId: booking.booking_id,
        paymentReference,
        paymentMethod,
        paymentNotes,
      });

      if (res.success && res.booking) {
        setBooking(res.booking);
        if (onToast) {
          onToast(
            'success',
            'Payment Submitted!',
            'Waiting for RBX management to verify your transaction.'
          );
        }
      } else {
        if (onToast) onToast('error', 'Submission Failed', res.error || 'Please try again.');
      }
    } catch (e: any) {
      if (onToast) onToast('error', 'Error', e?.message || 'Payment submission failed.');
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-rbx-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rbx-red/15 text-rbx-red border border-rbx-red/30 mb-3">
            Real-Time Slot Verification
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight">
            TRACK YOUR <span className="text-rbx-red">BOOKING STATUS</span>
          </h1>
          <p className="mt-3 text-sm text-rbx-dark-200">
            Enter your Booking ID (e.g. <strong>RBX-8291</strong>) to check approval status, complete advance payment, or view assigned rigs.
          </p>
        </div>

        {/* Search Box */}
        <div className="p-4 sm:p-5 rounded-3xl glass-panel border-rbx-border mb-10 shadow-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-rbx-dark-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Enter Booking ID (e.g. RBX-8291)"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-rbx-dark-800 border border-white/10 rounded-2xl text-sm font-mono font-bold text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60 uppercase"
              />
            </div>
            <Button
              size="lg"
              variant="primary"
              type="submit"
              disabled={loading}
              className="px-8 py-3.5 text-sm font-bold"
            >
              {loading ? 'CHECKING...' : 'CHECK STATUS'}
            </Button>
          </form>

          {errorMsg && (
            <div className="mt-3 text-xs text-rbx-red font-semibold flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* MOBILE VERIFICATION GATE — booking details are only shown after the
            customer's mobile number matches the one on the booking. */}
        {pendingBooking && !booking && (
          <div className="p-5 sm:p-6 rounded-3xl glass-panel border border-rbx-red/30 mb-10 shadow-2xl animate-fade-in">
            <div className="flex items-start gap-3.5 mb-4">
              <div className="w-11 h-11 rounded-2xl bg-rbx-red/15 text-rbx-red border border-rbx-red/40 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white font-display uppercase tracking-tight">
                  VERIFY YOUR MOBILE NUMBER
                </h3>
                <p className="text-xs text-rbx-dark-300 mt-0.5">
                  Booking <span className="text-white font-bold font-mono">{pendingBooking.booking_id}</span>{' '}
                  was found. Enter the mobile number used at booking time to view details and pay.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerifyMobile} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-3 text-xs font-bold text-rbx-dark-300">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  required
                  autoFocus
                  placeholder="10-digit mobile number"
                  value={verifiedMobile}
                  maxLength={10}
                  onChange={(e) => setVerifiedMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-12 pr-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-2xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                />
              </div>
              <Button
                size="lg"
                variant="primary"
                type="submit"
                disabled={loading}
                className="px-8 py-3 text-sm font-bold"
              >
                {loading ? 'VERIFYING...' : 'VERIFY & VIEW'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setPendingBooking(null);
                  setErrorMsg('');
                }}
                className="px-4 py-3 rounded-2xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-xs font-bold text-rbx-dark-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                Change ID
              </button>
            </form>
          </div>
        )}

        {/* BOOKING DETAILS CARD */}
        {booking && (
          <div className="space-y-6 animate-fade-in">
            {/* Status Hero Banner */}
            <div
              className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden ${
                booking.booking_status === 'CONFIRMED'
                  ? 'bg-emerald-950/40 border-emerald-500/50 shadow-glow-subtle'
                  : booking.booking_status === 'PAYMENT_REQUIRED'
                  ? 'bg-blue-950/40 border-blue-500/50 shadow-glow-subtle'
                  : booking.booking_status === 'PAYMENT_SUBMITTED'
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : booking.booking_status === 'PENDING_APPROVAL'
                  ? 'bg-rbx-dark-800 border-amber-500/30'
                  : 'bg-red-950/30 border-red-500/40'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                      booking.booking_status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : booking.booking_status === 'PAYMENT_REQUIRED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40 animate-pulse'
                        : booking.booking_status === 'PAYMENT_SUBMITTED'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : booking.booking_status === 'PENDING_APPROVAL'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {booking.booking_status === 'CONFIRMED' && <CheckCircle2 className="w-7 h-7" />}
                    {booking.booking_status === 'PAYMENT_REQUIRED' && <CreditCard className="w-7 h-7" />}
                    {booking.booking_status === 'PAYMENT_SUBMITTED' && <Clock className="w-7 h-7" />}
                    {booking.booking_status === 'PENDING_APPROVAL' && <Clock className="w-7 h-7" />}
                    {['REJECTED', 'EXPIRED', 'CANCELLED'].includes(booking.booking_status) && (
                      <XCircle className="w-7 h-7" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-rbx-red uppercase">
                        {booking.booking_id}
                      </span>
                      {isLiveConnected && (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          <span>LIVE SYNC</span>
                        </span>
                      )}
                      <span className="text-rbx-dark-400">•</span>
                      <span className="text-xs text-rbx-dark-300">
                        {booking.booking_date} • {booking.start_time} - {booking.end_time}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-1">
                      {booking.booking_status === 'CONFIRMED' && 'BOOKING CONFIRMED — RIG RESERVED'}
                      {booking.booking_status === 'PAYMENT_REQUIRED' && 'BOOKING APPROVED — PAYMENT REQUIRED'}
                      {booking.booking_status === 'PAYMENT_SUBMITTED' &&
                        'PAYMENT SUBMITTED — WAITING FOR ADMIN VERIFICATION'}
                      {booking.booking_status === 'PENDING_APPROVAL' &&
                        'BOOKING REQUEST RECEIVED (PENDING APPROVAL)'}
                      {booking.booking_status === 'REJECTED' && 'BOOKING REQUEST DECLINED'}
                      {booking.booking_status === 'EXPIRED' && 'PAYMENT WINDOW EXPIRED'}
                      {booking.booking_status === 'CANCELLED' && 'BOOKING CANCELLED'}
                    </h3>

                    <p className="text-xs text-rbx-dark-200 mt-1 leading-relaxed">
                      {booking.booking_status === 'CONFIRMED' &&
                        'Your slot is 100% locked in! Please arrive 5 minutes before your time slot.'}
                      {booking.booking_status === 'PAYMENT_REQUIRED' &&
                        'Your booking has been approved. Please complete the booking payment to confirm your slot.'}
                      {booking.booking_status === 'PAYMENT_SUBMITTED' &&
                        'We received your payment reference. The RBX admin is verifying it.'}
                      {booking.booking_status === 'PENDING_APPROVAL' &&
                        'Your slot is temporarily held while the RBX team reviews your request.'}
                      {booking.booking_status === 'REJECTED' &&
                        (booking.admin_notes || 'This request could not be accepted. Please try another slot.')}
                      {booking.booking_status === 'EXPIRED' &&
                        'The payment deadline expired. Held resources have been released.'}
                    </p>
                  </div>
                </div>

                {/* Status Pill */}
                <div className="text-right shrink-0">
                  <span
                    className={`inline-block px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                      booking.booking_status === 'CONFIRMED'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : booking.booking_status === 'PAYMENT_REQUIRED'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                        : booking.booking_status === 'PAYMENT_SUBMITTED'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : booking.booking_status === 'PENDING_APPROVAL'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {booking.booking_status.replace('_', ' ')}
                  </span>

                  {timeLeft && booking.booking_status === 'PAYMENT_REQUIRED' && (
                    <div className="mt-2 text-[11px] font-mono text-amber-400 font-bold">
                      Pay within: <span className="text-white">{timeLeft}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PAYMENT WORKFLOW PANEL (When Status = PAYMENT_REQUIRED) */}
            {booking.booking_status === 'PAYMENT_REQUIRED' && (
              <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-blue-500/40 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <h4 className="text-lg font-black text-white font-display uppercase tracking-wide">
                      COMPLETE ADVANCE PAYMENT
                    </h4>
                    <p className="text-xs text-rbx-dark-300">
                      Pay the token advance to lock in your gaming rig. Remaining balance is payable at the cafe.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-rbx-dark-400 block uppercase font-bold">Advance Token</span>
                    <span className="text-2xl font-black text-emerald-400 font-display">
                      ₹{booking.booking_amount || appConfig.BOOKING_AMOUNT}
                    </span>
                  </div>
                </div>

                {/* Payment Instructions & UPI Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <div className="space-y-3 bg-rbx-dark-800 p-5 rounded-2xl border border-white/5">
                    <span className="text-xs font-bold text-white uppercase block">
                      Pay via Official UPI / QR Code
                    </span>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-rbx-dark-900 border border-white/10 font-mono text-sm">
                      <span className="text-emerald-400 font-bold">{appConfig.UPI_ID}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(appConfig.UPI_ID, 'UPI ID')}
                        className="text-xs text-rbx-red hover:text-white font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </button>
                    </div>

                    <div className="text-[11px] text-rbx-dark-300 space-y-1 pt-1">
                      <div>
                        • Pay to: <strong>{appConfig.UPI_NAME}</strong>
                      </div>
                      <div>
                        • Advance Amount: <strong>₹{booking.booking_amount || appConfig.BOOKING_AMOUNT}</strong>
                      </div>
                      <div>
                        • Remaining due at cafe:{' '}
                        <strong>
                          ₹{booking.calculated_price - (booking.booking_amount || appConfig.BOOKING_AMOUNT)}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Payment Submission Form */}
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                        Payment Method Used <span className="text-rbx-red">*</span>
                      </label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red/60"
                      >
                        <option value="UPI">UPI App (Google Pay / PhonePe / Paytm / BHIM)</option>
                        <option value="QR Scan">QR Code Scan</option>
                        <option value="Bank Transfer">Direct Bank Transfer / IMPS</option>
                        <option value="Cash at Counter">Cash Deposit at Cafe Counter</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                        UPI Reference / Transaction ID <span className="text-rbx-red">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 423987123456 / UTR ID"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs font-mono text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                        Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Paid via PhonePe by Yash Patel"
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        className="w-full px-4 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                      />
                    </div>

                    <Button
                      fullWidth
                      size="md"
                      variant="primary"
                      type="submit"
                      disabled={isSubmittingPayment}
                      className="py-3 font-bold"
                    >
                      {isSubmittingPayment ? 'SUBMITTING PAYMENT...' : 'SUBMIT PAYMENT VERIFICATION'}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Session Specs & Details Grid */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border-rbx-border">
              <h4 className="text-xs font-bold text-rbx-red uppercase tracking-widest font-display mb-4">
                RESERVATION SPECIFICATIONS
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5">
                  <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">Gamer</span>
                  <span className="font-bold text-white text-sm">{booking.customer_name}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5">
                  <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">Platform</span>
                  <span className="font-bold text-white text-sm">
                    {booking.gaming_type === 'pc'
                      ? 'RTX 5060 PC'
                      : booking.gaming_type === 'ps5_single'
                      ? 'PS5 Single'
                      : 'PS5 Multi'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5">
                  <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">Station</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {booking.assigned_resources?.join(', ') || booking.assigned_resource || 'Reserved'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5">
                  <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">Players</span>
                  <span className="font-bold text-white text-sm">{booking.number_of_players} Person(s)</span>
                </div>
              </div>

              {/* Price & Payment Summary */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-rbx-dark-300 block">Total Session Fee:</span>
                  <span className="text-2xl font-black text-white font-display">
                    ₹{booking.calculated_price}
                  </span>
                </div>

                {booking.payment_reference && (
                  <div className="text-right">
                    <span className="text-[10px] text-rbx-dark-400 block uppercase font-bold">
                      Payment Ref
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      {booking.payment_reference} ({booking.payment_method})
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <a
                href={
                  booking.booking_status === 'CONFIRMED'
                    ? getBookingConfirmedWhatsAppUrl(booking)
                    : booking.booking_status === 'PAYMENT_REQUIRED'
                    ? getBookingApprovedWhatsAppUrl(booking)
                    : getNewBookingWhatsAppUrl(booking)
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Contact Cafe on WhatsApp</span>
              </a>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('booking')}
                  className="text-xs text-rbx-red font-bold hover:underline"
                >
                  Create Another Booking Request ➔
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
