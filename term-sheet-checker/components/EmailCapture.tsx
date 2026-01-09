'use client';

import { useState } from 'react';
import { trackEmailCapture } from '@/lib/analytics';

interface EmailCaptureProps {
  variant?: 'inline' | 'card' | 'banner' | 'exit-intent';
  title?: string;
  description?: string;
  leadMagnet?: string;
  buttonText?: string;
  className?: string;
  sourcePage?: string;
  onClose?: () => void;
}

export default function EmailCapture({
  variant = 'card',
  title = 'Get the Free Term Sheet Checklist',
  description = '20 critical clauses to review before signing any term sheet.',
  leadMagnet = 'term-sheet-checklist',
  buttonText = 'Send Me the Checklist',
  className = '',
  sourcePage = '/',
  onClose
}: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          leadMagnet,
          sourcePage,
          sourceVariant: variant,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Track successful email capture for analytics
      trackEmailCapture(leadMagnet, sourcePage, variant);

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please check your connection and try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`${getVariantStyles(variant).container} ${className}`}>
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Check your inbox!</h3>
          <p className="text-slate-600 text-sm">
            We&apos;ve sent the checklist to your email. If you don&apos;t see it, check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`${className}`}>
        <div className="flex gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@startup.com"
            required
            className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Sending...' : buttonText}
          </button>
        </div>
        {status === 'error' && (
          <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
        )}
      </form>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-gradient-to-r from-blue-600 to-blue-800 ${className}`}>
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-left">
            <p className="font-semibold">{title}</p>
            <p className="text-blue-100 text-sm">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com"
              required
              className="flex-1 sm:w-64 px-3 py-2 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white text-sm"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-4 py-2 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 text-sm whitespace-nowrap"
            >
              {status === 'loading' ? '...' : 'Get It'}
            </button>
          </form>
        </div>
        {status === 'error' && (
          <div className="text-center pb-2">
            <p className="text-red-200 text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'exit-intent') {
    return (
      <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 ${className}`}>
        <div className="bg-white rounded-2xl p-8 max-w-md w-full relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Wait! Before you go...</h2>
            <p className="text-slate-600">{description}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@startup.com"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-700 focus:border-transparent"
            />
            {status === 'error' && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : buttonText}
            </button>
          </form>
          <p className="text-center text-slate-400 text-xs mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white ${className}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-slate-300">{description}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@startup.com"
          required
          className="w-full px-4 py-3 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-navy-700"
        />
        {status === 'error' && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Sending...' : buttonText}
        </button>
      </form>
      <p className="text-center text-slate-400 text-xs mt-4">
        No spam, ever. Unsubscribe anytime.
      </p>
    </div>
  );
}

function getVariantStyles(variant: string) {
  switch (variant) {
    case 'inline':
      return { container: '' };
    case 'banner':
      return { container: 'bg-gradient-to-r from-blue-600 to-blue-800' };
    case 'exit-intent':
      return { container: 'bg-white rounded-2xl p-8' };
    default:
      return { container: 'bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white' };
  }
}
