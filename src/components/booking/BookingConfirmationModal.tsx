import React from 'react';
import {
  Clock,
  Calendar,
  Copy,
  MessageSquare,
  MapPin,
  ArrowUpRight,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Booking } from '../../types';
import { siteConfig } from '../../config/siteConfig';
import { getNewBookingWhatsAppUrl } from '../../lib/bookingService';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking;
  onTrack?: () => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  booking,
  onTrack,
}) => {
  const whatsappUrl = getNewBookingWhatsAppUrl(booking);

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(booking.booking_id);
      alert(`Booking ID ${booking.booking_id} copied to clipboard!`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="xl">
      <div className="text-center space-y-6">
        {/* Pending Request Badge & Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-500 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-900/40 animate-pulse">
          <Clock className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            PENDING APPROVAL
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white font-display uppercase tracking-tight mt-3">
            BOOKING REQUEST RECEIVED
          </h3>
          <p className="text-xs sm:text-sm text-rbx-dark-200 mt-1 max-w-md mx-auto">
            Your slot is temporarily held. RBX admin will review your request shortly. Advance payment is required after approval.
          </p>
        </div>

        {/* Digital Ticket Pass */}
        <div className="relative rounded-2xl bg-gradient-to-b from-rbx-card to-rbx-dark-800 border border-rbx-red/40 p-6 text-left shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-sm font-black text-white font-display uppercase tracking-wider">
                RBX GAMING PASS
              </span>
              <div className="text-[11px] text-emerald-400 font-bold">
                OPEN 24/7 • GOTA, AHMEDABAD
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-rbx-dark-400 uppercase font-semibold block">
                Booking ID
              </span>
              <div className="flex items-center gap-1.5 text-sm font-mono font-bold text-rbx-red">
                <span>{booking.booking_id}</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  title="Copy Booking ID"
                  className="hover:text-white p-1 rounded bg-white/5"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 my-4 text-xs">
            <div>
              <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                Gamer Name
              </span>
              <span className="font-bold text-white text-sm">{booking.customer_name}</span>
            </div>

            <div>
              <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                Gaming Setup
              </span>
              <span className="font-bold text-white">
                {booking.gaming_type === 'pc'
                  ? 'RTX 5060 PC (300Hz)'
                  : booking.gaming_type === 'ps5_single'
                  ? 'PS5 Single Player'
                  : 'PS5 Multiplayer'}
              </span>
            </div>

            <div>
              <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                Players
              </span>
              <span className="font-bold text-white">{booking.number_of_players} Gamer(s)</span>
            </div>

            <div>
              <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">Date</span>
              <span className="font-bold text-white flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rbx-red" />
                {booking.booking_date}
              </span>
            </div>

            <div>
              <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                Time Slot
              </span>
              <span className="font-bold text-white flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                {booking.start_time} - {booking.end_time}
              </span>
            </div>

            <div>
              <span className="text-rbx-dark-400 block text-[10px] uppercase font-bold">
                Duration
              </span>
              <span className="font-bold text-white">{booking.duration} Hour(s)</span>
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-dashed border-white/15 pt-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase text-rbx-dark-400 block">
                Estimated Total Session Fee
              </span>
              <span className="text-xs text-amber-400 font-semibold">
                Advance of ₹{booking.booking_amount} payable upon approval
              </span>
            </div>

            <div className="text-right">
              <span className="text-2xl font-black text-white font-display">
                ₹{booking.calculated_price}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 border border-emerald-400/40 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>NOTIFY CAFE ON WHATSAPP</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            {onTrack && (
              <button
                type="button"
                onClick={onTrack}
                className="py-3 px-4 rounded-xl bg-rbx-dark-700 hover:bg-rbx-dark-600 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5 text-rbx-red" />
                <span>Track Status / Pay</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-xl bg-rbx-red hover:bg-rbx-red-hover text-white text-xs font-bold shadow-glow-subtle flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Done</span>
            </button>
          </div>
        </div>

        {/* Location Reminder */}
        <a
          href={siteConfig.contact.googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 text-xs text-rbx-dark-300 hover:text-rbx-red transition-colors pt-1 group"
        >
          <MapPin className="w-3.5 h-3.5 text-rbx-red group-hover:scale-110 transition-transform" />
          <span>RBX Gaming Cafe • 115, First Floor, Rudram Icon, Gota, Ahmedabad (Open 24/7)</span>
        </a>
      </div>
    </Modal>
  );
};
