import React from 'react';
import { Trophy, Bell, ArrowRight, MessageSquare, Flame, Sparkles } from 'lucide-react';
import { tournamentsData } from '../../data/tournamentsData';
import { siteConfig, getWhatsAppUrl } from '../../config/siteConfig';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

interface EsportsPreviewSectionProps {
  onNavigate: (page: string) => void;
  onRegisterClick?: (tournamentId: string) => void;
}

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const EsportsPreviewSection: React.FC<EsportsPreviewSectionProps> = ({ onNavigate }) => {
  const hasTournaments = tournamentsData && tournamentsData.length > 0;

  return (
    <section className="py-20 lg:py-28 bg-rbx-bg relative overflow-hidden">
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-rbx-red/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Esports"
          title="ESPORTS"
          highlightText="EVENTS"
          subtitle="Competitive gaming and community tournaments at RBX Gaming Cafe in Ahmedabad."
        />

        {hasTournaments ? (
          /* When tournaments exist in data file */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tournamentsData.map((tourney) => (
              <div
                key={tourney.id}
                className="group rounded-3xl glass-panel overflow-hidden border-rbx-border hover:border-rbx-red/40 transition-all"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white uppercase">{tourney.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Premium COMING SOON State */
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 glass-panel-red border border-rbx-red/40 shadow-glow-red text-center overflow-hidden">
              
              {/* Background ambient highlights */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-rbx-red/20 to-transparent rounded-bl-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-rbx-red/15 to-transparent rounded-tr-full pointer-events-none" />

              {/* Glowing COMING SOON Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-rbx-red text-white shadow-glow-subtle mb-6 animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-white" />
                <span>COMING SOON</span>
              </div>

              {/* Main Headline */}
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight mb-4">
                TOURNAMENTS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red via-red-400 to-rose-300">
                  COMING SOON
                </span>
              </h3>

              {/* Supporting Text */}
              <p className="text-base sm:text-lg text-rbx-dark-200 max-w-2xl mx-auto leading-relaxed mb-8">
                Get ready for exciting esports tournaments and competitive gaming events at RBX Gaming Cafe.
              </p>

              {/* 3 Value Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 max-w-3xl mx-auto text-left">
                <div className="p-4 rounded-2xl bg-rbx-dark-900/80 border border-white/5">
                  <Trophy className="w-5 h-5 text-amber-400 mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase font-display">Structured Brackets</h4>
                  <p className="text-[11px] text-rbx-dark-300 mt-1">Community LAN competitions across popular esports titles.</p>
                </div>

                <div className="p-4 rounded-2xl bg-rbx-dark-900/80 border border-white/5">
                  <Flame className="w-5 h-5 text-rbx-red mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase font-display">RTX 5060 & 300Hz</h4>
                  <p className="text-[11px] text-rbx-dark-300 mt-1">Tournament-ready setups built for competitive precision.</p>
                </div>

                <div className="p-4 rounded-2xl bg-rbx-dark-900/80 border border-white/5">
                  <Bell className="w-5 h-5 text-emerald-400 mb-2" />
                  <h4 className="text-xs font-bold text-white uppercase font-display">Stay Tuned</h4>
                  <p className="text-[11px] text-rbx-dark-300 mt-1">Announcements and tournament schedules will drop soon.</p>
                </div>
              </div>

              {/* Action CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={siteConfig.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-rbx-red hover:bg-rbx-red-hover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-glow-subtle flex items-center justify-center gap-2"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>FOLLOW US FOR UPDATES</span>
                </a>

                <a
                  href={getWhatsAppUrl("Hi RBX Gaming Cafe! I would like to stay updated on upcoming esports tournaments.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WHATSAPP UPDATES</span>
                </a>

                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => onNavigate('esports')}
                  className="w-full sm:w-auto text-xs"
                >
                  <span>ESPORTS PAGE</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
