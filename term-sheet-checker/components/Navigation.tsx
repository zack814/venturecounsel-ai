'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  const toolLinks = [
    { href: '/term-sheet', label: 'Term Sheet Checker' },
    { href: '/safe-generator', label: 'SAFE Generator' },
    { href: '/comp-optimizer', label: 'Comp Optimizer' },
    { href: '/offer-evaluator', label: 'Offer Evaluator' },
    { href: '/contract-review', label: 'Contract Review' },
  ];

  const resourceLinks = [
    { href: '/blog', label: 'Knowledge Base' },
    { href: '/compare', label: 'How We Compare' },
    { href: '/roadmap', label: 'Roadmap' },
    { href: '/wall', label: 'Feedback Wall' },
    { href: '/about', label: 'About Us' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/partners', label: 'Partners' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav border-b border-gray-200/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-navy-800 to-navy-900 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-navy-900">VentureCounsel<span className="text-teal-600">.AI</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div className="relative group">
              <button
                className="px-3 py-2 font-medium text-sm text-gray-600 hover:text-navy-900 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 rounded-lg"
                aria-haspopup="true"
                aria-label="Tools menu"
              >
                Tools
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[200px]">
                  {toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(link.href)
                          ? 'text-navy-900 bg-navy-50'
                          : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div className="relative group">
              <button
                className="px-3 py-2 font-medium text-sm text-gray-600 hover:text-navy-900 transition-colors flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 rounded-lg"
                aria-haspopup="true"
                aria-label="Resources menu"
              >
                Resources
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute left-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 py-2 min-w-[180px]">
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-2 text-sm transition-colors ${
                        isActive(link.href)
                          ? 'text-navy-900 bg-navy-50'
                          : 'text-gray-600 hover:text-navy-900 hover:bg-gray-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Direct Links */}
            <Link
              href="/pricing"
              className={`px-3 py-2 font-medium text-sm transition-colors ${
                isActive('/pricing')
                  ? 'text-navy-900'
                  : 'text-gray-600 hover:text-navy-900'
              }`}
            >
              Pricing
            </Link>

            {/* CTA Button */}
            <Link
              href="/contract-review"
              className="ml-4 px-5 py-2.5 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-medium text-sm rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all shadow-md hover:shadow-lg"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 rounded-lg"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-200" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-4 space-y-4">
            {/* Tools Section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tools</p>
              <div className="space-y-1">
                {toolLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      isActive(link.href)
                        ? 'text-navy-900 bg-navy-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Resources</p>
              <div className="space-y-1">
                {resourceLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm ${
                      isActive(link.href)
                        ? 'text-navy-900 bg-navy-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/contract-review"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-3 bg-gradient-to-r from-navy-800 to-navy-900 text-white text-center font-semibold rounded-lg"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
