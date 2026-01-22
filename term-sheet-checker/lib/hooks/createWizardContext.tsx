'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Base state shape that all wizard states must include
 */
export interface BaseWizardState {
  currentStep: number;
}

/**
 * Configuration for creating a wizard context
 */
export interface WizardConfig<TState extends BaseWizardState> {
  /** Unique key for localStorage persistence */
  storageKey: string;
  /** Default state when wizard is first loaded */
  defaultState: TState;
  /** Optional session storage key for passing data to results page */
  sessionKey?: string;
  /** Step validation function - returns array of error messages */
  validateStep?: (state: TState, step: number) => string[];
  /** Optional migration function for old localStorage data */
  migrateState?: (parsed: unknown) => TState;
}

/**
 * Standard wizard context interface
 */
export interface WizardContextValue<TState extends BaseWizardState> {
  /** Current wizard state */
  state: TState;
  /** Whether state has been loaded from localStorage */
  isInitialized: boolean;
  /** Navigate to a specific step */
  setCurrentStep: (step: number) => void;
  /** Update a nested section of state */
  updateSection: <K extends keyof TState>(section: K, data: Partial<TState[K]>) => void;
  /** Replace entire state (use sparingly) */
  setState: React.Dispatch<React.SetStateAction<TState>>;
  /** Check if current step is valid and user can proceed */
  canProceed: () => boolean;
  /** Get validation errors for current step */
  getValidationErrors: () => string[];
  /** Reset wizard to default state */
  reset: () => void;
  /** Save state to session storage (for results page) */
  saveToSession: () => void;
}

// =============================================================================
// FACTORY
// =============================================================================

/**
 * Creates a wizard context with common functionality:
 * - localStorage persistence with SSR-safe hydration
 * - Step navigation and validation
 * - Section-based state updates
 * - Reset functionality
 * - Session storage for results pages
 *
 * @example
 * const {
 *   WizardProvider: MyWizardProvider,
 *   useWizard: useMyWizard,
 * } = createWizardContext({
 *   storageKey: 'my-wizard-state',
 *   defaultState: { currentStep: 1, section1: {}, section2: {} },
 *   validateStep: (state, step) => {
 *     if (step === 1 && !state.section1.requiredField) {
 *       return ['Required field is missing'];
 *     }
 *     return [];
 *   },
 * });
 */
export function createWizardContext<TState extends BaseWizardState>(
  config: WizardConfig<TState>
) {
  const { storageKey, defaultState, sessionKey, validateStep, migrateState } = config;

  // Create the context with undefined as initial value
  const WizardContext = createContext<WizardContextValue<TState> | undefined>(undefined);

  // Provider component
  function WizardProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<TState>(defaultState);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage on mount (client-side only)
    useEffect(() => {
      if (typeof window === 'undefined') return;

      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          // Apply migration if provided, otherwise use parsed directly
          const migrated = migrateState ? migrateState(parsed) : (parsed as TState);
          setState(migrated);
        } catch (e) {
          console.error(`Failed to parse saved wizard state (${storageKey}):`, e);
        }
      }
      setIsInitialized(true);
    }, []);

    // Save to localStorage on state change
    useEffect(() => {
      if (isInitialized && typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(state));
      }
    }, [state, isInitialized]);

    const setCurrentStep = useCallback((step: number) => {
      setState((prev) => ({ ...prev, currentStep: step }));
    }, []);

    const updateSection = useCallback(<K extends keyof TState>(
      section: K,
      data: Partial<TState[K]>
    ) => {
      setState((prev) => ({
        ...prev,
        [section]: { ...(prev[section] as object), ...data },
      }));
    }, []);

    const getValidationErrors = useCallback((): string[] => {
      if (!validateStep) return [];
      return validateStep(state, state.currentStep);
    }, [state]);

    const canProceed = useCallback(() => {
      return getValidationErrors().length === 0;
    }, [getValidationErrors]);

    const reset = useCallback(() => {
      setState(defaultState);
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
        if (sessionKey) {
          sessionStorage.removeItem(sessionKey);
        }
      }
    }, []);

    const saveToSession = useCallback(() => {
      if (typeof window !== 'undefined' && sessionKey) {
        sessionStorage.setItem(sessionKey, JSON.stringify(state));
      }
    }, [state]);

    const value: WizardContextValue<TState> = {
      state,
      isInitialized,
      setCurrentStep,
      updateSection,
      setState,
      canProceed,
      getValidationErrors,
      reset,
      saveToSession,
    };

    return (
      <WizardContext.Provider value={value}>
        {children}
      </WizardContext.Provider>
    );
  }

  // Hook to use the context
  function useWizard(): WizardContextValue<TState> {
    const context = useContext(WizardContext);
    if (!context) {
      throw new Error(`useWizard must be used within a WizardProvider (${storageKey})`);
    }
    return context;
  }

  // Helper to load state from session storage (for results pages)
  function loadFromSession(): TState | null {
    if (typeof window === 'undefined' || !sessionKey) return null;
    const saved = sessionStorage.getItem(sessionKey);
    if (saved) {
      try {
        return JSON.parse(saved) as TState;
      } catch (e) {
        console.error(`Failed to parse session state (${sessionKey}):`, e);
      }
    }
    return null;
  }

  return {
    WizardProvider,
    useWizard,
    loadFromSession,
    WizardContext, // Expose for advanced use cases
  };
}

// =============================================================================
// HELPER TYPES
// =============================================================================

/**
 * Extract the state type from a wizard context factory result
 */
export type WizardStateOf<T> = T extends {
  useWizard: () => WizardContextValue<infer S>;
} ? S : never;
