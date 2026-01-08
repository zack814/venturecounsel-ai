import type {
  CompanyContext,
  CapTableSnapshot,
  VestingSchedule,
  ExpectedValueBand,
  GeoMarket,
  CompanyStage,
} from '@/lib/comp-schemas';
import { benchmarkEngine, type ExitScenarios } from './benchmarkEngine';

export interface DilutionResult {
  grantShares: number;
  percentFD: number;
  poolImpactPercent: number;
  poolRemainingAfter: number;
  poolRemainingPercentFD: number;
}

export interface BurnImpactResult {
  annualCashCost: number;
  monthlyCashCost: number;
  employerLoad: number;
  totalWithLoad: number;
  monthlyBurnDelta: number;
}

export interface EquityValueResult {
  currentValue: number;
  expectedValueBand: ExpectedValueBand;
}

/**
 * Calculate equity grant in shares and dilution metrics
 */
export function calculateDilution(
  targetPercentFD: number, // e.g., 0.5 for 0.5%
  capTable: CapTableSnapshot
): DilutionResult {
  const grantShares = Math.round((targetPercentFD / 100) * capTable.fdShares);
  const poolImpactPercent = capTable.optionPoolRemaining > 0
    ? (grantShares / capTable.optionPoolRemaining) * 100
    : 100;
  const poolRemainingAfter = Math.max(0, capTable.optionPoolRemaining - grantShares);
  const poolRemainingPercentFD = (poolRemainingAfter / capTable.fdShares) * 100;

  return {
    grantShares,
    percentFD: targetPercentFD,
    poolImpactPercent,
    poolRemainingAfter,
    poolRemainingPercentFD,
  };
}

/**
 * Calculate shares from a target % of FD
 */
export function percentToShares(percentFD: number, fdShares: number): number {
  return Math.round((percentFD / 100) * fdShares);
}

/**
 * Calculate % of FD from shares
 */
export function sharesToPercent(shares: number, fdShares: number): number {
  return (shares / fdShares) * 100;
}

/**
 * Calculate annual cash burn impact including employer load
 */
export function calculateBurnImpact(
  baseSalary: number,
  bonusTarget: number,
  geo: GeoMarket
): BurnImpactResult {
  const employerLoad = benchmarkEngine.getEmployerLoad(geo);
  const annualCashCost = baseSalary + bonusTarget;
  const totalWithLoad = annualCashCost * (1 + employerLoad);
  const monthlyCashCost = annualCashCost / 12;
  const monthlyBurnDelta = totalWithLoad / 12;

  return {
    annualCashCost,
    monthlyCashCost,
    employerLoad,
    totalWithLoad,
    monthlyBurnDelta,
  };
}

/**
 * Calculate expected value of equity grant across scenarios
 */
export function calculateEquityValue(
  grantShares: number,
  percentFD: number,
  capTable: CapTableSnapshot,
  stage: CompanyStage
): EquityValueResult {
  const scenarios = benchmarkEngine.getExitScenarios(stage);
  const lastValuation = capTable.lastRoundValuation ?? estimateValuation(stage, capTable.fdShares);
  const pricePerShare = capTable.currentPricePerShare ?? (lastValuation / capTable.fdShares);
  const currentValue = grantShares * pricePerShare;

  const calculateScenarioValue = (scenario: ExitScenarios[keyof ExitScenarios]) => {
    const exitValuation = lastValuation * scenario.exitMultiple;
    const dilutedPercent = percentFD * scenario.dilutionFactor;
    const exitValue = (dilutedPercent / 100) * exitValuation;
    // Simple discount for time value (no complex NPV)
    const discountedValue = exitValue / Math.pow(1.1, scenario.timeToLiquidityYears);
    return discountedValue * scenario.probabilityWeight;
  };

  return {
    currentValue,
    expectedValueBand: {
      low: calculateScenarioValue(scenarios.lowCase) / scenarios.lowCase.probabilityWeight,
      base: calculateScenarioValue(scenarios.baseCase) / scenarios.baseCase.probabilityWeight,
      high: calculateScenarioValue(scenarios.highCase) / scenarios.highCase.probabilityWeight,
      assumptions: {
        lowCase: scenarios.lowCase,
        baseCase: scenarios.baseCase,
        highCase: scenarios.highCase,
      },
    },
  };
}

/**
 * Estimate company valuation based on stage (fallback)
 */
function estimateValuation(stage: CompanyStage, fdShares: number): number {
  const typicalValuations: Record<CompanyStage, number> = {
    'pre-seed': 5_000_000,
    'seed': 15_000_000,
    'series-a': 50_000_000,
    'series-b': 150_000_000,
    'series-c+': 500_000_000,
  };
  return typicalValuations[stage];
}

/**
 * Estimate cap table if not provided
 */
export function estimateCapTable(
  stage: CompanyStage,
  companyContext?: Partial<CompanyContext>
): CapTableSnapshot {
  const fdRanges = benchmarkEngine.getTypicalFDShares(stage);
  const poolSize = benchmarkEngine.getTypicalPoolSize(stage);
  const fdShares = companyContext?.capTable?.fdShares ?? fdRanges.typical;

  return {
    fdShares,
    optionPoolSize: Math.round(fdShares * poolSize),
    optionPoolRemaining: Math.round(fdShares * poolSize * 0.7), // Assume 30% used
    currentPricePerShare: companyContext?.capTable?.currentPricePerShare,
    lastRoundValuation: companyContext?.capTable?.lastRoundValuation,
  };
}

/**
 * Calculate vesting schedule details
 */
export function calculateVestingSchedule(
  totalGrant: number,
  schedule: VestingSchedule
): {
  cliffVest: number;
  monthlyVest: number;
  quarterlyVest: number;
  vestedByMonth: number[];
} {
  const cliffVest = Math.round(totalGrant * (schedule.cliffMonths / schedule.totalMonths));
  const remainingAfterCliff = totalGrant - cliffVest;
  const monthsAfterCliff = schedule.totalMonths - schedule.cliffMonths;

  let monthlyVest = 0;
  let quarterlyVest = 0;

  if (schedule.vestingFrequency === 'monthly') {
    monthlyVest = Math.round(remainingAfterCliff / monthsAfterCliff);
  } else if (schedule.vestingFrequency === 'quarterly') {
    quarterlyVest = Math.round(remainingAfterCliff / (monthsAfterCliff / 3));
  }

  // Calculate cumulative vesting by month
  const vestedByMonth: number[] = [];
  let cumulative = 0;

  for (let month = 1; month <= schedule.totalMonths; month++) {
    if (month < schedule.cliffMonths) {
      vestedByMonth.push(0);
    } else if (month === schedule.cliffMonths) {
      cumulative = cliffVest;
      vestedByMonth.push(cumulative);
    } else {
      if (schedule.vestingFrequency === 'monthly') {
        cumulative += monthlyVest;
      } else if (schedule.vestingFrequency === 'quarterly' && (month - schedule.cliffMonths) % 3 === 0) {
        cumulative += quarterlyVest;
      }
      vestedByMonth.push(Math.min(cumulative, totalGrant));
    }
  }

  return {
    cliffVest,
    monthlyVest,
    quarterlyVest,
    vestedByMonth,
  };
}

/**
 * Calculate token grant metrics
 */
export function calculateTokenGrant(
  tokenAmount: number,
  totalSupply: number,
  remainingPool: number
): {
  percentSupply: number;
  poolImpactPercent: number;
  poolRemainingAfter: number;
} {
  const percentSupply = (tokenAmount / totalSupply) * 100;
  const poolImpactPercent = remainingPool > 0 ? (tokenAmount / remainingPool) * 100 : 100;
  const poolRemainingAfter = Math.max(0, remainingPool - tokenAmount);

  return {
    percentSupply,
    poolImpactPercent,
    poolRemainingAfter,
  };
}

/**
 * Calculate runway impact of a hire
 */
export function calculateRunwayImpact(
  currentRunwayMonths: number,
  currentMonthlyBurn: number,
  additionalMonthlyBurn: number
): {
  newRunwayMonths: number;
  runwayReduction: number;
  runwayReductionPercent: number;
} {
  const currentCash = currentRunwayMonths * currentMonthlyBurn;
  const newMonthlyBurn = currentMonthlyBurn + additionalMonthlyBurn;
  const newRunwayMonths = currentCash / newMonthlyBurn;
  const runwayReduction = currentRunwayMonths - newRunwayMonths;

  return {
    newRunwayMonths: Math.round(newRunwayMonths * 10) / 10,
    runwayReduction: Math.round(runwayReduction * 10) / 10,
    runwayReductionPercent: (runwayReduction / currentRunwayMonths) * 100,
  };
}

/**
 * Convert basis points to options based on FD shares
 */
export function bpsToOptions(bps: number, fdShares: number): number {
  return Math.round((bps / 10000) * fdShares);
}

/**
 * Convert options to basis points based on FD shares
 */
export function optionsToBps(options: number, fdShares: number): number {
  return Math.round((options / fdShares) * 10000);
}
