'use client';

import { useCallback } from 'react';
import { createWizardContext } from '@/lib/hooks/createWizardContext';
import type {
  SafeType,
  SafeTerms,
  CompanyInfo,
  InvestorInfo,
  SideLetterSelections,
  SafeWizardState,
  GeneratedDocuments,
} from '@/lib/safe-types';

// =============================================================================
// DEFAULT STATE
// =============================================================================

const defaultState: SafeWizardState = {
  currentStep: 1,
  safeType: 'post-money-cap',
  safeTerms: {
    safeType: 'post-money-cap',
    purchaseDate: new Date().toISOString().split('T')[0],
  },
  companyInfo: {
    stateOfIncorporation: 'DE',
    state: '', // Initialize address state as empty to ensure validation works
  },
  investorInfo: {
    type: 'individual',
    isAccredited: true,
    state: '', // Initialize address state as empty to ensure validation works
  },
  sideLetters: {
    'pro-rata': { enabled: true, fields: { 'pro-rata-threshold': 100000 } },
    'info-rights': { enabled: true, fields: { 'info-rights-threshold': 250000, 'info-rights-frequency': 'quarterly' } },
    'mfn': { enabled: false, fields: {} },
    'board-observer': { enabled: false, fields: {} },
    'major-investor': { enabled: false, fields: { 'major-investor-threshold': 250000 } },
  },
};

// =============================================================================
// VALIDATION
// =============================================================================

function validateStep(state: SafeWizardState, step: number): string[] {
  const { safeType, safeTerms, companyInfo, investorInfo } = state;
  const errors: string[] = [];

  switch (step) {
    case 1:
      if (!safeType) errors.push('SAFE type is required');
      break;
    case 2: {
      if (!safeTerms.investmentAmount || safeTerms.investmentAmount <= 0) {
        errors.push('Investment amount is required');
      }
      if (safeType.includes('cap') && (!safeTerms.valuationCap || safeTerms.valuationCap <= 0)) {
        errors.push('Valuation cap is required');
      }
      if (safeType.includes('discount') && (!safeTerms.discountRate || safeTerms.discountRate <= 0)) {
        errors.push('Discount rate is required');
      }
      break;
    }
    case 3:
      if (!companyInfo.legalName) errors.push('Company legal name is required');
      if (!companyInfo.stateOfIncorporation) errors.push('State of incorporation is required');
      if (!companyInfo.address) errors.push('Company address is required');
      if (!companyInfo.city) errors.push('Company city is required');
      if (!companyInfo.state) errors.push('Company state is required');
      if (!companyInfo.zipCode) errors.push('Company zip code is required');
      if (!companyInfo.founderName) errors.push('Founder name is required');
      if (!companyInfo.founderTitle) errors.push('Founder title is required');
      if (!companyInfo.founderEmail) errors.push('Founder email is required');
      break;
    case 4:
      if (investorInfo.type === 'entity') {
        if (!investorInfo.entityName) errors.push('Entity name is required');
      } else {
        if (!investorInfo.legalName) errors.push('Investor name is required');
      }
      if (!investorInfo.address) errors.push('Investor address is required');
      if (!investorInfo.city) errors.push('Investor city is required');
      if (!investorInfo.state) errors.push('Investor state is required');
      if (!investorInfo.zipCode) errors.push('Investor zip code is required');
      if (!investorInfo.email) errors.push('Investor email is required');
      if (!investorInfo.isAccredited) errors.push('Accredited investor confirmation is required');
      break;
    // Steps 5-6 have no required fields
  }

  return errors;
}

// =============================================================================
// MIGRATION FUNCTION
// =============================================================================

function migrateState(parsed: unknown): SafeWizardState {
  const data = parsed as Partial<SafeWizardState>;
  return {
    ...defaultState,
    ...data,
    companyInfo: {
      ...defaultState.companyInfo,
      ...data.companyInfo,
      // Ensure state field exists (was missing in old versions)
      state: data.companyInfo?.state ?? '',
    },
    investorInfo: {
      ...defaultState.investorInfo,
      ...data.investorInfo,
      // Ensure state field exists (was missing in old versions)
      state: data.investorInfo?.state ?? '',
    },
  };
}

// =============================================================================
// CREATE CONTEXT WITH FACTORY
// =============================================================================

const {
  WizardProvider: BaseSafeWizardProvider,
  useWizard: useBaseSafeWizard,
} = createWizardContext<SafeWizardState>({
  storageKey: 'safe-generator-wizard-state',
  defaultState,
  validateStep,
  migrateState,
});

// =============================================================================
// EXTENDED HOOK WITH CONVENIENCE METHODS
// =============================================================================

/**
 * Extended wizard hook with typed update methods for each section.
 * Maintains backward compatibility with existing step components.
 */
export function useSafeWizard() {
  const wizard = useBaseSafeWizard();

  // Special setSafeType that clears related fields when switching types
  const setSafeType = useCallback((type: SafeType) => {
    wizard.setState((prev) => ({
      ...prev,
      safeType: type,
      safeTerms: {
        ...prev.safeTerms,
        safeType: type,
        // Clear cap/discount when switching SAFE types to avoid confusion
        valuationCap: type.includes('cap') ? prev.safeTerms.valuationCap : undefined,
        discountRate: type.includes('discount') ? prev.safeTerms.discountRate : undefined,
      },
    }));
  }, [wizard]);

  const updateSafeTerms = useCallback(
    (terms: Partial<SafeTerms>) => wizard.updateSection('safeTerms', terms),
    [wizard]
  );

  const updateCompanyInfo = useCallback(
    (info: Partial<CompanyInfo>) => wizard.updateSection('companyInfo', info),
    [wizard]
  );

  const updateInvestorInfo = useCallback(
    (info: Partial<InvestorInfo>) => wizard.updateSection('investorInfo', info),
    [wizard]
  );

  const updateSideLetters = useCallback((letters: SideLetterSelections) => {
    wizard.setState((prev) => ({
      ...prev,
      sideLetters: letters,
    }));
  }, [wizard]);

  const setGeneratedDocuments = useCallback((docs: GeneratedDocuments) => {
    wizard.setState((prev) => ({
      ...prev,
      generatedDocuments: docs,
    }));
  }, [wizard]);

  return {
    state: wizard.state,
    setCurrentStep: wizard.setCurrentStep,
    setSafeType,
    updateSafeTerms,
    updateCompanyInfo,
    updateInvestorInfo,
    updateSideLetters,
    setGeneratedDocuments,
    canProceed: wizard.canProceed,
    reset: wizard.reset,
  };
}

// =============================================================================
// EXPORTS
// =============================================================================

export { BaseSafeWizardProvider as SafeWizardProvider };
