'use client';

import { useCallback } from 'react';
import { createWizardContext } from '@/lib/hooks/createWizardContext';
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

// =============================================================================
// STATE TYPE
// =============================================================================

export interface CompOptimizerWizardState {
  currentStep: number;
  companyContext: Partial<CompanyContext>;
  roleProfile: Partial<RoleProfile>;
  candidateContext: Partial<CandidateContext>;
  tokenProgram: Partial<TokenProgram>;
  constraints: Partial<Constraints>;
  preferences: Partial<Preferences>;
}

// =============================================================================
// DEFAULT STATE
// =============================================================================

const defaultState: CompOptimizerWizardState = {
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

// =============================================================================
// VALIDATION
// =============================================================================

function validateStep(state: CompOptimizerWizardState, step: number): string[] {
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!state.companyContext.stage) errors.push('Company stage is required');
      if (!state.companyContext.geoMarket) errors.push('Market location is required');
      if (!state.companyContext.headcountRange) errors.push('Headcount range is required');
      break;
    case 2:
      if (!state.roleProfile.jobFamily) errors.push('Job family is required');
      if (!state.roleProfile.jobLevel) errors.push('Job level is required');
      if (!state.roleProfile.title) errors.push('Job title is required');
      break;
    // Steps 3-6 have no required fields
  }

  return errors;
}

// =============================================================================
// CREATE CONTEXT WITH FACTORY
// =============================================================================

const {
  WizardProvider: BaseWizardProvider,
  useWizard: useBaseWizard,
} = createWizardContext<CompOptimizerWizardState>({
  storageKey: 'comp-optimizer-wizard-state',
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
export function useWizard() {
  const wizard = useBaseWizard();

  // Typed convenience methods for each section
  const updateCompanyContext = useCallback(
    (data: Partial<CompanyContext>) => wizard.updateSection('companyContext', data),
    [wizard]
  );

  const updateRoleProfile = useCallback(
    (data: Partial<RoleProfile>) => wizard.updateSection('roleProfile', data),
    [wizard]
  );

  const updateCandidateContext = useCallback(
    (data: Partial<CandidateContext>) => wizard.updateSection('candidateContext', data),
    [wizard]
  );

  const updateTokenProgram = useCallback(
    (data: Partial<TokenProgram>) => wizard.updateSection('tokenProgram', data),
    [wizard]
  );

  const updateConstraints = useCallback(
    (data: Partial<Constraints>) => wizard.updateSection('constraints', data),
    [wizard]
  );

  const updatePreferences = useCallback(
    (data: Partial<Preferences>) => wizard.updateSection('preferences', data),
    [wizard]
  );

  return {
    state: wizard.state,
    setCurrentStep: wizard.setCurrentStep,
    updateCompanyContext,
    updateRoleProfile,
    updateCandidateContext,
    updateTokenProgram,
    updateConstraints,
    updatePreferences,
    canProceed: wizard.canProceed,
    reset: wizard.reset,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { BaseWizardProvider as WizardProvider };
