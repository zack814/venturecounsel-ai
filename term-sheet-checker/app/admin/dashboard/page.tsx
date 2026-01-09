'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  role: string | null;
  testimonial_text: string;
  tool_used: string | null;
  rating: number | null;
  email: string;
  approved: boolean;
  featured: boolean;
  created_at: string;
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string | null;
  submitted_by_email: string | null;
  vote_count: number;
  status: string;
  created_at: string;
}

interface FeedbackItem {
  id: string;
  tool_name: string;
  rating: number;
  feedback_text: string | null;
  would_recommend: boolean | null;
  email: string | null;
  created_at: string;
}

interface WaitlistItem {
  id: string;
  email: string;
  feature_interest: string | null;
  company_name: string | null;
  company_stage: string | null;
  created_at: string;
}

type Tab = 'testimonials' | 'features' | 'feedback' | 'waitlist';

export default function AdminDashboardPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('testimonials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Data states
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [features, setFeatures] = useState<FeatureRequest[]>([]);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistItem[]>([]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Test the password by fetching testimonials
      const response = await fetch('/api/testimonials', {
        headers: { 'x-admin-password': password },
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('adminPassword', password);
        loadAllData(password);
      } else {
        setError('Invalid password');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedPassword = localStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      loadAllData(savedPassword);
    }
  }, []);

  const loadAllData = async (pwd: string) => {
    setLoading(true);
    try {
      const [testimonialsRes, feedbackRes, waitlistRes] = await Promise.all([
        fetch('/api/testimonials', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/feedback', { headers: { 'x-admin-password': pwd } }),
        fetch('/api/waitlist', { headers: { 'x-admin-password': pwd } }),
      ]);

      if (testimonialsRes.ok) {
        const data = await testimonialsRes.json();
        setTestimonials(data.testimonials || []);
      }

      if (feedbackRes.ok) {
        const data = await feedbackRes.json();
        setFeedback(data.feedback || []);
      }

      if (waitlistRes.ok) {
        const data = await waitlistRes.json();
        setWaitlist(data.waitlist || []);
      }

      // Features don't need auth for GET
      const featuresRes = await fetch('/api/features');
      if (featuresRes.ok) {
        const data = await featuresRes.json();
        setFeatures(data.features || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTestimonial = async (id: string, updates: { approved?: boolean; featured?: boolean }) => {
    try {
      const response = await fetch('/api/testimonials', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (response.ok) {
        setTestimonials(prev =>
          prev.map(t => (t.id === id ? { ...t, ...updates } : t))
        );
      }
    } catch (error) {
      console.error('Error updating testimonial:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminPassword');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Dashboard</h1>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-navy-900 text-white font-semibold rounded-lg hover:bg-navy-800 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Checking...' : 'Login'}
                </button>
              </form>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'testimonials', label: 'Testimonials', count: testimonials.length },
              { id: 'features', label: 'Feature Requests', count: features.length },
              { id: 'feedback', label: 'Tool Feedback', count: feedback.length },
              { id: 'waitlist', label: 'Waitlist', count: waitlist.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-navy-900 text-white'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Testimonials Tab */}
              {activeTab === 'testimonials' && (
                <div className="space-y-4">
                  {testimonials.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <p className="text-gray-500">No testimonials yet</p>
                    </div>
                  ) : (
                    testimonials.map((t) => (
                      <div key={t.id} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                t.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {t.approved ? 'Approved' : 'Pending'}
                              </span>
                              {t.featured && (
                                <span className="px-2 py-0.5 bg-purple-100 text-purple-800 text-xs font-medium rounded">
                                  Featured
                                </span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-2">&ldquo;{t.testimonial_text}&rdquo;</p>
                            <p className="text-sm text-gray-500">
                              — {t.name}{t.company && `, ${t.company}`} • {t.email}
                            </p>
                            {t.rating && (
                              <div className="flex gap-0.5 mt-2">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} className={star <= t.rating! ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => updateTestimonial(t.id, { approved: !t.approved })}
                              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                t.approved
                                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                              }`}
                            >
                              {t.approved ? 'Unapprove' : 'Approve'}
                            </button>
                            <button
                              onClick={() => updateTestimonial(t.id, { featured: !t.featured })}
                              className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                                t.featured
                                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                              }`}
                            >
                              {t.featured ? 'Unfeature' : 'Feature'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Features Tab */}
              {activeTab === 'features' && (
                <div className="space-y-4">
                  {features.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <p className="text-gray-500">No feature requests yet</p>
                    </div>
                  ) : (
                    features.map((f) => (
                      <div key={f.id} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{f.title}</h3>
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                                {f.status}
                              </span>
                            </div>
                            {f.description && <p className="text-gray-600 text-sm mb-2">{f.description}</p>}
                            <p className="text-xs text-gray-400">
                              {f.submitted_by_email && `From: ${f.submitted_by_email} • `}
                              {new Date(f.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-center">
                            <span className="text-2xl font-bold text-teal-600">{f.vote_count}</span>
                            <p className="text-xs text-gray-500">votes</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Feedback Tab */}
              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  {feedback.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <p className="text-gray-500">No feedback yet</p>
                    </div>
                  ) : (
                    feedback.map((f) => (
                      <div key={f.id} className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                                {f.tool_name.replace('_', ' ')}
                              </span>
                              <div className="flex gap-0.5">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <span key={star} className={star <= f.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                                ))}
                              </div>
                              {f.would_recommend !== null && (
                                <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                                  f.would_recommend ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {f.would_recommend ? 'Would recommend' : 'Would not recommend'}
                                </span>
                              )}
                            </div>
                            {f.feedback_text && <p className="text-gray-700 mb-2">{f.feedback_text}</p>}
                            <p className="text-xs text-gray-400">
                              {f.email && `${f.email} • `}
                              {new Date(f.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Waitlist Tab */}
              {activeTab === 'waitlist' && (
                <div className="space-y-4">
                  {waitlist.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center border border-gray-200">
                      <p className="text-gray-500">No waitlist signups yet</p>
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Company</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Stage</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Interests</th>
                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {waitlist.map((w) => (
                            <tr key={w.id} className="border-b border-gray-100 last:border-0">
                              <td className="px-4 py-3 text-sm text-gray-900">{w.email}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{w.company_name || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600">{w.company_stage || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{w.feature_interest || '-'}</td>
                              <td className="px-4 py-3 text-sm text-gray-400">{new Date(w.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
