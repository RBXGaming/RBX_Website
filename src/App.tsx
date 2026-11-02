import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { MobileStickyBar } from './components/layout/MobileStickyBar';
import { Toast } from './components/common/Toast';
import { ToastMessage, TournamentItem, CustomerProfile } from './types';
import { tournamentsData } from './data/tournamentsData';
import { TournamentRegisterModal } from './components/tournaments/TournamentRegisterModal';
import { LightboxModal } from './components/gallery/LightboxModal';
import { galleryData } from './data/galleryData';

// Customer OTP auth
import { CustomerAuthModal } from './components/auth/CustomerAuthModal';
import { getCurrentCustomer, subscribeToCustomerAuth } from './lib/customerService';

// Pages
import { HomePage } from './pages/HomePage';
import { GamingPage } from './pages/GamingPage';
import { PricingPage } from './pages/PricingPage';
import { BookingPage } from './pages/BookingPage';
import { BookingStatusPage } from './pages/BookingStatusPage';
import { AdminPage } from './pages/AdminPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { OffersPage } from './pages/OffersPage';
import { EsportsPage } from './pages/EsportsPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';

const parseCurrentRoute = (): string => {
  // 1. Check pathname (e.g. /admin, /booking, /track, /pricing)
  const pathname = window.location.pathname.replace(/^\/+|\/+$/g, '').toLowerCase().split('?')[0];
  // 2. Check hash fallback (e.g. #admin, #booking)
  const hash = window.location.hash.replace(/^#/, '').toLowerCase().split('?')[0];

  const target = pathname || hash || 'home';

  const validRoutes = [
    'home',
    'gaming',
    'pricing',
    'booking',
    'offers',
    'esports',
    'gallery',
    'contact',
    'track',
    'account',
    'admin',
  ];

  if (validRoutes.includes(target)) {
    return target;
  }
  if (target === 'tournaments') return 'esports';
  if (target === 'games') return 'gaming';
  if (target === 'membership') return 'offers';
  if (target === 'about') return 'contact';

  return 'home';
};

export function App() {
  const [currentPage, setCurrentPage] = useState<string>(parseCurrentRoute);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<TournamentItem | null>(null);
  const [galleryLightboxIndex, setGalleryLightboxIndex] = useState<number>(-1);

  // Customer OTP session state
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<string | null>(null);

  // Restore persistent Supabase session on load
  useEffect(() => {
    getCurrentCustomer().then((profile) => {
      if (profile) setCustomer(profile);
    });
  }, []);

  // Keep the customer session in sync with Supabase auth events
  useEffect(() => {
    return subscribeToCustomerAuth((profile) => setCustomer(profile));
  }, []);

  const handlePromptLogin = useCallback(
    (reason: string) => {
      setPendingAuthAction(reason);
      setAuthModalOpen(true);
    },
    []
  );

  const handleAuthSuccess = useCallback((profile: CustomerProfile) => {
    setCustomer(profile);
    setAuthModalOpen(false);
  }, []);

  const handleAuthClose = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  // Sync pathname and hash changes with current page
  useEffect(() => {
    const handleLocationChange = () => {
      const route = parseCurrentRoute();
      setCurrentPage(route);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    const targetPath = page === 'home' ? '/' : `/${page}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleRegisterTournamentFromHome = (tournamentId: string) => {
    const tourney = tournamentsData.find((t) => t.id === tournamentId) || tournamentsData[0];
    setSelectedTournament(tourney);
  };

  // Coordinates "BOOK NOW" clicks across the site: guests are asked to log in first.
  const handleBookingNavigation = useCallback((): void => {
    if (customer) {
      handleNavigate('booking');
    } else {
      handlePromptLogin('login-before-booking');
    }
  }, [customer, handleNavigate, handlePromptLogin]);

  return (
    <div className="min-h-screen bg-rbx-bg text-rbx-dark-100 flex flex-col justify-between selection:bg-rbx-red selection:text-white relative">
      {/* Sticky Glass Navbar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        customer={customer}
        onLoginRequest={() => handlePromptLogin('navbar-login')}
        onAccountClick={() => handleNavigate('account')}
        onBookingClick={handleBookingNavigation}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onNavigate={handleNavigate}
            onRegisterTournament={handleRegisterTournamentFromHome}
            onOpenGalleryLightbox={(idx) => setGalleryLightboxIndex(idx)}
          />
        )}
        {currentPage === 'gaming' && <GamingPage onNavigate={handleNavigate} />}
        {currentPage === 'pricing' && <PricingPage onNavigate={handleNavigate} />}
        {currentPage === 'booking' && (
          <BookingPage
            onToast={addToast}
            onNavigate={handleNavigate}
            customer={customer}
            onLoginRequest={() => handlePromptLogin('booking-page-login')}
          />
        )}
        {currentPage === 'track' && (
          <BookingStatusPage onNavigate={handleNavigate} onToast={addToast} />
        )}
        {currentPage === 'account' && (
          <MyBookingsPage
            customer={customer}
            onLoginRequest={() => handlePromptLogin('account-login')}
            onNavigate={handleNavigate}
            onCustomerLoggedOut={() => setCustomer(null)}
            onToast={addToast}
          />
        )}
        {currentPage === 'admin' && <AdminPage onNavigate={handleNavigate} onToast={addToast} />}
        {currentPage === 'offers' && <OffersPage onNavigate={handleNavigate} />}
        {currentPage === 'esports' && <EsportsPage onNavigate={handleNavigate} onToast={addToast} />}
        {currentPage === 'gallery' && <GalleryPage />}
        {currentPage === 'contact' && <ContactPage onToast={addToast} />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Floating Action Bar */}
      <MobileStickyBar onNavigate={handleNavigate} onBookingClick={handleBookingNavigation} />

      {/* Global Toast Notifications Stack */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Global Customer OTP Auth Modal */}
      <CustomerAuthModal
        isOpen={authModalOpen}
        onClose={handleAuthClose}
        onAuthenticated={(profile, isNewUser) => {
          handleAuthSuccess(profile);
          if (isNewUser) {
            addToast('success', 'Profile Created', `Welcome, ${profile.name}! Your account is ready.`);
          } else {
            addToast('success', 'Logged In', `Welcome back, ${profile.name || 'guest'}!`);
          }
          // If the user clicked BOOK NOW as a guest, continue to the booking page now that they're logged in.
          if (pendingAuthAction === 'login-before-booking') {
            handleNavigate('booking');
          }
          setPendingAuthAction(null);
        }}
      />

      {/* Global Tournament Modal */}
      {selectedTournament && (
        <TournamentRegisterModal
          isOpen={!!selectedTournament}
          tournament={selectedTournament}
          onClose={() => setSelectedTournament(null)}
          onSuccess={(tName) => {
            addToast('success', 'Squad Registered!', `Team "${tName}" registered successfully for ${selectedTournament.title}.`);
          }}
        />
      )}

      {/* Global Gallery Lightbox Modal from Homepage */}
      {galleryLightboxIndex >= 0 && (
        <LightboxModal
          isOpen={galleryLightboxIndex >= 0}
          currentIndex={galleryLightboxIndex}
          items={galleryData}
          onClose={() => setGalleryLightboxIndex(-1)}
          onNext={() => setGalleryLightboxIndex((prev) => (prev + 1) % galleryData.length)}
          onPrev={() => setGalleryLightboxIndex((prev) => (prev - 1 + galleryData.length) % galleryData.length)}
        />
      )}
    </div>
  );
}

export default App;
