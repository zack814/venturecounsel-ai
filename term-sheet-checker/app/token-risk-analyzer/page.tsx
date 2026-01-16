'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FormData {
  projectName: string;
  entityType: string;
  primaryJurisdiction: string;
  tokenName: string;
  tokenSymbol: string;
  tokenClassification: string;
  primaryPurpose: string[];
  fundingMechanisms: string[];
  prelaunchMarketing: string[];
  poolingArrangements: string[];
  revenueReliance: string[];
  whitepaperLanguage: string[];
  dividendFeatures: string[];
  coreTeamDependency: string[];
  decentralizationFeatures: string[];
  governanceStructure: string[];
  tokenFunctionality: string[];
  communityContributions: string[];
  publicStatements: string[];
  secondaryMarket: string[];
  lockupPeriods: string[];
  riskDisclosures: string[];
  additionalNotes: string;
}

interface HoweyProngAnalysis {
  score: number;
  status: 'Likely Met' | 'Possibly Met' | 'Likely Not Met';
  factors: string[];
  mitigatingFactors: string[];
}

interface HoweyAnalysis {
  prongs: {
    investmentOfMoney: HoweyProngAnalysis;
    commonEnterprise: HoweyProngAnalysis;
    expectationOfProfits: HoweyProngAnalysis;
    effortsOfOthers: HoweyProngAnalysis;
  };
  overallConclusion: string;
}

interface TimelineRisk {
  level: 'High' | 'Medium' | 'Low';
  score: number;
  factors: string[];
}

interface Analysis {
  overallRisk: {
    score: number;
    level: 'High' | 'Medium' | 'Low';
    summary: string;
  };
  howeyAnalysis: HoweyAnalysis;
  revesAnalysis: {
    isNotelike: boolean;
    familyResemblance: string;
    riskLevel: 'High' | 'Medium' | 'Low';
  };
  timelineRisk: {
    t0: TimelineRisk;
    t1: TimelineRisk;
    t2: TimelineRisk;
  };
  topRedFlags: string[];
  topMitigators: string[];
}

interface Mitigation {
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  title: string;
  description: string;
  implementation: string;
}

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialFormData: FormData = {
  projectName: '',
  entityType: '',
  primaryJurisdiction: '',
  tokenName: '',
  tokenSymbol: '',
  tokenClassification: '',
  primaryPurpose: [],
  fundingMechanisms: [],
  prelaunchMarketing: [],
  poolingArrangements: [],
  revenueReliance: [],
  whitepaperLanguage: [],
  dividendFeatures: [],
  coreTeamDependency: [],
  decentralizationFeatures: [],
  governanceStructure: [],
  tokenFunctionality: [],
  communityContributions: [],
  publicStatements: [],
  secondaryMarket: [],
  lockupPeriods: [],
  riskDisclosures: [],
  additionalNotes: '',
};

const steps = [
  { num: 1, title: 'Project Info', description: 'Basic project details' },
  { num: 2, title: 'Token Details', description: 'Token characteristics' },
  { num: 3, title: 'Investment of Money', description: 'Howey Prong 1' },
  { num: 4, title: 'Common Enterprise', description: 'Howey Prong 2' },
  { num: 5, title: 'Profit Expectation', description: 'Howey Prong 3' },
  { num: 6, title: 'Efforts of Others', description: 'Howey Prong 4' },
  { num: 7, title: 'Token Utility', description: 'Functional analysis' },
  { num: 8, title: 'Marketing & Distribution', description: 'Distribution model' },
  { num: 9, title: 'Additional Factors', description: 'Final considerations' },
  { num: 10, title: 'Results', description: 'Analysis & recommendations' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TokenRiskPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [mitigations, setMitigations] = useState<Mitigation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const updateFormData = (field: keyof FormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      updateFormData(field, currentArray.filter(i => i !== item));
    } else {
      updateFormData(field, [...currentArray, item]);
    }
  };

  const nextStep = () => {
    if (currentStep < 10) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentStep(10);
    setTimeout(() => {
      const result = performAnalysis(formData);
      setAnalysis(result.analysis);
      setMitigations(result.mitigations);
      setIsAnalyzing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  };

  const startOver = () => {
    if (confirm('Are you sure you want to start over? All data will be lost.')) {
      setFormData(initialFormData);
      setAnalysis(null);
      setMitigations([]);
      setCurrentStep(1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --------------------------------------------------------------------------
  // Analysis Engine
  // --------------------------------------------------------------------------

  function performAnalysis(data: FormData): { analysis: Analysis; mitigations: Mitigation[] } {
    const investmentScore = calculateInvestmentOfMoneyScore(data);
    const enterpriseScore = calculateCommonEnterpriseScore(data);
    const profitScore = calculateExpectationOfProfitsScore(data);
    const effortsScore = calculateEffortsOfOthersScore(data);

    const howeyAnalysis: HoweyAnalysis = {
      prongs: {
        investmentOfMoney: {
          score: investmentScore,
          status: getStatus(investmentScore),
          factors: getInvestmentFactors(data),
          mitigatingFactors: getInvestmentMitigators(data),
        },
        commonEnterprise: {
          score: enterpriseScore,
          status: getStatus(enterpriseScore),
          factors: getEnterpriseFactors(data),
          mitigatingFactors: getEnterpriseMitigators(data),
        },
        expectationOfProfits: {
          score: profitScore,
          status: getStatus(profitScore),
          factors: getProfitFactors(data),
          mitigatingFactors: getProfitMitigators(data),
        },
        effortsOfOthers: {
          score: effortsScore,
          status: getStatus(effortsScore),
          factors: getEffortsFactors(data),
          mitigatingFactors: getEffortsMitigators(data),
        },
      },
      overallConclusion: generateHoweyConclusion([investmentScore, enterpriseScore, profitScore, effortsScore]),
    };

    const overallScore = Math.round((investmentScore + enterpriseScore + profitScore + effortsScore) / 4);
    const overallLevel = overallScore >= 70 ? 'High' : overallScore >= 40 ? 'Medium' : 'Low';
    const revesAnalysis = performRevesAnalysis(data);
    const timelineRisk = calculateTimelineRisk(overallScore, data);

    const analysisResult: Analysis = {
      overallRisk: {
        score: overallScore,
        level: overallLevel,
        summary: generateOverallSummary(overallLevel, data),
      },
      howeyAnalysis,
      revesAnalysis,
      timelineRisk,
      topRedFlags: collectRedFlags(data, howeyAnalysis),
      topMitigators: collectMitigators(data),
    };

    const mitigationList = generateMitigations(data, analysisResult);
    return { analysis: analysisResult, mitigations: mitigationList };
  }

  function getStatus(score: number): 'Likely Met' | 'Possibly Met' | 'Likely Not Met' {
    if (score >= 70) return 'Likely Met';
    if (score >= 40) return 'Possibly Met';
    return 'Likely Not Met';
  }

  function calculateInvestmentOfMoneyScore(data: FormData): number {
    let score = 0;
    if (data.fundingMechanisms.includes('publicSale')) score += 30;
    if (data.fundingMechanisms.includes('presale')) score += 25;
    if (data.fundingMechanisms.includes('ico')) score += 35;
    if (data.fundingMechanisms.includes('vcFunding')) score += 15;
    if (data.fundingMechanisms.includes('saft')) score += 20;
    if (data.prelaunchMarketing.includes('priceAppreciation')) score += 20;
    if (data.prelaunchMarketing.includes('investmentReturns')) score += 25;
    if (data.prelaunchMarketing.includes('earlyAdopterAdvantage')) score += 15;
    if (data.secondaryMarket.includes('exchanges')) score += 15;
    if (data.fundingMechanisms.includes('airdrop')) score -= 15;
    if (data.fundingMechanisms.includes('mining')) score -= 10;
    if (data.tokenFunctionality.includes('immediateUse')) score -= 10;
    return Math.max(0, Math.min(score, 100));
  }

  function calculateCommonEnterpriseScore(data: FormData): number {
    let score = 0;
    if (data.poolingArrangements.includes('treasuryPooling')) score += 25;
    if (data.poolingArrangements.includes('sharedRevenue')) score += 30;
    if (data.poolingArrangements.includes('commonPromoter')) score += 20;
    if (data.poolingArrangements.includes('sharedPlatform')) score += 15;
    if (data.revenueReliance.includes('centralEntity')) score += 25;
    if (data.revenueReliance.includes('teamDevelopment')) score += 20;
    if (data.revenueReliance.includes('protocolFees')) score += 10;
    if (data.revenueReliance.includes('networkActivity')) score -= 15;
    if (data.decentralizationFeatures.includes('distributedNodes')) score -= 10;
    return Math.max(0, Math.min(score, 100));
  }

  function calculateExpectationOfProfitsScore(data: FormData): number {
    let score = 0;
    if (data.whitepaperLanguage.includes('priceTargets')) score += 30;
    if (data.whitepaperLanguage.includes('returnProjections')) score += 35;
    if (data.whitepaperLanguage.includes('appreciationPotential')) score += 25;
    if (data.prelaunchMarketing.includes('priceAppreciation')) score += 25;
    if (data.publicStatements.includes('priceDiscussion')) score += 20;
    if (data.dividendFeatures.includes('revenueShare')) score += 30;
    if (data.dividendFeatures.includes('staking')) score += 15;
    if (data.dividendFeatures.includes('buyback')) score += 20;
    if (data.whitepaperLanguage.includes('utilityFocus')) score -= 15;
    if (data.whitepaperLanguage.includes('riskDisclosures')) score -= 10;
    if (data.tokenFunctionality.includes('consumptionRequired')) score -= 20;
    if (data.dividendFeatures.includes('none')) score -= 15;
    return Math.max(0, Math.min(score, 100));
  }

  function calculateEffortsOfOthersScore(data: FormData): number {
    let score = 0;
    if (data.coreTeamDependency.includes('essentialDevelopment')) score += 30;
    if (data.coreTeamDependency.includes('ongoingManagement')) score += 25;
    if (data.coreTeamDependency.includes('marketMaking')) score += 20;
    if (data.coreTeamDependency.includes('marketing')) score += 15;
    if (data.governanceStructure.includes('centralized')) score += 25;
    if (data.decentralizationFeatures.length === 0) score += 20;
    if (data.communityContributions.length === 0) score += 15;
    if (data.governanceStructure.includes('daoGovernance')) score -= 25;
    if (data.governanceStructure.includes('tokenVoting')) score -= 15;
    if (data.decentralizationFeatures.includes('distributedNodes')) score -= 15;
    if (data.decentralizationFeatures.includes('openProtocol')) score -= 10;
    if (data.decentralizationFeatures.includes('permissionless')) score -= 10;
    if (data.communityContributions.includes('openSource')) score -= 15;
    if (data.communityContributions.includes('communityDev')) score -= 10;
    return Math.max(0, Math.min(score, 100));
  }

  function getInvestmentFactors(data: FormData): string[] {
    const factors: string[] = [];
    if (data.fundingMechanisms.includes('publicSale')) factors.push('Public token sale involves investment of money');
    if (data.fundingMechanisms.includes('ico')) factors.push('ICO structure strongly indicates investment contract');
    if (data.fundingMechanisms.includes('presale')) factors.push('Presale to investors suggests investment nature');
    if (data.fundingMechanisms.includes('saft')) factors.push('SAFT agreement indicates future token delivery for current payment');
    if (data.prelaunchMarketing.includes('investmentReturns')) factors.push('Marketing emphasizes investment returns');
    if (data.prelaunchMarketing.includes('earlyAdopterAdvantage')) factors.push('Early adopter pricing suggests investment opportunity');
    return factors;
  }

  function getInvestmentMitigators(data: FormData): string[] {
    const mitigators: string[] = [];
    if (data.fundingMechanisms.includes('airdrop')) mitigators.push('Airdrops reduce investment character');
    if (data.fundingMechanisms.includes('mining')) mitigators.push('Mining rewards earned through effort');
    if (data.tokenFunctionality.includes('immediateUse')) mitigators.push('Immediate utility at purchase');
    if (data.prelaunchMarketing.includes('utility')) mitigators.push('Utility-focused marketing');
    return mitigators;
  }

  function getEnterpriseFactors(data: FormData): string[] {
    const factors: string[] = [];
    if (data.poolingArrangements.includes('treasuryPooling')) factors.push('Treasury pooling links investor fortunes');
    if (data.poolingArrangements.includes('sharedRevenue')) factors.push('Revenue sharing creates horizontal commonality');
    if (data.poolingArrangements.includes('commonPromoter')) factors.push('Common promoter/team establishes vertical commonality');
    if (data.revenueReliance.includes('centralEntity')) factors.push('Value depends on central entity performance');
    return factors;
  }

  function getEnterpriseMitigators(data: FormData): string[] {
    const mitigators: string[] = [];
    if (data.decentralizationFeatures.includes('distributedNodes')) mitigators.push('Distributed network infrastructure');
    if (data.revenueReliance.includes('networkActivity')) mitigators.push('Value driven by decentralized network activity');
    return mitigators;
  }

  function getProfitFactors(data: FormData): string[] {
    const factors: string[] = [];
    if (data.whitepaperLanguage.includes('priceTargets')) factors.push('Price targets in documentation');
    if (data.whitepaperLanguage.includes('returnProjections')) factors.push('Return/yield projections published');
    if (data.publicStatements.includes('priceDiscussion')) factors.push('Team publicly discusses price appreciation');
    if (data.dividendFeatures.includes('revenueShare')) factors.push('Revenue sharing resembles dividends');
    if (data.dividendFeatures.includes('buyback')) factors.push('Buyback program supports token price');
    return factors;
  }

  function getProfitMitigators(data: FormData): string[] {
    const mitigators: string[] = [];
    if (data.tokenFunctionality.includes('consumptionRequired')) mitigators.push('Token consumed in use (not held for appreciation)');
    if (data.tokenFunctionality.includes('accessRequired')) mitigators.push('Token required for platform access');
    if (data.whitepaperLanguage.includes('utilityFocus')) mitigators.push('Documentation focuses on utility');
    if (data.dividendFeatures.includes('none')) mitigators.push('No dividend-like features');
    return mitigators;
  }

  function getEffortsFactors(data: FormData): string[] {
    const factors: string[] = [];
    if (data.coreTeamDependency.includes('essentialDevelopment')) factors.push('Core team essential for platform development');
    if (data.coreTeamDependency.includes('ongoingManagement')) factors.push('Ongoing management required from team');
    if (data.governanceStructure.includes('centralized')) factors.push('Centralized decision-making');
    if (data.communityContributions.length === 0) factors.push('No meaningful community contributions');
    return factors;
  }

  function getEffortsMitigators(data: FormData): string[] {
    const mitigators: string[] = [];
    if (data.governanceStructure.includes('daoGovernance')) mitigators.push('DAO governance structure');
    if (data.governanceStructure.includes('tokenVoting')) mitigators.push('Token holder voting rights');
    if (data.communityContributions.includes('openSource')) mitigators.push('Open source development');
    if (data.communityContributions.includes('communityDev')) mitigators.push('Active community developers');
    if (data.decentralizationFeatures.includes('permissionless')) mitigators.push('Permissionless participation');
    return mitigators;
  }

  function generateHoweyConclusion(scores: number[]): string {
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const allHigh = scores.every(s => s >= 70);
    const mostHigh = scores.filter(s => s >= 70).length >= 3;
    if (allHigh) return 'HIGH RISK: All four Howey prongs appear satisfied. This token has a high likelihood of being classified as a security under the Howey test. Significant restructuring or securities registration recommended.';
    if (mostHigh) return 'ELEVATED RISK: Three or more Howey prongs likely satisfied. Strong probability of security classification. Structural modifications and legal consultation strongly advised.';
    if (avgScore >= 60) return 'MODERATE-HIGH RISK: Multiple Howey prongs may be satisfied. Careful structuring and mitigation measures recommended before launch.';
    if (avgScore >= 40) return 'MODERATE RISK: Mixed signals on security classification. Some prongs may be satisfied. Review recommended mitigations to reduce risk profile.';
    return 'LOWER RISK: Based on current structure, fewer Howey prongs appear satisfied. Continue monitoring and maintain utility-focused approach.';
  }

  function performRevesAnalysis(data: FormData): { isNotelike: boolean; familyResemblance: string; riskLevel: 'High' | 'Medium' | 'Low' } {
    let notelikeScore = 0;
    if (data.dividendFeatures.includes('revenueShare')) notelikeScore += 25;
    if (data.dividendFeatures.includes('staking')) notelikeScore += 15;
    if (data.fundingMechanisms.includes('presale')) notelikeScore += 20;
    if (data.primaryPurpose.includes('fundraising')) notelikeScore += 30;
    const isNotelike = notelikeScore >= 40;
    let familyResemblance = 'Does not closely resemble traditional securities';
    if (notelikeScore >= 60) familyResemblance = 'Resembles investment notes or profit-sharing agreements';
    else if (notelikeScore >= 40) familyResemblance = 'Has some characteristics of note-like instruments';
    return { isNotelike, familyResemblance, riskLevel: notelikeScore >= 60 ? 'High' : notelikeScore >= 40 ? 'Medium' : 'Low' };
  }

  function calculateTimelineRisk(baseScore: number, data: FormData): { t0: TimelineRisk; t1: TimelineRisk; t2: TimelineRisk } {
    const t0Score = Math.min(baseScore + 20, 100);
    const t1Score = Math.max(baseScore - 10, 0);
    const hasStrongDecentralization = data.decentralizationFeatures.length >= 3 && data.governanceStructure.includes('daoGovernance');
    const t2Score = hasStrongDecentralization ? Math.max(baseScore - 35, 0) : Math.max(baseScore - 10, 0);
    return {
      t0: { level: t0Score >= 70 ? 'High' : t0Score >= 40 ? 'Medium' : 'Low', score: Math.round(t0Score), factors: ['Pre-functional or limited network', 'High team dependency', 'Active marketing period', 'Limited decentralization'] },
      t1: { level: t1Score >= 70 ? 'High' : t1Score >= 40 ? 'Medium' : 'Low', score: Math.round(t1Score), factors: ['Network gaining functional utility', 'Growing independent user base', 'Continued development activity', 'Emerging ecosystem'] },
      t2: { level: t2Score >= 70 ? 'High' : t2Score >= 40 ? 'Medium' : 'Low', score: Math.round(t2Score), factors: [hasStrongDecentralization ? 'Achieved meaningful decentralization' : 'Limited decentralization progress', 'Established utility and use cases', hasStrongDecentralization ? 'Community-driven governance' : 'Team still influential', 'Market maturity'] },
    };
  }

  function generateOverallSummary(level: string, data: FormData): string {
    const tokenName = data.tokenName || 'this token';
    if (level === 'High') return `Based on the information provided, ${tokenName} presents HIGH securities risk under U.S. federal law. Multiple indicators suggest this token would likely be classified as a security under the Howey test. Before proceeding, consider significant structural changes, consult with securities counsel, or explore registration/exemption options.`;
    if (level === 'Medium') return `${tokenName} presents MODERATE securities risk. While not all Howey prongs are clearly satisfied, several risk factors are present. Implementing the recommended mitigations and consulting with securities counsel can help reduce the regulatory risk profile.`;
    return `${tokenName} shows LOWER securities risk based on the current structure. The utility-focused characteristics help distinguish it from traditional securities. However, crypto securities analysis is highly fact-specific. Continue monitoring regulatory developments and maintain documentation of utility characteristics.`;
  }

  function collectRedFlags(data: FormData, howey: HoweyAnalysis): string[] {
    const flags: string[] = [];
    if (howey.prongs.investmentOfMoney.score >= 70) flags.push('Strong investment of money indicators');
    if (howey.prongs.expectationOfProfits.score >= 70) flags.push('Prominent profit expectation messaging');
    if (howey.prongs.effortsOfOthers.score >= 70) flags.push('High reliance on core team efforts');
    if (howey.prongs.commonEnterprise.score >= 70) flags.push('Clear common enterprise structure');
    if (data.whitepaperLanguage.includes('priceTargets')) flags.push('Price targets in whitepaper/documentation');
    if (data.whitepaperLanguage.includes('returnProjections')) flags.push('Return/yield projections published');
    if (data.prelaunchMarketing.includes('investmentReturns')) flags.push('Investment return marketing');
    if (data.publicStatements.includes('priceDiscussion')) flags.push('Team discusses token price appreciation');
    if (data.fundingMechanisms.includes('ico')) flags.push('ICO funding structure');
    if (data.dividendFeatures.includes('revenueShare')) flags.push('Revenue sharing mechanism');
    if (data.governanceStructure.includes('centralized')) flags.push('Centralized governance structure');
    return flags.slice(0, 7);
  }

  function collectMitigators(data: FormData): string[] {
    const mitigators: string[] = [];
    if (data.tokenFunctionality.includes('immediateUse')) mitigators.push('Immediate token utility at launch');
    if (data.tokenFunctionality.includes('consumptionRequired')) mitigators.push('Token consumed in use');
    if (data.tokenFunctionality.includes('accessRequired')) mitigators.push('Required for platform access');
    if (data.governanceStructure.includes('daoGovernance')) mitigators.push('DAO governance structure');
    if (data.governanceStructure.includes('tokenVoting')) mitigators.push('Token holder voting rights');
    if (data.decentralizationFeatures.length >= 3) mitigators.push('Multiple decentralization features');
    if (data.communityContributions.includes('openSource')) mitigators.push('Open source development');
    if (data.fundingMechanisms.includes('airdrop')) mitigators.push('Airdrop distribution');
    if (data.whitepaperLanguage.includes('utilityFocus')) mitigators.push('Utility-focused documentation');
    if (data.riskDisclosures.length >= 2) mitigators.push('Comprehensive risk disclosures');
    return mitigators.slice(0, 7);
  }

  function generateMitigations(data: FormData, analysis: Analysis): Mitigation[] {
    const mitigations: Mitigation[] = [];
    if (analysis.howeyAnalysis.prongs.expectationOfProfits.score >= 60) {
      mitigations.push({ priority: 'Critical', category: 'Marketing & Communications', title: 'Remove Price Appreciation Language', description: 'Eliminate all references to token price appreciation, investment returns, ROI, or profit potential from marketing materials, website, social media, and team communications.', implementation: '1. Audit all marketing materials, website copy, social media posts, and Discord/Telegram messages. 2. Remove or revise any content discussing price, returns, or investment value. 3. Train team members on compliant messaging. 4. Focus all communications on utility, functionality, and use cases.' });
    }
    if (data.whitepaperLanguage.includes('priceTargets') || data.whitepaperLanguage.includes('returnProjections')) {
      mitigations.push({ priority: 'Critical', category: 'Documentation', title: 'Revise Whitepaper & Technical Documents', description: 'Remove price targets, return projections, and investment-focused language from whitepaper and all technical documentation.', implementation: '1. Engage legal counsel to review all documentation. 2. Remove specific price predictions or return estimates. 3. Focus on technical specifications, utility descriptions, and ecosystem functionality. 4. Add prominent disclaimers about speculative nature and risks.' });
    }
    if (analysis.howeyAnalysis.prongs.effortsOfOthers.score >= 60) {
      mitigations.push({ priority: 'High', category: 'Governance & Decentralization', title: 'Implement Decentralized Governance', description: 'Establish DAO structure with meaningful token holder voting rights to reduce reliance on core team and distribute decision-making.', implementation: '1. Deploy governance smart contracts (e.g., Governor, Timelock). 2. Establish clear proposal and voting mechanisms. 3. Transfer key protocol decisions to community governance. 4. Create contributor incentive programs. 5. Document governance procedures and participation rights.' });
    }
    if (analysis.howeyAnalysis.prongs.investmentOfMoney.score >= 60) {
      mitigations.push({ priority: 'High', category: 'Token Distribution', title: 'Restructure Distribution Model', description: 'Modify token distribution to emphasize utility and reduce investment characteristics.', implementation: '1. Consider airdrops or rewards-based distribution over direct sales. 2. Require platform engagement for token acquisition. 3. Implement usage-based token earning mechanisms. 4. If sales necessary, limit to accredited investors under exemptions. 5. Ensure token has functional utility at time of distribution.' });
    }
    if (data.tokenFunctionality.includes('futureUtility')) {
      mitigations.push({ priority: 'High', category: 'Product Development', title: 'Establish Utility Before Distribution', description: 'Ensure functional network/platform utility exists before broad token distribution to reduce Howey risk.', implementation: '1. Complete core platform development before token launch. 2. Enable real utility use cases from day one. 3. Document existing functionality thoroughly. 4. Build user base around utility, not speculation. 5. Consider delayed token launch until network is functional.' });
    }
    if (data.decentralizationFeatures.length < 3) {
      mitigations.push({ priority: 'Medium', category: 'Technical Architecture', title: 'Enhance Network Decentralization', description: 'Implement additional decentralization features to reduce reliance on any single party.', implementation: '1. Deploy distributed node infrastructure. 2. Enable permissionless participation. 3. Open-source core protocol code. 4. Encourage third-party development. 5. Distribute key management across multiple parties.' });
    }
    if (data.communityContributions.length < 2) {
      mitigations.push({ priority: 'Medium', category: 'Ecosystem Development', title: 'Foster Community Development', description: 'Build active community contributor base to demonstrate decentralized efforts.', implementation: '1. Launch ecosystem grants program. 2. Create bounty system for contributions. 3. Encourage third-party application development. 4. Host hackathons and developer events. 5. Document community contributions publicly.' });
    }
    if (data.riskDisclosures.length < 3) {
      mitigations.push({ priority: 'Medium', category: 'Legal & Compliance', title: 'Implement Comprehensive Risk Disclosures', description: 'Add clear risk disclosures to all materials to demonstrate good faith and inform potential token holders.', implementation: '1. Add "not an investment" disclaimers to website and materials. 2. Disclose risk of total loss. 3. Include regulatory uncertainty warnings. 4. State no guarantee of future value. 5. Recommend consultation with financial/legal advisors.' });
    }
    mitigations.push({ priority: analysis.overallRisk.level === 'High' ? 'Critical' : 'Medium', category: 'Legal & Compliance', title: 'Engage Specialized Securities Counsel', description: 'Consult with attorneys specializing in crypto securities law for jurisdiction-specific advice and ongoing compliance guidance.', implementation: '1. Identify counsel with crypto securities experience (e.g., Rains LLP). 2. Conduct comprehensive legal review before launch. 3. Obtain written legal opinion if possible. 4. Establish ongoing compliance monitoring. 5. Review all public communications with counsel.' });
    return mitigations;
  }

  // --------------------------------------------------------------------------
  // Render Helpers
  // --------------------------------------------------------------------------

  const CheckboxGroup = ({ field, options }: { field: keyof FormData; options: { id: string; label: string; description?: string }[] }) => (
    <div className="space-y-2">
      {options.map(option => (
        <label key={option.id} className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${(formData[field] as string[]).includes(option.id) ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
          <input type="checkbox" checked={(formData[field] as string[]).includes(option.id)} onChange={() => toggleArrayItem(field, option.id)} className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5" />
          <div className="ml-3">
            <span className="text-gray-900 font-medium">{option.label}</span>
            {option.description && <p className="text-gray-500 text-sm mt-0.5">{option.description}</p>}
          </div>
        </label>
      ))}
    </div>
  );

  // --------------------------------------------------------------------------
  // Step Renderers
  // --------------------------------------------------------------------------

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Project Information</h2>
        <p className="text-gray-600">Tell us about your project and entity structure.</p>
      </div>
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Project Name *</label>
          <input type="text" value={formData.projectName} onChange={(e) => updateFormData('projectName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors" placeholder="Enter your project name" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Entity Type</label>
          <select value={formData.entityType} onChange={(e) => updateFormData('entityType', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
            <option value="">Select entity type</option>
            <option value="corporation">Corporation (C-Corp, S-Corp)</option>
            <option value="llc">Limited Liability Company (LLC)</option>
            <option value="foundation">Foundation (Cayman, Swiss, etc.)</option>
            <option value="dao">Decentralized Autonomous Organization (DAO)</option>
            <option value="offshore">Offshore Entity</option>
            <option value="none">No Formal Entity Yet</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Jurisdiction</label>
          <select value={formData.primaryJurisdiction} onChange={(e) => updateFormData('primaryJurisdiction', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
            <option value="">Select jurisdiction</option>
            <option value="us">United States</option>
            <option value="eu">European Union</option>
            <option value="uk">United Kingdom</option>
            <option value="singapore">Singapore</option>
            <option value="switzerland">Switzerland</option>
            <option value="cayman">Cayman Islands</option>
            <option value="bvi">British Virgin Islands</option>
            <option value="other">Other</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">This analysis focuses on U.S. federal securities law (Howey test). Results may vary by jurisdiction.</p>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Token Details</h2>
        <p className="text-gray-600">Basic information about your token.</p>
      </div>
      <div className="space-y-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Token Name</label>
            <input type="text" value={formData.tokenName} onChange={(e) => updateFormData('tokenName', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., MyToken" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Token Symbol</label>
            <input type="text" value={formData.tokenSymbol} onChange={(e) => updateFormData('tokenSymbol', e.target.value.toUpperCase())} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" placeholder="e.g., MTK" maxLength={10} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Token Classification (Self-Described)</label>
          <select value={formData.tokenClassification} onChange={(e) => updateFormData('tokenClassification', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500">
            <option value="">Select classification</option>
            <option value="utility">Utility Token</option>
            <option value="governance">Governance Token</option>
            <option value="payment">Payment Token / Currency</option>
            <option value="security">Security Token (Intentional)</option>
            <option value="nft">NFT / Collectible</option>
            <option value="hybrid">Hybrid / Multi-Function</option>
          </select>
          <p className="text-sm text-gray-500 mt-2">Note: Self-classification does not determine legal status. Function and circumstances control.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Purpose (select all that apply)</label>
          <CheckboxGroup field="primaryPurpose" options={[
            { id: 'networkAccess', label: 'Network/Platform Access', description: 'Token required to use platform features' },
            { id: 'governance', label: 'Governance/Voting Rights', description: 'Token grants voting power over protocol decisions' },
            { id: 'payment', label: 'Payment/Medium of Exchange', description: 'Used as currency within ecosystem' },
            { id: 'staking', label: 'Staking/Validation', description: 'Used to secure network or earn rewards' },
            { id: 'fundraising', label: 'Fundraising/Capital Formation', description: 'Primary purpose is raising capital' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Investment of Money</h2>
        <p className="text-gray-600">Howey Prong 1: How are tokens distributed and acquired?</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">What this prong examines:</p>
            <p>Whether purchasers give up something of value (money, crypto, other assets) with an expectation of receiving something in return.</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Funding/Distribution Mechanisms (select all that apply)</label>
          <CheckboxGroup field="fundingMechanisms" options={[
            { id: 'publicSale', label: 'Public Token Sale', description: 'Direct sale to general public' },
            { id: 'presale', label: 'Private/Presale Round', description: 'Sale to select investors before public' },
            { id: 'ico', label: 'ICO/IEO/IDO', description: 'Initial coin/exchange/DEX offering' },
            { id: 'saft', label: 'SAFT Agreement', description: 'Simple Agreement for Future Tokens' },
            { id: 'vcFunding', label: 'VC/Institutional Funding', description: 'Venture capital or institutional investment' },
            { id: 'airdrop', label: 'Airdrop (Free Distribution)', description: 'Free distribution to wallet addresses' },
            { id: 'mining', label: 'Mining/Staking Rewards', description: 'Earned through network participation' },
            { id: 'servicePayment', label: 'Payment for Services', description: 'Compensation for work performed' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Pre-launch Marketing Themes (select all that apply)</label>
          <CheckboxGroup field="prelaunchMarketing" options={[
            { id: 'priceAppreciation', label: 'Price Appreciation Potential', description: 'Marketing emphasizes potential price increase' },
            { id: 'investmentReturns', label: 'Investment Returns/ROI', description: 'Discusses expected returns on investment' },
            { id: 'earlyAdopterAdvantage', label: 'Early Adopter Advantage', description: 'Emphasizes benefits of buying early' },
            { id: 'utility', label: 'Token Utility/Functionality', description: 'Focuses on what token does/enables' },
            { id: 'community', label: 'Community Building', description: 'Emphasizes community participation' },
            { id: 'technology', label: 'Technology/Innovation', description: 'Focuses on technical capabilities' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Common Enterprise</h2>
        <p className="text-gray-600">Howey Prong 2: How are token holder fortunes linked?</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">What this prong examines:</p>
            <p>Whether investors&apos; fortunes are tied together (horizontal commonality) or to the promoter&apos;s efforts (vertical commonality).</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Pooling Arrangements (select all that apply)</label>
          <CheckboxGroup field="poolingArrangements" options={[
            { id: 'treasuryPooling', label: 'Treasury/Fund Pooling', description: 'Funds pooled in common treasury' },
            { id: 'sharedRevenue', label: 'Shared Revenue Distribution', description: 'Revenue shared among token holders' },
            { id: 'commonPromoter', label: 'Common Promoter/Team', description: 'Same team promotes to all investors' },
            { id: 'sharedPlatform', label: 'Shared Platform Infrastructure', description: 'All users share common platform' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Value/Revenue Reliance (select all that apply)</label>
          <CheckboxGroup field="revenueReliance" options={[
            { id: 'centralEntity', label: 'Central Entity Revenue', description: 'Value depends on company performance' },
            { id: 'teamDevelopment', label: 'Team Development Efforts', description: 'Success depends on team building product' },
            { id: 'protocolFees', label: 'Protocol Fees', description: 'Value from protocol-level fees' },
            { id: 'networkActivity', label: 'Decentralized Network Activity', description: 'Value from independent user activity' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Expectation of Profits</h2>
        <p className="text-gray-600">Howey Prong 3: Are profits expected from holding the token?</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">What this prong examines:</p>
            <p>Whether purchasers expect to profit from price appreciation or distributions, rather than from using the token for its intended utility.</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Whitepaper/Documentation Language (select all that apply)</label>
          <CheckboxGroup field="whitepaperLanguage" options={[
            { id: 'priceTargets', label: 'Price Targets/Projections', description: 'Specific price predictions or targets' },
            { id: 'returnProjections', label: 'Return/Yield Projections', description: 'Expected ROI or yield percentages' },
            { id: 'appreciationPotential', label: 'Appreciation Potential', description: 'Discussion of value increase potential' },
            { id: 'utilityFocus', label: 'Utility-Focused Description', description: 'Emphasizes token functionality' },
            { id: 'technicalSpecs', label: 'Technical Specifications', description: 'Focus on technical capabilities' },
            { id: 'riskDisclosures', label: 'Risk Disclosures', description: 'Clear disclosure of risks' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Dividend/Reward Features (select all that apply)</label>
          <CheckboxGroup field="dividendFeatures" options={[
            { id: 'revenueShare', label: 'Revenue Sharing', description: 'Token holders receive share of revenue' },
            { id: 'staking', label: 'Staking Rewards', description: 'Rewards for staking tokens' },
            { id: 'buyback', label: 'Token Buyback Program', description: 'Company buys back tokens' },
            { id: 'burn', label: 'Token Burning', description: 'Deflationary burn mechanism' },
            { id: 'none', label: 'No Dividend Features', description: 'Token has no passive income features' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Efforts of Others</h2>
        <p className="text-gray-600">Howey Prong 4: Does value depend primarily on a core team?</p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">What this prong examines:</p>
            <p>Whether the success of the investment depends on the managerial or entrepreneurial efforts of a promoter or third party, rather than the token holder&apos;s own efforts.</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Core Team Dependency (select all that apply)</label>
          <CheckboxGroup field="coreTeamDependency" options={[
            { id: 'essentialDevelopment', label: 'Essential for Development', description: 'Team is essential for building the product' },
            { id: 'ongoingManagement', label: 'Ongoing Management Required', description: 'Continuous team management needed' },
            { id: 'marketMaking', label: 'Market Making Activities', description: 'Team involved in liquidity/trading' },
            { id: 'marketing', label: 'Marketing/Promotion', description: 'Team drives marketing efforts' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Decentralization Features (select all that apply)</label>
          <CheckboxGroup field="decentralizationFeatures" options={[
            { id: 'distributedNodes', label: 'Distributed Node Network', description: 'Network run by independent node operators' },
            { id: 'openProtocol', label: 'Open Protocol', description: 'Protocol is open and forkable' },
            { id: 'permissionless', label: 'Permissionless Access', description: 'Anyone can participate without approval' },
            { id: 'multipleContributors', label: 'Multiple Independent Contributors', description: 'Many independent developers contribute' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Governance Structure (select all that apply)</label>
          <CheckboxGroup field="governanceStructure" options={[
            { id: 'daoGovernance', label: 'DAO Governance', description: 'Decentralized autonomous organization' },
            { id: 'tokenVoting', label: 'Token Holder Voting', description: 'Token holders vote on decisions' },
            { id: 'multisig', label: 'Multisig Controls', description: 'Multiple signatures required for changes' },
            { id: 'centralized', label: 'Centralized Decision Making', description: 'Core team makes key decisions' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Token Utility</h2>
        <p className="text-gray-600">What functional utility does the token provide?</p>
      </div>
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div className="text-sm text-green-800">
            <p className="font-semibold mb-1">Why utility matters:</p>
            <p>Genuine, immediate utility can help distinguish a token from a security. The more the token functions as a product rather than an investment, the stronger the non-security argument.</p>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Token Functionality (select all that apply)</label>
          <CheckboxGroup field="tokenFunctionality" options={[
            { id: 'immediateUse', label: 'Immediate Utility at Launch', description: 'Token has real use from day one' },
            { id: 'consumptionRequired', label: 'Consumed in Use (Burns/Fees)', description: 'Token is spent when used' },
            { id: 'accessRequired', label: 'Required for Platform Access', description: 'Must hold token to use platform' },
            { id: 'votingPower', label: 'Voting/Governance Power', description: 'Token grants voting rights' },
            { id: 'futureUtility', label: 'Future Utility (Not Yet Live)', description: 'Utility planned but not available' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Community Contributions (select all that apply)</label>
          <CheckboxGroup field="communityContributions" options={[
            { id: 'openSource', label: 'Open Source Development', description: 'Code is open source' },
            { id: 'communityDev', label: 'Community Developers', description: 'Independent developers contribute' },
            { id: 'ecosystemGrants', label: 'Ecosystem Grants', description: 'Grants fund third-party development' },
            { id: 'userContent', label: 'User-Generated Content', description: 'Users create value on platform' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Marketing & Distribution</h2>
        <p className="text-gray-600">How is the token marketed and distributed?</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Public Statements by Team (select all that apply)</label>
          <CheckboxGroup field="publicStatements" options={[
            { id: 'priceDiscussion', label: 'Price/Value Discussion', description: 'Team discusses token price' },
            { id: 'utilityFocus', label: 'Utility/Use Case Focus', description: 'Communications focus on utility' },
            { id: 'roadmapUpdates', label: 'Roadmap/Development Updates', description: 'Regular development updates' },
            { id: 'partnershipAnnouncements', label: 'Partnership Announcements', description: 'Business partnership news' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Secondary Market (select all that apply)</label>
          <CheckboxGroup field="secondaryMarket" options={[
            { id: 'exchanges', label: 'Centralized Exchange Listings', description: 'Listed on CEXs like Coinbase, Binance' },
            { id: 'dex', label: 'DEX Liquidity', description: 'Tradeable on decentralized exchanges' },
            { id: 'noSecondary', label: 'No Secondary Market Plans', description: 'Not planning exchange listings' },
            { id: 'restrictedTrading', label: 'Restricted Trading', description: 'Trading limitations in place' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Lockup/Vesting (select all that apply)</label>
          <CheckboxGroup field="lockupPeriods" options={[
            { id: 'teamLockup', label: 'Team Token Lockup', description: 'Team tokens are locked' },
            { id: 'investorVesting', label: 'Investor Vesting Schedule', description: 'Investor tokens vest over time' },
            { id: 'noLockup', label: 'No Lockup Requirements', description: 'Tokens freely transferable' },
          ]} />
        </div>
      </div>
    </div>
  );

  const renderStep9 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Additional Factors</h2>
        <p className="text-gray-600">Final considerations that may affect the analysis.</p>
      </div>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">Risk Disclosures (select all that apply)</label>
          <CheckboxGroup field="riskDisclosures" options={[
            { id: 'notInvestment', label: '"Not an Investment" Disclaimer', description: 'Explicit statement token is not investment' },
            { id: 'lossRisk', label: 'Risk of Loss Disclosure', description: 'Warning that value may go to zero' },
            { id: 'regulatoryRisk', label: 'Regulatory Risk Warning', description: 'Disclosure of regulatory uncertainty' },
            { id: 'noGuarantees', label: 'No Value Guarantees', description: 'No promises about future value' },
          ]} />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Notes</label>
          <textarea value={formData.additionalNotes} onChange={(e) => updateFormData('additionalNotes', e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500" rows={4} placeholder="Any additional context about your token structure, unique characteristics, or specific concerns..." />
        </div>
      </div>
      <div className="mt-8 p-5 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p className="text-cyan-900 font-semibold">Ready to Analyze</p>
            <p className="text-cyan-700 text-sm mt-1">Click &quot;Run Analysis&quot; to generate your comprehensive securities risk assessment with Howey test analysis, timeline projections, and actionable mitigation recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (isAnalyzing) {
      return (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-full mb-8">
            <svg className="w-10 h-10 text-cyan-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mb-3">Analyzing Your Token</h3>
          <p className="text-gray-600 max-w-md mx-auto">Running Howey test analysis, evaluating risk factors, and generating personalized mitigation recommendations...</p>
        </div>
      );
    }
    if (!analysis) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-600">No analysis available. Please complete the questionnaire first.</p>
          <button onClick={() => setCurrentStep(1)} className="mt-6 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors">Start Over</button>
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <div className={`p-8 rounded-2xl border-2 ${analysis.overallRisk.level === 'High' ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-300' : analysis.overallRisk.level === 'Medium' ? 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-300' : 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Overall Securities Risk Assessment</h2>
              <p className="text-gray-600 mt-1">{formData.tokenName || 'Your Token'} ({formData.tokenSymbol || 'TOKEN'})</p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold text-xl ${analysis.overallRisk.level === 'High' ? 'bg-red-200 text-red-900' : analysis.overallRisk.level === 'Medium' ? 'bg-amber-200 text-amber-900' : 'bg-green-200 text-green-900'}`}>
              {analysis.overallRisk.level} Risk
              <span className="ml-2 text-lg font-semibold opacity-75">({analysis.overallRisk.score}/100)</span>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{analysis.overallRisk.summary}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-navy-900 mb-6">Howey Test Analysis</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {Object.entries(analysis.howeyAnalysis.prongs).map(([key, prong]) => (
              <div key={key} className={`p-5 rounded-xl border-2 ${prong.status === 'Likely Met' ? 'bg-red-50 border-red-200' : prong.status === 'Possibly Met' ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-bold text-navy-900">
                    {key === 'investmentOfMoney' && 'Investment of Money'}
                    {key === 'commonEnterprise' && 'Common Enterprise'}
                    {key === 'expectationOfProfits' && 'Expectation of Profits'}
                    {key === 'effortsOfOthers' && 'Efforts of Others'}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${prong.status === 'Likely Met' ? 'bg-red-200 text-red-800' : prong.status === 'Possibly Met' ? 'bg-amber-200 text-amber-800' : 'bg-green-200 text-green-800'}`}>{prong.status}</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Risk Score</span>
                    <span className="font-semibold">{prong.score}/100</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full transition-all ${prong.score >= 70 ? 'bg-red-500' : prong.score >= 40 ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${prong.score}%` }} />
                  </div>
                </div>
                {prong.factors.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-red-700 mb-1">Risk Factors:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {prong.factors.slice(0, 2).map((f, i) => (<li key={i} className="flex items-start gap-1"><span className="text-red-400 mt-0.5">•</span>{f}</li>))}
                    </ul>
                  </div>
                )}
                {prong.mitigatingFactors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-semibold text-green-700 mb-1">Mitigating Factors:</p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {prong.mitigatingFactors.slice(0, 2).map((f, i) => (<li key={i} className="flex items-start gap-1"><span className="text-green-400 mt-0.5">•</span>{f}</li>))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-700 text-sm leading-relaxed">{analysis.howeyAnalysis.overallConclusion}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-navy-900 mb-2">Timeline Risk Assessment</h3>
          <p className="text-gray-600 text-sm mb-6">How risk may evolve over the token&apos;s lifecycle</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { key: 't0', label: 'T0: Launch', sublabel: 'Pre-launch to early days', data: analysis.timelineRisk.t0 },
              { key: 't1', label: 'T1: Growth', sublabel: '6-18 months post-launch', data: analysis.timelineRisk.t1 },
              { key: 't2', label: 'T2: Maturity', sublabel: '18+ months post-launch', data: analysis.timelineRisk.t2 },
            ].map(({ key, label, sublabel, data }) => (
              <div key={key} className={`p-5 rounded-xl text-center ${data.level === 'High' ? 'bg-red-100' : data.level === 'Medium' ? 'bg-amber-100' : 'bg-green-100'}`}>
                <div className="text-sm font-semibold text-gray-700 mb-1">{label}</div>
                <div className="text-xs text-gray-500 mb-3">{sublabel}</div>
                <div className={`text-4xl font-bold mb-1 ${data.level === 'High' ? 'text-red-700' : data.level === 'Medium' ? 'text-amber-700' : 'text-green-700'}`}>{data.score}</div>
                <div className={`text-sm font-semibold ${data.level === 'High' ? 'text-red-600' : data.level === 'Medium' ? 'text-amber-600' : 'text-green-600'}`}>{data.level} Risk</div>
              </div>
            ))}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Key Risk Factors
            </h3>
            <ul className="space-y-2">
              {analysis.topRedFlags.length > 0 ? analysis.topRedFlags.map((flag, i) => (<li key={i} className="flex items-start gap-2 text-sm text-red-800"><span className="text-red-400 mt-1">•</span>{flag}</li>)) : (<li className="text-sm text-gray-600 italic">No major red flags identified</li>)}
            </ul>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Mitigating Factors
            </h3>
            <ul className="space-y-2">
              {analysis.topMitigators.length > 0 ? analysis.topMitigators.map((mit, i) => (<li key={i} className="flex items-start gap-2 text-sm text-green-800"><span className="text-green-400 mt-1">•</span>{mit}</li>)) : (<li className="text-sm text-gray-600 italic">Consider implementing mitigation strategies below</li>)}
            </ul>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-navy-900 mb-2">Recommended Mitigations</h3>
          <p className="text-gray-600 text-sm mb-6">Prioritized actions to reduce securities risk</p>
          <div className="space-y-4">
            {mitigations.map((mit, i) => (
              <div key={i} className={`p-5 rounded-xl border-l-4 ${mit.priority === 'Critical' ? 'bg-red-50 border-red-500' : mit.priority === 'High' ? 'bg-amber-50 border-amber-500' : 'bg-blue-50 border-blue-500'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${mit.priority === 'Critical' ? 'bg-red-200 text-red-800' : mit.priority === 'High' ? 'bg-amber-200 text-amber-800' : 'bg-blue-200 text-blue-800'}`}>{mit.priority}</span>
                  <span className="text-xs text-gray-500 font-medium">{mit.category}</span>
                </div>
                <h4 className="font-bold text-navy-900 mb-2">{mit.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{mit.description}</p>
                <details className="text-sm">
                  <summary className="cursor-pointer text-cyan-600 font-medium hover:text-cyan-700">View Implementation Steps</summary>
                  <p className="mt-2 text-gray-600 pl-4 border-l-2 border-gray-200">{mit.implementation}</p>
                </details>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Important Legal Disclaimer</h4>
              <div className="text-sm text-amber-800 space-y-2">
                <p><strong>This analysis is for informational purposes only and does not constitute legal advice.</strong></p>
                <p>Securities law analysis is highly fact-specific and depends on the totality of circumstances. This tool provides educational guidance based on public frameworks like the Howey test, but cannot replace consultation with qualified legal counsel.</p>
                <p>Before launching any token, you should consult with attorneys specializing in securities law and cryptocurrency regulation in all relevant jurisdictions. If you need counsel, consider consulting a qualified crypto securities law firm (e.g., Rains LLP).</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button onClick={startOver} className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Start New Analysis</button>
          <button onClick={() => window.print()} className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl">Export Report (PDF)</button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderStep7();
      case 8: return renderStep8();
      case 9: return renderStep9();
      case 10: return renderResults();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-6">
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse"></div>
              <span className="text-cyan-800 font-semibold text-xs uppercase tracking-wide">Token Securities Risk Analyzer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 leading-tight">Is Your Token a Security?</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">Analyze your crypto token against the Howey test and U.S. securities frameworks. Get actionable insights to reduce regulatory risk before launch.</p>
          </div>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}</span>
              <span className="text-sm font-bold text-cyan-600">{Math.round((currentStep / steps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${(currentStep / steps.length) * 100}%` }} />
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">{renderStepContent()}</div>
          {currentStep < 10 && (
            <div className="flex justify-between items-center">
              <button onClick={prevStep} disabled={currentStep === 1} className={`px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>← Previous</button>
              {currentStep === 9 ? (
                <button onClick={runAnalysis} className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">Run Analysis →</button>
              ) : (
                <button onClick={nextStep} className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors">Next →</button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
