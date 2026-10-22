import React from 'react';
import { Volume2, VolumeX, ShieldCheck, Ticket } from 'lucide-react';
import { trainAudio } from '../utils/audio';

interface HeaderProps {
  currentSection: 'checkin' | 'overview' | 'consent' | 'questionnaire' | 'arrival' | 'admin';
  onNavigate: (section: 'checkin' | 'overview' | 'consent' | 'questionnaire' | 'arrival' | 'admin') => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  isAdminLoggedIn: boolean;
  onOpenAdminLogin: () => void;
  totalResponsesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSection,
  onNavigate,
  isAudioMuted,
  onToggleAudio,
  isAdminLoggedIn,
  onOpenAdminLogin,
  totalResponsesCount
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0c10]/80 backdrop-blur-xl border-b-2 border-[var(--ink-faint)] text-[var(--ink)]">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 h-20 flex items-center justify-between gap-6">
        
        {/* Zone 1: PNR Tag Wordmark */}
        <button
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-3 text-left group whitespace-nowrap shrink-0 focus:outline-none cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#003399] border-2 border-[var(--ink)] flex items-center justify-center text-[var(--accent)] font-syne font-extrabold text-sm shadow-[3px_3px_0px_var(--pnr-orange)]">
            PNR
          </div>
          <div>
            <div className="font-dot text-[#f47920] text-xl font-bold tracking-wider group-hover:text-[var(--accent)] transition-colors">
              PNR SURVEY EXPRESS
            </div>
            <div className="text-[10px] text-[#f2efeb]/60 font-mono tracking-widest uppercase">
              PIXEL PHILIPPINE RAILWAY STATION
            </div>
          </div>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] font-mono uppercase tracking-[0.2em]">
          <button
            onClick={() => onNavigate('overview')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSection === 'overview'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] pb-1'
                : 'text-[#f2efeb]/60 hover:text-[#f2efeb]'
            }`}
          >
            Route Overview
          </button>
          <button
            onClick={() => onNavigate('consent')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSection === 'consent'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] pb-1'
                : 'text-[#f2efeb]/60 hover:text-[#f2efeb]'
            }`}
          >
            Consent Charter
          </button>
          <button
            onClick={() => onNavigate('questionnaire')}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              currentSection === 'questionnaire'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] pb-1'
                : 'text-[#f2efeb]/60 hover:text-[#f2efeb]'
            }`}
          >
            Likert Scale
          </button>
          <button
            onClick={() => {
              if (isAdminLoggedIn) {
                onNavigate('admin');
              } else {
                onOpenAdminLogin();
              }
            }}
            className={`transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-1.5 ${
              currentSection === 'admin'
                ? 'text-[var(--accent)] font-bold border-b-2 border-[var(--accent)] pb-1'
                : 'text-[#f2efeb]/60 hover:text-[#f2efeb]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#f47920]" />
            <span>Researcher</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Whistle */}
          <button
            onClick={() => {
              trainAudio.playTrainWhistle();
              trainAudio.playSteamRelease();
            }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-bold bg-[#18181a] border border-[#f2efeb] hover:bg-[var(--accent)] hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_#f47920]"
            title="Sound PNR Train Horn"
          >
            <span>📢 HORN</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleAudio();
              if (isAudioMuted) {
                trainAudio.playStationChime();
              }
            }}
            className="p-2 border border-[#f2efeb]/40 hover:border-[#f2efeb] text-[#f2efeb]/70 hover:text-[#f2efeb] transition-colors cursor-pointer"
            title={isAudioMuted ? 'Turn Sound On' : 'Mute Railway Audio'}
            aria-label="Toggle train audio"
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-[var(--accent)]" />}
          </button>

          {/* Conductor / Return button */}
          {currentSection !== 'admin' ? (
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  onNavigate('admin');
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="btn-pixel-action flex items-center gap-2 px-4 py-2 text-xs font-syne font-bold uppercase"
            >
              <Ticket className="w-4 h-4 text-[#f47920]" />
              <span>Conductor{isAdminLoggedIn ? ` (${totalResponsesCount})` : ''}</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('overview')}
              className="btn-pixel-action px-4 py-2 text-xs font-syne font-bold uppercase"
            >
              Survey Express
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
