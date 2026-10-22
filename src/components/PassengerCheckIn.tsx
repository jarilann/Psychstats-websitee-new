import React, { useState } from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { RespondentInfo } from '../types/survey';
import { trainAudio } from '../utils/audio';

interface PassengerCheckInProps {
  initialInfo: RespondentInfo;
  onConfirm: (info: RespondentInfo) => void;
  onSkipToOverview?: () => void;
}

const field =
  'w-full bg-transparent border-b-2 border-[var(--ink-faint)] focus:border-[var(--accent)] py-2 text-[#f2efeb] font-mono text-sm sm:text-base focus:outline-none transition-colors';
const label = 'block font-mono text-xs uppercase font-bold tracking-wider text-[#f47920]';

export const PassengerCheckIn: React.FC<PassengerCheckInProps> = ({ initialInfo, onConfirm }) => {
  const [name, setName] = useState(initialInfo.name || '');
  const [minutes, setMinutes] = useState(initialInfo.travelMinutes?.toString() ?? '');
  const [km, setKm] = useState(initialInfo.distanceKm?.toString() ?? '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError('Enter your full name.');
    if (minutes === '' || Number(minutes) < 0) return setError('Enter your estimated travel time in minutes (0 or higher).');
    if (km === '' || Number(km) < 0) return setError('Enter your estimated distance in km (0 or higher).');
    setError(null);
    trainAudio.playTicketPunch();
    trainAudio.playStationChime();
    onConfirm({ ...initialInfo, name: name.trim(), travelMinutes: Number(minutes), distanceKm: Number(km) });
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 sm:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
        <div className="lg:col-span-6 space-y-6">
          <div className="font-mono text-xs text-[#f8c300] tracking-[0.4em] uppercase font-bold flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#f47920] inline-block" />
            <span>NOW BOARDING AT VITO CRUZ</span>
          </div>
          <h1 className="font-syne text-5xl sm:text-7xl lg:text-8xl font-extrabold uppercase leading-[0.88] tracking-[-0.04em] text-[var(--accent)]">
            Commute<br />
            <span className="text-[#f2efeb]">Express</span>
          </h1>
          <p className="font-mono text-sm sm:text-base text-[#f2efeb]/70 leading-relaxed max-w-xl">
            A short survey on how your trip to PNU feels. Start with your name and two estimates about your commute.
            No account or login is needed.
          </p>
          <div className="flex flex-wrap items-center gap-6 text-xs font-mono text-[#f2efeb]/60">
            <span className="flex items-center gap-2 text-[#f47920]"><Shield className="w-4 h-4" /> Confidential</span>
            <span>5-Point Likert Scale</span>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="bg-[#18181a] border-2 border-[#f2efeb] p-6 sm:p-10 shadow-[10px_10px_0px_#f47920]">
            <div className="font-dot text-[#f47920] text-lg font-bold tracking-wider pb-4 border-b border-[var(--ink-faint)] mb-6">
              PASSENGER CHECK-IN
            </div>
            {error && (
              <div role="alert" className="mb-6 p-3 bg-rose-950/80 border-2 border-rose-500 font-mono text-xs text-rose-200">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className={label}>Full name <span className="text-[var(--accent)]">*</span></label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className={field} required />
              </div>
              <div className="space-y-1">
                <label className={label}>Estimated travel time to and from PNU (minutes) <span className="text-[var(--accent)]">*</span></label>
                <input type="number" min="0" inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} className={field} required />
              </div>
              <div className="space-y-1">
                <label className={label}>Estimated distance of your residence from PNU (km) <span className="text-[var(--accent)]">*</span></label>
                <input type="number" min="0" step="0.1" inputMode="decimal" value={km} onChange={(e) => setKm(e.target.value)} className={field} required />
              </div>
              <button type="submit" className="btn-pixel-action w-full py-4 px-6 text-sm sm:text-base flex items-center justify-center gap-3 cursor-pointer">
                <span>Enter Carriage & Begin</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
