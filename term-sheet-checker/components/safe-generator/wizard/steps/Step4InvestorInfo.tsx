'use client';

import React from 'react';
import { useSafeWizard } from '../SafeWizardContext';
import { Input, Select, RadioGroup } from '@/components/comp-optimizer/ui/Input';
import { US_STATES } from '@/lib/safe-types';
import { cn } from '@/lib/utils';

const entityTypeOptions = [
  { value: 'llc', label: 'LLC' },
  { value: 'lp', label: 'Limited Partnership (LP)' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'trust', label: 'Trust' },
  { value: 'other', label: 'Other' },
];

export function Step4InvestorInfo() {
  const { state, updateInvestorInfo } = useSafeWizard();
  const { investorInfo } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Investor Information</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter the investor&apos;s details. This information will appear in the SAFE document.
        </p>
      </div>

      {/* Investor Type Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">
          Investor Type
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => updateInvestorInfo({ type: 'individual' })}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              investorInfo.type === 'individual'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                investorInfo.type === 'individual' ? 'bg-amber-100' : 'bg-slate-100'
              )}>
                <svg className={cn(
                  'w-5 h-5',
                  investorInfo.type === 'individual' ? 'text-amber-600' : 'text-slate-500'
                )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Individual</span>
                <span className="block text-xs text-slate-500">Angel investor, friend, or family</span>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => updateInvestorInfo({ type: 'entity' })}
            className={cn(
              'p-4 rounded-xl border-2 text-left transition-all',
              investorInfo.type === 'entity'
                ? 'border-amber-500 bg-amber-50'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                investorInfo.type === 'entity' ? 'bg-amber-100' : 'bg-slate-100'
              )}>
                <svg className={cn(
                  'w-5 h-5',
                  investorInfo.type === 'entity' ? 'text-amber-600' : 'text-slate-500'
                )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <span className="block font-semibold text-slate-900">Entity</span>
                <span className="block text-xs text-slate-500">Fund, syndicate, or corporation</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Individual Investor Fields */}
      {investorInfo.type === 'individual' && (
        <div className="space-y-4">
          <Input
            label="Full Legal Name"
            value={investorInfo.legalName || ''}
            onChange={(e) => updateInvestorInfo({ legalName: e.target.value })}
            placeholder="e.g., John Smith"
            hint="As it should appear on the legal document"
          />
        </div>
      )}

      {/* Entity Investor Fields */}
      {investorInfo.type === 'entity' && (
        <div className="space-y-4">
          <Input
            label="Entity Legal Name"
            value={investorInfo.entityName || ''}
            onChange={(e) => updateInvestorInfo({ entityName: e.target.value })}
            placeholder="e.g., Sequoia Capital Fund XV, L.P."
            hint="The exact legal name of the investing entity"
          />

          <Select
            label="Entity Type"
            options={entityTypeOptions}
            value={investorInfo.entityType || ''}
            onChange={(e) => updateInvestorInfo({ entityType: e.target.value })}
            hint="The legal structure of the investing entity"
          />

          <Input
            label="Signatory Name"
            value={investorInfo.legalName || ''}
            onChange={(e) => updateInvestorInfo({ legalName: e.target.value })}
            placeholder="e.g., Jane Doe, Managing Partner"
            hint="The person authorized to sign on behalf of the entity"
          />
        </div>
      )}

      {/* Address Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Investor Address</h3>
        <div className="space-y-4">
          <Input
            label="Street Address"
            value={investorInfo.address || ''}
            onChange={(e) => updateInvestorInfo({ address: e.target.value })}
            placeholder="e.g., 456 Investment Blvd, Suite 200"
          />

          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <Input
                label="City"
                value={investorInfo.city || ''}
                onChange={(e) => updateInvestorInfo({ city: e.target.value })}
                placeholder="e.g., Menlo Park"
              />
            </div>
            <div className="col-span-1">
              <Select
                label="State"
                options={US_STATES}
                value={investorInfo.state || ''}
                onChange={(e) => updateInvestorInfo({ state: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Input
                label="ZIP Code"
                value={investorInfo.zipCode || ''}
                onChange={(e) => updateInvestorInfo({ zipCode: e.target.value })}
                placeholder="e.g., 94025"
              />
            </div>
          </div>

          <Input
            label="Email Address"
            type="email"
            value={investorInfo.email || ''}
            onChange={(e) => updateInvestorInfo({ email: e.target.value })}
            placeholder="e.g., john@investor.com"
            hint="For document delivery and correspondence"
          />
        </div>
      </div>

      {/* Accredited Investor Certification */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Accredited Investor Status</h3>

        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-4">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">Important: Securities Law Requirement</h4>
              <p className="text-sm text-amber-800 mt-1">
                SAFEs are securities that typically can only be sold to &quot;accredited investors&quot; under
                SEC Regulation D. Selling to non-accredited investors may require additional disclosures
                and has strict limits. Most SAFE rounds only accept accredited investors.
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-4">
          <h4 className="font-semibold text-slate-900 text-sm mb-3">Who is an Accredited Investor?</h4>
          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Individuals</strong> must meet one of:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Net worth over $1 million (excluding primary residence)</li>
              <li>Income over $200K ($300K with spouse) in each of the last 2 years</li>
              <li>Certain professional certifications (Series 7, 65, or 82)</li>
            </ul>
            <p className="mt-2"><strong>Entities</strong> must meet one of:</p>
            <ul className="list-disc list-inside ml-2 space-y-1">
              <li>Assets over $5 million</li>
              <li>All equity owners are accredited investors</li>
              <li>Registered investment companies, banks, or similar institutions</li>
            </ul>
          </div>
        </div>

        <label className={cn(
          'flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all',
          investorInfo.isAccredited
            ? 'border-green-500 bg-green-50'
            : 'border-slate-200 hover:border-slate-300'
        )}>
          <input
            type="checkbox"
            checked={investorInfo.isAccredited || false}
            onChange={(e) => updateInvestorInfo({ isAccredited: e.target.checked })}
            className="mt-0.5 h-5 w-5 text-green-600 border-slate-300 rounded focus:ring-green-500"
          />
          <div>
            <span className="block font-medium text-slate-900">
              Investor certifies they are an accredited investor
            </span>
            <span className="block text-sm text-slate-500 mt-1">
              The investor confirms they meet the SEC&apos;s accredited investor definition and will provide
              supporting documentation if requested.
            </span>
          </div>
        </label>

        {!investorInfo.isAccredited && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-semibold text-red-900 text-sm">Accreditation Required</h4>
                <p className="text-sm text-red-800 mt-1">
                  This tool generates documents for accredited investors only. If you need to raise from
                  non-accredited investors, consult with a securities attorney about Regulation CF or
                  other exemptions.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
