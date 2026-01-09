import Script from 'next/script';

export default function OrganizationSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'VentureCounsel.AI',
    url: 'https://venturecounsel.ai',
    logo: 'https://venturecounsel.ai/logo.png',
    description: 'AI-powered legal tools for startup founders. Analyze term sheets, generate SAFEs, optimize compensation, and review contracts.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/venturecounsel',
      'https://linkedin.com/company/venturecounsel'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'hello@venturecounsel.ai',
      contactType: 'customer service'
    },
    offers: {
      '@type': 'Offer',
      description: 'Free AI-powered term sheet analysis',
      price: '0',
      priceCurrency: 'USD'
    }
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
