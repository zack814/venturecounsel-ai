'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWizard, WizardProvider } from './WizardContext';
import { StepIndicator } from './StepIndicator';
import { Step1Company } from './steps/Step1Company';
import { Step2Role } from './steps/Step2Role';
import { Step3Candidate } from './steps/Step3Candidate';
import { Step4Constraints } from './steps/Step4Constraints';
import { Step5Preferences } from './steps/Step5Preferences';
import { Step6Generate } from './steps/Step6Generate';
import { Button } from '@/components/comp-optimizer/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/comp-optimizer/ui/Card';

const steps = [
  { number: 1, title: 'Company' },
  { number: 2, title: 'Role' },
  { number: 3, title: 'Candidate' },
  { number: 4, title: 'Constraints' },
  { number: 5, title: 'Preferences' },
  { number: 6, title: 'Generate' },
];

function WizardContent() {
  const router = useRouter();
  const { state, setCurrentStep, canProceed } = useWizard();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleNext = async () => {
    if (state.currentStep === 6) {
      // Generate packages
      setIsGenerating(true);
      try {
        // Store state in sessionStorage for the results page
        sessionStorage.setItem('comp-optimizer-input', JSON.stringify(state));
        router.push('/comp-optimizer/results');
      } catch (error) {
        console.error('Error generating packages:', error);
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

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1Company />;
      case 2:
        return <Step2Role />;
      case 3:
        return <Step3Candidate />;
      case 4:
        return <Step4Constraints />;
      case 5:
        return <Step5Preferences />;
      case 6:
        return <Step6Generate />;
      default:
        return <Step1Company />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Comp Mix Optimizer</h1>
          <p className="text-slate-600">
            Generate market-calibrated compensation packages for your next hire.
          </p>
        </div>

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

        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={state.currentStep === 1}
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              isLoading={isGenerating}
            >
              {state.currentStep === 6 ? 'Generate Packages' : 'Continue'}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            This tool provides general guidance for compensation structuring.
            It does not constitute legal, tax, or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}
