import type {
  CompanyContext,
  RoleProfile,
  CandidateContext,
  TokenProgram,
  Constraints,
  Preferences,
  CompPackage,
  VestingSchedule,
  EquityType,
  CompanyStage,
  JobLevel,
} from '@/lib/comp-schemas';
import { benchmarkEngine, type BenchmarkResult } from './benchmarkEngine';
import {
  calculateDilution,
  calculateBurnImpact,
  calculateEquityValue,
  estimateCapTable,
  bpsToOptions,
} from './compMath';
import { generateId } from '@/lib/utils';

export interface PackageGenerationInput {
  companyContext: CompanyContext;
  roleProfile: RoleProfile;
  candidateContext: CandidateContext;
  tokenProgram?: TokenProgram;
  constraints: Constraints;
  preferences: Preferences;
}

export interface PackageGenerationResult {
  packages: CompPackage[];
  bestFitPackage: CompPackage;
  marketBenchmarks: {
    salaryPercentiles: { p25: number; p50: number; p75: number };
    equityPercentiles: { p25: number; p50: number; p75: number };
  };
  confidenceScore: number;
  confidenceNotes: string[];
}

type PackageType = 'cash-heavy' | 'balanced' | 'equity-heavy' | 'candidate-closing' | 'token-overlay';

export function generateCompPackages(input: PackageGenerationInput): PackageGenerationResult {
  const { companyContext, roleProfile, candidateContext, tokenProgram, constraints, preferences } = input;

  // Get market benchmarks
  const benchmark = benchmarkEngine.getBenchmark(
    roleProfile.jobFamily,
    roleProfile.jobLevel,
    companyContext.stage,
    roleProfile.geo
  );

  if (!benchmark) {
    throw new Error(`No benchmark data found for ${roleProfile.jobFamily} / ${roleProfile.jobLevel} at ${companyContext.stage}`);
  }

  // Estimate cap table if not provided
  const capTable = companyContext.capTable ?? estimateCapTable(companyContext.stage, companyContext);

  // Get vesting defaults
  const vestingDefaults = benchmarkEngine.getVestingDefaults(
    roleProfile.jobLevel === 'c-level' || roleProfile.jobLevel === 'vp' ? 'executive' : 'standard'
  );

  const vestingSchedule: VestingSchedule = {
    totalMonths: vestingDefaults.totalMonths,
    cliffMonths: vestingDefaults.cliffMonths,
    vestingFrequency: vestingDefaults.vestingFrequency,
  };

  // Determine equity type
  const equityType: EquityType = determineEquityType(companyContext.stage, roleProfile.jobLevel);

  // Generate package configurations
  const packageConfigs = generatePackageConfigs(
    benchmark,
    companyContext,
    candidateContext,
    constraints,
    preferences,
    tokenProgram
  );

  // Build packages
  const packages: CompPackage[] = packageConfigs.map((config) =>
    buildPackage(config, benchmark, capTable, companyContext, vestingSchedule, equityType, tokenProgram)
  );

  // Score packages
  const scoredPackages = packages.map((pkg) =>
    scorePackage(pkg, benchmark, constraints, preferences, capTable)
  );

  // Sort by overall score and determine best fit
  scoredPackages.sort((a, b) => b.scores.overallScore - a.scores.overallScore);

  const bestFitPackage = determineBestFit(scoredPackages, candidateContext, preferences);
  bestFitPackage.isRecommended = true;
  bestFitPackage.recommendationRationale = generateRationale(bestFitPackage, candidateContext, preferences);

  // Build confidence notes
  const confidenceNotes: string[] = [];
  if (!companyContext.capTable) {
    confidenceNotes.push('Cap table estimated based on stage defaults');
  }
  if (benchmark.confidence < 0.8) {
    confidenceNotes.push(`Benchmark data confidence: ${Math.round(benchmark.confidence * 100)}%`);
  }

  return {
    packages: scoredPackages,
    bestFitPackage,
    marketBenchmarks: {
      salaryPercentiles: benchmark.salary,
      equityPercentiles: {
        p25: benchmark.equityBps.p25 / 100, // Convert to percent
        p50: benchmark.equityBps.p50 / 100,
        p75: benchmark.equityBps.p75 / 100,
      },
    },
    confidenceScore: Math.round(benchmark.confidence * 100),
    confidenceNotes,
  };
}

interface PackageConfig {
  type: PackageType;
  name: string;
  salaryPercentile: number;
  equityPercentile: number;
  bonusMultiplier: number;
  tokenOverlay: boolean;
}

function generatePackageConfigs(
  benchmark: BenchmarkResult,
  companyContext: CompanyContext,
  candidateContext: CandidateContext,
  constraints: Constraints,
  preferences: Preferences,
  tokenProgram?: TokenProgram
): PackageConfig[] {
  const configs: PackageConfig[] = [];

  // Cash-heavy package
  configs.push({
    type: 'cash-heavy',
    name: 'Cash-Heavy',
    salaryPercentile: 70,
    equityPercentile: 30,
    bonusMultiplier: 1.15,
    tokenOverlay: false,
  });

  // Balanced package
  configs.push({
    type: 'balanced',
    name: 'Balanced',
    salaryPercentile: 50,
    equityPercentile: 50,
    bonusMultiplier: 1.0,
    tokenOverlay: false,
  });

  // Equity-heavy package
  configs.push({
    type: 'equity-heavy',
    name: 'Equity-Heavy',
    salaryPercentile: 35,
    equityPercentile: 75,
    bonusMultiplier: 0.9,
    tokenOverlay: false,
  });

  // Candidate-closing package (if competing offers)
  if (candidateContext.competingOffersLevel !== 'none') {
    configs.push({
      type: 'candidate-closing',
      name: 'Candidate-Closing',
      salaryPercentile: 65,
      equityPercentile: 70,
      bonusMultiplier: 1.2,
      tokenOverlay: false,
    });
  }

  // Token overlay package (if token program enabled)
  if (tokenProgram?.enabled && tokenProgram.totalSupply) {
    configs.push({
      type: 'token-overlay',
      name: 'Token Overlay',
      salaryPercentile: 45,
      equityPercentile: 40,
      bonusMultiplier: 0.95,
      tokenOverlay: true,
    });
  }

  // Apply constraints and preferences
  return configs.map((config) => {
    // If cash preservation is high priority, shift down salary percentiles
    if (preferences.cashPreservationPriority === 'high') {
      config.salaryPercentile = Math.max(25, config.salaryPercentile - 15);
      config.equityPercentile = Math.min(85, config.equityPercentile + 10);
    }

    // If dilution control is high priority, shift down equity percentiles
    if (preferences.dilutionControlPriority === 'high') {
      config.equityPercentile = Math.max(20, config.equityPercentile - 15);
      config.salaryPercentile = Math.min(75, config.salaryPercentile + 10);
    }

    // If retention is high priority, boost both
    if (preferences.retentionPriority === 'high') {
      config.salaryPercentile = Math.min(80, config.salaryPercentile + 10);
      config.equityPercentile = Math.min(80, config.equityPercentile + 10);
    }

    return config;
  });
}

function buildPackage(
  config: PackageConfig,
  benchmark: BenchmarkResult,
  capTable: NonNullable<CompanyContext['capTable']>,
  companyContext: CompanyContext,
  vestingSchedule: VestingSchedule,
  equityType: EquityType,
  tokenProgram?: TokenProgram
): CompPackage {
  // Calculate salary based on percentile
  const baseSalary = benchmarkEngine.interpolateSalary(config.salaryPercentile, benchmark.salary);

  // Calculate bonus (10% default for most roles, higher for sales/exec)
  const bonusTarget = Math.round(baseSalary * 0.10 * config.bonusMultiplier);

  // Calculate equity based on percentile
  const equityBps = benchmarkEngine.interpolateEquity(config.equityPercentile, benchmark.equityBps);
  const equityPercentFD = equityBps / 100; // Convert bps to percent
  const equityOptionCount = bpsToOptions(equityBps, capTable.fdShares);

  // Calculate burn impact
  const burnImpact = calculateBurnImpact(baseSalary, bonusTarget, companyContext.geoMarket);

  // Calculate dilution
  const dilution = calculateDilution(equityPercentFD, capTable);

  // Calculate expected value
  const equityValue = calculateEquityValue(
    equityOptionCount,
    equityPercentFD,
    capTable,
    companyContext.stage
  );

  // Token calculations if applicable
  let tokenAmount: number | undefined;
  let tokenPercentSupply: number | undefined;
  let tokenVestingSchedule: VestingSchedule | undefined;

  if (config.tokenOverlay && tokenProgram?.enabled && tokenProgram.totalSupply && tokenProgram.remainingPool) {
    // Token grant typically 25-50% of equity value equivalent
    const tokenEquivalentBps = equityBps * 0.35;
    tokenPercentSupply = tokenEquivalentBps / 100;
    tokenAmount = Math.round((tokenPercentSupply / 100) * tokenProgram.totalSupply);
    tokenVestingSchedule = tokenProgram.tokenVestingDefault ?? {
      totalMonths: 48,
      cliffMonths: 12,
      vestingFrequency: 'monthly',
    };
  }

  return {
    id: generateId(),
    name: config.name,
    baseSalary,
    bonusTarget,
    equityType,
    equityPercentFD,
    equityOptionCount,
    vestingSchedule,
    strikePrice: capTable.currentPricePerShare,
    tokenAmount,
    tokenPercentSupply,
    tokenVestingSchedule,
    employerCostAnnual: burnImpact.totalWithLoad,
    burnDeltaMonthly: burnImpact.monthlyBurnDelta,
    poolImpactPercent: dilution.poolImpactPercent,
    poolRemainingAfter: dilution.poolRemainingAfter,
    expectedValueBand: equityValue.expectedValueBand,
    scores: {
      marketCompetitiveness: 0,
      cashFeasibility: 0,
      dilutionScore: 0,
      retentionScore: 0,
      overallScore: 0,
    },
    isRecommended: false,
  };
}

function scorePackage(
  pkg: CompPackage,
  benchmark: BenchmarkResult,
  constraints: Constraints,
  preferences: Preferences,
  capTable: NonNullable<CompanyContext['capTable']>
): CompPackage {
  // Market competitiveness score (0-100)
  const salaryRatio = pkg.baseSalary / benchmark.salary.p50;
  const equityRatio = (pkg.equityPercentFD * 100) / benchmark.equityBps.p50; // Both in same units
  const marketCompetitiveness = Math.min(100, Math.round(((salaryRatio + equityRatio) / 2) * 50 + 25));

  // Cash feasibility score (0-100)
  let cashFeasibility = 100;
  if (constraints.cashBudgetCeiling) {
    const cashRatio = pkg.employerCostAnnual / constraints.cashBudgetCeiling;
    cashFeasibility = cashRatio <= 1 ? 100 : Math.max(0, 100 - (cashRatio - 1) * 100);
  }

  // Dilution score (0-100) - higher is better (less dilution)
  const poolUsage = pkg.poolImpactPercent;
  const dilutionScore = Math.max(0, 100 - poolUsage * 2);

  // Retention score (0-100)
  let retentionScore = 50;
  if (pkg.vestingSchedule.totalMonths >= 48) retentionScore += 20;
  if (pkg.vestingSchedule.cliffMonths >= 12) retentionScore += 15;
  if (marketCompetitiveness >= 60) retentionScore += 15;

  // Overall score weighted by preferences
  const weights = {
    market: 0.3,
    cash: preferences.cashPreservationPriority === 'high' ? 0.35 : 0.2,
    dilution: preferences.dilutionControlPriority === 'high' ? 0.25 : 0.15,
    retention: preferences.retentionPriority === 'high' ? 0.35 : 0.2,
  };

  // Normalize weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const normalizedWeights = {
    market: weights.market / totalWeight,
    cash: weights.cash / totalWeight,
    dilution: weights.dilution / totalWeight,
    retention: weights.retention / totalWeight,
  };

  const overallScore = Math.round(
    marketCompetitiveness * normalizedWeights.market +
    cashFeasibility * normalizedWeights.cash +
    dilutionScore * normalizedWeights.dilution +
    retentionScore * normalizedWeights.retention
  );

  return {
    ...pkg,
    scores: {
      marketCompetitiveness,
      cashFeasibility,
      dilutionScore,
      retentionScore,
      overallScore,
    },
  };
}

function determineBestFit(
  packages: CompPackage[],
  candidateContext: CandidateContext,
  preferences: Preferences
): CompPackage {
  // Start with highest overall score
  let bestFit = packages[0];

  // Override based on context
  if (candidateContext.competingOffersLevel === 'high') {
    const candidateClosing = packages.find((p) => p.name === 'Candidate-Closing');
    if (candidateClosing) bestFit = candidateClosing;
  }

  if (preferences.cashPreservationPriority === 'high') {
    const equityHeavy = packages.find((p) => p.name === 'Equity-Heavy');
    if (equityHeavy && equityHeavy.scores.cashFeasibility > bestFit.scores.cashFeasibility) {
      bestFit = equityHeavy;
    }
  }

  if (candidateContext.riskTolerance === 'low') {
    const cashHeavy = packages.find((p) => p.name === 'Cash-Heavy');
    if (cashHeavy) bestFit = cashHeavy;
  }

  return bestFit;
}

function generateRationale(
  pkg: CompPackage,
  candidateContext: CandidateContext,
  preferences: Preferences
): string {
  const reasons: string[] = [];

  if (pkg.name === 'Balanced') {
    reasons.push('Offers a balanced mix of competitive cash compensation and meaningful equity upside');
  } else if (pkg.name === 'Cash-Heavy') {
    reasons.push('Prioritizes immediate cash compensation for candidates who value stability');
  } else if (pkg.name === 'Equity-Heavy') {
    reasons.push('Maximizes equity participation for candidates who believe in the company\'s growth potential');
  } else if (pkg.name === 'Candidate-Closing') {
    reasons.push('Designed to be competitive against external offers while maintaining internal equity');
  } else if (pkg.name === 'Token Overlay') {
    reasons.push('Includes token compensation to align with web3/crypto company structure');
  }

  if (candidateContext.competingOffersLevel === 'high') {
    reasons.push('Structured to compete effectively against other offers');
  }

  if (preferences.retentionPriority === 'high') {
    reasons.push('Vesting structure designed for long-term retention');
  }

  if (pkg.scores.marketCompetitiveness >= 70) {
    reasons.push('Above-market positioning to attract top talent');
  }

  return reasons.join('. ') + '.';
}

function determineEquityType(stage: CompanyStage, level: JobLevel): EquityType {
  // Early stage typically uses options (ISO where possible)
  if (stage === 'pre-seed' || stage === 'seed') {
    return level === 'c-level' ? 'restricted-stock' : 'iso';
  }

  // Later stages may use RSUs
  if (stage === 'series-c+') {
    return 'rsu';
  }

  // Series A/B typically use ISOs for US employees
  return 'iso';
}
