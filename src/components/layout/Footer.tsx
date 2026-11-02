import React from 'react';
import { Gamepad2, MapPin, Phone, MessageSquare, Clock, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../../config/siteConfig';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'gaming', label: 'PC & PS5 Gaming' },
    { id: 'pricing', label: 'Pricing (PC & PS5)' },
    { id: 'offers', label: 'Offers' },
    { id: 'esports', label: 'Esports Tournaments' },
    { id: 'gallery', label: 'Photo Gallery' },
    { id: 'contact', label: 'Contact & Location' },
  ];

  const handleLinkClick = (pageId: string) => {
    onNavigate(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-rbx-dark-900 border-t border-rbx-border/80 pt-16 pb-24 lg:pb-16 overflow-hidden">
      {/* Subtle background red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-rbx-red/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-rbx-border/60">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/images/rbx-gaming-cafe-logo.png"
                alt="RBX Gaming Cafe"
                className="h-14 w-auto object-contain"
              />
              <span className="text-lg font-bold tracking-wide text-white whitespace-nowrap">
                {siteConfig.name.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-rbx-dark-300 leading-relaxed">
              Ahmedabad's premier 24/7 gaming destination. NVIDIA RTX 5060 gaming PCs with 300Hz gaming monitors, PS5 single & multiplayer lounges, and esports events.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rbx-red/15 text-rbx-red border border-rbx-red/30 hover:bg-rbx-red hover:text-white transition-all text-xs font-bold"
              >
                <Phone className="w-4 h-4" />
                <span>Call Us</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rbx-red mb-4 font-display">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => handleLinkClick(link.id)}
                    className="text-sm text-rbx-dark-300 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span className="text-rbx-red text-xs">›</span>
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Timings & Rates */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rbx-red mb-4 font-display">
              Hours & Rates
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3.5 rounded-xl bg-rbx-card border border-rbx-border">
                <div className="flex items-center gap-2 text-white font-semibold text-xs uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Opening Hours</span>
                </div>
                <p className="text-white font-black text-sm">
                  OPEN 24/7
                </p>
                <p className="text-rbx-dark-300 text-xs mt-0.5">
                  Open 24 Hours • Every Day
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-rbx-card border border-rbx-border space-y-1">
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-rbx-dark-300">PC Gaming:</span>
                  <span className="text-white font-bold">₹100 / hr</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-rbx-dark-300">PS5 Single Player:</span>
                  <span className="text-white font-bold">₹120 / hr</span>
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="text-rbx-dark-300">PS5 Multiplayer:</span>
                  <span className="text-emerald-400 font-bold">₹100 / hr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Location in Ahmedabad */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-rbx-red mb-4 font-display">
              Find RBX Cafe
            </h3>
            <div className="space-y-3 text-sm text-rbx-dark-300">
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group hover:text-white transition-colors"
              >
                <MapPin className="w-5 h-5 text-rbx-red shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <p className="text-xs leading-relaxed text-rbx-dark-200 group-hover:text-white transition-colors">
                  <strong className="text-white block font-semibold group-hover:text-rbx-red transition-colors">RBX Gaming Cafe</strong>
                  115, First Floor, Rudram Icon,<br />
                  Opp. Lambda House, Near Silver Oak University,<br />
                  Gota, Ahmedabad, Gujarat – 382481
                </p>
              </a>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-rbx-red shrink-0" />
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="text-xs text-white font-semibold hover:text-rbx-red transition-colors"
                >
                  +91 {siteConfig.contact.phone}
                </a>
              </div>

              <div className="pt-2">
                <a
                  href={siteConfig.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rbx-dark-700 hover:bg-rbx-dark-600 text-white text-xs font-bold border border-white/10 hover:border-rbx-red/40 transition-all w-full justify-center group"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-rbx-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-rbx-dark-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>© {new Date().getFullYear()} {siteConfig.name}. Open 24/7 in Gota, Ahmedabad.</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            <button onClick={() => handleLinkClick('pricing')} className="hover:text-white transition-colors cursor-pointer">
              Pricing
            </button>
            <span>•</span>
            <button onClick={() => handleLinkClick('contact')} className="hover:text-white transition-colors cursor-pointer">
              Location
            </button>
            <span>•</span>
            <button onClick={() => handleLinkClick('track')} className="hover:text-emerald-400 transition-colors cursor-pointer">
              Track Slot
            </button>
            <span>•</span>
            <button onClick={() => handleLinkClick('booking')} className="text-rbx-red font-bold hover:underline cursor-pointer">
              Book Session
            </button>
            <span>•</span>
            <button onClick={() => handleLinkClick('admin')} className="text-rbx-dark-400 hover:text-white transition-colors cursor-pointer text-[11px]">
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
