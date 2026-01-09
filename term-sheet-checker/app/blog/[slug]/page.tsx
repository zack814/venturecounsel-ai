'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import EmailCapture from '@/components/EmailCapture';
import { blogPosts } from '@/lib/blog-data';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  const post = blogPosts[slug];

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="pt-24 pb-16 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-8">The article you&apos;re looking for doesn&apos;t exist.</p>
            <Link href="/blog" className="text-teal-600 hover:text-teal-700 font-medium">
              &larr; Back to Blog
            </Link>
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
        <article className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8">
            <Link href="/blog" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
              &larr; Back to Blog
            </Link>
          </nav>

          {/* Header */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">
                {post.category}
              </span>
              <span className="text-gray-500 text-sm">{post.readTime}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed mb-6">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-3 pb-8 border-b border-gray-200">
              <div className="w-10 h-10 bg-teal-200 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-semibold text-sm">VC</span>
              </div>
              <div>
                <p className="font-medium text-navy-900">{post.author}</p>
                <p className="text-gray-500 text-sm">{post.date}</p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-navy-900 prose-headings:font-bold prose-p:text-gray-600 prose-p:leading-relaxed prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-navy-900 prose-ul:text-gray-600 prose-ol:text-gray-600 prose-li:marker:text-teal-500"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Email Capture */}
          <div className="mt-16">
            <EmailCapture
              variant="card"
              title="Get the Free Term Sheet Checklist"
              description="20 critical clauses to review before signing any term sheet. Includes red flags and negotiation tips."
              leadMagnet="term-sheet-checklist"
              buttonText="Send Me the Checklist"
              sourcePage={`/blog/${slug}`}
            />
          </div>

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-navy-900 mb-8">Related Articles</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                {post.relatedPosts.map((relatedSlug) => {
                  const relatedPost = blogPosts[relatedSlug];
                  if (!relatedPost) return null;
                  return (
                    <Link key={relatedSlug} href={`/blog/${relatedSlug}`} className="group block">
                      <div className="p-6 bg-white border border-gray-200 rounded-xl hover:shadow-lg transition-shadow">
                        <span className="text-xs text-teal-600 font-medium">{relatedPost.category}</span>
                        <h4 className="text-lg font-bold text-navy-900 mt-2 group-hover:text-teal-600 transition-colors">
                          {relatedPost.title}
                        </h4>
                        <p className="text-gray-500 text-sm mt-2">{relatedPost.readTime}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
