'use client';

import React from 'react';
import { useOfferEvaluator } from '../OfferEvaluatorContext';
import {
  JOB_FAMILY_LABELS,
  JOB_LEVEL_LABELS,
  GEO_LABELS,
  STAGE_LABELS,
  INDUSTRY_LABELS,
  EQUITY_TYPE_LABELS,
  EXERCISE_PERIOD_LABELS,
  ACCELERATION_LABELS,
} from '@/lib/offer-evaluator-schemas';
import { Building2, User, DollarSign, PieChart, Target, Pencil, AlertTriangle, CheckCircle } from 'lucide-react';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  onEdit: () => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, onEdit, children }: SectionProps) {
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-sm font-semibold text-slate-700">{title}</h3>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="text-sm text-navy-600 hover:text-navy-700 flex items-center gap-1"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      </div>
      <div className="px-4 py-3">
        {children}
      </div>
    </div>
  );
}

function ReviewItem({ label, value, warning }: { label: string; value: React.ReactNode; warning?: boolean }) {
  return (
    <div className="flex items-start justify-between py-1">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`text-sm font-medium text-right ${warning ? 'text-amber-600' : 'text-slate-900'}`}>
        {value}
      </span>
    </div>
  );
}

export function Step6Review() {
  const { state, setCurrentStep } = useOfferEvaluator();
  const { employeeBackground, companyDetails, cashOffer, equityOffer, negotiationContext } = state;

  // Calculate totals
  const totalCash = (cashOffer.baseSalary || 0) +
    (cashOffer.bonusTargetAmount || (cashOffer.baseSalary || 0) * (cashOffer.bonusTargetPercent || 0) / 100) +
    (cashOffer.signingBonus || 0);

  const ownershipPercent = equityOffer.shareCount && equityOffer.totalSharesOutstanding
    ? (equityOffer.shareCount / equityOffer.totalSharesOutstanding * 100)
    : equityOffer.percentOfCompany;

  const paperValue = ownershipPercent && equityOffer.latestValuation
    ? (ownershipPercent / 100) * equityOffer.latestValuation
    : equityOffer.shareCount && equityOffer.latestRoundPricePerShare
    ? equityOffer.shareCount * equityOffer.latestRoundPricePerShare
    : null;

  // Check for missing critical data
  const missingData: string[] = [];
  if (!equityOffer.strikePrice) missingData.push('Strike price (409A valuation)');
  if (!equityOffer.totalSharesOutstanding && !equityOffer.percentOfCompany) missingData.push('Shares outstanding or ownership %');
  if (!equityOffer.latestValuation && !equityOffer.latestRoundPricePerShare) missingData.push('Company valuation');
  if (equityOffer.exercisePeriod === 'unknown') missingData.push('Exercise period');
  if (equityOffer.accelerationProvision === 'unknown') missingData.push('Acceleration provision');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Review Your Information</h2>
        <p className="text-sm text-slate-600">
          Please review everything before we analyze your offer. Click Edit to make changes.
        </p>
      </div>

      {/* Missing Data Warning */}
      {missingData.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Missing Information</h3>
              <p className="text-sm text-amber-800 mb-2">
                We can still analyze your offer, but our analysis will be more accurate if you can get this information from your employer:
              </p>
              <ul className="text-sm text-amber-700 list-disc list-inside">
                {missingData.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Your Background */}
        <ReviewSection
          title="Your Background"
          icon={<User className="h-4 w-4 text-slate-500" />}
          onEdit={() => setCurrentStep(1)}
        >
          <ReviewItem
            label="Role"
            value={`${JOB_LEVEL_LABELS[employeeBackground.jobLevel || ''] || 'N/A'} ${JOB_FAMILY_LABELS[employeeBackground.jobFamily || ''] || 'N/A'}`}
          />
          <ReviewItem
            label="Location"
            value={GEO_LABELS[employeeBackground.location || ''] || 'N/A'}
          />
          <ReviewItem
            label="Risk Tolerance"
            value={employeeBackground.riskTolerance ? employeeBackground.riskTolerance.charAt(0).toUpperCase() + employeeBackground.riskTolerance.slice(1) : 'N/A'}
          />
          {employeeBackground.currentBaseSalary && (
            <ReviewItem
              label="Current Salary"
              value={`$${employeeBackground.currentBaseSalary.toLocaleString()}`}
            />
          )}
        </ReviewSection>

        {/* Company Details */}
        <ReviewSection
          title="Company Details"
          icon={<Building2 className="h-4 w-4 text-slate-500" />}
          onEdit={() => setCurrentStep(2)}
        >
          <ReviewItem
            label="Company"
            value={companyDetails.companyName || 'Not specified'}
          />
          <ReviewItem
            label="Stage"
            value={STAGE_LABELS[companyDetails.stage || ''] || 'N/A'}
          />
          <ReviewItem
            label="Industry"
            value={INDUSTRY_LABELS[companyDetails.industry || ''] || 'N/A'}
          />
          <ReviewItem
            label="Headcount"
            value={companyDetails.headcount || 'N/A'}
          />
        </ReviewSection>

        {/* Cash Compensation */}
        <ReviewSection
          title="Cash Compensation"
          icon={<DollarSign className="h-4 w-4 text-slate-500" />}
          onEdit={() => setCurrentStep(3)}
        >
          <ReviewItem
            label="Base Salary"
            value={cashOffer.baseSalary ? `$${cashOffer.baseSalary.toLocaleString()}/year` : 'N/A'}
          />
          <ReviewItem
            label="Target Bonus"
            value={
              cashOffer.bonusTargetAmount
                ? `$${cashOffer.bonusTargetAmount.toLocaleString()}`
                : cashOffer.bonusTargetPercent
                ? `${cashOffer.bonusTargetPercent}%`
                : 'None'
            }
          />
          <ReviewItem
            label="Signing Bonus"
            value={cashOffer.signingBonus ? `$${cashOffer.signingBonus.toLocaleString()}` : 'None'}
          />
          <div className="border-t border-slate-200 mt-2 pt-2">
            <ReviewItem
              label="Year 1 Total Cash"
              value={<span className="text-emerald-600 font-semibold">${totalCash.toLocaleString()}</span>}
            />
          </div>
        </ReviewSection>

        {/* Equity Details */}
        <ReviewSection
          title="Equity Details"
          icon={<PieChart className="h-4 w-4 text-slate-500" />}
          onEdit={() => setCurrentStep(4)}
        >
          <ReviewItem
            label="Type"
            value={EQUITY_TYPE_LABELS[equityOffer.equityType || ''] || 'N/A'}
          />
          <ReviewItem
            label="Shares"
            value={equityOffer.shareCount ? equityOffer.shareCount.toLocaleString() : 'N/A'}
          />
          {ownershipPercent && (
            <ReviewItem
              label="Ownership"
              value={`${ownershipPercent.toFixed(4)}%`}
            />
          )}
          <ReviewItem
            label="Strike Price"
            value={equityOffer.strikePrice ? `$${equityOffer.strikePrice.toFixed(2)}` : 'Unknown'}
            warning={!equityOffer.strikePrice}
          />
          <ReviewItem
            label="Vesting"
            value={`${equityOffer.vestingTotalMonths || 48} months, ${equityOffer.vestingCliffMonths || 12} month cliff`}
          />
          <ReviewItem
            label="Exercise Period"
            value={EXERCISE_PERIOD_LABELS[equityOffer.exercisePeriod || 'unknown']}
            warning={equityOffer.exercisePeriod === '30-days' || equityOffer.exercisePeriod === '90-days'}
          />
          <ReviewItem
            label="Acceleration"
            value={ACCELERATION_LABELS[equityOffer.accelerationProvision || 'unknown']}
            warning={equityOffer.accelerationProvision === 'none'}
          />
          {paperValue && (
            <div className="border-t border-slate-200 mt-2 pt-2">
              <ReviewItem
                label="Est. Paper Value"
                value={<span className="text-emerald-600 font-semibold">${paperValue.toLocaleString()}</span>}
              />
            </div>
          )}
        </ReviewSection>
      </div>

      {/* Negotiation Context */}
      <ReviewSection
        title="Negotiation Context"
        icon={<Target className="h-4 w-4 text-slate-500" />}
        onEdit={() => setCurrentStep(5)}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ReviewItem
            label="Competing Offers"
            value={
              negotiationContext.competingOffers === 'multiple'
                ? 'Multiple offers'
                : negotiationContext.competingOffers === 'one'
                ? 'One other offer'
                : 'No other offers'
            }
          />
          <ReviewItem
            label="Excitement Level"
            value={`${negotiationContext.excitementLevel || 3}/5`}
          />
          <ReviewItem
            label="Top Priority"
            value={
              negotiationContext.priorities?.[0]
                ? negotiationContext.priorities[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
                : 'N/A'
            }
          />
        </div>
        {negotiationContext.specificConcerns && (
          <div className="mt-3 pt-3 border-t border-slate-200">
            <p className="text-sm text-slate-500 mb-1">Your concerns:</p>
            <p className="text-sm text-slate-700 italic">&quot;{negotiationContext.specificConcerns}&quot;</p>
          </div>
        )}
      </ReviewSection>

      {/* Ready Message */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-emerald-900 mb-1">Ready to Analyze</h3>
            <p className="text-sm text-emerald-800">
              Click &quot;Analyze My Offer&quot; to get your personalized evaluation with:
            </p>
            <ul className="text-sm text-emerald-700 mt-2 space-y-1">
              <li>- Market benchmark comparison for your role and level</li>
              <li>- Red/yellow/green scoring on cash, equity, and terms</li>
              <li>- Expected value calculations under different exit scenarios</li>
              <li>- Specific negotiation suggestions with email templates</li>
              <li>- Link to review your offer documents for red flags</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
