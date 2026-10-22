import { LikertValue, Question, QuestionStat, CategoryStat, SurveyResponse, SurveySummaryStats } from '../types/survey';

export function calculateSummaryStats(
  questions: Question[],
  responses: SurveyResponse[]
): SurveySummaryStats {
  const totalRespondents = responses.length;

  if (totalRespondents === 0) {
    const questionStats: QuestionStat[] = questions.map((q) => ({
      questionId: q.id,
      code: q.code,
      category: q.category,
      text: q.text,
      totalResponses: 0,
      mean: 0,
      standardDeviation: 0,
      median: 0,
      mode: 0,
      counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      positivePercentage: 0,
      neutralPercentage: 0,
      negativePercentage: 0
    }));

    const categoryStats: CategoryStat[] = Array.from(new Set(questions.map((q) => q.category))).map(
      (category) => ({
        category,
        questionCount: questions.filter((q) => q.category === category).length,
        overallMean: 0,
        standardDeviation: 0,
        questions: questionStats.filter((qs) => qs.category === category)
      })
    );

    return {
      totalRespondents: 0,
      completionRate: 100,
      averageDurationMinutes: 0,
      overallMean: 0,
      categoryStats,
      questionStats
    };
  }

  // Duration
  const totalSeconds = responses.reduce((acc, r) => acc + (r.durationSeconds || 0), 0);
  const averageDurationMinutes = Number(((totalSeconds / totalRespondents) / 60).toFixed(1));

  // Item-level stats
  const questionStats: QuestionStat[] = questions.map((q) => {
    const vals: LikertValue[] = [];
    const counts: Record<LikertValue, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    responses.forEach((resp) => {
      const ans = resp.answers[q.id];
      if (ans !== undefined && ans >= 1 && ans <= 5) {
        vals.push(ans);
        counts[ans] = (counts[ans] || 0) + 1;
      }
    });

    const n = vals.length;
    if (n === 0) {
      return {
        questionId: q.id,
        code: q.code,
        category: q.category,
        text: q.text,
        totalResponses: 0,
        mean: 0,
        standardDeviation: 0,
        median: 0,
        mode: 0,
        counts,
        percentages: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        positivePercentage: 0,
        neutralPercentage: 0,
        negativePercentage: 0
      };
    }

    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = Number((sum / n).toFixed(2));

    // Standard deviation (sample standard deviation)
    const variance =
      n > 1
        ? vals.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / (n - 1)
        : 0;
    const standardDeviation = Number(Math.sqrt(variance).toFixed(2));

    // Median
    const sorted = [...vals].sort((a, b) => a - b);
    const mid = Math.floor(n / 2);
    const median =
      n % 2 !== 0
        ? sorted[mid]
        : Number(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1));

    // Mode
    let maxCount = -1;
    let mode: LikertValue = 3;
    ([1, 2, 3, 4, 5] as LikertValue[]).forEach((val) => {
      if (counts[val] > maxCount) {
        maxCount = counts[val];
        mode = val;
      }
    });

    // Percentages
    const percentages: Record<LikertValue, number> = {
      1: Number(((counts[1] / n) * 100).toFixed(1)),
      2: Number(((counts[2] / n) * 100).toFixed(1)),
      3: Number(((counts[3] / n) * 100).toFixed(1)),
      4: Number(((counts[4] / n) * 100).toFixed(1)),
      5: Number(((counts[5] / n) * 100).toFixed(1))
    };

    const positivePercentage = Number((percentages[4] + percentages[5]).toFixed(1));
    const neutralPercentage = percentages[3];
    const negativePercentage = Number((percentages[1] + percentages[2]).toFixed(1));

    return {
      questionId: q.id,
      code: q.code,
      category: q.category,
      text: q.text,
      totalResponses: n,
      mean,
      standardDeviation,
      median,
      mode,
      counts,
      percentages,
      positivePercentage,
      neutralPercentage,
      negativePercentage
    };
  });

  // Category stats
  const uniqueCategories = Array.from(new Set(questions.map((q) => q.category)));
  const categoryStats: CategoryStat[] = uniqueCategories.map((category) => {
    const catQuestions = questionStats.filter((qs) => qs.category === category);
    const catMeans = catQuestions.map((q) => q.mean).filter((m) => m > 0);
    const overallMean =
      catMeans.length > 0
        ? Number((catMeans.reduce((a, b) => a + b, 0) / catMeans.length).toFixed(2))
        : 0;

    const catVariance =
      catMeans.length > 1
        ? catMeans.reduce((acc, m) => acc + Math.pow(m - overallMean, 2), 0) /
          (catMeans.length - 1)
        : 0;
    const catStdDev = Number(Math.sqrt(catVariance).toFixed(2));

    return {
      category,
      questionCount: catQuestions.length,
      overallMean,
      standardDeviation: catStdDev,
      questions: catQuestions
    };
  });

  // Overall Mean across all answers
  const allMeans = questionStats.map((qs) => qs.mean).filter((m) => m > 0);
  const overallMean =
    allMeans.length > 0
      ? Number((allMeans.reduce((a, b) => a + b, 0) / allMeans.length).toFixed(2))
      : 0;

  return {
    totalRespondents,
    completionRate: 100,
    averageDurationMinutes,
    overallMean,
    categoryStats,
    questionStats
  };
}

export function getLikertInterpretation(mean: number): {
  level: string;
  verdict: string;
  colorClass: string;
} {
  if (mean >= 4.5) {
    return { level: 'Very High', verdict: 'Strongly Favorable / Highly Positive', colorClass: 'text-emerald-700' };
  } else if (mean >= 3.5) {
    return { level: 'High', verdict: 'Favorable / Moderate Agreement', colorClass: 'text-emerald-600' };
  } else if (mean >= 2.5) {
    return { level: 'Moderate', verdict: 'Neutral / Balanced Assessment', colorClass: 'text-amber-600' };
  } else if (mean >= 1.5) {
    return { level: 'Low', verdict: 'Unfavorable / Disagreement', colorClass: 'text-orange-600' };
  } else {
    return { level: 'Very Low', verdict: 'Substantial Disagreement / Critical Attention', colorClass: 'text-rose-600' };
  }
}
