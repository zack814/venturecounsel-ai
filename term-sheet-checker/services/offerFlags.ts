import type {
  EquityOffer,
  CashOffer,
  CompanyDetails,
  EmployeeBackground,
  OfferFlag,
  FlagSeverity,
  FlagCategory,
  MissingDataWarning,
  CashScore,
  EquityScore,
  TermsScore,
} from '@/lib/offer-evaluator-schemas';

// ============================================
// FLAG GENERATION
// ============================================

export function generateOfferFlags(
  equityOffer: EquityOffer,
  cashOffer: CashOffer,
  companyDetails: CompanyDetails,
  background: EmployeeBackground,
  cashScore: CashScore,
  equityScore: EquityScore,
  termsScore: TermsScore
): OfferFlag[] {
  const flags: OfferFlag[] = [];

  // ========== CASH FLAGS ==========

  if (cashScore.baseSalaryVsMedian < -15) {
    flags.push({
      id: 'cash-below-market',
      category: 'cash',
      severity: cashScore.baseSalaryVsMedian < -25 ? 'critical' : 'warning',
      title: 'Base salary below market',
      description: `Your base salary is ${Math.abs(Math.round(cashScore.baseSalaryVsMedian))}% below the market median for your role and level.`,
      recommendation: 'Negotiate for a higher base salary, citing market data. If cash is limited, consider a signing bonus to bridge the gap.',
    });
  } else if (cashScore.baseSalaryVsMedian > 15) {
    flags.push({
      id: 'cash-above-market',
      category: 'cash',
      severity: 'positive',
      title: 'Strong base salary',
      description: `Your base salary is ${Math.round(cashScore.baseSalaryVsMedian)}% above the market median.`,
    });
  }

  if (cashScore.comparedToCurrentSalary !== undefined) {
    if (cashScore.comparedToCurrentSalary < 0) {
      flags.push({
        id: 'salary-decrease',
        category: 'cash',
        severity: 'warning',
        title: 'Salary decrease from current',
        description: `This offer is ${Math.abs(Math.round(cashScore.comparedToCurrentSalary))}% lower than your current base salary.`,
        recommendation: 'Consider whether the equity upside and opportunity justify the salary cut. If not, negotiate for matching your current salary.',
      });
    } else if (cashScore.comparedToCurrentSalary > 20) {
      flags.push({
        id: 'salary-increase',
        category: 'cash',
        severity: 'positive',
        title: 'Significant salary increase',
        description: `This offer is ${Math.round(cashScore.comparedToCurrentSalary)}% higher than your current base salary.`,
      });
    }
  }

  // ========== EQUITY VALUE FLAGS ==========

  if (equityScore.valueConfidence === 'unknown') {
    flags.push({
      id: 'equity-unknown',
      category: 'equity-value',
      severity: 'warning',
      title: 'Cannot calculate equity value',
      description: 'Without the total shares outstanding or ownership percentage, we cannot determine what portion of the company you\'ll own.',
      recommendation: 'Ask your employer for the fully diluted share count so you can understand your ownership stake.',
    });
  } else if (equityScore.equityVsMedian !== undefined && equityScore.equityVsMedian < -25) {
    flags.push({
      id: 'equity-below-market',
      category: 'equity-value',
      severity: equityScore.equityVsMedian < -40 ? 'critical' : 'warning',
      title: 'Equity grant below market',
      description: `Your equity grant is ${Math.abs(Math.round(equityScore.equityVsMedian))}% below the market median for your role and stage.`,
      recommendation: 'Negotiate for additional equity. If the company cites budget constraints, ask for a signing bonus or accelerated vesting review.',
    });
  } else if (equityScore.equityVsMedian !== undefined && equityScore.equityVsMedian > 25) {
    flags.push({
      id: 'equity-above-market',
      category: 'equity-value',
      severity: 'positive',
      title: 'Strong equity grant',
      description: `Your equity grant is ${Math.round(equityScore.equityVsMedian)}% above the market median.`,
    });
  }

  // ========== EQUITY TERMS FLAGS ==========

  // Exercise Period (CRITICAL)
  if (equityOffer.exercisePeriod === '30-days') {
    flags.push({
      id: 'exercise-30-days',
      category: 'exercise',
      severity: 'critical',
      title: '30-day exercise window',
      description: 'You have only 30 days to exercise vested options after leaving. This is extremely employee-unfriendly.',
      recommendation: 'Strongly negotiate for an extended exercise window (5-10 years). This costs the company nothing but is hugely valuable to you.',
      educationalContent: 'With a 30-day window, if you leave you must either pay the full exercise cost within a month or lose your vested options entirely.',
    });
  } else if (equityOffer.exercisePeriod === '90-days') {
    flags.push({
      id: 'exercise-90-days',
      category: 'exercise',
      severity: 'warning',
      title: '90-day exercise window (standard but unfriendly)',
      description: '90 days is the industry standard but is still quite short. Many modern companies offer 5-10 year windows.',
      recommendation: 'Try to negotiate for an extended exercise window. Companies like Pinterest, Quora, and Coinbase have made this standard.',
    });
  } else if (equityOffer.exercisePeriod === '5-years' || equityOffer.exercisePeriod === '10-years') {
    flags.push({
      id: 'exercise-extended',
      category: 'exercise',
      severity: 'positive',
      title: 'Extended exercise window',
      description: `A ${equityOffer.exercisePeriod.replace('-', ' ')} exercise window gives you flexibility if you leave before a liquidity event.`,
    });
  }

  // Acceleration
  if (equityOffer.accelerationProvision === 'none') {
    flags.push({
      id: 'no-acceleration',
      category: 'acceleration',
      severity: 'warning',
      title: 'No acceleration on change of control',
      description: 'If the company is acquired and you\'re terminated, you could lose all unvested equity.',
      recommendation: 'Negotiate for double-trigger acceleration (acceleration if acquired AND terminated within 12-24 months).',
    });
  } else if (equityOffer.accelerationProvision === 'double-trigger') {
    flags.push({
      id: 'double-trigger',
      category: 'acceleration',
      severity: 'positive',
      title: 'Double-trigger acceleration',
      description: 'Your equity accelerates if the company is acquired and you\'re terminated. This is good protection.',
    });
  } else if (equityOffer.accelerationProvision === 'single-trigger') {
    flags.push({
      id: 'single-trigger',
      category: 'acceleration',
      severity: 'positive',
      title: 'Single-trigger acceleration',
      description: 'Your equity accelerates immediately on acquisition. This is excellent and rare.',
    });
  }

  // Early Exercise
  if (equityOffer.earlyExerciseAllowed === 'yes') {
    flags.push({
      id: 'early-exercise',
      category: 'equity-terms',
      severity: 'positive',
      title: 'Early exercise available',
      description: 'You can exercise options before they vest, enabling 83(b) election for potential tax benefits.',
      educationalContent: 'Early exercise + 83(b) election lets you start your capital gains clock immediately, potentially converting ordinary income to long-term capital gains.',
    });
  } else if (equityOffer.earlyExerciseAllowed === 'no' && companyDetails.stage === 'pre-seed') {
    flags.push({
      id: 'no-early-exercise',
      category: 'equity-terms',
      severity: 'neutral',
      title: 'Early exercise not available',
      description: 'You cannot exercise before vesting. At early stages with low strike prices, this is worth asking about.',
      recommendation: 'Consider asking if early exercise can be enabled. It\'s a simple administrative change that benefits you.',
    });
  }

  // Vesting
  if ((equityOffer.vestingTotalMonths || 48) > 48) {
    flags.push({
      id: 'long-vesting',
      category: 'vesting',
      severity: 'warning',
      title: 'Extended vesting period',
      description: `${equityOffer.vestingTotalMonths} months is longer than the standard 48 months.`,
      recommendation: 'Negotiate for standard 4-year vesting, or ask for more equity to compensate for the longer timeline.',
    });
  }

  if ((equityOffer.vestingCliffMonths || 12) > 12) {
    flags.push({
      id: 'long-cliff',
      category: 'vesting',
      severity: 'warning',
      title: 'Extended cliff period',
      description: `A ${equityOffer.vestingCliffMonths}-month cliff is longer than the standard 12 months.`,
      recommendation: 'Try to negotiate this down to 12 months or less.',
    });
  }

  // ========== TAX FLAGS ==========

  if (equityOffer.equityType === 'iso') {
    const exerciseCost = (equityOffer.shareCount || 0) * (equityOffer.strikePrice || 0);
    const spread = equityOffer.latestRoundPricePerShare && equityOffer.strikePrice
      ? (equityOffer.latestRoundPricePerShare - equityOffer.strikePrice) * (equityOffer.shareCount || 0)
      : 0;

    if (spread > 100000) {
      flags.push({
        id: 'amt-risk',
        category: 'tax',
        severity: 'warning',
        title: 'Potential AMT exposure',
        description: `If you exercise all ISOs at once, the ~$${Math.round(spread / 1000)}k spread could trigger Alternative Minimum Tax.`,
        recommendation: 'Consider exercising in tranches over multiple years, or consult a tax advisor about AMT planning.',
        educationalContent: 'AMT can create tax bills on "paper gains" - income you haven\'t realized. Plan exercises carefully.',
      });
    }
  }

  // ========== RISK FLAGS ==========

  if (companyDetails.stage === 'pre-seed' && background.financialSituation === 'need-stability') {
    flags.push({
      id: 'stage-risk',
      category: 'risk',
      severity: 'warning',
      title: 'High-risk stage with stability needs',
      description: 'Pre-seed companies have high failure rates. Consider whether this aligns with your need for financial stability.',
      recommendation: 'Ensure the cash compensation meets your needs, as equity may take years to become valuable (if ever).',
    });
  }

  // ========== OPPORTUNITY FLAGS ==========

  if (companyDetails.stage === 'pre-seed' || companyDetails.stage === 'seed') {
    if (equityScore.percentOfCompany && equityScore.percentOfCompany > 0.25) {
      flags.push({
        id: 'meaningful-ownership',
        category: 'opportunity',
        severity: 'positive',
        title: 'Meaningful early-stage ownership',
        description: `${equityScore.percentOfCompany.toFixed(2)}% ownership at ${companyDetails.stage} stage could be significant if the company succeeds.`,
      });
    }
  }

  return flags;
}

// ============================================
// MISSING DATA WARNINGS
// ============================================

export function generateMissingDataWarnings(
  equityOffer: EquityOffer
): MissingDataWarning[] {
  const warnings: MissingDataWarning[] = [];

  if (!equityOffer.strikePrice) {
    warnings.push({
      field: 'strikePrice',
      displayName: '409A Valuation / Strike Price',
      impact: 'Cannot calculate exercise cost or compare to market valuation',
      howToGet: 'Ask your employer directly before signing',
      questionToAsk: 'What is the current 409A fair market value per share?',
      importanceLevel: 'critical',
    });
  }

  if (!equityOffer.totalSharesOutstanding && !equityOffer.percentOfCompany) {
    warnings.push({
      field: 'totalSharesOutstanding',
      displayName: 'Total Shares Outstanding',
      impact: 'Cannot calculate your ownership percentage of the company',
      howToGet: 'Ask your employer or request from the stock plan administrator',
      questionToAsk: 'How many fully diluted shares are currently outstanding?',
      importanceLevel: 'critical',
    });
  }

  if (!equityOffer.latestValuation && !equityOffer.latestRoundPricePerShare) {
    warnings.push({
      field: 'latestValuation',
      displayName: 'Company Valuation',
      impact: 'Cannot estimate the current value of your equity',
      howToGet: 'Ask about the last funding round or preferred share price',
      questionToAsk: 'What was the company valuation in the most recent funding round?',
      importanceLevel: 'important',
    });
  }

  if (equityOffer.exercisePeriod === 'unknown') {
    warnings.push({
      field: 'exercisePeriod',
      displayName: 'Post-Termination Exercise Period',
      impact: 'This is one of the most important terms - it determines how long you have to exercise after leaving',
      howToGet: 'Ask directly or review the stock option agreement',
      questionToAsk: 'What is the post-termination exercise period for options?',
      importanceLevel: 'critical',
    });
  }

  if (equityOffer.accelerationProvision === 'unknown') {
    warnings.push({
      field: 'accelerationProvision',
      displayName: 'Acceleration on Change of Control',
      impact: 'Determines whether you keep unvested equity if acquired and terminated',
      howToGet: 'Ask about the change of control provisions in the stock plan',
      questionToAsk: 'Is there acceleration of vesting on change of control? Single or double-trigger?',
      importanceLevel: 'important',
    });
  }

  if (equityOffer.earlyExerciseAllowed === 'unknown') {
    warnings.push({
      field: 'earlyExerciseAllowed',
      displayName: 'Early Exercise',
      impact: 'Early exercise enables 83(b) elections for tax benefits',
      howToGet: 'Ask your employer or review the stock option agreement',
      questionToAsk: 'Is early exercise available for unvested options?',
      importanceLevel: 'helpful',
    });
  }

  return warnings;
}

// ============================================
// SEPARATE FLAGS BY SEVERITY
// ============================================

export function categorizeFlags(flags: OfferFlag[]): {
  positiveFlags: OfferFlag[];
  warningFlags: OfferFlag[];
  criticalFlags: OfferFlag[];
  neutralFlags: OfferFlag[];
} {
  return {
    positiveFlags: flags.filter(f => f.severity === 'positive'),
    warningFlags: flags.filter(f => f.severity === 'warning'),
    criticalFlags: flags.filter(f => f.severity === 'critical'),
    neutralFlags: flags.filter(f => f.severity === 'neutral'),
  };
}
