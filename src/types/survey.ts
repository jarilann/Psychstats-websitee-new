export type LikertValue = 1 | 2 | 3 | 4 | 5;

export interface LikertOption {
  value: LikertValue;
  label: string;
  shortLabel: string;
  description: string;
}

export interface Question {
  id: string;
  code: string; // e.g. "AW-1", "PC-2"
  category: string;
  text: string;
  description?: string;
  reverseScored?: boolean;
}

export interface SurveyConfig {
  studyTitle: string;
  studySubtitle: string;
  institution: string;
  researchers: string[];
  contactEmail: string;
  estimatedMinutes: number;
  overviewDescription: string;
  keyObjectives: string[];
  consentPoints: string[];
  dataPrivacyPolicy: string;
  categories: string[];
  questions: Question[];
}

export interface RespondentInfo {
  name: string;
  email: string;
  studentId?: string;
  seatNumber?: string;
  travelMinutes?: number; // estimated travel time to and from PNU
  distanceKm?: number; // estimated distance of residence from PNU
}

export interface SurveyResponse {
  id: string;
  ticketNumber: string;
  respondent: RespondentInfo;
  consentAgreed: boolean;
  consentTimestamp: string;
  answers: Record<string, LikertValue>; // questionId -> value
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  emailSent?: boolean;
  emailSentAt?: string;
}

export interface QuestionStat {
  questionId: string;
  code: string;
  category: string;
  text: string;
  totalResponses: number;
  mean: number;
  standardDeviation: number;
  median: number;
  mode: number;
  counts: Record<LikertValue, number>;
  percentages: Record<LikertValue, number>;
  positivePercentage: number; // 4 + 5
  neutralPercentage: number;  // 3
  negativePercentage: number; // 1 + 2
}

export interface CategoryStat {
  category: string;
  questionCount: number;
  overallMean: number;
  standardDeviation: number;
  questions: QuestionStat[];
}

export interface SurveySummaryStats {
  totalRespondents: number;
  completionRate: number;
  averageDurationMinutes: number;
  overallMean: number;
  categoryStats: CategoryStat[];
  questionStats: QuestionStat[];
}
