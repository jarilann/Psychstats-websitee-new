/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TrainTrackProgress } from './components/TrainTrackProgress';
import { PassengerCheckIn } from './components/PassengerCheckIn';
import { SectionOverview } from './components/SectionOverview';
import { SectionConsent } from './components/SectionConsent';
import { SectionQuestionnaire } from './components/SectionQuestionnaire';
import { SectionArrivalReceipt } from './components/SectionArrivalReceipt';
import { AdminPortal } from './components/AdminPortal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { MovingTrainBackground } from './components/MovingTrainBackground';
import {
  SurveyConfig,
  RespondentInfo,
  SurveyResponse,
  LikertValue
} from './types/survey';
import { DEFAULT_SURVEY_CONFIG, INITIAL_RESPONSES } from './data/defaultSurvey';
import { trainAudio } from './utils/audio';
import { supabase, RESEARCHER_EMAIL } from './utils/supabase';

type AppSection = 'checkin' | 'overview' | 'consent' | 'questionnaire' | 'arrival' | 'admin';

// Used ONLY when Supabase is not configured (local demo). Real use checks the Supabase login.
const DEMO_PASSKEY = 'demo';

export default function App() {
  // Survey configuration
  const [config, setConfig] = useState<SurveyConfig>(() => {
    try {
      const saved = localStorage.getItem('railsurvey_config_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SURVEY_CONFIG;
  });

  // Recorded survey responses
  const [responses, setResponses] = useState<SurveyResponse[]>(() => {
    if (supabase) return []; // real data is loaded from the database after researcher login
    try {
      const saved = localStorage.getItem('railsurvey_responses_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_RESPONSES;
  });

  // Active respondent in progress
  const [respondent, setRespondent] = useState<RespondentInfo>({ name: '', email: '' });

  // Active survey progress state
  const [currentSection, setCurrentSection] = useState<AppSection>('checkin');
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, LikertValue>>({});
  const [surveyStartTime, setSurveyStartTime] = useState<number>(Date.now());
  const [completedResponse, setCompletedResponse] = useState<SurveyResponse | null>(null);

  // Audio mute state
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  // Admin access state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);

  // Save responses whenever they change
  useEffect(() => {
    try {
      if (!supabase) localStorage.setItem('railsurvey_responses_v2', JSON.stringify(responses));
    } catch {
      // ignore
    }
  }, [responses]);

  // Save config
  useEffect(() => {
    try {
      localStorage.setItem('railsurvey_config_v2', JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);


  // Handle passenger check in
  const handleCheckInConfirm = (info: RespondentInfo) => {
    setRespondent(info);
    setSurveyStartTime(Date.now());
    setCurrentSection('overview');
  };

  // Handle answer change
  const handleAnswerChange = (questionId: string, value: LikertValue) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Handle consent agreement
  const handleAgreeConsent = (agreed: boolean, timestamp: string) => {
    setConsentAgreed(agreed);
    setConsentTimestamp(timestamp);
    setCurrentSection('questionnaire');
  };

  // Handle survey submission
  const handleSubmitSurvey = async () => {
    if (!respondent.name.trim() || respondent.travelMinutes === undefined) {
      setCurrentSection('checkin');
      return;
    }
    const finishTime = Date.now();
    const durationSeconds = Math.max(Math.round((finishTime - surveyStartTime) / 1000), 1);
    const randomTicketSuffix = Math.floor(100 + Math.random() * 900);
    const ticketNumber = `RAIL-${Date.now().toString(36).toUpperCase()}-${randomTicketSuffix}`;

    const newResponse: SurveyResponse = {
      id: `resp-${Date.now()}`,
      ticketNumber,
      respondent: {
        name: respondent.name.trim(),
        email: respondent.email,
        travelMinutes: respondent.travelMinutes,
        distanceKm: respondent.distanceKm
      },
      consentAgreed: true,
      consentTimestamp: consentTimestamp || new Date().toISOString(),
      answers,
      startedAt: new Date(surveyStartTime).toISOString(),
      completedAt: new Date(finishTime).toISOString(),
      durationSeconds,
      emailSent: false
    };

    if (supabase) {
      const { error } = await supabase
        .from('survey_responses')
        .insert({ ticket_number: newResponse.ticketNumber, payload: newResponse });
      if (error) {
        alert('Could not send your answers: ' + error.message + '. Check your internet and try again.');
        return;
      }
    }

    setResponses((prev) => [newResponse, ...prev]);
    setCompletedResponse(newResponse);
    setCurrentSection('arrival');
  };

  // Send email copy
  const handleSendEmailCopy = async (_email: string): Promise<boolean> => true;

  // Start new survey for next respondent
  const handleNewSurvey = () => {
    setAnswers({});
    setConsentAgreed(false);
    setCompletedResponse(null);
    setSurveyStartTime(Date.now());
    setRespondent({ name: '', email: '' });
    setCurrentSection('checkin');
  };

  // Delete individual response (for admins)
  const handleDeleteResponse = async (id: string) => {
    const target = responses.find((r) => r.id === id);
    if (supabase && target) {
      const { error } = await supabase.from('survey_responses').delete().eq('ticket_number', target.ticketNumber);
      if (error) {
        alert('Could not delete: ' + error.message);
        return;
      }
    }
    setResponses((prev) => prev.filter((r) => r.id !== id));
  };

  // Load real responses from the database (researchers only)
  const loadResponses = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('survey_responses')
      .select('payload')
      .order('created_at', { ascending: false });
    if (error) {
      alert('Could not load responses: ' + error.message);
      return;
    }
    setResponses((data ?? []).map((row) => row.payload as SurveyResponse));
  };

  // Researcher passkey = password of the researcher account in Supabase
  const verifyPasskey = async (passkey: string): Promise<boolean> => {
    if (!supabase) return passkey === DEMO_PASSKEY;
    const { error } = await supabase.auth.signInWithPassword({ email: RESEARCHER_EMAIL, password: passkey });
    return !error;
  };

  // Navigation guard: no jumping past check-in or consent
  const navigate = (sec: AppSection) => {
    if (sec === 'admin' || sec === 'checkin') return setCurrentSection(sec);
    if (!respondent.name.trim() || respondent.travelMinutes === undefined) return setCurrentSection('checkin');
    if (sec === 'questionnaire' && !consentAgreed) return setCurrentSection('consent');
    if (sec === 'arrival' && !completedResponse) return;
    setCurrentSection(sec);
  };

  // Map section to numeric step for the train track (1: Overview, 2: Consent, 3: Questionnaire, 4: Arrival)
  const getStepNumber = (): number => {
    switch (currentSection) {
      case 'checkin':
      case 'overview':
        return 1;
      case 'consent':
        return 2;
      case 'questionnaire':
        return 3;
      case 'arrival':
        return 4;
      default:
        return 1;
    }
  };

  const handleSelectStation = (step: number) => {
    if (step === 1) navigate('overview');
    else if (step === 2) navigate('consent');
    else if (step === 3 && consentAgreed) navigate('questionnaire');
    else if (step === 4 && completedResponse) navigate('arrival');
  };

  const canNavigateToStep = (step: number): boolean => {
    if (step === 1) return true;
    if (step === 2) return !!respondent.name.trim();
    if (step === 3) return consentAgreed;
    if (step === 4) return !!completedResponse;
    return false;
  };

  return (
    <div className="min-h-screen text-slate-900 flex flex-col font-sans selection:bg-amber-200 relative overflow-x-hidden">
      
      {/* Animated Moving Train Window Scenery Background */}
      <MovingTrainBackground />

      {/* Top Bar Contract Navigation */}
      <Header
        currentSection={currentSection}
        onNavigate={navigate}
        isAudioMuted={isAudioMuted}
        onToggleAudio={() => {
          const next = !isAudioMuted;
          setIsAudioMuted(next);
          trainAudio.setMuted(next);
        }}
        isAdminLoggedIn={isAdminLoggedIn}
        onOpenAdminLogin={() => setIsAdminLoginModalOpen(true)}
        totalResponsesCount={responses.length}
      />

      {/* Train Track Progress Journey (shown when in survey mode) */}
      {currentSection !== 'admin' && (
        <TrainTrackProgress
          currentStep={getStepNumber()}
          totalQuestions={config.questions.length}
          answeredQuestions={Object.keys(answers).length}
          onSelectStation={handleSelectStation}
          canNavigateToStep={canNavigateToStep}
        />
      )}

      {/* Main Content Viewport */}
      <main className="flex-1 relative z-10">
        {currentSection === 'checkin' && (
          <PassengerCheckIn
            initialInfo={respondent}
            onConfirm={handleCheckInConfirm}
            
          />
        )}

        {currentSection === 'overview' && (
          <SectionOverview
            config={config}
            respondent={respondent}
            onProceedToConsent={() => setCurrentSection('consent')}
            onEditPassenger={() => setCurrentSection('checkin')}
          />
        )}

        {currentSection === 'consent' && (
          <SectionConsent
            config={config}
            respondent={respondent}
            onAgreeAndProceed={handleAgreeConsent}
            onBackToOverview={() => setCurrentSection('overview')}
          />
        )}

        {currentSection === 'questionnaire' && (
          <SectionQuestionnaire
            config={config}
            respondent={respondent}
            answers={answers}
            onAnswerChange={handleAnswerChange}
            onSubmitSurvey={handleSubmitSurvey}
            onBackToConsent={() => setCurrentSection('consent')}
          />
        )}

        {currentSection === 'arrival' && completedResponse && (
          <SectionArrivalReceipt
            response={completedResponse}
            config={config}
            onSendEmailCopy={handleSendEmailCopy}
            onNewSurvey={handleNewSurvey}
            onViewResearcherPortal={() => {
              if (isAdminLoggedIn) {
                setCurrentSection('admin');
              } else {
                setIsAdminLoginModalOpen(true);
              }
            }}
          />
        )}

        {currentSection === 'admin' && (
          <AdminPortal
            config={config}
            responses={responses}
            onUpdateConfig={setConfig}
            onDeleteResponse={handleDeleteResponse}
            onResetSeedData={loadResponses}
            onExitAdmin={() => navigate('overview')}
          />
        )}
      </main>

      {/* Admin Passkey Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onVerify={verifyPasskey}
        onSuccess={() => {
          setIsAdminLoggedIn(true);
          loadResponses();
          setIsAdminLoginModalOpen(false);
          setCurrentSection('admin');
        }}
      />

      {/* Variation 15 Pixel Philippine Rail Footer */}
      <footer className="bg-[#0c0c10] border-t-2 border-[var(--ink-faint)] py-5 px-4 sm:px-8 text-[11px] font-mono text-[#f2efeb]/60 z-10 relative">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>SYSTEM STATUS: CRUISING</div>
          <div>PNR-LRT-RSCH ENGINE © 2026</div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)] font-bold uppercase">
              STATION: {currentSection === 'checkin' ? 'MANIFEST CHECK-IN' : currentSection === 'overview' ? 'ROUTE OVERVIEW' : currentSection === 'consent' ? 'ETHICS CONSENT' : currentSection === 'questionnaire' ? 'LIKERT EXPRESS' : currentSection === 'arrival' ? 'TERMINAL ARRIVAL' : 'CONDUCTOR'}
            </span>
            <span>·</span>
            <button
              onClick={() => {
                if (isAdminLoggedIn) {
                  setCurrentSection('admin');
                } else {
                  setIsAdminLoginModalOpen(true);
                }
              }}
              className="text-[#f47920] hover:text-[var(--accent)] font-bold underline cursor-pointer"
            >
              Conductor Gate
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
