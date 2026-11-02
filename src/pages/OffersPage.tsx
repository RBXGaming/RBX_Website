import React from 'react';
import { Tag, Clock, Calendar, ArrowRight, Gift } from 'lucide-react';
import { offersData } from '../data/offersData';
import { siteConfig } from '../config/siteConfig';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';

interface OffersPageProps {
  onNavigate: (page: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-glow-subtle">
            <Clock className="w-3.5 h-3.5" />
            <span>OPEN 24/7 • VALID EVERY DAY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            CURRENT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              OFFERS & DEALS
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            Get more value from your gaming sessions. Transparent rates for PC (₹100/hr) and PS5 (Single ₹120/hr, Multi ₹100/hr).
          </p>
        </div>

        {/* ACTIVE OFFERS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          {offersData.map((offer) => (
            <div
              key={offer.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                offer.highlight
                  ? 'glass-panel-red border-rbx-red/50 shadow-glow-red'
                  : 'glass-panel border-rbx-border hover:border-rbx-red/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rbx-red text-white shadow-glow-subtle">
                    {offer.badge}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    {offer.discountText}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide">
                  {offer.title}
                </h3>

                <div className="mt-2 text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-300">
                  {offer.tagline}
                </div>

                <p className="mt-4 text-sm text-rbx-dark-200 leading-relaxed">
                  {offer.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-rbx-dark-300">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>{offer.validity}</span>
                </div>

                <Button
                  variant={offer.highlight ? 'primary' : 'secondary'}
                  size="md"
                  icon={<Calendar className="w-4 h-4" />}
                  onClick={() => onNavigate('booking')}
                >
                  CLAIM & BOOK
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Link Callout */}
        <div className="p-8 rounded-3xl glass-panel border-rbx-border max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-rbx-dark-900 via-rbx-card to-rbx-dark-900">
          <div>
            <h3 className="text-xl font-bold text-white font-display uppercase">Looking for standard hourly rates?</h3>
            <p className="text-xs text-rbx-dark-300 mt-1">PC Gaming is ₹100/hr (RTX 5060, 300Hz), PS5 Single is ₹120/hr, PS5 Multi is ₹100/hr. Open 24/7.</p>
          </div>

          <Button
            variant="primary"
            size="md"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            onClick={() => onNavigate('pricing')}
            className="shrink-0"
          >
            VIEW PRICING
          </Button>
        </div>

      </div>
    </div>
  );
};
