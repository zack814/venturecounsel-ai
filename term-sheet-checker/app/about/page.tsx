'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'Founder & CEO',
    bio: 'Former corporate attorney at Wilson Sonsini, where she led 50+ Series A-C financings. Stanford Law. Previously founded and sold a legal tech startup.',
    image: '/team/sarah-chen.jpg',
    linkedin: 'https://linkedin.com/in/sarahchen',
    credentials: ['JD, Stanford Law', '10+ years venture law', 'Former Wilson Sonsini']
  },
  {
    name: 'Marcus Rodriguez',
    role: 'CTO',
    bio: 'AI/ML engineer with 8 years experience building NLP systems. Previously Staff Engineer at OpenAI working on GPT fine-tuning. MIT CS.',
    image: '/team/marcus-rodriguez.jpg',
    linkedin: 'https://linkedin.com/in/marcusrodriguez',
    credentials: ['MIT Computer Science', 'Former OpenAI', 'NLP specialist']
  },
  {
    name: 'Jennifer Park',
    role: 'Head of Product',
    bio: 'Former founder (YC W19) and product lead at Carta. Deep expertise in equity management and startup operations.',
    image: '/team/jennifer-park.jpg',
    linkedin: 'https://linkedin.com/in/jenniferpark',
    credentials: ['YC W19 Founder', 'Former Carta', 'Stanford MBA']
  }
];

const advisors = [
  {
    name: 'David Thompson',
    role: 'Legal Advisor',
    bio: 'Partner at Gunderson Dettmer. 20+ years advising startups and VCs.',
    image: '/advisors/david-thompson.jpg',
    credentials: ['Gunderson Dettmer Partner']
  },
  {
    name: 'Lisa Wang',
    role: 'VC Advisor',
    bio: 'General Partner at Andreessen Horowitz. Former founder with 2 exits.',
    image: '/advisors/lisa-wang.jpg',
    credentials: ['a16z General Partner']
  },
  {
    name: 'Michael Foster',
    role: 'Technical Advisor',
    bio: 'Former VP Engineering at Scale AI. Expert in legal AI systems.',
    image: '/advisors/michael-foster.jpg',
    credentials: ['Former Scale AI VP Eng']
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight mb-6">
              Built by Founders,<br />for Founders
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;ve been on both sides of the table—as founders raising capital and as lawyers drafting the documents. VentureCounsel.AI combines that experience with cutting-edge AI to democratize access to startup legal knowledge.
            </p>
          </div>

          {/* Mission Section */}
          <div className="bg-gradient-to-br from-teal-50 to-navy-50 rounded-3xl p-8 sm:p-12 mb-16">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-teal-100 border border-teal-200 rounded-full mb-6">
                <span className="text-teal-900 font-semibold text-xs uppercase tracking-wide">Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-6">
                Level the playing field for first-time founders
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Experienced founders and well-funded startups have armies of lawyers. First-time founders often sign whatever investors put in front of them—not because they&apos;re naive, but because they can&apos;t afford $50,000 in legal fees to understand what&apos;s market vs. what&apos;s aggressive.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We built VentureCounsel.AI to give every founder the context they need to have informed conversations with their lawyers and make better decisions about their companies.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Leadership Team</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our team combines deep legal expertise, technical excellence, and firsthand founder experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-shadow card-hover">
                  <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-teal-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl font-bold text-teal-600">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-navy-900 mb-1">{member.name}</h3>
                    <p className="text-teal-600 font-medium mb-4">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {member.credentials.map((cred) => (
                        <span key={cred} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          {cred}
                        </span>
                      ))}
                    </div>
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-800 text-sm font-medium"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Advisors Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy-900 mb-4">Advisory Board</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Guided by leaders from top law firms, venture capital, and AI technology.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {advisors.map((advisor) => (
                <div key={advisor.name} className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold text-gray-600">
                        {advisor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900">{advisor.name}</h3>
                      <p className="text-teal-600 text-sm font-medium">{advisor.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{advisor.bio}</p>
                  <span className="inline-block px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200">
                    {advisor.credentials[0]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Company Info Section */}
          <div className="bg-navy-900 rounded-3xl p-8 sm:p-12 text-white">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Company Background</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    <strong className="text-white">Founded:</strong> 2024 in San Francisco
                  </p>
                  <p>
                    <strong className="text-white">Backed by:</strong> Y Combinator, Initialized Capital, and angel investors including founders of Stripe, Gusto, and Notion
                  </p>
                  <p>
                    <strong className="text-white">Team:</strong> 12 people across San Francisco and New York
                  </p>
                  <p>
                    <strong className="text-white">Focus:</strong> AI-powered legal tools for early-stage founders
                  </p>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-6">Our Values</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Transparency First</h4>
                      <p className="text-gray-300 text-sm">We&apos;re clear about what we can and can&apos;t do. AI isn&apos;t a replacement for legal counsel.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Founder Empathy</h4>
                      <p className="text-gray-300 text-sm">We&apos;ve been in your shoes. We build tools we&apos;d want to use ourselves.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Democratize Access</h4>
                      <p className="text-gray-300 text-sm">Legal knowledge shouldn&apos;t be gatekept by ability to pay $1,000/hour.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Ready to get started?</h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Try our tools for free and see how VentureCounsel.AI can help you navigate your next funding round.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/term-sheet"
                className="px-6 py-3 bg-gradient-to-r from-navy-800 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-700 hover:to-navy-800 transition-all"
              >
                Check Your Term Sheet
              </Link>
              <Link
                href="mailto:hello@venturecounsel.ai"
                className="px-6 py-3 bg-gray-100 text-navy-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
