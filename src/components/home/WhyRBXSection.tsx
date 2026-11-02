import React from 'react';
import { Cpu, Monitor, Gamepad2, Clock, Trophy, Zap, ShieldCheck } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';

export const WhyRBXSection: React.FC = () => {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-rbx-red" />,
      title: 'RTX 5060 GAMING PCs',
      description: 'High-performance gaming setup powered by NVIDIA RTX 5060 for smooth competitive frame rates.',
    },
    {
      icon: <Monitor className="w-6 h-6 text-cyan-400" />,
      title: '300Hz GAMING MONITORS',
      description: 'Ultra-smooth competitive gaming with ultra-high refresh 300Hz monitors.',
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-blue-400" />,
      title: 'PREMIUM PS5 GAMING',
      description: 'Single & multiplayer sessions with comfortable seating and the latest popular games.',
    },
    {
      icon: <Clock className="w-6 h-6 text-emerald-400" />,
      title: 'OPEN 24/7',
      description: 'Open 24 hours, every day. Visit anytime for morning, evening, or late-night gaming sessions.',
    },
    {
      icon: <Trophy className="w-6 h-6 text-amber-400" />,
      title: 'Regular Esports Events',
      description: 'Community gaming tournaments, LAN events, and team competitions in Ahmedabad.',
    },
  ];

  return (
    <section className="py-20 bg-rbx-dark-900/60 border-y border-rbx-border/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Why RBX"
          title="WHY RBX"
          highlightText="GAMING CAFE?"
          subtitle="Built for gamers who demand high performance, ultra-smooth 300Hz displays, and non-stop 24/7 access."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl glass-panel relative overflow-hidden group hover:border-rbx-red/40 hover:-translate-y-1.5 transition-all duration-300 ${
                idx === 4 ? 'md:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-rbx-dark-800 border border-white/10 flex items-center justify-center mb-5 group-hover:bg-rbx-red/10 group-hover:border-rbx-red/30 transition-colors">
                {feat.icon}
              </div>

              <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide mb-2.5 group-hover:text-rbx-red transition-colors">
                {feat.title}
              </h3>

              <p className="text-sm text-rbx-dark-300 leading-relaxed">
                {feat.description}
              </p>

              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-white/[0.03] to-transparent pointer-events-none rounded-bl-full" />
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 p-5 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex flex-wrap items-center justify-around gap-6 text-xs text-rbx-dark-300">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>NVIDIA RTX 5060 Graphics</span>
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-4 h-4 text-cyan-400" />
            <span>300Hz Gaming Monitors</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OPEN 24/7 (24 Hours Every Day)</span>
          </div>
        </div>
      </div>
    </section>
  );
};
