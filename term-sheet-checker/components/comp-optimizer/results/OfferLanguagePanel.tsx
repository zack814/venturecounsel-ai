'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/comp-optimizer/ui/Button';
import type { OfferLanguageBlock, NegotiationLever } from '@/lib/comp-schemas';

interface OfferLanguagePanelProps {
  blocks: OfferLanguageBlock[];
  negotiationLevers: NegotiationLever[];
  talkingPoints: string[];
}

export function OfferLanguagePanel({
  blocks,
  negotiationLevers,
  talkingPoints,
}: OfferLanguagePanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Offer Language Blocks</h3>
        <p className="text-sm text-slate-600 mb-4">
          Copy these blocks directly into your offer letter. Customize as needed.
        </p>

        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border-b border-slate-200">
                <h4 className="font-medium text-slate-900">{block.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy(block.content, block.id)}
                >
                  {copiedId === block.id ? (
                    <>
                      <svg className="w-4 h-4 mr-1 text-green-500\" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <div className="p-4 bg-white">
                <pre className="text-sm text-slate-700 whitespace-pre-wrap font-sans">
                  {block.content}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Negotiation Levers</h3>
        <p className="text-sm text-slate-600 mb-4">
          Use these when the candidate wants to negotiate. Know what you can trade.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lever</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Direction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Impact</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Suggested Trade</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {negotiationLevers.map((lever, index) => (
                <tr key={index}>
                  <td className="px-4 py-3 text-sm font-medium text-slate-900">{lever.lever}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded-full text-xs font-medium',
                        lever.direction === 'increase'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      )}
                    >
                      {lever.direction === 'increase' ? '↑' : '↓'} {lever.direction}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lever.impact}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{lever.suggestedTrade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Talking Points</h3>
        <p className="text-sm text-slate-600 mb-4">
          Use these to explain your offer structure to the candidate.
        </p>

        <ul className="space-y-3">
          {talkingPoints.map((point, index) => (
            <li key={index} className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                {index + 1}
              </span>
              <p className="text-sm text-slate-700">{point}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
