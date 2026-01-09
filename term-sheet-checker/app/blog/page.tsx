'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { getSortedPosts, getFeaturedPost, getCategories } from '@/lib/blog-data';

const posts = getSortedPosts();
const featuredPost = getFeaturedPost();
const categories = getCategories();

const guides = [
  {
    title: 'The Complete SAFE Guide for Founders',
    description: 'Everything you need to know about SAFEs, from basic mechanics to advanced negotiation tactics.',
    chapters: 8,
    readTime: '45 min total'
  },
  {
    title: 'Term Sheet Negotiation Playbook',
    description: 'Battle-tested strategies for negotiating your first term sheet without killing the deal.',
    chapters: 6,
    readTime: '35 min total'
  },
  {
    title: 'Equity Compensation Handbook',
    description: 'How to structure equity grants, understand 409A, and build competitive offers.',
    chapters: 5,
    readTime: '30 min total'
  }
];

export default function BlogPage() {
  // Get posts excluding the featured post
  const displayPosts = featuredPost
    ? posts.filter(p => p.slug !== featuredPost.slug).slice(0, 10)
    : posts.slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight mb-6">
              Founder Knowledge Base
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Practical guides and insights on fundraising, term sheets, and startup legal matters. No fluff, no legalese.
            </p>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-8 mb-16 text-white">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Get Weekly Insights</h2>
              <p className="text-gray-300 mb-6">
                Get our weekly analysis of VC deal patterns, market trends, and negotiation tactics delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="you@startup.com"
                  className="flex-1 px-4 py-3 rounded-lg text-navy-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-gray-400 text-xs mt-4">
                No spam. Unsubscribe anytime. We respect your inbox.
              </p>
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-16">
              <h2 className="text-sm font-semibold text-teal-600 uppercase tracking-wide mb-4">Featured</h2>
              <Link href={`/blog/${featuredPost.slug}`} className="group block">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                      {featuredPost.category}
                    </span>
                    <span className="text-gray-500 text-sm">{featuredPost.readTime}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-4 group-hover:text-teal-600 transition-colors">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
                      <span className="text-teal-700 font-semibold text-sm">VC</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy-900">{featuredPost.author}</p>
                      <p className="text-gray-500 text-sm">{featuredPost.date}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Posts List */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-navy-900 mb-8">Latest Articles</h2>
              <div className="space-y-8">
                {displayPosts.map((post) => (
                  <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                    <article className="border-b border-gray-200 pb-8">
                      <div className="flex items-center gap-4 mb-3">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                          {post.category}
                        </span>
                        <span className="text-gray-400 text-sm">{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-teal-600 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{post.excerpt}</p>
                      <p className="text-gray-400 text-sm">{post.date}</p>
                    </article>
                  </Link>
                ))}
              </div>

              {posts.length > 11 && (
                <div className="mt-8 text-center">
                  <button className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Load More Articles
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Categories */}
              <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
                <h3 className="font-bold text-navy-900 mb-4">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category) => (
                    <li key={category.name}>
                      <button className="w-full flex justify-between items-center py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
                        <span className="text-gray-700">{category.name}</span>
                        <span className="text-gray-400 text-sm">{category.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Guides */}
              <div className="bg-white rounded-xl p-6 mb-8 border border-gray-200">
                <h3 className="font-bold text-navy-900 mb-4">Comprehensive Guides</h3>
                <div className="space-y-4">
                  {guides.map((guide) => (
                    <Link key={guide.title} href="#" className="block p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-navy-900 mb-1">{guide.title}</h4>
                      <p className="text-gray-600 text-sm mb-2">{guide.description}</p>
                      <div className="flex gap-4 text-xs text-gray-500">
                        <span>{guide.chapters} chapters</span>
                        <span>{guide.readTime}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Lead Magnet */}
              <div className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-xl p-6 text-white">
                <h3 className="font-bold mb-3">Free Download</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Get our Term Sheet Red Flag Checklist—25 clauses to scrutinize before signing anything.
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-3 py-2 rounded-lg text-navy-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors text-sm"
                  >
                    Download Free Checklist
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
