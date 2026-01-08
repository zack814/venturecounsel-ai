'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center group-hover:bg-blue-800 transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-bold text-lg">VentureCounsel<span className="text-blue-900">.AI</span></span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              className={`font-medium text-sm transition-colors ${
                isActive('/') && !isActive('/comp-optimizer') && !isActive('/term-sheet')
                  ? 'text-blue-900'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Home
            </Link>
            <Link
              href="/term-sheet"
              className={`font-medium text-sm transition-colors ${
                isActive('/term-sheet')
                  ? 'text-blue-900'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Term Sheet Checker
            </Link>
            <Link
              href="/comp-optimizer"
              className={`font-medium text-sm transition-colors ${
                isActive('/comp-optimizer')
                  ? 'text-blue-900'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Comp Optimizer
            </Link>
            <Link
              href="/contract-review"
              className={`font-medium text-sm transition-colors ${
                isActive('/contract-review')
                  ? 'text-blue-900'
                  : 'text-slate-600 hover:text-blue-900'
              }`}
            >
              Contract Review
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
