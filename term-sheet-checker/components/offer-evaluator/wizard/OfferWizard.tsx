'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOfferEvaluator, OfferEvaluatorProvider } from './OfferEvaluatorContext';
import { StepIndicator } from './StepIndicator';
import { Step1Background } from './steps/Step1Background';
import { Step2Company } from './steps/Step2Company';
import { Step3Cash } from './steps/Step3Cash';
import { Step4Equity } from './steps/Step4Equity';
import { Step5Negotiation } from './steps/Step5Negotiation';
import { Step6Review } from './steps/Step6Review';
import { Button } from '@/components/offer-evaluator/ui/Button';
import { Card, CardContent, CardFooter } from '@/components/offer-evaluator/ui/Card';
import { AlertCircle } from 'lucide-react';

const steps = [
  { number: 1, title: 'Background' },
  { number: 2, title: 'Company' },
  { number: 3, title: 'Cash' },
  { number: 4, title: 'Equity' },
  { number: 5, title: 'Negotiation' },
  { number: 6, title: 'Review' },
];

function WizardContent() {
  const router = useRouter();
  const { state, setCurrentStep, canProceed, getStepValidationErrors, saveToSession } = useOfferEvaluator();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const validationErrors = getStepValidationErrors();

  const handleNext = async () => {
    if (!canProceed()) {
      setShowErrors(true);
      return;
    }

    setShowErrors(false);

    if (state.currentStep === 6) {
      // Analyze offer
      setIsAnalyzing(true);
      try {
        saveToSession();
        router.push('/offer-evaluator/results');
      } catch (error) {
        console.error('Error saving state:', error);
        setIsAnalyzing(false);
      }
    } else {
      setCurrentStep(state.currentStep + 1);
    }
  };

  const handleBack = () => {
    setShowErrors(false);
    if (state.currentStep > 1) {
      setCurrentStep(state.currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 1:
        return <Step1Background />;
      case 2:
        return <Step2Company />;
      case 3:
        return <Step3Cash />;
      case 4:
        return <Step4Equity />;
      case 5:
        return <Step5Negotiation />;
      case 6:
        return <Step6Review />;
      default:
        return <Step1Background />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Offer Evaluator</h1>
          <p className="text-slate-600">
            Evaluate your startup offer against market benchmarks and get negotiation guidance.
          </p>
        </div>

        <div className="mb-8">
          <StepIndicator
            steps={steps}
            currentStep={state.currentStep}
            onStepClick={(step) => {
              if (step <= state.currentStep) {
                setShowErrors(false);
                setCurrentStep(step);
              }
            }}
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>

          {showErrors && validationErrors.length > 0 && (
            <div className="px-6 pb-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Please fix the following:</p>
                    <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                      {validationErrors.map((error, i) => (
                        <li key={i}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

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
              isLoading={isAnalyzing}
              variant={state.currentStep === 6 ? 'success' : 'primary'}
            >
              {state.currentStep === 6 ? 'Analyze My Offer' : 'Continue'}
            </Button>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-xs text-slate-500">
          <p>
            This tool provides general guidance for evaluating compensation offers.
            It does not constitute legal, tax, or financial advice.
          </p>
        </div>
      </div>
    </div>
  );
}

export function OfferWizard() {
  return (
    <OfferEvaluatorProvider>
      <WizardContent />
    </OfferEvaluatorProvider>
  );
}
