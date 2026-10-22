import React, { useState } from 'react';
import { Compass, Clock, ArrowRight, Eye, ChevronDown, ChevronUp, FileText, User } from 'lucide-react';
import { SurveyConfig, RespondentInfo } from '../types/survey';
import { LIKERT_OPTIONS } from '../data/defaultSurvey';
import { trainAudio } from '../utils/audio';

interface SectionOverviewProps {
  config: SurveyConfig;
  respondent: RespondentInfo;
  onProceedToConsent: () => void;
  onEditPassenger: () => void;
}

export const SectionOverview: React.FC<SectionOverviewProps> = ({
  config,
  respondent,
  onProceedToConsent,
  onEditPassenger
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    trainAudio.playTicketPunch();
    setExpandedCategory(expandedCategory === cat ? null : cat);
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Station Banner Header (Variation 15 Neo-brutalist) */}
      <div className="pixel-card-orange p-6 sm:p-10 mb-8 text-[var(--ink)]">
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] tracking-[0.2em] uppercase font-bold">
            <span className="w-2.5 h-2.5 bg-[#f47920] inline-block" />
            <span>STATION 01 · ROUTE ITINERARY & SCOPE</span>
          </div>

          {respondent.name ? (
            <button
              onClick={onEditPassenger}
              className="text-xs bg-[#111113] hover:bg-[#222] text-[#f2efeb] px-3.5 py-1.5 border border-[#f2efeb]/60 transition-colors flex items-center gap-2 font-mono cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-[#f47920]" />
              <span>Manifest: <strong className="text-[var(--accent)]">{respondent.name}</strong></span>
            </button>
          ) : null}
        </div>

        <h1 className="font-syne text-3xl sm:text-5xl font-extrabold uppercase leading-tight tracking-tight text-[var(--accent)]">
          {config.studyTitle}
        </h1>
        <p className="font-mono text-xs sm:text-sm text-[#f2efeb]/70 mt-3 max-w-4xl leading-relaxed">
          {config.overviewDescription}
        </p>

        {/* PNR Concourse Split-Flap Departure Monitor */}
        <div className="mt-8 p-4 bg-[#111113] border-2 border-[var(--ink)] text-[var(--accent)] font-mono text-xs shadow-[4px_4px_0px_#f47920]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--ink-faint)]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#f47920] animate-ping inline-block" />
              <span className="font-dot text-base font-bold text-white tracking-widest uppercase">
                PNR CONCOURSE DEPARTURE BOARD
              </span>
            </div>
            <button
              type="button"
              onClick={() => trainAudio.playConductorBell()}
              className="px-3 py-1 bg-[#18181a] hover:bg-[var(--accent)] hover:text-black text-[var(--accent)] border border-[#f2efeb] font-mono text-[11px] cursor-pointer transition-colors flex items-center gap-1 active:scale-95"
            >
              <span>🔔 Ring Station Bell</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-[11px]">
            <div className="bg-[#18181a] p-2.5 border border-[#333]">
              <span className="text-[#f2efeb]/40 block text-[9px] uppercase">SERVICE LINE</span>
              <span className="text-white font-bold font-syne">EXP-2026 RESEARCH</span>
            </div>
            <div className="bg-[#18181a] p-2.5 border border-[#333]">
              <span className="text-[#f2efeb]/40 block text-[9px] uppercase">PLATFORM</span>
              <span className="text-[var(--accent)] font-bold">TRACK 04 · ON TIME</span>
            </div>
            <div className="bg-[#18181a] p-2.5 border border-[#333]">
              <span className="text-[#f2efeb]/40 block text-[9px] uppercase">PASSENGER TICKET</span>
              <span className="text-[#f47920] font-bold">ANONYMIZED PEER</span>
            </div>
            <div className="bg-[#18181a] p-2.5 border border-[#333]">
              <span className="text-[#f2efeb]/40 block text-[9px] uppercase">STATUS</span>
              <span className="text-emerald-400 font-bold">ALL CLEAR / BOARDING</span>
            </div>
          </div>
        </div>

        {/* Route Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--ink-faint)] font-mono text-xs">
          <div>
            <span className="text-[#f2efeb]/50 block text-[10px] uppercase">Est. Transit Time</span>
            <span className="text-[var(--accent)] font-bold text-sm flex items-center gap-1 mt-0.5 font-syne">
              <Clock className="w-3.5 h-3.5 text-[#f47920]" /> ~{config.estimatedMinutes} Minutes
            </span>
          </div>
          <div>
            <span className="text-[#f2efeb]/50 block text-[10px] uppercase">Question Count</span>
            <span className="text-white font-bold text-sm mt-0.5 block font-syne">
              {config.questions.length} Likert Items
            </span>
          </div>
          <div>
            <span className="text-[#f2efeb]/50 block text-[10px] uppercase">Evaluation Metric</span>
            <span className="text-white font-bold text-sm mt-0.5 block font-syne">
              5-Point Likert
            </span>
          </div>
          <div>
            <span className="text-[#f2efeb]/50 block text-[10px] uppercase">Receipt Dispatch</span>
            <span className="text-[#f47920] font-bold text-sm mt-0.5 block font-syne truncate">
              {respondent.email ? 'Direct to Gmail' : 'Via Provided Email'}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Objectives & Likert Scale Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        
        {/* Left: Study Objectives */}
        <div className="lg:col-span-7 pixel-card-white p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--ink-faint)]">
            <FileText className="w-4 h-4 text-[#f47920]" />
            <h2 className="font-syne text-base font-extrabold text-[var(--accent)] uppercase tracking-wide">
              Key Research Objectives & Scope
            </h2>
          </div>

          <div className="mt-5 space-y-4 font-mono text-xs text-[#f2efeb]/80 leading-relaxed">
            {config.keyObjectives.map((obj, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="w-5 h-5 bg-[#003399] text-[var(--accent)] font-bold flex items-center justify-center shrink-0 border border-[var(--ink)] text-[10px]">
                  0{idx + 1}
                </span>
                <span>{obj}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-[var(--ink-faint)] font-mono text-[11px] text-[#f2efeb]/50">
            <span>Conducted by: </span>
            <span className="font-bold text-[#f2efeb]">{config.institution}</span>
          </div>
        </div>

        {/* Right: Likert Scale Gauge Guide */}
        <div className="lg:col-span-5 pixel-card-yellow p-6 sm:p-8">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--ink-faint)]">
            <Compass className="w-4 h-4 text-[#f47920]" />
            <h2 className="font-syne text-base font-extrabold text-[#f2efeb] uppercase tracking-wide">
              The 5-Point Likert Scale
            </h2>
          </div>

          <p className="font-mono text-xs text-[#f2efeb]/70 mt-3 mb-4">
            Evaluate each questionnaire statement using the PNR gauge:
          </p>

          <div className="space-y-2.5 font-mono text-xs">
            {LIKERT_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className="flex items-center justify-between p-2.5 bg-[#111113] border border-[#333] hover:border-[var(--accent)] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-[#f47920] text-black font-syne font-extrabold text-xs flex items-center justify-center shrink-0">
                    {opt.value}
                  </span>
                  <span className="font-bold text-[#f2efeb]">{opt.label}</span>
                </div>
                <span className="text-[10px] text-[#f8c300] font-bold">
                  [{opt.shortLabel}]
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Overview of Questions (Full Preview Accordion) */}
      <div className="pixel-card-orange p-6 sm:p-8 mb-8">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--ink-faint)]">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#f47920]" />
            <h2 className="font-syne text-base font-extrabold text-[#f2efeb] uppercase tracking-wide">
              Questions Overview ({config.questions.length} Items)
            </h2>
          </div>
          <span className="font-mono text-xs text-[var(--accent)]">
            TRANSPARENT ITINERARY
          </span>
        </div>

        <p className="font-mono text-xs text-[#f2efeb]/60 mt-3 mb-4">
          Click any carriage below to preview the exact questionnaire statements:
        </p>

        <div className="space-y-3 font-mono">
          {config.categories.map((category, catIndex) => {
            const categoryQuestions = config.questions.filter((q) => q.category === category);
            const isExpanded = expandedCategory === category;

            return (
              <div
                key={category}
                className="border-2 border-[#333] bg-[#111113] transition-all"
              >
                <button
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-4 hover:bg-[#18181a] transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-[#003399] text-[var(--accent)] font-syne font-bold text-xs flex items-center justify-center border border-[#f2efeb]">
                      C{catIndex + 1}
                    </span>
                    <div>
                      <span className="font-syne font-extrabold text-sm text-[var(--accent)] uppercase block">
                        Carriage {catIndex + 1}: {category}
                      </span>
                      <span className="text-[11px] text-[#f2efeb]/50">
                        {categoryQuestions.length} Items in this construct
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[#f2efeb]/60">
                    <span className="text-[10px] uppercase font-mono hidden sm:inline">
                      {isExpanded ? 'Hide' : 'Inspect'}
                    </span>
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-[var(--accent)]" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="p-4 bg-[#161618] border-t-2 border-[#333] space-y-3">
                    {categoryQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="p-3 bg-[#111113] border border-[#333] flex items-start gap-3 text-xs"
                      >
                        <span className="font-mono text-xs font-bold text-[#f47920] bg-[#f47920]/15 px-2 py-0.5 border border-[#f47920]/40 shrink-0">
                          {q.code}
                        </span>
                        <div>
                          <p className="font-bold text-[#f2efeb] leading-snug">
                            {q.text}
                          </p>
                          {q.description && (
                            <p className="text-[11px] text-[#f2efeb]/50 mt-1">
                              {q.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Action: Proceed to Station 2 */}
      <div className="pixel-card-yellow p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="font-syne text-lg font-extrabold text-[var(--accent)] uppercase block">
            Ready to Board Station 02?
          </span>
          <span className="font-mono text-xs text-[#f2efeb]/70 mt-1 block">
            Next stop: Review the Informed Consent & Participant Charter.
          </span>
        </div>

        <button
          onClick={() => {
            trainAudio.playStationChime();
            onProceedToConsent();
          }}
          className="btn-pixel-action py-4 px-8 text-sm font-syne font-extrabold flex items-center justify-center gap-3 w-full sm:w-auto"
        >
          <span>Proceed to Informed Consent</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
};
