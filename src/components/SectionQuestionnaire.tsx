import React, { useState, useEffect } from 'react';
import { Check, ArrowRight, ArrowLeft, AlertCircle, HelpCircle, Sparkles } from 'lucide-react';
import { SurveyConfig, LikertValue, RespondentInfo } from '../types/survey';
import { LIKERT_OPTIONS } from '../data/defaultSurvey';
import { trainAudio } from '../utils/audio';

interface SectionQuestionnaireProps {
  config: SurveyConfig;
  respondent: RespondentInfo;
  answers: Record<string, LikertValue>;
  onAnswerChange: (questionId: string, value: LikertValue) => void;
  onSubmitSurvey: () => void;
  onBackToConsent: () => void;
}

export const SectionQuestionnaire: React.FC<SectionQuestionnaireProps> = ({
  config,
  respondent,
  answers,
  onAnswerChange,
  onSubmitSurvey,
  onBackToConsent
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAllView, setShowAllView] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalQuestions = config.questions.length;
  const currentQ = config.questions[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Keyboard navigation for Likert choices (1-5) and Prev/Next arrows
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return;
      }

      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const val = parseInt(e.key, 10) as LikertValue;
        handleSelectValue(currentQ.id, val);
      } else if (e.key === 'ArrowRight' && currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentQuestionIndex > 0) {
        setCurrentQuestionIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestionIndex, currentQ, totalQuestions]);

  const handleSelectValue = (qId: string, val: LikertValue) => {
    trainAudio.playOptionSelect(val);
    onAnswerChange(qId, val);
    setValidationError(null);

    if (!showAllView && currentQuestionIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 200);
    }
  };

  const handleFinalSubmit = () => {
    const unanswered = config.questions.filter((q) => answers[q.id] === undefined);
    if (unanswered.length > 0) {
      setValidationError(
        `Incomplete transit: ${unanswered.length} unanswered statement(s) remaining (e.g. ${unanswered[0].code}). Please complete all items before arriving at the terminal.`
      );
      const firstUnansweredIndex = config.questions.findIndex((q) => answers[q.id] === undefined);
      if (firstUnansweredIndex !== -1 && !showAllView) {
        setCurrentQuestionIndex(firstUnansweredIndex);
      }
      return;
    }

    setValidationError(null);
    trainAudio.playTicketPunch();
    trainAudio.playStationChime();
    onSubmitSurvey();
  };

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Header Car Banner (Variation 15 Pixel Card) */}
      <div className="pixel-card-orange p-6 sm:p-8 mb-8 text-[var(--ink)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] tracking-[0.2em] uppercase font-bold">
              <span className="w-2.5 h-2.5 bg-[#f47920] inline-block" />
              <span>STATION 03 · RESEARCH QUESTIONNAIRE</span>
            </div>
            <h1 className="font-syne text-2xl sm:text-4xl font-extrabold text-[var(--accent)] uppercase mt-1">
              Likert Rating Express
            </h1>
          </div>

          {/* Mode Switch: Focus Car View vs All Questions */}
          <div className="flex items-center gap-1 p-1 bg-[#111113] border-2 border-[#444] text-xs font-mono self-start sm:self-auto">
            <button
              onClick={() => setShowAllView(false)}
              className={`px-3 py-1.5 transition-colors uppercase font-bold cursor-pointer ${
                !showAllView ? 'bg-[var(--accent)] text-black' : 'text-[#f2efeb]/60 hover:text-white'
              }`}
            >
              Focus Mode
            </button>
            <button
              onClick={() => setShowAllView(true)}
              className={`px-3 py-1.5 transition-colors uppercase font-bold cursor-pointer ${
                showAllView ? 'bg-[var(--accent)] text-black' : 'text-[#f2efeb]/60 hover:text-white'
              }`}
            >
              All 12 Items
            </button>
          </div>
        </div>

        {/* PNR Locomotive Speed & HUD */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[var(--ink-faint)] font-mono text-xs">
          {/* Speedometer */}
          <div className="bg-[#111113] p-3 border border-[#333] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#f2efeb]/50 uppercase block">PNR Train Speed</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-syne font-extrabold text-2xl text-[var(--accent)] tabular-nums">
                  {Math.round(25 + (answeredCount / totalQuestions) * 95)}
                </span>
                <span className="text-[11px] text-[#f2efeb]/50">km/h</span>
              </div>
            </div>
            <div className="w-10 h-10 border-2 border-[#555] bg-[#18181a] flex items-center justify-center relative overflow-hidden">
              <div
                className="w-1 h-4 bg-[#f47920] origin-bottom transition-transform duration-300"
                style={{
                  transform: `rotate(${Math.min((answeredCount / totalQuestions) * 180 - 90, 90)}deg)`
                }}
              />
            </div>
          </div>

          {/* Pressure & Steam */}
          <div className="bg-[#111113] p-3 border border-[#333] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#f2efeb]/50 uppercase block">Boiler Pressure</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-syne font-extrabold text-2xl text-[#f47920] tabular-nums">
                  {Math.round(80 + (answeredCount / totalQuestions) * 60)}
                </span>
                <span className="text-[11px] text-[#f2efeb]/50">PSI</span>
              </div>
            </div>
            <button
              onClick={() => trainAudio.playSteamRelease()}
              className="px-2.5 py-1 bg-[#18181a] hover:bg-[var(--accent)] hover:text-black border border-[#f2efeb]/50 text-[10px] uppercase font-bold cursor-pointer transition-colors"
              title="Vent valve"
            >
              Vent 💨
            </button>
          </div>

          {/* Track Condition */}
          <div className="bg-[#111113] p-3 border border-[#333] flex flex-col justify-center">
            <span className="text-[10px] text-[#f2efeb]/50 uppercase block">Track Trajectory</span>
            <span className="font-bold text-xs text-[var(--accent)] truncate mt-0.5 uppercase">
              {answeredCount === 0
                ? 'Departing Station · All Signals Clear'
                : answeredCount < 6
                ? 'Cruising Main Line · Steady Pace'
                : answeredCount < 12
                ? 'Approaching Terminal Concourse'
                : 'All 12 Punches Validated! 🏁'}
            </span>
          </div>
        </div>

        {/* Real-time Progress Bar */}
        <div className="mt-6 pt-4 border-t border-[var(--ink-faint)] font-mono">
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="text-[#f2efeb]/70">
              Answered <strong className="text-[var(--accent)] font-bold">{answeredCount}</strong> of {totalQuestions} Questions
            </span>
            <span className="text-[var(--accent)] font-bold">
              {progressPercent}% COMPLETE
            </span>
          </div>
          <div className="w-full h-3 bg-[#111113] border-2 border-[#444] p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#f47920] to-[var(--accent)] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Perforated Pixel Punch Strip */}
        <div className="mt-5 pt-4 border-t border-[var(--ink-faint)] font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#f2efeb]/60 uppercase mb-2">
            <span>TICKET PUNCH HOLES:</span>
            <span>Click to jump</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {config.questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentQuestionIndex === idx && !showAllView;

              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setShowAllView(false);
                    trainAudio.playTicketPunch();
                  }}
                  className={`px-3 py-1.5 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 border-2 ${
                    isCurrent
                      ? 'bg-[var(--accent)] text-black border-[var(--ink)] shadow-[3px_3px_0px_#f47920]'
                      : isAnswered
                      ? 'bg-[#003399]/60 text-[var(--accent)] border-[#003399]'
                      : 'bg-[#111113] border-[#333] text-[#f2efeb]/40 hover:border-[#666]'
                  }`}
                  title={`${q.code}: ${q.text.slice(0, 40)}...`}
                >
                  <span
                    className={`w-2 h-2 ${
                      isAnswered
                        ? 'bg-[var(--accent)]'
                        : 'bg-transparent border border-[#555]'
                    }`}
                  />
                  <span>Q{idx + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {validationError && (
        <div className="mb-6 p-4 bg-rose-950/80 border-2 border-rose-500 font-mono text-xs font-bold text-rose-200 flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* SINGLE QUESTION FOCUS MODE */}
      {!showAllView ? (
        <div className="pixel-card-white p-6 sm:p-10">
          
          {/* Question Metadata */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--ink-faint)] font-mono">
            <div className="flex items-center gap-3">
              <span className="font-bold text-xs bg-[#f47920] text-black px-2.5 py-0.5 font-mono">
                {currentQ.code}
              </span>
              <span className="text-xs uppercase text-[#f2efeb]/60">
                Carriage: <strong className="text-[var(--accent)]">{currentQ.category}</strong>
              </span>
            </div>

            <span className="text-xs text-[#f2efeb]/50">
              STATEMENT {currentQuestionIndex + 1} / {totalQuestions}
            </span>
          </div>

          {/* Question Statement */}
          <div className="my-8">
            <h2 className="font-syne text-xl sm:text-3xl font-extrabold text-[#f2efeb] uppercase leading-snug">
              "{currentQ.text}"
            </h2>
            {currentQ.description && (
              <p className="font-mono text-xs text-[#f2efeb]/60 mt-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#f47920] shrink-0" />
                <span>{currentQ.description}</span>
              </p>
            )}
          </div>

          {/* 5-Point Likert Scale Buttons (Pixel Philippine Rail Metaphor) */}
          <div className="mt-8 font-mono">
            <div className="text-xs uppercase text-[#f47920] font-bold mb-4 flex items-center justify-between">
              <span>Select rating dial:</span>
              <span className="text-[#f2efeb]/40 text-[11px] hidden sm:inline">
                Shortcuts: Press keys 1 through 5 on your keyboard
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3.5">
              {LIKERT_OPTIONS.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.value;
                const engineSignal = [
                  { signal: 'Full Brake', icon: '🛑' },
                  { signal: 'Decelerate', icon: '🔻' },
                  { signal: 'Neutral Coast', icon: '⚖️' },
                  { signal: 'Clear Line', icon: '🟢' },
                  { signal: 'Full Steam', icon: '🚀' }
                ][opt.value - 1];

                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectValue(currentQ.id, opt.value)}
                    className={`p-4 border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center relative overflow-hidden active:scale-95 ${
                      isSelected
                        ? 'bg-[#18181a] border-[var(--accent)] shadow-[6px_6px_0px_#f47920]'
                        : 'bg-[#111113] border-[#333] hover:border-[#f2efeb] hover:bg-[#161618]'
                    }`}
                  >
                    {/* Key badge */}
                    <span className="absolute top-2 right-2 text-[9px] font-mono px-1.5 py-0.5 bg-[#222] border border-[#444] text-[#f2efeb]/70">
                      KEY {opt.value}
                    </span>

                    {/* Numeric Value in PNR box */}
                    <div
                      className={`w-12 h-12 font-syne text-lg font-extrabold flex items-center justify-center transition-transform ${
                        isSelected
                          ? 'bg-[var(--accent)] text-black shadow-[2px_2px_0px_#f47920]'
                          : 'bg-[#222] text-[#f2efeb] border border-[#555]'
                      }`}
                    >
                      {opt.value}
                    </div>

                    <div className="mt-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider block text-[#f47920] font-bold">
                        {engineSignal.icon} {engineSignal.signal}
                      </span>
                      <span
                        className={`font-syne text-xs uppercase font-extrabold block mt-1 ${
                          isSelected ? 'text-[var(--accent)]' : 'text-[#f2efeb]'
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-[#f2efeb]/50 block mt-1 line-clamp-2">
                        {opt.description}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="mt-3 text-black bg-[var(--accent)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Selected
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-10 pt-6 border-t border-[var(--ink-faint)] flex items-center justify-between font-mono">
            <button
              onClick={() => {
                if (currentQuestionIndex > 0) {
                  setCurrentQuestionIndex((prev) => prev - 1);
                } else {
                  onBackToConsent();
                }
              }}
              className="px-5 py-3 bg-[#18181a] border-2 border-[#555] hover:border-[#f2efeb] text-[#f2efeb] text-xs font-bold uppercase flex items-center gap-2 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{currentQuestionIndex > 0 ? 'Previous Item' : 'Back to Consent'}</span>
            </button>

            {currentQuestionIndex < totalQuestions - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="btn-pixel-action px-6 py-3 text-xs uppercase flex items-center gap-2 cursor-pointer"
              >
                <span>Next Item</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                className="btn-pixel-action px-8 py-3.5 text-xs font-syne font-extrabold uppercase flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#f47920]" />
                <span>Submit & Receive Receipt</span>
              </button>
            )}
          </div>

        </div>
      ) : (
        /* ALL QUESTIONS LIST VIEW */
        <div className="space-y-6">
          {config.categories.map((cat) => {
            const catQuestions = config.questions.filter((q) => q.category === cat);

            return (
              <div key={cat} className="pixel-card-white p-6 sm:p-8">
                <div className="pb-3 border-b border-[var(--ink-faint)] mb-4 font-mono">
                  <span className="text-[10px] uppercase tracking-wider text-[#f47920] block font-bold">
                    Carriage Section
                  </span>
                  <h2 className="font-syne text-lg font-extrabold text-[var(--accent)] uppercase">{cat}</h2>
                </div>

                <div className="space-y-6">
                  {catQuestions.map((q) => {
                    const currentVal = answers[q.id];

                    return (
                      <div key={q.id} className="p-4 bg-[#111113] border-2 border-[#333]">
                        <div className="flex items-start gap-3 mb-3 font-mono">
                          <span className="text-xs font-bold text-black bg-[#f47920] px-2 py-0.5 shrink-0">
                            {q.code}
                          </span>
                          <p className="font-bold text-xs text-[#f2efeb] leading-snug">
                            {q.text}
                          </p>
                        </div>

                        {/* Likert Buttons Row */}
                        <div className="grid grid-cols-5 gap-2 mt-3 font-mono">
                          {LIKERT_OPTIONS.map((opt) => {
                            const isSelected = currentVal === opt.value;

                            return (
                              <button
                                key={opt.value}
                                onClick={() => handleSelectValue(q.id, opt.value)}
                                className={`py-3 px-1 text-center border-2 transition-all cursor-pointer flex flex-col items-center justify-center ${
                                  isSelected
                                    ? 'bg-[var(--accent)] text-black border-[#f2efeb] font-bold shadow-[2px_2px_0px_#f47920]'
                                    : 'bg-[#18181a] border-[#333] text-[#f2efeb] hover:border-[#666]'
                                }`}
                              >
                                <span className="text-sm font-syne font-extrabold">{opt.value}</span>
                                <span className="text-[9px] uppercase font-bold truncate max-w-full block">
                                  {opt.shortLabel}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="pixel-card-yellow p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <span className="font-mono text-xs text-[#f2efeb]/70">
              Completed <strong className="text-[var(--accent)]">{answeredCount}</strong> of {totalQuestions} statements.
            </span>

            <button
              onClick={handleFinalSubmit}
              className="btn-pixel-action py-4 px-8 text-sm font-syne font-extrabold flex items-center justify-center gap-3 w-full sm:w-auto uppercase cursor-pointer"
            >
              <Sparkles className="w-5 h-5 text-[#f47920]" />
              <span>Complete Survey & Dispatch Receipt</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
