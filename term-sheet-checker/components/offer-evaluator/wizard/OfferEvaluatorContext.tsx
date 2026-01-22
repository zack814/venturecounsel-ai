'use client';

import { useCallback } from 'react';
import { createWizardContext } from '@/lib/hooks/createWizardContext';
import type {
  EmployeeBackground,
  CompanyDetails,
  CashOffer,
  EquityOffer,
  NegotiationContext,
  JobFamily,
  JobLevel,
  GeoMarket,
  CompanyStage,
  HeadcountRange,
  IndustrySector,
  EmploymentStatus,
  EmployeeRiskTolerance,
  FinancialSituation,
  EquityType,
  ExercisePeriod,
  AccelerationProvision,
  YesNoUnknown,
  CompetingOffers,
  ConfidenceLevel,
  NegotiationPriority,
} from '@/lib/offer-evaluator-schemas';

// =============================================================================
// STATE TYPE
// =============================================================================

export interface OfferEvaluatorState {
  currentStep: number;
  employeeBackground: Partial<EmployeeBackground>;
  companyDetails: Partial<CompanyDetails>;
  cashOffer: Partial<CashOffer>;
  equityOffer: Partial<EquityOffer>;
  negotiationContext: Partial<NegotiationContext>;
}

// =============================================================================
// DEFAULT STATE
// =============================================================================

const defaultState: OfferEvaluatorState = {
  currentStep: 1,
  employeeBackground: {
    jobFamily: 'engineering' as JobFamily,
    jobLevel: 'senior' as JobLevel,
    employmentStatus: 'employed' as EmploymentStatus,
    location: 'sv' as GeoMarket,
    riskTolerance: 'moderate' as EmployeeRiskTolerance,
    financialSituation: 'balanced' as FinancialSituation,
  },
  companyDetails: {
    stage: 'seed' as CompanyStage,
    industry: 'saas' as IndustrySector,
    location: 'sv' as GeoMarket,
    headcount: '11-25' as HeadcountRange,
    isPublic: false,
  },
  cashOffer: {},
  equityOffer: {
    equityType: 'iso' as EquityType,
    vestingTotalMonths: 48,
    vestingCliffMonths: 12,
    vestingFrequency: 'monthly',
    exercisePeriod: 'unknown' as ExercisePeriod,
    accelerationProvision: 'unknown' as AccelerationProvision,
    earlyExerciseAllowed: 'unknown' as YesNoUnknown,
    strikePriceConfidence: 'unknown' as ConfidenceLevel,
    totalSharesConfidence: 'unknown' as ConfidenceLevel,
    latestValuationConfidence: 'unknown' as ConfidenceLevel,
    latestRoundPriceConfidence: 'unknown' as ConfidenceLevel,
    repurchaseRight: 'unknown' as YesNoUnknown,
    rightOfFirstRefusal: 'unknown' as YesNoUnknown,
  },
  negotiationContext: {
    competingOffers: 'none' as CompetingOffers,
    excitementLevel: 4,
    priorities: ['equity', 'base-salary'] as NegotiationPriority[],
    isLevelNegotiable: false,
    isStartDateFlexible: true,
  },
};

// =============================================================================
// VALIDATION
// =============================================================================

function validateStep(state: OfferEvaluatorState, step: number): string[] {
  const { employeeBackground, companyDetails, cashOffer, equityOffer, negotiationContext } = state;
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!employeeBackground.jobFamily) errors.push('Job function is required');
      if (!employeeBackground.jobLevel) errors.push('Seniority level is required');
      if (!employeeBackground.employmentStatus) errors.push('Employment status is required');
      if (!employeeBackground.location) errors.push('Location is required');
      if (!employeeBackground.riskTolerance) errors.push('Risk tolerance is required');
      if (!employeeBackground.financialSituation) errors.push('Financial situation is required');
      break;
    case 2:
      if (!companyDetails.stage) errors.push('Company stage is required');
      if (!companyDetails.industry) errors.push('Industry is required');
      if (!companyDetails.location) errors.push('Company location is required');
      if (!companyDetails.headcount) errors.push('Headcount range is required');
      break;
    case 3:
      if (!cashOffer.baseSalary || cashOffer.baseSalary <= 0) {
        errors.push('Base salary is required');
      }
      break;
    case 4:
      if (!equityOffer.equityType) errors.push('Equity type is required');
      if (!equityOffer.shareCount && !equityOffer.percentOfCompany) {
        errors.push('Either share count or percentage of company is required');
      }
      break;
    case 5:
      if (!negotiationContext.competingOffers) errors.push('Competing offers status is required');
      if (!negotiationContext.excitementLevel) errors.push('Excitement level is required');
      if (!negotiationContext.priorities || negotiationContext.priorities.length === 0) {
        errors.push('At least one priority is required');
      }
      break;
    case 6:
      if (!cashOffer.baseSalary) errors.push('Base salary is missing');
      if (!equityOffer.shareCount && !equityOffer.percentOfCompany) {
        errors.push('Equity information is incomplete');
      }
      break;
  }

  return errors;
}

// =============================================================================
// CREATE CONTEXT WITH FACTORY
// =============================================================================

const SESSION_KEY = 'offer-evaluator-results-data';

const {
  WizardProvider: BaseOfferEvaluatorProvider,
  useWizard: useBaseOfferEvaluator,
  loadFromSession,
} = createWizardContext<OfferEvaluatorState>({
  storageKey: 'offer-evaluator-wizard-state',
  sessionKey: SESSION_KEY,
  defaultState,
  validateStep,
});

// =============================================================================
// EXTENDED HOOK WITH CONVENIENCE METHODS
// =============================================================================

/**
 * Extended wizard hook with typed update methods for each section.
 * Maintains backward compatibility with existing step components.
 */
export function useOfferEvaluator() {
  const wizard = useBaseOfferEvaluator();

  // Typed convenience methods for each section
  const updateEmployeeBackground = useCallback(
    (data: Partial<EmployeeBackground>) => wizard.updateSection('employeeBackground', data),
    [wizard]
  );

  const updateCompanyDetails = useCallback(
    (data: Partial<CompanyDetails>) => wizard.updateSection('companyDetails', data),
    [wizard]
  );

  const updateCashOffer = useCallback(
    (data: Partial<CashOffer>) => wizard.updateSection('cashOffer', data),
    [wizard]
  );

  const updateEquityOffer = useCallback(
    (data: Partial<EquityOffer>) => wizard.updateSection('equityOffer', data),
    [wizard]
  );

  const updateNegotiationContext = useCallback(
    (data: Partial<NegotiationContext>) => wizard.updateSection('negotiationContext', data),
    [wizard]
  );

  return {
    state: wizard.state,
    setCurrentStep: wizard.setCurrentStep,
    updateEmployeeBackground,
    updateCompanyDetails,
    updateCashOffer,
    updateEquityOffer,
    updateNegotiationContext,
    canProceed: wizard.canProceed,
    getStepValidationErrors: wizard.getValidationErrors,
    reset: wizard.reset,
    saveToSession: wizard.saveToSession,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { BaseOfferEvaluatorProvider as OfferEvaluatorProvider, loadFromSession };
