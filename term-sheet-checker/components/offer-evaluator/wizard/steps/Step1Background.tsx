'use client';

import React from 'react';
import { useOfferEvaluator } from '../OfferEvaluatorContext';
import { FormField, Select, Input, RadioGroup } from '@/components/offer-evaluator/ui/FormField';
import {
  JOB_FAMILY_LABELS,
  JOB_LEVEL_LABELS,
  GEO_LABELS,
} from '@/lib/offer-evaluator-schemas';
import type {
  JobFamily,
  JobLevel,
  GeoMarket,
  EmploymentStatus,
  EmployeeRiskTolerance,
  FinancialSituation,
} from '@/lib/offer-evaluator-schemas';

const jobFamilyOptions = Object.entries(JOB_FAMILY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const jobLevelOptions = Object.entries(JOB_LEVEL_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const geoOptions = Object.entries(GEO_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const employmentStatusOptions = [
  { value: 'employed', label: 'Currently Employed' },
  { value: 'unemployed', label: 'Unemployed / Between Jobs' },
  { value: 'student', label: 'Student / New Graduate' },
  { value: 'contractor', label: 'Contractor / Freelancer' },
];

const riskToleranceOptions = [
  { value: 'conservative', label: 'Conservative', description: 'I prefer stability and guaranteed compensation over potential upside.' },
  { value: 'moderate', label: 'Moderate', description: 'I want a balanced mix of cash and equity with reasonable risk.' },
  { value: 'aggressive', label: 'Aggressive', description: 'I\'m willing to take more risk for higher potential equity upside.' },
];

const financialSituationOptions = [
  { value: 'need-stability', label: 'Need Stability', description: 'I have financial obligations that require stable, predictable income.' },
  { value: 'balanced', label: 'Balanced', description: 'I have some flexibility but still need reasonable cash compensation.' },
  { value: 'can-take-risk', label: 'Can Take Risk', description: 'I have savings/runway and can afford to take a lower salary for more equity.' },
];

export function Step1Background() {
  const { state, updateEmployeeBackground } = useOfferEvaluator();
  const { employeeBackground } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Your Background</h2>
        <p className="text-sm text-slate-600">
          Tell us about yourself so we can provide personalized benchmarks and advice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Job Function"
          htmlFor="jobFamily"
          required
          tooltip="The department or function you'll be working in. This affects compensation benchmarks significantly."
        >
          <Select
            id="jobFamily"
            value={employeeBackground.jobFamily || ''}
            onChange={(e) => updateEmployeeBackground({ jobFamily: e.target.value as JobFamily })}
            options={jobFamilyOptions}
          />
        </FormField>

        <FormField
          label="Seniority Level"
          htmlFor="jobLevel"
          required
          tooltip="Your experience level in this role. Be realistic - most candidates overestimate their level."
        >
          <Select
            id="jobLevel"
            value={employeeBackground.jobLevel || ''}
            onChange={(e) => updateEmployeeBackground({ jobLevel: e.target.value as JobLevel })}
            options={jobLevelOptions}
          />
        </FormField>

        <FormField
          label="Years of Relevant Experience"
          htmlFor="yearsExperience"
          helpText="Total years in this field (optional)"
        >
          <Input
            id="yearsExperience"
            type="number"
            min={0}
            max={50}
            value={employeeBackground.yearsExperience ?? ''}
            onChange={(e) => updateEmployeeBackground({ yearsExperience: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 5"
          />
        </FormField>

        <FormField
          label="Your Location"
          htmlFor="location"
          required
          tooltip="Where you'll be working from. This significantly affects salary benchmarks."
        >
          <Select
            id="location"
            value={employeeBackground.location || ''}
            onChange={(e) => updateEmployeeBackground({ location: e.target.value as GeoMarket })}
            options={geoOptions}
          />
        </FormField>

        <FormField
          label="Current Employment Status"
          htmlFor="employmentStatus"
          required
        >
          <Select
            id="employmentStatus"
            value={employeeBackground.employmentStatus || ''}
            onChange={(e) => updateEmployeeBackground({ employmentStatus: e.target.value as EmploymentStatus })}
            options={employmentStatusOptions}
          />
        </FormField>

        <FormField
          label="Current Base Salary"
          htmlFor="currentBaseSalary"
          helpText="Your current annual base (optional, helps contextualize the offer)"
        >
          <Input
            id="currentBaseSalary"
            type="number"
            min={0}
            leftAddon="$"
            value={employeeBackground.currentBaseSalary ?? ''}
            onChange={(e) => updateEmployeeBackground({ currentBaseSalary: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 150000"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <FormField
          label="Risk Tolerance"
          required
          tooltip="How comfortable are you trading cash for equity upside? This affects our recommendations."
        >
          <RadioGroup
            name="riskTolerance"
            options={riskToleranceOptions}
            value={employeeBackground.riskTolerance || ''}
            onChange={(value) => updateEmployeeBackground({ riskTolerance: value as EmployeeRiskTolerance })}
          />
        </FormField>

        <FormField
          label="Financial Situation"
          required
          tooltip="Your current financial flexibility affects what kind of offer is right for you."
        >
          <RadioGroup
            name="financialSituation"
            options={financialSituationOptions}
            value={employeeBackground.financialSituation || ''}
            onChange={(value) => updateEmployeeBackground({ financialSituation: value as FinancialSituation })}
          />
        </FormField>
      </div>
    </div>
  );
}
