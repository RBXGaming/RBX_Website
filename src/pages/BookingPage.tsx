import React, { useState } from 'react';
import {
  MessageSquare,
  ShieldCheck,
  Clock,
  MapPin,
  Sparkles,
  ArrowUpRight,
  Search,
  Calendar,
  UserRound,
  LogIn,
} from 'lucide-react';
import { BookingWizard } from '../components/booking/BookingWizard';
import { BookingStatusPage } from './BookingStatusPage';
import { siteConfig, getWhatsAppUrl } from '../config/siteConfig';
import { CustomerProfile } from '../types';

interface BookingPageProps {
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  onNavigate?: (page: string) => void;
  customer?: CustomerProfile | null;
  onLoginRequest?: () => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onToast, onNavigate, customer, onLoginRequest }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'track'>('new');
  const [trackBookingId, setTrackBookingId] = useState<string>('');

  const handleTrackRequested = (id: string) => {
    setTrackBookingId(id);
    setActiveTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-glow-subtle">
            <Clock className="w-3.5 h-3.5" />
            <span>OPEN 24/7 • INSTANT RESERVATION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            BOOK YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              GAMING SESSION
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            Select your setup, pick your time slot, and get your digital booking pass. Open 24 hours, every day.
          </p>

          {/* Mode Switcher: New Booking vs Track Status */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-rbx-dark-800 border border-white/10 mt-6">
            <button
              onClick={() => setActiveTab('new')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'new'
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'text-rbx-dark-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
              <span>Reserve Station</span>
            </button>

            <button
              onClick={() => setActiveTab('track')}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'track'
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'text-rbx-dark-300 hover:text-white'
              }`}
            >
              <Search className="w-3.5 h-3.5 inline mr-1.5" />
              <span>Track / Pay Booking</span>
            </button>
          </div>
        </div>

        {/* Authenticated Customer Green-light Strip */}
        {customer && (
          <div className="mt-4 p-4 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <UserRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Logged in as {customer.name || '+91 ' + (customer.mobile_number || '')}
                </div>
                <div className="text-xs text-rbx-dark-300">
                  New bookings will be linked to your account and appear in My Bookings.
                </div>
              </div>
            </div>
            <button
              onClick={() => onNavigate?.('account')}
              className="px-4 py-2.5 rounded-xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-xs font-bold text-rbx-dark-200 hover:text-white border border-white/10 transition-colors shrink-0 cursor-pointer"
            >
              MY BOOKINGS →
            </button>
          </div>
        )}

        {/* Guest notice: login required to book */}
        {!customer && (
          <div className="mt-4 p-4 rounded-2xl glass-panel border border-rbx-red/30 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-2xl bg-rbx-red/15 text-rbx-red border border-rbx-red/40 flex items-center justify-center shrink-0">
                <LogIn className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  Log in with your mobile OTP to book a session
                </div>
                <div className="text-xs text-rbx-dark-300">
                  Your bookings stay linked to your account so you can track and pay easily.
                </div>
              </div>
            </div>
            <button
              onClick={onLoginRequest}
              className="px-4 py-2.5 rounded-xl bg-rbx-red hover:bg-rbx-red-hover text-white text-xs font-bold shadow-glow-subtle transition-colors shrink-0 cursor-pointer"
            >
              LOGIN / REGISTER
            </button>
          </div>
        )}

        {activeTab === 'track' ? (
          <BookingStatusPage
            initialBookingId={trackBookingId}
            onNavigate={onNavigate}
            onToast={onToast}
          />
        ) : (
          <>
            {/* Quick WhatsApp Alternative Banner */}
            <div className="mb-10 p-4 sm:p-5 rounded-2xl glass-panel border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 bg-emerald-950/20">
              <div className="flex items-center gap-3 text-left">
                <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase">Book Directly on WhatsApp</h4>
                  <p className="text-xs text-rbx-dark-300">
                    Message our reception for instant seat reservations and group queries.
                  </p>
                </div>
              </div>

              <a
                href={getWhatsAppUrl('Hi RBX Gaming Cafe, I want to book a gaming session.')}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all shrink-0 w-full sm:w-auto justify-center"
              >
                <MessageSquare className="w-4 h-4" />
                <span>BOOK VIA WHATSAPP</span>
              </a>
            </div>

            {/* The Main Interactive Booking Wizard */}
            {customer ? (
              <BookingWizard
                customer={customer}
                onToast={onToast}
                onTrackBooking={handleTrackRequested}
              />
            ) : (
              <div className="p-10 sm:p-14 rounded-3xl glass-panel border-rbx-border text-center max-w-xl mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-rbx-red/15 text-rbx-red border border-rbx-red/40 flex items-center justify-center mx-auto shadow-glow-subtle">
                  <LogIn className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-4">
                  LOGIN REQUIRED TO BOOK
                </h3>
                <p className="text-sm text-rbx-dark-300 mt-2">
                  Please log in with your mobile OTP first. Your booking will be linked to your
                  account, and you can track and pay for it anytime from My Bookings.
                </p>
                <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={onLoginRequest}
                    className="px-8 py-3.5 rounded-xl bg-rbx-red hover:bg-rbx-red-hover text-white font-bold text-sm shadow-glow-subtle transition-colors cursor-pointer"
                  >
                    LOGIN / REGISTER
                  </button>
                  <button
                    onClick={() => onNavigate?.('account')}
                    className="px-6 py-3.5 rounded-xl bg-rbx-dark-800 hover:bg-rbx-dark-700 text-rbx-dark-200 hover:text-white text-sm font-bold border border-white/10 transition-colors cursor-pointer"
                  >
                    MY BOOKINGS
                  </button>
                </div>
              </div>
            )}

            {/* Booking Guarantee Info */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-rbx-dark-200">
              <div className="p-6 rounded-2xl glass-panel border-rbx-border">
                <Clock className="w-5 h-5 text-emerald-400 mb-3" />
                <h5 className="font-bold text-white uppercase text-sm mb-1">Open 24/7 Non-Stop</h5>
                <p className="text-rbx-dark-300 leading-relaxed">
                  Book for any hour of the day or night. We are open 24 hours every day without interruption.
                </p>
              </div>

              <div className="p-6 rounded-2xl glass-panel border-rbx-border">
                <ShieldCheck className="w-5 h-5 text-emerald-400 mb-3" />
                <h5 className="font-bold text-white uppercase text-sm mb-1">Two-Step Protected Booking</h5>
                <p className="text-rbx-dark-300 leading-relaxed">
                  Slot held upon submission. Once approved by admin, pay the token advance online to confirm.
                </p>
              </div>

              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-6 rounded-2xl glass-panel border-rbx-border hover:border-rbx-red/40 group transition-colors block"
              >
                <div className="flex items-center justify-between mb-3">
                  <MapPin className="w-5 h-5 text-rbx-red" />
                  <ArrowUpRight className="w-4 h-4 text-rbx-dark-400 group-hover:text-rbx-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
                <h5 className="font-bold text-white uppercase text-sm mb-1 group-hover:text-rbx-red transition-colors">
                  RBX Gaming Cafe Venue
                </h5>
                <p className="text-rbx-dark-300 leading-relaxed group-hover:text-rbx-dark-200 transition-colors">
                  115, First Floor, Rudram Icon, Opp. Lambda House, Near Silver Oak University, Gota, Ahmedabad, Gujarat – 382481
                </p>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
