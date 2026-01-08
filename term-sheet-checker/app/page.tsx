'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Main Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
              AI-Powered Tools for<br />First-Time Founders
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Make smarter decisions on term sheets, compensation packages, and contracts with market-calibrated, context-sensitive analysis.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
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
                  <span className="text-blue-900 font-semibold text-xs uppercase tracking-wide">Term Sheet Checker</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">
                  Reality Check Your Term Sheet
                </h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Upload or paste your term sheet and get an instant assessment of what&apos;s market vs aggressive vs deal-killing.
                </p>
                <div className="flex items-center text-blue-600 font-semibold text-sm">
                  Check Your Term Sheet
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
                  Build Market-Calibrated Offers
                </h2>
                <p className="text-slate-600 text-sm mb-5 leading-relaxed">
                  Generate 3-5 compensation packages with quantified tradeoffs: salary, equity, runway impact, and dilution.
                </p>
                <div className="flex items-center text-green-600 font-semibold text-sm">
                  Build Your Offer
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  Get instant analysis of any contract with risk flags, negotiation suggestions, and plain-English explanations.
                </p>
                <div className="flex items-center text-purple-600 font-semibold text-sm">
                  Review a Contract
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Why Founders Use VentureCounsel.AI</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Market Calibrated</h3>
                <p className="text-slate-600 text-sm">Benchmarked against real Silicon Valley startup data across stages and roles.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Instant Results</h3>
                <p className="text-slate-600 text-sm">Get actionable insights in seconds, not hours or days of legal review.</p>
              </div>
              <div>
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">Risk Flagging</h3>
                <p className="text-slate-600 text-sm">Automatic compliance checks for 409A, ISO limits, 83(b), and more.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
