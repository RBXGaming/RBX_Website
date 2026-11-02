import React from 'react';
import { Sparkles, Check, ArrowRight, Shield, Flame, Clock } from 'lucide-react';
import { Button } from '../common/Button';

interface ExperienceSectionProps {
  onNavigate: (page: string) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 lg:py-28 bg-rbx-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Visual & Specs Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-rbx-border shadow-2xl group">
              <img
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80"
                alt="RBX Gaming Cafe Setup in Ahmedabad"
                className="w-full h-[420px] sm:h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rbx-dark-900 via-rbx-dark-900/40 to-transparent" />

              {/* Floating Stat Box 1 */}
              <div className="absolute top-6 left-6 p-4 rounded-2xl glass-panel border border-white/10 backdrop-blur-xl shadow-xl max-w-xs animate-float">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-rbx-red/20 text-rbx-red flex items-center justify-center font-black">
                    <Flame className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase">RTX 5060 Rigs</div>
                    <div className="text-[11px] text-rbx-dark-300">300Hz Gaming Monitors</div>
                  </div>
                </div>
              </div>

              {/* Floating Stat Box 2 */}
              <div className="absolute bottom-6 right-6 p-4 rounded-2xl glass-panel border border-white/10 backdrop-blur-xl shadow-xl max-w-xs">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white uppercase">OPEN 24/7</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">Open 24 Hours • Every Day</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -bottom-6 -left-6 w-64 h-64 bg-rbx-red/10 rounded-full blur-3xl pointer-events-none" />
          </div>

          {/* Right Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rbx-red/10 text-rbx-red border border-rbx-red/30 shadow-glow-subtle">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Next Level Experience</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
              MORE THAN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
                JUST GAMING.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-rbx-dark-200 leading-relaxed font-normal">
              "Whether you're grinding ranked matches, challenging your friends on PS5, or competing in an esports tournament, RBX Gaming Cafe is built for players who want a better gaming experience."
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rbx-red/20 text-rbx-red flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">NVIDIA RTX 5060 & 300Hz Monitors</h4>
                  <p className="text-xs text-rbx-dark-300 mt-0.5">High-performance gaming setup built for ultra-fast, smooth competitive play in Valorant, CS2, and more.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rbx-red/20 text-rbx-red flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Premium PS5 Single & Multiplayer</h4>
                  <p className="text-xs text-rbx-dark-300 mt-0.5">Solo sessions at ₹120/hr and multiplayer sessions with friends at ₹100/hr for FIFA/FC and fighting games.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rbx-red/20 text-rbx-red flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5 font-bold" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Open 24/7 in Gota, Ahmedabad</h4>
                  <p className="text-xs text-rbx-dark-300 mt-0.5">Play non-stop day or night right near Silver Oak University.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => onNavigate('booking')}
              >
                BOOK YOUR SESSION NOW
              </Button>

              <Button
                variant="ghost"
                size="md"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                onClick={() => onNavigate('pricing')}
              >
                View Transparent Pricing
              </Button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
