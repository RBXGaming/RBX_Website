import React from 'react';
import { Monitor, Gamepad2, Coffee, Flame, Sparkles, Gauge, Bell } from 'lucide-react';
import { Button } from '../components/common/Button';
import { PopularGamesSection } from '../components/home/PopularGamesSection';

interface GamingPageProps {
  onNavigate: (page: string) => void;
}

export const GamingPage: React.FC<GamingPageProps> = ({ onNavigate }) => {
  const pcSpecs = [
    { label: 'Graphics Card', value: 'NVIDIA RTX 5060' },
    { label: 'Gaming Monitor', value: '300Hz High-Refresh Gaming Monitor' },
    { label: 'Setup Type', value: 'High-Performance Esports Gaming Setup' },
    { label: 'Hourly Rate', value: '₹100 / Person / Hour' },
    { label: 'Special Offer', value: '3 Hours + 1 Hour Free (PC Gaming Only)' },
    { label: 'Operating Hours', value: 'OPEN 24/7 (24 Hours Every Day)' },
  ];

  const ps5Specs = [
    { label: 'Console System', value: 'Sony PlayStation 5' },
    { label: 'Single Player Rate', value: '₹120 / Person / Hour' },
    { label: 'Multiplayer Rate', value: '₹100 / Person / Hour' },
    { label: 'Controllers', value: 'Official Sony DualSense Wireless Controllers' },
    { label: 'Seating Setup', value: 'Comfortable Seating Lounge' },
    { label: 'Popular Titles', value: 'Spider-Man 2, Tekken 8, Mortal Kombat 1, FIFA 26, WWE 2K, It Takes Two & Co-op' },
    { label: 'Operating Hours', value: 'OPEN 24/7 (24 Hours Every Day)' },
  ];

  const refreshments = [
    { name: 'Energy Drinks', items: 'Chilled energy drinks and performance beverages' },
    { name: 'Cold Beverages', items: 'Iced cold beverages and chilled sodas' },
    { name: 'Gamer Snacks', items: 'Quick bites and snacks served 24/7' },
  ];

  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rbx-red/10 text-rbx-red border border-rbx-red/30 mb-4 shadow-glow-subtle">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hardware & Gaming Setup</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            PC GAMING RIGS & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              PREMIUM PS5 LOUNGE
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            NVIDIA RTX 5060 gaming PCs with 300Hz monitors, plus single and multiplayer PS5 sessions. Open 24/7 in Gota, Ahmedabad.
          </p>
        </div>

        {/* SECTION 1: PC GAMING SETUP */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Image */}
            <div className="lg:col-span-6 relative">
              <div className="rounded-3xl overflow-hidden glass-panel border border-rbx-border group shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                  alt="RBX Gaming PC with RTX 5060 and 300Hz Monitor"
                  className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rbx-dark-900 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex gap-2 flex-wrap">
                  <span className="px-3.5 py-1.5 rounded-full bg-rbx-red text-white text-xs font-black uppercase tracking-wider shadow-glow-subtle">
                    ₹100 / Person / Hour
                  </span>
                  <span className="px-3 py-1.5 rounded-full bg-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-md">
                    3+1 Free PC Offer
                  </span>
                </div>
              </div>
            </div>

            {/* Right Specs Table */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rbx-red/20 text-rbx-red border border-rbx-red/40">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
                    RTX 5060 GAMING PCs
                  </h2>
                  <span className="text-xs text-emerald-400 font-semibold">300Hz Gaming Monitors • High-Performance Setup</span>
                </div>
              </div>

              {/* Special PC Offer Callout */}
              <div className="p-3.5 rounded-2xl bg-rbx-dark-800 border border-rbx-red/50 flex items-center gap-3">
                <Flame className="w-5 h-5 text-rbx-red shrink-0" />
                <div className="text-xs">
                  <span className="font-bold text-white block uppercase">PC GAMING OFFER: 3 HOURS + 1 HOUR FREE</span>
                  <span className="text-rbx-dark-300">Book 3 hours, 4th hour free. (Valid for PC Gaming only).</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {pcSpecs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-rbx-dark-800/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="text-rbx-dark-400 font-semibold uppercase">{spec.label}</span>
                    <span className="text-white font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('booking')}
                >
                  RESERVE PC RIG
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => onNavigate('pricing')}
                >
                  View Rates (₹100/hr)
                </Button>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: PS5 GAMING SETUP (Standard Rates Only - No Offer Badge) */}
        <div className="mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Specs Table */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/40">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
                    PREMIUM PS5 GAMING
                  </h2>
                  <span className="text-xs text-blue-400 font-semibold">Single Player (₹120/hr) & Multiplayer (₹100/hr)</span>
                </div>
              </div>

              <div className="space-y-2.5">
                {ps5Specs.map((spec, sIdx) => (
                  <div key={sIdx} className="p-3 rounded-xl bg-rbx-dark-800/80 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                    <span className="text-rbx-dark-400 font-semibold uppercase">{spec.label}</span>
                    <span className="text-white font-bold">{spec.value}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => onNavigate('booking')}
                >
                  RESERVE PS5 SESSION
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => onNavigate('pricing')}
                >
                  View Pricing
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="lg:col-span-6 relative order-1 lg:order-2">
              <div className="rounded-3xl overflow-hidden glass-panel border border-rbx-border group shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80"
                  alt="RBX PS5 Gaming Setup"
                  className="w-full h-[380px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rbx-dark-900 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 flex gap-2">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black uppercase">
                    Single: ₹120/hr
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black uppercase">
                    Multi: ₹100/hr
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 3: RACING COCKPIT — COMING SOON */}
        <div className="mb-24 p-8 sm:p-12 lg:p-14 rounded-3xl glass-panel border border-rbx-red/30 shadow-2xl relative overflow-hidden bg-gradient-to-r from-rbx-dark-900 via-rbx-card to-rbx-dark-900">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rbx-red/15 via-transparent to-transparent pointer-events-none rounded-bl-full" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-rbx-red/20 text-rbx-red border border-rbx-red/40 shadow-glow-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMING SOON</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white font-display uppercase tracking-tight">
                🏎️ RACING <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-amber-400">COCKPIT</span>
              </h2>

              <p className="text-base sm:text-lg text-white font-bold uppercase tracking-wide">
                Get ready to experience immersive racing at RBX Gaming Cafe. Our racing cockpit is coming soon.
              </p>

              <p className="text-sm text-rbx-dark-300 leading-relaxed max-w-2xl">
                An authentic track simulation experience designed for high-octane motorsport immersion. Stay tuned for official launch announcements.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center gap-2.5">
                  <Gauge className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-white uppercase">Pro Simulation</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-rbx-red shrink-0" />
                  <span className="text-xs font-bold text-white uppercase">Force Feedback</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white uppercase">Stay Tuned</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-rbx-dark-800/90 border border-white/10 text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-rbx-red/15 text-rbx-red flex items-center justify-center mx-auto border border-rbx-red/30 shadow-glow-subtle">
                <Gauge className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white uppercase font-display">
                RACING SIMULATION
              </h3>
              <p className="text-xs text-rbx-dark-300">
                Upcoming attraction at RBX Gaming Cafe. Launch details dropping soon.
              </p>
              <button
                type="button"
                disabled
                className="w-full py-2.5 px-4 rounded-xl bg-rbx-dark-700 text-white/80 font-bold text-xs uppercase tracking-widest border border-white/10 cursor-not-allowed opacity-90 select-none flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>COMING SOON</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 4: REFRESHMENTS & OPEN 24/7 INFO */}
        <div className="mb-20 p-8 sm:p-10 rounded-3xl glass-panel border-rbx-border">
          <div className="flex items-center gap-3 mb-6">
            <Coffee className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-bold text-white font-display uppercase">
              24/7 CAFE REFRESHMENTS & SNACKS
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {refreshments.map((ref, rIdx) => (
              <div key={rIdx} className="p-5 rounded-2xl bg-rbx-dark-800/80 border border-white/5">
                <h4 className="text-sm font-bold text-white uppercase font-display mb-1.5 text-amber-400">
                  {ref.name}
                </h4>
                <p className="text-xs text-rbx-dark-300 leading-relaxed">
                  {ref.items}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 5: POPULAR GAMES */}
        <PopularGamesSection onSelectGame={() => onNavigate('booking')} />

      </div>
    </div>
  );
};
