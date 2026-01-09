'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight mb-6">
              Built for Founders,<br />by Someone Who Gets It
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              VentureCounsel.AI combines practical startup experience with cutting-edge AI to democratize access to startup legal knowledge.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-br from-teal-50 to-navy-50 rounded-3xl p-8 sm:p-12 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 border border-teal-200 rounded-full mb-6">
                <span className="text-teal-900 font-semibold text-xs uppercase tracking-wide">Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-6">
                Level the playing field for first-time founders
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Experienced founders and well-funded startups have armies of lawyers. First-time founders often sign whatever investors put in front of them—not because they&apos;re naive, but because they can&apos;t afford $50,000 in legal fees to understand what&apos;s market vs. what&apos;s aggressive.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We built VentureCounsel.AI to give every founder the context they need to have informed conversations with their lawyers and make better decisions about their companies.
              </p>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">What We Do</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                AI-powered tools to help founders understand and navigate startup legal documents.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Term Sheet Analysis</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Upload a term sheet and get instant analysis of what&apos;s market-standard vs. aggressive, with specific recommendations.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">SAFE Generation</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Generate market-standard SAFE documents with optional side letters, customized to your specific deal terms.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow card-hover">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">Comp Optimization</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Build competitive compensation packages with quantified salary/equity tradeoffs for startup hiring.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Transparency First</h4>
                  <p className="text-gray-300 text-sm">We&apos;re clear about what we can and can&apos;t do. AI isn&apos;t a replacement for legal counsel.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Founder Empathy</h4>
                  <p className="text-gray-300 text-sm">We build tools we&apos;d want to use ourselves as founders navigating fundraising.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-white">Democratize Access</h4>
                  <p className="text-gray-300 text-sm">Legal knowledge shouldn&apos;t be gatekept by ability to pay $1,000/hour.</p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Try our tools for free and see how VentureCounsel.AI can help you navigate your next funding round.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/term-sheet"
                className="px-6 py-3 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all"
              >
                Check Your Term Sheet
              </Link>
              <Link
                href="mailto:hello@venturecounsel.ai"
                className="px-6 py-3 bg-gray-100 text-navy-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
