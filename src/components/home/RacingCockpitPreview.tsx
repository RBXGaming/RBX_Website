import React from 'react';
import { Sparkles, Gauge, Flame, Bell } from 'lucide-react';

interface RacingCockpitPreviewProps {
  className?: string;
}

export const RacingCockpitPreview: React.FC<RacingCockpitPreviewProps> = ({ className = '' }) => {
  return (
    <section className={`py-16 lg:py-20 bg-rbx-bg relative overflow-hidden ${className}`}>
      {/* Background Ambience */}
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 left-10 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-12 lg:p-14 glass-panel border border-rbx-red/30 hover:border-rbx-red/50 transition-all duration-300 shadow-2xl overflow-hidden bg-gradient-to-r from-rbx-dark-900 via-rbx-card to-rbx-dark-900">
          
          {/* Subtle Corner Accent */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-rbx-red/15 via-transparent to-transparent pointer-events-none rounded-bl-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-8 space-y-5">
              
              {/* Coming Soon Glowing Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-rbx-red/20 text-rbx-red border border-rbx-red/40 shadow-glow-subtle">
                <Sparkles className="w-3.5 h-3.5" />
                <span>COMING SOON • UPCOMING ATTRACTION</span>
              </div>

              {/* Title */}
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
                  🏎️ RACING <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red via-red-400 to-amber-400">
                    COCKPIT
                  </span>
                </h2>
                <p className="mt-2 text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                  An immersive racing experience is coming to RBX.
                </p>
              </div>

              {/* Supporting Text */}
              <p className="text-sm sm:text-base text-rbx-dark-200 leading-relaxed max-w-2xl font-normal">
                Get ready to experience immersive racing at RBX Gaming Cafe. Our racing cockpit is coming soon.
              </p>

              {/* Teaser Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="text-xs font-bold text-white uppercase">Pro Simulation</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center gap-3">
                  <Flame className="w-5 h-5 text-rbx-red shrink-0" />
                  <span className="text-xs font-bold text-white uppercase">Force Feedback</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center gap-3">
                  <Bell className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white uppercase">Stay Tuned</span>
                </div>
              </div>

            </div>

            {/* Right Interactive Teaser Card */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 sm:p-8 rounded-2xl bg-rbx-dark-800/90 border border-white/10 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-rbx-red/15 text-rbx-red flex items-center justify-center border border-rbx-red/30 shadow-glow-subtle animate-pulse">
                <Gauge className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-black text-white font-display uppercase tracking-wide">
                  RACING SIMULATOR
                </h3>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mt-0.5">
                  Launch Phase Incoming
                </span>
                <p className="text-[11px] text-rbx-dark-300 mt-2">
                  Stay connected with RBX for launch dates and early previews.
                </p>
              </div>

              {/* Non-booking Coming Soon CTA button */}
              <div className="w-full pt-2">
                <button
                  type="button"
                  disabled
                  className="w-full py-3 px-6 rounded-xl bg-rbx-dark-700 text-white/80 font-bold text-xs uppercase tracking-widest border border-white/10 cursor-not-allowed opacity-90 select-none shadow-inner flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>COMING SOON</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
