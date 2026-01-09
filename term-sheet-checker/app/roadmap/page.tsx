'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface FeatureRequest {
  id: string;
  title: string;
  description: string | null;
  vote_count: number;
  status: 'approved' | 'in_progress' | 'completed';
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  approved: { label: 'Planned', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: 'In Progress', color: 'bg-amber-100 text-amber-800' },
  completed: { label: 'Shipped', color: 'bg-green-100 text-green-800' },
};

export default function RoadmapPage() {
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [votedFeatures, setVotedFeatures] = useState<Set<string>>(new Set());

  // New feature form
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    fetchFeatures();
    // Load voted features from localStorage
    const stored = localStorage.getItem('votedFeatures');
    if (stored) {
      setVotedFeatures(new Set(JSON.parse(stored)));
    }
  }, []);

  const fetchFeatures = async () => {
    try {
      const response = await fetch('/api/features');
      const data = await response.json();
      setFeatures(data.features || []);
    } catch (error) {
      console.error('Failed to fetch features:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (featureId: string) => {
    if (votedFeatures.has(featureId)) return;

    try {
      const response = await fetch('/api/features/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureId,
          voterIdentifier: localStorage.getItem('visitorId') || undefined,
        }),
      });

      const data = await response.json();

      if (data.success || data.alreadyVoted) {
        // Update local state
        const newVoted = new Set(votedFeatures);
        newVoted.add(featureId);
        setVotedFeatures(newVoted);
        localStorage.setItem('votedFeatures', JSON.stringify([...newVoted]));

        // Update vote count in UI
        if (data.newVoteCount) {
          setFeatures(prev =>
            prev.map(f =>
              f.id === featureId ? { ...f, vote_count: data.newVoteCount } : f
            )
          );
        }
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    }
  };

  const handleSubmitFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');

    try {
      const response = await fetch('/api/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || null,
          email: newEmail || null,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setNewTitle('');
        setNewDescription('');
        setNewEmail('');
        setTimeout(() => {
          setShowForm(false);
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-navy-900 tracking-tight mb-4">
              Product Roadmap
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what we&apos;re building and vote for features you want most. Your feedback shapes our priorities.
            </p>
          </div>

          {/* Submit Feature Button */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Suggest a Feature
            </button>
          </div>

          {/* Feature Submission Form */}
          {showForm && (
            <div className="bg-white rounded-2xl p-6 border border-gray-200 mb-8">
              {submitStatus === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-900">Feature submitted!</p>
                  <p className="text-sm text-gray-600">It will appear after review.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeature} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Feature Title *
                    </label>
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g., Integration with Carta"
                      required
                      minLength={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description (optional)
                    </label>
                    <textarea
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Describe the feature and why it would be helpful..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email (optional, for updates)
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="you@startup.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  {submitStatus === 'error' && (
                    <p className="text-red-500 text-sm">Something went wrong. Please try again.</p>
                  )}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 text-gray-600 font-medium hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitStatus === 'loading'}
                      className="px-6 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
                    >
                      {submitStatus === 'loading' ? 'Submitting...' : 'Submit Feature'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Features List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : features.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <p className="text-gray-600">No features on the roadmap yet. Be the first to suggest one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 flex items-start gap-4"
                >
                  {/* Vote Button */}
                  <button
                    onClick={() => handleVote(feature.id)}
                    disabled={votedFeatures.has(feature.id)}
                    className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl transition-colors flex-shrink-0 ${
                      votedFeatures.has(feature.id)
                        ? 'bg-teal-100 text-teal-700 cursor-default'
                        : 'bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${votedFeatures.has(feature.id) ? 'fill-current' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                    </svg>
                    <span className="font-bold text-lg">{feature.vote_count}</span>
                  </button>

                  {/* Feature Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-navy-900">{feature.title}</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${STATUS_LABELS[feature.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                        {STATUS_LABELS[feature.status]?.label || feature.status}
                      </span>
                    </div>
                    {feature.description && (
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
