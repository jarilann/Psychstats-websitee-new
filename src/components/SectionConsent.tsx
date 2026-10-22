import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Square, ArrowRight, ArrowLeft, FileCheck, Lock, AlertCircle } from 'lucide-react';
import { SurveyConfig, RespondentInfo } from '../types/survey';
import { trainAudio } from '../utils/audio';

interface SectionConsentProps {
  config: SurveyConfig;
  respondent: RespondentInfo;
  onAgreeAndProceed: (consentAgreed: boolean, consentTimestamp: string) => void;
  onBackToOverview: () => void;
}

export const SectionConsent: React.FC<SectionConsentProps> = ({
  config,
  respondent,
  onAgreeAndProceed,
  onBackToOverview
}) => {
  const [checkedPoints, setCheckedPoints] = useState<boolean[]>(
    config.consentPoints.map(() => false)
  );
  const [overallConsent, setOverallConsent] = useState<boolean>(false);
  const [signatureName, setSignatureName] = useState<string>(respondent.name || '');
  const [error, setError] = useState<string | null>(null);

  const togglePoint = (index: number) => {
    trainAudio.playTicketPunch();
    const updated = [...checkedPoints];
    updated[index] = !updated[index];
    setCheckedPoints(updated);

    if (updated.every(Boolean)) {
      setOverallConsent(true);
    }
  };

  const handleSelectAll = () => {
    trainAudio.playTicketPunch();
    const allChecked = checkedPoints.every(Boolean);
    setCheckedPoints(config.consentPoints.map(() => !allChecked));
    setOverallConsent(!allChecked);
  };

  const handleProceed = () => {
    if (!overallConsent || !checkedPoints.every(Boolean)) {
      setError('Please review and check all consent statements to confirm your voluntary participation.');
      return;
    }
    if (!signatureName.trim()) {
      setError('Please provide your electronic signature to validate this consent charter.');
      return;
    }

    setError(null);
    trainAudio.playHeavyStamp();
    trainAudio.playStationChime();
    const timestamp = new Date().toISOString();
    onAgreeAndProceed(true, timestamp);
  };

  const allChecked = checkedPoints.every(Boolean);

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Station Banner Header */}
      <div className="pixel-card-orange p-6 sm:p-10 mb-8 text-[var(--ink)]">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] tracking-[0.2em] uppercase font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-[#f47920]" />
          <span>STATION 02 · ETHICAL RESEARCH PROTOCOL</span>
        </div>

        <h1 className="font-syne text-3xl sm:text-5xl font-extrabold uppercase leading-tight tracking-tight text-[var(--accent)]">
          Informed Consent Charter
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#f2efeb]/70 mt-2 max-w-3xl leading-relaxed">
          Please review the academic ethical principles below. Voluntary, informed agreement is required 
          prior to departure for Station 03 (The Likert Scale Questionnaire).
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-[#f2efeb]/60 pt-4 border-t border-[var(--ink-faint)]">
          <span className="flex items-center gap-1.5 text-[var(--accent)]">
            <Lock className="w-3.5 h-3.5 text-[#f47920]" /> Anonymous Protocol
          </span>
          <span>·</span>
          <span>Right to withdraw at any time</span>
          <span>·</span>
          <span>No commercial exploitation</span>
        </div>
      </div>

      {/* Main Consent Form Card */}
      <div className="pixel-card-white p-6 sm:p-10 space-y-6">
        
        <div className="flex items-center justify-between pb-4 border-b border-[var(--ink-faint)]">
          <div>
            <h2 className="font-syne text-base font-extrabold text-[#f2efeb] uppercase tracking-wide flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-[#f47920]" />
              Voluntary Participation Statements
            </h2>
            <p className="font-mono text-xs text-[#f2efeb]/60 mt-1">
              Check each clause below to confirm your voluntary authorization:
            </p>
          </div>

          <button
            onClick={handleSelectAll}
            className="font-mono text-xs text-[var(--accent)] hover:text-white font-bold underline transition-colors cursor-pointer"
          >
            {allChecked ? '[ UNCHECK ALL ]' : '[ SELECT ALL ]'}
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/80 border-2 border-rose-500 font-mono text-xs text-rose-200 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Consent Points List */}
        <div className="space-y-3 font-mono">
          {config.consentPoints.map((point, index) => {
            const isChecked = checkedPoints[index];

            return (
              <div
                key={index}
                onClick={() => togglePoint(index)}
                className={`p-4 border-2 transition-all cursor-pointer flex items-start gap-4 select-none ${
                  isChecked
                    ? 'bg-[#18181a] border-[var(--accent)] text-[#f2efeb] shadow-[4px_4px_0px_#f8c300]'
                    : 'bg-[#111113] border-[#333] text-[#f2efeb]/60 hover:border-[#666]'
                }`}
              >
                <div className="mt-0.5 shrink-0 text-[#f47920]">
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-[var(--accent)]" />
                  ) : (
                    <Square className="w-5 h-5 text-[#555]" />
                  )}
                </div>

                <div className="text-xs leading-relaxed">
                  <span className="font-bold text-[var(--accent)] mr-2 uppercase">
                    Clause 0{index + 1}:
                  </span>
                  {point}
                </div>
              </div>
            );
          })}
        </div>

        {/* Institutional Policy Box */}
        <div className="p-4 bg-[#111113] border-2 border-[#333] font-mono text-xs text-[#f2efeb]/70 space-y-1">
          <div className="font-bold text-[#f47920] uppercase flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Institutional Research Data Protection Policy
          </div>
          <p className="leading-relaxed">
            {config.dataPrivacyPolicy}
          </p>
          <div className="pt-2 text-[11px] text-[#f2efeb]/50">
            Research ethics inquiry conductor: <span className="text-[var(--accent)]">{config.contactEmail}</span>
          </div>
        </div>

        {/* Interactive Stamped Seal when consented */}
        {overallConsent && (
          <div className="p-4 bg-[#111113] border-2 border-dashed border-[#f47920] flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
            <div className="flex items-center gap-4">
              <div
                onClick={() => trainAudio.playHeavyStamp()}
                className="w-16 h-16 bg-[#f47920] border-2 border-[#f2efeb] text-black flex flex-col items-center justify-center font-mono text-[9px] font-bold text-center shadow-[3px_3px_0px_#f8c300] cursor-pointer active:scale-95 transition-transform"
                title="Official Participant Seal (Click to Stamp!)"
              >
                <span>ETHICS</span>
                <span className="text-white text-[11px]">★ SEAL ★</span>
                <span>PNR-2026</span>
              </div>
              <div>
                <span className="font-syne text-sm font-extrabold text-[var(--accent)] uppercase block">
                  Official Research Consent Document Stamped
                </span>
                <span className="font-mono text-xs text-[#f2efeb]/70">
                  Validated for <strong>{signatureName || respondent.name || 'Participant'}</strong> · Ready for questionnaire
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => trainAudio.playHeavyStamp()}
              className="font-mono text-xs font-bold px-3 py-1.5 bg-[#18181a] border border-[#f2efeb] hover:bg-[#f47920] hover:text-black text-[#f2efeb] transition-all cursor-pointer"
            >
              Re-Stamp ⚡
            </button>
          </div>
        )}

        {/* Digital Signature & Final Agreement */}
        <div className="pt-6 border-t border-[var(--ink-faint)] grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
          
          <div className="space-y-1">
            <label className="block font-mono text-xs font-bold uppercase tracking-wider text-[#f47920]">
              Electronic Signature / Full Name <span className="text-[var(--accent)]">*</span>
            </label>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              placeholder="Type your full name"
              className="w-full bg-transparent border-b-2 border-[var(--ink-faint)] focus:border-[var(--accent)] py-2 text-[#f2efeb] font-mono text-sm focus:outline-none transition-colors"
            />
            <span className="font-mono text-[10px] text-[#f2efeb]/50 block">
              Serves as electronic confirmation on survey receipt
            </span>
          </div>

          <div>
            <label
              className="flex items-center gap-3 p-3 border-2 border-[#333] bg-[#111113] hover:border-[var(--accent)] cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={overallConsent}
                onChange={(e) => {
                  trainAudio.playTicketPunch();
                  setOverallConsent(e.target.checked);
                  if (e.target.checked && !allChecked) {
                    setCheckedPoints(config.consentPoints.map(() => true));
                  }
                }}
                className="w-5 h-5 text-[#f47920] bg-transparent border-2 border-[#f2efeb] rounded-none focus:ring-0"
              />
              <span className="font-mono text-xs font-bold text-[#f2efeb] uppercase">
                I formally grant my consent to participate
              </span>
            </label>
          </div>

        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={onBackToOverview}
          className="w-full sm:w-auto px-6 py-3.5 bg-[#18181a] border-2 border-[#555] hover:border-[#f2efeb] text-[#f2efeb] font-mono text-xs uppercase font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Route Overview</span>
        </button>

        <button
          onClick={handleProceed}
          disabled={!overallConsent}
          className={`w-full sm:w-auto px-8 py-4 text-sm font-syne font-extrabold flex items-center justify-center gap-3 uppercase transition-all cursor-pointer ${
            overallConsent
              ? 'btn-pixel-action'
              : 'bg-[#222] border-2 border-[#444] text-[#666] cursor-not-allowed'
          }`}
        >
          <span>Board Train: Begin Questionnaire</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
