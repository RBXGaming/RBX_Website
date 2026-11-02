import React, { useState } from 'react';
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2, ChevronDown, ArrowUpRight } from 'lucide-react';
import { siteConfig, getWhatsAppUrl } from '../config/siteConfig';
import { faqsData } from '../data/faqsData';
import { SectionHeading } from '../components/common/SectionHeading';
import { Button } from '../components/common/Button';

interface ContactPageProps {
  onToast?: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onToast }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = 'Please enter your name';
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) newErrors.phone = 'Please enter a valid 10-digit number';
    if (!message.trim()) newErrors.message = 'Please enter your enquiry or message';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (onToast) onToast('error', 'Form Error', 'Please complete all required fields.');
      return;
    }

    setErrors({});
    setSubmitted(true);

    if (onToast) {
      onToast('success', 'Message Sent!', 'Thank you! The RBX team will get in touch with you shortly.');
    }
  };

  return (
    <div className="pt-24 pb-20 bg-rbx-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 mb-4 shadow-glow-subtle">
            <Clock className="w-3.5 h-3.5" />
            <span>OPEN 24/7 • 24 HOURS EVERY DAY</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white font-display uppercase tracking-tight">
            GET IN TOUCH WITH <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rbx-red to-red-400">
              RBX GAMING CAFE
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-rbx-dark-200">
            Have questions about RTX 5060 PC rigs, PS5 single or multiplayer gaming, or booking a session? Reach out 24/7.
          </p>
        </div>

        {/* Contact Info & Interactive Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-24">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Address */}
            <div className="p-6 rounded-3xl glass-panel border-rbx-border space-y-3">
              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rbx-red/20 text-rbx-red flex items-center justify-center border border-rbx-red/30 group-hover:bg-rbx-red group-hover:text-white transition-all">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rbx-red font-display">
                    Venue Address
                  </h4>
                  <span className="text-sm font-bold text-white group-hover:text-rbx-red transition-colors">
                    RBX Gaming Cafe
                  </span>
                </div>
              </a>

              <a
                href={siteConfig.contact.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-rbx-dark-200 hover:text-white leading-relaxed pt-1 transition-colors"
              >
                115, First Floor, Rudram Icon,<br />
                Opp. Lambda House, Near Silver Oak University,<br />
                Gota, Ahmedabad, Gujarat – 382481
              </a>

              <div className="pt-2">
                <a
                  href={siteConfig.contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-rbx-red hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Direct Phone & WhatsApp */}
            <div className="p-6 rounded-3xl glass-panel border-rbx-border space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400 font-display">
                      Direct Phone (24/7)
                    </h4>
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="text-lg font-black text-white hover:text-rbx-red transition-colors"
                    >
                      +91 {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-display">
                      WhatsApp Chat
                    </h4>
                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-6 rounded-3xl glass-panel border-rbx-border space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-display">
                    Opening Hours
                  </h4>
                  <span className="text-sm font-black text-white">OPEN 24/7</span>
                </div>
              </div>
              <p className="text-xs text-rbx-dark-300 pt-1">
                Open 24 hours a day, 7 days a week, every single day.
              </p>
            </div>

          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl glass-panel border-rbx-border">
            <h3 className="text-2xl font-black text-white font-display uppercase tracking-wide mb-2">
              SEND US A MESSAGE
            </h3>
            <p className="text-xs text-rbx-dark-300 mb-6">
              Fill out this form and our team will reach back out to you on phone or WhatsApp.
            </p>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-white font-display uppercase">
                  MESSAGE RECEIVED!
                </h4>
                <p className="text-xs text-rbx-dark-300 max-w-sm mx-auto">
                  Thank you, <strong>{name}</strong>. We will review your message and contact you on <strong>{phone}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setName(''); setPhone(''); setMessage(''); }}
                  className="text-xs text-rbx-red font-bold hover:underline pt-2"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                    Your Name <span className="text-rbx-red">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Yash Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                  />
                  {errors.name && <span className="text-xs text-rbx-red mt-1 block">{errors.name}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                      Mobile Number <span className="text-rbx-red">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                    />
                    {errors.phone && <span className="text-xs text-rbx-red mt-1 block">{errors.phone}</span>}
                  </div>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. gamer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                    Your Message / Inquiry <span className="text-rbx-red">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ask about slot availability, gaming setups, or group bookings..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                  />
                  {errors.message && <span className="text-xs text-rbx-red mt-1 block">{errors.message}</span>}
                </div>

                <div className="pt-2">
                  <Button
                    fullWidth
                    size="lg"
                    variant="primary"
                    type="submit"
                    icon={<Send className="w-4 h-4" />}
                  >
                    SEND MESSAGE
                  </Button>
                </div>
              </form>
            )}
          </div>

        </div>

        {/* SECTION 2: FREQUENTLY ASKED QUESTIONS */}
        <div className="mb-12">
          <SectionHeading
            badge="Got Questions?"
            title="FREQUENTLY ASKED"
            highlightText="QUESTIONS"
            subtitle="Everything you need to know about RBX Gaming Cafe in Gota, Ahmedabad."
          />

          <div className="max-w-3xl mx-auto space-y-4">
            {faqsData.map((faq, fIdx) => {
              const isOpen = openFaq === fIdx;
              return (
                <div
                  key={fIdx}
                  className="rounded-2xl glass-panel border-rbx-border overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : fIdx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-white font-display">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-rbx-red shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-rbx-dark-300 leading-relaxed border-t border-white/5 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
