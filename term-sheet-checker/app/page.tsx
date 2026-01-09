'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SocialProof from '@/components/SocialProof';
import EmailCapture from '@/components/EmailCapture';
import DemoPreview from '@/components/DemoPreview';
import UsageCounter from '@/components/UsageCounter';
import PremiumWaitlist from '@/components/PremiumWaitlist';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main className="hero-gradient subtle-grid pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full mb-6 shadow-sm">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              <span className="text-navy-800 font-medium text-sm">Free AI-powered legal tools for founders</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight mb-6 leading-[1.1]">
              Legal AI that gives you{' '}
              <span className="gradient-text">real answers, fast</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Make smarter decisions on term sheets, compensation packages, and contracts with market-calibrated, context-sensitive analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link
                href="#tools"
                className="px-8 py-4 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all shadow-lg hover:shadow-xl"
              >
                Try It Free
              </Link>
              <Link
                href="/compare"
                className="px-8 py-4 bg-white text-navy-900 font-semibold rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Usage Counter */}
          <div className="flex justify-center mb-16">
            <UsageCounter variant="compact" />
          </div>

          {/* Tools Grid */}
          <div id="tools" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20 scroll-mt-24">
            {/* Term Sheet Checker Card */}
            <Link href="/term-sheet" className="group card-hover">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 h-full shadow-sm hover:shadow-lg hover:border-blue-200 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 font-semibold text-xs uppercase tracking-wide rounded-md mb-3">Term Sheet</span>
                <h2 className="text-lg font-bold text-navy-900 mb-2">
                  Term Sheet Checker
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Instant assessment of what&apos;s market vs aggressive.
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm">
                  Analyze now
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* SAFE Generator Card */}
            <Link href="/safe-generator" className="group card-hover">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 h-full shadow-sm hover:shadow-lg hover:border-amber-200 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="inline-block px-2.5 py-1 bg-amber-50 text-amber-700 font-semibold text-xs uppercase tracking-wide rounded-md mb-3">SAFE</span>
                <h2 className="text-lg font-bold text-navy-900 mb-2">
                  SAFE Generator
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Create market-standard SAFEs with side letters.
                </p>
                <div className="flex items-center text-amber-600 font-medium text-sm">
                  Generate SAFE
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Comp Optimizer Card */}
            <Link href="/comp-optimizer" className="group card-hover">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 h-full shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold text-xs uppercase tracking-wide rounded-md mb-3">Compensation</span>
                <h2 className="text-lg font-bold text-navy-900 mb-2">
                  Comp Optimizer
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  Build offers with quantified salary/equity tradeoffs.
                </p>
                <div className="flex items-center text-emerald-600 font-medium text-sm">
                  Build offer
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Contract Review GPT Card */}
            <Link href="/contract-review" className="group card-hover">
              <div className="bg-white border border-gray-200/80 rounded-2xl p-6 h-full shadow-sm hover:shadow-lg hover:border-violet-200 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-violet-50 rounded-xl flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <svg className="w-6 h-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <span className="inline-block px-2.5 py-1 bg-violet-50 text-violet-700 font-semibold text-xs uppercase tracking-wide rounded-md mb-3">Contracts</span>
                <h2 className="text-lg font-bold text-navy-900 mb-2">
                  Contract Review
                </h2>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  AI analysis with risk flags and plain-English explanations.
                </p>
                <div className="flex items-center text-violet-600 font-medium text-sm">
                  Review contract
                  <svg className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Demo Preview Section */}
          <DemoPreview className="mb-20" />

          {/* Social Proof - Full */}
          <SocialProof variant="full" />

          {/* Comparison CTA */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 mb-16 border border-gray-200 shadow-sm">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <span className="inline-block px-3 py-1 bg-teal-50 text-teal-700 font-semibold text-xs uppercase tracking-wide rounded-md mb-4">Save Time & Money</span>
                <h2 className="text-2xl font-bold text-navy-900 mb-4">
                  Not a replacement for lawyers—a preparation tool
                </h2>
                <p className="text-gray-600 mb-6">
                  We help you understand your documents and prepare for conversations with legal counsel. Know what questions to ask before you spend $500/hour.
                </p>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 text-teal-600 font-semibold hover:text-teal-700"
                >
                  See how we compare
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Traditional legal review</span>
                    <span className="font-semibold text-gray-900">$2,000-5,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time to results</span>
                    <span className="font-semibold text-gray-900">3-5 days</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-medium">VentureCounsel.AI</span>
                    <span className="font-bold text-teal-600">Free to start</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-teal-600 font-medium">Time to results</span>
                    <span className="font-bold text-teal-600">&lt; 2 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Capture */}
          <div className="max-w-2xl mx-auto mb-16">
            <EmailCapture
              title="Get the Free Term Sheet Checklist"
              description="20 critical clauses to review before signing any term sheet."
              buttonText="Send Me the Checklist"
              leadMagnet="term-sheet-checklist"
              sourcePage="/"
            />
          </div>

          {/* Premium Waitlist */}
          <div className="max-w-2xl mx-auto mb-16">
            <PremiumWaitlist />
          </div>

          {/* Partnership CTA */}
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-12 text-white mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                  <span className="text-white font-semibold text-xs uppercase tracking-wide">For Partners</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Accelerators, VCs & Law Firms
                </h2>
                <p className="text-gray-300 mb-6">
                  Give your portfolio companies and clients access to VentureCounsel.AI. Custom programs for accelerators, VC funds, and startup law practices.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Accelerators</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">VC Funds</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Law Firms</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Startup Platforms</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <Link
                  href="/partners"
                  className="inline-block px-8 py-4 bg-white text-navy-900 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Explore Partnerships
                </Link>
              </div>
            </div>
          </div>

          {/* Blog/Resources Preview */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-navy-900">Latest from the Knowledge Base</h2>
              <Link href="/blog" className="text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  slug: 'how-to-read-term-sheet-15-minutes',
                  title: 'How to Read a Term Sheet in 15 Minutes',
                  category: 'Fundraising Basics',
                  readTime: '15 min'
                },
                {
                  slug: 'safe-vs-convertible-note-2024',
                  title: 'SAFE vs. Convertible Note: What Founders Actually Need to Know',
                  category: 'Fundraising Basics',
                  readTime: '12 min'
                },
                {
                  slug: 'liquidation-preferences-explained',
                  title: 'Liquidation Preferences: The Silent Equity Killer',
                  category: 'Term Sheet Deep Dives',
                  readTime: '11 min'
                }
              ].map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block card-hover">
                  <article className="bg-white border border-gray-200 rounded-xl p-6 h-full shadow-sm hover:shadow-lg transition-shadow">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded mb-3 inline-block">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-navy-900 mb-3 group-hover:text-teal-600 transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-gray-400 text-sm">{post.readTime} read</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">Ready to understand your term sheet?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Get instant, market-calibrated analysis of your term sheet. Free to try.
            </p>
            <Link
              href="/term-sheet"
              className="inline-block px-8 py-4 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all shadow-lg hover:shadow-xl"
            >
              Check Your Term Sheet — Free
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
