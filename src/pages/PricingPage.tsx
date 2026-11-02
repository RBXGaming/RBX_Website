import React, { useState } from 'react';
import { Monitor, Gamepad2, Clock, Calendar, ArrowRight, CheckCircle2, Calculator, Flame, Tag, Moon } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { Button } from '../components/common/Button';
import { calculateBookingPrice, calculateEndTime } from '../lib/bookingService';

interface PricingPageProps {
  onNavigate: (page: string) => void;
}

const CALCULATOR_START_TIMES = [
  '09:30 AM',
  '10:00 AM',
  '12:00 PM',
  '03:00 PM',
  '06:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '12:00 AM',
  '02:00 AM',
  '06:00 AM',
  '08:00 AM',
];

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [calcOption, setCalcOption] = useState<'pc' | 'ps5_single' | 'ps5_multi'>('pc');
  const [calcPlayers, setCalcPlayers] = useState<number>(1);
  const [calcHours, setCalcHours] = useState<number>(2);
  const [calcStartTime, setCalcStartTime] = useState<string>('09:30 AM');

  const priceBreakdown = calculateBookingPrice(calcOption, calcPlayers, calcHours, calcStartTime);

  // Readable estimate summary: reflects paid/free hours, day/night split, and overnight-only sessions.
  const fmtHours = (hours: number): string => {
    const rounded = Math.round(hours * 100) / 100;
    return Number.isInteger(rounded) ? `${rounded}` : rounded.toFixed(1);
  };

  const pcSummary: string = (() => {
    const players = priceBreakdown.effectivePlayers;
    const dayRate = siteConfig.pricing.pcHourly;
    const nightRate = siteConfig.pricing.overnightHourly;
    const freeHours = Math.round(calcHours - priceBreakdown.paidHours);
    const offerPart = priceBreakdown.offerApplied
      ? `PC ${freeHours === 1 ? '3+1' : '6+2'} Offer — ${calcHours} total hours, ${priceBreakdown.paidHours} paid + ${freeHours} free. `
      : '';

    if (priceBreakdown.isSplitRate) {
      return `${offerPart}Daytime ₹${priceBreakdown.dayAmount} (₹${dayRate} × ${fmtHours(priceBreakdown.billableDayHours)} hr) + Overnight ₹${priceBreakdown.nightAmount} (₹${nightRate} × ${fmtHours(priceBreakdown.billableNightHours)} hr)`;
    }
    if (priceBreakdown.overnightApplied) {
      return `${offerPart}Overnight ₹${priceBreakdown.nightAmount} (₹${nightRate} × ${fmtHours(priceBreakdown.billableNightHours)} hr(s))`;
    }
    return `${offerPart}₹${priceBreakdown.dayAmount} (₹${dayRate} × ${players} player(s) × ${fmtHours(priceBreakdown.billableDayHours)} hr(s))`;
  })();

  const sessionTypeLabel = priceBreakdown.isSplitRate
    ? 'Split (Day + Overnight)'
    : priceBreakdown.overnightApplied
      ? 'Overnight'
      : 'Daytime';

  const summaryText: string = (() => {
    if (calcOption === 'pc') return pcSummary;
    const players = priceBreakdown.effectivePlayers;
    const base = calcOption === 'ps5_single'
      ? '(Standard single rate)'
      : `(${players} players, multiplayer rate)`;
    if (priceBreakdown.isSplitRate) {
      return `Daytime ₹${priceBreakdown.dayAmount} (${fmtHours(priceBreakdown.billableDayHours)} hr) + Overnight ₹${priceBreakdown.nightAmount} (${fmtHours(priceBreakdown.billableNightHours)} hr) ${base}`;
    }
    if (priceBreakdown.overnightApplied) {
      return `Overnight ₹${priceBreakdown.nightAmount} (${fmtHours(priceBreakdown.billableNightHours)} hr) ${base}`;
    }
    return `₹${priceBreakdown.dayAmount} (${fmtHours(priceBreakdown.billableDayHours)} hr) ${base}`;
  })();

  const calculatedEndTime = calculateEndTime(calcStartTime, calcHours);

  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-glow-subtle">
            <Clock className="w-3.5 h-3.5" />
            <span>OPEN 24/7 • OPEN 24 HOURS EVERY DAY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            GAMING <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              PRICING
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            Simple, transparent, and fair pricing. Daytime rates stay the same. Overnight (10:00 PM – 9:30 AM) is a flat ₹120 per person / hour for every setup. Open 24/7 in Gota, Ahmedabad.
          </p>
        </div>

        {/* 2 MAIN PRICING CARDS: PC GAMING & PS5 GAMING */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          
          {/* CARD 1: PC GAMING (Includes PC-Only Special Offer) */}
          <div className="relative rounded-3xl p-8 sm:p-10 glass-panel-red border border-rbx-red/40 shadow-glow-red flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-rbx-red/20 text-rbx-red border border-rbx-red/40">
                  <Monitor className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rbx-red text-white shadow-glow-subtle">
                  RTX 5060 • 300Hz
                </span>
              </div>

              <h2 className="text-3xl font-black text-white font-display uppercase tracking-wide">
                PC GAMING
              </h2>

              <p className="text-xs text-rbx-dark-300 mt-1.5">
                High-performance gaming setup built for competitive precision.
              </p>

              {/* Big Price Display */}
              <div className="my-6 py-4 border-y border-white/10 flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black text-white font-display">
                  ₹{siteConfig.pricing.pcHourly}
                </span>
                <span className="text-sm font-bold text-rbx-dark-200 uppercase tracking-wider">
                  / person / hour
                </span>
              </div>
              <p className="text-xs text-rbx-dark-300 -mt-4 mb-6">
                Daytime {siteConfig.pricing.dayWindowLabel}. Overnight {siteConfig.pricing.nightWindowLabel}: ₹{siteConfig.pricing.overnightHourly} / person / hour.
              </p>
              <div className="p-4 rounded-2xl bg-rbx-dark-900/90 border border-rbx-red/50 mb-6 shadow-glow-subtle">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-rbx-red mb-1">
                  <Flame className="w-4 h-4 text-rbx-red" />
                  <span>SPECIAL PC OFFER: 3+1 FREE • 6+2 FREE</span>
                </div>
                <p className="text-xs text-rbx-dark-200 leading-relaxed">
                  3+1 FREE — 4 total hours, 3 paid + 1 free. &nbsp;•&nbsp; 6+2 FREE — 8 total hours, 6 paid + 2 free.&nbsp;
                  Applies to all PC sessions — day, overnight, or split.
                </p>
              </div>

              {/* Hardware Specifications */}
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-rbx-red shrink-0" />
                  <span>NVIDIA RTX 5060 Graphics</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-rbx-red shrink-0" />
                  <span>300Hz Gaming Monitors</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-rbx-red shrink-0" />
                  <span>High-performance gaming setup</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400 font-bold">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Open 24/7 (24 Hours Every Day)</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              variant="primary"
              fullWidth
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => onNavigate('booking')}
            >
              BOOK PC SESSION
            </Button>
          </div>

          {/* CARD 2: PS5 GAMING (Standard Rates Only - No Offer Badge) */}
          <div className="relative rounded-3xl p-8 sm:p-10 glass-panel border border-rbx-border hover:border-blue-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Gamepad2 className="w-7 h-7" />
                </div>
                <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-blue-600 text-white">
                  PS5 Setup
                </span>
              </div>

              <h2 className="text-3xl font-black text-white font-display uppercase tracking-wide">
                PS5 GAMING
              </h2>

              <p className="text-xs text-rbx-dark-300 mt-1.5">
                Premium console gaming with comfortable single and multiplayer setups.
              </p>

              {/* Distinct Single & Multiplayer Rates Grid */}
              <div className="my-6 space-y-3">
                
                {/* Single Player Box */}
                <div className="p-4 rounded-2xl bg-rbx-dark-800 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-blue-400 block">
                      SINGLE PLAYER
                    </span>
                    <span className="text-xs text-rbx-dark-300">Solo gaming session</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white font-display">
                      ₹{siteConfig.pricing.ps5SingleHourly}
                    </span>
                    <span className="text-[11px] text-rbx-dark-400 block font-semibold">/ person / hour daytime</span>
                  </div>
                </div>

                {/* Multiplayer Box */}
                <div className="p-4 rounded-2xl bg-rbx-dark-800 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 block">
                      MULTIPLAYER
                    </span>
                    <span className="text-xs text-rbx-dark-300">Play with friends (EA FC, Fighting, Co-op)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-emerald-400 font-display">
                      ₹{siteConfig.pricing.ps5MultiHourly}
                    </span>
                    <span className="text-[11px] text-rbx-dark-400 block font-semibold">/ person / hour daytime</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-rbx-dark-300 mb-6">
                Overnight {siteConfig.pricing.nightWindowLabel}: ₹{siteConfig.pricing.overnightHourly} / person / hour for both single and multiplayer.
              </p>

              {/* PS5 Features */}
              <div className="space-y-3 mb-8 text-sm">
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Premium PS5 Gaming Setup</span>
                </div>
                <div className="flex items-center gap-3 text-white font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" />
                  <span>Single & Multiplayer sessions</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-400 font-bold">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Open 24/7 (24 Hours Every Day)</span>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              variant="secondary"
              fullWidth
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => onNavigate('booking')}
              className="hover:bg-blue-600 hover:text-white transition-all"
            >
              BOOK PS5 SESSION
            </Button>
          </div>

        </div>

        {/* OVERNIGHT RATE BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-indigo-500/30 max-w-5xl mx-auto mb-8 text-left bg-indigo-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
              <Moon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-display uppercase">Overnight Rate • ₹120 / Person / Hour</h3>
              <p className="text-sm text-rbx-dark-200 mt-1 leading-relaxed">
                From <strong className="text-white">10:00 PM to 9:30 AM</strong>, every station (PC and PS5) is a flat ₹{siteConfig.pricing.overnightHourly} per person per hour.
                Daytime prices above stay the same from 9:30 AM to 10:00 PM. If your session crosses 10:00 PM or 9:30 AM, each part is charged at the matching rate.
              </p>
            </div>
          </div>
        </div>

        {/* 24/7 OPEN BANNER */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/10 max-w-5xl mx-auto mb-20 text-center bg-gradient-to-r from-rbx-dark-900 via-rbx-card to-rbx-dark-900">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-left">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-display uppercase">OPEN 24 HOURS • EVERY DAY</h3>
                <p className="text-xs text-rbx-dark-300">No time limits. Drop in at 2 PM or 2 AM — we are always ready for you in Gota, Ahmedabad.</p>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => onNavigate('booking')}
              className="shrink-0 w-full sm:w-auto"
            >
              RESERVE YOUR SPOT
            </Button>
          </div>
        </div>

        {/* SECTION: INTERACTIVE PRICE ESTIMATOR */}
        <div className="max-w-5xl mx-auto p-8 sm:p-10 rounded-3xl glass-panel border-rbx-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-rbx-red/20 text-rbx-red">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white font-display uppercase">
                QUICK PRICE CALCULATOR
              </h3>
              <p className="text-xs text-rbx-dark-300">
                Estimate your exact session total before visiting.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Options */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Option Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-2">
                  1. Choose Option
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => { setCalcOption('pc'); setCalcPlayers(1); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calcOption === 'pc' ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle' : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold">PC Gaming</div>
                    <div className="text-[11px] opacity-80">₹100 / person / hr</div>
                    <div className="text-[10px] text-amber-300 font-bold mt-1">3+1 & 6+2 Free Offers</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCalcOption('ps5_single'); setCalcPlayers(1); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calcOption === 'ps5_single' ? 'bg-blue-600 text-white border-blue-500 shadow-lg' : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold">PS5 Single</div>
                    <div className="text-[11px] opacity-80">₹120 / person / hr</div>
                    <div className="text-[10px] text-rbx-dark-400 mt-1">Standard rate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setCalcOption('ps5_multi'); setCalcPlayers(2); }}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      calcOption === 'ps5_multi' ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/5'
                    }`}
                  >
                    <div className="text-xs font-bold">PS5 Multiplayer</div>
                    <div className="text-[11px] opacity-80">₹100 / person / hr</div>
                    <div className="text-[10px] text-rbx-dark-400 mt-1">Standard rate</div>
                  </button>
                </div>
              </div>

              {/* Number of Players */}
              {calcOption !== 'ps5_single' && (
                <div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-rbx-dark-200 mb-2">
                    <span>2. Number of Gamers:</span>
                    <span className="text-white font-bold">{calcPlayers} Person(s)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {[1, 2, 3, 4, 5].map((num) => {
                      if (calcOption === 'ps5_multi' && num === 1) return null;
                      return (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setCalcPlayers(num)}
                          className={`w-10 h-10 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            calcPlayers === num ? 'bg-white text-black border-white' : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/5 hover:text-white'
                          }`}
                        >
                          {num}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Start Time */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-rbx-dark-200 mb-2">
                  <span>{calcOption === 'ps5_single' ? '2' : '3'}. Start Time:</span>
                  <span className="text-white font-bold">{calcStartTime} → {calculatedEndTime}</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {CALCULATOR_START_TIMES.map((tm) => (
                    <button
                      key={tm}
                      type="button"
                      onClick={() => setCalcStartTime(tm)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        calcStartTime === tm ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle' : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/5 hover:text-white'
                      }`}
                    >
                      {tm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of Hours */}
              <div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-rbx-dark-200 mb-2">
                  <span>{calcOption === 'ps5_single' ? '3' : '4'}. Duration:</span>
                  <span className="text-white font-bold">{calcHours} Hour(s)</span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 8].map((hr) => (
                    <button
                      key={hr}
                      type="button"
                      onClick={() => setCalcHours(hr)}
                      className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        calcHours === hr ? 'bg-rbx-red text-white border-rbx-red shadow-glow-subtle' : 'bg-rbx-dark-800 text-rbx-dark-300 border-white/5 hover:text-white'
                      }`}
                    >
                      {hr}h
                      {calcOption === 'pc' && hr === 4 && (
                        <span className="block text-[9px] text-amber-300">3+1 FREE</span>
                      )}
                      {calcOption === 'pc' && hr === 8 && (
                        <span className="block text-[9px] text-amber-300">6+2 FREE</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Total Output Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl glass-panel-red border border-rbx-red/40 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-rbx-red block">
                Calculated Estimate
              </span>

              <div className="text-5xl sm:text-6xl font-black text-white font-display">
                ₹{priceBreakdown.totalPrice}
              </div>

              {priceBreakdown.offerApplied && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/40">
                  <Tag className="w-3.5 h-3.5" />
                  <span>PC {calcHours === 8 ? '6+2' : '3+1'} Free Offer Applied (Saved ₹{priceBreakdown.discountAmount})</span>
                </div>
              )}

              <div className="text-[11px] text-rbx-dark-300 flex items-center justify-center gap-1.5 flex-wrap">
                <Clock className="w-3.5 h-3.5 text-rbx-red" />
                <span className="text-white font-bold">{calcStartTime}</span>
                <ArrowRight className="w-3.5 h-3.5 text-rbx-red" />
                <span className="text-white font-bold">{calculatedEndTime}</span>
                <span className="text-rbx-dark-300">•</span>
                <span className="text-emerald-400 font-semibold">{sessionTypeLabel}</span>
              </div>

              <div className="text-xs text-rbx-dark-300 leading-relaxed">
                {summaryText}
              </div>

              <Button
                fullWidth
                size="lg"
                variant="primary"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => onNavigate('booking')}
              >
                BOOK THIS SESSION
              </Button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
