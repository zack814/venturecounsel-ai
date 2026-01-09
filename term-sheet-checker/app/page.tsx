'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SocialProof from '@/components/SocialProof';
import EmailCapture from '@/components/EmailCapture';
import DemoPreview from '@/components/DemoPreview';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-blue-900 font-medium text-sm">2,500+ founders have used our tools</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Legal AI that doesn&apos;t<br className="hidden sm:inline" /> waste your time with<br className="hidden sm:inline" /> <span className="text-blue-900 relative">generic advice</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Make smarter decisions on term sheets, compensation packages, and contracts with market-calibrated, context-sensitive analysis.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                href="#tools"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try It Now
              </Link>
              <Link
                href="/compare"
                className="px-8 py-4 bg-slate-100 text-slate-900 font-semibold rounded-lg hover:bg-slate-200 transition-colors"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Compact Social Proof - Logos */}
          <SocialProof variant="logos-only" className="mb-16" />

          {/* Tools Grid */}
          <div id="tools" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-20 scroll-mt-24">
            {/* Term Sheet Checker Card */}
            <Link href="/term-sheet" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full hover:border-blue-300 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-blue-900 font-semibold text-xs uppercase tracking-wide">Term Sheet</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Term Sheet Checker
                </h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Upload your term sheet and get an instant assessment of what&apos;s market vs aggressive.
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  Check Term Sheet
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* SAFE Generator Card */}
            <Link href="/safe-generator" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full hover:border-amber-300 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-amber-200 transition-colors">
                  <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full mb-4">
                  <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                  <span className="text-amber-900 font-semibold text-xs uppercase tracking-wide">SAFE Generator</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Generate Your SAFE
                </h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Create market-standard SAFEs based on YC templates with side letters included.
                </p>
                <div className="flex items-center text-amber-600 font-semibold text-sm">
                  Generate SAFE
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Comp Optimizer Card */}
            <Link href="/comp-optimizer" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full hover:border-green-300 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full mb-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-green-900 font-semibold text-xs uppercase tracking-wide">Comp Optimizer</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Optimize Compensation
                </h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Generate compensation packages with quantified tradeoffs for salary and equity.
                </p>
                <div className="flex items-center text-green-600 font-semibold text-sm">
                  Build Offer
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>

            {/* Contract Review GPT Card */}
            <Link href="/contract-review" className="group">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 h-full hover:border-purple-300 hover:shadow-lg transition-all duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-5 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full mb-4">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span className="text-purple-900 font-semibold text-xs uppercase tracking-wide">Contract Review</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  AI Contract Review
                </h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Get instant analysis with risk flags and plain-English explanations.
                </p>
                <div className="flex items-center text-purple-600 font-semibold text-sm">
                  Review Contract
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

          {/* Features Section */}
          <div className="mt-20 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Founders Choose VentureCounsel.AI</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Built by a team that&apos;s been on both sides of the table—as founders raising capital and lawyers drafting the documents.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Market Calibrated</h3>
                <p className="text-slate-600">Benchmarked against real Silicon Valley startup data across stages, geographies, and investor types.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Instant Results</h3>
                <p className="text-slate-600">Get actionable insights in under 2 minutes, not days of expensive legal review.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-lg">Risk Flagging</h3>
                <p className="text-slate-600">Automatic detection of aggressive terms, compliance issues, and negotiation red flags.</p>
              </div>
            </div>
          </div>

          {/* Comparison CTA */}
          <div className="bg-slate-50 rounded-3xl p-8 sm:p-12 mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Not a replacement for lawyers—a preparation tool
                </h2>
                <p className="text-slate-600 mb-6">
                  We help you understand your documents and prepare for conversations with legal counsel. Know what questions to ask before you spend $500/hour.
                </p>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
                >
                  See how we compare
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
              <div className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Traditional legal review</span>
                    <span className="font-semibold text-slate-900">$2,000-5,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Time to results</span>
                    <span className="font-semibold text-slate-900">3-5 days</span>
                  </div>
                  <hr className="border-slate-200" />
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">VentureCounsel.AI</span>
                    <span className="font-bold text-blue-600">Free to start</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-blue-600 font-medium">Time to results</span>
                    <span className="font-bold text-blue-600">&lt; 2 minutes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Email Capture */}
          <div className="max-w-2xl mx-auto mb-20">
            <EmailCapture
              title="Get the Free Term Sheet Checklist"
              description="20 critical clauses to review before signing any term sheet. Used by 2,500+ founders."
              buttonText="Send Me the Checklist"
            />
          </div>

          {/* Partnership CTA */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white mb-20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full mb-4">
                  <span className="text-white font-semibold text-xs uppercase tracking-wide">For Partners</span>
                </div>
                <h2 className="text-2xl font-bold mb-4">
                  Accelerators, VCs & Law Firms
                </h2>
                <p className="text-slate-300 mb-6">
                  Give your portfolio companies and clients access to VentureCounsel.AI. Custom programs for accelerators, VC funds, and startup law practices.
                </p>
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Y Combinator</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Techstars</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">500 Global</span>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-sm">Goodwin</span>
                </div>
              </div>
              <div className="text-center md:text-right">
                <Link
                  href="/partners"
                  className="inline-block px-8 py-4 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Explore Partnerships
                </Link>
              </div>
            </div>
          </div>

          {/* Blog/Resources Preview */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-slate-900">Latest from the Knowledge Base</h2>
              <Link href="/blog" className="text-blue-600 font-medium hover:text-blue-800 flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'SAFE vs. Convertible Note: What Founders Actually Need to Know',
                  category: 'Fundraising Basics',
                  readTime: '12 min'
                },
                {
                  title: 'Pro-Rata Rights: Friend or Foe for Early-Stage Founders?',
                  category: 'Term Sheet Deep Dives',
                  readTime: '8 min'
                },
                {
                  title: 'The MFN Clause Trap: When "Most Favored Nation" Backfires',
                  category: 'Term Sheet Deep Dives',
                  readTime: '7 min'
                }
              ].map((post) => (
                <Link key={post.title} href="/blog" className="group block">
                  <article className="bg-white border border-slate-200 rounded-xl p-6 h-full hover:shadow-lg transition-shadow">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded mb-3 inline-block">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <span className="text-slate-400 text-sm">{post.readTime} read</span>
                  </article>
                </Link>
              ))}
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Ready to understand your term sheet?</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
              Join 2,500+ founders who use VentureCounsel.AI to prepare for negotiations and make better decisions.
            </p>
            <Link
              href="/term-sheet"
              className="inline-block px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
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
