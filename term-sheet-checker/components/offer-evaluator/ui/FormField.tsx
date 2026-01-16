'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  tooltip?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  label,
  htmlFor,
  required = false,
  helpText,
  error,
  tooltip,
  children,
  className,
}: FormFieldProps) {
  const [showTooltip, setShowTooltip] = React.useState(false);

  return (
    <div className={cn('space-y-1.5', className)}>
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
      {children}
      {helpText && !error && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

export function Select({ options, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm',
        'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftAddon?: string;
  rightAddon?: string;
}

export function Input({ leftAddon, rightAddon, className, ...props }: InputProps) {
  if (leftAddon || rightAddon) {
    return (
      <div className="relative flex">
        {leftAddon && (
          <span className="inline-flex items-center px-3 text-sm text-slate-600 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg">
            {leftAddon}
          </span>
        )}
        <input
          className={cn(
            'flex-1 px-3 py-2 bg-white border border-slate-300 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
            'disabled:bg-slate-100 disabled:cursor-not-allowed',
            leftAddon ? 'rounded-l-none' : 'rounded-l-lg',
            rightAddon ? 'rounded-r-none' : 'rounded-r-lg',
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
  }

  return (
    <input
      className={cn(
        'w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm',
        'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm',
        'focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-navy-500',
        'disabled:bg-slate-100 disabled:cursor-not-allowed',
        'min-h-[80px] resize-y',
        className
      )}
      {...props}
    />
  );
}

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

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

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string; description?: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function RadioGroup({ name, options, value, onChange, className }: RadioGroupProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
            value === option.value
              ? 'border-navy-500 bg-navy-50'
              : 'border-slate-200 hover:border-slate-300'
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-0.5 w-4 h-4 text-navy-600 border-slate-300 focus:ring-navy-500"
          />
          <div>
            <span className="text-sm font-medium text-slate-700">{option.label}</span>
            {option.description && (
              <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}
