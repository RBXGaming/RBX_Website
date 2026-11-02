import React from 'react';
import { Phone, MessageSquare, Calendar } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../../config/siteConfig';

interface MobileStickyBarProps {
  onNavigate: (page: string) => void;
  onBookingClick?: () => void;
}

export const MobileStickyBar: React.FC<MobileStickyBarProps> = ({ onNavigate, onBookingClick }) => {
  const handleBookNow = () => {
    if (onBookingClick) {
      onBookingClick();
    } else {
      onNavigate('booking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-rbx-bg/95 backdrop-blur-xl border-t border-rbx-border/80 px-3 py-2 shadow-2xl safe-area-bottom">
      <div className="flex items-center gap-2 max-w-md mx-auto">
        <a
          href={`tel:${siteConfig.contact.phone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rbx-dark-700 text-white text-xs font-bold border border-white/10 active:scale-95 transition-all"
          aria-label="Call RBX Cafe"
        >
          <Phone className="w-4 h-4 text-rbx-red" />
          <span>Call</span>
        </a>

        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600/90 text-white text-xs font-bold border border-emerald-400/30 active:scale-95 transition-all"
          aria-label="WhatsApp RBX Cafe"
        >
          <MessageSquare className="w-4 h-4" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={handleBookNow}
          className="flex-[1.5] flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rbx-red text-white text-xs font-bold shadow-glow-subtle border border-red-400/40 active:scale-95 transition-all cursor-pointer"
          aria-label="Book Gaming Session"
        >
          <Calendar className="w-4 h-4" />
          <span>BOOK NOW</span>
        </button>
      </div>
    </div>
  );
};
