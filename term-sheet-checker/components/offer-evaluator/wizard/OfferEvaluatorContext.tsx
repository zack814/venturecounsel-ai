'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
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

interface OfferEvaluatorState {
  currentStep: number;
  employeeBackground: Partial<EmployeeBackground>;
  companyDetails: Partial<CompanyDetails>;
  cashOffer: Partial<CashOffer>;
  equityOffer: Partial<EquityOffer>;
  negotiationContext: Partial<NegotiationContext>;
}

interface OfferEvaluatorContextType {
  state: OfferEvaluatorState;
  setCurrentStep: (step: number) => void;
  updateEmployeeBackground: (data: Partial<EmployeeBackground>) => void;
  updateCompanyDetails: (data: Partial<CompanyDetails>) => void;
  updateCashOffer: (data: Partial<CashOffer>) => void;
  updateEquityOffer: (data: Partial<EquityOffer>) => void;
  updateNegotiationContext: (data: Partial<NegotiationContext>) => void;
  canProceed: () => boolean;
  getStepValidationErrors: () => string[];
  reset: () => void;
  saveToSession: () => void;
}

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

const OfferEvaluatorContext = createContext<OfferEvaluatorContextType | undefined>(undefined);

const STORAGE_KEY = 'offer-evaluator-wizard-state';
const SESSION_KEY = 'offer-evaluator-results-data';

export function OfferEvaluatorProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<OfferEvaluatorState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse saved wizard state:', e);
      }
    }
    setIsInitialized(true);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isInitialized]);

  const setCurrentStep = useCallback((step: number) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const updateEmployeeBackground = useCallback((data: Partial<EmployeeBackground>) => {
    setState((prev) => ({
      ...prev,
      employeeBackground: { ...prev.employeeBackground, ...data },
    }));
  }, []);

  const updateCompanyDetails = useCallback((data: Partial<CompanyDetails>) => {
    setState((prev) => ({
      ...prev,
      companyDetails: { ...prev.companyDetails, ...data },
    }));
  }, []);

  const updateCashOffer = useCallback((data: Partial<CashOffer>) => {
    setState((prev) => ({
      ...prev,
      cashOffer: { ...prev.cashOffer, ...data },
    }));
  }, []);

  const updateEquityOffer = useCallback((data: Partial<EquityOffer>) => {
    setState((prev) => ({
      ...prev,
      equityOffer: { ...prev.equityOffer, ...data },
    }));
  }, []);

  const updateNegotiationContext = useCallback((data: Partial<NegotiationContext>) => {
    setState((prev) => ({
      ...prev,
      negotiationContext: { ...prev.negotiationContext, ...data },
    }));
  }, []);

  const getStepValidationErrors = useCallback((): string[] => {
    const { currentStep, employeeBackground, companyDetails, cashOffer, equityOffer, negotiationContext } = state;
    const errors: string[] = [];

    switch (currentStep) {
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
        // Share count OR percent required (at least one way to quantify)
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
        // Review step - validate all previous steps
        // Just check the critical fields
        if (!cashOffer.baseSalary) errors.push('Base salary is missing');
        if (!equityOffer.shareCount && !equityOffer.percentOfCompany) {
          errors.push('Equity information is incomplete');
        }
        break;
    }

    return errors;
  }, [state]);

  const canProceed = useCallback(() => {
    return getStepValidationErrors().length === 0;
  }, [getStepValidationErrors]);

  const reset = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }, []);

  const saveToSession = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <OfferEvaluatorContext.Provider
      value={{
        state,
        setCurrentStep,
        updateEmployeeBackground,
        updateCompanyDetails,
        updateCashOffer,
        updateEquityOffer,
        updateNegotiationContext,
        canProceed,
        getStepValidationErrors,
        reset,
        saveToSession,
      }}
    >
      {children}
    </OfferEvaluatorContext.Provider>
  );
}

export function useOfferEvaluator() {
  const context = useContext(OfferEvaluatorContext);
  if (!context) {
    throw new Error('useOfferEvaluator must be used within a OfferEvaluatorProvider');
  }
  return context;
}

// Helper to load state from session storage (for results page)
export function loadFromSession(): OfferEvaluatorState | null {
  if (typeof window === 'undefined') return null;
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse session state:', e);
    }
  }
  return null;
}
