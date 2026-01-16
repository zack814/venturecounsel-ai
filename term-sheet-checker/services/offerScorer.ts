import { benchmarkEngine } from './benchmarkEngine';
import type {
  EmployeeBackground,
  CompanyDetails,
  CashOffer,
  EquityOffer,
  NegotiationContext,
  CashScore,
  EquityScore,
  TermsScore,
  OfferScoreCategory,
  MarketBenchmarks,
  OverallScore,
} from '@/lib/offer-evaluator-schemas';
import type { JobFamily, JobLevel, CompanyStage, GeoMarket } from '@/lib/comp-schemas';

// ============================================
// CASH SCORING
// ============================================

export function scoreCashOffer(
  cashOffer: CashOffer,
  background: EmployeeBackground,
  companyDetails: CompanyDetails
): CashScore {
  const benchmark = benchmarkEngine.getBenchmark(
    background.jobFamily as JobFamily,
    background.jobLevel as JobLevel,
    companyDetails.stage as CompanyStage,
    background.location as GeoMarket
  );

  if (!benchmark) {
    return {
      score: 50,
      percentile: 50,
      verdict: 'Unable to benchmark - using estimate',
      baseSalaryVsMedian: 0,
      totalCashVsMedian: 0,
    };
  }

  const baseSalary = cashOffer.baseSalary || 0;
  const bonusTarget = cashOffer.bonusTargetAmount ||
    (baseSalary * (cashOffer.bonusTargetPercent || 0) / 100);
  const totalCash = baseSalary + bonusTarget;
  const totalCashWithSigning = totalCash + (cashOffer.signingBonus || 0);

  // Calculate percentile
  let percentile: number;
  if (baseSalary <= benchmark.salary.p25) {
    percentile = 25 * (baseSalary / benchmark.salary.p25);
  } else if (baseSalary <= benchmark.salary.p50) {
    percentile = 25 + 25 * ((baseSalary - benchmark.salary.p25) / (benchmark.salary.p50 - benchmark.salary.p25));
  } else if (baseSalary <= benchmark.salary.p75) {
    percentile = 50 + 25 * ((baseSalary - benchmark.salary.p50) / (benchmark.salary.p75 - benchmark.salary.p50));
  } else {
    percentile = Math.min(99, 75 + 25 * ((baseSalary - benchmark.salary.p75) / (benchmark.salary.p75 * 0.3)));
  }

  // Convert percentile to score (0-100)
  const score = Math.round(percentile);

  // Calculate vs median
  const baseSalaryVsMedian = ((baseSalary / benchmark.salary.p50) - 1) * 100;
  const totalCashVsMedian = ((totalCash / (benchmark.salary.p50 * 1.1)) - 1) * 100; // Assume 10% bonus target at market

  // Generate verdict
  let verdict: string;
  if (score >= 75) {
    verdict = 'Excellent cash compensation - above 75th percentile';
  } else if (score >= 50) {
    verdict = 'Good cash compensation - at or above market median';
  } else if (score >= 25) {
    verdict = 'Below median cash - consider negotiating';
  } else {
    verdict = 'Significantly below market - strong case for negotiation';
  }

  // Add comparison to current salary if available
  const comparedToCurrentSalary = background.currentBaseSalary
    ? ((baseSalary - background.currentBaseSalary) / background.currentBaseSalary) * 100
    : undefined;

  return {
    score,
    percentile: Math.round(percentile),
    verdict,
    baseSalaryVsMedian: Math.round(baseSalaryVsMedian * 10) / 10,
    totalCashVsMedian: Math.round(totalCashVsMedian * 10) / 10,
    comparedToCurrentSalary: comparedToCurrentSalary ? Math.round(comparedToCurrentSalary * 10) / 10 : undefined,
  };
}

// ============================================
// EQUITY SCORING
// ============================================

export function scoreEquityOffer(
  equityOffer: EquityOffer,
  companyDetails: CompanyDetails,
  background: EmployeeBackground
): EquityScore {
  const benchmark = benchmarkEngine.getBenchmark(
    background.jobFamily as JobFamily,
    background.jobLevel as JobLevel,
    companyDetails.stage as CompanyStage,
    background.location as GeoMarket
  );

  // Calculate ownership percentage
  let percentOfCompany: number | undefined = equityOffer.percentOfCompany;
  if (!percentOfCompany && equityOffer.shareCount && equityOffer.totalSharesOutstanding) {
    percentOfCompany = (equityOffer.shareCount / equityOffer.totalSharesOutstanding) * 100;
  }

  // Calculate current paper value
  let currentPaperValue: number | undefined;
  if (percentOfCompany && equityOffer.latestValuation) {
    currentPaperValue = (percentOfCompany / 100) * equityOffer.latestValuation;
  } else if (equityOffer.shareCount && equityOffer.latestRoundPricePerShare) {
    currentPaperValue = equityOffer.shareCount * equityOffer.latestRoundPricePerShare;
  }

  // Calculate percentile if we have benchmark data
  let percentile: number | undefined;
  let equityVsMedian: number | undefined;

  if (benchmark && percentOfCompany) {
    const equityBps = percentOfCompany * 100; // Convert to basis points

    if (equityBps <= benchmark.equityBps.p25) {
      percentile = 25 * (equityBps / benchmark.equityBps.p25);
    } else if (equityBps <= benchmark.equityBps.p50) {
      percentile = 25 + 25 * ((equityBps - benchmark.equityBps.p25) / (benchmark.equityBps.p50 - benchmark.equityBps.p25));
    } else if (equityBps <= benchmark.equityBps.p75) {
      percentile = 50 + 25 * ((equityBps - benchmark.equityBps.p50) / (benchmark.equityBps.p75 - benchmark.equityBps.p50));
    } else {
      percentile = Math.min(99, 75 + 25 * ((equityBps - benchmark.equityBps.p75) / benchmark.equityBps.p75));
    }

    equityVsMedian = ((equityBps / benchmark.equityBps.p50) - 1) * 100;
  }

  // Calculate score
  let score: number;
  let valueConfidence: 'known' | 'estimated' | 'unknown';

  if (percentile !== undefined) {
    score = Math.round(percentile);
    valueConfidence = equityOffer.totalSharesConfidence === 'known' ? 'known' : 'estimated';
  } else if (currentPaperValue) {
    // If we can't calculate percentile but have paper value, estimate score
    score = 50; // Default to middle
    valueConfidence = 'estimated';
  } else {
    score = 40; // Penalty for unknown
    valueConfidence = 'unknown';
  }

  // Generate verdict
  let verdict: string;
  if (valueConfidence === 'unknown') {
    verdict = 'Cannot fully evaluate equity without ownership percentage. Ask for shares outstanding.';
  } else if (score >= 75) {
    verdict = 'Excellent equity grant - above 75th percentile for your role/stage';
  } else if (score >= 50) {
    verdict = 'Good equity grant - at or above market median';
  } else if (score >= 25) {
    verdict = 'Below median equity - consider negotiating for more';
  } else {
    verdict = 'Significantly below market equity - strong case for negotiation';
  }

  return {
    score,
    percentile: percentile ? Math.round(percentile) : undefined,
    verdict,
    percentOfCompany,
    currentPaperValue,
    valueConfidence,
    equityVsMedian: equityVsMedian ? Math.round(equityVsMedian * 10) / 10 : undefined,
  };
}

// ============================================
// TERMS SCORING
// ============================================

export function scoreOfferTerms(equityOffer: EquityOffer): TermsScore {
  let vestingScore = 50;
  let exerciseScore = 50;
  let accelerationScore = 50;
  const detailBreakdown: Array<{ term: string; value: string; assessment: string; impact: number }> = [];

  // Vesting Schedule Scoring
  const totalMonths = equityOffer.vestingTotalMonths || 48;
  const cliffMonths = equityOffer.vestingCliffMonths || 12;

  if (totalMonths === 48 && cliffMonths === 12) {
    vestingScore = 50; // Standard
    detailBreakdown.push({
      term: 'Vesting Schedule',
      value: `${totalMonths} months with ${cliffMonths}-month cliff`,
      assessment: 'Standard (4 years, 1-year cliff)',
      impact: 0,
    });
  } else if (totalMonths < 48) {
    vestingScore = 70; // Faster vesting is better
    detailBreakdown.push({
      term: 'Vesting Schedule',
      value: `${totalMonths} months with ${cliffMonths}-month cliff`,
      assessment: 'Better than standard - faster vesting',
      impact: 20,
    });
  } else if (totalMonths > 48) {
    vestingScore = 30;
    detailBreakdown.push({
      term: 'Vesting Schedule',
      value: `${totalMonths} months with ${cliffMonths}-month cliff`,
      assessment: 'Longer than standard - consider negotiating',
      impact: -20,
    });
  }

  if (cliffMonths > 12) {
    vestingScore -= 15;
    detailBreakdown.push({
      term: 'Cliff Period',
      value: `${cliffMonths} months`,
      assessment: 'Longer than standard 1-year cliff',
      impact: -15,
    });
  }

  // Exercise Period Scoring (HUGE deal)
  const exercisePeriodScores: Record<string, { score: number; assessment: string }> = {
    '30-days': { score: 10, assessment: 'Very short - high risk of losing options' },
    '60-days': { score: 20, assessment: 'Short - risky if you need to leave' },
    '90-days': { score: 30, assessment: 'Standard but employee-unfriendly' },
    '180-days': { score: 50, assessment: 'Better than standard' },
    '1-year': { score: 60, assessment: 'Good - gives you time to plan' },
    '5-years': { score: 80, assessment: 'Excellent - very employee-friendly' },
    '10-years': { score: 95, assessment: 'Best possible - maximum flexibility' },
    'unknown': { score: 35, assessment: 'Unknown - ask your employer' },
  };

  const exerciseInfo = exercisePeriodScores[equityOffer.exercisePeriod || 'unknown'];
  exerciseScore = exerciseInfo.score;
  detailBreakdown.push({
    term: 'Post-Termination Exercise Period',
    value: equityOffer.exercisePeriod?.replace('-', ' ') || 'Unknown',
    assessment: exerciseInfo.assessment,
    impact: exerciseScore - 50,
  });

  // Acceleration Scoring
  const accelerationScores: Record<string, { score: number; assessment: string }> = {
    'none': { score: 20, assessment: 'No protection if acquired and terminated' },
    'single-trigger': { score: 80, assessment: 'Excellent - full acceleration on acquisition' },
    'double-trigger': { score: 70, assessment: 'Good - protects you if acquired and let go' },
    'partial-double-trigger': { score: 55, assessment: 'Partial protection on acquisition' },
    'unknown': { score: 35, assessment: 'Unknown - ask your employer' },
  };

  const accelInfo = accelerationScores[equityOffer.accelerationProvision || 'unknown'];
  accelerationScore = accelInfo.score;
  detailBreakdown.push({
    term: 'Acceleration Provision',
    value: equityOffer.accelerationProvision?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown',
    assessment: accelInfo.assessment,
    impact: accelerationScore - 50,
  });

  // Early Exercise Bonus
  if (equityOffer.earlyExerciseAllowed === 'yes') {
    detailBreakdown.push({
      term: 'Early Exercise',
      value: 'Available',
      assessment: 'Positive - enables 83(b) election for tax benefits',
      impact: 10,
    });
  }

  // Calculate overall terms score (weighted)
  const overallTermsScore = Math.round(
    vestingScore * 0.25 +
    exerciseScore * 0.45 + // Exercise period is most important
    accelerationScore * 0.30
  );

  // Generate verdict
  let verdict: string;
  if (overallTermsScore >= 70) {
    verdict = 'Strong terms - employee-friendly provisions';
  } else if (overallTermsScore >= 50) {
    verdict = 'Standard terms - room for improvement on key provisions';
  } else if (overallTermsScore >= 30) {
    verdict = 'Below average terms - consider negotiating exercise period and acceleration';
  } else {
    verdict = 'Poor terms - strongly recommend negotiating improvements';
  }

  return {
    score: overallTermsScore,
    verdict,
    vestingScore,
    exerciseScore,
    accelerationScore,
    detailBreakdown,
  };
}

// ============================================
// OVERALL SCORING
// ============================================

export function calculateOverallScore(
  cashScore: CashScore,
  equityScore: EquityScore,
  termsScore: TermsScore,
  background: EmployeeBackground
): OverallScore {
  // Weight based on employee preferences and risk tolerance
  let cashWeight = 0.35;
  let equityWeight = 0.35;
  let termsWeight = 0.30;

  // Adjust weights based on risk tolerance
  if (background.riskTolerance === 'conservative') {
    cashWeight = 0.50;
    equityWeight = 0.25;
    termsWeight = 0.25;
  } else if (background.riskTolerance === 'aggressive') {
    cashWeight = 0.25;
    equityWeight = 0.45;
    termsWeight = 0.30;
  }

  // Adjust for financial situation
  if (background.financialSituation === 'need-stability') {
    cashWeight += 0.10;
    equityWeight -= 0.10;
  } else if (background.financialSituation === 'can-take-risk') {
    cashWeight -= 0.10;
    equityWeight += 0.10;
  }

  const overallScore = Math.round(
    cashScore.score * cashWeight +
    equityScore.score * equityWeight +
    termsScore.score * termsWeight
  );

  // Determine category
  let category: OfferScoreCategory;
  if (overallScore >= 75) {
    category = 'excellent';
  } else if (overallScore >= 60) {
    category = 'good';
  } else if (overallScore >= 45) {
    category = 'fair';
  } else if (overallScore >= 30) {
    category = 'below-market';
  } else {
    category = 'concerning';
  }

  // Generate headline and paragraph
  let headline: string;
  let paragraph: string;

  switch (category) {
    case 'excellent':
      headline = 'This is a strong offer above market rates';
      paragraph = 'Your offer is competitive across cash, equity, and terms. While there may still be room to negotiate specific items, the overall package is solid.';
      break;
    case 'good':
      headline = 'This is a good offer at or near market rates';
      paragraph = 'Your offer is reasonable compared to market benchmarks. There are some areas where you could negotiate improvements, particularly in the terms.';
      break;
    case 'fair':
      headline = 'This offer has room for improvement';
      paragraph = 'Some components of your offer are below market rates. We recommend negotiating on the highlighted items before accepting.';
      break;
    case 'below-market':
      headline = 'This offer is below market on multiple dimensions';
      paragraph = 'Your offer is significantly below market in several areas. We strongly recommend negotiating improvements before accepting, or gathering competing offers.';
      break;
    case 'concerning':
      headline = 'This offer needs significant improvement';
      paragraph = 'Multiple components of this offer are well below market rates. Consider whether this opportunity is worth pursuing without substantial improvements to the package.';
      break;
  }

  return { score: overallScore, category, headline, paragraph };
}

// ============================================
// GET MARKET BENCHMARKS
// ============================================

export function getMarketBenchmarks(
  background: EmployeeBackground,
  companyDetails: CompanyDetails
): MarketBenchmarks {
  const benchmark = benchmarkEngine.getBenchmark(
    background.jobFamily as JobFamily,
    background.jobLevel as JobLevel,
    companyDetails.stage as CompanyStage,
    background.location as GeoMarket
  );

  if (!benchmark) {
    return {
      salary: { p25: 0, p50: 0, p75: 0 },
      equityBps: { p25: 0, p50: 0, p75: 0 },
      equityPercent: { p25: 0, p50: 0, p75: 0 },
      source: 'Unable to find benchmarks for this role/stage combination',
      lastUpdated: new Date().toISOString(),
    };
  }

  return {
    salary: benchmark.salary,
    equityBps: benchmark.equityBps,
    equityPercent: {
      p25: benchmark.equityBps.p25 / 100,
      p50: benchmark.equityBps.p50 / 100,
      p75: benchmark.equityBps.p75 / 100,
    },
    source: benchmark.source,
    lastUpdated: new Date().toISOString(),
    confidenceNote: benchmark.confidence < 0.7 ? 'Limited data for this specific combination' : undefined,
  };
}
