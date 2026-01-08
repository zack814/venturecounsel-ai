import type {
  CompPackage,
  CompanyContext,
  RoleProfile,
  OfferLanguageBlock,
  NegotiationLever,
} from '@/lib/comp-schemas';
import { generateId, formatCurrency, formatPercent } from '@/lib/utils';

export interface DraftContext {
  package: CompPackage;
  companyContext: CompanyContext;
  roleProfile: RoleProfile;
}

export interface DraftOutput {
  offerLanguageBlocks: OfferLanguageBlock[];
  negotiationLevers: NegotiationLever[];
  negotiationTalkingPoints: string[];
}

export function generateDraft(context: DraftContext): DraftOutput {
  const { package: pkg, companyContext, roleProfile } = context;

  const offerLanguageBlocks: OfferLanguageBlock[] = [];

  // Equity grant summary
  offerLanguageBlocks.push(generateEquityGrantBlock(pkg, companyContext, roleProfile));

  // Vesting schedule
  offerLanguageBlocks.push(generateVestingBlock(pkg));

  // Token grant (if applicable)
  if (pkg.tokenAmount && pkg.tokenPercentSupply) {
    offerLanguageBlocks.push(generateTokenBlock(pkg));
  }

  // Compensation summary
  offerLanguageBlocks.push(generateCompensationSummaryBlock(pkg, roleProfile));

  // Generate negotiation guidance
  const negotiationLevers = generateNegotiationLevers(pkg, companyContext);
  const negotiationTalkingPoints = generateTalkingPoints(pkg, companyContext, roleProfile);

  return {
    offerLanguageBlocks,
    negotiationLevers,
    negotiationTalkingPoints,
  };
}

function generateEquityGrantBlock(
  pkg: CompPackage,
  companyContext: CompanyContext,
  roleProfile: RoleProfile
): OfferLanguageBlock {
  const equityTypeLabel = {
    iso: 'Incentive Stock Options (ISOs)',
    nso: 'Non-Qualified Stock Options (NSOs)',
    rsu: 'Restricted Stock Units (RSUs)',
    'restricted-stock': 'Restricted Stock',
  }[pkg.equityType];

  let content = `Subject to approval by the Company's Board of Directors and the terms and conditions of the Company's Equity Incentive Plan (the "Plan"), you will be granted ${equityTypeLabel} to purchase ${pkg.equityOptionCount.toLocaleString()} shares of the Company's common stock`;

  if (pkg.equityType === 'iso' || pkg.equityType === 'nso') {
    content += ` at an exercise price equal to the fair market value of the Company's common stock on the date of grant, as determined by the Board`;
  }

  content += `. This grant represents approximately ${pkg.equityPercentFD.toFixed(3)}% of the Company's fully diluted capitalization as of the date of this offer.`;

  content += `\n\nThe option grant will be subject to the terms and conditions of the Plan and a stock option agreement, which you will be required to sign as a condition of receiving the grant. Please note that this offer of equity is contingent upon Board approval and is not a guarantee of equity compensation.`;

  return {
    id: generateId(),
    category: 'equity-grant',
    title: 'Equity Grant',
    content,
    variables: {
      equityType: pkg.equityType,
      optionCount: pkg.equityOptionCount.toString(),
      percentFD: pkg.equityPercentFD.toFixed(3),
    },
  };
}

function generateVestingBlock(pkg: CompPackage): OfferLanguageBlock {
  const { vestingSchedule } = pkg;
  const frequencyLabel = {
    monthly: 'monthly',
    quarterly: 'quarterly',
    annually: 'annually',
  }[vestingSchedule.vestingFrequency];

  let content = `Your equity grant will vest over ${vestingSchedule.totalMonths} months`;

  if (vestingSchedule.cliffMonths > 0) {
    const cliffPercent = Math.round((vestingSchedule.cliffMonths / vestingSchedule.totalMonths) * 100);
    content += `, with a ${vestingSchedule.cliffMonths}-month cliff. ${cliffPercent}% of your grant will vest on the ${vestingSchedule.cliffMonths}-month anniversary of your start date`;
  }

  content += `, and the remaining shares will vest ${frequencyLabel} thereafter`;

  content += `, subject to your continued service with the Company through each vesting date.`;

  if (vestingSchedule.cliffMonths > 0) {
    content += `\n\nIf your employment terminates for any reason prior to the cliff date, you will not vest in any portion of the grant. If your employment terminates after the cliff date, any unvested shares will be forfeited.`;
  }

  return {
    id: generateId(),
    category: 'vesting',
    title: 'Vesting Schedule',
    content,
    variables: {
      totalMonths: vestingSchedule.totalMonths.toString(),
      cliffMonths: vestingSchedule.cliffMonths.toString(),
      frequency: frequencyLabel,
    },
  };
}

function generateTokenBlock(pkg: CompPackage): OfferLanguageBlock {
  const { tokenAmount, tokenPercentSupply, tokenVestingSchedule } = pkg;

  let content = `In addition to your equity compensation, you will receive a token grant of ${tokenAmount!.toLocaleString()} tokens, representing approximately ${tokenPercentSupply!.toFixed(4)}% of the total token supply.`;

  if (tokenVestingSchedule) {
    content += `\n\nYour token grant will vest over ${tokenVestingSchedule.totalMonths} months`;
    if (tokenVestingSchedule.cliffMonths > 0) {
      content += `, with a ${tokenVestingSchedule.cliffMonths}-month cliff`;
    }
    content += `.`;
  }

  content += `\n\nToken grants are subject to the terms and conditions of the Company's Token Incentive Plan, including any applicable transfer restrictions, lockup periods, and forfeiture provisions. Please note that token values are highly volatile and the value of your token grant may fluctuate significantly. This is not a guarantee of any particular value.`;

  return {
    id: generateId(),
    category: 'token-grant',
    title: 'Token Grant',
    content,
    variables: {
      tokenAmount: tokenAmount!.toString(),
      tokenPercent: tokenPercentSupply!.toFixed(4),
    },
  };
}

function generateCompensationSummaryBlock(
  pkg: CompPackage,
  roleProfile: RoleProfile
): OfferLanguageBlock {
  let content = `**Base Salary:** ${formatCurrency(pkg.baseSalary)} per year, payable in accordance with the Company's standard payroll practices.`;

  if (pkg.bonusTarget > 0) {
    const bonusPercent = Math.round((pkg.bonusTarget / pkg.baseSalary) * 100);
    content += `\n\n**Target Bonus:** ${formatCurrency(pkg.bonusTarget)} (${bonusPercent}% of base salary), subject to achievement of individual and company performance goals as determined by the Company.`;
  }

  if (pkg.signingBonus) {
    content += `\n\n**Signing Bonus:** ${formatCurrency(pkg.signingBonus)}, payable within 30 days of your start date. This signing bonus is subject to repayment on a prorated basis if you voluntarily resign within 12 months of your start date.`;
  }

  content += `\n\nYour compensation will be reviewed annually as part of the Company's standard performance review cycle.`;

  return {
    id: generateId(),
    category: 'general',
    title: 'Compensation Summary',
    content,
    variables: {
      baseSalary: pkg.baseSalary.toString(),
      bonusTarget: pkg.bonusTarget.toString(),
    },
  };
}

function generateNegotiationLevers(
  pkg: CompPackage,
  companyContext: CompanyContext
): NegotiationLever[] {
  const levers: NegotiationLever[] = [];

  // Salary adjustments
  levers.push({
    lever: 'Base Salary',
    direction: 'increase',
    impact: `+$10,000 adds ~${formatCurrency(10000 * 1.25 / 12)}/month to burn`,
    suggestedTrade: 'Consider reducing equity grant by 0.01-0.02% FD to offset',
  });

  levers.push({
    lever: 'Base Salary',
    direction: 'decrease',
    impact: `-$10,000 saves ~${formatCurrency(10000 * 1.25 / 12)}/month in burn`,
    suggestedTrade: 'Offer additional equity (0.02-0.03% FD) or accelerated vesting',
  });

  // Equity adjustments
  levers.push({
    lever: 'Equity Grant',
    direction: 'increase',
    impact: `+0.05% FD increases dilution and pool usage`,
    suggestedTrade: 'Consider extending cliff or reducing signing bonus',
  });

  levers.push({
    lever: 'Equity Grant',
    direction: 'decrease',
    impact: `-0.05% FD preserves option pool`,
    suggestedTrade: 'Offer higher base salary or signing bonus',
  });

  // Signing bonus
  levers.push({
    lever: 'Signing Bonus',
    direction: 'increase',
    impact: 'One-time cash outlay, easier than recurring salary increase',
    suggestedTrade: 'Require 12-month clawback provision',
  });

  // Vesting
  levers.push({
    lever: 'Vesting Schedule',
    direction: 'increase',
    impact: 'Accelerated vesting (e.g., 3-year vest) increases retention risk',
    suggestedTrade: 'Reduce equity grant size or add performance milestones',
  });

  // Start date flexibility
  levers.push({
    lever: 'Start Date',
    direction: 'increase',
    impact: 'Later start date defers costs',
    suggestedTrade: 'May offer slightly higher package for flexibility',
  });

  return levers;
}

function generateTalkingPoints(
  pkg: CompPackage,
  companyContext: CompanyContext,
  roleProfile: RoleProfile
): string[] {
  const points: string[] = [];

  // Explain the equity value proposition
  if (pkg.expectedValueBand) {
    points.push(
      `Your equity grant has an estimated value range of ${formatCurrency(pkg.expectedValueBand.low)} to ${formatCurrency(pkg.expectedValueBand.high)}, ` +
      `with a base case value of ${formatCurrency(pkg.expectedValueBand.base)}. These are illustrative scenarios, not guarantees.`
    );
  }

  // Explain why the mix is structured this way
  if (pkg.name === 'Cash-Heavy') {
    points.push(
      'We\'ve structured this offer with a higher cash component to provide you with immediate financial stability while still giving you meaningful equity upside.'
    );
  } else if (pkg.name === 'Equity-Heavy') {
    points.push(
      'This offer emphasizes equity because we believe in our growth trajectory and want you to share significantly in our success. ' +
      'The lower base is a trade-off that many candidates find worthwhile given the upside potential.'
    );
  } else if (pkg.name === 'Balanced') {
    points.push(
      'We\'ve designed this package to provide competitive cash compensation while ensuring you have meaningful equity participation in our growth.'
    );
  }

  // Stage-specific context
  if (companyContext.stage === 'pre-seed' || companyContext.stage === 'seed') {
    points.push(
      'As an early-stage company, we offer larger equity grants to compensate for the higher risk. ' +
      'Early employees who stay through liquidity typically see the best outcomes.'
    );
  } else if (companyContext.stage === 'series-a' || companyContext.stage === 'series-b') {
    points.push(
      'At our current stage, we balance competitive cash compensation with meaningful equity. ' +
      'Our recent funding validates our trajectory and de-risks the equity component.'
    );
  }

  // Pool consumption context
  if (pkg.poolImpactPercent > 15) {
    points.push(
      'This is a significant equity grant that reflects the importance of this role. ' +
      'We reserve grants of this size for key hires who will have outsized impact.'
    );
  }

  // Flexibility messaging
  points.push(
    'We\'re open to discussing how we can adjust the cash/equity mix to better fit your preferences, ' +
    'as long as the total compensation value stays within our budget.'
  );

  // Refresh grants
  points.push(
    'We conduct annual equity refresh grants for high performers. ' +
    'This initial grant is designed to be meaningful, with the expectation of additional grants as you grow with us.'
  );

  return points;
}

// Template-based clause library for more standardized outputs
export const clauseTemplates = {
  equityPlanReference: `All equity awards are subject to the terms and conditions of the Company's [YEAR] Equity Incentive Plan (the "Plan") and the applicable award agreement. In the event of any conflict between this offer letter and the Plan or award agreement, the Plan and award agreement will control.`,

  atWillEmployment: `Your employment with the Company is "at will." This means that either you or the Company may terminate your employment at any time, with or without cause, and with or without advance notice. This at-will employment relationship cannot be changed except by a written agreement signed by you and an authorized officer of the Company.`,

  confidentialityReminder: `As a condition of your employment, you will be required to sign the Company's standard Confidential Information and Invention Assignment Agreement (CIIAA), which will be provided to you separately.`,

  benefitsOverview: `You will be eligible to participate in the Company's employee benefit programs, subject to the terms and conditions of those programs. The Company reserves the right to modify, amend, or terminate any benefit program at any time.`,

  contingencies: `This offer is contingent upon: (1) satisfactory completion of a background check; (2) your execution of the Company's CIIAA; (3) verification of your identity and employment eligibility; and (4) Board approval of your equity grant (if applicable).`,

  expirationClause: (days: number) =>
    `This offer is valid for ${days} days from the date of this letter. If you do not accept by [EXPIRATION_DATE], this offer will expire and we will not be obligated to employ you.`,
};
