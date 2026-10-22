import React from 'react';

interface TrainTrackProgressProps {
  currentStep: number; // 1: Overview, 2: Consent, 3: Questionnaire, 4: Arrival
  totalQuestions: number;
  answeredQuestions: number;
  onSelectStation?: (step: number) => void;
  canNavigateToStep?: (step: number) => boolean;
}

export const TrainTrackProgress: React.FC<TrainTrackProgressProps> = ({
  currentStep,
  totalQuestions,
  answeredQuestions,
  onSelectStation,
  canNavigateToStep
}) => {
  const stations = [
    { step: 1, title: 'Vito Cruz', code: 'STN-01', subtitle: 'Check-in & Overview' },
    { step: 2, title: 'Quirino', code: 'STN-02', subtitle: 'Informed Consent' },
    { step: 3, title: 'Pedro Gil', code: 'STN-03', subtitle: 'Likert Questionnaire' },
    { step: 4, title: 'United Nations', code: 'STN-04', subtitle: 'Final Destination & Ticket' }
  ];

  let trackPercent = 0;
  if (currentStep === 1) {
    trackPercent = 12;
  } else if (currentStep === 2) {
    trackPercent = 38;
  } else if (currentStep === 3) {
    const qFraction = totalQuestions > 0 ? answeredQuestions / totalQuestions : 0;
    trackPercent = 38 + (qFraction * 40);
  } else if (currentStep >= 4) {
    trackPercent = 100;
  }

  return (
    <div className="w-full bg-[#111113]/90 border-b-2 border-[var(--ink-faint)] py-4 px-4 sm:px-8 text-[var(--ink)]">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Track Line & PNR Mini Train Marker */}
        <div className="relative pt-4 pb-2">
          
          <div className="relative h-6 flex items-center">
            {/* Repeating pixel sleeper ballast */}
            <div
              className="absolute inset-x-0 h-4 opacity-40 pointer-events-none"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(90deg, #555 0px, #555 4px, transparent 4px, transparent 20px)'
              }}
            />
            {/* Top and bottom steel rails */}
            <div className="absolute inset-x-0 top-1 h-[2px] bg-[#444]" />
            <div className="absolute inset-x-0 bottom-1 h-[2px] bg-[#444]" />

            {/* Traversed Rail in PNR Orange / Yellow */}
            <div
              className="absolute left-0 top-1 h-[2px] bg-[var(--accent)] transition-all duration-300"
              style={{ width: `${Math.min(trackPercent, 100)}%` }}
            />
            <div
              className="absolute left-0 bottom-1 h-[2px] bg-[#f47920] transition-all duration-300"
              style={{ width: `${Math.min(trackPercent, 100)}%` }}
            />

            {/* PNR Mini Train Indicator on Track */}
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 z-20"
              style={{ left: `${Math.min(Math.max(trackPercent, 4), 96)}%` }}
            >
              <div className="px-2 py-0.5 bg-[#003399] border border-[#f2efeb] text-[10px] font-mono font-bold text-[var(--accent)] shadow-[2px_2px_0px_#f47920] flex items-center gap-1">
                <span>PNR</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#f8c300] animate-pulse" />
              </div>
            </div>
          </div>

          {/* 4 Station Nodes from Variation 15 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {stations.map((st) => {
              const isPast = currentStep > st.step;
              const isCurrent = currentStep === st.step;
              const isClickable = canNavigateToStep ? canNavigateToStep(st.step) : true;

              return (
                <button
                  key={st.step}
                  onClick={() => {
                    if (isClickable && onSelectStation) {
                      onSelectStation(st.step);
                    }
                  }}
                  disabled={!isClickable}
                  className={`text-left p-2.5 border transition-all flex flex-col ${
                    isCurrent
                      ? 'bg-[#18181a] border-[var(--accent)] shadow-[4px_4px_0px_#f47920]'
                      : isPast
                      ? 'bg-[#141416] border-[#333] hover:border-[#666]'
                      : 'bg-[#111113] border-[#222] opacity-40'
                  } ${!isClickable ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-2">
                    {/* Variation 15 square pixel station node */}
                    <div
                      className={`w-3.5 h-3.5 border-2 ${
                        isCurrent
                          ? 'border-[var(--accent)] bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]'
                          : isPast
                          ? 'border-[#f47920] bg-[#f47920]'
                          : 'border-[#666] bg-transparent'
                      }`}
                    />
                    <span className="font-mono text-[10px] text-[#f47920] font-bold">
                      {st.code}
                    </span>
                    <span
                      className={`font-syne text-xs uppercase font-extrabold truncate ${
                        isCurrent ? 'text-[var(--accent)]' : 'text-[#f2efeb]'
                      }`}
                    >
                      {st.title}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-[#f2efeb]/50 mt-1 pl-5 truncate">
                    {st.step === 3 && currentStep === 3
                      ? `${answeredQuestions} of ${totalQuestions} answered`
                      : st.subtitle}
                  </span>
                </button>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
