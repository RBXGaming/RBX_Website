import React from 'react';
import { MapPin, Phone, MessageSquare, Clock, ArrowUpRight, Navigation, Sparkles } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../../config/siteConfig';
import { SectionHeading } from '../common/SectionHeading';

export const LocationSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-rbx-dark-900/80 border-t border-rbx-border/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Visit Our Venue"
          title="FIND RBX"
          highlightText="GAMING CAFE"
          subtitle="Located in Gota, Ahmedabad, directly opposite Lambda House and minutes from Silver Oak University. Open 24/7."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Info Card */}
          <div className="lg:col-span-6 p-8 sm:p-10 rounded-3xl glass-panel border-rbx-border flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Address Highlight */}
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group transition-transform duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-rbx-red/15 text-rbx-red flex items-center justify-center shrink-0 border border-rbx-red/30 group-hover:bg-rbx-red group-hover:text-white transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-rbx-red font-display mb-1 flex items-center gap-1">
                    <span>Address & Landmark</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-base font-black text-white group-hover:text-rbx-red transition-colors leading-snug">
                    RBX Gaming Cafe
                  </p>
                  <p className="text-sm font-bold text-white leading-snug">
                    115, First Floor, Rudram Icon,
                  </p>
                  <p className="text-sm text-rbx-dark-200 mt-0.5 leading-relaxed group-hover:text-rbx-dark-100 transition-colors">
                    Opp. Lambda House, Near Silver Oak University,<br />
                    Gota, Ahmedabad, Gujarat – 382481
                  </p>
                </div>
              </a>

              {/* Phone Highlight */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/30">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 font-display mb-1">
                    Direct Phone Line
                  </h4>
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="text-xl sm:text-2xl font-black text-white hover:text-rbx-red transition-colors font-display tracking-wide"
                  >
                    +91 {siteConfig.contact.phone}
                  </a>
                  <p className="text-xs text-rbx-dark-300 mt-0.5">
                    Call anytime 24/7 for seat availability & bookings
                  </p>
                </div>
              </div>

              {/* Timings Highlight */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-display mb-1">
                    Opening Hours
                  </h4>
                  <p className="text-xl font-black text-white font-display">
                    OPEN 24/7
                  </p>
                  <p className="text-xs text-rbx-dark-300 mt-0.5">
                    Open 24 Hours • Every Day (7 Days a Week)
                  </p>
                </div>
              </div>

            </div>

            {/* Quick Action Button Bar */}
            <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rbx-red text-white text-xs font-bold shadow-glow-subtle hover:bg-rbx-red-hover transition-all"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions</span>
              </a>

              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rbx-dark-700 text-white text-xs font-bold border border-white/10 hover:bg-rbx-dark-600 transition-all"
              >
                <Phone className="w-4 h-4 text-rbx-red" />
                <span>Call Now</span>
              </a>

              <a
                href={getWhatsAppUrl("Hi RBX Gaming Cafe, I want to visit / book a gaming session.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 text-white text-xs font-bold border border-emerald-400/30 hover:bg-emerald-500 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>

          </div>

          {/* Right Visual Card with Directions & Campus Proximity */}
          <div className="lg:col-span-6 rounded-3xl glass-panel border-rbx-border overflow-hidden flex flex-col justify-between p-8 sm:p-10 relative">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                <Clock className="w-3.5 h-3.5" />
                <span>Open 24 Hours Every Day</span>
              </div>

              <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide">
                PRIME LOCATION IN GOTA, AHMEDABAD
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-rbx-dark-200 pt-2">
                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5 flex items-center justify-between">
                  <span className="font-semibold text-white">Silver Oak University Campus</span>
                  <span className="text-emerald-400 font-bold">2 Min Walk</span>
                </div>
                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5 flex items-center justify-between">
                  <span className="font-semibold text-white">Gota Chokdi & SG Highway</span>
                  <span className="text-emerald-400 font-bold">4 Min Drive</span>
                </div>
                <div className="p-3.5 rounded-xl bg-rbx-dark-800/80 border border-white/5 flex items-center justify-between">
                  <span className="font-semibold text-white">Nirma University / Chandlodiya</span>
                  <span className="text-emerald-400 font-bold">8-10 Min Drive</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 rounded-xl bg-rbx-dark-700 hover:bg-rbx-dark-600 border border-white/10 hover:border-rbx-red/40 flex items-center justify-center gap-2 text-sm font-bold text-white transition-all group"
              >
                <span>OPEN IN GOOGLE MAPS</span>
                <ArrowUpRight className="w-4 h-4 text-rbx-red group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
