'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-slate-500 mb-8">Last updated: January 8, 2025</p>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">1. Introduction</h2>
              <p className="text-slate-600 mb-4">
                Shapiro Venture Law PLLC (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) operates VentureCounsel.AI (the &quot;Service&quot;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
              </p>
              <p className="text-slate-600">
                Please read this Privacy Policy carefully. By using the Service, you consent to the data practices described in this policy. If you do not agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
            </section>

            <section className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-bold text-blue-900 mb-4">Important Notice Regarding Confidentiality</h2>
              <p className="text-slate-700 mb-4">
                <strong>The information you submit to VentureCounsel.AI is NOT protected by attorney-client privilege.</strong> This Service is an AI-powered informational tool, not a legal service. Before submitting any information:
              </p>
              <ul className="list-disc pl-6 text-slate-700 space-y-2">
                <li>Ensure you have authorization to share such information</li>
                <li>Consider whether the information is subject to confidentiality agreements or obligations</li>
                <li>Understand that information may be processed by third-party AI services</li>
                <li>Do not submit information you would not want disclosed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">2. Information We Collect</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.1 Information You Provide</h3>
              <p className="text-slate-600 mb-4">
                We collect information you voluntarily provide when using the Service, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li><strong>Document Content:</strong> Term sheets, compensation documents, and other materials you upload or paste into the Service for analysis</li>
                <li><strong>Form Inputs:</strong> Information you enter into our tools, such as company details, role information, compensation figures, and preferences</li>
                <li><strong>Chat Messages:</strong> Queries and conversations you have with our AI chat functionality</li>
                <li><strong>Contact Information:</strong> Email address or other contact details if you reach out to us</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">2.2 Information Collected Automatically</h3>
              <p className="text-slate-600 mb-4">
                When you access the Service, we may automatically collect:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li><strong>Device Information:</strong> Browser type, operating system, device type</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service</li>
                <li><strong>IP Address:</strong> For rate limiting, security, and analytics purposes</li>
                <li><strong>Cookies and Similar Technologies:</strong> As described in Section 7 below</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">3. How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">
                We use the information we collect for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li><strong>Provide the Service:</strong> Process your documents and inputs to generate analyses and recommendations</li>
                <li><strong>Improve the Service:</strong> Analyze usage patterns to enhance functionality and user experience</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
                <li><strong>Rate Limiting:</strong> Enforce usage limits to ensure fair access for all users</li>
                <li><strong>Communications:</strong> Respond to your inquiries and provide customer support</li>
                <li><strong>Legal Compliance:</strong> Comply with applicable laws and legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">4. Third-Party Service Providers</h2>
              <p className="text-slate-600 mb-4">
                We use third-party services to operate the Service. These providers may process your information as follows:
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.1 AI Processing Services</h3>
              <p className="text-slate-600 mb-4">
                We use Anthropic&apos;s Claude API and/or OpenAI&apos;s API to power our AI analysis features. When you submit content for analysis:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Your content is transmitted to these AI providers for processing</li>
                <li>These providers have their own privacy policies governing data handling</li>
                <li>We recommend reviewing <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Anthropic&apos;s Privacy Policy</a> and <a href="https://openai.com/privacy" target="_blank" rel="noopener" className="text-blue-600 hover:underline">OpenAI&apos;s Privacy Policy</a></li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.2 Analytics Services</h3>
              <p className="text-slate-600 mb-4">
                We use Google Analytics to understand how users interact with our Service. Google Analytics collects information such as:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Pages visited and features used</li>
                <li>Time spent on the Service</li>
                <li>Geographic location (country/region level)</li>
                <li>Device and browser information</li>
              </ul>
              <p className="text-slate-600">
                You can opt out of Google Analytics by installing the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener" className="text-blue-600 hover:underline">Google Analytics Opt-out Browser Add-on</a>.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">4.3 Hosting Services</h3>
              <p className="text-slate-600">
                The Service is hosted on Vercel. Vercel may collect and process certain technical information as part of providing hosting services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">5. Data Retention</h2>
              <p className="text-slate-600 mb-4">
                Our data retention practices are as follows:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li><strong>Document Content:</strong> We do not persistently store the documents or text you submit for analysis. Content is processed in real-time and not retained after your session ends.</li>
                <li><strong>Usage Logs:</strong> We may retain anonymized usage logs for analytics purposes for up to 24 months.</li>
                <li><strong>IP Addresses:</strong> IP addresses used for rate limiting are retained temporarily (typically 24 hours) and then deleted.</li>
                <li><strong>Third-Party Retention:</strong> Our AI service providers may retain data according to their own policies. Please review their privacy policies for details.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">6. Data Security</h2>
              <p className="text-slate-600 mb-4">
                We implement reasonable technical and organizational measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>HTTPS encryption for all data transmission</li>
                <li>Rate limiting to prevent abuse</li>
                <li>Regular security assessments</li>
              </ul>
              <p className="text-slate-600">
                However, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-slate-600 mb-4">
                We use cookies and similar tracking technologies to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>Remember your preferences</li>
                <li>Analyze usage patterns</li>
                <li>Improve the Service</li>
              </ul>
              <p className="text-slate-600 mb-4">
                Types of cookies we use:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic Service functionality</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Service</li>
              </ul>
              <p className="text-slate-600">
                You can control cookies through your browser settings. Note that disabling cookies may affect Service functionality.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">8. Your Rights and Choices</h2>
              <p className="text-slate-600 mb-4">
                Depending on your location, you may have certain rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li><strong>Access:</strong> Request information about the data we hold about you</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Opt-Out:</strong> Opt out of certain data processing activities</li>
              </ul>
              <p className="text-slate-600">
                To exercise these rights, please contact us using the information provided in Section 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">9. California Privacy Rights</h2>
              <p className="text-slate-600 mb-4">
                If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA), including:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-4 space-y-2">
                <li>The right to know what personal information we collect and how it is used</li>
                <li>The right to delete personal information</li>
                <li>The right to opt out of the sale of personal information (we do not sell personal information)</li>
                <li>The right to non-discrimination for exercising your privacy rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">10. International Users</h2>
              <p className="text-slate-600 mb-4">
                The Service is operated from the United States. If you are accessing the Service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States where our servers are located.
              </p>
              <p className="text-slate-600">
                By using the Service, you consent to the transfer of your information to the United States, which may have different data protection laws than your country of residence.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">11. Children&apos;s Privacy</h2>
              <p className="text-slate-600">
                The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">12. Changes to This Privacy Policy</h2>
              <p className="text-slate-600">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after any changes indicates your acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">13. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at:
              </p>
              <p className="text-slate-600">
                <strong>Shapiro Venture Law PLLC</strong><br />
                Email: privacy@venturecounsel.ai
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4">14. Additional Disclosures</h2>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">14.1 Do Not Track</h3>
              <p className="text-slate-600 mb-4">
                Some browsers have a &quot;Do Not Track&quot; feature. We do not currently respond to Do Not Track signals.
              </p>

              <h3 className="text-lg font-semibold text-slate-800 mb-3">14.2 Third-Party Links</h3>
              <p className="text-slate-600">
                The Service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to review the privacy policies of any third-party sites you visit.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium">
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer showDisclaimer={false} />
    </div>
  );
}
