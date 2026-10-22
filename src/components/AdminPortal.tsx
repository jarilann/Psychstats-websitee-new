import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  BarChart3,
  Users,
  Clock,
  CheckCircle2,
  Search,
  Trash2,
  Eye,
  LogOut,
  RefreshCw,
  Plus,
  Sliders,
  Filter,
  X,
  FileText
} from 'lucide-react';
import { SurveyConfig, SurveyResponse, QuestionStat } from '../types/survey';
import { calculateSummaryStats, getLikertInterpretation } from '../utils/statistics';
import { exportSurveyToExcel, exportSurveyToCsv } from '../utils/excelExport';
import { LIKERT_OPTIONS } from '../data/defaultSurvey';
import { trainAudio } from '../utils/audio';

interface AdminPortalProps {
  config: SurveyConfig;
  responses: SurveyResponse[];
  onUpdateConfig: (newConfig: SurveyConfig) => void;
  onDeleteResponse: (responseId: string) => void;
  onResetSeedData: () => void;
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  config,
  responses,
  onUpdateConfig,
  onDeleteResponse,
  onResetSeedData,
  onExitAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'responses' | 'settings'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Compute live statistical metrics
  const stats = calculateSummaryStats(config.questions, responses);

  const handleExportExcel = () => {
    trainAudio.playTicketPunch();
    exportSurveyToExcel(config.studyTitle, config.questions, responses);
    setExportNotice('Excel workbook (.xlsx) successfully generated and downloaded!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const handleExportCsv = () => {
    trainAudio.playTicketPunch();
    exportSurveyToCsv(config.questions, responses);
    setExportNotice('CSV dataset file successfully downloaded!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Filtered respondents
  const filteredResponses = responses.filter((r) => {
    const query = searchQuery.toLowerCase();
    return (
      r.respondent.name.toLowerCase().includes(query) ||
      r.respondent.email.toLowerCase().includes(query) ||
      r.ticketNumber.toLowerCase().includes(query) ||
      (r.respondent.studentId && r.respondent.studentId.toLowerCase().includes(query))
    );
  });

  // Filtered question statistics
  const filteredQuestions =
    selectedCategoryFilter === 'all'
      ? stats.questionStats
      : stats.questionStats.filter((q) => q.category === selectedCategoryFilter);

  // Identify highest and lowest rated questions
  const sortedByMean = [...stats.questionStats].sort((a, b) => b.mean - a.mean);
  const highestItem = sortedByMean[0];
  const lowestItem = sortedByMean[sortedByMean.length - 1];

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-8 py-8 sm:py-12">
      
      {/* Admin Conductor Header */}
      <div className="pixel-card-orange p-6 sm:p-10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6 text-[var(--ink)]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent)] tracking-[0.2em] uppercase font-bold">
            <FileSpreadsheet className="w-4 h-4 text-[#f47920]" />
            <span>PNR CONDUCTOR CONSOLE · RESTRICTED ACCESS</span>
          </div>
          <h1 className="font-syne text-2xl sm:text-4xl font-extrabold text-[var(--accent)] uppercase mt-1">
            Survey Analytics & Excel Export
          </h1>
          <p className="font-mono text-xs sm:text-sm text-[#f2efeb]/70 mt-1 max-w-2xl">
            Quantitative analysis dashboard for {config.studyTitle}.
            Export raw classmate records and Likert statistics directly to Microsoft Excel.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="btn-pixel-action px-5 py-3 text-xs font-syne font-extrabold uppercase flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-[#f47920]" />
            <span>Export to Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="px-4 py-3 bg-[#111113] border-2 border-[#555] hover:border-[#f2efeb] text-[#f2efeb] font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Export CSV</span>
          </button>

          <button
            onClick={onExitAdmin}
            className="px-4 py-3 bg-[#111113] border-2 border-rose-500/80 hover:bg-rose-950 text-rose-300 font-mono text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Exit Researcher Portal"
          >
            <LogOut className="w-4 h-4" />
            <span>Exit</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="mb-6 p-4 bg-emerald-950/80 border-2 border-emerald-500 font-mono text-xs font-bold text-emerald-200 flex items-center justify-between">
          <span>{exportNotice}</span>
          <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b-2 border-[var(--ink-faint)] mb-8 font-mono">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-5 text-xs sm:text-sm font-bold uppercase transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-0.5 ${
            activeTab === 'analytics'
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[#f2efeb]/50 hover:text-[#f2efeb]'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-[#f47920]" />
          <span>Summary Statistics ({stats.questionStats.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('responses')}
          className={`pb-3 px-5 text-xs sm:text-sm font-bold uppercase transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-0.5 ${
            activeTab === 'responses'
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[#f2efeb]/50 hover:text-[#f2efeb]'
          }`}
        >
          <Users className="w-4 h-4 text-[#f47920]" />
          <span>Respondent Manifest ({responses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 px-5 text-xs sm:text-sm font-bold uppercase transition-colors flex items-center gap-2 cursor-pointer border-b-2 -mb-0.5 ${
            activeTab === 'settings'
              ? 'border-[var(--accent)] text-[var(--accent)]'
              : 'border-transparent text-[#f2efeb]/50 hover:text-[#f2efeb]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#f47920]" />
          <span>Study Configuration</span>
        </button>
      </div>

      {/* TAB 1: SUMMARY STATISTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key Metric KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total Sample Size (N)</span>
                <Users className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {stats.totalRespondents}
              </div>
              <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
                100% Informed Consent Rate
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Overall Likert Mean (μ)</span>
                <BarChart3 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {stats.overallMean.toFixed(2)}
                <span className="text-xs text-slate-400 font-normal ml-1">/ 5.0</span>
              </div>
              <div className="text-[11px] font-semibold mt-1">
                <span className={getLikertInterpretation(stats.overallMean).colorClass}>
                  {getLikertInterpretation(stats.overallMean).level} Agreement
                </span>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Avg Travel Duration</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {stats.averageDurationMinutes}
                <span className="text-xs text-slate-400 font-normal ml-1">min</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Approx {Math.round(stats.averageDurationMinutes * 60)} seconds per survey
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Research Constructs</span>
                <FileText className="w-4 h-4 text-amber-600" />
              </div>
              <div className="mt-2 text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                {stats.categoryStats.length}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Covering {stats.questionStats.length} Likert questions
              </div>
            </div>

          </div>

          {/* Construct / Category Performance Comparison */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center justify-between">
              <span>Category / Construct Means</span>
              <span className="text-xs font-normal text-slate-500">1 (SD) to 5 (SA) Scale</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              {stats.categoryStats.map((cat) => {
                const interp = getLikertInterpretation(cat.overallMean);

                return (
                  <div key={cat.category} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {cat.questionCount} Questions
                    </span>
                    <h3 className="font-bold text-xs text-slate-900 mt-0.5 truncate">
                      {cat.category}
                    </h3>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-xl font-bold font-mono text-slate-900 tabular-nums">
                        {cat.overallMean.toFixed(2)}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        (σ = {cat.standardDeviation.toFixed(2)})
                      </span>
                    </div>
                    <div className="mt-1 text-[11px] font-semibold">
                      <span className={interp.colorClass}>{interp.verdict}</span>
                    </div>

                    {/* Mini progress bar */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full mt-2.5 overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(cat.overallMean / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Filter for Item-Level Breakdown */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Item-by-Item Likert Statistics & Distribution
              </h2>
              <p className="text-xs text-slate-500">
                Mean (μ), Standard Deviation (σ), Median, and frequency distribution bars
              </p>
            </div>

            {/* Category Filter segmented control */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs self-start sm:self-auto overflow-x-auto max-w-full">
              <button
                onClick={() => setSelectedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategoryFilter === 'all'
                    ? 'bg-white text-slate-900 font-bold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Items
              </button>
              {config.categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCategoryFilter === cat
                      ? 'bg-white text-slate-900 font-bold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {cat.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Question Cards with Stacked Bar Likert Distributions */}
          <div className="space-y-4">
            {filteredQuestions.map((qs) => {
              const interp = getLikertInterpretation(qs.mean);

              return (
                <div
                  key={qs.questionId}
                  className="bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded shrink-0">
                        {qs.code}
                      </span>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900">
                          {qs.text}
                        </h3>
                        <span className="text-[11px] text-slate-500">
                          Carriage: {qs.category} · Sample size N = {qs.totalResponses}
                        </span>
                      </div>
                    </div>

                    {/* Numerical Stats Badge */}
                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70 text-xs font-mono">
                      <div>
                        <span className="text-[10px] text-slate-400 block">MEAN (μ)</span>
                        <span className="font-bold text-slate-900 tabular-nums">{qs.mean.toFixed(2)}</span>
                      </div>
                      <div className="border-l border-slate-200 pl-2">
                        <span className="text-[10px] text-slate-400 block">STD DEV (σ)</span>
                        <span className="text-slate-700 tabular-nums">{qs.standardDeviation.toFixed(2)}</span>
                      </div>
                      <div className="border-l border-slate-200 pl-2">
                        <span className="text-[10px] text-slate-400 block">MEDIAN</span>
                        <span className="text-slate-700 tabular-nums">{qs.median}</span>
                      </div>
                      <div className="border-l border-slate-200 pl-2">
                        <span className="text-[10px] text-slate-400 block">MODE</span>
                        <span className="text-slate-700 tabular-nums">{qs.mode}</span>
                      </div>
                    </div>
                  </div>

                  {/* Likert Stacked Distribution Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="text-rose-600 font-semibold">
                          Disagree: {qs.negativePercentage}%
                        </span>
                        <span className="text-slate-500">
                          Neutral: {qs.neutralPercentage}%
                        </span>
                        <span className="text-emerald-700 font-semibold">
                          Agree: {qs.positivePercentage}%
                        </span>
                      </div>
                      <span className={`text-[11px] font-semibold ${interp.colorClass}`}>
                        {interp.verdict}
                      </span>
                    </div>

                    {/* Multi-segment frequency bar */}
                    <div className="w-full h-3 bg-slate-100 rounded-full flex overflow-hidden">
                      <div
                        className="bg-rose-500 hover:opacity-90 transition-all"
                        style={{ width: `${qs.percentages[1]}%` }}
                        title={`Strongly Disagree: ${qs.counts[1]} (${qs.percentages[1]}%)`}
                      />
                      <div
                        className="bg-orange-400 hover:opacity-90 transition-all"
                        style={{ width: `${qs.percentages[2]}%` }}
                        title={`Disagree: ${qs.counts[2]} (${qs.percentages[2]}%)`}
                      />
                      <div
                        className="bg-slate-300 hover:opacity-90 transition-all"
                        style={{ width: `${qs.percentages[3]}%` }}
                        title={`Neutral: ${qs.counts[3]} (${qs.percentages[3]}%)`}
                      />
                      <div
                        className="bg-emerald-400 hover:opacity-90 transition-all"
                        style={{ width: `${qs.percentages[4]}%` }}
                        title={`Agree: ${qs.counts[4]} (${qs.percentages[4]}%)`}
                      />
                      <div
                        className="bg-emerald-600 hover:opacity-90 transition-all"
                        style={{ width: `${qs.percentages[5]}%` }}
                        title={`Strongly Agree: ${qs.counts[5]} (${qs.percentages[5]}%)`}
                      />
                    </div>

                    {/* Numeric breakdown per option */}
                    <div className="grid grid-cols-5 gap-2 mt-3 pt-2 border-t border-slate-50 text-[11px] text-center">
                      <div className="text-rose-700">
                        <span className="block font-bold">1: SD</span>
                        <span>{qs.counts[1]} ({qs.percentages[1]}%)</span>
                      </div>
                      <div className="text-orange-700">
                        <span className="block font-bold">2: D</span>
                        <span>{qs.counts[2]} ({qs.percentages[2]}%)</span>
                      </div>
                      <div className="text-slate-600">
                        <span className="block font-bold">3: N</span>
                        <span>{qs.counts[3]} ({qs.percentages[3]}%)</span>
                      </div>
                      <div className="text-emerald-700">
                        <span className="block font-bold">4: A</span>
                        <span>{qs.counts[4]} ({qs.percentages[4]}%)</span>
                      </div>
                      <div className="text-emerald-800">
                        <span className="block font-bold">5: SA</span>
                        <span>{qs.counts[5]} ({qs.percentages[5]}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 2: RESPONDENT REGISTRY */}
      {activeTab === 'responses' && (
        <div className="space-y-6">
          
          {/* Search & Utility Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search respondent name, email, or ticket #..."
                className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Excel</span>
              </button>

              <button
                onClick={onResetSeedData}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Reload responses from the database"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Responses Data Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <tr>
                    <th className="py-3 px-4">Ticket</th>
                    <th className="py-3 px-4">Respondent</th>
                    <th className="py-3 px-4">Gmail / Contact</th>
                    <th className="py-3 px-4">Seat / Car</th>
                    <th className="py-3 px-4">Submission Time</th>
                    <th className="py-3 px-4 text-center">Avg Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResponses.length > 0 ? (
                    filteredResponses.map((r) => {
                      const ansVals = Object.values(r.answers);
                      const avg =
                        ansVals.length > 0
                          ? (ansVals.reduce((a, b) => a + b, 0) / ansVals.length).toFixed(2)
                          : '0.00';

                      return (
                        <tr key={r.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-amber-700">
                            {r.ticketNumber}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {r.respondent.name}
                            {r.respondent.studentId && (
                              <span className="block text-[10px] text-slate-400 font-normal">
                                ID: {r.respondent.studentId}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                            {r.respondent.email}
                          </td>
                          <td className="py-3 px-4 text-slate-600">
                            {r.respondent.seatNumber || 'Standard'}
                          </td>
                          <td className="py-3 px-4 text-slate-500 tabular-nums">
                            {new Date(r.completedAt).toLocaleDateString()} {new Date(r.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold tabular-nums">
                            <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                              {avg}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right space-x-2">
                            <button
                              onClick={() => setSelectedResponse(r)}
                              className="text-slate-600 hover:text-slate-900 font-semibold underline text-xs cursor-pointer inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete response for ${r.respondent.name}?`)) {
                                  onDeleteResponse(r.id);
                                }
                              }}
                              className="text-rose-600 hover:text-rose-800 cursor-pointer p-1 rounded"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                        No responses match your search criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
              <span>Showing {filteredResponses.length} of {responses.length} total respondent entries</span>
              <span>Encrypted local storage store</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: STUDY CONFIG & QUESTIONNAIRE SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Study Protocol & Questionnaire Configuration
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize the title, institutional department, contact email, and questionnaire items for your study.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700">Study Title</label>
              <input
                type="text"
                value={config.studyTitle}
                onChange={(e) => onUpdateConfig({ ...config, studyTitle: e.target.value })}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Institution / Department</label>
              <input
                type="text"
                value={config.institution}
                onChange={(e) => onUpdateConfig({ ...config, institution: e.target.value })}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Researcher Contact Email</label>
              <input
                type="email"
                value={config.contactEmail}
                onChange={(e) => onUpdateConfig({ ...config, contactEmail: e.target.value })}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700">Estimated Minutes</label>
              <input
                type="number"
                value={config.estimatedMinutes}
                onChange={(e) => onUpdateConfig({ ...config, estimatedMinutes: Number(e.target.value) || 5 })}
                className="mt-1 w-full px-3.5 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 mb-3">
              Survey Question Items ({config.questions.length})
            </h3>
            <div className="space-y-3">
              {config.questions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded text-[10px]">
                        {q.code}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">{q.category}</span>
                    </div>
                    <p className="font-medium text-slate-800">{q.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Individual Response Inspection Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
              <div>
                <div className="text-[10px] font-mono text-amber-400">BOARDING PASS INSPECTION</div>
                <h3 className="text-sm font-bold text-white">
                  Ticket #{selectedResponse.ticketNumber} · {selectedResponse.respondent.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedResponse(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Respondent</span>
                  <span className="font-bold text-slate-900">{selectedResponse.respondent.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Gmail</span>
                  <span className="font-medium text-slate-800 truncate block">{selectedResponse.respondent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Seat</span>
                  <span className="font-medium text-slate-800">{selectedResponse.respondent.seatNumber || 'Standard'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Duration</span>
                  <span className="font-medium text-slate-800">{selectedResponse.durationSeconds}s</span>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
                  Submitted Likert Scale Answers:
                </h4>
                {config.questions.map((q) => {
                  const val = selectedResponse.answers[q.id];
                  const opt = LIKERT_OPTIONS.find((o) => o.value === val);

                  return (
                    <div key={q.id} className="p-2.5 rounded bg-white border border-slate-200 flex items-center justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-mono font-bold text-amber-800 text-[10px] bg-amber-100 px-1 py-0.5 rounded shrink-0">
                          {q.code}
                        </span>
                        <span className="text-slate-800">{q.text}</span>
                      </div>
                      <div className="shrink-0 flex items-center gap-1.5 font-bold">
                        <span className="w-5 h-5 rounded bg-slate-900 text-amber-300 font-mono text-[11px] flex items-center justify-center">
                          {val}
                        </span>
                        <span className="text-[11px] text-slate-600">{opt?.shortLabel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedResponse(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
