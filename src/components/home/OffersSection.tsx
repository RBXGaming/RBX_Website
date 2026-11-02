import React from 'react';
import { Calendar, Tag, Clock, ArrowRight } from 'lucide-react';
import { offersData } from '../../data/offersData';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

interface OffersSectionProps {
  onNavigate: (page: string) => void;
}

export const OffersSection: React.FC<OffersSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 lg:py-28 bg-rbx-bg relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-rbx-red/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeading
          badge="Special Deals"
          title="CURRENT"
          highlightText="OFFERS"
          subtitle="Enjoy our high-value gaming deals. Play more, level up your game, and make every session count."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {offersData.map((offer) => (
            <div
              key={offer.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                offer.highlight
                  ? 'glass-panel-red shadow-glow-red border-rbx-red/40 hover:border-rbx-red'
                  : 'glass-panel border-rbx-border hover:border-rbx-red/40 hover:-translate-y-1'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rbx-red text-white shadow-glow-subtle">
                    {offer.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                    <Tag className="w-3.5 h-3.5" />
                    <span>{offer.discountText}</span>
                  </div>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-wide leading-tight">
                  {offer.title}
                </h3>

                <div className="inline-block mt-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-300">
                  {offer.tagline}
                </div>

                <p className="mt-4 text-sm text-rbx-dark-200 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-rbx-dark-300">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{offer.validity}</span>
                </div>

                <Button
                  variant={offer.highlight ? 'primary' : 'secondary'}
                  size="md"
                  icon={<Calendar className="w-4 h-4" />}
                  onClick={() => onNavigate('booking')}
                  className="sm:w-auto w-full"
                >
                  BOOK NOW
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Pricing Callout */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('pricing')}
          >
            VIEW ALL PRICING & OPTIONS
          </Button>
        </div>

      </div>
    </section>
  );
};
