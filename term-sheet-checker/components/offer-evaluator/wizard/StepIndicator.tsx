'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  number: number;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepIndicator({ steps, currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => (
          <li
            key={step.number}
            className={cn(
              'relative',
              index !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''
            )}
          >
            <div className="flex items-center">
              <button
                onClick={() => onStepClick?.(step.number)}
                disabled={step.number > currentStep}
                className={cn(
                  'relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                  step.number < currentStep
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : step.number === currentStep
                    ? 'bg-navy-700 text-white'
                    : 'bg-slate-200 text-slate-500',
                  step.number <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed'
                )}
              >
                {step.number < currentStep ? (
                  <Check className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </button>
              <span
                className={cn(
                  'ml-3 text-sm font-medium hidden sm:block',
                  step.number <= currentStep ? 'text-slate-900' : 'text-slate-500'
                )}
              >
                {step.title}
              </span>
            </div>
            {index !== steps.length - 1 && (
              <div
                className={cn(
                  'absolute top-4 left-8 sm:left-28 w-full h-0.5 -translate-y-1/2',
                  step.number < currentStep ? 'bg-emerald-600' : 'bg-slate-200'
                )}
              />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
