import React from 'react';
import { Monitor, Gamepad2, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

interface GamingOptionsSectionProps {
  onNavigate: (page: string) => void;
}

export const GamingOptionsSection: React.FC<GamingOptionsSectionProps> = ({ onNavigate }) => {
  const options = [
    {
      id: 'pc',
      icon: <Monitor className="w-7 h-7 text-rbx-red" />,
      title: 'PC GAMING',
      badge: 'RTX 5060 • 300Hz',
      rate: '₹100 / Person / Hour',
      description: 'High-performance gaming setup with NVIDIA RTX 5060 and 300Hz gaming monitors for competitive precision.',
      features: [
        'High-performance gaming PCs (NVIDIA RTX 5060)',
        'Competitive gaming setup (300Hz Gaming Monitors)',
        'Popular esports titles pre-installed & updated',
        'Comfortable gaming stations with ergonomic seating',
      ],
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      ctaText: 'VIEW PC GAMING',
      targetPage: 'gaming',
    },
    {
      id: 'ps5',
      icon: <Gamepad2 className="w-7 h-7 text-blue-400" />,
      title: 'PS5 GAMING',
      badge: 'Single & Multiplayer',
      rate: 'Single ₹120/hr • Multi ₹100/hr',
      description: 'Premium PS5 gaming experience with comfortable setup, latest popular games, and couch co-op.',
      features: [
        'Premium PS5 gaming experience',
        'Single Player (₹120/hr) & Multiplayer (₹100/hr)',
        'Latest games: Spider-Man 2, Tekken 8, Mortal Kombat 1, FIFA 26',
        'Comfortable couch setup with multiple controllers',
      ],
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80',
      ctaText: 'VIEW PS5 GAMING',
      targetPage: 'gaming',
    },
    {
      id: 'esports',
      icon: <Trophy className="w-7 h-7 text-amber-400" />,
      title: 'ESPORTS',
      badge: 'LAN Events',
      rate: 'Open 24/7',
      description: 'Competitive arena built for team scrims, community tournaments, and esports brackets.',
      features: [
        'Gaming tournaments with structured brackets',
        'Organized LAN matches & tournaments',
        'Team competitions & squad practice sessions',
        'Community events for local Ahmedabad gamers',
      ],
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
      ctaText: 'VIEW EVENTS',
      targetPage: 'esports',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-rbx-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Gaming Options"
          title="CHOOSE YOUR"
          highlightText="SETUP"
          subtitle="Explore our verified NVIDIA RTX 5060 PC gaming rigs, PS5 single & multiplayer lounges, and esports events."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt) => (
            <div
              key={opt.id}
              className="group relative rounded-2xl glass-panel overflow-hidden flex flex-col justify-between border-rbx-border transition-all duration-500 hover:border-rbx-red/40 hover:-translate-y-2 hover:shadow-glow-red"
            >
              {/* Card Image Banner */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={opt.image}
                  alt={opt.title}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-90"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rbx-card via-rbx-card/60 to-transparent" />
                
                {/* Badge Top Left */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rbx-dark-900/90 text-white border border-white/10 backdrop-blur-md">
                    {opt.badge}
                  </span>
                </div>

                {/* Rate Top Right */}
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rbx-red text-white shadow-glow-subtle">
                    {opt.rate}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-rbx-dark-800 border border-white/5">
                      {opt.icon}
                    </div>
                    <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide">
                      {opt.title}
                    </h3>
                  </div>

                  <p className="text-sm text-rbx-dark-300 mb-6 leading-relaxed">
                    {opt.description}
                  </p>

                  <ul className="space-y-2.5 mb-8">
                    {opt.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-rbx-dark-200">
                        <CheckCircle2 className="w-4 h-4 text-rbx-red shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  fullWidth
                  variant="secondary"
                  size="md"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                  onClick={() => onNavigate(opt.targetPage)}
                  className="group-hover:bg-rbx-red group-hover:text-white group-hover:border-red-500/50 transition-all"
                >
                  {opt.ctaText}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
