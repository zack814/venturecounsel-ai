'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

interface LoadingStateProps {
  message?: string;
  subMessage?: string;
}

export function LoadingState({ message = 'Loading...', subMessage }: LoadingStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center p-8 text-center"
      role="status"
      aria-live="polite"
    >
      <LoadingSpinner size="lg" className="text-teal-600 mb-4" />
      <p className="text-lg font-medium text-navy-900">{message}</p>
      {subMessage && (
        <p className="text-sm text-gray-500 mt-1">{subMessage}</p>
      )}
      <span className="sr-only">{message}</span>
    </div>
  );
}

interface AnalysisLoadingProps {
  stage?: 'uploading' | 'analyzing' | 'generating';
}

export function AnalysisLoading({ stage = 'analyzing' }: AnalysisLoadingProps) {
  const stages = {
    uploading: {
      message: 'Uploading document...',
      subMessage: 'Securely processing your file',
    },
    analyzing: {
      message: 'Analyzing your document...',
      subMessage: 'Our AI is reviewing the terms and comparing to market norms',
    },
    generating: {
      message: 'Generating report...',
      subMessage: 'Creating your personalized analysis',
    },
  };

  const { message, subMessage } = stages[stage];

  return (
    <div
      className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <LoadingSpinner size="lg" className="text-teal-600" />
      </div>
      <h3 className="text-xl font-semibold text-navy-900 mb-2">{message}</h3>
      <p className="text-gray-500">{subMessage}</p>
      <div className="mt-6 flex justify-center gap-1">
        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="sr-only">{message} {subMessage}</span>
    </div>
  );
}

export default LoadingSpinner;
