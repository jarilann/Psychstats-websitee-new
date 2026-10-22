import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Ticket, CheckCircle2, Mail, Send, Printer, RotateCcw, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { SurveyResponse, SurveyConfig } from '../types/survey';
import { LIKERT_OPTIONS } from '../data/defaultSurvey';
import { trainAudio } from '../utils/audio';

interface SectionArrivalReceiptProps {
  response: SurveyResponse;
  config: SurveyConfig;
  onSendEmailCopy: (email: string) => Promise<boolean>;
  onNewSurvey: () => void;
  onViewResearcherPortal: () => void;
}

export const SectionArrivalReceipt: React.FC<SectionArrivalReceiptProps> = ({
  response,
  config,
  onSendEmailCopy,
  onNewSurvey,
  onViewResearcherPortal
}) => {
  const [recipientEmail, setRecipientEmail] = useState(response.respondent.email || '');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(true);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    trainAudio.playStationChime();
    trainAudio.playTrainWhistle();

    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f8c300', '#f47920', '#003399', '#f2efeb']
      });
    } catch {
      // ignore
    }
  }, []);

  const handleResendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail || !recipientEmail.includes('@')) return;

    trainAudio.playTicketPunch();
    window.open(mailtoLink, '_blank', 'noopener');
  };

  const handlePrint = () => {
    trainAudio.playTicketPunch();
    window.print();
  };

  const generateEmailText = () => {
    const lines = [
      `PHILIPPINE PNR SURVEY EXPRESS - OFFICIAL PASSENGER RECEIPT`,
      `=============================================================`,
      `Study: ${config.studyTitle}`,
      `Institution: ${config.institution}`,
      `Ticket Number: ${response.ticketNumber}`,
      `Respondent: ${response.respondent.name}`,
      `Travel time to and from PNU: ${response.respondent.travelMinutes ?? ''} min`,
      `Distance from PNU: ${response.respondent.distanceKm ?? ''} km`,
      `Completion Time (UTC): ${response.completedAt}`,
      `Consent Status: VOLUNTARY & CONFIRMED`,
      ``,
      `YOUR SUBMITTED RATINGS:`,
      `-------------------------------------------------------------`
    ];

    config.questions.forEach((q, idx) => {
      const val = response.answers[q.id];
      const opt = LIKERT_OPTIONS.find((o) => o.value === val);
      lines.push(`${idx + 1}. [${q.code}] ${q.text}`);
      lines.push(`   Rating: [${val}] ${opt?.label || 'N/A'}`);
      lines.push(``);
    });

    lines.push(`-------------------------------------------------------------`);
    lines.push(`Thank you for riding the Research Express.`);
    lines.push(`Research Contact: ${config.contactEmail}`);

    return lines.join('\n');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateEmailText());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const mailtoLink = `mailto:${encodeURIComponent(recipientEmail)}?subject=${encodeURIComponent(
    `PNR Survey Receipt: ${config.studyTitle} [${response.ticketNumber}]`
  )}&body=${encodeURIComponent(generateEmailText())}`;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Terminal Arrival Banner */}
      <div className="pixel-card-yellow p-6 sm:p-10 mb-8 text-center text-[var(--ink)]">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#111113] border border-[var(--accent)] text-[var(--accent)] font-mono text-xs mb-3 uppercase tracking-widest font-bold">
          <CheckCircle2 className="w-4 h-4 text-[#f47920]" />
          <span>TERMINAL ARRIVAL · ALL STATIONS TRAVERSED</span>
        </div>

        <h1 className="font-syne text-3xl sm:text-5xl font-extrabold uppercase text-[#f2efeb]">
          Salamat, <span className="text-[var(--accent)]">{response.respondent.name}</span>!
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#f2efeb]/70 mt-2 max-w-2xl mx-auto leading-relaxed">
          Your questionnaire feedback has been securely stored in our academic research database.
          A copy of your validated ticket and responses has been generated below.
        </p>

        <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-[#f2efeb] bg-[#111113] px-5 py-2.5 border-2 border-[var(--ink)]">
          <span>TICKET: <strong className="text-[var(--accent)]">{response.ticketNumber}</strong></span>
          <span>·</span>
          <span>TRAVEL: <strong className="text-[#f47920]">{response.respondent.travelMinutes} min, {response.respondent.distanceKm} km</strong></span>
          <span>·</span>
          <span>ARRIVED: <strong>{new Date(response.completedAt).toLocaleTimeString()}</strong></span>
        </div>
      </div>

      {/* Gmail Dispatch Notification Box */}
      <div className="pixel-card-orange p-6 sm:p-8 mb-8 text-[var(--ink)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--ink-faint)]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#003399] border-2 border-[var(--ink)] text-[var(--accent)] flex items-center justify-center shrink-0 shadow-[2px_2px_0px_#f47920]">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-syne text-base font-extrabold text-[#f2efeb] uppercase flex items-center gap-2">
                <span>Get your copy by email</span>
                <span className="font-mono text-[10px] bg-[#f8c300] text-black px-2 py-0.5 font-bold">
                  OPTIONAL
                </span>
              </h2>
              <p className="font-mono text-xs text-[#f2efeb]/60 mt-0.5">
                Open the email draft below, add your address, and send it to yourself. You can also save this ticket as a PDF.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowEmailPreview(!showEmailPreview)}
              className="px-4 py-2 bg-[#18181a] border border-[#f2efeb] hover:bg-[#222] text-xs font-mono font-bold uppercase transition-colors cursor-pointer"
            >
              {showEmailPreview ? 'Hide Draft' : 'Preview Draft'}
            </button>
            <a
              href={mailtoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pixel-action px-4 py-2 text-xs font-syne font-bold uppercase flex items-center gap-1.5"
            >
              <span>Open in Gmail</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Email Draft Preview */}
        {showEmailPreview && (
          <div className="mt-4 p-4 bg-[#111113] border-2 border-[#333] font-mono text-xs overflow-x-auto text-[#f2efeb]">
            <div className="text-[#f2efeb]/50 border-b border-[#333] pb-2 mb-3">
              <div>To: {recipientEmail || '(your email)'}</div>
              <div>From: {config.contactEmail} (PNR Research Conductor)</div>
              <div>Subject: Official Copy: {config.studyTitle} [{response.ticketNumber}]</div>
            </div>
            <pre className="whitespace-pre-wrap leading-relaxed text-[11px] text-[#f2efeb]/80">
              {generateEmailText()}
            </pre>
          </div>
        )}

        {/* Forward / Resend */}
        <form onSubmit={handleResendEmail} className="mt-4 pt-4 border-t border-[var(--ink-faint)] flex flex-col sm:flex-row items-center gap-4">
          <div className="font-mono text-xs text-[#f2efeb]/70 sm:w-56 shrink-0 uppercase">
            Email my copy to:
          </div>
          <div className="flex-1 w-full flex items-center gap-3">
            <input
              type="email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              placeholder="another.classmate@gmail.com"
              className="flex-1 px-3.5 py-2 bg-[#111113] border-2 border-[#444] focus:border-[var(--accent)] font-mono text-xs text-[#f2efeb] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSending}
              className="btn-pixel-action px-5 py-2 text-xs font-syne font-bold uppercase flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Open draft</span>
            </button>
          </div>
        </form>
      </div>

      {/* Official Validated PNR Boarding Ticket & Receipt (Printable) */}
      <div id="printable-receipt" className="bg-[#18181a] border-2 border-[var(--ink)] shadow-[10px_10px_0px_#f47920] mb-8 text-[var(--ink)] font-mono overflow-hidden">
        
        {/* Ticket Header */}
        <div className="bg-[#0c0c10] p-6 border-b-2 border-[var(--ink)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="font-dot text-lg text-[#f47920] font-bold tracking-widest flex items-center gap-2">
              <Ticket className="w-5 h-5 text-[var(--accent)]" />
              <span>PHILIPPINE PNR SURVEY VALIDATION PASS</span>
            </div>
            <h2 className="font-syne text-xl sm:text-2xl font-extrabold text-[var(--accent)] uppercase mt-1">
              {config.studyTitle}
            </h2>
            <p className="text-xs text-[#f2efeb]/50 mt-0.5">
              {config.institution}
            </p>
          </div>

          <div className="border-2 border-[var(--accent)] p-2.5 bg-[#111113] text-right">
            <span className="text-[10px] text-[#f2efeb]/50 uppercase block">VALIDATION STAMP</span>
            <span className="font-syne text-sm font-extrabold text-[var(--accent)]">
              RECORDED & ANONYMIZED
            </span>
          </div>
        </div>

        {/* Passenger Information */}
        <div className="p-6 bg-[#141416] border-b-2 border-[var(--ink-faint)] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#f2efeb]/50 uppercase block">PASSENGER NAME</span>
            <span className="font-bold text-base text-[var(--accent)]">{response.respondent.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#f2efeb]/50 uppercase block">TICKET NUMBER</span>
            <span className="font-bold text-base text-[#f47920]">{response.ticketNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-[#f2efeb]/50 uppercase block">TRAVEL TIME / DISTANCE</span>
            <span className="font-bold text-xs truncate block text-[#f2efeb]">{response.respondent.travelMinutes} min / {response.respondent.distanceKm} km</span>
          </div>
          <div>
            <span className="text-[10px] text-[#f2efeb]/50 uppercase block">FINAL STOP</span>
            <span className="font-bold text-xs text-[#f2efeb]">United Nations</span>
          </div>
        </div>

        {/* Perforated Barcode / Track Line */}
        <div className="relative py-2 flex items-center justify-between bg-[#111113]">
          <div className="w-4 h-4 bg-[#111113] -ml-2 border-r-2 border-[#f2efeb]" />
          <div className="flex-1 border-b-2 border-dashed border-[#555] mx-4" />
          <div className="w-4 h-4 bg-[#111113] -mr-2 border-l-2 border-[#f2efeb]" />
        </div>

        {/* Responses Table */}
        <div className="p-6 space-y-3">
          <h3 className="font-syne text-xs font-extrabold uppercase tracking-wider text-[#f47920] flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4" />
            Authenticated Responses ({config.questions.length} Likert Items)
          </h3>

          <div className="space-y-2">
            {config.questions.map((q) => {
              const val = response.answers[q.id];
              const opt = LIKERT_OPTIONS.find((o) => o.value === val);

              return (
                <div
                  key={q.id}
                  className="p-3 bg-[#111113] border border-[#333] flex items-center justify-between text-xs gap-3"
                >
                  <div className="flex items-start gap-2.5 max-w-xl">
                    <span className="font-bold text-[#f47920] bg-[#f47920]/15 px-2 py-0.5 border border-[#f47920]/40 shrink-0">
                      {q.code}
                    </span>
                    <span className="text-[#f2efeb]/90">
                      {q.text}
                    </span>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 font-syne font-bold">
                    <span className="w-7 h-7 bg-[#f8c300] text-black text-sm flex items-center justify-center">
                      {val}
                    </span>
                    <span className="text-[11px] text-[#f47920] hidden sm:inline w-28 text-right uppercase">
                      {opt?.shortLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-[#0c0c10] px-6 py-4 text-[11px] text-[#f2efeb]/50 border-t-2 border-[var(--ink-faint)] flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Informed Consent granted voluntarily on {new Date(response.consentTimestamp).toLocaleString()}</span>
          <span className="text-[var(--accent)] font-bold">STATUS: PNR RESEARCH CERTIFIED</span>
        </div>

      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="btn-pixel-action px-6 py-3 text-xs font-syne font-extrabold uppercase flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#f47920]" />
            <span>Print / Save PDF Receipt</span>
          </button>

          <button
            onClick={handleCopySummary}
            className="px-4 py-3 bg-[#18181a] border-2 border-[#555] hover:border-[#f2efeb] text-[#f2efeb] text-xs uppercase font-bold flex items-center gap-2 cursor-pointer transition-colors"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Copied Receipt!' : 'Copy to Clipboard'}</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNewSurvey}
            className="btn-pixel-action px-6 py-3 text-xs font-syne font-extrabold uppercase flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#f47920]" />
            <span>Next Classmate / New Ticket</span>
          </button>

          <button
            onClick={onViewResearcherPortal}
            className="px-4 py-3 bg-[#111113] border-2 border-[#444] hover:border-[#f2efeb] text-[var(--accent)] text-xs uppercase font-bold transition-colors cursor-pointer"
          >
            Researcher Portal
          </button>
        </div>
      </div>

    </div>
  );
};
