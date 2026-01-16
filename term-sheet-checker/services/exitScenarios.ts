import { benchmarkEngine } from './benchmarkEngine';
import type {
  EquityOffer,
  CompanyDetails,
  ExitScenario,
} from '@/lib/offer-evaluator-schemas';
import type { CompanyStage } from '@/lib/comp-schemas';

// ============================================
// EXIT SCENARIO CALCULATIONS
// ============================================

interface ScenarioTemplate {
  name: string;
  description: string;
  exitMultiple: number;
  dilutionPercent: number;
  yearsToExit: number;
  probability: number;
}

const scenarioTemplates: Record<string, ScenarioTemplate[]> = {
  'pre-seed': [
    { name: 'Failure', description: 'Company fails or acqui-hire', exitMultiple: 0, dilutionPercent: 0, yearsToExit: 3, probability: 0.60 },
    { name: 'Small Exit', description: 'Modest acquisition', exitMultiple: 2, dilutionPercent: 60, yearsToExit: 5, probability: 0.20 },
    { name: 'Moderate Exit', description: 'Successful exit', exitMultiple: 8, dilutionPercent: 70, yearsToExit: 7, probability: 0.15 },
    { name: 'Big Exit', description: 'Strong outcome', exitMultiple: 30, dilutionPercent: 80, yearsToExit: 8, probability: 0.05 },
  ],
  'seed': [
    { name: 'Failure', description: 'Company fails or acqui-hire', exitMultiple: 0, dilutionPercent: 0, yearsToExit: 3, probability: 0.50 },
    { name: 'Small Exit', description: 'Modest acquisition', exitMultiple: 2, dilutionPercent: 55, yearsToExit: 4, probability: 0.25 },
    { name: 'Moderate Exit', description: 'Successful exit', exitMultiple: 5, dilutionPercent: 65, yearsToExit: 6, probability: 0.18 },
    { name: 'Big Exit', description: 'Strong outcome', exitMultiple: 15, dilutionPercent: 75, yearsToExit: 7, probability: 0.07 },
  ],
  'series-a': [
    { name: 'Failure', description: 'Company fails', exitMultiple: 0, dilutionPercent: 0, yearsToExit: 3, probability: 0.35 },
    { name: 'Small Exit', description: 'Modest acquisition', exitMultiple: 1.5, dilutionPercent: 45, yearsToExit: 4, probability: 0.30 },
    { name: 'Moderate Exit', description: 'Good exit', exitMultiple: 3, dilutionPercent: 55, yearsToExit: 5, probability: 0.25 },
    { name: 'Big Exit', description: 'Strong outcome', exitMultiple: 8, dilutionPercent: 65, yearsToExit: 6, probability: 0.10 },
  ],
  'series-b': [
    { name: 'Failure', description: 'Company fails', exitMultiple: 0, dilutionPercent: 0, yearsToExit: 2, probability: 0.25 },
    { name: 'Small Exit', description: 'Below expectations', exitMultiple: 1.2, dilutionPercent: 35, yearsToExit: 3, probability: 0.30 },
    { name: 'Moderate Exit', description: 'Good exit', exitMultiple: 2.5, dilutionPercent: 45, yearsToExit: 4, probability: 0.30 },
    { name: 'Big Exit', description: 'Strong outcome', exitMultiple: 5, dilutionPercent: 55, yearsToExit: 5, probability: 0.15 },
  ],
  'series-c+': [
    { name: 'Failure', description: 'Company fails', exitMultiple: 0, dilutionPercent: 0, yearsToExit: 2, probability: 0.15 },
    { name: 'Small Exit', description: 'Below expectations', exitMultiple: 1, dilutionPercent: 25, yearsToExit: 2, probability: 0.30 },
    { name: 'Moderate Exit', description: 'Good exit', exitMultiple: 2, dilutionPercent: 35, yearsToExit: 3, probability: 0.35 },
    { name: 'Big Exit', description: 'Strong outcome', exitMultiple: 4, dilutionPercent: 45, yearsToExit: 4, probability: 0.20 },
  ],
};

export function calculateExitScenarios(
  equityOffer: EquityOffer,
  companyDetails: CompanyDetails
): ExitScenario[] {
  const templates = scenarioTemplates[companyDetails.stage] || scenarioTemplates['seed'];

  // Estimate current valuation
  let currentValuation: number | null = equityOffer.latestValuation || null;
  if (!currentValuation && equityOffer.latestRoundPricePerShare && equityOffer.totalSharesOutstanding) {
    currentValuation = equityOffer.latestRoundPricePerShare * equityOffer.totalSharesOutstanding;
  }

  // Estimate ownership percentage
  let ownershipPercent: number | null = equityOffer.percentOfCompany || null;
  if (!ownershipPercent && equityOffer.shareCount && equityOffer.totalSharesOutstanding) {
    ownershipPercent = (equityOffer.shareCount / equityOffer.totalSharesOutstanding) * 100;
  }

  // Calculate exercise cost
  const exerciseCost = equityOffer.strikePrice && equityOffer.shareCount
    ? equityOffer.strikePrice * equityOffer.shareCount
    : 0;

  return templates.map((template, index) => {
    // Calculate exit valuation
    const exitValuation = currentValuation
      ? currentValuation * template.exitMultiple
      : 0;

    // Calculate diluted ownership (original ownership * (1 - dilution))
    const dilutedOwnership = ownershipPercent
      ? ownershipPercent * (1 - template.dilutionPercent / 100)
      : 0;

    // Calculate gross equity value at exit
    const grossEquityValue = exitValuation * (dilutedOwnership / 100);

    // Subtract exercise cost for net value
    const netEquityValue = Math.max(0, grossEquityValue - exerciseCost);

    // Calculate annualized return (if we have initial value)
    let annualizedReturn: number | undefined;
    if (exerciseCost > 0 && netEquityValue > 0 && template.yearsToExit > 0) {
      annualizedReturn = Math.pow(netEquityValue / exerciseCost, 1 / template.yearsToExit) - 1;
    }

    return {
      id: `scenario-${index}`,
      name: template.name,
      description: template.description,
      exitMultiple: template.exitMultiple,
      dilutionPercent: template.dilutionPercent,
      yearsToExit: template.yearsToExit,
      probability: template.probability,
      grossEquityValue: Math.round(grossEquityValue),
      exerciseCost: Math.round(exerciseCost),
      netEquityValue: Math.round(netEquityValue),
      annualizedReturn,
    };
  });
}

export function calculateProbabilityWeightedValue(scenarios: ExitScenario[]): number {
  return Math.round(
    scenarios.reduce((sum, scenario) => {
      return sum + (scenario.netEquityValue * scenario.probability);
    }, 0)
  );
}

export function calculateVestingTimeline(
  equityOffer: EquityOffer
): Array<{ month: number; vestedShares: number; vestedPercent: number; cumulativeValue: number | null }> {
  const totalShares = equityOffer.shareCount || 0;
  const totalMonths = equityOffer.vestingTotalMonths || 48;
  const cliffMonths = equityOffer.vestingCliffMonths || 12;
  const valuePerShare = equityOffer.latestRoundPricePerShare || null;

  const timeline: Array<{ month: number; vestedShares: number; vestedPercent: number; cumulativeValue: number | null }> = [];

  for (let month = 0; month <= totalMonths; month += 6) {
    let vestedShares: number;
    let vestedPercent: number;

    if (month < cliffMonths) {
      vestedShares = 0;
      vestedPercent = 0;
    } else if (month === cliffMonths) {
      // Cliff vesting
      vestedShares = Math.round(totalShares * (cliffMonths / totalMonths));
      vestedPercent = (cliffMonths / totalMonths) * 100;
    } else {
      // Post-cliff vesting
      const monthsVested = month;
      vestedShares = Math.round(totalShares * (monthsVested / totalMonths));
      vestedPercent = (monthsVested / totalMonths) * 100;
    }

    timeline.push({
      month,
      vestedShares,
      vestedPercent: Math.round(vestedPercent * 10) / 10,
      cumulativeValue: valuePerShare ? Math.round(vestedShares * valuePerShare) : null,
    });
  }

  return timeline;
}
