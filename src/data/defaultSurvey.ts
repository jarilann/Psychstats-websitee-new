import { LikertOption, SurveyConfig, SurveyResponse } from '../types/survey';

export const LIKERT_OPTIONS: LikertOption[] = [
  {
    value: 1,
    label: 'Strongly Disagree',
    shortLabel: 'SD',
    description: 'Completely unaligned with your experience'
  },
  {
    value: 2,
    label: 'Disagree',
    shortLabel: 'D',
    description: 'Generally does not reflect your experience'
  },
  {
    value: 3,
    label: 'Neutral',
    shortLabel: 'N',
    description: 'Neither agree nor disagree / impartial'
  },
  {
    value: 4,
    label: 'Agree',
    shortLabel: 'A',
    description: 'Reflects your typical daily experience'
  },
  {
    value: 5,
    label: 'Strongly Agree',
    shortLabel: 'SA',
    description: 'Completely and consistently true for you'
  }
];

export const DEFAULT_SURVEY_CONFIG: SurveyConfig = {
  studyTitle: 'Travel Time and Distance as Factors in Perceived Commute Stress',
  studySubtitle: 'First-year BSMA Psychology and Counseling students, Philippine Normal University',
  institution: 'Philippine Normal University (PNU), Manila',
  researchers: ['Research Team (add your names here)'],
  contactEmail: 'tibonjaja02@gmail.com',
  estimatedMinutes: 5,
  overviewDescription:
    'This survey looks at how the time and distance of your trip to and from PNU relate to how stressful your commute feels. You will give your name, two estimates about your trip, and rate 15 statements on a 5-point scale. There are no right or wrong answers.',
  keyObjectives: [
    'Describe the estimated travel time and distance of students commuting to PNU.',
    'Measure perceived commute stress using a 15-item Likert scale.',
    'Examine how travel time and distance relate to perceived commute stress.'
  ],
  consentPoints: [
    'My participation is voluntary and I may stop at any time without penalty.',
    'My answers will be kept confidential and used only for this academic study, in line with the Data Privacy Act of 2012 (RA 10173).',
    'My answers will be analyzed as grouped statistics and not reported individually.',
    'If I give my email, it is used only to send me a copy of my responses.'
  ],
  dataPrivacyPolicy:
    'Responses are stored in the research team\'s database and are visible only to the researchers. Names and emails are not reported in the study findings. Data is used for this study only.',
  categories: ['Commute Stress'],
  questions: [
    { id: 'q1', code: 'CS-1', category: 'Commute Stress', text: 'Replace with commute stress item 1.' },
    { id: 'q2', code: 'CS-2', category: 'Commute Stress', text: 'Replace with commute stress item 2.' },
    { id: 'q3', code: 'CS-3', category: 'Commute Stress', text: 'Replace with commute stress item 3.' },
    { id: 'q4', code: 'CS-4', category: 'Commute Stress', text: 'Replace with commute stress item 4.' },
    { id: 'q5', code: 'CS-5', category: 'Commute Stress', text: 'Replace with commute stress item 5.' },
    { id: 'q6', code: 'CS-6', category: 'Commute Stress', text: 'Replace with commute stress item 6.' },
    { id: 'q7', code: 'CS-7', category: 'Commute Stress', text: 'Replace with commute stress item 7.' },
    { id: 'q8', code: 'CS-8', category: 'Commute Stress', text: 'Replace with commute stress item 8.' },
    { id: 'q9', code: 'CS-9', category: 'Commute Stress', text: 'Replace with commute stress item 9.' },
    { id: 'q10', code: 'CS-10', category: 'Commute Stress', text: 'Replace with commute stress item 10.' },
    { id: 'q11', code: 'CS-11', category: 'Commute Stress', text: 'Replace with commute stress item 11.' },
    { id: 'q12', code: 'CS-12', category: 'Commute Stress', text: 'Replace with commute stress item 12.' },
    { id: 'q13', code: 'CS-13', category: 'Commute Stress', text: 'Replace with commute stress item 13.' },
    { id: 'q14', code: 'CS-14', category: 'Commute Stress', text: 'Replace with commute stress item 14.' },
    { id: 'q15', code: 'CS-15', category: 'Commute Stress', text: 'Replace with commute stress item 15.' }
  ]
};

// No sample data: only real responses are ever shown or exported.
export const INITIAL_RESPONSES: SurveyResponse[] = [];
