'use client';

import { useState, useEffect } from 'react';

interface PremiumWaitlistProps {
  className?: string;
}

const PREMIUM_FEATURES = [
  'Unlimited SAFE generation',
  'Priority document review',
  'Custom term sheet templates',
  'Cap table modeling',
  'Direct lawyer matching',
];

const COMPANY_STAGES = [
  'Pre-seed',
  'Seed',
  'Series A',
  'Series B+',
  'Other',
];

export default function PremiumWaitlist({ className = '' }: PremiumWaitlistProps) {
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyStage, setCompanyStage] = useState('');
  const [featureInterest, setFeatureInterest] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    // Fetch waitlist count
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => setWaitlistCount(data.count))
      .catch(() => {});
  }, []);

  const handleFeatureToggle = (feature: string) => {
    setFeatureInterest(prev =>
      prev.includes(feature)
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          companyName: companyName.trim() || null,
          companyStage: companyStage || null,
          featureInterest: featureInterest.length > 0 ? featureInterest.join(', ') : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus('error');
        setErrorMessage(data.error || 'Something went wrong');
        return;
      }

      setStatus('success');
      if (waitlistCount !== null) {
        setWaitlistCount(waitlistCount + 1);
      }
    } catch {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className={`bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 text-white ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold mb-2">You&apos;re on the list!</h3>
          <p className="text-gray-300">
            We&apos;ll notify you when premium features launch.
            {waitlistCount && waitlistCount > 1 && (
              <span className="block mt-2 text-sm">
                You&apos;re #{waitlistCount} on the waitlist
              </span>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 text-white ${className}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-bold">Premium Features Coming Soon</h3>
            <span className="px-2 py-0.5 bg-amber-500 text-xs font-semibold rounded-full">BETA</span>
          </div>
          <p className="text-gray-300">
            Join the waitlist for early access to advanced tools.
            {waitlistCount !== null && waitlistCount > 0 && (
              <span className="text-teal-400 font-medium"> {waitlistCount} founders already waiting.</span>
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@startup.com"
            required
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Company Name (optional) */}
        <div>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company name (optional)"
            className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Company Stage */}
        <div>
          <select
            value={companyStage}
            onChange={(e) => setCompanyStage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
          >
            <option value="">Select your stage (optional)</option>
            {COMPANY_STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Feature Interest */}
        <div>
          <p className="text-sm text-gray-300 mb-2">What features interest you most?</p>
          <div className="flex flex-wrap gap-2">
            {PREMIUM_FEATURES.map(feature => (
              <button
                key={feature}
                type="button"
                onClick={() => handleFeatureToggle(feature)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  featureInterest.includes(feature)
                    ? 'bg-teal-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                {feature}
              </button>
            ))}
          </div>
        </div>

        {status === 'error' && (
          <p className="text-red-400 text-sm">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining...' : 'Join the Waitlist'}
        </button>
      </form>

      <p className="text-center text-gray-400 text-xs mt-4">
        No spam. We&apos;ll only email about launch updates.
      </p>
    </div>
  );
}
