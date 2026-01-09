'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const comparisonData = [
  {
    feature: 'Cost for basic analysis',
    ventureCounsel: 'Free (3/month)',
    lawyer: '$500-2,000',
    genericAI: 'Free with ChatGPT+',
    clerky: 'N/A (docs only)'
  },
  {
    feature: 'Time to results',
    ventureCounsel: '< 2 minutes',
    lawyer: '2-5 days',
    genericAI: '< 1 minute',
    clerky: 'N/A'
  },
  {
    feature: 'Market benchmarking',
    ventureCounsel: 'Yes - SV startup norms',
    lawyer: 'Depends on lawyer',
    genericAI: 'No',
    clerky: 'No'
  },
  {
    feature: 'Specific clause suggestions',
    ventureCounsel: 'Yes - redline language',
    lawyer: 'Yes',
    genericAI: 'Generic only',
    clerky: 'Template-based'
  },
  {
    feature: 'Negotiation strategy',
    ventureCounsel: 'Yes - prioritized plan',
    lawyer: 'Yes',
    genericAI: 'Basic',
    clerky: 'No'
  },
  {
    feature: 'Legal liability coverage',
    ventureCounsel: 'No',
    lawyer: 'Yes',
    genericAI: 'No',
    clerky: 'Limited'
  },
  {
    feature: 'Available 24/7',
    ventureCounsel: 'Yes',
    lawyer: 'No',
    genericAI: 'Yes',
    clerky: 'Yes'
  },
  {
    feature: 'Understands your context',
    ventureCounsel: 'Yes - stage, investor type',
    lawyer: 'Yes',
    genericAI: 'No',
    clerky: 'No'
  }
];

const whenToUse = [
  {
    scenario: 'Use VentureCounsel.AI when:',
    color: 'blue',
    items: [
      'You want to understand what\'s market vs. aggressive in your term sheet',
      'You\'re preparing for a negotiation and need talking points',
      'You want a second opinion before paying for legal review',
      'You\'re comparing multiple term sheets from different investors',
      'You need quick context at 2am before a meeting',
      'You want to educate yourself on standard VC terms'
    ]
  },
  {
    scenario: 'Hire a startup lawyer when:',
    color: 'green',
    items: [
      'You\'re finalizing and signing any legal document',
      'The deal involves complex terms or unusual structures',
      'You need legal liability protection',
      'You\'re negotiating with sophisticated investors',
      'There are side letters or special provisions',
      'You need ongoing legal counsel for your company'
    ]
  },
  {
    scenario: 'Skip generic ChatGPT when:',
    color: 'amber',
    items: [
      'You need market-calibrated benchmarks (it doesn\'t have them)',
      'You want specific, actionable redline suggestions',
      'Context matters (stage, investor type, geography)',
      'You need negotiation strategy, not just explanations',
      'Accuracy matters—generic AI often hallucinates legal details'
    ]
  }
];

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              How VentureCounsel.AI Compares
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re not trying to replace lawyers—we&apos;re trying to help you prepare for conversations with them. Here&apos;s how we stack up.
            </p>
          </div>

          {/* Comparison Table */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-16">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-900 bg-blue-50">
                      VentureCounsel.AI
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Startup Lawyer</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Generic ChatGPT</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-slate-900">Clerky/Atlas</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((row, index) => (
                    <tr key={row.feature} className={index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-6 py-4 text-sm font-medium text-slate-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-blue-900 bg-blue-50/50 font-medium">
                        {row.ventureCounsel}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">{row.lawyer}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">{row.genericAI}</td>
                      <td className="px-6 py-4 text-center text-sm text-slate-600">{row.clerky}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* When to Use Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
              Know When to Use What
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {whenToUse.map((section) => (
                <div
                  key={section.scenario}
                  className={`rounded-2xl p-6 ${
                    section.color === 'blue' ? 'bg-blue-50 border border-blue-200' :
                    section.color === 'green' ? 'bg-green-50 border border-green-200' :
                    'bg-amber-50 border border-amber-200'
                  }`}
                >
                  <h3 className={`font-bold mb-4 ${
                    section.color === 'blue' ? 'text-blue-900' :
                    section.color === 'green' ? 'text-green-900' :
                    'text-amber-900'
                  }`}>
                    {section.scenario}
                  </h3>
                  <ul className="space-y-3">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <svg
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            section.color === 'blue' ? 'text-blue-500' :
                            section.color === 'green' ? 'text-green-500' :
                            'text-amber-500'
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-700 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Comparison Sections */}
          <div className="space-y-12 mb-16">
            {/* vs Lawyers */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                VentureCounsel.AI vs. Hiring a Startup Lawyer
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Why lawyers are still essential:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Legal liability and malpractice insurance</li>
                    <li>• Negotiating directly with investors on your behalf</li>
                    <li>• Drafting and reviewing final documents</li>
                    <li>• Complex deal structures and edge cases</li>
                    <li>• Ongoing company legal needs (IP, employment, etc.)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Where we complement lawyers:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Quick initial assessment before spending on legal fees</li>
                    <li>• Educating yourself on what questions to ask</li>
                    <li>• Understanding market norms before negotiations</li>
                    <li>• Getting a second perspective on specific terms</li>
                    <li>• 24/7 availability when you need quick answers</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-900">Our recommendation:</strong> Use VentureCounsel.AI to educate yourself and prepare, then bring a qualified startup lawyer in for final review and negotiations. The combination saves money while ensuring you&apos;re protected.
                </p>
              </div>
            </div>

            {/* vs Generic AI */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                VentureCounsel.AI vs. Generic ChatGPT
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">What generic AI gets wrong:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• No market benchmarks—can&apos;t tell you what&apos;s &quot;normal&quot;</li>
                    <li>• Often hallucinates legal details or cites fake cases</li>
                    <li>• Generic advice that doesn&apos;t consider your context</li>
                    <li>• No understanding of stage-appropriate terms</li>
                    <li>• Can&apos;t generate specific redline language</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">What we do differently:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Trained on real Silicon Valley deal data</li>
                    <li>• Context-aware: stage, investor type, geography matter</li>
                    <li>• Specific, actionable redline suggestions</li>
                    <li>• Prioritized negotiation strategies</li>
                    <li>• Built by lawyers who&apos;ve done these deals</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-sm text-amber-900">
                  <strong>Warning:</strong> We&apos;ve seen founders make costly mistakes based on generic AI advice. &quot;Standard&quot; terms vary significantly by stage, geography, and investor type. Generic AI doesn&apos;t know the difference.
                </p>
              </div>
            </div>

            {/* vs Clerky/Atlas */}
            <div className="bg-slate-50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                VentureCounsel.AI vs. Clerky & Stripe Atlas
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">What they do well:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• Incorporation and company formation</li>
                    <li>• Standard document generation (SAFEs, etc.)</li>
                    <li>• Equity management and cap tables</li>
                    <li>• Established reputation and trust</li>
                    <li>• Integration with banking and payments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Where we&apos;re different:</h4>
                  <ul className="space-y-2 text-slate-600 text-sm">
                    <li>• We analyze documents, not generate them</li>
                    <li>• Review investor-drafted terms (not just your own)</li>
                    <li>• Provide market context and benchmarking</li>
                    <li>• Negotiation strategy and talking points</li>
                    <li>• Complement their tools, don&apos;t replace them</li>
                  </ul>
                </div>
              </div>
              <div className="mt-6 p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-sm text-slate-600">
                  <strong className="text-slate-900">Use together:</strong> Form your company with Clerky/Atlas, then use VentureCounsel.AI when investors send you term sheets to understand what you&apos;re signing.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-blue-900 rounded-3xl p-8 sm:p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              See the difference for yourself
            </h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto">
              Upload a term sheet and get market-calibrated analysis in under 2 minutes. Free, no signup required.
            </p>
            <Link
              href="/term-sheet"
              className="inline-block px-8 py-4 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
