'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for exploring our tools and occasional use.',
    features: [
      '3 term sheet analyses per month',
      '3 comp package generations per month',
      'Basic contract review',
      'Email support',
      'Access to educational content'
    ],
    limitations: [
      'No PDF export',
      'Standard processing speed',
      'No priority support'
    ],
    cta: 'Get Started Free',
    ctaLink: '/term-sheet',
    highlight: false,
    color: 'slate'
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/month',
    description: 'For founders actively raising or hiring.',
    features: [
      'Unlimited term sheet analyses',
      'Unlimited comp packages',
      'Advanced contract review with redlines',
      'PDF export for all reports',
      'Priority processing (2x faster)',
      'Priority email support',
      'Negotiation script generator',
      'Side letter analysis'
    ],
    limitations: [],
    cta: 'Start Pro Trial',
    ctaLink: '/signup?plan=pro',
    highlight: true,
    color: 'blue',
    badge: 'Most Popular'
  },
  {
    name: 'Team',
    price: '$199',
    period: '/month',
    description: 'For startups with multiple co-founders or advisors.',
    features: [
      'Everything in Pro',
      'Up to 5 team members',
      'Shared analysis history',
      'Team collaboration features',
      'Custom branding on exports',
      'API access (1,000 calls/mo)',
      'Dedicated account manager',
      'Quarterly strategy call'
    ],
    limitations: [],
    cta: 'Contact Sales',
    ctaLink: 'mailto:sales@venturecounsel.ai?subject=Team%20Plan%20Inquiry',
    highlight: false,
    color: 'green'
  }
];

const faqItems = [
  {
    question: 'Can I switch plans at any time?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, your current plan continues until the end of your billing period.'
  },
  {
    question: 'Is there a free trial for Pro?',
    answer: 'Yes, Pro comes with a 14-day free trial. No credit card required to start. You\'ll only be charged if you decide to continue after the trial.'
  },
  {
    question: 'What happens to my data if I cancel?',
    answer: 'Your analysis history is retained for 30 days after cancellation. You can export your data at any time, and we\'ll send a reminder before permanent deletion.'
  },
  {
    question: 'Do you offer discounts for accelerator companies?',
    answer: 'Yes! If you\'re part of Y Combinator, Techstars, or other recognized accelerators, you get 6 months of Pro free. Contact us with proof of participation.'
  },
  {
    question: 'Is my document data secure?',
    answer: 'Absolutely. We use bank-level encryption (AES-256), never train AI models on your documents, and automatically delete uploaded files after processing. See our Privacy Policy for details.'
  },
  {
    question: 'What if I need more than 5 team members?',
    answer: 'Contact us for Enterprise pricing. We offer custom plans for law firms, accelerators, and larger teams with volume discounts and additional features.'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Start free and scale as you grow. No hidden fees, no long-term contracts.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.highlight
                    ? 'border-2 border-teal-500 shadow-xl'
                    : 'border border-gray-200'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-teal-500 text-white text-sm font-semibold rounded-full">
                      {plan.badge}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-navy-900 mb-2">{plan.name}</h2>
                  <div className="flex items-baseline justify-center gap-1 mb-3">
                    <span className="text-4xl font-extrabold text-navy-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${
                          plan.color === 'blue' ? 'text-teal-500' :
                          plan.color === 'green' ? 'text-green-500' :
                          'text-gray-400'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-3 opacity-50">
                      <svg className="w-5 h-5 flex-shrink-0 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-gray-500 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 px-4 text-center font-semibold rounded-lg transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-navy-800 to-navy-900 text-white hover:from-navy-700 hover:to-navy-800'
                      : 'bg-gray-100 text-navy-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise Section */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-3xl p-8 sm:p-12 text-white mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-6">
                  <span className="text-white font-semibold text-xs uppercase tracking-wide">Enterprise</span>
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Custom Solutions for Law Firms & Accelerators
                </h2>
                <p className="text-gray-300 mb-6">
                  White-label our tools, integrate via API, or get custom features built for your specific needs. Perfect for law firms advising startups, accelerator programs, and VC portfolio support.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    White-label branding
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited API access
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Custom integrations
                  </li>
                  <li className="flex items-center gap-2 text-gray-300">
                    <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated support & SLA
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <Link
                  href="mailto:enterprise@venturecounsel.ai?subject=Enterprise%20Inquiry"
                  className="inline-block px-8 py-4 bg-white text-navy-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Talk to Sales
                </Link>
                <p className="text-gray-400 text-sm mt-4">
                  Typical response within 24 hours
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Everything you need to know about our pricing and plans.
              </p>
            </div>

            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.question} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-navy-900 mb-2">{item.question}</h3>
                  <p className="text-gray-600 text-sm">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Join 2,500+ founders who trust VentureCounsel.AI for their startup legal needs.
            </p>
            <Link
              href="/term-sheet"
              className="inline-block px-8 py-4 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all"
            >
              Start Free Today
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
