import React, { useState } from 'react';
import { Camera, Eye, Filter } from 'lucide-react';
import { galleryData } from '../data/galleryData';
import { SectionHeading } from '../components/common/SectionHeading';
import { LightboxModal } from '../components/gallery/LightboxModal';

export const GalleryPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'pc', label: 'PC Battle Rigs' },
    { id: 'ps5', label: 'PS5 Gaming Lounge' },
    { id: 'arena', label: 'LAN Arena' },
    { id: 'cafe', label: 'Cafe & Drinks' },
    { id: 'events', label: 'Tournaments' },
  ];

  const filteredItems = galleryData.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rbx-red/10 text-rbx-red border border-rbx-red/30 mb-4 shadow-glow-subtle">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Showcase</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            RBX PHOTO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              GALLERY
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            A glimpse inside our premium gaming lounges, competitive 5v5 setups, and high-energy community tournaments in Ahmedabad.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-6 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-rbx-red text-white shadow-glow-subtle'
                  : 'bg-rbx-dark-800 text-rbx-dark-300 hover:text-white hover:bg-rbx-dark-700 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => handleOpenLightbox(idx)}
              className="group relative rounded-3xl overflow-hidden glass-panel border-rbx-border h-72 sm:h-80 cursor-pointer transition-all duration-500 hover:border-rbx-red/50 hover:shadow-glow-red hover:-translate-y-1.5"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rbx-bg via-rbx-bg/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity" />

              {/* View Overlay Icon */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-5 h-5 text-rbx-red" />
              </div>

              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rbx-dark-900/90 text-white border border-white/10 backdrop-blur-md">
                  {item.category.toUpperCase()}
                </span>
              </div>

              {/* Text Bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-1 group-hover:translate-y-0 transition-transform">
                <h4 className="text-lg font-bold text-white font-display uppercase tracking-wide leading-tight">
                  {item.title}
                </h4>
                <p className="text-xs text-rbx-dark-300 mt-1 leading-relaxed line-clamp-2">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {lightboxIndex >= 0 && (
        <LightboxModal
          isOpen={lightboxIndex >= 0}
          currentIndex={lightboxIndex}
          items={filteredItems}
          onClose={() => setLightboxIndex(-1)}
          onNext={() => setLightboxIndex((prev) => (prev + 1) % filteredItems.length)}
          onPrev={() => setLightboxIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)}
        />
      )}
    </div>
  );
};
