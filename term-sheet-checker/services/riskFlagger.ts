import type {
  CompPackage,
  CompanyContext,
  RoleProfile,
  TokenProgram,
  RiskFlag,
  RiskFlagType,
} from '@/lib/comp-schemas';

export interface RiskFlagContext {
  package: CompPackage;
  companyContext: CompanyContext;
  roleProfile: RoleProfile;
  tokenProgram?: TokenProgram;
}

export function generateRiskFlags(context: RiskFlagContext): RiskFlag[] {
  const flags: RiskFlag[] = [];

  // 409A dependency flag
  flags.push(...check409ADependency(context));

  // ISO/NSO flags
  flags.push(...checkISOLimits(context));

  // 83(b) election flag
  flags.push(...check83bElection(context));

  // Token-related flags
  flags.push(...checkTokenRisks(context));

  // Pool exhaustion flag
  flags.push(...checkPoolExhaustion(context));

  // Runway impact flag
  flags.push(...checkRunwayImpact(context));

  // Jurisdiction flag
  flags.push(...checkJurisdiction(context));

  // Board approval flag
  flags.push(...checkBoardApproval(context));

  return flags;
}

function check409ADependency(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg, companyContext } = context;
  const flags: RiskFlag[] = [];

  if (pkg.equityType === 'iso' || pkg.equityType === 'nso') {
    const has409A = companyContext.capTable?.last409ADate;
    const last409ADate = has409A ? new Date(companyContext.capTable!.last409ADate!) : null;
    const monthsSince409A = last409ADate
      ? (Date.now() - last409ADate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      : null;

    flags.push({
      type: '409a-dependency',
      severity: monthsSince409A && monthsSince409A > 12 ? 'warning' : 'info',
      title: '409A Valuation Required',
      description: 'Strike price must be set at or above fair market value (FMV) determined by a 409A valuation. ' +
        (monthsSince409A && monthsSince409A > 12
          ? `Last 409A was ${Math.round(monthsSince409A)} months ago - consider refreshing.`
          : has409A
            ? 'Current 409A valuation appears recent.'
            : 'No 409A valuation date on file.'),
      actionRequired: !has409A || (monthsSince409A && monthsSince409A > 12)
        ? 'Obtain or update 409A valuation before issuing grants'
        : undefined,
    });
  }

  return flags;
}

function checkISOLimits(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg, companyContext } = context;
  const flags: RiskFlag[] = [];

  if (pkg.equityType === 'iso') {
    // $100,000 annual ISO vesting limit
    const strikePrice = pkg.strikePrice ?? estimateStrikePrice(companyContext);
    const annualVestingValue = (pkg.equityOptionCount / 4) * strikePrice; // Assume 4-year vest

    if (annualVestingValue > 100000) {
      flags.push({
        type: 'iso-limit',
        severity: 'warning',
        title: 'ISO Annual Limit May Be Exceeded',
        description: `Annual vesting value (~$${Math.round(annualVestingValue).toLocaleString()}) may exceed the $100,000 ISO limit. ` +
          'Options exceeding this limit will be treated as NSOs for tax purposes.',
        actionRequired: 'Consider splitting grant between ISOs and NSOs, or discuss with tax counsel',
      });
    }

    flags.push({
      type: 'iso-nso-selection',
      severity: 'info',
      title: 'ISO Tax Treatment',
      description: 'ISOs may qualify for favorable tax treatment if holding period requirements are met. ' +
        'Employee should consult a tax advisor regarding AMT implications and optimal exercise timing.',
    });
  }

  if (pkg.equityType === 'nso') {
    flags.push({
      type: 'iso-nso-selection',
      severity: 'info',
      title: 'NSO Tax Treatment',
      description: 'NSOs are taxed as ordinary income upon exercise. The spread between strike price and FMV at exercise is subject to income tax and employment taxes.',
    });
  }

  return flags;
}

function check83bElection(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg } = context;
  const flags: RiskFlag[] = [];

  if (pkg.equityType === 'restricted-stock') {
    flags.push({
      type: '83b-election',
      severity: 'critical',
      title: '83(b) Election Required',
      description: 'Restricted stock grants require a timely 83(b) election to potentially reduce tax burden. ' +
        'The election must be filed with the IRS within 30 days of the grant date - this deadline is strict and cannot be extended.',
      actionRequired: 'Ensure employee files 83(b) election within 30 days of grant. Include form in offer materials.',
    });
  }

  return flags;
}

function checkTokenRisks(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg, tokenProgram } = context;
  const flags: RiskFlag[] = [];

  if (pkg.tokenAmount && tokenProgram?.enabled) {
    flags.push({
      type: 'token-tax-withholding',
      severity: 'warning',
      title: 'Token Tax Withholding',
      description: 'Token compensation may trigger tax withholding obligations. The company may need to withhold taxes on token grants, ' +
        'which can be complex given token price volatility and liquidity constraints.',
      actionRequired: 'Consult with tax counsel on withholding mechanics and establish clear policy',
    });

    if (tokenProgram.lockupMonths && tokenProgram.lockupMonths > 0) {
      flags.push({
        type: 'token-transfer-restriction',
        severity: 'info',
        title: 'Token Transfer Restrictions',
        description: `Tokens are subject to a ${tokenProgram.lockupMonths}-month lockup period after vesting. ` +
          'Employee cannot sell or transfer tokens during this period.',
      });
    }

    flags.push({
      type: 'token-transfer-restriction',
      severity: 'warning',
      title: 'Token Regulatory Considerations',
      description: 'Token grants may have securities law implications. Ensure token program has been reviewed by securities counsel ' +
        'and appropriate exemptions or registrations are in place.',
    });
  }

  return flags;
}

function checkPoolExhaustion(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg, companyContext } = context;
  const flags: RiskFlag[] = [];

  if (companyContext.capTable) {
    const poolRemaining = companyContext.capTable.optionPoolRemaining;
    const poolSize = companyContext.capTable.optionPoolSize;

    // Check if this grant uses too much of remaining pool
    if (pkg.poolImpactPercent > 25) {
      flags.push({
        type: 'pool-exhaustion',
        severity: pkg.poolImpactPercent > 50 ? 'critical' : 'warning',
        title: 'Significant Pool Impact',
        description: `This grant uses ${Math.round(pkg.poolImpactPercent)}% of the remaining option pool. ` +
          `After this grant, ${Math.round((pkg.poolRemainingAfter / poolSize) * 100)}% of the original pool will remain.`,
        actionRequired: pkg.poolImpactPercent > 50
          ? 'Consider reducing grant size or planning for pool expansion'
          : undefined,
      });
    }

    // Check if pool is getting low overall
    const poolUtilization = ((poolSize - poolRemaining) / poolSize) * 100;
    if (poolUtilization > 70) {
      flags.push({
        type: 'pool-exhaustion',
        severity: poolUtilization > 85 ? 'critical' : 'warning',
        title: 'Option Pool Running Low',
        description: `The option pool is ${Math.round(poolUtilization)}% utilized. ` +
          'Consider discussing pool expansion at next board meeting or financing round.',
        actionRequired: 'Plan for option pool refresh with board',
      });
    }
  }

  return flags;
}

function checkRunwayImpact(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg, companyContext } = context;
  const flags: RiskFlag[] = [];

  if (companyContext.runwayMonths && companyContext.runwayMonths < 18) {
    // Calculate if this hire significantly impacts runway
    // Assume ~$100k monthly burn for early stage, more for later
    const estimatedMonthlyBurn = getEstimatedMonthlyBurn(companyContext);
    const newBurn = estimatedMonthlyBurn + pkg.burnDeltaMonthly;
    const cashOnHand = estimatedMonthlyBurn * companyContext.runwayMonths;
    const newRunway = cashOnHand / newBurn;
    const runwayReduction = companyContext.runwayMonths - newRunway;

    if (runwayReduction > 1) {
      flags.push({
        type: 'runway-impact',
        severity: newRunway < 12 ? 'critical' : 'warning',
        title: 'Runway Impact',
        description: `This hire reduces runway by approximately ${runwayReduction.toFixed(1)} months ` +
          `(from ${companyContext.runwayMonths} to ${newRunway.toFixed(1)} months).`,
        actionRequired: newRunway < 12
          ? 'Ensure hire is critical and consider fundraising timeline'
          : undefined,
      });
    }
  }

  return flags;
}

function checkJurisdiction(context: RiskFlagContext): RiskFlag[] {
  const { roleProfile } = context;
  const flags: RiskFlag[] = [];

  if (roleProfile.geo === 'international') {
    flags.push({
      type: 'non-us-jurisdiction',
      severity: 'warning',
      title: 'International Hire - Local Counsel Required',
      description: 'Non-US hires may have different equity and compensation regulations. ' +
        'Tax treatment, equity restrictions, and employment laws vary significantly by jurisdiction.',
      actionRequired: 'Engage local employment counsel to review offer structure and ensure compliance',
    });
  }

  return flags;
}

function checkBoardApproval(context: RiskFlagContext): RiskFlag[] {
  const { package: pkg, roleProfile } = context;
  const flags: RiskFlag[] = [];

  // Large grants or executive hires typically need board approval
  const isExecutive = ['c-level', 'vp', 'director'].includes(roleProfile.jobLevel);
  const isLargeGrant = pkg.equityPercentFD > 0.5; // > 0.5% FD

  if (isExecutive || isLargeGrant) {
    flags.push({
      type: 'board-approval-required',
      severity: 'info',
      title: 'Board Approval Likely Required',
      description: isExecutive
        ? 'Executive compensation packages typically require board approval.'
        : `Equity grant of ${pkg.equityPercentFD.toFixed(2)}% FD may require specific board approval.`,
      actionRequired: 'Verify board approval requirements and obtain necessary consents before extending offer',
    });
  }

  return flags;
}

function estimateStrikePrice(companyContext: CompanyContext): number {
  const stageMultiples: Record<string, number> = {
    'pre-seed': 0.10,
    'seed': 0.25,
    'series-a': 0.75,
    'series-b': 2.00,
    'series-c+': 5.00,
  };

  return stageMultiples[companyContext.stage] ?? 1.00;
}

function getEstimatedMonthlyBurn(companyContext: CompanyContext): number {
  const stageBurns: Record<string, number> = {
    'pre-seed': 50000,
    'seed': 100000,
    'series-a': 250000,
    'series-b': 500000,
    'series-c+': 1000000,
  };

  return stageBurns[companyContext.stage] ?? 150000;
}
