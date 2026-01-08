'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PackageCard } from './PackageCard';
import { RiskFlagsPanel } from './RiskFlagsPanel';
import { OfferLanguagePanel } from './OfferLanguagePanel';
import { Button } from '@/components/comp-optimizer/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/comp-optimizer/ui/Card';
import { formatCurrency, formatPercent } from '@/lib/utils';
import { generateCompPackages, type PackageGenerationResult } from '@/services/compOptimizer';
import { generateRiskFlags } from '@/services/riskFlagger';
import { generateDraft } from '@/services/draftGenerator';
import type {
  CompPackage,
  CompanyContext,
  RoleProfile,
  CandidateContext,
  TokenProgram,
  Constraints,
  Preferences,
  RiskFlag,
  OfferLanguageBlock,
  NegotiationLever,
} from '@/lib/comp-schemas';

interface WizardState {
  companyContext: Partial<CompanyContext>;
  roleProfile: Partial<RoleProfile>;
  candidateContext: Partial<CandidateContext>;
  tokenProgram: Partial<TokenProgram>;
  constraints: Partial<Constraints>;
  preferences: Partial<Preferences>;
}

export function ResultsDashboard() {
  const router = useRouter();
  const [results, setResults] = useState<PackageGenerationResult | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<CompPackage | null>(null);
  const [riskFlags, setRiskFlags] = useState<RiskFlag[]>([]);
  const [offerBlocks, setOfferBlocks] = useState<OfferLanguageBlock[]>([]);
  const [negotiationLevers, setNegotiationLevers] = useState<NegotiationLever[]>([]);
  const [talkingPoints, setTalkingPoints] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'packages' | 'language' | 'risks'>('packages');
  const [error, setError] = useState<string | null>(null);
  const [inputState, setInputState] = useState<WizardState | null>(null);

  useEffect(() => {
    const storedInput = sessionStorage.getItem('comp-optimizer-input');
    if (!storedInput) {
      router.push('/comp-optimizer');
      return;
    }

    try {
      const state: WizardState = JSON.parse(storedInput);
      setInputState(state);

      // Build complete objects with defaults
      const companyContext: CompanyContext = {
        stage: state.companyContext.stage ?? 'seed',
        geoMarket: state.companyContext.geoMarket ?? 'sv',
        headcountRange: state.companyContext.headcountRange ?? '1-10',
        runwayMonths: state.companyContext.runwayMonths,
        cashBudgetCeiling: state.companyContext.cashBudgetCeiling,
        capTable: state.companyContext.capTable,
      };

      const roleProfile: RoleProfile = {
        jobFamily: state.roleProfile.jobFamily ?? 'engineering',
        jobLevel: state.roleProfile.jobLevel ?? 'senior',
        title: state.roleProfile.title ?? 'Senior Engineer',
        normalizedTitle: state.roleProfile.normalizedTitle ?? 'Senior Software Engineer',
        locationType: state.roleProfile.locationType ?? 'onsite',
        geo: state.roleProfile.geo ?? 'sv',
        department: state.roleProfile.department,
      };

      const candidateContext: CandidateContext = {
        competingOffersLevel: state.candidateContext.competingOffersLevel ?? 'none',
        riskTolerance: state.candidateContext.riskTolerance ?? 'medium',
        startUrgency: state.candidateContext.startUrgency ?? 'standard',
      };

      const tokenProgram: TokenProgram | undefined = state.tokenProgram.enabled
        ? {
            enabled: true,
            totalSupply: state.tokenProgram.totalSupply,
            incentivePoolSize: state.tokenProgram.incentivePoolSize,
            remainingPool: state.tokenProgram.remainingPool,
            lockupMonths: state.tokenProgram.lockupMonths,
            currentTokenPrice: state.tokenProgram.currentTokenPrice,
          }
        : undefined;

      const constraints: Constraints = {
        cashBudgetCeiling: state.constraints.cashBudgetCeiling,
        maxEquityPercent: state.constraints.maxEquityPercent,
        equityPoolAvailable: state.constraints.equityPoolAvailable,
        tokenPoolAvailable: state.constraints.tokenPoolAvailable,
      };

      const preferences: Preferences = {
        retentionPriority: state.preferences.retentionPriority ?? 'normal',
        cashPreservationPriority: state.preferences.cashPreservationPriority ?? 'normal',
        dilutionControlPriority: state.preferences.dilutionControlPriority ?? 'normal',
      };

      // Generate packages
      const generatedResults = generateCompPackages({
        companyContext,
        roleProfile,
        candidateContext,
        tokenProgram,
        constraints,
        preferences,
      });

      setResults(generatedResults);
      setSelectedPackage(generatedResults.bestFitPackage);

      // Generate risk flags for best fit package
      const flags = generateRiskFlags({
        package: generatedResults.bestFitPackage,
        companyContext,
        roleProfile,
        tokenProgram,
      });
      setRiskFlags(flags);

      // Generate draft content
      const draftOutput = generateDraft({
        package: generatedResults.bestFitPackage,
        companyContext,
        roleProfile,
      });
      setOfferBlocks(draftOutput.offerLanguageBlocks);
      setNegotiationLevers(draftOutput.negotiationLevers);
      setTalkingPoints(draftOutput.negotiationTalkingPoints);

    } catch (err) {
      console.error('Error generating results:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate packages');
    }
  }, [router]);

  // Update drafts when selected package changes
  useEffect(() => {
    if (selectedPackage && inputState) {
      const companyContext: CompanyContext = {
        stage: inputState.companyContext.stage ?? 'seed',
        geoMarket: inputState.companyContext.geoMarket ?? 'sv',
        headcountRange: inputState.companyContext.headcountRange ?? '1-10',
        runwayMonths: inputState.companyContext.runwayMonths,
        capTable: inputState.companyContext.capTable,
      };

      const roleProfile: RoleProfile = {
        jobFamily: inputState.roleProfile.jobFamily ?? 'engineering',
        jobLevel: inputState.roleProfile.jobLevel ?? 'senior',
        title: inputState.roleProfile.title ?? 'Senior Engineer',
        normalizedTitle: inputState.roleProfile.normalizedTitle ?? 'Senior Software Engineer',
        locationType: inputState.roleProfile.locationType ?? 'onsite',
        geo: inputState.roleProfile.geo ?? 'sv',
      };

      const tokenProgram: TokenProgram | undefined = inputState.tokenProgram.enabled
        ? { enabled: true, ...inputState.tokenProgram }
        : undefined;

      const flags = generateRiskFlags({
        package: selectedPackage,
        companyContext,
        roleProfile,
        tokenProgram,
      });
      setRiskFlags(flags);

      const draftOutput = generateDraft({
        package: selectedPackage,
        companyContext,
        roleProfile,
      });
      setOfferBlocks(draftOutput.offerLanguageBlocks);
      setNegotiationLevers(draftOutput.negotiationLevers);
      setTalkingPoints(draftOutput.negotiationTalkingPoints);
    }
  }, [selectedPackage, inputState]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-red-500 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Error Generating Packages</h2>
              <p className="text-slate-600 mb-4">{error}</p>
              <Button onClick={() => router.push('/comp-optimizer')}>
                Start Over
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-slate-600">Generating compensation packages...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Compensation Packages</h1>
            <p className="text-slate-600">
              {inputState?.roleProfile.title} at {inputState?.companyContext.stage} stage
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => router.push('/comp-optimizer')}>
              Edit Inputs
            </Button>
            <Button variant="outline" onClick={() => window.print()}>
              Export PDF
            </Button>
          </div>
        </div>

        {/* Market Benchmarks Summary */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-sm text-slate-500">Salary Range (Market)</div>
                <div className="font-medium text-slate-900">
                  {formatCurrency(results.marketBenchmarks.salaryPercentiles.p25)} - {formatCurrency(results.marketBenchmarks.salaryPercentiles.p75)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Equity Range (% FD)</div>
                <div className="font-medium text-slate-900">
                  {formatPercent(results.marketBenchmarks.equityPercentiles.p25, 2)} - {formatPercent(results.marketBenchmarks.equityPercentiles.p75, 2)}
                </div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Confidence</div>
                <div className="font-medium text-slate-900">{results.confidenceScore}%</div>
              </div>
              <div>
                <div className="text-sm text-slate-500">Packages Generated</div>
                <div className="font-medium text-slate-900">{results.packages.length}</div>
              </div>
            </div>
            {results.confidenceNotes.length > 0 && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs text-slate-500">
                  {results.confidenceNotes.join(' • ')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'packages'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Packages ({results.packages.length})
          </button>
          <button
            onClick={() => setActiveTab('language')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'language'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Offer Language
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'risks'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100'
            }`}
          >
            Risk Flags ({riskFlags.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'packages' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                package={pkg}
                isSelected={selectedPackage?.id === pkg.id}
                onClick={() => setSelectedPackage(pkg)}
              />
            ))}
          </div>
        )}

        {activeTab === 'language' && (
          <Card>
            <CardContent className="py-6">
              <OfferLanguagePanel
                blocks={offerBlocks}
                negotiationLevers={negotiationLevers}
                talkingPoints={talkingPoints}
              />
            </CardContent>
          </Card>
        )}

        {activeTab === 'risks' && (
          <Card>
            <CardContent className="py-6">
              <RiskFlagsPanel flags={riskFlags} />
            </CardContent>
          </Card>
        )}

        {/* Selected Package Detail */}
        {selectedPackage && activeTab === 'packages' && (
          <Card className="mt-6">
            <CardHeader>
              <h3 className="text-lg font-semibold text-slate-900">
                Selected: {selectedPackage.name}
              </h3>
            </CardHeader>
            <CardContent>
              {selectedPackage.recommendationRationale && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 mb-1">Why This Package</h4>
                  <p className="text-sm text-green-700">{selectedPackage.recommendationRationale}</p>
                </div>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-sm text-slate-500">Total Cash Comp</div>
                  <div className="text-xl font-bold text-slate-900">
                    {formatCurrency(selectedPackage.baseSalary + selectedPackage.bonusTarget)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Base: {formatCurrency(selectedPackage.baseSalary)} + Bonus: {formatCurrency(selectedPackage.bonusTarget)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Equity Grant</div>
                  <div className="text-xl font-bold text-slate-900">
                    {selectedPackage.equityOptionCount.toLocaleString()} options
                  </div>
                  <div className="text-xs text-slate-500">
                    {formatPercent(selectedPackage.equityPercentFD, 3)} FD • {selectedPackage.equityType.toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Annual Employer Cost</div>
                  <div className="text-xl font-bold text-slate-900">
                    {formatCurrency(selectedPackage.employerCostAnnual)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Incl. benefits/taxes
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-500">Pool Impact</div>
                  <div className="text-xl font-bold text-slate-900">
                    {formatPercent(selectedPackage.poolImpactPercent, 1)}
                  </div>
                  <div className="text-xs text-slate-500">
                    of remaining pool
                  </div>
                </div>
              </div>

              {selectedPackage.expectedValueBand && (
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <h4 className="text-sm font-medium text-slate-900 mb-3">Expected Equity Value (Illustrative)</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-slate-500">
                        <span>Low: {formatCurrency(selectedPackage.expectedValueBand.low)}</span>
                        <span>Base: {formatCurrency(selectedPackage.expectedValueBand.base)}</span>
                        <span>High: {formatCurrency(selectedPackage.expectedValueBand.high)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Based on stage-typical exit scenarios. Not a guarantee of value.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center text-xs text-slate-500">
          <p>
            This tool provides general guidance for compensation structuring.
            It does not constitute legal, tax, or financial advice.
            Consult with qualified professionals before making employment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
