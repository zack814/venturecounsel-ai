'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/comp-optimizer/ui/Button';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/comp-optimizer/ui/Card';
import {
  generateSafeDocument,
  generateSideLetter,
  generateDocumentSummary,
  SafeDocumentData,
} from '@/lib/safe-templates';
import { SAFE_TYPE_INFO, formatUSD, formatValuation, SIDE_LETTER_OPTIONS } from '@/lib/safe-types';
import type { SafeWizardState } from '@/lib/safe-types';

function DocumentPreview({
  title,
  content,
  onDownload,
}: {
  title: string;
  content: string;
  onDownload: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-xs text-slate-500">Plain text document</p>
            </div>
          </div>
          <Button onClick={onDownload} size="sm" className="bg-amber-600 hover:bg-amber-700">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative">
          <pre className={`p-4 text-xs font-mono text-slate-700 bg-white overflow-x-auto ${isExpanded ? '' : 'max-h-64 overflow-hidden'}`}>
            {content}
          </pre>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
      </CardContent>
      <CardFooter className="bg-slate-50 border-t border-slate-100">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1"
        >
          {isExpanded ? 'Show less' : 'Show full document'}
          <svg
            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </CardFooter>
    </Card>
  );
}

function SummaryCard({
  summary,
}: {
  summary: ReturnType<typeof generateDocumentSummary>;
}) {
  return (
    <Card>
      <CardHeader className="bg-amber-50 border-b border-amber-100">
        <h3 className="font-semibold text-amber-900">Investment Summary</h3>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Terms */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Key Terms</h4>
          <div className="space-y-2">
            {summary.keyTerms.map((term, idx) => (
              <div key={idx} className="flex justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{term.label}</span>
                <span className="text-sm font-medium text-slate-900">{term.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Investor Ownership */}
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <h4 className="font-semibold text-green-900 text-sm">Investor Ownership</h4>
          </div>
          <p className="text-lg font-bold text-green-900">{summary.investorOwnership}</p>
        </div>

        {/* Warnings */}
        {summary.warnings.length > 0 && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h4 className="font-semibold text-amber-900 text-sm">Warnings</h4>
            </div>
            <ul className="space-y-1">
              {summary.warnings.map((warning, idx) => (
                <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                  <span className="text-amber-500 mt-1">•</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Next Steps */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Next Steps</h4>
          <ol className="space-y-2">
            {summary.nextSteps.map((step, idx) => (
              <li key={idx} className="text-sm text-slate-600 flex items-start gap-3">
                <span className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600 flex-shrink-0">
                  {idx + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SafeGeneratorResultsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [safeDocument, setSafeDocument] = useState<string>('');
  const [sideLetter, setSideLetter] = useState<string | null>(null);
  const [summary, setSummary] = useState<ReturnType<typeof generateDocumentSummary> | null>(null);
  const [wizardState, setWizardState] = useState<SafeWizardState | null>(null);

  useEffect(() => {
    // Get the wizard state from sessionStorage
    const stateJson = sessionStorage.getItem('safe-generator-input');
    if (!stateJson) {
      // No state found, redirect back to wizard
      router.push('/safe-generator');
      return;
    }

    try {
      const state: SafeWizardState = JSON.parse(stateJson);
      setWizardState(state);

      // Create document data
      const docData: SafeDocumentData = {
        safeType: state.safeType,
        terms: state.safeTerms,
        company: state.companyInfo,
        investor: state.investorInfo,
        sideLetters: state.sideLetters,
      };

      // Generate documents
      const safe = generateSafeDocument(docData);
      const sideLetterDoc = generateSideLetter(docData);
      const summaryData = generateDocumentSummary(docData);

      setSafeDocument(safe);
      setSideLetter(sideLetterDoc);
      setSummary(summaryData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating documents:', error);
      router.push('/safe-generator');
    }
  }, [router]);

  const downloadDocument = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    const companyName = wizardState?.companyInfo.legalName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Company';
    const date = new Date().toISOString().split('T')[0];

    downloadDocument(safeDocument, `SAFE_${companyName}_${date}.txt`);
    if (sideLetter) {
      setTimeout(() => {
        downloadDocument(sideLetter, `SideLetter_${companyName}_${date}.txt`);
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navigation />
        <main className="pt-24 pb-16 px-4 sm:px-6 flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Generating your documents...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const safeTypeInfo = wizardState ? SAFE_TYPE_INFO[wizardState.safeType] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Link
                href="/safe-generator"
                className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Generator
              </Link>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-3">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-green-900 font-semibold text-xs uppercase tracking-wide">Documents Generated</span>
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                  Your SAFE Documents
                </h1>
                <p className="text-slate-600">
                  Download your generated documents below. Review them carefully before signing.
                </p>
              </div>
              <Button
                onClick={downloadAll}
                size="lg"
                className="bg-amber-600 hover:bg-amber-700 hidden sm:flex"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Documents Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* SAFE Document */}
              <DocumentPreview
                title={safeTypeInfo?.name || 'SAFE Agreement'}
                content={safeDocument}
                onDownload={() => {
                  const companyName = wizardState?.companyInfo.legalName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Company';
                  const date = new Date().toISOString().split('T')[0];
                  downloadDocument(safeDocument, `SAFE_${companyName}_${date}.txt`);
                }}
              />

              {/* Side Letter (if applicable) */}
              {sideLetter && (
                <DocumentPreview
                  title="Side Letter"
                  content={sideLetter}
                  onDownload={() => {
                    const companyName = wizardState?.companyInfo.legalName?.replace(/[^a-zA-Z0-9]/g, '_') || 'Company';
                    const date = new Date().toISOString().split('T')[0];
                    downloadDocument(sideLetter, `SideLetter_${companyName}_${date}.txt`);
                  }}
                />
              )}

              {/* Mobile Download All Button */}
              <div className="sm:hidden">
                <Button
                  onClick={downloadAll}
                  size="lg"
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download All Documents
                </Button>
              </div>
            </div>

            {/* Summary Column */}
            <div className="space-y-6">
              {summary && <SummaryCard summary={summary} />}

              {/* Legal Disclaimer */}
              <div className="p-4 bg-slate-900 text-slate-300 rounded-xl">
                <h4 className="font-semibold text-white text-sm mb-2">Legal Disclaimer</h4>
                <p className="text-xs leading-relaxed">
                  These documents are provided for informational purposes only and do not constitute legal advice.
                  VentureCounsel.AI is not a law firm. Before signing any securities documents, have them reviewed
                  by a qualified attorney. The use of these documents does not create an attorney-client relationship.
                </p>
              </div>

              {/* Start New */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h4 className="font-semibold text-slate-900 text-sm mb-2">Need Another SAFE?</h4>
                <p className="text-sm text-slate-600 mb-3">
                  Generate documents for a different investor with new terms.
                </p>
                <Link href="/safe-generator">
                  <Button variant="outline" size="sm" className="w-full">
                    Start New SAFE
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
