'use client';

import { AssumptionsAndConfidence } from '@/lib/types';

interface AssumptionsSectionProps {
  data: AssumptionsAndConfidence;
}

export default function AssumptionsSection({ data }: AssumptionsSectionProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-700 bg-red-100';
      case 'medium':
        return 'text-yellow-700 bg-yellow-100';
      case 'low':
        return 'text-green-700 bg-green-100';
      default:
        return 'text-slate-700 bg-slate-100';
    }
  };

  const confidencePercentage = Math.round(data.overallConfidence * 100);
  const confidenceColor = confidencePercentage >= 80 ? 'text-green-700' :
                          confidencePercentage >= 60 ? 'text-yellow-700' :
                          'text-red-700';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 mb-6">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">5. Assumptions & Confidence</h2>

      {/* Overall Confidence */}
      <div className="mb-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-slate-900">Overall Confidence</h3>
          <span className={`text-2xl font-bold ${confidenceColor}`}>
            {confidencePercentage}%
          </span>
        </div>
        <div className="bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              confidencePercentage >= 80 ? 'bg-green-500' :
              confidencePercentage >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${confidencePercentage}%` }}
          />
        </div>
        <p className="text-sm text-slate-600 mt-2">
          {confidencePercentage >= 80 ? 'High confidence in this analysis based on strong market data and clear term structure.' :
           confidencePercentage >= 60 ? 'Moderate confidence. Some terms may require additional verification with counsel.' :
           'Lower confidence due to unusual terms or limited market data. Strongly recommend counsel review.'}
        </p>
      </div>

      {/* Assumptions Made */}
      {data.assumptions && data.assumptions.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Assumptions Made</h3>
          <p className="text-sm text-slate-600 mb-3">
            These assumptions were made due to limited information. Results may vary if these assumptions don't hold.
          </p>
          <div className="space-y-2">
            {data.assumptions.map((assumption, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
                <div className="flex-1">
                  <p className="text-sm text-slate-900">{assumption.assumption}</p>
                  <div className="mt-1">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${getImpactColor(assumption.impact)}`}>
                      {assumption.impact.toUpperCase()} IMPACT
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Low Confidence Areas */}
      {data.lowConfidenceAreas && data.lowConfidenceAreas.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">Areas Requiring Additional Verification</h3>
          <p className="text-sm text-slate-600 mb-3">
            These areas have lower confidence and should be verified with legal counsel:
          </p>
          <div className="space-y-3">
            {data.lowConfidenceAreas.map((area, idx) => (
              <div key={idx} className="p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r">
                <p className="font-semibold text-orange-900 mb-1">{area.area}</p>
                <p className="text-sm text-orange-800 mb-2"><strong>Reason:</strong> {area.reason}</p>
                <p className="text-sm text-orange-800"><strong>Recommendation:</strong> {area.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-slate-100 border border-slate-300 rounded-lg">
        <p className="text-xs text-slate-700 leading-relaxed">
          <strong>Important:</strong> This analysis is based on market data from 2024-2025 and standard venture financing practices.
          Individual circumstances vary. This tool provides informational analysis and does not constitute legal advice.
          Always consult with qualified legal counsel before signing any binding agreements.
        </p>
      </div>
    </div>
  );
}
