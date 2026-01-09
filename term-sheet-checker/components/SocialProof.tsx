'use client';

const features = [
  { value: 'Free', label: 'To get started' },
  { value: '< 2 min', label: 'Time to results' },
  { value: '24/7', label: 'Always available' },
  { value: 'AI', label: 'Market-calibrated' }
];

interface SocialProofProps {
  variant?: 'full' | 'compact' | 'metrics-only' | 'logos-only';
  className?: string;
}

export default function SocialProof({ variant = 'full', className = '' }: SocialProofProps) {
  if (variant === 'metrics-only') {
    return (
      <div className={`py-8 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div key={feature.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 mb-1">{feature.value}</p>
              <p className="text-slate-600 text-sm">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'logos-only') {
    return (
      <div className={`py-8 ${className}`}>
        <p className="text-center text-slate-500 text-sm mb-6">
          Designed for founders raising from top-tier investors
        </p>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-sm">Seed Stage</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-sm">Series A</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-sm">SAFE Notes</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-500 text-sm">Priced Rounds</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`py-12 ${className}`}>
        {/* Features */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {features.map((feature) => (
            <div key={feature.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{feature.value}</p>
              <p className="text-slate-500 text-sm">{feature.label}</p>
            </div>
          ))}
        </div>

        {/* Value Prop */}
        <div className="bg-slate-50 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <svg className="w-8 h-8 text-blue-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            Get instant, market-calibrated analysis of your term sheet. Understand what&apos;s standard, what&apos;s aggressive, and what to negotiate.
          </p>
          <p className="font-semibold text-slate-900">No signup required to try</p>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`py-16 ${className}`}>
      {/* Features */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Why Founders Use VentureCounsel.AI</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {features.map((feature) => (
            <div key={feature.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-teal-600 mb-1">{feature.value}</p>
              <p className="text-slate-600 text-sm">{feature.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="mb-16">
        <p className="text-center text-slate-500 text-sm mb-6">
          Built for founders at every stage
        </p>
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 text-sm">Pre-Seed & Seed</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 text-sm">Series A</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 text-sm">SAFE Notes</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 text-sm">Convertible Notes</span>
          </div>
          <div className="px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
            <span className="text-slate-600 text-sm">Priced Rounds</span>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="mb-16">
        <h3 className="text-xl font-bold text-slate-900 text-center mb-8">What You Get</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Market Benchmarking</h4>
            <p className="text-slate-600 text-sm">
              Know how your terms compare to Silicon Valley standards for your stage and investor type.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Red Flag Detection</h4>
            <p className="text-slate-600 text-sm">
              Automatic identification of aggressive or unusual terms that warrant closer attention.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="font-semibold text-slate-900 mb-2">Negotiation Guidance</h4>
            <p className="text-slate-600 text-sm">
              Specific talking points and suggested language for negotiating better terms.
            </p>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-slate-50 rounded-2xl p-6 text-center">
        <p className="text-sm text-slate-600">
          <strong className="text-slate-900">Note:</strong> VentureCounsel.AI is an educational tool, not legal advice.
          Always consult with a qualified attorney before signing any legal documents.
        </p>
      </div>
    </div>
  );
}
