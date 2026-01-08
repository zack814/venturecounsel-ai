'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  CompanyContext,
  RoleProfile,
  CandidateContext,
  TokenProgram,
  Constraints,
  Preferences,
  CompanyStage,
  GeoMarket,
  HeadcountRange,
  JobFamily,
  JobLevel,
  LocationType,
  CompetingOffersLevel,
  RiskTolerance,
  StartUrgency,
  PriorityLevel,
} from '@/lib/comp-schemas';

interface WizardState {
  currentStep: number;
  companyContext: Partial<CompanyContext>;
  roleProfile: Partial<RoleProfile>;
  candidateContext: Partial<CandidateContext>;
  tokenProgram: Partial<TokenProgram>;
  constraints: Partial<Constraints>;
  preferences: Partial<Preferences>;
}

interface WizardContextType {
  state: WizardState;
  setCurrentStep: (step: number) => void;
  updateCompanyContext: (data: Partial<CompanyContext>) => void;
  updateRoleProfile: (data: Partial<RoleProfile>) => void;
  updateCandidateContext: (data: Partial<CandidateContext>) => void;
  updateTokenProgram: (data: Partial<TokenProgram>) => void;
  updateConstraints: (data: Partial<Constraints>) => void;
  updatePreferences: (data: Partial<Preferences>) => void;
  canProceed: () => boolean;
  reset: () => void;
}

const defaultState: WizardState = {
  currentStep: 1,
  companyContext: {
    stage: 'seed' as CompanyStage,
    geoMarket: 'sv' as GeoMarket,
    headcountRange: '1-10' as HeadcountRange,
  },
  roleProfile: {
    jobFamily: 'engineering' as JobFamily,
    jobLevel: 'senior' as JobLevel,
    locationType: 'onsite' as LocationType,
    geo: 'sv' as GeoMarket,
    title: '',
    normalizedTitle: '',
  },
  candidateContext: {
    competingOffersLevel: 'none' as CompetingOffersLevel,
    riskTolerance: 'medium' as RiskTolerance,
    startUrgency: 'standard' as StartUrgency,
  },
  tokenProgram: {
    enabled: false,
  },
  constraints: {},
  preferences: {
    retentionPriority: 'normal' as PriorityLevel,
    cashPreservationPriority: 'normal' as PriorityLevel,
    dilutionControlPriority: 'normal' as PriorityLevel,
  },
};

const WizardContext = createContext<WizardContextType | undefined>(undefined);

const STORAGE_KEY = 'comp-optimizer-wizard-state';

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(defaultState);
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

  const updateCompanyContext = useCallback((data: Partial<CompanyContext>) => {
    setState((prev) => ({
      ...prev,
      companyContext: { ...prev.companyContext, ...data },
    }));
  }, []);

  const updateRoleProfile = useCallback((data: Partial<RoleProfile>) => {
    setState((prev) => ({
      ...prev,
      roleProfile: { ...prev.roleProfile, ...data },
    }));
  }, []);

  const updateCandidateContext = useCallback((data: Partial<CandidateContext>) => {
    setState((prev) => ({
      ...prev,
      candidateContext: { ...prev.candidateContext, ...data },
    }));
  }, []);

  const updateTokenProgram = useCallback((data: Partial<TokenProgram>) => {
    setState((prev) => ({
      ...prev,
      tokenProgram: { ...prev.tokenProgram, ...data },
    }));
  }, []);

  const updateConstraints = useCallback((data: Partial<Constraints>) => {
    setState((prev) => ({
      ...prev,
      constraints: { ...prev.constraints, ...data },
    }));
  }, []);

  const updatePreferences = useCallback((data: Partial<Preferences>) => {
    setState((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...data },
    }));
  }, []);

  const canProceed = useCallback(() => {
    const { currentStep, companyContext, roleProfile } = state;

    switch (currentStep) {
      case 1:
        return Boolean(
          companyContext.stage &&
          companyContext.geoMarket &&
          companyContext.headcountRange
        );
      case 2:
        return Boolean(
          roleProfile.jobFamily &&
          roleProfile.jobLevel &&
          roleProfile.title
        );
      case 3:
        return true; // All optional with defaults
      case 4:
        return true; // All optional
      case 5:
        return true; // All optional with defaults
      default:
        return true;
    }
  }, [state]);

  const reset = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <WizardContext.Provider
      value={{
        state,
        setCurrentStep,
        updateCompanyContext,
        updateRoleProfile,
        updateCandidateContext,
        updateTokenProgram,
        updateConstraints,
        updatePreferences,
        canProceed,
        reset,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}
