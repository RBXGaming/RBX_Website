import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Monitor,
  Gamepad2,
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Users,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { GamingType, AvailabilityCheckResult, Booking, CustomerProfile } from '../../types';
import { siteConfig } from '../../config/siteConfig';
import { Button } from '../common/Button';
import {
  checkAvailability,
  createBooking,
  calculateBookingPrice,
  calculateEndTime,
  getNewBookingWhatsAppUrl,
  getAppConfig,
} from '../../lib/bookingService';
import { BookingConfirmationModal } from './BookingConfirmationModal';

interface BookingWizardProps {
  initialType?: GamingType;
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  onTrackBooking?: (bookingId: string) => void;
  customer?: CustomerProfile | null;
}

// Time selection is grouped into 4 simple categories for a customer-friendly flow.
// NOTE: These are VISUAL categories only. They do NOT affect pricing — pricing uses
// the exact start time value via calculateBookingPrice() (daytime 8:30 AM – 9:59 PM,
// overnight 10:00 PM – 8:29 AM). 9:00 PM / 9:30 PM are in the Evening tab but are still
// billed as daytime, and 10:00 PM starts overnight, exactly as before.
type TimeCategory = 'morning' | 'afternoon' | 'evening' | 'lateNight';

const TIME_CATEGORIES: { id: TimeCategory; label: string; range: string; times: string[] }[] = [
  {
    id: 'morning',
    label: 'Morning',
    range: '9:30 AM – 12:00 PM',
    times: [
      '09:30 AM',
      '10:00 AM',
      '10:30 AM',
      '11:00 AM',
      '11:30 AM',
    ],
  },
  {
    id: 'afternoon',
    label: 'Afternoon',
    range: '12:00 PM – 5:00 PM',
    times: [
      '12:00 PM', '12:30 PM',
      '01:00 PM', '01:30 PM',
      '02:00 PM', '02:30 PM',
      '03:00 PM', '03:30 PM',
      '04:00 PM', '04:30 PM',
    ],
  },
  {
    id: 'evening',
    label: 'Evening',
    range: '5:00 PM – 10:00 PM',
    times: [
      '05:00 PM', '05:30 PM',
      '06:00 PM', '06:30 PM',
      '07:00 PM', '07:30 PM',
      '08:00 PM', '08:30 PM',
      '09:00 PM', '09:30 PM',
    ],
  },
  {
    id: 'lateNight',
    label: 'Late Night',
    range: '10:00 PM – 9:30 AM',
    times: [
      '10:00 PM', '10:30 PM',
      '11:00 PM', '11:30 PM',
      '12:00 AM', '12:30 AM',
      '01:00 AM', '01:30 AM',
      '02:00 AM', '02:30 AM',
      '03:00 AM', '03:30 AM',
      '04:00 AM', '04:30 AM',
      '05:00 AM', '05:30 AM',
      '06:00 AM', '06:30 AM',
      '07:00 AM', '07:30 AM',
      '08:00 AM', '08:30 AM',
      '09:00 AM',
    ],
  },
];

function getCategoryForTime(timeStr: string): TimeCategory {
  const cat = TIME_CATEGORIES.find((c) => c.times.includes(timeStr));
  return cat ? cat.id : 'evening';
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialType = 'pc',
  onToast,
  onTrackBooking,
  customer,
}) => {
  const [gamingType, setGamingType] = useState<GamingType>(initialType);
  const [playersCount, setPlayersCount] = useState<number>(gamingType === 'ps5_multi' ? 2 : 1);

  // Default to today
  const todayStr = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState<string>(todayStr);
  const [timeSlot, setTimeSlot] = useState<string>('06:00 PM');
  const [timeCategory, setTimeCategory] = useState<TimeCategory>(() => getCategoryForTime('06:00 PM'));
  const [durationHours, setDurationHours] = useState<number>(2);

  // Customer details (prefilled from the authenticated customer account)
  const [customerName, setCustomerName] = useState<string>(customer?.name || '');
  const [phoneNumber, setPhoneNumber] = useState<string>(customer?.mobile_number || '');
  const [whatsappNumber, setWhatsappNumber] = useState<string>('');
  const [sameAsPhone, setSameAsPhone] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [gameRequested, setGameRequested] = useState<string>('');

  // Live Availability & Config state
  const [availability, setAvailability] = useState<AvailabilityCheckResult | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState<boolean>(false);
  const [bookingAmountConfig, setBookingAmountConfig] = useState<number>(100);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Fetch App Config
  useEffect(() => {
    getAppConfig().then((cfg) => {
      if (cfg.BOOKING_AMOUNT) {
        setBookingAmountConfig(cfg.BOOKING_AMOUNT);
      }
    });
  }, []);

  // Real-time Availability checking with debounce
  const runAvailabilityCheck = useCallback(async () => {
    setCheckingAvailability(true);
    try {
      const res = await checkAvailability({
        date,
        startTime: timeSlot,
        duration: durationHours,
        gamingType,
        playersCount,
      });
      setAvailability(res);
    } catch (err) {
      console.error('Availability check error:', err);
    } finally {
      setCheckingAvailability(false);
    }
  }, [date, timeSlot, durationHours, gamingType, playersCount]);

  useEffect(() => {
    runAvailabilityCheck();
  }, [runAvailabilityCheck]);

  // Dynamic Price Breakdown (uses start time so overnight / split rates are correct)
  const priceBreakdown = calculateBookingPrice(gamingType, playersCount, durationHours, timeSlot);

  // Duration Options
  const durationOptions = [
    { hours: 1, label: '1 Hour' },
    { hours: 2, label: '2 Hours' },
    { hours: 3, label: '3 Hours' },
    {
      hours: 4,
      label: '4 Hours',
      badge: gamingType === 'pc' ? '🔥 3+1 FREE' : undefined,
    },
    { hours: 5, label: '5 Hours' },
    { hours: 6, label: '6 Hours' },
    {
      hours: 8,
      label: '8 Hours',
      badge: gamingType === 'pc' ? '🔥 6+2 FREE' : undefined,
    },
  ];
  const calculatedEndTime = calculateEndTime(timeSlot, durationHours);

  // Keep the active category tab in sync with the selected timeSlot
  useEffect(() => {
    setTimeCategory(getCategoryForTime(timeSlot));
  }, [timeSlot]);

  const handleGamingTypeSelect = (type: GamingType) => {
    setGamingType(type);
    if (type === 'pc') {
      setPlayersCount(1);
    } else if (type === 'ps5_single') {
      setPlayersCount(1);
    } else if (type === 'ps5_multi') {
      setPlayersCount(2); // Default to 2 for multi
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!customerName.trim()) {
      newErrors.customerName = 'Please enter your gamer / full name';
    }

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (availability && !availability.isAvailable) {
      newErrors.slot = `Slot unavailable: ${availability.statusDisplay}`;
      if (onToast) onToast('error', 'Slot Unavailable', availability.statusDisplay);
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const result = await createBooking({
        gamingType,
        playersCount,
        date,
        timeSlot,
        durationHours,
        customerName,
        phone: phoneNumber,
        whatsapp: sameAsPhone ? phoneNumber : (whatsappNumber || phoneNumber),
        email,
        gameRequested,
        userId: customer?.id,
      });

      if (result.success && result.booking) {
        setConfirmedBooking(result.booking);
        setShowModal(true);

        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF2A3A', '#FFFFFF', '#08090C'],
          });
        } catch (e) {}

        if (onToast) {
          onToast(
            'success',
            'Request Submitted!',
            `Slot request ${result.booking.booking_id} is pending admin approval.`
          );
        }

        // Re-run availability check so the newly held slot immediately reflects in UI
        runAvailabilityCheck();
      } else {
        if (onToast) {
          onToast('error', 'Booking Failed', result.error || 'Please try another slot.');
        }
      }
    } catch (err: any) {
      if (onToast) {
        onToast('error', 'Error', err?.message || 'Something went wrong.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Interactive Selection Panels */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. SELECT GAMING PLATFORM */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-rbx-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rbx-red text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Select Gaming Platform</span>
              </h3>
              <span className="text-xs text-emerald-400 font-bold uppercase">Open 24/7</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* PC GAMING */}
              <button
                type="button"
                onClick={() => handleGamingTypeSelect('pc')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  gamingType === 'pc'
                    ? 'bg-rbx-red/15 border-rbx-red shadow-glow-subtle'
                    : 'bg-rbx-dark-800/80 border-white/5 hover:border-white/20'
                }`}
              >
                {gamingType === 'pc' && (
                  <span className="absolute top-3 right-3 text-rbx-red">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
                <Monitor className="w-7 h-7 text-rbx-red mb-2" />
                <h4 className="text-sm font-bold text-white uppercase">RTX 5060 PC</h4>
                <p className="text-[11px] text-rbx-dark-300 mt-0.5">300Hz Esports Rig</p>
                <div className="mt-3 text-xs font-black text-white font-display">
                  ₹100 <span className="text-rbx-dark-400 font-normal">/ person / hr daytime</span>
                </div>
                <div className="text-[10px] text-rbx-dark-300 mt-0.5">Overnight ₹120 / person / hr</div>
                <div className="mt-1 inline-block text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  3+1 & 6+2 FREE
                </div>
              </button>

              {/* PS5 SINGLE PLAYER */}
              <button
                type="button"
                onClick={() => handleGamingTypeSelect('ps5_single')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  gamingType === 'ps5_single'
                    ? 'bg-rbx-red/15 border-rbx-red shadow-glow-subtle'
                    : 'bg-rbx-dark-800/80 border-white/5 hover:border-white/20'
                }`}
              >
                {gamingType === 'ps5_single' && (
                  <span className="absolute top-3 right-3 text-rbx-red">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
                <Gamepad2 className="w-7 h-7 text-blue-400 mb-2" />
                <h4 className="text-sm font-bold text-white uppercase">PS5 Single Player</h4>
                <p className="text-[11px] text-rbx-dark-300 mt-0.5">Solo Gaming Lounge</p>
                <div className="mt-3 text-xs font-black text-white font-display">
                  ₹120 <span className="text-rbx-dark-400 font-normal">/ person / hr</span>
                </div>
                <div className="text-[10px] text-rbx-dark-300 mt-0.5">Same rate overnight</div>
                <div className="mt-1 inline-block text-[10px] text-rbx-dark-400">1 Player Dedicated</div>
              </button>

              {/* PS5 MULTIPLAYER */}
              <button
                type="button"
                onClick={() => handleGamingTypeSelect('ps5_multi')}
                className={`p-4 rounded-2xl border text-left transition-all relative ${
                  gamingType === 'ps5_multi'
                    ? 'bg-rbx-red/15 border-rbx-red shadow-glow-subtle'
                    : 'bg-rbx-dark-800/80 border-white/5 hover:border-white/20'
                }`}
              >
                {gamingType === 'ps5_multi' && (
                  <span className="absolute top-3 right-3 text-rbx-red">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                )}
                <Users className="w-7 h-7 text-emerald-400 mb-2" />
                <h4 className="text-sm font-bold text-white uppercase">PS5 Multiplayer</h4>
                <p className="text-[11px] text-rbx-dark-300 mt-0.5">Co-op Squad Lounge</p>
                <div className="mt-3 text-xs font-black text-white font-display">
                  ₹100 <span className="text-rbx-dark-400 font-normal">/ person / hr daytime</span>
                </div>
                <div className="text-[10px] text-rbx-dark-300 mt-0.5">Overnight ₹120 / person / hr</div>
                <div className="mt-1 inline-block text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Up to 4 Players / Couch
                </div>
              </button>
            </div>

            {/* Players Selector */}
            <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-white uppercase block">Number of Players / Stations</span>
                <span className="text-[11px] text-rbx-dark-300">
                  {gamingType === 'pc'
                    ? 'Each player is assigned an individual RTX 5060 PC rig (Max 3 PCs).'
                    : gamingType === 'ps5_single'
                    ? 'Solo session (1 player).'
                    : 'Multiplayer squad shares 1 PS5 console lounge setup (Max 4 players).'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {gamingType === 'pc' &&
                  [1, 2, 3].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPlayersCount(num)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                        playersCount === num
                          ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle'
                          : 'bg-rbx-dark-700 text-rbx-dark-200 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {num}
                    </button>
                  ))}

                {gamingType === 'ps5_single' && (
                  <span className="px-4 py-2 rounded-xl bg-rbx-dark-700 text-white font-bold text-xs border border-white/10">
                    1 Gamer
                  </span>
                )}

                {gamingType === 'ps5_multi' &&
                  [2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPlayersCount(num)}
                      className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all ${
                        playersCount === num
                          ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle'
                          : 'bg-rbx-dark-700 text-rbx-dark-200 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {num}P
                    </button>
                  ))}
              </div>
            </div>
          </div>

          {/* 2. DATE, TIME & DURATION */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-rbx-border">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-black text-white font-display uppercase tracking-wide flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rbx-red text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Date, Start Time & Duration</span>
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-rbx-dark-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>24/7 Any Hour</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {/* Date Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                  Select Date <span className="text-rbx-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rbx-red/60 cursor-pointer"
                  />
                </div>
              </div>

              {/* Exact Start Time Picker — category tabs + time buttons */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200">
                    Start Time <span className="text-rbx-red">*</span>
                  </label>
                  <span className="text-[11px] text-rbx-dark-300">
                    {timeSlot} ➔ {calculatedEndTime}
                  </span>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {TIME_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setTimeCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide border transition-all cursor-pointer ${
                        timeCategory === cat.id
                          ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle'
                          : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/10 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className={`ml-1.5 text-[10px] font-normal lowercase ${timeCategory === cat.id ? 'text-white/70' : 'text-rbx-dark-400'}`}>
                        {cat.range}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Time Buttons for the active category */}
                {TIME_CATEGORIES.map((cat) => (
                  <div key={cat.id} className={timeCategory === cat.id ? 'block' : 'hidden'}>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {cat.times.map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setTimeSlot(t)}
                          className={`px-2 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            timeSlot === t
                              ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle'
                              : 'bg-rbx-dark-800 text-rbx-dark-200 border-white/5 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration Selector */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-2">
                Select Session Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                {durationOptions.map((opt) => (
                  <button
                    key={opt.hours}
                    type="button"
                    onClick={() => setDurationHours(opt.hours)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      durationHours === opt.hours
                        ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle'
                        : 'bg-rbx-dark-800/90 text-rbx-dark-200 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    {opt.badge && (
                      <div className="text-[9px] font-black uppercase text-amber-300 mt-1">
                        {opt.badge}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* LIVE AVAILABILITY FEEDBACK BANNER */}
            <div className="mt-6 p-4 rounded-2xl bg-rbx-dark-800/90 border border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      checkingAvailability
                        ? 'bg-amber-400 animate-ping'
                        : availability?.isAvailable
                        ? 'bg-emerald-400'
                        : 'bg-rbx-red'
                    }`}
                  />
                  <div>
                    <span className="text-[11px] uppercase font-bold text-rbx-dark-400 block">
                      Live Availability Status
                    </span>
                    <span
                      className={`text-sm font-black font-display uppercase ${
                        availability?.isAvailable ? 'text-emerald-400' : 'text-rbx-red'
                      }`}
                    >
                      {checkingAvailability
                        ? 'Checking live availability...'
                        : availability?.statusDisplay || 'Checking...'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-rbx-dark-400 block">
                    Calculated Time Slot
                  </span>
                  <span className="text-xs font-bold text-white">
                    {timeSlot} ➔ {calculatedEndTime} ({durationHours} hr{durationHours > 1 ? 's' : ''})
                  </span>
                </div>
              </div>

              {availability?.isAvailable && availability.assignedResource && (
                <div className="mt-2.5 pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-rbx-dark-300">
                  <span>
                    Assigned Resource:{' '}
                    <strong className="text-white font-bold">
                      {availability.assignedResources?.join(', ') || availability.assignedResource}
                    </strong>
                  </span>
                  <span className="text-emerald-400 font-semibold">Ready to hold upon submit</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. CUSTOMER CONTACT DETAILS */}
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border-rbx-border">
            <h3 className="text-lg font-black text-white font-display uppercase tracking-wide flex items-center gap-2 mb-5">
              <span className="w-6 h-6 rounded-full bg-rbx-red text-white text-xs flex items-center justify-center font-bold">
                3
              </span>
              <span>Gamer Contact Information</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                  Gamer / Full Name <span className="text-rbx-red">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-rbx-dark-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yash Patel / ShadowNinja"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                  />
                </div>
                {errors.customerName && (
                  <span className="text-xs text-rbx-red mt-1 block">{errors.customerName}</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                    Mobile Number <span className="text-rbx-red">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-rbx-dark-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      disabled={!!customer}
                      readOnly={!!customer}
                      placeholder="10-digit phone number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60 disabled:opacity-70 disabled:cursor-not-allowed"
                    />
                  </div>
                  {customer && (
                    <span className="text-[10px] text-emerald-400 font-semibold mt-0.5 block">
                      ✓ Verified via OTP ({customer.mobile_number})
                    </span>
                  )}
                  {errors.phoneNumber && (
                    <span className="text-xs text-rbx-red mt-1 block">{errors.phoneNumber}</span>
                  )}
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. gamer@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                  Game Requested (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Valorant, GTA V, EA Sports FC 24, Tekken 8..."
                  value={gameRequested}
                  onChange={(e) => setGameRequested(e.target.value)}
                  className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Live Summary & Action Box */}
        <div className="lg:col-span-4 sticky top-28 space-y-5">
          <div className="p-6 sm:p-7 rounded-3xl glass-panel border-rbx-border relative overflow-hidden">
            <h4 className="text-sm font-black text-white font-display uppercase tracking-wider mb-4 pb-3 border-b border-white/10 flex items-center justify-between">
              <span>BOOKING SUMMARY</span>
              <span className="text-[10px] text-emerald-400 font-bold">24/7 VENUE</span>
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-rbx-dark-300">Platform:</span>
                <span className="text-white font-bold">
                  {gamingType === 'pc'
                    ? 'RTX 5060 PC (300Hz)'
                    : gamingType === 'ps5_single'
                    ? 'PS5 Single Player'
                    : 'PS5 Multiplayer'}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-rbx-dark-300">Players / Units:</span>
                <span className="text-white font-bold">{priceBreakdown.effectivePlayers} Gamer(s)</span>
              </div>

              <div className="flex justify-between">
                <span className="text-rbx-dark-300">Date:</span>
                <span className="text-white font-bold">{date}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-rbx-dark-300">Time Slot:</span>
                <span className="text-white font-bold">
                  {timeSlot} ➔ {calculatedEndTime}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-rbx-dark-300">Duration:</span>
                <span className="text-white font-bold">
                  {durationHours} Hour(s) ({priceBreakdown.paidHours} Paid)
                </span>
              </div>

              {priceBreakdown.isSplitRate && (
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-rbx-dark-200 space-y-1">
                  <div className="flex justify-between">
                    <span>Daytime ({priceBreakdown.billableDayHours % 1 === 0 ? priceBreakdown.billableDayHours : priceBreakdown.billableDayHours.toFixed(1)} hr)</span>
                    <span className="text-white font-bold">₹{priceBreakdown.dayAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overnight ({priceBreakdown.billableNightHours % 1 === 0 ? priceBreakdown.billableNightHours : priceBreakdown.billableNightHours.toFixed(1)} hr)</span>
                    <span className="text-white font-bold">₹{priceBreakdown.nightAmount}</span>
                  </div>
                </div>
              )}

              {priceBreakdown.overnightApplied && !priceBreakdown.isSplitRate && (
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-[11px] font-semibold">
                  Overnight rate applied (₹{priceBreakdown.nightRatePerPersonPerHour}/person/hr)
                </div>
              )}

              {priceBreakdown.offerApplied && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-semibold">
                  {priceBreakdown.offerDescription} (-₹{priceBreakdown.discountAmount})
                </div>
              )}

              {priceBreakdown.isSplitRate && !priceBreakdown.offerApplied && (
                <p className="text-[10px] text-rbx-dark-400 leading-relaxed">{priceBreakdown.offerDescription}</p>
              )}

              <div className="pt-3 border-t border-dashed border-white/10 space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Estimated Total:</span>
                  <span className="text-2xl font-black text-white font-display">
                    ₹{priceBreakdown.totalPrice}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-[11px] text-rbx-dark-300">
                  <span>Advance Token (on approval):</span>
                  <span className="text-emerald-400 font-bold">₹{bookingAmountConfig}</span>
                </div>
              </div>
            </div>

            {/* Submit Request Button */}
            <div className="mt-6">
              <Button
                fullWidth
                size="lg"
                variant="primary"
                type="submit"
                disabled={isSubmitting || (availability !== null && !availability.isAvailable)}
                className="py-4 shadow-glow-red"
              >
                {isSubmitting
                  ? 'SUBMITTING REQUEST...'
                  : availability && !availability.isAvailable
                  ? 'SLOT FULLY BOOKED'
                  : 'REQUEST BOOKING (PENDING APPROVAL)'}
              </Button>
            </div>

            <p className="text-[11px] text-center text-rbx-dark-400 mt-3 leading-relaxed">
              Upon submission, your slot is temporarily held while our team approves it. Advance payment of ₹
              {bookingAmountConfig} is required only after approval.
            </p>
          </div>

          {/* Guarantee info */}
          <div className="p-4 rounded-2xl glass-panel border-rbx-border/80 flex items-center gap-3 text-xs text-rbx-dark-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Overlapping protection active. Resources held while pending.</span>
          </div>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showModal && confirmedBooking && (
        <BookingConfirmationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          booking={confirmedBooking}
          onTrack={() => {
            setShowModal(false);
            if (onTrackBooking) {
              onTrackBooking(confirmedBooking.booking_id);
            }
          }}
        />
      )}
    </div>
  );
};
