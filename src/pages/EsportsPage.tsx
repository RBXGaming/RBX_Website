import React from 'react';
import { Trophy, MessageSquare, Flame, Sparkles, Bell, ArrowRight, ShieldCheck, Gamepad2, Monitor } from 'lucide-react';
import { tournamentsData } from '../data/tournamentsData';
import { siteConfig, getWhatsAppUrl } from '../config/siteConfig';
import { Button } from '../components/common/Button';

interface EsportsPageProps {
  onNavigate: (page: string) => void;
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const EsportsPage: React.FC<EsportsPageProps> = ({ onNavigate }) => {
  const hasTournaments = tournamentsData && tournamentsData.length > 0;

  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rbx-red/10 text-rbx-red border border-rbx-red/30 mb-4 shadow-glow-subtle">
            <Trophy className="w-3.5 h-3.5" />
            <span>Competitive Gaming Arena • Gota, Ahmedabad</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            ESPORTS & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              TOURNAMENTS
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            Get ready for exciting esports tournaments and competitive gaming events at RBX Gaming Cafe.
          </p>
        </div>

        {/* SECTION: ACTIVE TOURNAMENTS OR COMING SOON HERO */}
        {hasTournaments ? (
          <div className="mb-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournamentsData.map((tourney) => (
              <div
                key={tourney.id}
                className="group rounded-3xl glass-panel overflow-hidden border-rbx-border"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white uppercase">{tourney.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* PRIMARY COMING SOON CARD */
          <div className="max-w-4xl mx-auto mb-20">
            <div className="relative rounded-3xl p-8 sm:p-14 lg:p-16 glass-panel-red border border-rbx-red/40 shadow-glow-red text-center overflow-hidden">
              
              {/* Glow Accents */}
              <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-rbx-red/20 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-rbx-red/15 to-transparent rounded-tr-full pointer-events-none" />

              {/* Glowing Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-rbx-red text-white shadow-glow-subtle mb-6 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>COMING SOON</span>
              </div>

              {/* Main Heading */}
              <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight mb-4">
                TOURNAMENTS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red via-red-400 to-rose-300">
                  COMING SOON
                </span>
              </h2>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-rbx-dark-200 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
                "Get ready for exciting esports tournaments and competitive gaming events at RBX Gaming Cafe."
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left max-w-3xl mx-auto">
                <div className="p-5 rounded-2xl bg-rbx-dark-900/90 border border-white/5 space-y-2">
                  <div className="p-2 w-fit rounded-xl bg-amber-500/10 text-amber-400">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">LAN Brackets</h4>
                  <p className="text-xs text-rbx-dark-300 leading-relaxed">
                    Tactical FPS, sports titles, and community squad showdowns.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rbx-dark-900/90 border border-white/5 space-y-2">
                  <div className="p-2 w-fit rounded-xl bg-rbx-red/15 text-rbx-red">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">RTX 5060 & 300Hz</h4>
                  <p className="text-xs text-rbx-dark-300 leading-relaxed">
                    High-performance hardware for competitive precision.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-rbx-dark-900/90 border border-white/5 space-y-2">
                  <div className="p-2 w-fit rounded-xl bg-emerald-500/15 text-emerald-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase font-display">Stay Tuned</h4>
                  <p className="text-xs text-rbx-dark-300 leading-relaxed">
                    Tournament schedules, game line-ups, and details dropping soon.
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-rbx-red hover:bg-rbx-red-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-glow-subtle flex items-center justify-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>FOLLOW US FOR UPDATES</span>
                </a>

                <a
                  href={getWhatsAppUrl("Hi RBX Gaming Cafe! Please notify me when you announce esports tournaments.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>GET WHATSAPP UPDATES</span>
                </a>
              </div>

            </div>
          </div>
        )}

        {/* SECTION 2: HARDWARE ADVANTAGE */}
        <div className="mb-20 p-8 sm:p-12 rounded-3xl glass-panel border-rbx-border max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
              TOURNAMENT-GRADE SETUP
            </h3>
            <p className="text-xs sm:text-sm text-rbx-dark-300 mt-2">
              RBX Gaming Cafe offers a competition-grade arena for both PC esports and console matches.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-rbx-dark-800/80 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rbx-red/20 text-rbx-red">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white uppercase font-display">PC Esports Station</h4>
                  <span className="text-xs text-rbx-red font-semibold">₹100 / person / hr</span>
                </div>
              </div>
              <ul className="text-xs text-rbx-dark-300 space-y-2 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-rbx-red" />
                  <span>NVIDIA RTX 5060 Graphics</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-rbx-red" />
                  <span>300Hz High-Refresh Gaming Displays</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-rbx-red" />
                  <span>Open 24/7 (24 Hours Every Day)</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-rbx-dark-800/80 border border-white/5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white uppercase font-display">PS5 Lounge Arena</h4>
                  <span className="text-xs text-blue-400 font-semibold">Single ₹120/hr • Multi ₹100/hr</span>
                </div>
              </div>
              <ul className="text-xs text-rbx-dark-300 space-y-2 pt-2 border-t border-white/5">
                <li className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Sony PlayStation 5 Console Setups</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Official DualSense Wireless Controllers</span>
                </li>
                <li className="flex items-center gap-2 text-white">
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>EA Sports FC, fighting & co-op games</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* SECTION 3: HOST PRIVATE TOURNAMENT OR BOOTCAMP */}
        <div className="p-8 sm:p-12 rounded-3xl glass-panel-red border border-rbx-red/40 flex flex-col md:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-rbx-red block mb-1">
              COLLEGE & SQUAD ORGANIZERS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase">
              WANT TO HOST A TOURNAMENT AT RBX?
            </h3>
            <p className="text-xs sm:text-sm text-rbx-dark-200 mt-2 max-w-xl">
              Organizing a college championship, squad LAN scrim, or private bootcamp? Contact RBX for venue availability.
            </p>
          </div>

          <a
            href={getWhatsAppUrl("Hi RBX Gaming Cafe, I want to discuss hosting a private gaming tournament or bootcamp at your venue.")}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
            <span>DISCUSS ON WHATSAPP</span>
          </a>
        </div>

      </div>
    </div>
  );
};
