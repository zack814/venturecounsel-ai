'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSafeWizard, SafeWizardProvider } from './SafeWizardContext';
import { StepIndicator } from './StepIndicator';
import { Step1SafeType } from './steps/Step1SafeType';
import { Step2InvestmentDetails } from './steps/Step2InvestmentDetails';
import { Step3CompanyInfo } from './steps/Step3CompanyInfo';
import { Step4InvestorInfo } from './steps/Step4InvestorInfo';
import { Step5SideLetters } from './steps/Step5SideLetters';
import { Step6Review } from './steps/Step6Review';
import { Button } from '@/components/comp-optimizer/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/comp-optimizer/ui/Card';

const steps = [
  { number: 1, title: 'SAFE Type' },
  { number: 2, title: 'Terms' },
  { number: 3, title: 'Company' },
  { number: 4, title: 'Investor' },
  { number: 5, title: 'Side Letter' },
  { number: 6, title: 'Review' },
];

function WizardContent() {
  const router = useRouter();
  const { state, setCurrentStep, canProceed, reset } = useSafeWizard();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = async () => {
    if (state.currentStep === 6) {
      // Generate documents
      setIsGenerating(true);
      try {
        // Store state in sessionStorage for the results page
        sessionStorage.setItem('safe-generator-input', JSON.stringify(state));
        router.push('/safe-generator/results');
      } catch (error) {
        console.error('Error generating documents:', error);
        setIsGenerating(false);
      }
    } else {
      setCurrentStep(state.currentStep + 1);
    }
  };

  const handleBack = () => {
    if (state.currentStep > 1) {
      setCurrentStep(state.currentStep - 1);
    }
  };

  const handleStartOver = () => {
    if (confirm('Are you sure you want to start over? All entered information will be lost.')) {
      reset();
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1SafeType />;
      case 2:
        return <Step2InvestmentDetails />;
      case 3:
        return <Step3CompanyInfo />;
      case 4:
        return <Step4InvestorInfo />;
      case 5:
        return <Step5SideLetters />;
      case 6:
        return <Step6Review />;
      default:
        return <Step1SafeType />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <StepIndicator
          steps={steps}
          currentStep={state.currentStep}
          onStepClick={(step) => {
            if (step <= state.currentStep) {
              setCurrentStep(step);
            }
          }}
        />
      </div>

      {/* Main Card */}
      <Card>
        <CardContent className="pt-6">
          {renderStep()}
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={state.currentStep === 1}
            >
              Back
            </Button>
            {state.currentStep > 1 && (
              <button
                type="button"
                onClick={handleStartOver}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Start over
              </button>
            )}
          </div>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            isLoading={isGenerating}
            className="bg-amber-600 hover:bg-amber-700 focus:ring-amber-500"
          >
            {state.currentStep === 6 ? 'Generate Documents' : 'Continue'}
          </Button>
        </CardFooter>
      </Card>

      {/* Footer Note */}
      <div className="mt-6 text-center text-xs text-slate-500">
        <p>
          This tool generates SAFE documents based on Y Combinator templates.
          Not legal advice — consult an attorney before signing.
        </p>
      </div>
    </div>
  );
}

export function SafeWizard() {
  return (
    <SafeWizardProvider>
      <WizardContent />
    </SafeWizardProvider>
  );
}
