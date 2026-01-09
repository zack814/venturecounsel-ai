import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import OrganizationSchema from "@/components/OrganizationSchema";

export const metadata: Metadata = {
  title: "VentureCounsel.AI | AI Legal Tools for Startup Founders",
  description: "Free AI-powered legal tools for founders. Analyze term sheets, generate SAFEs, optimize compensation, and review contracts. Used by 2,500+ founders backed by YC, a16z, and Techstars.",
  keywords: ['startup legal tools', 'term sheet checker', 'SAFE generator', 'AI legal', 'founder tools', 'venture capital', 'fundraising'],
  authors: [{ name: 'VentureCounsel.AI' }],
  openGraph: {
    title: 'VentureCounsel.AI | AI Legal Tools for Startup Founders',
    description: 'Free AI-powered legal tools for founders. Analyze term sheets, generate SAFEs, optimize compensation, and review contracts.',
    url: 'https://venturecounsel.ai',
    siteName: 'VentureCounsel.AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VentureCounsel.AI | AI Legal Tools for Startup Founders',
    description: 'Free AI-powered legal tools for founders. Analyze term sheets, generate SAFEs, and review contracts.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;

  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        {gtmId && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              `,
            }}
          />
        )}

        {/* Google Analytics 4 (direct implementation as backup/alternative to GTM) */}
        {gaMeasurementId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="ga4-script"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        )}

        {/* Microsoft Clarity */}
        {clarityProjectId && (
          <Script
            id="clarity-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityProjectId}");
              `,
            }}
          />
        )}
      </head>
      <body className="antialiased bg-white text-slate-900">
        {/* Google Tag Manager (noscript fallback) */}
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <OrganizationSchema />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ErrorBoundary>
          <main id="main-content">
            {children}
          </main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
