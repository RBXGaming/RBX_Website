import React from 'react';
import { Calendar, MessageSquare, Phone } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../../config/siteConfig';
import { Button } from '../common/Button';

interface CTASectionProps {
  onNavigate: (page: string) => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-rbx-bg relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl p-8 sm:p-14 overflow-hidden border border-rbx-red/40 bg-gradient-to-r from-rbx-card via-rbx-dark-800 to-rbx-card shadow-glow-red text-center">
          
          {/* Subtle glowing orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-rbx-red/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-rbx-red text-white shadow-glow-subtle inline-block">
              READY TO DROP IN?
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white font-display uppercase tracking-tight leading-tight">
              RESERVE YOUR RIG OR COUCH TODAY.
            </h2>

            <p className="text-base sm:text-lg text-rbx-dark-200 leading-relaxed">
              Don't wait in line on busy weekends. Lock in your gaming station online or drop us a quick WhatsApp message to hold your spot.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                icon={<Calendar className="w-5 h-5" />}
                onClick={() => onNavigate('booking')}
                className="w-full sm:w-auto px-8"
              >
                BOOK YOUR SESSION ONLINE
              </Button>

              <a
                href={getWhatsAppUrl("Hi RBX Gaming Cafe! I want to book a gaming session.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm border border-emerald-400/30 transition-all shadow-lg shadow-emerald-900/40"
              >
                <MessageSquare className="w-4 h-4" />
                <span>BOOK ON WHATSAPP</span>
              </a>
            </div>

            <div className="pt-2 flex items-center justify-center gap-4 text-xs text-rbx-dark-400">
              <span>Instant Confirmation</span>
              <span>•</span>
              <span>No Advance Payment Required</span>
              <span>•</span>
              <a href={`tel:${siteConfig.contact.phone}`} className="text-white hover:text-rbx-red flex items-center gap-1 font-semibold">
                <Phone className="w-3.5 h-3.5 text-rbx-red" />
                <span>Call {siteConfig.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
