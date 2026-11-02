import React, { useState, useEffect, useRef } from 'react';
import { Smartphone, KeyRound, UserRound, ShieldCheck, Clock } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { CustomerProfile } from '../../types';
import { sendOtp, verifyOtp, saveCustomerName, digitsOnly } from '../../lib/customerService';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (profile: CustomerProfile, isNewUser: boolean) => void;
}

type AuthStep = 'phone' | 'otp' | 'name';

const RESEND_SECONDS = 30;

/**
 * Real Supabase Phone OTP login flow:
 *   1. Customer enters their 10-digit mobile number.
 *   2. Supabase Auth sends a real SMS OTP (no fake OTP is used or stored).
 *   3. On first-time login the customer is asked for their name once;
 *      returning customers skip straight in (name already on record).
 */
export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticated,
}) => {
  const [step, setStep] = useState<AuthStep>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [resendIn, setResendIn] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  const reset = () => {
    setStep('phone');
    setPhone('');
    setOtpCode('');
    setName('');
    setError('');
    setLoading(false);
    setResendIn(0);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen]);

  useEffect(() => {
    if (resendIn <= 0) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setResendIn((prev) => {
        if (prev <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [resendIn, step]);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (digitsOnly(phone).length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to send OTP. Please try again.');
      return;
    }
    setStep('otp');
    setResendIn(RESEND_SECONDS);
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!otpCode.trim()) {
      setError('Please enter the 6-digit OTP sent to your mobile.');
      return;
    }
    setLoading(true);
    const res = await verifyOtp(phone, otpCode);
    setLoading(false);
    if (!res.success || !res.profile) {
      setError(res.error || 'Verification failed. Please check the OTP and try again.');
      return;
    }
    if (res.isNewUser) {
      setStep('name');
    } else {
      onAuthenticated(res.profile, false);
      reset();
    }
  };

  const handleSaveName = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setError('');
    if (!name.trim()) {
      setError('Please enter your name so we know who is booking.');
      return;
    }
    setLoading(true);
    const res = await saveCustomerName(name);
    setLoading(false);
    if (!res.success || !res.profile) {
      setError(res.error || 'Failed to save your name. Please try again.');
      return;
    }
    onAuthenticated(res.profile, true);
    reset();
  };

  const handleResend = async () => {
    if (resendIn > 0) return;
    setError('');
    setLoading(true);
    const res = await sendOtp(phone);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Failed to resend OTP. Please try again.');
      return;
    }
    setResendIn(RESEND_SECONDS);
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-rbx-red/15 text-rbx-red border border-rbx-red/40 flex items-center justify-center mx-auto shadow-glow-subtle">
          {step === 'phone' && <Smartphone className="w-7 h-7" />}
          {step === 'otp' && <KeyRound className="w-7 h-7" />}
          {step === 'name' && <UserRound className="w-7 h-7" />}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-rbx-red">
            Customer Login
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white font-display uppercase tracking-tight mt-1">
            {step === 'phone' && 'LOGIN WITH MOBILE OTP'}
            {step === 'otp' && 'ENTER OTP'}
            {step === 'name' && 'TELL US YOUR NAME'}
          </h3>
          <p className="text-xs text-rbx-dark-300 mt-1 max-w-sm mx-auto">
            {step === 'phone' &&
              'A real 6-digit OTP will be sent to your mobile via SMS. No password needed.'}
            {step === 'otp' && `We sent a 6-digit code to +91 ${digitsOnly(phone).slice(-10)}.`}
            {step === 'name' && 'This is your first login. Set your name once — we will remember it.'}
          </p>
        </div>

        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3.5 text-xs font-bold text-rbx-dark-300">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  autoFocus
                  placeholder="10-digit mobile number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-12 pr-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rbx-red font-semibold">{error}</p>}

            <Button fullWidth size="lg" variant="primary" type="submit" disabled={loading}>
              {loading ? 'SENDING OTP...' : 'SEND OTP'}
            </Button>
          </form>
        )}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                6-Digit OTP
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                placeholder="••••••"
                value={otpCode}
                maxLength={6}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm tracking-[0.4em] text-center text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
              />
            </div>

            {error && <p className="text-xs text-rbx-red font-semibold">{error}</p>}

            <Button fullWidth size="lg" variant="primary" type="submit" disabled={loading}>
              {loading ? 'VERIFYING...' : 'VERIFY & LOGIN'}
            </Button>

            <div className="flex items-center justify-between text-xs text-rbx-dark-300">
              <button
                type="button"
                onClick={handleResend}
                disabled={resendIn > 0 || loading}
                className="font-bold text-rbx-red hover:text-white transition-colors disabled:text-rbx-dark-500 disabled:cursor-not-allowed cursor-pointer"
              >
                {resendIn > 0 ? (
                  <span className="inline-flex items-center gap-1 text-rbx-dark-300">
                    <Clock className="w-3.5 h-3.5" /> Resend in {resendIn}s
                  </span>
                ) : (
                  'Resend OTP'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setError('');
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Change number
              </button>
            </div>
          </form>
        )}
        {step === 'name' && (
          <form onSubmit={handleSaveName} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                Your Name <span className="text-rbx-red">*</span>
              </label>
              <div className="relative">
                <UserRound className="w-4 h-4 text-rbx-dark-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Yash Patel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-rbx-dark-800 border border-white/10 rounded-xl text-sm text-white placeholder-rbx-dark-400 focus:outline-none focus:border-rbx-red/60"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rbx-red font-semibold">{error}</p>}

            <Button fullWidth size="lg" variant="primary" type="submit" disabled={loading}>
              {loading ? 'SAVING...' : 'SAVE & CONTINUE'}
            </Button>
          </form>
        )}

        <div className="pt-1 flex items-start justify-center gap-1.5 text-[11px] text-rbx-dark-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            OTPs are sent through Supabase Auth. We never store or fake OTP codes, and your
            account is protected by Row Level Security.
          </span>
        </div>
      </div>
    </Modal>
  );
};
