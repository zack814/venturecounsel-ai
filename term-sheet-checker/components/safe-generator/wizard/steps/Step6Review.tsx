'use client';

import React from 'react';
import { useSafeWizard } from '../SafeWizardContext';
import { cn } from '@/lib/utils';
import {
  SAFE_TYPE_INFO,
  SIDE_LETTER_OPTIONS,
  formatUSD,
  formatValuation,
  calculateOwnership,
} from '@/lib/safe-types';

function SectionCard({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Edit
          </button>
        )}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function DetailRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={cn('text-sm font-medium', highlight ? 'text-amber-600' : 'text-slate-900')}>
        {value}
      </span>
    </div>
  );
}

export function Step6Review() {
  const { state, setCurrentStep } = useSafeWizard();
  const { safeType, safeTerms, companyInfo, investorInfo, sideLetters } = state;

  const safeTypeInfo = SAFE_TYPE_INFO[safeType];
  const isPostMoney = safeType.includes('post-money');
  const hasCap = safeType.includes('cap');
  const enabledSideLetters = SIDE_LETTER_OPTIONS.filter(
    (opt) => sideLetters[opt.id]?.enabled
  );

  // Calculate ownership preview
  const ownership = hasCap && safeTerms.investmentAmount && safeTerms.valuationCap
    ? calculateOwnership(safeTerms.investmentAmount, safeTerms.valuationCap, isPostMoney)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Review Your SAFE</h2>
        <p className="mt-1 text-sm text-slate-600">
          Review all details before generating your documents. Click &quot;Edit&quot; on any section to make changes.
        </p>
      </div>

      {/* Key Terms Summary */}
      <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
        <h3 className="font-semibold text-amber-900 mb-3">Key Terms Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-amber-600 uppercase tracking-wide">Investment</p>
            <p className="text-lg font-bold text-amber-900">
              {safeTerms.investmentAmount ? formatUSD(safeTerms.investmentAmount) : '—'}
            </p>
          </div>
          {hasCap && (
            <div>
              <p className="text-xs text-amber-600 uppercase tracking-wide">Valuation Cap</p>
              <p className="text-lg font-bold text-amber-900">
                {safeTerms.valuationCap ? formatValuation(safeTerms.valuationCap) : '—'}
              </p>
            </div>
          )}
          {safeType.includes('discount') && (
            <div>
              <p className="text-xs text-amber-600 uppercase tracking-wide">Discount</p>
              <p className="text-lg font-bold text-amber-900">
                {safeTerms.discountRate ? `${safeTerms.discountRate}%` : '—'}
              </p>
            </div>
          )}
          {ownership && (
            <div>
              <p className="text-xs text-amber-600 uppercase tracking-wide">Ownership at Cap</p>
              <p className="text-lg font-bold text-amber-900">{ownership.toFixed(2)}%</p>
            </div>
          )}
        </div>
      </div>

      {/* SAFE Type */}
      <SectionCard title="SAFE Type" onEdit={() => setCurrentStep(1)}>
        <div className="flex items-center gap-3">
          <div className={cn(
            'px-3 py-1 rounded-full text-sm font-semibold',
            safeTypeInfo.recommendation === 'strongly-recommended'
              ? 'bg-green-100 text-green-800'
              : safeTypeInfo.recommendation === 'acceptable'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-red-100 text-red-800'
          )}>
            {safeTypeInfo.name}
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-600">{safeTypeInfo.shortDescription}</p>
      </SectionCard>

      {/* Investment Details */}
      <SectionCard title="Investment Details" onEdit={() => setCurrentStep(2)}>
        <DetailRow
          label="Investment Amount"
          value={safeTerms.investmentAmount ? formatUSD(safeTerms.investmentAmount) : 'Not set'}
          highlight={!safeTerms.investmentAmount}
        />
        {hasCap && (
          <DetailRow
            label="Valuation Cap"
            value={safeTerms.valuationCap ? formatValuation(safeTerms.valuationCap) : 'Not set'}
            highlight={!safeTerms.valuationCap}
          />
        )}
        {safeType.includes('discount') && (
          <DetailRow
            label="Discount Rate"
            value={safeTerms.discountRate ? `${safeTerms.discountRate}%` : 'Not set'}
            highlight={!safeTerms.discountRate}
          />
        )}
        <DetailRow
          label="Purchase Date"
          value={safeTerms.purchaseDate || 'Not set'}
        />
      </SectionCard>

      {/* Company Information */}
      <SectionCard title="Company Information" onEdit={() => setCurrentStep(3)}>
        <DetailRow
          label="Legal Name"
          value={companyInfo.legalName || 'Not set'}
          highlight={!companyInfo.legalName}
        />
        <DetailRow
          label="State of Incorporation"
          value={companyInfo.stateOfIncorporation || 'Not set'}
        />
        <DetailRow
          label="Address"
          value={
            companyInfo.address
              ? `${companyInfo.address}, ${companyInfo.city}, ${companyInfo.state} ${companyInfo.zipCode}`
              : 'Not set'
          }
        />
        <DetailRow
          label="Signatory"
          value={
            companyInfo.founderName
              ? `${companyInfo.founderName}, ${companyInfo.founderTitle}`
              : 'Not set'
          }
        />
        <DetailRow label="Contact Email" value={companyInfo.founderEmail || 'Not set'} />
      </SectionCard>

      {/* Investor Information */}
      <SectionCard title="Investor Information" onEdit={() => setCurrentStep(4)}>
        <DetailRow
          label="Investor Type"
          value={investorInfo.type === 'entity' ? 'Entity' : 'Individual'}
        />
        <DetailRow
          label="Name"
          value={
            investorInfo.type === 'entity'
              ? investorInfo.entityName || 'Not set'
              : investorInfo.legalName || 'Not set'
          }
          highlight={investorInfo.type === 'entity' ? !investorInfo.entityName : !investorInfo.legalName}
        />
        {investorInfo.type === 'entity' && investorInfo.entityType && (
          <DetailRow label="Entity Type" value={investorInfo.entityType.toUpperCase()} />
        )}
        <DetailRow
          label="Address"
          value={
            investorInfo.address
              ? `${investorInfo.address}, ${investorInfo.city}, ${investorInfo.state} ${investorInfo.zipCode}`
              : 'Not set'
          }
        />
        <DetailRow label="Contact Email" value={investorInfo.email || 'Not set'} />
        <DetailRow
          label="Accredited Investor"
          value={investorInfo.isAccredited ? 'Yes, certified' : 'Not certified'}
          highlight={!investorInfo.isAccredited}
        />
      </SectionCard>

      {/* Side Letters */}
      <SectionCard title="Side Letter Rights" onEdit={() => setCurrentStep(5)}>
        {enabledSideLetters.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No side letter rights selected. Only standard SAFE rights will apply.
          </p>
        ) : (
          <div className="space-y-2">
            {enabledSideLetters.map((opt) => {
              const selection = sideLetters[opt.id];
              return (
                <div key={opt.id} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-slate-900">{opt.name}</span>
                  {selection.fields && Object.keys(selection.fields).length > 0 && (
                    <span className="text-xs text-slate-500">
                      ({Object.entries(selection.fields).map(([k, v]) => {
                        if (k.includes('threshold')) return `$${(v as number).toLocaleString()} threshold`;
                        if (k.includes('frequency')) return v as string;
                        return '';
                      }).filter(Boolean).join(', ')})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Documents to be Generated */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <h3 className="font-semibold text-slate-900 mb-3">Documents to be Generated</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-slate-900">SAFE Agreement</span>
            <span className="text-xs text-slate-500">({safeTypeInfo.name})</span>
          </div>
          {enabledSideLetters.length > 0 && (
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-slate-900">Side Letter</span>
              <span className="text-xs text-slate-500">({enabledSideLetters.length} right{enabledSideLetters.length !== 1 ? 's' : ''})</span>
            </div>
          )}
        </div>
      </div>

      {/* Warnings */}
      {!investorInfo.isAccredited && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex gap-3">
            <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="font-semibold text-red-900 text-sm">Accreditation Warning</h4>
              <p className="text-sm text-red-800 mt-1">
                The investor has not certified they are accredited. SAFEs are typically only offered to accredited
                investors under Regulation D. Please verify accreditation status before proceeding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legal Disclaimer */}
      <div className="p-4 bg-slate-900 text-slate-300 rounded-xl">
        <h4 className="font-semibold text-white text-sm mb-2">Important Legal Notice</h4>
        <p className="text-xs leading-relaxed">
          These documents are based on the Y Combinator SAFE templates and are provided for informational purposes.
          VentureCounsel.AI is not a law firm and does not provide legal advice. Before signing any securities documents,
          have them reviewed by a qualified attorney. The use of these documents does not create an attorney-client
          relationship. By generating these documents, you acknowledge this disclaimer.
        </p>
      </div>
    </div>
  );
}
