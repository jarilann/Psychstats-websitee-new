import * as XLSX from 'xlsx';
import { Question, SurveyResponse } from '../types/survey';
import { calculateSummaryStats } from './statistics';

export function exportSurveyToExcel(
  studyTitle: string,
  questions: Question[],
  responses: SurveyResponse[]
): void {
  const stats = calculateSummaryStats(questions, responses);

  // 1. Raw Responses Sheet
  const rawData = responses.map((resp, index) => {
    const row: Record<string, string | number> = {
      '#': index + 1,
      'Ticket Number': resp.ticketNumber,
      'Respondent Name': resp.respondent.name,
      'Email / Gmail': resp.respondent.email,
      'Travel Time (min)': resp.respondent.travelMinutes ?? '',
      'Distance (km)': resp.respondent.distanceKm ?? '',
      'Submission Time (UTC)': resp.completedAt,
      'Duration (sec)': resp.durationSeconds,
      'Consent Confirmed': resp.consentAgreed ? 'YES' : 'NO'
    };

    // Add each question's numeric score and text label
    questions.forEach((q) => {
      const val = resp.answers[q.id];
      row[q.code] = val !== undefined ? val : '';
    });
    row['Total Score'] = questions.reduce((sum, q) => sum + (resp.answers[q.id] || 0), 0);

    return row;
  });

  const rawWorksheet = XLSX.utils.json_to_sheet(rawData);

  // 2. Question Statistics Sheet
  const statsData = stats.questionStats.map((qs) => ({
    'Code': qs.code,
    'Category': qs.category,
    'Question Item': qs.text,
    'Sample Size (N)': qs.totalResponses,
    'Mean (μ)': qs.mean,
    'Std Dev (σ)': qs.standardDeviation,
    'Median': qs.median,
    'Mode': qs.mode,
    'Strongly Disagree (1)': qs.counts[1],
    'Disagree (2)': qs.counts[2],
    'Neutral (3)': qs.counts[3],
    'Agree (4)': qs.counts[4],
    'Strongly Agree (5)': qs.counts[5],
    'Positive Agreement (%)': `${qs.positivePercentage}%`,
    'Neutral (%)': `${qs.neutralPercentage}%`,
    'Disagreement (%)': `${qs.negativePercentage}%`
  }));

  const statsWorksheet = XLSX.utils.json_to_sheet(statsData);

  // 3. Category Summary Sheet
  const categoryData = stats.categoryStats.map((cs) => ({
    'Construct / Category': cs.category,
    'Item Count': cs.questionCount,
    'Composite Mean (μ)': cs.overallMean,
    'Std Dev (σ)': cs.standardDeviation
  }));

  const categoryWorksheet = XLSX.utils.json_to_sheet(categoryData);

  // Create workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, rawWorksheet, 'Raw Responses');
  XLSX.utils.book_append_sheet(workbook, statsWorksheet, 'Item Statistics');
  XLSX.utils.book_append_sheet(workbook, categoryWorksheet, 'Category Summary');
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet(questions.map((q) => ({ Code: q.code, Item: q.text }))),
    'Codebook'
  );

  // Format file name
  const cleanDate = new Date().toISOString().split('T')[0];
  const filename = `RailSurvey_Responses_${cleanDate}.xlsx`;

  XLSX.writeFile(workbook, filename);
}

export function exportSurveyToCsv(
  questions: Question[],
  responses: SurveyResponse[]
): void {
  const headers = [
    'Ticket Number',
    'Respondent Name',
    'Email',
    'Travel Minutes',
    'Distance Km',
    'Completed At',
    'Duration Seconds',
    ...questions.map((q) => `${q.code} - ${q.text.replace(/"/g, '""')}`)
  ];

  const rows = responses.map((r) => {
    const qVals = questions.map((q) => r.answers[q.id] ?? '');
    return [
      `"${r.ticketNumber}"`,
      `"${r.respondent.name.replace(/"/g, '""')}"`,
      `"${r.respondent.email}"`,
      r.respondent.travelMinutes ?? '',
      r.respondent.distanceKm ?? '',
      `"${r.completedAt}"`,
      r.durationSeconds,
      ...qVals
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `RailSurvey_Responses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
