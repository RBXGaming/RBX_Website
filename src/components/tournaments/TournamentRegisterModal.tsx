import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Users, Phone, Mail, CheckCircle2, MessageSquare } from 'lucide-react';
import { TournamentItem } from '../../types';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { siteConfig } from '../../config/siteConfig';

interface TournamentRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  tournament: TournamentItem | null;
  onSuccess?: (teamName: string) => void;
}

export const TournamentRegisterModal: React.FC<TournamentRegisterModalProps> = ({
  isOpen,
  onClose,
  tournament,
  onSuccess,
}) => {
  const [teamName, setTeamName] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [captainDiscord, setCaptainDiscord] = useState('');
  const [playerTags, setPlayerTags] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!tournament) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName || !captainName || !captainPhone) return;

    setSubmitted(true);
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FF2A3A', '#FFD700', '#FFFFFF'],
      });
    } catch (e) {}

    if (onSuccess) {
      onSuccess(teamName);
    }
  };

  const whatsappRegisterMsg = `🏆 *RBX Esports Tournament Registration*
━━━━━━━━━━━━━━━━━━━━
🎮 *Tournament:* ${tournament.title}
👥 *Team Name:* ${teamName}
👤 *Captain:* ${captainName}
📱 *Phone:* ${captainPhone}
💬 *Discord/Tag:* ${captainDiscord || 'N/A'}
👥 *Players:* ${playerTags || 'Standard Lineup'}
━━━━━━━━━━━━━━━━━━━━
Please confirm our tournament slot at RBX Gaming Cafe Ahmedabad.`;

  const whatsappUrl = `https://wa.me/91${siteConfig.contact.whatsapp}?text=${encodeURIComponent(whatsappRegisterMsg)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={submitted ? undefined : `Register for ${tournament.game}`}>
      {submitted ? (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-glow-subtle animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">REGISTRATION SUBMITTED</span>
            <h3 className="text-2xl font-black text-white font-display uppercase mt-1">
              TEAM {teamName} LOCKED IN!
            </h3>
            <p className="text-xs text-rbx-dark-300 mt-2 max-w-sm mx-auto">
              Your squad registration has been received for <strong>{tournament.title}</strong>. Please confirm via WhatsApp or at the cafe reception.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rbx-dark-800 border border-white/10 text-xs text-left space-y-2">
            <div className="flex justify-between">
              <span className="text-rbx-dark-400">Date & Time:</span>
              <span className="font-bold text-white">{tournament.date} • {tournament.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rbx-dark-400">Entry Fee:</span>
              <span className="font-bold text-emerald-400">{tournament.entryFee}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-rbx-dark-400">Prize Pool:</span>
              <span className="font-bold text-amber-400">{tournament.prizePool}</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <MessageSquare className="w-4 h-4" />
              <span>SEND ROSTER VIA WHATSAPP</span>
            </a>

            <Button fullWidth variant="secondary" size="md" onClick={onClose}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 rounded-2xl bg-rbx-dark-800/80 border border-white/5 flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-rbx-red block">Selected Event</span>
              <span className="text-sm font-bold text-white">{tournament.title}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase text-rbx-dark-400 block">Entry Fee</span>
              <span className="text-sm font-black text-amber-400">{tournament.entryFee}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
              Team / Clan Name <span className="text-rbx-red">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ahmedabad Assassins"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                Captain / Leader Name <span className="text-rbx-red">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
                Mobile Number <span className="text-rbx-red">*</span>
              </label>
              <input
                type="tel"
                required
                placeholder="10-digit number"
                value={captainPhone}
                onChange={(e) => setCaptainPhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
              Captain Discord Tag / Riot ID (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Captain#1234"
              value={captainDiscord}
              onChange={(e) => setCaptainDiscord(e.target.value)}
              className="w-full px-4 py-2.5 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-rbx-dark-200 block mb-1.5">
              Team Player In-Game Tags / Lineup
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Player1#IND, Player2#123, Player3, Player4, Player5"
              value={playerTags}
              onChange={(e) => setPlayerTags(e.target.value)}
              className="w-full px-4 py-2 bg-rbx-dark-800 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-rbx-red"
            />
          </div>

          <div className="pt-3">
            <Button fullWidth size="lg" variant="primary" type="submit">
              REGISTER TEAM NOW
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
