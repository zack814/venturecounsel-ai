'use client';

import { useState } from 'react';
import { IntakeContext } from '@/lib/types';
import { extractTextFromFile } from '@/lib/utils/document-parser';

interface IntakeFormProps {
  onSubmit: (termSheetText: string, context: IntakeContext) => void;
  isLoading: boolean;
}

export default function IntakeForm({ onSubmit, isLoading }: IntakeFormProps) {
  const [termSheetText, setTermSheetText] = useState('');
  const [context, setContext] = useState<IntakeContext>({
    stage: 'seed',
    investorType: 'institutional-vc',
    geography: 'silicon-valley',
    dealType: 'priced-equity',
    competitiveProcess: 'some',
    hasLeadInvestor: true,
  });
  const [isProcessingFile, setIsProcessingFile] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (termSheetText.trim()) {
      onSubmit(termSheetText, context);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      const text = await extractTextFromFile(file);
      setTermSheetText(text);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsProcessingFile(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    try {
      const text = await extractTextFromFile(file);
      setTermSheetText(text);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to process file');
    } finally {
      setIsProcessingFile(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8">
        {/* Term Sheet Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="termSheet" className="block text-sm font-semibold text-slate-900">
              Paste or Upload Your Term Sheet
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".txt,.pdf,text/plain,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isLoading || isProcessingFile}
              />
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {isProcessingFile ? 'Processing...' : 'Upload File'}
              </span>
            </label>
          </div>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative"
          >
            <textarea
              id="termSheet"
              value={termSheetText}
              onChange={(e) => setTermSheetText(e.target.value)}
              placeholder="Paste the full text of your term sheet here, or drag and drop a file..."
              className="w-full h-64 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-900 resize-none font-mono text-sm"
              required
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {termSheetText.length.toLocaleString()} characters (max 50,000) • Supports PDF, TXT files
          </p>
        </div>

        {/* Context Fields */}
        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {/* Stage */}
          <div>
            <label htmlFor="stage" className="block text-sm font-semibold text-slate-900 mb-2">
              Funding Stage *
            </label>
            <select
              id="stage"
              value={context.stage}
              onChange={(e) => setContext({ ...context, stage: e.target.value as IntakeContext['stage'] })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b-plus">Series B+</option>
            </select>
          </div>

          {/* Investor Type */}
          <div>
            <label htmlFor="investorType" className="block text-sm font-semibold text-slate-900 mb-2">
              Investor Type *
            </label>
            <select
              id="investorType"
              value={context.investorType}
              onChange={(e) => setContext({ ...context, investorType: e.target.value as IntakeContext['investorType'] })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="institutional-vc">Institutional VC</option>
              <option value="angel">Angel Investor</option>
              <option value="strategic">Strategic Investor</option>
              <option value="crypto-native">Crypto-Native</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Geography */}
          <div>
            <label htmlFor="geography" className="block text-sm font-semibold text-slate-900 mb-2">
              Market / Geography *
            </label>
            <select
              id="geography"
              value={context.geography}
              onChange={(e) => setContext({ ...context, geography: e.target.value as IntakeContext['geography'] })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="silicon-valley">Silicon Valley</option>
              <option value="nyc">New York City</option>
              <option value="europe">Europe</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Deal Type */}
          <div>
            <label htmlFor="dealType" className="block text-sm font-semibold text-slate-900 mb-2">
              Deal Type *
            </label>
            <select
              id="dealType"
              value={context.dealType}
              onChange={(e) => setContext({ ...context, dealType: e.target.value as IntakeContext['dealType'] })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="safe">SAFE</option>
              <option value="convertible-note">Convertible Note</option>
              <option value="priced-equity">Priced Equity</option>
              <option value="token-warrant">Token Warrant</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Competitive Process */}
          <div>
            <label htmlFor="competitive" className="block text-sm font-semibold text-slate-900 mb-2">
              Competitive Process
            </label>
            <select
              id="competitive"
              value={context.competitiveProcess || 'some'}
              onChange={(e) => setContext({ ...context, competitiveProcess: e.target.value as IntakeContext['competitiveProcess'] })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="none">No other investors</option>
              <option value="some">Some interest</option>
              <option value="hot">Competitive / Hot deal</option>
            </select>
          </div>

          {/* Lead Investor */}
          <div>
            <label htmlFor="hasLead" className="block text-sm font-semibold text-slate-900 mb-2">
              Lead Investor
            </label>
            <select
              id="hasLead"
              value={context.hasLeadInvestor ? 'yes' : 'no'}
              onChange={(e) => setContext({ ...context, hasLeadInvestor: e.target.value === 'yes' })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              disabled={isLoading}
            >
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || !termSheetText.trim()}
          className="w-full bg-blue-900 hover:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-colors shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Term Sheet...
            </>
          ) : (
            <>
              Analyze My Term Sheet
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Analysis typically takes 30-90 seconds. You have 5 free analyses per day.
        </p>
      </div>
    </form>
  );
}
