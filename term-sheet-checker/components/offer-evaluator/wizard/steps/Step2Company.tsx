'use client';

import React from 'react';
import { useOfferEvaluator } from '../OfferEvaluatorContext';
import { FormField, Select, Input, Checkbox } from '@/components/offer-evaluator/ui/FormField';
import {
  STAGE_LABELS,
  GEO_LABELS,
  INDUSTRY_LABELS,
} from '@/lib/offer-evaluator-schemas';
import type {
  CompanyStage,
  GeoMarket,
  HeadcountRange,
  IndustrySector,
} from '@/lib/offer-evaluator-schemas';
import { Building2, Users, MapPin, Briefcase, Clock, AlertCircle } from 'lucide-react';

const stageOptions = Object.entries(STAGE_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const industryOptions = Object.entries(INDUSTRY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const geoOptions = Object.entries(GEO_LABELS).map(([value, label]) => ({
  value,
  label,
}));

const headcountOptions = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-25', label: '11-25 employees' },
  { value: '26-50', label: '26-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '101-250', label: '101-250 employees' },
  { value: '250+', label: '250+ employees' },
];

export function Step2Company() {
  const { state, updateCompanyDetails } = useOfferEvaluator();
  const { companyDetails } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Company Details</h2>
        <p className="text-sm text-slate-600">
          Tell us about the company so we can provide accurate market comparisons.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Company Name"
          htmlFor="companyName"
          helpText="Optional - for your reference only"
        >
          <Input
            id="companyName"
            value={companyDetails.companyName || ''}
            onChange={(e) => updateCompanyDetails({ companyName: e.target.value })}
            placeholder="e.g., Acme Inc"
          />
        </FormField>

        <FormField
          label="Company Stage"
          htmlFor="stage"
          required
          tooltip="The company's funding stage significantly affects equity expectations. Earlier stage = more equity, more risk."
        >
          <Select
            id="stage"
            value={companyDetails.stage || ''}
            onChange={(e) => updateCompanyDetails({ stage: e.target.value as CompanyStage })}
            options={stageOptions}
          />
        </FormField>

        <FormField
          label="Industry"
          htmlFor="industry"
          required
          tooltip="Different industries have different compensation norms."
        >
          <Select
            id="industry"
            value={companyDetails.industry || ''}
            onChange={(e) => updateCompanyDetails({ industry: e.target.value as IndustrySector })}
            options={industryOptions}
          />
        </FormField>

        <FormField
          label="Company Location / HQ"
          htmlFor="location"
          required
          tooltip="Where the company is headquartered affects compensation standards."
        >
          <Select
            id="location"
            value={companyDetails.location || ''}
            onChange={(e) => updateCompanyDetails({ location: e.target.value as GeoMarket })}
            options={geoOptions}
          />
        </FormField>

        <FormField
          label="Current Headcount"
          htmlFor="headcount"
          required
          tooltip="Company size affects equity percentages. Earlier employees typically get more equity."
        >
          <Select
            id="headcount"
            value={companyDetails.headcount || ''}
            onChange={(e) => updateCompanyDetails({ headcount: e.target.value as HeadcountRange })}
            options={headcountOptions}
          />
        </FormField>

        <FormField
          label="Months Since Last Funding"
          htmlFor="monthsSinceLastRound"
          helpText="Optional - helps estimate current runway and valuation freshness"
        >
          <Input
            id="monthsSinceLastRound"
            type="number"
            min={0}
            value={companyDetails.monthsSinceLastRound ?? ''}
            onChange={(e) => updateCompanyDetails({ monthsSinceLastRound: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 6"
          />
        </FormField>
      </div>

      <div>
        <Checkbox
          label="This is a publicly traded company"
          checked={companyDetails.isPublic || false}
          onChange={(e) => updateCompanyDetails({ isPublic: e.target.checked })}
        />
        {companyDetails.isPublic && (
          <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Note: This tool is optimized for private company equity (options). Public company RSUs have different considerations.
          </p>
        )}
      </div>

      {/* Questions to Ask Your Employer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Questions to Ask Your Employer</h3>
            <p className="text-sm text-blue-800 mb-3">
              To fully evaluate your equity, you&apos;ll need information the employer may not have shared yet. Consider asking:
            </p>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">1.</span>
                <span><strong>What is the current 409A fair market value per share?</strong> This determines your strike price.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">2.</span>
                <span><strong>How many fully diluted shares are outstanding?</strong> This tells you what percentage of the company you&apos;ll own.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">3.</span>
                <span><strong>What was the valuation in the last funding round?</strong> This helps estimate your equity&apos;s current value.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
