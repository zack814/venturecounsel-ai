'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

// =============================================================================
// FORM FIELD WRAPPER
// =============================================================================

interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  helpText?: string;
  hint?: string; // Alias for helpText
  error?: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * FormField wrapper component with label, tooltip, help text, and error display.
 * Use this to wrap any form input for consistent styling.
 */
export function FormField({
  label,
  htmlFor,
  required = false,
  helpText,
  hint,
  error,
  tooltip,
  children,
  className,
}: FormFieldProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const displayHelpText = helpText || hint;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <div className="flex items-center gap-1.5">
          <label
            htmlFor={htmlFor}
            className="block text-sm font-medium text-slate-700"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
          {tooltip && (
            <div className="relative inline-block">
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
                aria-label="More information"
              >
                <Info className="h-4 w-4" />
              </button>
              {showTooltip && (
                <div className="absolute z-50 w-64 p-3 text-sm bg-slate-800 text-white rounded-lg shadow-lg -top-2 left-6 transform">
                  <div className="absolute w-2 h-2 bg-slate-800 transform rotate-45 -left-1 top-3" />
                  {tooltip}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {children}
      {displayHelpText && !error && (
        <p className="text-xs text-slate-500">{displayHelpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

// =============================================================================
// INPUT
// =============================================================================

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: string;
  rightAddon?: string;
}

/**
 * Consolidated Input component supporting:
 * - Standalone mode with built-in label/error (for simple cases)
 * - Wrapped mode within FormField (for complex cases with tooltips)
 * - Left/right addons for currency, units, etc.
 */
export function Input({
  label,
  error,
  hint,
  leftAddon,
  rightAddon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const baseInputStyles = cn(
    'px-3 py-2 bg-white border text-sm rounded-lg transition-colors',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-slate-100 disabled:cursor-not-allowed',
    error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-slate-300 focus:border-navy-500 focus:ring-navy-500'
  );

  // Render with addons
  if (leftAddon || rightAddon) {
    const inputElement = (
      <div className="relative flex">
        {leftAddon && (
          <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg">
            {leftAddon}
          </span>
        )}
        <input
          id={inputId}
          className={cn(
            baseInputStyles,
            'flex-1',
            leftAddon && 'rounded-l-none border-l-0',
            rightAddon && 'rounded-r-none border-r-0',
            className
          )}
          {...props}
        />
        {rightAddon && (
          <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-100 border border-l-0 border-slate-300 rounded-r-lg">
            {rightAddon}
          </span>
        )}
      </div>
    );

    // If label provided, wrap in FormField structure
    if (label) {
      return (
        <div className="space-y-1">
          <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
            {label}
          </label>
          {inputElement}
          {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      );
    }

    return inputElement;
  }

  // Render without addons
  const inputElement = (
    <input
      id={inputId}
      className={cn(baseInputStyles, 'w-full', className)}
      {...props}
    />
  );

  // If label provided, wrap in FormField structure
  if (label) {
    return (
      <div className="space-y-1">
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {inputElement}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return inputElement;
}

// =============================================================================
// SELECT
// =============================================================================

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

/**
 * Consolidated Select component with optional label and error display.
 */
export function Select({
  label,
  error,
  hint,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const selectElement = (
    <select
      id={selectId}
      className={cn(
        'w-full px-3 py-2 bg-white border rounded-lg text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 focus:border-navy-500 focus:ring-navy-500',
        className
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  if (label) {
    return (
      <div className="space-y-1">
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {selectElement}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return selectElement;
}

// =============================================================================
// TEXTAREA
// =============================================================================

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

/**
 * Textarea component with optional label and error display.
 */
export function Textarea({
  label,
  error,
  hint,
  className,
  id,
  ...props
}: TextareaProps) {
  const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  const textareaElement = (
    <textarea
      id={textareaId}
      className={cn(
        'w-full px-3 py-2 bg-white border rounded-lg text-sm transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-offset-0',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        'min-h-[80px] resize-y',
        error
          ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
          : 'border-slate-300 focus:border-navy-500 focus:ring-navy-500',
        className
      )}
      {...props}
    />
  );

  if (label) {
    return (
      <div className="space-y-1">
        <label htmlFor={textareaId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
        {textareaElement}
        {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return textareaElement;
}

// =============================================================================
// CHECKBOX
// =============================================================================

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

/**
 * Checkbox with inline label.
 */
export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer', className)}>
      <input
        type="checkbox"
        className="w-4 h-4 text-navy-600 border-slate-300 rounded focus:ring-navy-500"
        {...props}
      />
      <span className="text-sm text-slate-700">{label}</span>
    </label>
  );
}

// =============================================================================
// RADIO GROUP
// =============================================================================

interface RadioGroupProps {
  label?: string;
  name: string;
  options: Array<{ value: string; label: string; description?: string }>;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  className?: string;
}

/**
 * Radio button group with card-style options.
 */
export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  className,
}: RadioGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              'flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors',
              value === option.value
                ? 'border-navy-500 bg-navy-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(e.target.value)}
              className="mt-0.5 h-4 w-4 text-navy-600 border-slate-300 focus:ring-navy-500"
            />
            <div>
              <span className="text-sm font-medium text-slate-900">
                {option.label}
              </span>
              {option.description && (
                <p className="text-xs text-slate-500 mt-0.5">
                  {option.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
