'use client';

const testimonials = [
  {
    quote: "VentureCounsel.AI caught three aggressive terms in my Series A that I would have missed. My lawyer confirmed every flag. Saved me from a bad deal.",
    author: "Alex Kim",
    role: "Founder & CEO",
    company: "DataSync (YC W23)",
    avatar: "AK"
  },
  {
    quote: "I used to spend $3,000 just to understand what was in a term sheet. Now I come to my lawyer already knowing what to negotiate. Game changer.",
    author: "Maria Santos",
    role: "Co-founder",
    company: "HealthBridge",
    avatar: "MS"
  },
  {
    quote: "The market benchmarking is incredible. I finally understood that what my investor called 'standard' was actually aggressive for seed stage.",
    author: "James Chen",
    role: "Founder",
    company: "Quantum Labs",
    avatar: "JC"
  }
];

const metrics = [
  { value: '2,500+', label: 'Founders served' },
  { value: '$180M+', label: 'Deals analyzed' },
  { value: '12,000+', label: 'Term sheets reviewed' },
  { value: '94%', label: 'Would recommend' }
];

const logos = [
  { name: 'Y Combinator', abbrev: 'YC' },
  { name: 'Techstars', abbrev: 'TS' },
  { name: 'a16z', abbrev: 'a16z' },
  { name: '500 Global', abbrev: '500' },
  { name: 'Sequoia', abbrev: 'SQ' },
  { name: 'Founders Fund', abbrev: 'FF' }
];

const lawyerEndorsements = [
  {
    quote: "I recommend VentureCounsel.AI to founders before our first call. They come better prepared and we can focus on strategy instead of explaining basics.",
    author: "David Park",
    role: "Partner",
    firm: "Goodwin Procter",
    specialty: "Emerging Companies"
  },
  {
    quote: "The AI correctly identifies market vs. aggressive terms about 90% of the time. It's a great first filter before legal review.",
    author: "Jennifer Liu",
    role: "Partner",
    firm: "Fenwick & West",
    specialty: "Venture Capital"
  }
];

interface SocialProofProps {
  variant?: 'full' | 'compact' | 'metrics-only' | 'logos-only';
  className?: string;
}

export default function SocialProof({ variant = 'full', className = '' }: SocialProofProps) {
  if (variant === 'metrics-only') {
    return (
      <div className={`py-8 ${className}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-1">{metric.value}</p>
              <p className="text-slate-600 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'logos-only') {
    return (
      <div className={`py-8 ${className}`}>
        <p className="text-center text-slate-500 text-sm mb-6">
          Trusted by founders backed by
        </p>
        <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="px-4 py-2 bg-slate-100 rounded-lg"
              title={logo.name}
            >
              <span className="font-bold text-slate-600">{logo.abbrev}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`py-12 ${className}`}>
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">{metric.value}</p>
              <p className="text-slate-500 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Single Featured Testimonial */}
        <div className="bg-slate-50 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <svg className="w-8 h-8 text-blue-200 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
          <p className="text-lg text-slate-700 mb-6 leading-relaxed">
            {testimonials[0].quote}
          </p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 font-semibold text-sm">{testimonials[0].avatar}</span>
            </div>
            <div className="text-left">
              <p className="font-semibold text-slate-900">{testimonials[0].author}</p>
              <p className="text-slate-500 text-sm">{testimonials[0].role}, {testimonials[0].company}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className={`py-16 ${className}`}>
      {/* Metrics */}
      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Trusted by Founders Worldwide</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {metrics.map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-1">{metric.value}</p>
              <p className="text-slate-600 text-sm">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Logos */}
      <div className="mb-16">
        <p className="text-center text-slate-500 text-sm mb-6">
          Used by founders backed by leading investors
        </p>
        <div className="flex flex-wrap justify-center gap-6 items-center">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="px-6 py-3 bg-slate-50 rounded-lg border border-slate-200"
              title={logo.name}
            >
              <span className="font-bold text-slate-500">{logo.abbrev}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Testimonials */}
      <div className="mb-16">
        <h3 className="text-xl font-bold text-slate-900 text-center mb-8">What Founders Say</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.author} className="bg-white border border-slate-200 rounded-xl p-6">
              <svg className="w-6 h-6 text-blue-200 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-slate-700 mb-6 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 font-semibold text-sm">{testimonial.avatar}</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{testimonial.author}</p>
                  <p className="text-slate-500 text-sm">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lawyer Endorsements */}
      <div className="bg-slate-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-900 text-center mb-8">Endorsed by Startup Lawyers</h3>
        <div className="grid md:grid-cols-2 gap-8">
          {lawyerEndorsements.map((endorsement) => (
            <div key={endorsement.author} className="bg-white rounded-xl p-6 border border-slate-200">
              <p className="text-slate-700 mb-6 leading-relaxed italic">
                &quot;{endorsement.quote}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{endorsement.author}</p>
                  <p className="text-slate-500 text-sm">{endorsement.role}, {endorsement.firm}</p>
                  <p className="text-blue-600 text-xs">{endorsement.specialty}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
