'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type {
  SafeType,
  SafeTerms,
  CompanyInfo,
  InvestorInfo,
  SideLetterSelections,
  SafeWizardState,
  GeneratedDocuments,
} from '@/lib/safe-types';

interface SafeWizardContextType {
  state: SafeWizardState;
  setCurrentStep: (step: number) => void;
  setSafeType: (type: SafeType) => void;
  updateSafeTerms: (terms: Partial<SafeTerms>) => void;
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  updateInvestorInfo: (info: Partial<InvestorInfo>) => void;
  updateSideLetters: (letters: SideLetterSelections) => void;
  setGeneratedDocuments: (docs: GeneratedDocuments) => void;
  canProceed: () => boolean;
  reset: () => void;
}

const defaultState: SafeWizardState = {
  currentStep: 1,
  safeType: 'post-money-cap',
  safeTerms: {
    safeType: 'post-money-cap',
    purchaseDate: new Date().toISOString().split('T')[0],
  },
  companyInfo: {
    stateOfIncorporation: 'DE',
  },
  investorInfo: {
    type: 'individual',
    isAccredited: true,
  },
  sideLetters: {
    'pro-rata': { enabled: true, fields: { 'pro-rata-threshold': 100000 } },
    'info-rights': { enabled: true, fields: { 'info-rights-threshold': 250000, 'info-rights-frequency': 'quarterly' } },
    'mfn': { enabled: false, fields: {} },
    'board-observer': { enabled: false, fields: {} },
    'major-investor': { enabled: true, fields: { 'major-investor-threshold': 250000 } },
  },
};

const SafeWizardContext = createContext<SafeWizardContextType | undefined>(undefined);

const STORAGE_KEY = 'safe-generator-wizard-state';

export function SafeWizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SafeWizardState>(defaultState);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse saved SAFE wizard state:', e);
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

  const setSafeType = useCallback((type: SafeType) => {
    setState((prev) => ({
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
  }, []);

  const updateSafeTerms = useCallback((terms: Partial<SafeTerms>) => {
    setState((prev) => ({
      ...prev,
      safeTerms: { ...prev.safeTerms, ...terms },
    }));
  }, []);

  const updateCompanyInfo = useCallback((info: Partial<CompanyInfo>) => {
    setState((prev) => ({
      ...prev,
      companyInfo: { ...prev.companyInfo, ...info },
    }));
  }, []);

  const updateInvestorInfo = useCallback((info: Partial<InvestorInfo>) => {
    setState((prev) => ({
      ...prev,
      investorInfo: { ...prev.investorInfo, ...info },
    }));
  }, []);

  const updateSideLetters = useCallback((letters: SideLetterSelections) => {
    setState((prev) => ({
      ...prev,
      sideLetters: letters,
    }));
  }, []);

  const setGeneratedDocuments = useCallback((docs: GeneratedDocuments) => {
    setState((prev) => ({
      ...prev,
      generatedDocuments: docs,
    }));
  }, []);

  const canProceed = useCallback(() => {
    const { currentStep, safeType, safeTerms, companyInfo, investorInfo } = state;

    switch (currentStep) {
      case 1:
        // SAFE Type selection
        return Boolean(safeType);
      case 2:
        // Investment details - check if required fields are filled based on SAFE type
        const hasInvestmentAmount = Boolean(safeTerms.investmentAmount && safeTerms.investmentAmount > 0);

        if (safeType.includes('cap')) {
          return hasInvestmentAmount && Boolean(safeTerms.valuationCap && safeTerms.valuationCap > 0);
        }
        if (safeType.includes('discount')) {
          return hasInvestmentAmount && Boolean(safeTerms.discountRate && safeTerms.discountRate > 0);
        }
        // MFN just needs amount
        return hasInvestmentAmount;
      case 3:
        // Company info
        return Boolean(
          companyInfo.legalName &&
          companyInfo.stateOfIncorporation &&
          companyInfo.address &&
          companyInfo.city &&
          companyInfo.state &&
          companyInfo.zipCode &&
          companyInfo.founderName &&
          companyInfo.founderTitle &&
          companyInfo.founderEmail
        );
      case 4:
        // Investor info
        if (investorInfo.type === 'entity') {
          return Boolean(
            investorInfo.entityName &&
            investorInfo.address &&
            investorInfo.city &&
            investorInfo.state &&
            investorInfo.zipCode &&
            investorInfo.email &&
            investorInfo.isAccredited
          );
        }
        return Boolean(
          investorInfo.legalName &&
          investorInfo.address &&
          investorInfo.city &&
          investorInfo.state &&
          investorInfo.zipCode &&
          investorInfo.email &&
          investorInfo.isAccredited
        );
      case 5:
        // Side letters - always valid (selections are optional)
        return true;
      case 6:
        // Review - always valid
        return true;
      default:
        return true;
    }
  }, [state]);

  const reset = useCallback(() => {
    setState(defaultState);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <SafeWizardContext.Provider
      value={{
        state,
        setCurrentStep,
        setSafeType,
        updateSafeTerms,
        updateCompanyInfo,
        updateInvestorInfo,
        updateSideLetters,
        setGeneratedDocuments,
        canProceed,
        reset,
      }}
    >
      {children}
    </SafeWizardContext.Provider>
  );
}

export function useSafeWizard() {
  const context = useContext(SafeWizardContext);
  if (!context) {
    throw new Error('useSafeWizard must be used within a SafeWizardProvider');
  }
  return context;
}
