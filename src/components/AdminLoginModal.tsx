import React, { useState } from 'react';
import { Lock, ShieldCheck, X, KeyRound, AlertCircle } from 'lucide-react';
import { trainAudio } from '../utils/audio';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onVerify: (passkey: string) => Promise<boolean>;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onVerify
}) => {
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await onVerify(passkey.trim());
    if (ok) {
      trainAudio.playStationChime();
      setError(null);
      setPasskey('');
      onSuccess();
    } else {
      trainAudio.playTicketPunch();
      setError('Wrong passkey. Access denied.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0c0c10]/85 backdrop-blur-md">
      <div className="bg-[#18181a] max-w-md w-full border-2 border-[var(--ink)] shadow-[10px_10px_0px_#f47920] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#111113] p-5 flex items-center justify-between border-b-2 border-[var(--ink)]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#003399] border-2 border-[var(--ink)] text-[var(--accent)] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-syne text-sm font-extrabold uppercase text-[#f2efeb]">PNR Conductor Gate</h2>
              <span className="text-[10px] font-mono text-[#f47920] uppercase font-bold">RESEARCHER RESTRICTED ACCESS</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#f2efeb]/60 hover:text-white p-1 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 font-mono text-xs">
          <p className="text-[#f2efeb]/70 mb-5 leading-relaxed">
            Enter the authorized researcher passkey to unlock the PNR analytics station, inspect classmate responses, and export datasets to Excel (.xlsx).
          </p>

          {error && (
            <div className="mb-4 p-3 bg-rose-950/80 border-2 border-rose-500 font-mono text-xs font-bold text-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#f47920]">
                Researcher Passkey
              </label>
              <div className="mt-2 relative">
                <input
                  type="password"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter passkey..."
                  className="w-full bg-[#111113] border-2 border-[var(--ink-faint)] focus:border-[var(--accent)] py-2.5 px-3 text-[#f2efeb] font-mono text-sm focus:outline-none transition-colors"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-[#f2efeb]/40 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-3 bg-[#111113] border-2 border-[#444] hover:border-[#f2efeb] text-[#f2efeb] text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-pixel-action w-1/2 py-3 text-xs font-syne font-extrabold uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#f47920]" />
                <span>Verify Gate</span>
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
