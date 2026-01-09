// SAFE Document Template Generator
// Based on Y Combinator SAFE templates - generates document structure with placeholders

import type { SafeType, CompanyInfo, InvestorInfo, SafeTerms, SideLetterSelections } from './safe-types';
import { formatUSD, formatValuation, SIDE_LETTER_OPTIONS } from './safe-types';

export interface SafeDocumentData {
  safeType: SafeType;
  terms: Partial<SafeTerms>;
  company: Partial<CompanyInfo>;
  investor: Partial<InvestorInfo>;
  sideLetters: SideLetterSelections;
}

// Format date as "Month Day, Year"
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Get investor display name
function getInvestorName(investor: Partial<InvestorInfo>): string {
  if (investor.type === 'entity') {
    return investor.entityName || '[INVESTOR ENTITY NAME]';
  }
  return investor.legalName || '[INVESTOR NAME]';
}

// Get investor address block
function getInvestorAddress(investor: Partial<InvestorInfo>): string {
  const parts = [
    investor.address || '[ADDRESS]',
    `${investor.city || '[CITY]'}, ${investor.state || '[STATE]'} ${investor.zipCode || '[ZIP]'}`,
  ];
  return parts.join('\n');
}

// Get company address block
function getCompanyAddress(company: Partial<CompanyInfo>): string {
  const parts = [
    company.address || '[ADDRESS]',
    `${company.city || '[CITY]'}, ${company.state || '[STATE]'} ${company.zipCode || '[ZIP]'}`,
  ];
  return parts.join('\n');
}

// Generate SAFE type description
function getSafeTypeDescription(safeType: SafeType): string {
  const descriptions: Record<SafeType, string> = {
    'post-money-cap': 'Post-Money SAFE with Valuation Cap',
    'post-money-discount': 'Post-Money SAFE with Discount',
    'post-money-mfn': 'Post-Money SAFE with Most Favored Nation Provision',
    'pre-money-cap': 'Pre-Money SAFE with Valuation Cap',
    'pre-money-discount': 'Pre-Money SAFE with Discount',
  };
  return descriptions[safeType];
}

// Generate the main SAFE document content
export function generateSafeDocument(data: SafeDocumentData): string {
  const { safeType, terms, company, investor } = data;

  const companyName = company.legalName || '[COMPANY NAME]';
  const investorName = getInvestorName(investor);
  const purchaseDate = terms.purchaseDate ? formatDate(terms.purchaseDate) : '[DATE]';
  const purchaseAmount = terms.investmentAmount ? formatUSD(terms.investmentAmount) : '[PURCHASE AMOUNT]';
  const stateOfIncorp = company.stateOfIncorporation || 'Delaware';

  let termsSection = '';

  if (safeType.includes('cap')) {
    const capAmount = terms.valuationCap ? formatValuation(terms.valuationCap) : '[VALUATION CAP]';
    termsSection = `
VALUATION CAP: ${capAmount}

The "Post-Money Valuation Cap" is ${capAmount}. This SAFE will convert into shares of Safe Preferred Stock at a price per share equal to the Post-Money Valuation Cap divided by the Company Capitalization.`;
  } else if (safeType.includes('discount')) {
    const discount = terms.discountRate || 20;
    termsSection = `
DISCOUNT RATE: ${discount}%

The "Discount Rate" is ${100 - discount}%. This SAFE will convert into shares of Safe Preferred Stock at a price per share equal to the price per share of the Standard Preferred Stock sold in the Equity Financing multiplied by the Discount Rate.`;
  } else if (safeType === 'post-money-mfn') {
    termsSection = `
MOST FAVORED NATION PROVISION

This SAFE includes an MFN provision. If the Company issues any subsequent SAFEs with terms more favorable to those investors (including any valuation cap or discount), the Investor may elect to have this SAFE amended to include such more favorable terms.`;
  }

  const document = `
================================================================================
                    SIMPLE AGREEMENT FOR FUTURE EQUITY
                         ${getSafeTypeDescription(safeType)}
================================================================================

THIS INSTRUMENT AND ANY SECURITIES ISSUABLE PURSUANT HERETO HAVE NOT BEEN
REGISTERED UNDER THE SECURITIES ACT OF 1933, AS AMENDED, OR UNDER THE SECURITIES
LAWS OF CERTAIN STATES. THESE SECURITIES MAY NOT BE OFFERED, SOLD OR OTHERWISE
TRANSFERRED, PLEDGED OR HYPOTHECATED EXCEPT AS PERMITTED UNDER SUCH ACT AND
APPLICABLE STATE SECURITIES LAWS PURSUANT TO AN EFFECTIVE REGISTRATION STATEMENT
OR AN EXEMPTION THEREFROM.

--------------------------------------------------------------------------------
                              PARTIES
--------------------------------------------------------------------------------

COMPANY:        ${companyName}
                a ${stateOfIncorp} corporation
                ${getCompanyAddress(company)}

INVESTOR:       ${investorName}
                ${getInvestorAddress(investor)}

DATE:           ${purchaseDate}

--------------------------------------------------------------------------------
                           PURCHASE AMOUNT
--------------------------------------------------------------------------------

${purchaseAmount} (the "Purchase Amount")

${termsSection}

--------------------------------------------------------------------------------
                              EVENTS
--------------------------------------------------------------------------------

1. EQUITY FINANCING

   Upon the closing of an Equity Financing, this SAFE will automatically convert
   into shares of Safe Preferred Stock at the applicable conversion price.

2. LIQUIDITY EVENT

   If there is a Liquidity Event before the termination of this SAFE, the
   Investor will receive the greater of (i) the Purchase Amount or (ii) the
   amount payable on the number of shares of Common Stock equal to the Purchase
   Amount divided by the Liquidity Price.

3. DISSOLUTION EVENT

   If there is a Dissolution Event before the termination of this SAFE, the
   Company will pay an amount equal to the Purchase Amount, subject to the
   payment preferences of any other securities.

--------------------------------------------------------------------------------
                           DEFINITIONS
--------------------------------------------------------------------------------

"Company Capitalization" means the sum of: (a) all shares of Capital Stock
(on an as-converted basis) issued and outstanding, assuming exercise or
conversion of all outstanding vested and unvested options, warrants and other
convertible securities, but excluding (i) this SAFE, (ii) all other SAFEs, and
(iii) convertible promissory notes; and (b) all shares of Common Stock reserved
and available for future grant under any equity incentive or similar plan.

"Equity Financing" means a bona fide transaction or series of transactions with
the principal purpose of raising capital, pursuant to which the Company issues
and sells Preferred Stock at a fixed valuation.

"Liquidity Event" means a Change of Control or an Initial Public Offering.

"Safe Preferred Stock" means the shares of a series of Preferred Stock issued
to the Investor in an Equity Financing, having the identical rights, privileges,
preferences and restrictions as the shares of Standard Preferred Stock, other
than with respect to the per share liquidation preference and the conversion
price for purposes of price-based anti-dilution protection.

--------------------------------------------------------------------------------
                    INVESTOR REPRESENTATIONS
--------------------------------------------------------------------------------

The Investor represents that:

(a) The Investor has full legal capacity, power and authority to execute and
    deliver this SAFE and to perform its obligations hereunder.

(b) The Investor is an "accredited investor" as such term is defined in
    Rule 501 of Regulation D under the Securities Act.

(c) The Investor is acquiring this SAFE and the securities to be acquired by
    the Investor hereunder for its own account for investment, not as a nominee
    or agent, and not with a view to, or for resale in connection with, the
    distribution thereof.

--------------------------------------------------------------------------------
                         MISCELLANEOUS
--------------------------------------------------------------------------------

This SAFE shall be governed by the laws of the State of ${stateOfIncorp},
without regard to the conflicts of law provisions thereof.

Any dispute arising out of or relating to this SAFE shall be submitted to
binding arbitration in accordance with the commercial arbitration rules of
the American Arbitration Association.

This SAFE may be executed in counterparts, each of which shall be deemed an
original.

--------------------------------------------------------------------------------
                          SIGNATURES
--------------------------------------------------------------------------------

IN WITNESS WHEREOF, the undersigned have executed this SAFE as of the date
first written above.

COMPANY:

${companyName}


By: ___________________________________
Name: ${company.founderName || '[SIGNATORY NAME]'}
Title: ${company.founderTitle || '[TITLE]'}


INVESTOR:

${investorName}


By: ___________________________________
Name: ${investor.type === 'entity' ? (investor.legalName || '[AUTHORIZED SIGNATORY]') : investorName}
${investor.type === 'entity' ? 'Title: ___________________________________' : ''}

================================================================================
                              END OF DOCUMENT
================================================================================

DOCUMENT INFORMATION
--------------------
Generated by VentureCounsel.AI
Based on Y Combinator SAFE Template

This document is provided for informational purposes only and does not
constitute legal advice. Please consult with a qualified attorney before
executing any legal documents.

Template Version: Post-Money SAFE (2023)
Generated: ${new Date().toLocaleDateString()}
`;

  return document.trim();
}

// Generate side letter document
export function generateSideLetter(data: SafeDocumentData): string | null {
  const { sideLetters, company, investor, terms } = data;

  const enabledLetters = SIDE_LETTER_OPTIONS.filter(opt => sideLetters[opt.id]?.enabled);

  if (enabledLetters.length === 0) {
    return null;
  }

  const companyName = company.legalName || '[COMPANY NAME]';
  const investorName = getInvestorName(investor);
  const purchaseDate = terms.purchaseDate ? formatDate(terms.purchaseDate) : '[DATE]';
  const purchaseAmount = terms.investmentAmount ? formatUSD(terms.investmentAmount) : '[PURCHASE AMOUNT]';

  let rightsSection = '';

  enabledLetters.forEach((option, index) => {
    const selection = sideLetters[option.id];
    const fields = selection.fields || {};

    rightsSection += `
${index + 1}. ${option.name.toUpperCase()}

`;

    switch (option.id) {
      case 'pro-rata':
        const proRataThreshold = fields['pro-rata-threshold'] as number || 100000;
        rightsSection += `   The Company agrees that, subject to the Investor having invested at least
   ${formatUSD(proRataThreshold)} in the Company through one or more SAFEs or equity investments,
   the Investor shall have the right to participate in subsequent financing rounds
   on a pro-rata basis, based on the Investor's percentage ownership of the Company's
   fully-diluted capitalization at the time of such financing.

   This pro-rata right shall apply to any private placement of equity or equity-linked
   securities by the Company, and shall terminate upon the earlier of (i) the Company's
   initial public offering or (ii) a Change of Control event.
`;
        break;

      case 'info-rights':
        const infoThreshold = fields['info-rights-threshold'] as number || 250000;
        const frequency = fields['info-rights-frequency'] as string || 'quarterly';
        const freqText = frequency === 'monthly' ? 'monthly' : frequency === 'annually' ? 'annual' : 'quarterly';
        rightsSection += `   The Company agrees that, subject to the Investor having invested at least
   ${formatUSD(infoThreshold)} in the Company, the Company shall provide the Investor with:

   (a) ${freqText.charAt(0).toUpperCase() + freqText.slice(1)} financial reports, including unaudited income statement,
       balance sheet, and cash flow statement;

   (b) Annual audited financial statements (if prepared);

   (c) Annual budget and operating plan within 30 days of the start of each fiscal year;

   (d) Prompt notice of any material events affecting the Company.

   These information rights shall terminate upon the earlier of (i) the Company's
   initial public offering or (ii) a Change of Control event.
`;
        break;

      case 'mfn':
        rightsSection += `   The Company agrees that if, during the period between the date hereof and the
   earlier of (i) the termination of the SAFE or (ii) the closing of an Equity
   Financing, the Company issues any other SAFEs (each, a "Subsequent SAFE") with
   terms more favorable to the investors in such Subsequent SAFE than those set
   forth in the Investor's SAFE, then upon written request from the Investor,
   the Company shall amend the Investor's SAFE to incorporate such more favorable
   terms.

   More favorable terms include, but are not limited to: a lower valuation cap,
   a higher discount rate, or additional investor protections not included in
   the Investor's SAFE.
`;
        break;

      case 'board-observer':
        rightsSection += `   The Company agrees to permit the Investor (or a designee of the Investor) to
   attend all meetings of the Company's Board of Directors in a non-voting,
   observer capacity. The Investor shall:

   (a) Receive all materials provided to Board members at the same time such
       materials are provided to the Board;

   (b) Be permitted to participate in discussions at Board meetings;

   (c) Be bound by the same confidentiality obligations as Board members.

   The Company may exclude the Investor from portions of meetings or materials
   where the Board determines in good faith that such exclusion is necessary
   to preserve attorney-client privilege or in the case of a conflict of interest.

   This right shall terminate upon the earlier of (i) the Company's initial
   public offering, (ii) a Change of Control event, or (iii) the Investor
   ceasing to hold at least 1% of the Company's fully-diluted capitalization.
`;
        break;

      case 'major-investor':
        const majorThreshold = fields['major-investor-threshold'] as number || 250000;
        rightsSection += `   The Company agrees that, subject to the Investor having invested at least
   ${formatUSD(majorThreshold)} in the Company through one or more SAFEs or equity investments,
   the Investor shall be designated a "Major Investor" in any subsequent Investors'
   Rights Agreement or similar agreement entered into by the Company in connection
   with an Equity Financing.

   As a Major Investor, the Investor shall be entitled to all rights and privileges
   granted to Major Investors in such agreement, which typically include:

   (a) Information rights (financial statements, budget, etc.);
   (b) Pro-rata rights to participate in future financings;
   (c) Such other rights as are granted to Major Investors.
`;
        break;
    }

    rightsSection += '\n';
  });

  const document = `
================================================================================
                              SIDE LETTER
                    to Simple Agreement for Future Equity
================================================================================

DATE: ${purchaseDate}

--------------------------------------------------------------------------------
                              PARTIES
--------------------------------------------------------------------------------

This Side Letter (this "Letter") is entered into by and between:

COMPANY:        ${companyName}
                ${getCompanyAddress(company)}

INVESTOR:       ${investorName}
                ${getInvestorAddress(investor)}

--------------------------------------------------------------------------------
                            BACKGROUND
--------------------------------------------------------------------------------

WHEREAS, the Company and the Investor are entering into a Simple Agreement for
Future Equity dated as of the date hereof (the "SAFE") pursuant to which the
Investor is investing ${purchaseAmount} in the Company;

WHEREAS, in connection with such investment, the Company desires to grant the
Investor certain additional rights as set forth herein;

NOW, THEREFORE, in consideration of the mutual covenants and agreements set
forth herein and in the SAFE, the parties agree as follows:

--------------------------------------------------------------------------------
                         ADDITIONAL RIGHTS
--------------------------------------------------------------------------------

${rightsSection}
--------------------------------------------------------------------------------
                           GENERAL TERMS
--------------------------------------------------------------------------------

1. RELATIONSHIP TO SAFE

   This Letter is supplemental to the SAFE and is subject to all of the terms
   and conditions thereof. In the event of any conflict between this Letter
   and the SAFE, this Letter shall control.

2. CONFIDENTIALITY

   The terms of this Letter are confidential and shall not be disclosed by
   either party without the prior written consent of the other party, except
   as required by law or in connection with any legal proceeding.

3. AMENDMENT

   This Letter may only be amended by a written instrument signed by both
   parties hereto.

4. GOVERNING LAW

   This Letter shall be governed by and construed in accordance with the laws
   of the State of ${company.stateOfIncorporation || 'Delaware'}, without regard to its conflicts of
   law provisions.

--------------------------------------------------------------------------------
                          SIGNATURES
--------------------------------------------------------------------------------

IN WITNESS WHEREOF, the undersigned have executed this Side Letter as of the
date first written above.

COMPANY:

${companyName}


By: ___________________________________
Name: ${company.founderName || '[SIGNATORY NAME]'}
Title: ${company.founderTitle || '[TITLE]'}


INVESTOR:

${investorName}


By: ___________________________________
Name: ${investor.type === 'entity' ? (investor.legalName || '[AUTHORIZED SIGNATORY]') : investorName}
${investor.type === 'entity' ? 'Title: ___________________________________' : ''}

================================================================================
                              END OF DOCUMENT
================================================================================

DOCUMENT INFORMATION
--------------------
Generated by VentureCounsel.AI
Side Letter to SAFE Agreement

This document is provided for informational purposes only and does not
constitute legal advice. Please consult with a qualified attorney before
executing any legal documents.

Generated: ${new Date().toLocaleDateString()}
`;

  return document.trim();
}

// Generate summary of documents
export function generateDocumentSummary(data: SafeDocumentData): {
  investorOwnership: string;
  keyTerms: { label: string; value: string }[];
  warnings: string[];
  nextSteps: string[];
} {
  const { safeType, terms, company, investor, sideLetters } = data;

  // Calculate ownership if possible
  let investorOwnership = 'N/A';
  if (safeType.includes('cap') && terms.investmentAmount && terms.valuationCap) {
    const isPostMoney = safeType.includes('post-money');
    if (isPostMoney) {
      const ownership = (terms.investmentAmount / terms.valuationCap) * 100;
      investorOwnership = `${ownership.toFixed(2)}% at cap`;
    } else {
      const ownership = (terms.investmentAmount / (terms.valuationCap + terms.investmentAmount)) * 100;
      investorOwnership = `~${ownership.toFixed(2)}% at cap (pre-money)`;
    }
  } else if (safeType.includes('discount')) {
    investorOwnership = `${terms.discountRate}% discount on Series A`;
  } else if (safeType === 'post-money-mfn') {
    investorOwnership = 'Terms match best future SAFE';
  }

  // Build key terms list
  const keyTerms: { label: string; value: string }[] = [
    { label: 'SAFE Type', value: getSafeTypeDescription(safeType) },
    { label: 'Investment Amount', value: terms.investmentAmount ? formatUSD(terms.investmentAmount) : 'Not specified' },
  ];

  if (safeType.includes('cap')) {
    keyTerms.push({
      label: 'Valuation Cap',
      value: terms.valuationCap ? formatValuation(terms.valuationCap) : 'Not specified',
    });
  }

  if (safeType.includes('discount')) {
    keyTerms.push({
      label: 'Discount Rate',
      value: terms.discountRate ? `${terms.discountRate}%` : 'Not specified',
    });
  }

  keyTerms.push({
    label: 'Purchase Date',
    value: terms.purchaseDate ? formatDate(terms.purchaseDate) : 'Not specified',
  });

  // Check for enabled side letters
  const enabledLetters = SIDE_LETTER_OPTIONS.filter(opt => sideLetters[opt.id]?.enabled);
  if (enabledLetters.length > 0) {
    keyTerms.push({
      label: 'Side Letter Rights',
      value: enabledLetters.map(l => l.name).join(', '),
    });
  }

  // Generate warnings
  const warnings: string[] = [];

  if (!investor.isAccredited) {
    warnings.push('Investor has not certified accredited investor status. SAFEs are typically only offered to accredited investors.');
  }

  if (company.stateOfIncorporation && company.stateOfIncorporation !== 'DE') {
    warnings.push(`Company is incorporated in ${company.stateOfIncorporation}. Most VCs expect Delaware incorporation.`);
  }

  if (safeType.includes('pre-money')) {
    warnings.push('Pre-money SAFEs were deprecated by YC in 2018. Consider using a post-money SAFE instead.');
  }

  if (safeType === 'post-money-mfn') {
    warnings.push('MFN SAFEs create complexity when you issue future SAFEs with different terms.');
  }

  // Generate next steps
  const nextSteps: string[] = [
    'Have both parties review the documents carefully',
    'Consult with a qualified attorney before signing',
    'Ensure the investor provides proof of accredited investor status',
    'Execute documents and wire the investment amount',
    'File the SAFE with your cap table management system',
    'Update your 409A valuation provider about the new investment',
  ];

  if (enabledLetters.length > 0) {
    nextSteps.splice(2, 0, 'Review side letter provisions with legal counsel');
  }

  return {
    investorOwnership,
    keyTerms,
    warnings,
    nextSteps,
  };
}
