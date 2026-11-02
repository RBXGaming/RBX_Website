import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  LogOut,
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  CreditCard,
  Search,
  Settings,
  RefreshCw,
  Monitor,
  Gamepad2,
  Users,
  AlertCircle,
  ExternalLink,
  Database,
  Info,
  Volume2,
  VolumeX,
  Bell,
  Sparkles,
  Smartphone,
  CalendarClock,
} from 'lucide-react';
import { Booking, BookingStatus, GamingType, AppConfig } from '../types';
import {
  fetchAdminBookings,
  approveBooking,
  rejectBooking,
  cancelBooking,
  verifyPayment,
  rejectPayment,
  updateAppConfig,
  fetchResourceScheduleForDate,
  ResourceScheduleItem,
  fetchCustomersWithStats,
  CustomerWithStats,
  subscribeToAdminBookingsRealtime,
} from '../lib/adminService';
import { getAppConfig } from '../lib/bookingService';
import { loginAdmin, logoutAdmin, getAdminSession, AdminUser } from '../lib/authService';
import { isSupabaseConfigured } from '../lib/supabase';
import {
  playNewBookingSound,
  testAlertSound,
  initAudioUnlock,
} from '../lib/soundAlert';
import { Button } from '../components/common/Button';

interface AdminPageProps {
  onNavigate?: (page: string) => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigate, onToast }) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Login form
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string>('');
  const [loggingIn, setLoggingIn] = useState<boolean>(false);

  // Active View Tab: 'bookings' | 'calendar' | 'config' | 'customers'
  const [activeTab, setActiveTab] = useState<'bookings' | 'calendar' | 'config' | 'customers'>('bookings');

  // Bookings state & filters
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState<boolean>(false);
  const [filterDate, setFilterDate] = useState<string>('');
  const [filterType, setFilterType] = useState<GamingType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<BookingStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time audio & popup alert state
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [newBookingAlert, setNewBookingAlert] = useState<Booking | null>(null);
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(true);

  // Calendar timeline state
  const todayStr = new Date().toISOString().split('T')[0];
  const [calendarDate, setCalendarDate] = useState<string>(todayStr);
  const [scheduleItems, setScheduleItems] = useState<ResourceScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState<boolean>(false);

  // Configuration settings
  const [config, setConfig] = useState<AppConfig>({
    BOOKING_AMOUNT: 100,
    PAYMENT_DEADLINE_MINUTES: 30,
    UPI_ID: '8320165115@upi',
    UPI_NAME: 'RBX Gaming Cafe',
    CAFE_PHONE: '+91 83201 65115',
  });
  const [savingConfig, setSavingConfig] = useState<boolean>(false);

  // Customer accounts (OTP registrations)
  const [customers, setCustomers] = useState<CustomerWithStats[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState<boolean>(false);
  const [customerSource, setCustomerSource] = useState<'profiles' | 'bookings' | 'none'>('none');
  const [customerSearch, setCustomerSearch] = useState<string>('');

  // Check initial session
  useEffect(() => {
    const session = getAdminSession();
    if (session) {
      setCurrentUser(session);
    }
  }, []);

  // Load bookings and config once authenticated
  const loadData = async () => {
    if (!currentUser) return;
    setLoadingBookings(true);
    try {
      const data = await fetchAdminBookings({
        date: filterDate || undefined,
        gamingType: filterType,
        status: filterStatus,
        searchQuery,
      });
      setBookings(data);

      const cfg = await getAppConfig();
      setConfig(cfg);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadCalendar = async () => {
    if (!currentUser) return;
    setLoadingSchedule(true);
    try {
      const matrix = await fetchResourceScheduleForDate(calendarDate);
      setScheduleItems(matrix);
    } catch (e) {
      console.error('Failed to load calendar:', e);
    } finally {
      setLoadingSchedule(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser, filterDate, filterType, filterStatus, searchQuery]);

  useEffect(() => {
    if (currentUser && activeTab === 'calendar') {
      loadCalendar();
    }
  }, [currentUser, calendarDate, activeTab]);

  const loadCustomers = async () => {
    if (!currentUser) return;
    setLoadingCustomers(true);
    try {
      const result = await fetchCustomersWithStats();
      setCustomers(result.customers);
      setCustomerSource(result.source);
    } catch (e) {
      console.error('Failed to load customers:', e);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (currentUser && activeTab === 'customers') {
      loadCustomers();
    }
  }, [currentUser, activeTab]);

  const filteredCustomers = customers.filter((c) => {
    const q = customerSearch.trim().toLowerCase();
    if (!q) return true;
    const digits = q.replace(/\D/g, '');
    if (digits && c.mobile_number.includes(digits)) return true;
    return (c.name || '').toLowerCase().includes(q);
  });

  // SUPABASE REALTIME SUBSCRIPTION FOR ADMIN (INSERT & UPDATE EVENTS)
  useEffect(() => {
    if (!currentUser) return;

    // Enable audio context unlock on user gestures
    const cleanupAudio = initAudioUnlock();
    setIsLiveConnected(true);

    const unsubscribe = subscribeToAdminBookingsRealtime({
      onInsert: (newBooking) => {
        // 1. Play browser-safe notification sound
        if (soundEnabled) {
          playNewBookingSound().catch(() => {});
        }

        // 2. Set in-app alert banner
        setNewBookingAlert(newBooking);

        // 3. Show global toast
        onToast?.(
          'info',
          '🚨 New Booking Request!',
          `Booking ${newBooking.booking_id} received from ${newBooking.customer_name} (${newBooking.gaming_type.toUpperCase()}).`
        );

        // 4. Update bookings list immediately without full page reload
        setBookings((prev) => {
          const exists = prev.some(
            (b) => b.booking_id === newBooking.booking_id || (b.id && b.id === newBooking.id)
          );
          if (exists) {
            return prev.map((b) =>
              b.booking_id === newBooking.booking_id || (b.id && b.id === newBooking.id)
                ? newBooking
                : b
            );
          }
          return [newBooking, ...prev];
        });

        // 5. Update calendar matrix
        fetchResourceScheduleForDate(calendarDate).then((matrix) => {
          setScheduleItems(matrix);
        });
      },
      onUpdate: (updatedBooking) => {
        // 1. Update matching booking in state immediately
        setBookings((prev) =>
          prev.map((b) =>
            b.booking_id === updatedBooking.booking_id || (b.id && b.id === updatedBooking.id)
              ? updatedBooking
              : b
          )
        );

        // 2. If status was updated to PAYMENT_SUBMITTED, notify admin
        if (updatedBooking.booking_status === 'PAYMENT_SUBMITTED') {
          if (soundEnabled) {
            playNewBookingSound().catch(() => {});
          }
          onToast?.(
            'info',
            '💳 Advance Payment Submitted',
            `${updatedBooking.customer_name} submitted transaction ref: ${updatedBooking.payment_reference || 'N/A'}`
          );
        }

        // 3. Refresh calendar matrix
        fetchResourceScheduleForDate(calendarDate).then((matrix) => {
          setScheduleItems(matrix);
        });
      },
      onDelete: (deletedId) => {
        setBookings((prev) =>
          prev.filter((b) => b.booking_id !== deletedId && b.id !== deletedId)
        );
        fetchResourceScheduleForDate(calendarDate).then((matrix) => {
          setScheduleItems(matrix);
        });
      },
    });

    // Fallback sync when returning to tab and periodic background poll
    const handleFocus = () => {
      loadData();
      if (activeTab === 'calendar') {
        loadCalendar();
      }
    };
    window.addEventListener('focus', handleFocus);

    const fallbackTimer = setInterval(() => {
      loadData();
    }, 25000);

    return () => {
      unsubscribe();
      cleanupAudio();
      window.removeEventListener('focus', handleFocus);
      clearInterval(fallbackTimer);
    };
  }, [currentUser, soundEnabled, calendarDate, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    // Pre-unlock audio on click gesture
    testAlertSound().catch(() => {});

    try {
      const res = await loginAdmin(email, password);
      if (res.success && res.user) {
        setCurrentUser(res.user);
        if (onToast) onToast('success', 'Admin Authenticated', `Welcome back, ${res.user.email}`);
      } else {
        setLoginError(res.error || 'Authentication failed.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Login error.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    setCurrentUser(null);
  };

  // Action handlers
  const handleApprove = async (bookingId: string) => {
    const res = await approveBooking(bookingId);
    if (res.success) {
      if (onToast) onToast('success', 'Booking Approved', `Slot for ${bookingId} approved (PAYMENT REQUIRED).`);
      loadData();
    } else {
      if (onToast) onToast('error', 'Error', res.error || 'Failed to approve.');
    }
  };

  const handleReject = async (bookingId: string) => {
    const reason = prompt('Reason for rejecting booking request (optional):') || undefined;
    const res = await rejectBooking(bookingId, reason);
    if (res.success) {
      if (onToast) onToast('info', 'Booking Rejected', `Booking ${bookingId} was declined.`);
      loadData();
    } else {
      if (onToast) onToast('error', 'Error', res.error || 'Failed to reject.');
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm(`Are you sure you want to cancel booking ${bookingId}?`)) return;
    const res = await cancelBooking(bookingId);
    if (res.success) {
      if (onToast) onToast('info', 'Booking Cancelled', `Booking ${bookingId} was cancelled.`);
      loadData();
    }
  };

  const handleVerifyPayment = async (bookingId: string) => {
    const res = await verifyPayment(bookingId);
    if (res.success) {
      if (onToast) onToast('success', 'Payment Verified!', `Booking ${bookingId} is now CONFIRMED!`);
      loadData();
    } else {
      if (onToast) onToast('error', 'Error', res.error || 'Failed to verify.');
    }
  };

  const handleRejectPayment = async (bookingId: string) => {
    const reason = prompt('Please enter the reason for rejecting payment (e.g. Invalid UTR ID):');
    if (!reason) return;
    const res = await rejectPayment(bookingId, reason);
    if (res.success) {
      if (onToast) onToast('error', 'Payment Rejected', `Payment for ${bookingId} rejected.`);
      loadData();
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await updateAppConfig(config);
      if (res.success) {
        if (onToast) onToast('success', 'Settings Saved', 'RBX booking settings updated successfully.');
      } else {
        if (onToast) onToast('error', 'Save Failed', res.error || 'Could not save.');
      }
    } finally {
      setSavingConfig(false);
    }
  };

  // ---------------------------------------------------------------------------
  // LOGIN SCREEN (PROTECTED)
  // ---------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div className="pt-28 pb-20 bg-rbx-bg min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full p-8 sm:p-10 rounded-3xl glass-panel border border-rbx-border shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-rbx-red/20 text-rbx-red border border-rbx-red/40 flex items-center justify-center mx-auto shadow-glow-subtle">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rbx-red">
              Protected Area
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight mt-1">
              RBX ADMIN PORTAL
            </h2>
            <p className="text-xs text-rbx-dark-300 mt-1">
              Sign in with your management credentials to review bookings, verify payments, and manage rigs.
            </p>
          </div>

          {/* Supabase Status Notice */}
          <div
            className={`p-3.5 rounded-2xl text-left text-xs border ${
              isSupabaseConfigured
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/30 border-amber-500/40 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold uppercase text-[11px] mb-1">
              <Database className="w-3.5 h-3.5" />
              <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Setup Required'}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {isSupabaseConfigured
                ? 'Connected to live Supabase backend. Log in using your Supabase admin user credentials.'
                : 'Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect your database and enable authentication.'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rbxgamingcafe.com"
                className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
              />
            </div>

            {loginError && (
              <div className="text-xs text-rbx-red font-semibold flex items-start gap-1.5 p-3 rounded-xl bg-red-950/30 border border-red-500/30">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <Button
              fullWidth
              size="lg"
              variant="primary"
              type="submit"
              disabled={loggingIn}
              className="py-3.5 mt-2 font-bold shadow-glow-red"
            >
              {loggingIn ? 'AUTHENTICATING...' : 'SIGN IN TO ADMIN DASHBOARD'}
            </Button>
          </form>

          {/* Admin Setup Instructions */}
          <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 text-left text-[11px] text-rbx-dark-300 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-white uppercase text-[10px]">
              <Info className="w-3.5 h-3.5 text-rbx-red" />
              <span>How to configure Supabase Admin Account:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-rbx-dark-300">
              <li>Open your project at <strong>supabase.com</strong></li>
              <li>Go to <strong>Authentication</strong> ➔ <strong>Users</strong> ➔ <strong>Add User</strong></li>
              <li>Enter your admin email and password</li>
              <li>Sign in here using those exact credentials</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // AUTHENTICATED ADMIN DASHBOARD
  // ---------------------------------------------------------------------------
  const pendingCount = bookings.filter((b) => b.booking_status === 'PENDING_APPROVAL').length;
  const paymentRequiredCount = bookings.filter((b) => b.booking_status === 'PAYMENT_REQUIRED').length;
  const paymentSubmittedCount = bookings.filter((b) => b.booking_status === 'PAYMENT_SUBMITTED').length;
  const confirmedCount = bookings.filter((b) => b.booking_status === 'CONFIRMED').length;

  return (
    <div className="pt-24 pb-20 bg-rbx-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-rbx-border/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AUTHENTICATED AS {currentUser.email}</span>
              </div>
              {isLiveConnected && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>SUPABASE REALTIME ACTIVE</span>
                </div>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight">
              RBX MANAGEMENT <span className="text-rbx-red">DASHBOARD</span>
            </h1>
          </div>

          {/* Navigation Tabs, Audio Controls & Logout */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Audio Alert Toggle & Test */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (onToast) {
                  onToast('info', 'Audio Alerts', next ? 'Sound alerts enabled' : 'Sound alerts muted');
                }
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border ${
                soundEnabled
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-rbx-dark-800 border-white/10 text-rbx-dark-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Mute booking sounds' : 'Enable booking sounds'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-rbx-dark-400" />}
              <span>{soundEnabled ? 'Audio Alert: ON' : 'Audio Alert: MUTED'}</span>
            </button>

            <button
              onClick={() => {
                testAlertSound();
                if (onToast) onToast('info', 'Audio Test', 'Playing chime sound preview.');
              }}
              className="px-2.5 py-2 rounded-xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-xs font-bold text-rbx-dark-300 hover:text-white border border-white/5 transition-colors cursor-pointer"
              title="Test Alert Chime"
            >
              Test Chime
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'bg-rbx-dark-800 text-rbx-dark-300 hover:text-white border border-white/5'
              }`}
            >
              Bookings & Approval ({bookings.length})
            </button>

            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'bg-rbx-dark-800 text-rbx-dark-300 hover:text-white border border-white/5'
              }`}
            >
              24-Hour Rig Timeline
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'customers'
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'bg-rbx-dark-800 text-rbx-dark-300 hover:text-white border border-white/5'
              }`}
            >
              <Users className="w-3.5 h-3.5 inline mr-1" />
              <span>Customers ({customers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('config')}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'config'
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'bg-rbx-dark-800 text-rbx-dark-300 hover:text-white border border-white/5'
              }`}
            >
              <Settings className="w-3.5 h-3.5 inline mr-1" />
              <span>Settings</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-rbx-dark-800 hover:bg-red-500/20 text-rbx-dark-300 hover:text-red-400 border border-white/5 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* REAL-TIME NEW BOOKING IN-APP POPUP / TOAST BANNER */}
        {newBookingAlert && (
          <div className="mt-6 p-5 rounded-3xl bg-gradient-to-r from-red-950/90 via-rbx-dark-900 to-red-950/90 border-2 border-rbx-red shadow-2xl shadow-red-900/40 animate-fade-in flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-rbx-red/20 text-rbx-red border border-rbx-red/50 flex items-center justify-center shrink-0 animate-bounce">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rbx-red text-white">
                    NEW BOOKING JUST ARRIVED
                  </span>
                  <span className="text-xs font-mono font-bold text-white">
                    {newBookingAlert.booking_id}
                  </span>
                </div>
                <h4 className="text-base font-black text-white font-display uppercase tracking-tight mt-0.5">
                  {newBookingAlert.customer_name} •{' '}
                  <span className="text-emerald-400">
                    {newBookingAlert.gaming_type === 'pc'
                      ? `PC Station (${newBookingAlert.number_of_players} Rigs)`
                      : newBookingAlert.gaming_type === 'ps5_single'
                      ? 'PS5 Single'
                      : `PS5 Multi (${newBookingAlert.number_of_players} Players)`}
                  </span>
                </h4>
                <p className="text-xs text-rbx-dark-200 mt-0.5">
                  📅 {newBookingAlert.booking_date} • ⏰ {newBookingAlert.start_time} - {newBookingAlert.end_time} • 📞 {newBookingAlert.mobile_number}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={() => {
                  setActiveTab('bookings');
                  setFilterStatus('all');
                  setSearchQuery(newBookingAlert.booking_id);
                  setNewBookingAlert(null);
                }}
                className="px-5 py-2.5 rounded-xl bg-rbx-red hover:bg-rbx-red-hover text-white text-xs font-bold transition-all shadow-glow-subtle cursor-pointer"
              >
                Review & Approve
              </button>
              <button
                onClick={() => setNewBookingAlert(null)}
                className="px-4 py-2.5 rounded-xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-rbx-dark-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-white/10"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Quick KPI Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8">
          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-amber-500/30">
            <span className="text-[11px] font-bold uppercase text-amber-400 block">Pending Approval</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
              {pendingCount}
            </span>
            <span className="text-[10px] text-rbx-dark-400">Holds resource temporarily</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-blue-500/30">
            <span className="text-[11px] font-bold uppercase text-blue-400 block">Payment Required</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
              {paymentRequiredCount}
            </span>
            <span className="text-[10px] text-rbx-dark-400">Approved, awaiting customer advance</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-amber-400/40">
            <span className="text-[11px] font-bold uppercase text-amber-300 block">Payment Submitted</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
              {paymentSubmittedCount}
            </span>
            <span className="text-[10px] text-amber-400 font-semibold">Action needed: Verify</span>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/30">
            <span className="text-[11px] font-bold uppercase text-emerald-400 block">Confirmed Bookings</span>
            <span className="text-2xl sm:text-3xl font-black text-white font-display mt-1 block">
              {confirmedCount}
            </span>
            <span className="text-[10px] text-emerald-400 font-semibold">Payment Verified</span>
          </div>
        </div>

        {/* TAB 1: BOOKINGS LIST & CONTROLS */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {/* Filters Bar */}
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border-rbx-border flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Date Filter */}
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="px-3 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
                />

                {/* Status Filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
                >
                  <option value="all">All Statuses</option>
                  <option value="PENDING_APPROVAL">Pending Approval</option>
                  <option value="PAYMENT_REQUIRED">Payment Required</option>
                  <option value="PAYMENT_SUBMITTED">Payment Submitted</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="EXPIRED">Expired</option>
                </select>

                {/* Type Filter */}
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
                >
                  <option value="all">All Platforms</option>
                  <option value="pc">PC (RTX 5060)</option>
                  <option value="ps5_single">PS5 Single</option>
                  <option value="ps5_multi">PS5 Multi</option>
                </select>

                {filterDate && (
                  <button
                    onClick={() => setFilterDate('')}
                    className="text-xs text-rbx-red hover:underline font-bold cursor-pointer"
                  >
                    Clear Date
                  </button>
                )}
              </div>

              {/* Search input & Refresh */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-rbx-dark-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search by ID, name, phone..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
                  />
                </div>

                <button
                  onClick={loadData}
                  className="p-2 rounded-xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-white border border-white/10 cursor-pointer"
                  title="Refresh Bookings"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingBookings ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Bookings Table / Cards */}
            <div className="space-y-4">
              {loadingBookings ? (
                <div className="p-12 text-center text-rbx-dark-300 glass-panel rounded-3xl">
                  Loading bookings from Supabase...
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-12 text-center text-rbx-dark-300 glass-panel rounded-3xl space-y-2">
                  <p className="text-base font-bold text-white">No bookings match the selected filters.</p>
                  <p className="text-xs">Adjust date, platform, or status filters to view records.</p>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b.id || b.booking_id}
                    className="p-6 rounded-3xl glass-panel border border-rbx-border/80 hover:border-white/20 transition-all space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-mono font-black text-rbx-red">
                          {b.booking_id}
                        </span>
                        <span className="text-sm font-bold text-white">{b.customer_name}</span>
                        <a
                          href={`tel:${b.mobile_number}`}
                          className="text-xs text-rbx-dark-300 hover:text-white"
                        >
                          📞 {b.mobile_number}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            b.booking_status === 'CONFIRMED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : b.booking_status === 'PAYMENT_REQUIRED'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : b.booking_status === 'PAYMENT_SUBMITTED'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : b.booking_status === 'PENDING_APPROVAL'
                              ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/40'
                          }`}
                        >
                          {b.booking_status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Details Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                      <div>
                        <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                          Date & Time
                        </span>
                        <span className="text-white font-semibold">
                          {b.booking_date} ({b.start_time} - {b.end_time})
                        </span>
                      </div>

                      <div>
                        <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                          Gaming Platform
                        </span>
                        <span className="text-white font-semibold">
                          {b.gaming_type === 'pc'
                            ? `PC (${b.number_of_players} Rigs)`
                            : b.gaming_type === 'ps5_single'
                            ? 'PS5 Single'
                            : `PS5 Multi (${b.number_of_players}P)`}
                        </span>
                      </div>

                      <div>
                        <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                          Assigned Station
                        </span>
                        <span className="text-emerald-400 font-bold">
                          {b.assigned_resources?.join(', ') || b.assigned_resource || 'Pending'}
                        </span>
                      </div>

                      <div>
                        <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                          Pricing Breakdown
                        </span>
                        <span className="text-white font-bold">
                          Total: ₹{b.calculated_price} • Advance: ₹{b.booking_amount}
                        </span>
                      </div>

                      <div>
                        <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                          Payment Reference
                        </span>
                        <span className="text-white font-mono text-[11px]">
                          {b.payment_reference
                            ? `${b.payment_reference} (${b.payment_method})`
                            : 'No payment submitted'}
                        </span>
                      </div>
                    </div>

                    {b.admin_notes && (
                      <div className="p-2.5 rounded-xl bg-rbx-dark-800 text-xs text-rbx-dark-200 border border-white/5">
                        <strong className="text-white">Admin / Gamer Notes:</strong> {b.admin_notes}
                      </div>
                    )}

                    {/* ACTION BUTTONS TOOLBAR */}
                    <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1. APPROVE ACTION */}
                        {b.booking_status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => handleApprove(b.booking_id)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-900/30 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>APPROVE (REQUEST PAYMENT)</span>
                          </button>
                        )}

                        {/* 2. REJECT ACTION */}
                        {b.booking_status === 'PENDING_APPROVAL' && (
                          <button
                            onClick={() => handleReject(b.booking_id)}
                            className="px-4 py-2 rounded-xl bg-rbx-dark-700 hover:bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>REJECT</span>
                          </button>
                        )}

                        {/* 3. VERIFY PAYMENT (CONFIRM) */}
                        {b.booking_status === 'PAYMENT_SUBMITTED' && (
                          <button
                            onClick={() => handleVerifyPayment(b.booking_id)}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/40 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>VERIFY PAYMENT ➔ CONFIRM</span>
                          </button>
                        )}

                        {/* 4. REJECT PAYMENT */}
                        {b.booking_status === 'PAYMENT_SUBMITTED' && (
                          <button
                            onClick={() => handleRejectPayment(b.booking_id)}
                            className="px-4 py-2 rounded-xl bg-rbx-dark-700 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-white/10"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>REJECT PAYMENT</span>
                          </button>
                        )}

                        {/* 5. CANCEL (for confirmed / payment required) */}
                        {['PAYMENT_REQUIRED', 'CONFIRMED'].includes(b.booking_status) && (
                          <button
                            onClick={() => handleCancel(b.booking_id)}
                            className="px-3 py-1.5 rounded-xl bg-rbx-dark-700 hover:bg-red-600 text-rbx-dark-300 hover:text-white font-bold text-xs transition-all cursor-pointer"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>

                      <div className="text-[11px] text-rbx-dark-400">
                        Requested: {new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 24-HOUR RESOURCE SCHEDULE TIMELINE */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border-rbx-border flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase text-rbx-dark-300">Select Date:</span>
                <input
                  type="date"
                  value={calendarDate}
                  onChange={(e) => setCalendarDate(e.target.value)}
                  className="px-3 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
                />
              </div>

              <button
                onClick={loadCalendar}
                className="p-2 rounded-xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-white border border-white/10 cursor-pointer"
                title="Refresh Schedule"
              >
                <RefreshCw className={`w-4 h-4 ${loadingSchedule ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Matrix Schedule */}
            <div className="p-6 rounded-3xl glass-panel border-rbx-border space-y-6">
              <h3 className="text-lg font-black text-white font-display uppercase tracking-wide">
                24/7 STATION ALLOCATION FOR {calendarDate}
              </h3>

              <div className="space-y-4">
                {scheduleItems.map((item) => (
                  <div
                    key={item.resourceId}
                    className="p-4 rounded-2xl bg-rbx-dark-800/80 border border-white/10 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.type === 'pc' ? (
                          <Monitor className="w-5 h-5 text-rbx-red" />
                        ) : (
                          <Gamepad2 className="w-5 h-5 text-blue-400" />
                        )}
                        <span className="text-sm font-bold text-white">{item.resourceName}</span>
                      </div>

                      <span className="text-xs text-rbx-dark-400">
                        {item.bookings.length} Booked Slot(s)
                      </span>
                    </div>

                    {item.bookings.length === 0 ? (
                      <div className="text-xs text-emerald-400 font-semibold py-2">
                        ✓ 100% Free all 24 hours
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1">
                        {item.bookings.map((bSlot, sIdx) => (
                          <div
                            key={sIdx}
                            className={`p-3 rounded-xl border text-xs ${
                              bSlot.status === 'CONFIRMED'
                                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
                            }`}
                          >
                            <div className="font-bold flex justify-between">
                              <span>{bSlot.bookingId}</span>
                              <span className="uppercase text-[10px]">{bSlot.status}</span>
                            </div>
                            <div className="text-white mt-1">{bSlot.customerName}</div>
                            <div className="text-[11px] opacity-80 mt-0.5">
                              {bSlot.startTime} - {bSlot.endTime}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: APP CONFIGURATION */}
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto p-8 rounded-3xl glass-panel border-rbx-border space-y-6">
            <div>
              <h3 className="text-xl font-black text-white font-display uppercase tracking-tight">
                BOOKING & PAYMENT CONFIGURATION
              </h3>
              <p className="text-xs text-rbx-dark-300 mt-1">
                Customize token advance amount, payment deadlines, and UPI billing credentials.
              </p>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                  Required Advance Booking Amount (INR ₹)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={config.BOOKING_AMOUNT}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, BOOKING_AMOUNT: Number(e.target.value) || 0 }))
                  }
                  className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-rbx-red"
                />
                <span className="text-[11px] text-rbx-dark-400 mt-1 block">
                  Amount customer must pay once booking is approved by admin.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                  Payment Deadline (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="1440"
                  required
                  value={config.PAYMENT_DEADLINE_MINUTES}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      PAYMENT_DEADLINE_MINUTES: Number(e.target.value) || 30,
                    }))
                  }
                  className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-rbx-red"
                />
                <span className="text-[11px] text-rbx-dark-400 mt-1 block">
                  How long the customer has to pay after admin approval before the slot expires and releases.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                  Official Cafe UPI ID
                </label>
                <input
                  type="text"
                  required
                  value={config.UPI_ID}
                  onChange={(e) => setConfig((prev) => ({ ...prev, UPI_ID: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm font-mono text-emerald-400 focus:outline-none focus:border-rbx-red"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1">
                  UPI Account Holder Name
                </label>
                <input
                  type="text"
                  required
                  value={config.UPI_NAME}
                  onChange={(e) => setConfig((prev) => ({ ...prev, UPI_NAME: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-rbx-red"
                />
              </div>

              <div className="pt-3">
                <Button
                  fullWidth
                  size="lg"
                  variant="primary"
                  type="submit"
                  disabled={savingConfig}
                  className="py-3 font-bold"
                >
                  {savingConfig ? 'SAVING SETTINGS...' : 'SAVE CONFIGURATION'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: CUSTOMER ACCOUNTS (MOBILE OTP REGISTRATIONS) */}
        {activeTab === 'customers' && (
          <div className="space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl glass-panel border-rbx-border flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-rbx-dark-400" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search by name or mobile number..."
                  className="w-full pl-10 pr-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder:text-rbx-dark-400 focus:outline-none focus:border-rbx-red"
                />
              </div>
              <Button variant="primary" onClick={loadCustomers} disabled={loadingCustomers}>
                <RefreshCw className={`w-4 h-4 inline mr-1.5 ${loadingCustomers ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            {customerSource === 'bookings' && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Showing customers derived from bookings only. Run{' '}
                  <code className="font-mono">supabase/customer_auth_migration.sql</code> in the
                  Supabase SQL Editor and whitelist your admin email in{' '}
                  <code className="font-mono">admin_users</code> to load full profiles (name, first
                  login &amp; last login).
                </span>
              </div>
            )}

            <div className="rounded-2xl glass-panel border-rbx-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        <Users className="w-3 h-3 inline mr-1" />
                        Customer
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        Mobile
                      </th>
                      <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        Bookings
                      </th>
                      <th className="px-4 py-3 text-center text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        Active
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        <CalendarClock className="w-3 h-3 inline mr-1" />
                        First Login
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        Last Login
                      </th>
                      <th className="px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rbx-dark-300">
                        Last Booking
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-10 text-center text-sm text-rbx-dark-400">
                          {loadingCustomers ? 'Loading customers...' : 'No customers found yet.'}
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => (
                        <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-4 py-3 text-sm font-bold text-white">{c.name || '—'}</td>
                          <td className="px-4 py-3 text-sm font-mono text-rbx-dark-200">
                            <Smartphone className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />+91 {c.mobile_number}
                          </td>
                          <td className="px-4 py-3 text-center text-sm font-bold text-white">{c.total_bookings}</td>
                          <td className="px-4 py-3 text-center text-sm font-bold text-emerald-400">
                            {c.active_bookings}
                          </td>
                          <td className="px-4 py-3 text-xs text-rbx-dark-300">
                            {c.first_login_at ? new Date(c.first_login_at).toLocaleDateString() : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs text-rbx-dark-300">
                            {c.last_login_at ? new Date(c.last_login_at).toLocaleString() : '—'}
                          </td>
                          <td className="px-4 py-3 text-xs text-rbx-dark-300">{c.last_booking_date || '—'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
