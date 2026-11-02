import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { GamingOptionsSection } from '../components/home/GamingOptionsSection';
import { WhyRBXSection } from '../components/home/WhyRBXSection';
import { ExperienceSection } from '../components/home/ExperienceSection';
import { PopularGamesSection } from '../components/home/PopularGamesSection';
import { OffersSection } from '../components/home/OffersSection';
import { RacingCockpitPreview } from '../components/home/RacingCockpitPreview';
import { EsportsPreviewSection } from '../components/home/EsportsPreviewSection';
import { GalleryPreviewSection } from '../components/home/GalleryPreviewSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { LocationSection } from '../components/home/LocationSection';
import { CTASection } from '../components/home/CTASection';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onRegisterTournament?: (tournamentId: string) => void;
  onOpenGalleryLightbox?: (index: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onRegisterTournament,
  onOpenGalleryLightbox,
}) => {
  return (
    <div className="space-y-0">
      <HeroSection onNavigate={onNavigate} />
      <GamingOptionsSection onNavigate={onNavigate} />
      <WhyRBXSection />
      <ExperienceSection onNavigate={onNavigate} />
      <PopularGamesSection onSelectGame={() => onNavigate('booking')} />
      <OffersSection onNavigate={onNavigate} />
      <RacingCockpitPreview />
      <EsportsPreviewSection onNavigate={onNavigate} onRegisterClick={onRegisterTournament} />
      <GalleryPreviewSection onNavigate={onNavigate} onOpenLightbox={onOpenGalleryLightbox} />
      <TestimonialsSection />
      <LocationSection />
      <CTASection onNavigate={onNavigate} />
    </div>
  );
};
