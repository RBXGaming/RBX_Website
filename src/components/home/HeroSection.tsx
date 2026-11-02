import React from 'react';
import { Calendar, ChevronRight, Zap, Clock } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Button } from '../common/Button';

interface HeroSectionProps {
  onNavigate: (page: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative min-h-[86vh] flex items-center justify-center pt-20 pb-12 overflow-hidden bg-rbx-bg">
      {/* Background Graphic Image with Dark Gradient & Radial Red Glow */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=2000&q=80"
          alt="RBX Gaming Cafe Setup in Ahmedabad"
          className="w-full h-full object-cover object-center opacity-20 scale-105 transform duration-1000"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rbx-bg via-rbx-bg/85 to-rbx-bg/60" />
        <div className="absolute inset-0 bg-radial-hero pointer-events-none" />
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
        
        {/* Premium 24/7 Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rbx-dark-800/90 border border-emerald-500/40 mb-5 backdrop-blur-md shadow-glow-subtle animate-fade-in">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          </span>
          <span className="text-xs font-bold uppercase tracking-wider text-white">
            OPEN 24/7 • PC + PS5 GAMING
          </span>
          <span className="text-rbx-dark-400 hidden sm:inline">•</span>
          <span className="text-[11px] font-semibold text-rbx-dark-300 hidden sm:inline">
            Gota, Ahmedabad
          </span>
        </div>

        {/* Master Headline: Reduced by 20-25% for balanced viewport fit */}
        <h1 className="text-3xl sm:text-5xl md:text-5xl lg:text-6xl font-black tracking-tight text-white font-display uppercase leading-[1.08] max-w-4xl mx-auto">
          LEVEL UP YOUR <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red via-red-500 to-rose-400 text-glow">
            GAMING EXPERIENCE
          </span>
        </h1>

        {/* Subheading */}
        <p className="mt-4 sm:mt-5 text-sm sm:text-base text-rbx-dark-200 max-w-2xl mx-auto font-normal leading-relaxed">
          Ahmedabad's premier 24/7 gaming destination featuring NVIDIA RTX 5060 gaming PCs, 300Hz gaming monitors, and premium PS5 gaming lounges.
        </p>

        {/* CTA Button Group */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto sm:max-w-none">
          <Button
            size="lg"
            variant="primary"
            icon={<Calendar className="w-5 h-5" />}
            onClick={() => onNavigate('booking')}
            className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base"
          >
            BOOK YOUR GAMING SESSION
          </Button>

          <Button
            size="lg"
            variant="secondary"
            icon={<ChevronRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('pricing')}
            className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base"
          >
            VIEW PRICING
          </Button>
        </div>

        {/* Rate Highlight Pill */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm text-rbx-dark-300">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>PC: <strong className="text-white font-bold">₹100/hr</strong></span>
          <span className="text-rbx-dark-500">•</span>
          <span>PS5 Single: <strong className="text-white font-bold">₹120/hr</strong></span>
          <span className="text-rbx-dark-500">•</span>
          <span>PS5 Multi: <strong className="text-white font-bold">₹100/hr</strong></span>
          <span className="text-rbx-dark-500">•</span>
          <span className="text-emerald-400 font-bold uppercase">OPEN 24/7</span>
        </div>

        {/* Live Stats Row */}
        <div className="mt-10 sm:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {siteConfig.stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl glass-panel text-center transition-all duration-300 hover:border-rbx-red/40 hover:-translate-y-1"
            >
              <div className="text-lg sm:text-xl font-black text-white font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-rbx-dark-200">
                {stat.value}
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-rbx-red mt-0.5">
                {stat.label}
              </div>
              <div className="text-[10px] text-rbx-dark-400 mt-0.5">
                {stat.suffix}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
