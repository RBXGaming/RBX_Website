import React from 'react';
import { Star, CheckCircle2, MessageSquareQuote, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { reviewsData } from '../../data/reviewsData';
import { SectionHeading } from '../common/SectionHeading';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 lg:py-28 bg-rbx-bg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Player Reviews"
          title="WHAT GAMERS"
          highlightText="SAY"
          subtitle="Trusted by casual squads, competitive ranked grinders, and college esports champions across Ahmedabad."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviewsData.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl glass-panel border-rbx-border flex flex-col justify-between hover:border-rbx-red/40 hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                {/* Rating Stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-rbx-red/40" />
                </div>

                <p className="text-xs sm:text-sm text-rbx-dark-200 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-3">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-rbx-red/40"
                  loading="lazy"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h5 className="text-sm font-bold text-white">{rev.name}</h5>
                    {rev.verified && (
                      <span title="Verified Gamer" className="inline-flex">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-rbx-dark-400">
                    Plays <span className="text-rbx-red font-semibold">{rev.gamePlayed}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews Callout */}
        <div className="mt-12 text-center flex flex-col sm:flex-row items-center justify-center gap-3 text-xs sm:text-sm text-rbx-dark-300">
          <div className="flex items-center gap-1 text-amber-400 font-bold">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>4.9 / 5.0 Rating</span>
          </div>
          <span className="hidden sm:inline">•</span>
          <span>Based on verified local player reviews in Gota, Ahmedabad</span>
          <span className="hidden sm:inline">•</span>
          <a
            href={siteConfig.contact.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-rbx-red font-bold flex items-center gap-1 underline underline-offset-4"
          >
            <span>Review on Google</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-rbx-red" />
          </a>
        </div>

      </div>
    </section>
  );
};
