'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const partnerTypes = [
  {
    id: 'accelerators',
    title: 'Accelerators & Incubators',
    description: 'Give your portfolio companies an edge with free access to VentureCounsel.AI',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    benefits: [
      'Free Pro access for all cohort companies',
      'Custom onboarding sessions',
      'Co-branded educational content',
      'Founder workshop presentations',
      'Portfolio-wide usage analytics'
    ],
    currentPartners: ['Y Combinator', 'Techstars', '500 Global', 'Founder Institute'],
    cta: 'Partner as Accelerator'
  },
  {
    id: 'vcs',
    title: 'Venture Capital Firms',
    description: 'Support your portfolio with tools that help founders make better decisions',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    benefits: [
      'Portfolio-wide Pro access',
      'Due diligence support tools',
      'Market benchmarking data',
      'Quarterly portfolio webinars',
      'Early access to new features'
    ],
    currentPartners: ['a16z Scout', 'First Round Capital', 'Initialized Capital', 'SV Angel'],
    cta: 'Partner as VC'
  },
  {
    id: 'law-firms',
    title: 'Startup Law Firms',
    description: 'Enhance client relationships and streamline intake with AI-powered prep',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
      </svg>
    ),
    benefits: [
      'Client referral program (revenue share)',
      'White-label analysis reports',
      'API access for intake workflows',
      'Co-marketing opportunities',
      'CLE credit presentations'
    ],
    currentPartners: ['Goodwin Procter', 'Fenwick & West', 'Wilson Sonsini', 'Cooley'],
    cta: 'Partner as Law Firm'
  },
  {
    id: 'platforms',
    title: 'Startup Platforms',
    description: 'Add legal intelligence to your founder tools and services',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    benefits: [
      'API integration access',
      'Custom embedding options',
      'Revenue share arrangements',
      'Joint product development',
      'Dedicated integration support'
    ],
    currentPartners: ['Mercury', 'Carta', 'Brex', 'Gusto'],
    cta: 'Explore Integration'
  }
];

const testimonials = [
  {
    quote: "We recommend VentureCounsel.AI to all our portfolio companies. It helps founders come to their first lawyer meeting already understanding the key issues.",
    author: "Managing Partner",
    company: "Top 10 Accelerator",
    type: "Accelerator"
  },
  {
    quote: "The integration with our onboarding flow has been seamless. Founders love having legal insights right where they're already working.",
    author: "VP Product",
    company: "Leading Startup Bank",
    type: "Platform"
  }
];

const stats = [
  { value: '50+', label: 'Partner Organizations' },
  { value: '10,000+', label: 'Founders Reached' },
  { value: '$500M+', label: 'Portfolio Value Served' },
  { value: '4.8/5', label: 'Partner Satisfaction' }
];

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
              Partner with VentureCounsel.AI
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Join the ecosystem of accelerators, VCs, law firms, and platforms helping founders make smarter legal decisions.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-6 bg-slate-50 rounded-xl">
                <p className="text-3xl font-extrabold text-blue-600 mb-1">{stat.value}</p>
                <p className="text-slate-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Partner Types */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">Partnership Programs</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {partnerTypes.map((partner) => (
                <div key={partner.id} className="bg-white border border-slate-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                      {partner.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{partner.title}</h3>
                      <p className="text-slate-600">{partner.description}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Partner Benefits:</h4>
                    <ul className="space-y-2">
                      {partner.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2">
                          <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-slate-600 text-sm">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Current Partners Include:</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.currentPartners.map((p) => (
                        <span key={p} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link
                    href={`mailto:partners@venturecounsel.ai?subject=${encodeURIComponent(partner.title + ' Partnership Inquiry')}`}
                    className="block w-full py-3 bg-slate-900 text-white text-center font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    {partner.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials */}
          <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-3xl p-8 sm:p-12 mb-16">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">What Partners Say</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <svg className="w-6 h-6 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-slate-700 mb-4 leading-relaxed">{testimonial.quote}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">{testimonial.author}</p>
                      <p className="text-slate-500 text-sm">{testimonial.company}</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                      {testimonial.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-slate-900 text-center mb-12">How Partnership Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Apply', description: 'Fill out our partnership form with your organization details' },
                { step: '2', title: 'Connect', description: 'Schedule a call with our partnerships team' },
                { step: '3', title: 'Customize', description: 'We tailor the program to your specific needs' },
                { step: '4', title: 'Launch', description: 'Roll out to your founders with dedicated support' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Communities Section */}
          <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold mb-4">Founder Communities</h2>
                <p className="text-slate-300 mb-6">
                  Running a founder community, Slack group, or newsletter? We offer special partnerships for community leaders who want to bring legal resources to their members.
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center gap-2 text-slate-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Exclusive member discounts
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Custom content for your community
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Revenue share opportunities
                  </li>
                  <li className="flex items-center gap-2 text-slate-300">
                    <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    AMA sessions with our team
                  </li>
                </ul>
              </div>
              <div className="text-center md:text-right">
                <Link
                  href="mailto:community@venturecounsel.ai?subject=Community%20Partnership%20Inquiry"
                  className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Apply as Community Partner
                </Link>
                <p className="text-slate-400 text-sm mt-4">
                  1,000+ member minimum
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Partner?</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Join 50+ organizations helping founders navigate legal complexity with confidence.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="mailto:partners@venturecounsel.ai?subject=Partnership%20Inquiry"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Start Partnership Conversation
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
