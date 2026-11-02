import React from 'react';
import { Camera, ArrowRight, Eye } from 'lucide-react';
import { galleryData } from '../../data/galleryData';
import { SectionHeading } from '../common/SectionHeading';
import { Button } from '../common/Button';

interface GalleryPreviewSectionProps {
  onNavigate: (page: string) => void;
  onOpenLightbox?: (index: number) => void;
}

export const GalleryPreviewSection: React.FC<GalleryPreviewSectionProps> = ({ onNavigate, onOpenLightbox }) => {
  const previewItems = galleryData.slice(0, 6);

  return (
    <section className="py-20 lg:py-28 bg-rbx-dark-900/60 border-t border-rbx-border/60 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Cafe Tour"
          title="INSIDE"
          highlightText="RBX GAMING"
          subtitle="Take a look at our RTX 5060 gaming setups, 300Hz monitors, premium PS5 lounge, and esports arena in Ahmedabad."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onOpenLightbox ? onOpenLightbox(idx) : onNavigate('gallery')}
              className="group relative rounded-2xl overflow-hidden glass-panel border-rbx-border h-64 sm:h-72 cursor-pointer transition-all duration-500 hover:border-rbx-red/50 hover:shadow-glow-red hover:-translate-y-1"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rbx-bg via-rbx-bg/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />

              {/* View Overlay Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-4 h-4 text-rbx-red" />
              </div>

              {/* Text Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <span className="text-[10px] font-bold uppercase tracking-widest text-rbx-red block mb-1">
                  {item.category.toUpperCase()} ZONE
                </span>
                <h4 className="text-base font-bold text-white font-display uppercase tracking-wide leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-rbx-dark-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            variant="secondary"
            size="md"
            icon={<Camera className="w-4 h-4" />}
            onClick={() => onNavigate('gallery')}
          >
            VIEW FULL PHOTO GALLERY
          </Button>
        </div>

      </div>
    </section>
  );
};
