import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../../types';

interface LightboxModalProps {
  isOpen: boolean;
  currentIndex: number;
  items: GalleryItem[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  currentIndex,
  items,
  onClose,
  onNext,
  onPrev,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
        <div className="px-3 py-1 rounded-full bg-rbx-dark-800/90 text-white text-xs font-bold border border-white/10">
          {currentIndex + 1} / {items.length} • {currentItem.category.toUpperCase()}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-rbx-dark-800 text-white hover:bg-rbx-red transition-colors border border-white/10"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev Button */}
      <button
        onClick={onPrev}
        className="absolute left-4 p-3 rounded-full bg-rbx-dark-800/80 hover:bg-rbx-red text-white transition-all border border-white/10 z-20 cursor-pointer"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next Button */}
      <button
        onClick={onNext}
        className="absolute right-4 p-3 rounded-full bg-rbx-dark-800/80 hover:bg-rbx-red text-white transition-all border border-white/10 z-20 cursor-pointer"
        aria-label="Next image"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image Container */}
      <div className="max-w-5xl max-h-[85vh] flex flex-col items-center justify-center relative z-10 animate-fade-in">
        <img
          src={currentItem.image}
          alt={currentItem.title}
          className="max-h-[70vh] w-auto max-w-full rounded-2xl object-contain border border-rbx-border shadow-2xl"
        />

        <div className="mt-4 text-center max-w-xl">
          <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-wide">
            {currentItem.title}
          </h3>
          <p className="text-xs sm:text-sm text-rbx-dark-300 mt-1">
            {currentItem.caption}
          </p>
        </div>
      </div>
    </div>
  );
};
