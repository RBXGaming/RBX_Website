import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageSquare, Calendar, UserRound, LogIn, ChevronDown } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../../config/siteConfig';
import { Button } from '../common/Button';
import { CustomerProfile } from '../../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  customer?: CustomerProfile | null;
  onLoginRequest?: () => void;
  onAccountClick?: () => void;
  onBookingClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  customer,
  onLoginRequest,
  onAccountClick,
  onBookingClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBookNow = () => {
    if (onBookingClick) {
      onBookingClick();
    } else {
      handleNavClick('booking');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'offers', label: 'Offers' },
    { id: 'esports', label: 'Esports' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (pageId: string) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled
          ? 'py-3 bg-rbx-bg/90 backdrop-blur-xl border-b border-rbx-border/80 shadow-2xl'
          : 'py-5 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center group text-left focus:outline-none"
            aria-label="RBX Gaming Cafe Home"
          >
            <img
              src="/images/rbx-gaming-cafe-logo.png"
              alt="RBX Gaming Cafe"
              className="h-12 w-auto object-contain drop-shadow-lg group-hover:scale-105 transition-transform"
            />
            <span className="ml-3 text-lg font-bold tracking-wide text-white whitespace-nowrap">
              RBX GAMING CAFE
            </span>
          </button>
          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-rbx-dark-800/80 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${isActive
                    ? 'bg-rbx-red text-white shadow-glow-subtle'
                    : 'text-rbx-dark-200 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="p-2.5 rounded-xl bg-rbx-dark-700/80 text-rbx-dark-200 hover:text-white hover:bg-rbx-dark-600 border border-white/10 transition-colors"
              title="Call RBX Cafe"
              aria-label="Call RBX Cafe"
            >
              <Phone className="w-4 h-4 text-rbx-red" />
            </a>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-rbx-dark-700/80 text-rbx-dark-200 hover:text-white hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500/40 transition-colors"
              title="WhatsApp RBX"
              aria-label="WhatsApp RBX"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
            </a>

            {/* Customer Account / Login */}
            {customer ? (
              <button
                onClick={onAccountClick}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rbx-dark-700/90 hover:bg-rbx-dark-600 border border-white/10 text-rbx-dark-200 hover:text-white text-xs font-bold transition-colors cursor-pointer"
                title="My Account & Bookings"
              >
                <UserRound className="w-4 h-4 text-rbx-red" />
                <span className="max-w-[110px] truncate">{customer.name || customer.mobile_number}</span>
                <ChevronDown className="w-3.5 h-3.5 text-rbx-dark-400" />
              </button>
            ) : (
              <button
                onClick={onLoginRequest}
                className="p-2.5 rounded-xl bg-rbx-dark-700/80 text-rbx-dark-200 hover:text-white hover:bg-rbx-dark-600 border border-white/10 transition-colors"
                title="Customer Login (Mobile OTP)"
                aria-label="Customer Login"
              >
                <LogIn className="w-4 h-4 text-rbx-red" />
              </button>
            )}

            <Button
              size="sm"
              variant="primary"
              icon={<Calendar className="w-4 h-4" />}
              onClick={handleBookNow}
            >
              BOOK NOW
            </Button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-2">
            <Button
              size="sm"
              variant="primary"
              onClick={handleBookNow}
            >
              BOOK
            </Button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-rbx-dark-700 text-white border border-white/10 focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-between bg-rbx-bg/95 backdrop-blur-2xl px-6 py-8 animate-fade-in border-b border-rbx-border overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-6 border-b border-rbx-border">
              <div className="flex items-center gap-3">
                <img
                  src="/images/rbx-gaming-cafe-logo.png"
                  alt="RBX Gaming Cafe"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-rbx-dark-300 hover:text-white bg-rbx-dark-700/80"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`flex items-center justify-between px-5 py-3.5 rounded-xl text-base font-bold uppercase tracking-wider transition-all text-left ${isActive
                      ? 'bg-rbx-red text-white shadow-glow-subtle'
                      : 'text-rbx-dark-200 hover:text-white hover:bg-rbx-card'
                      }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="pt-8 border-t border-rbx-border flex flex-col gap-3">
            {/* Mobile Account / Login Access */}
            {customer ? (
              <button
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-rbx-dark-700 text-white text-sm font-bold border border-white/10 cursor-pointer"
              >
                <UserRound className="w-5 h-5 text-rbx-red" />
                <span className="truncate">{customer.name || customer.mobile_number}</span>
                <span className="ml-auto text-[10px] uppercase text-rbx-dark-300">My Bookings</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onLoginRequest?.();
                }}
                className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-rbx-dark-700 text-white text-sm font-bold border border-white/10 cursor-pointer"
              >
                <LogIn className="w-5 h-5 text-rbx-red" />
                <span>Customer Login</span>
              </button>
            )}

            <Button
              fullWidth
              size="lg"
              variant="primary"
              icon={<Calendar className="w-5 h-5" />}
              onClick={() => {
                setMobileMenuOpen(false);
                handleBookNow();
              }}
            >
              BOOK NOW
            </Button>

            <div className="grid grid-cols-2 gap-2 mt-1">
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rbx-dark-700 text-white font-semibold text-sm border border-white/10"
              >
                <Phone className="w-4 h-4 text-rbx-red" />
                <span>Call Now</span>
              </a>
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-700/80 text-white font-semibold text-sm border border-emerald-500/30"
              >
                <MessageSquare className="w-4 h-4 text-emerald-300" />
                <span>WhatsApp</span>
              </a>
            </div>

            <a
              href={siteConfig.contact.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-rbx-dark-400 hover:text-rbx-red transition-colors mt-2 block"
            >
              115, First Floor, Rudram Icon, Gota, Ahmedabad
            </a>
          </div>
        </div>
      )}
    </>
  );
};
