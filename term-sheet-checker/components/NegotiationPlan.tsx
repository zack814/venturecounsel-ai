'use client';

import { NegotiationPlan as NegotiationPlanType } from '@/lib/types';

interface NegotiationPlanProps {
  plan: NegotiationPlanType;
}

export default function NegotiationPlan({ plan }: NegotiationPlanProps) {
  const getTimingColor = (timing: string) => {
    switch (timing) {
      case 'raise-immediately':
        return 'bg-red-100 text-red-900 border-red-300';
      case 'raise-early':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300';
      case 'raise-late':
        return 'bg-blue-100 text-blue-900 border-blue-300';
      case 'hold-for-leverage':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      default:
        return 'bg-slate-100 text-slate-900 border-slate-300';
    }
  };

  const getLeverageColor = (leverage: string) => {
    switch (leverage) {
      case 'high':
        return 'text-green-700 bg-green-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">3. Negotiation Plan</h2>

      {/* Leverage Analysis */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Your Leverage Assessment</h3>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm font-semibold text-slate-700">Estimated Leverage:</span>
          <span className={`px-4 py-1.5 rounded-full font-bold ${getLeverageColor(plan.leverageAnalysis.estimatedLeverage)}`}>
            {plan.leverageAnalysis.estimatedLeverage.toUpperCase()}
          </span>
        </div>

        <div className="mb-4">
          <p className="font-semibold text-slate-900 mb-2">Key Leverage Factors:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
            {plan.leverageAnalysis.leverageFactors.map((factor, idx) => (
              <li key={idx}>{factor}</li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-900 mb-2">Tactical Recommendations:</p>
          <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
            {plan.leverageAnalysis.tacticalRecommendations.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sequencing */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-3">Negotiation Sequencing</h3>
        <p className="text-sm text-slate-600 mb-4">What to raise when (in priority order):</p>
        <div className="space-y-3">
          {plan.sequencing.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white border border-slate-200 rounded-lg">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-900 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {item.priority}
              </span>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-semibold text-slate-900">{item.termType}</p>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTimingColor(item.timing)}`}>
                    {item.timing.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{item.rationale}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Trades */}
      {plan.suggestedTrades && plan.suggestedTrades.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Suggested Trades</h3>
          <p className="text-sm text-slate-600 mb-4">If you concede X, ask for Y:</p>
          <div className="space-y-3">
            {plan.suggestedTrades.map((trade, idx) => (
              <div key={idx} className="p-4 bg-blue-50 border-l-4 border-blue-900 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2 text-sm">
                  <span className="font-semibold text-red-700">Give:</span>
                  <span className="text-slate-900">{trade.giveTerm}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-semibold text-green-700">Get:</span>
                  <span className="text-slate-900">{trade.getTerm}</span>
                </div>
                <p className="text-sm text-slate-700 italic">{trade.rationale}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
