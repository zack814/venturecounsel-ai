import type {
  EquityOffer,
  CashOffer,
  CompanyDetails,
  EmployeeBackground,
  NegotiationContext,
  NegotiationSuggestion,
  CashScore,
  EquityScore,
  TermsScore,
} from '@/lib/offer-evaluator-schemas';

// ============================================
// NEGOTIATION SUGGESTIONS
// ============================================

export function generateNegotiationSuggestions(
  equityOffer: EquityOffer,
  cashOffer: CashOffer,
  companyDetails: CompanyDetails,
  background: EmployeeBackground,
  negotiationContext: NegotiationContext,
  cashScore: CashScore,
  equityScore: EquityScore,
  termsScore: TermsScore
): NegotiationSuggestion[] {
  const suggestions: NegotiationSuggestion[] = [];
  const hasLeverage = negotiationContext.competingOffers !== 'none';

  // ========== STANDARD SUGGESTIONS ==========

  // Base Salary
  if (cashScore.baseSalaryVsMedian < 0) {
    const targetIncrease = Math.abs(cashScore.baseSalaryVsMedian) + 5;
    suggestions.push({
      id: 'base-salary',
      category: 'standard',
      title: 'Negotiate Base Salary',
      currentValue: `$${(cashOffer.baseSalary || 0).toLocaleString()}/year`,
      suggestedValue: `$${Math.round((cashOffer.baseSalary || 0) * (1 + targetIncrease / 100)).toLocaleString()}/year (${targetIncrease.toFixed(0)}% increase)`,
      rationale: `Your base salary is ${Math.abs(Math.round(cashScore.baseSalaryVsMedian))}% below market median. A higher base compounds over time and affects future raises.`,
      suggestedLanguage: `Based on my research of market rates for ${background.jobLevel} ${background.jobFamily} roles at ${companyDetails.stage} companies, I'd like to discuss bringing the base salary to $${Math.round((cashOffer.baseSalary || 0) * 1.1).toLocaleString()}. This would bring it in line with the 50th percentile for comparable roles.`,
      difficulty: 'medium',
      successLikelihood: hasLeverage ? 'high' : 'medium',
      impactLevel: 'high',
    });
  }

  // Equity Increase
  if (equityScore.equityVsMedian !== undefined && equityScore.equityVsMedian < 0) {
    const targetIncrease = Math.abs(equityScore.equityVsMedian) + 10;
    suggestions.push({
      id: 'equity-increase',
      category: 'standard',
      title: 'Negotiate More Equity',
      currentValue: equityOffer.shareCount ? `${equityOffer.shareCount.toLocaleString()} shares` : 'Current grant',
      suggestedValue: equityOffer.shareCount
        ? `${Math.round(equityOffer.shareCount * (1 + targetIncrease / 100)).toLocaleString()} shares`
        : `${targetIncrease}% more shares`,
      rationale: `Your equity grant is ${Math.abs(Math.round(equityScore.equityVsMedian))}% below market median for your role and stage. At early-stage companies, equity is where the real upside lies.`,
      suggestedLanguage: `I'm very excited about the company's potential and would like to have more ownership in our success together. Would you consider increasing the equity grant to ${Math.round((equityOffer.shareCount || 0) * 1.15).toLocaleString()} shares? This would bring it closer to the market median for similar roles.`,
      difficulty: 'medium',
      successLikelihood: 'medium',
      impactLevel: 'high',
    });
  }

  // Signing Bonus
  if (!cashOffer.signingBonus || cashOffer.signingBonus < 10000) {
    const suggestedBonus = companyDetails.stage === 'pre-seed' || companyDetails.stage === 'seed'
      ? 15000
      : 25000;
    suggestions.push({
      id: 'signing-bonus',
      category: 'standard',
      title: 'Request Signing Bonus',
      currentValue: cashOffer.signingBonus ? `$${cashOffer.signingBonus.toLocaleString()}` : 'None',
      suggestedValue: `$${suggestedBonus.toLocaleString()}`,
      rationale: 'A signing bonus is easier to negotiate than base salary since it\'s a one-time cost. It can help bridge gaps without affecting ongoing budget.',
      suggestedLanguage: `Would the company consider a signing bonus of $${suggestedBonus.toLocaleString()}? This would help offset my transition costs and demonstrate the company's commitment to this hire.`,
      difficulty: 'medium',
      successLikelihood: 'high',
      impactLevel: 'medium',
    });
  }

  // ========== NON-OBVIOUS SUGGESTIONS ==========

  // Extended Exercise Period (CRITICAL)
  if (equityOffer.exercisePeriod === '30-days' || equityOffer.exercisePeriod === '90-days' || equityOffer.exercisePeriod === 'unknown') {
    const exerciseCost = (equityOffer.shareCount || 0) * (equityOffer.strikePrice || 0);
    suggestions.push({
      id: 'extended-exercise',
      category: 'non-obvious',
      title: 'Extended Post-Termination Exercise Period',
      currentValue: equityOffer.exercisePeriod?.replace('-', ' ') || 'Unknown',
      suggestedValue: '10 years or until company exit',
      rationale: `A short exercise window could force you to pay $${exerciseCost.toLocaleString()} within ${equityOffer.exercisePeriod?.replace('-', ' ') || '90 days'} of leaving, or lose your vested options. Extended windows cost the company nothing but protect you significantly.`,
      suggestedLanguage: `I'd like to request an extended post-termination exercise period of 10 years (or until a liquidity event). This is increasingly standard at employee-friendly companies like Pinterest, Quora, and Coinbase. It doesn't dilute existing shareholders or cost the company anything - it just gives me flexibility if my circumstances change.`,
      difficulty: 'medium',
      successLikelihood: 'medium',
      impactLevel: 'high',
      relevantWhen: 'This is one of the most impactful terms to negotiate, especially if you might leave before a liquidity event.',
    });
  }

  // Double-Trigger Acceleration
  if (equityOffer.accelerationProvision === 'none' || equityOffer.accelerationProvision === 'unknown') {
    suggestions.push({
      id: 'double-trigger',
      category: 'non-obvious',
      title: 'Double-Trigger Vesting Acceleration',
      currentValue: equityOffer.accelerationProvision?.replace(/-/g, ' ') || 'Unknown',
      suggestedValue: '100% acceleration on acquisition + termination within 12 months',
      rationale: 'Without acceleration, if the company is acquired and you\'re let go, you could lose all unvested equity. Double-trigger protects you while maintaining retention incentives for the acquirer.',
      suggestedLanguage: `I'd like to include double-trigger acceleration in my offer - meaning 100% of my unvested shares would accelerate if there's a change of control AND I'm involuntarily terminated within 12 months. This is increasingly common and protects employees without removing retention incentives during an acquisition transition.`,
      difficulty: 'hard',
      successLikelihood: 'medium',
      impactLevel: 'high',
      relevantWhen: 'Critical if you join a company that might be acquired.',
    });
  }

  // Early Exercise
  if (equityOffer.earlyExerciseAllowed !== 'yes' && (companyDetails.stage === 'pre-seed' || companyDetails.stage === 'seed')) {
    suggestions.push({
      id: 'early-exercise',
      category: 'non-obvious',
      title: 'Enable Early Exercise',
      currentValue: equityOffer.earlyExerciseAllowed === 'no' ? 'Not available' : 'Unknown',
      suggestedValue: 'Allow early exercise of unvested options',
      rationale: 'Early exercise with an 83(b) election lets you start your capital gains clock immediately. At a low strike price, this can convert years of gains from ordinary income to long-term capital gains - potentially saving 15-20% in taxes.',
      suggestedLanguage: `Does the company allow early exercise of options? I'd like the ability to exercise unvested shares and file an 83(b) election to optimize my tax situation. This is a common feature that doesn't require any changes to the stock plan itself.`,
      difficulty: 'easy',
      successLikelihood: 'high',
      impactLevel: 'medium',
      relevantWhen: 'Most valuable at early stages with low strike prices.',
    });
  }

  // Refresher Grant Commitment
  suggestions.push({
    id: 'refresher-timing',
    category: 'non-obvious',
    title: 'Refresher Grant Commitment',
    currentValue: 'No commitment',
    suggestedValue: 'Annual refresh grants tied to performance',
    rationale: 'Your initial grant will be mostly vested after 2-3 years. Without refresher grants, your equity participation diminishes while your contributions may increase.',
    suggestedLanguage: `Can you share the company's policy on equity refresh grants? I'd like to understand how top performers receive additional grants and whether there's a target annual refresher amount for my level.`,
    difficulty: 'easy',
    successLikelihood: 'high',
    impactLevel: 'medium',
    relevantWhen: 'Important for long-term retention.',
  });

  // Signing Bonus to Bridge Equity Gap
  if (equityScore.equityVsMedian !== undefined && equityScore.equityVsMedian < -15 && (!cashOffer.signingBonus || cashOffer.signingBonus < 10000)) {
    const gapAmount = Math.round(Math.abs(equityScore.equityVsMedian) * 500); // Rough heuristic
    suggestions.push({
      id: 'signing-bonus-bridge',
      category: 'non-obvious',
      title: 'Signing Bonus to Bridge Equity Gap',
      currentValue: 'No signing bonus',
      suggestedValue: `$${Math.min(50000, Math.max(15000, gapAmount)).toLocaleString()} signing bonus`,
      rationale: 'If equity is below market but the company can\'t increase the grant, a signing bonus provides immediate cash value without permanent budget impact.',
      suggestedLanguage: `Given that the equity grant is below the 50th percentile for my role, would you consider a signing bonus of $${Math.min(50000, Math.max(15000, gapAmount)).toLocaleString()} to help bridge that gap? It's a one-time cost that doesn't affect ongoing burn rate or create internal equity concerns.`,
      difficulty: 'medium',
      successLikelihood: 'medium',
      impactLevel: 'medium',
    });
  }

  // ========== PRIORITIZE AND SORT ==========

  // Sort by impact level and success likelihood
  const impactOrder = { high: 3, medium: 2, low: 1 };
  const successOrder = { high: 3, medium: 2, low: 1 };

  suggestions.sort((a, b) => {
    const aScore = impactOrder[a.impactLevel] * 2 + successOrder[a.successLikelihood];
    const bScore = impactOrder[b.impactLevel] * 2 + successOrder[b.successLikelihood];
    return bScore - aScore;
  });

  return suggestions;
}

// ============================================
// COUNTER-OFFER EMAIL GENERATOR
// ============================================

export function generateCounterOfferEmail(
  suggestions: NegotiationSuggestion[],
  companyDetails: CompanyDetails,
  background: EmployeeBackground,
  negotiationContext: NegotiationContext
): string {
  const companyName = companyDetails.companyName || '[Company Name]';
  const topSuggestions = suggestions.slice(0, 3);
  const tone = (negotiationContext.excitementLevel || 3) >= 4 ? 'enthusiastic' : 'professional';

  let email = '';

  if (tone === 'enthusiastic') {
    email += `Subject: Excited About the Offer - A Few Discussion Points\n\n`;
    email += `Hi [Hiring Manager/Recruiter],\n\n`;
    email += `Thank you so much for the offer to join ${companyName}! I've really enjoyed getting to know the team and I'm genuinely excited about what we could accomplish together.\n\n`;
    email += `Before I sign, I wanted to discuss a few aspects of the compensation package. I want to make sure I can fully commit and be set up for long-term success:\n\n`;
  } else {
    email += `Subject: Offer Discussion - ${background.jobLevel?.charAt(0).toUpperCase()}${background.jobLevel?.slice(1)} ${background.jobFamily?.charAt(0).toUpperCase()}${background.jobFamily?.slice(1)} Role\n\n`;
    email += `Hi [Hiring Manager/Recruiter],\n\n`;
    email += `Thank you for extending the offer to join ${companyName}. I'm enthusiastic about the opportunity and have given the package careful consideration.\n\n`;
    email += `After reviewing the compensation and researching market rates for comparable roles, I'd like to discuss a few adjustments:\n\n`;
  }

  // Add top suggestions
  topSuggestions.forEach((suggestion, index) => {
    email += `${index + 1}. **${suggestion.title}**\n`;
    email += `   ${suggestion.suggestedLanguage}\n\n`;
  });

  if (tone === 'enthusiastic') {
    email += `I want to be transparent that I'm very interested in joining - these are just clarifying discussions that will help me feel confident in my decision. I'm confident we can find an arrangement that works for everyone.\n\n`;
    email += `Would you be available for a call this week to discuss?\n\n`;
    email += `Looking forward to working this out!\n\n`;
  } else {
    email += `I'm confident we can find an arrangement that works well for both of us. I'm very motivated to join the team and contribute to ${companyName}'s success.\n\n`;
    email += `Would you be available for a call this week to discuss these points?\n\n`;
    email += `Best regards,\n`;
  }

  email += `[Your Name]`;

  return email;
}

// ============================================
// TALKING POINTS GENERATOR
// ============================================

export function generateTalkingPoints(
  suggestions: NegotiationSuggestion[],
  negotiationContext: NegotiationContext,
  cashScore: CashScore,
  equityScore: EquityScore
): string[] {
  const points: string[] = [];

  // Opening
  points.push('Start by expressing genuine enthusiasm for the role and company');
  points.push('Frame the negotiation as finding a package that works for both sides');

  // Leverage
  if (negotiationContext.competingOffers === 'multiple') {
    points.push('Mention you\'re considering multiple opportunities (don\'t give specifics unless asked)');
  } else if (negotiationContext.competingOffers === 'one') {
    points.push('Note that you\'re also in discussions with another company');
  }

  // Market data
  if (cashScore.baseSalaryVsMedian < -10) {
    points.push(`Reference market data showing salary is ${Math.abs(Math.round(cashScore.baseSalaryVsMedian))}% below median`);
  }
  if (equityScore.equityVsMedian !== undefined && equityScore.equityVsMedian < -10) {
    points.push(`Reference market data showing equity is ${Math.abs(Math.round(equityScore.equityVsMedian))}% below median`);
  }

  // Key asks
  const topSuggestions = suggestions.slice(0, 3);
  topSuggestions.forEach(s => {
    points.push(`Ask for: ${s.title} - ${s.suggestedValue}`);
  });

  // Flexibility
  points.push('Show flexibility - indicate which items are most important vs. nice-to-have');
  points.push('If they can\'t move on salary, suggest alternatives (signing bonus, equity, etc.)');

  // Closing
  points.push('Set a timeline: "I\'d like to make a decision by [date]"');
  points.push('Thank them for their time and reiterate your interest');

  return points;
}
