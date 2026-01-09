export interface WelcomeEmailProps {
  leadMagnet: string;
  downloadUrl: string;
}

export function getWelcomeEmailHtml({ leadMagnet, downloadUrl }: WelcomeEmailProps): string {
  const leadMagnetTitle = getLeadMagnetTitle(leadMagnet);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your ${leadMagnetTitle} is Ready</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">VentureCounsel.AI</h1>
              <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">AI-Powered Legal Tools for Founders</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 22px; font-weight: 600;">
                Your ${leadMagnetTitle} is Ready!
              </h2>
              <p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">
                Thanks for signing up! Click the button below to download your free resource.
              </p>

              <!-- CTA Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" style="margin: 0 0 32px 0;">
                <tr>
                  <td style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 8px;">
                    <a href="${downloadUrl}" style="display: inline-block; padding: 16px 32px; color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600;">
                      Download Now
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">

              <!-- Tools Section -->
              <h3 style="margin: 0 0 16px 0; color: #0f172a; font-size: 18px; font-weight: 600;">
                Explore Our Free Tools
              </h3>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                    <a href="https://venturecounsel.ai/term-sheet" style="color: #2563eb; text-decoration: none; font-weight: 500;">Term Sheet Checker</a>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Instant assessment of what's market vs aggressive</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9;">
                    <a href="https://venturecounsel.ai/safe-generator" style="color: #2563eb; text-decoration: none; font-weight: 500;">SAFE Generator</a>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Create market-standard SAFEs with side letters</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0;">
                    <a href="https://venturecounsel.ai/comp-optimizer" style="color: #2563eb; text-decoration: none; font-weight: 500;">Comp Optimizer</a>
                    <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px;">Build offers with quantified salary/equity tradeoffs</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 40px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px;">
                Questions? Reply to this email or visit <a href="https://venturecounsel.ai" style="color: #2563eb; text-decoration: none;">venturecounsel.ai</a>
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                You're receiving this because you signed up at VentureCounsel.AI
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export function getWelcomeEmailText({ leadMagnet, downloadUrl }: WelcomeEmailProps): string {
  const leadMagnetTitle = getLeadMagnetTitle(leadMagnet);

  return `
Your ${leadMagnetTitle} is Ready!

Thanks for signing up! Download your free resource here:
${downloadUrl}

---

Explore Our Free Tools:

- Term Sheet Checker: https://venturecounsel.ai/term-sheet
  Instant assessment of what's market vs aggressive

- SAFE Generator: https://venturecounsel.ai/safe-generator
  Create market-standard SAFEs with side letters

- Comp Optimizer: https://venturecounsel.ai/comp-optimizer
  Build offers with quantified salary/equity tradeoffs

---

Questions? Reply to this email or visit https://venturecounsel.ai

VentureCounsel.AI - AI-Powered Legal Tools for Founders
  `.trim();
}

function getLeadMagnetTitle(leadMagnet: string): string {
  const titles: Record<string, string> = {
    'term-sheet-checklist': 'Term Sheet Checklist',
    'safe-guide': 'SAFE Guide',
    'comp-benchmarks': 'Compensation Benchmarks',
    'founder-legal-toolkit': 'Founder Legal Toolkit',
  };

  return titles[leadMagnet] || 'Resource';
}
