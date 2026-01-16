import type {
  EmployeeBackground,
  CompanyDetails,
  CashOffer,
  EquityOffer,
  NegotiationContext,
  CashScore,
  EquityScore,
  TermsScore,
  OverallScore,
  OfferFlag,
  ExitScenario,
  NegotiationSuggestion,
  MissingDataWarning,
} from '@/lib/offer-evaluator-schemas';
import {
  JOB_FAMILY_LABELS,
  JOB_LEVEL_LABELS,
  GEO_LABELS,
  STAGE_LABELS,
  INDUSTRY_LABELS,
  EQUITY_TYPE_LABELS,
  EXERCISE_PERIOD_LABELS,
  ACCELERATION_LABELS,
} from '@/lib/offer-evaluator-schemas';

interface PDFExportData {
  employeeBackground: EmployeeBackground;
  companyDetails: CompanyDetails;
  cashOffer: CashOffer;
  equityOffer: EquityOffer;
  negotiationContext: NegotiationContext;
  cashScore: CashScore;
  equityScore: EquityScore;
  termsScore: TermsScore;
  overallScore: OverallScore;
  flags: OfferFlag[];
  exitScenarios: ExitScenario[];
  probabilityWeightedValue: number;
  suggestions: NegotiationSuggestion[];
  missingDataWarnings: MissingDataWarning[];
  benchmarks: {
    salary: { p25: number; p50: number; p75: number };
    equityPercent: { p25: number; p50: number; p75: number };
    source: string;
  };
}

export function generatePDFContent(data: PDFExportData): string {
  const {
    employeeBackground,
    companyDetails,
    cashOffer,
    equityOffer,
    cashScore,
    equityScore,
    termsScore,
    overallScore,
    flags,
    exitScenarios,
    probabilityWeightedValue,
    suggestions,
    missingDataWarnings,
    benchmarks,
  } = data;

  const totalCash = (cashOffer.baseSalary || 0) +
    (cashOffer.bonusTargetAmount || (cashOffer.baseSalary || 0) * (cashOffer.bonusTargetPercent || 0) / 100) +
    (cashOffer.signingBonus || 0);

  const positiveFlags = flags.filter(f => f.severity === 'positive');
  const warningFlags = flags.filter(f => f.severity === 'warning');
  const criticalFlags = flags.filter(f => f.severity === 'critical');

  const formatCurrency = (n: number | undefined) =>
    n !== undefined ? `$${n.toLocaleString()}` : 'Unknown';

  const formatPercent = (n: number | undefined, decimals = 2) =>
    n !== undefined ? `${n.toFixed(decimals)}%` : 'Unknown';

  // Generate HTML content for PDF
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Offer Analysis Report - VentureCounsel.ai</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.5;
      color: #1e293b;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    h1 { font-size: 24px; margin-bottom: 8px; color: #0f172a; }
    h2 { font-size: 18px; margin: 24px 0 12px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
    h3 { font-size: 14px; margin: 16px 0 8px; color: #334155; }
    p { margin-bottom: 8px; font-size: 13px; }
    .header { border-bottom: 2px solid #1e3a5f; padding-bottom: 16px; margin-bottom: 24px; }
    .subtitle { color: #64748b; font-size: 14px; }
    .score-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 16px;
    }
    .score-large { font-size: 36px; font-weight: bold; color: #1e3a5f; }
    .score-label { font-size: 12px; color: #64748b; text-transform: uppercase; }
    .category { display: inline-block; padding: 4px 12px; border-radius: 16px; font-size: 12px; font-weight: 500; }
    .category-excellent { background: #dcfce7; color: #166534; }
    .category-good { background: #dbeafe; color: #1e40af; }
    .category-fair { background: #fef9c3; color: #854d0e; }
    .category-below-market { background: #fed7aa; color: #c2410c; }
    .category-concerning { background: #fecaca; color: #b91c1c; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 16px; }
    .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
    .stat-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; }
    .stat-value { font-size: 18px; font-weight: 600; color: #0f172a; }
    .stat-label { font-size: 11px; color: #64748b; text-transform: uppercase; }
    .flag { padding: 12px; border-radius: 6px; margin-bottom: 8px; }
    .flag-positive { background: #dcfce7; border: 1px solid #86efac; }
    .flag-warning { background: #fef3c7; border: 1px solid #fcd34d; }
    .flag-critical { background: #fee2e2; border: 1px solid #fca5a5; }
    .flag-title { font-weight: 600; font-size: 13px; }
    .flag-desc { font-size: 12px; margin-top: 4px; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 16px; }
    th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; font-weight: 600; }
    .text-right { text-align: right; }
    .text-emerald { color: #059669; }
    .text-amber { color: #d97706; }
    .suggestion { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; margin-bottom: 8px; }
    .suggestion-number { display: inline-block; width: 20px; height: 20px; border-radius: 50%; background: #1e3a5f; color: white; text-align: center; line-height: 20px; font-size: 11px; font-weight: bold; margin-right: 8px; }
    .non-obvious { border-left: 3px solid #7c3aed; }
    .footer { margin-top: 32px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    .page-break { page-break-before: always; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Offer Analysis Report</h1>
    <p class="subtitle">
      ${JOB_LEVEL_LABELS[employeeBackground.jobLevel] || ''} ${JOB_FAMILY_LABELS[employeeBackground.jobFamily] || ''}
      at ${companyDetails.companyName || 'Company'} (${STAGE_LABELS[companyDetails.stage] || ''})
    </p>
    <p class="subtitle">Generated by VentureCounsel.ai on ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="score-card">
    <div style="display: flex; align-items: center; gap: 24px;">
      <div>
        <div class="score-large">${overallScore.score}</div>
        <div class="score-label">Overall Score</div>
      </div>
      <div>
        <span class="category category-${overallScore.category}">${overallScore.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
        <p style="margin-top: 8px; font-weight: 600;">${overallScore.headline}</p>
        <p style="font-size: 12px; color: #64748b;">${overallScore.paragraph}</p>
      </div>
    </div>
  </div>

  <div class="grid-4">
    <div class="stat-box">
      <div class="stat-label">Year 1 Cash</div>
      <div class="stat-value">${formatCurrency(totalCash)}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Ownership</div>
      <div class="stat-value">${equityScore.percentOfCompany ? formatPercent(equityScore.percentOfCompany, 3) : 'Unknown'}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Paper Value</div>
      <div class="stat-value text-emerald">${equityScore.currentPaperValue ? formatCurrency(equityScore.currentPaperValue) : 'Unknown'}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Expected Value</div>
      <div class="stat-value">${formatCurrency(probabilityWeightedValue)}</div>
    </div>
  </div>

  <h2>Score Breakdown</h2>
  <div class="grid">
    <div class="stat-box">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="stat-label">Cash Compensation</div>
          <p style="font-size: 12px; margin-top: 4px;">${cashScore.verdict}</p>
        </div>
        <div class="score-large" style="font-size: 24px;">${cashScore.score}</div>
      </div>
      <p style="font-size: 11px; color: #64748b; margin-top: 8px;">
        ${cashScore.percentile}th percentile | ${cashScore.baseSalaryVsMedian >= 0 ? '+' : ''}${cashScore.baseSalaryVsMedian}% vs median
      </p>
    </div>
    <div class="stat-box">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <div class="stat-label">Equity Grant</div>
          <p style="font-size: 12px; margin-top: 4px;">${equityScore.verdict}</p>
        </div>
        <div class="score-large" style="font-size: 24px;">${equityScore.score}</div>
      </div>
      <p style="font-size: 11px; color: #64748b; margin-top: 8px;">
        ${equityScore.percentile !== undefined ? `${equityScore.percentile}th percentile` : 'Percentile unknown'}
        ${equityScore.equityVsMedian !== undefined ? ` | ${equityScore.equityVsMedian >= 0 ? '+' : ''}${equityScore.equityVsMedian}% vs median` : ''}
      </p>
    </div>
  </div>
  <div class="stat-box">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <div class="stat-label">Equity Terms</div>
        <p style="font-size: 12px; margin-top: 4px;">${termsScore.verdict}</p>
      </div>
      <div class="score-large" style="font-size: 24px;">${termsScore.score}</div>
    </div>
    <p style="font-size: 11px; color: #64748b; margin-top: 8px;">
      Vesting: ${termsScore.vestingScore} | Exercise: ${termsScore.exerciseScore} | Acceleration: ${termsScore.accelerationScore}
    </p>
  </div>

  <h2>Market Benchmarks</h2>
  <table>
    <tr>
      <th>Metric</th>
      <th class="text-right">Your Offer</th>
      <th class="text-right">P25</th>
      <th class="text-right">P50 (Median)</th>
      <th class="text-right">P75</th>
    </tr>
    <tr>
      <td>Base Salary</td>
      <td class="text-right">${formatCurrency(cashOffer.baseSalary)}</td>
      <td class="text-right">${formatCurrency(benchmarks.salary.p25)}</td>
      <td class="text-right">${formatCurrency(benchmarks.salary.p50)}</td>
      <td class="text-right">${formatCurrency(benchmarks.salary.p75)}</td>
    </tr>
    <tr>
      <td>Equity (% of company)</td>
      <td class="text-right">${equityScore.percentOfCompany ? formatPercent(equityScore.percentOfCompany, 3) : 'Unknown'}</td>
      <td class="text-right">${formatPercent(benchmarks.equityPercent.p25, 3)}</td>
      <td class="text-right">${formatPercent(benchmarks.equityPercent.p50, 3)}</td>
      <td class="text-right">${formatPercent(benchmarks.equityPercent.p75, 3)}</td>
    </tr>
  </table>
  <p style="font-size: 10px; color: #94a3b8;">Source: ${benchmarks.source}</p>

  ${positiveFlags.length > 0 || warningFlags.length > 0 || criticalFlags.length > 0 ? `
  <h2>Key Findings</h2>
  ${criticalFlags.map(f => `
    <div class="flag flag-critical">
      <div class="flag-title">⚠️ ${f.title}</div>
      <div class="flag-desc">${f.description}</div>
      ${f.recommendation ? `<div class="flag-desc" style="margin-top: 4px; font-weight: 500;">Recommendation: ${f.recommendation}</div>` : ''}
    </div>
  `).join('')}
  ${warningFlags.map(f => `
    <div class="flag flag-warning">
      <div class="flag-title">⚡ ${f.title}</div>
      <div class="flag-desc">${f.description}</div>
      ${f.recommendation ? `<div class="flag-desc" style="margin-top: 4px;">${f.recommendation}</div>` : ''}
    </div>
  `).join('')}
  ${positiveFlags.map(f => `
    <div class="flag flag-positive">
      <div class="flag-title">✓ ${f.title}</div>
      <div class="flag-desc">${f.description}</div>
    </div>
  `).join('')}
  ` : ''}

  ${missingDataWarnings.length > 0 ? `
  <h2>Information to Request</h2>
  <table>
    <tr>
      <th>Data Point</th>
      <th>Question to Ask</th>
    </tr>
    ${missingDataWarnings.map(w => `
    <tr>
      <td>${w.displayName}</td>
      <td>"${w.questionToAsk}"</td>
    </tr>
    `).join('')}
  </table>
  ` : ''}

  <div class="page-break"></div>

  <h2>Exit Scenarios</h2>
  <table>
    <tr>
      <th>Scenario</th>
      <th class="text-right">Multiple</th>
      <th class="text-right">Dilution</th>
      <th class="text-right">Years</th>
      <th class="text-right">Probability</th>
      <th class="text-right">Net Value</th>
    </tr>
    ${exitScenarios.map(s => `
    <tr>
      <td>
        <strong>${s.name}</strong><br>
        <span style="font-size: 10px; color: #64748b;">${s.description}</span>
      </td>
      <td class="text-right">${s.exitMultiple}x</td>
      <td class="text-right">${s.dilutionPercent}%</td>
      <td class="text-right">${s.yearsToExit} yrs</td>
      <td class="text-right">${Math.round(s.probability * 100)}%</td>
      <td class="text-right">${formatCurrency(s.netEquityValue)}</td>
    </tr>
    `).join('')}
    <tr style="background: #f8fafc; font-weight: 600;">
      <td colspan="5">Probability-Weighted Expected Value</td>
      <td class="text-right text-emerald">${formatCurrency(probabilityWeightedValue)}</td>
    </tr>
  </table>
  <p style="font-size: 10px; color: #94a3b8;">
    Note: These are illustrative scenarios based on historical startup outcomes. Actual results will vary significantly.
  </p>

  <h2>Negotiation Suggestions</h2>
  ${suggestions.slice(0, 5).map((s, i) => `
  <div class="suggestion ${s.category === 'non-obvious' ? 'non-obvious' : ''}">
    <span class="suggestion-number">${i + 1}</span>
    <strong>${s.title}</strong>
    ${s.category === 'non-obvious' ? '<span style="font-size: 10px; background: #ede9fe; color: #6d28d9; padding: 2px 6px; border-radius: 4px; margin-left: 8px;">Non-obvious</span>' : ''}
    <p style="margin: 4px 0; font-size: 12px;">
      ${s.currentValue} → <strong>${s.suggestedValue}</strong>
    </p>
    <p style="font-size: 11px; color: #64748b;">${s.rationale}</p>
    <p style="font-size: 11px; font-style: italic; margin-top: 8px; color: #475569;">"${s.suggestedLanguage}"</p>
  </div>
  `).join('')}

  <h2>Offer Details Summary</h2>
  <div class="grid">
    <div>
      <h3>Your Background</h3>
      <table>
        <tr><td>Role</td><td>${JOB_LEVEL_LABELS[employeeBackground.jobLevel] || ''} ${JOB_FAMILY_LABELS[employeeBackground.jobFamily] || ''}</td></tr>
        <tr><td>Location</td><td>${GEO_LABELS[employeeBackground.location] || ''}</td></tr>
        <tr><td>Risk Tolerance</td><td>${employeeBackground.riskTolerance?.charAt(0).toUpperCase()}${employeeBackground.riskTolerance?.slice(1) || ''}</td></tr>
      </table>
    </div>
    <div>
      <h3>Company</h3>
      <table>
        <tr><td>Name</td><td>${companyDetails.companyName || 'Not specified'}</td></tr>
        <tr><td>Stage</td><td>${STAGE_LABELS[companyDetails.stage] || ''}</td></tr>
        <tr><td>Industry</td><td>${INDUSTRY_LABELS[companyDetails.industry] || ''}</td></tr>
      </table>
    </div>
  </div>
  <div class="grid">
    <div>
      <h3>Cash Compensation</h3>
      <table>
        <tr><td>Base Salary</td><td>${formatCurrency(cashOffer.baseSalary)}/year</td></tr>
        <tr><td>Target Bonus</td><td>${cashOffer.bonusTargetAmount ? formatCurrency(cashOffer.bonusTargetAmount) : cashOffer.bonusTargetPercent ? `${cashOffer.bonusTargetPercent}%` : 'None'}</td></tr>
        <tr><td>Signing Bonus</td><td>${cashOffer.signingBonus ? formatCurrency(cashOffer.signingBonus) : 'None'}</td></tr>
        <tr style="font-weight: 600;"><td>Year 1 Total</td><td>${formatCurrency(totalCash)}</td></tr>
      </table>
    </div>
    <div>
      <h3>Equity Details</h3>
      <table>
        <tr><td>Type</td><td>${EQUITY_TYPE_LABELS[equityOffer.equityType] || ''}</td></tr>
        <tr><td>Shares</td><td>${equityOffer.shareCount?.toLocaleString() || 'Unknown'}</td></tr>
        <tr><td>Strike Price</td><td>${equityOffer.strikePrice ? `$${equityOffer.strikePrice.toFixed(2)}` : 'Unknown'}</td></tr>
        <tr><td>Vesting</td><td>${equityOffer.vestingTotalMonths || 48} months, ${equityOffer.vestingCliffMonths || 12}mo cliff</td></tr>
        <tr><td>Exercise Period</td><td>${EXERCISE_PERIOD_LABELS[equityOffer.exercisePeriod || 'unknown']}</td></tr>
        <tr><td>Acceleration</td><td>${ACCELERATION_LABELS[equityOffer.accelerationProvision || 'unknown']}</td></tr>
      </table>
    </div>
  </div>

  <div class="footer">
    <p>
      <strong>Disclaimer:</strong> This analysis is for informational purposes only and does not constitute legal, tax, or financial advice.
      Consult with qualified professionals before making decisions about employment offers.
    </p>
    <p style="margin-top: 8px;">
      Generated by VentureCounsel.ai | venturecounsel.ai/offer-evaluator
    </p>
  </div>
</body>
</html>
  `;

  return html;
}

export async function downloadPDF(data: PDFExportData): Promise<void> {
  const htmlContent = generatePDFContent(data);

  // Create a Blob with the HTML content
  const blob = new Blob([htmlContent], { type: 'text/html' });

  // For now, we'll download as HTML since full PDF generation requires a library
  // In production, you could use html2pdf, jspdf, or a server-side PDF generator
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `offer-analysis-${companyDetails.companyName || 'report'}-${new Date().toISOString().split('T')[0]}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to generate companyDetails for the filename
const companyDetails = { companyName: '' };

export function printReport(data: PDFExportData): void {
  const htmlContent = generatePDFContent(data);

  // Open in a new window for printing
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    // Give it time to load styles before printing
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
