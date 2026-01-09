'use client';

import React from 'react';
import { useSafeWizard } from '../SafeWizardContext';
import { Input, Select } from '@/components/comp-optimizer/ui/Input';
import { US_STATES } from '@/lib/safe-types';

export function Step3CompanyInfo() {
  const { state, updateCompanyInfo } = useSafeWizard();
  const { companyInfo } = state;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Company Information</h2>
        <p className="mt-1 text-sm text-slate-600">
          Enter your company&apos;s legal details. This information will appear in the SAFE document.
        </p>
      </div>

      {/* Delaware Incorporation Tip */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex gap-3">
          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="font-semibold text-blue-900 text-sm">Delaware is Standard</h4>
            <p className="text-sm text-blue-800 mt-1">
              ~90% of VC-backed startups incorporate in Delaware, even if headquartered elsewhere.
              If you&apos;re raising institutional capital, you should be a Delaware C-Corp.
              If you&apos;re not incorporated yet, consider using Stripe Atlas, Clerky, or a startup attorney.
            </p>
          </div>
        </div>
      </div>

      {/* Legal Name */}
      <Input
        label="Company Legal Name"
        value={companyInfo.legalName || ''}
        onChange={(e) => updateCompanyInfo({ legalName: e.target.value })}
        placeholder="e.g., Acme Technologies, Inc."
        hint="The exact legal name as it appears on your certificate of incorporation"
      />

      {/* State of Incorporation */}
      <Select
        label="State of Incorporation"
        options={US_STATES}
        value={companyInfo.stateOfIncorporation || 'DE'}
        onChange={(e) => updateCompanyInfo({ stateOfIncorporation: e.target.value })}
        hint="The state where your company is legally incorporated"
      />

      {companyInfo.stateOfIncorporation && companyInfo.stateOfIncorporation !== 'DE' && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">Non-Delaware Incorporation</h4>
              <p className="text-sm text-amber-800 mt-1">
                Most institutional investors expect Delaware incorporation. If you plan to raise from VCs,
                you may want to consider re-incorporating in Delaware before your priced round.
                The YC SAFE is designed for Delaware corporations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Address Section */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Company Address</h3>
        <p className="text-sm text-slate-600 mb-4">
          This is the company&apos;s principal business address (where you operate), not necessarily where you&apos;re incorporated.
        </p>

        <div className="space-y-4">
          <Input
            label="Street Address"
            value={companyInfo.address || ''}
            onChange={(e) => updateCompanyInfo({ address: e.target.value })}
            placeholder="e.g., 123 Main Street, Suite 100"
          />

          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-3">
              <Input
                label="City"
                value={companyInfo.city || ''}
                onChange={(e) => updateCompanyInfo({ city: e.target.value })}
                placeholder="e.g., San Francisco"
              />
            </div>
            <div className="col-span-1">
              <Select
                label="State"
                options={US_STATES}
                value={companyInfo.state || ''}
                onChange={(e) => updateCompanyInfo({ state: e.target.value })}
                placeholder="Select"
              />
            </div>
            <div className="col-span-2">
              <Input
                label="ZIP Code"
                value={companyInfo.zipCode || ''}
                onChange={(e) => updateCompanyInfo({ zipCode: e.target.value })}
                placeholder="e.g., 94105"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Signatory Information */}
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-lg font-medium text-slate-900 mb-4">Company Signatory</h3>
        <p className="text-sm text-slate-600 mb-4">
          Who will sign the SAFE on behalf of the company? This is typically the CEO or a co-founder with signing authority.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={companyInfo.founderName || ''}
              onChange={(e) => updateCompanyInfo({ founderName: e.target.value })}
              placeholder="e.g., Jane Smith"
            />
            <Input
              label="Title"
              value={companyInfo.founderTitle || ''}
              onChange={(e) => updateCompanyInfo({ founderTitle: e.target.value })}
              placeholder="e.g., Chief Executive Officer"
              hint="CEO, President, or other officer title"
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            value={companyInfo.founderEmail || ''}
            onChange={(e) => updateCompanyInfo({ founderEmail: e.target.value })}
            placeholder="e.g., jane@acme.com"
            hint="For document delivery and correspondence"
          />
        </div>
      </div>

      {/* Board Approval Note */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h4 className="font-semibold text-slate-900 text-sm mb-2">Board Approval</h4>
        <p className="text-sm text-slate-600">
          Before signing a SAFE, your board should approve the issuance. For most early-stage startups,
          this means the founders need to consent. If you have outside directors, check your bylaws
          for approval requirements. Most SAFEs can be approved by written consent without a formal meeting.
        </p>
      </div>
    </div>
  );
}
