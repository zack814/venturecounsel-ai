import type { JobFamily, JobLevel, RoleProfile, GeoMarket, LocationType } from '@/lib/comp-schemas';

interface NormalizationResult {
  roleProfile: Partial<RoleProfile>;
  confidence: number;
  alternativeMappings?: Array<{
    jobFamily: JobFamily;
    jobLevel: JobLevel;
    confidence: number;
  }>;
}

// Title patterns for each job family
const familyPatterns: Record<JobFamily, RegExp[]> = {
  'engineering': [
    /engineer/i, /developer/i, /programmer/i, /swe/i, /software/i, /backend/i,
    /frontend/i, /full.?stack/i, /devops/i, /sre/i, /platform/i, /infrastructure/i,
    /mobile/i, /ios/i, /android/i, /web/i, /qa/i, /quality/i, /test/i, /embedded/i,
    /firmware/i, /systems/i, /security.*(eng|dev)/i, /ml.*(eng|dev)/i, /ai.*(eng|dev)/i,
    /data.*(eng)/i, /architect/i
  ],
  'product': [
    /product\s*(manager|mgr|management)/i, /pm\b/i, /product\s*lead/i,
    /product\s*owner/i, /technical\s*pm/i, /tpm/i, /program\s*manager/i
  ],
  'design': [
    /design/i, /ux/i, /ui/i, /visual/i, /graphic/i, /creative/i, /brand/i,
    /illustrat/i, /product\s*design/i
  ],
  'data-science': [
    /data\s*scien/i, /machine\s*learning/i, /ml\b/i, /ai\b/i, /research\s*scien/i,
    /analytics/i, /data\s*analyst/i, /business\s*intelligence/i, /bi\s*analyst/i,
    /statistician/i, /quant/i
  ],
  'marketing': [
    /marketing/i, /growth/i, /content/i, /seo/i, /sem/i, /social\s*media/i,
    /brand/i, /communications/i, /pr\b/i, /public\s*relations/i, /demand\s*gen/i,
    /acquisition/i, /lifecycle/i, /email/i, /community/i
  ],
  'sales': [
    /sales/i, /account\s*exec/i, /ae\b/i, /sdr/i, /bdr/i, /business\s*develop/i,
    /revenue/i, /partnerships/i, /alliances/i, /channel/i, /enterprise/i,
    /commercial/i, /solutions?\s*(consultant|engineer)/i
  ],
  'operations': [
    /operations/i, /ops\b/i, /supply\s*chain/i, /logistics/i, /procurement/i,
    /facilities/i, /it\s*(manager|director)/i, /business\s*ops/i, /strategy/i,
    /chief\s*of\s*staff/i, /project\s*manager/i, /office\s*manager/i
  ],
  'finance': [
    /financ/i, /account/i, /controller/i, /treasury/i, /tax/i, /audit/i,
    /fp&a/i, /financial\s*planning/i, /payroll/i, /billing/i, /revenue\s*ops/i,
    /bookkeep/i
  ],
  'legal': [
    /legal/i, /counsel/i, /attorney/i, /lawyer/i, /compliance/i, /regulatory/i,
    /contracts/i, /ip\b/i, /intellectual\s*property/i, /paralegal/i, /privacy/i
  ],
  'hr-people': [
    /hr\b/i, /human\s*resources/i, /people/i, /talent/i, /recruit/i, /hiring/i,
    /compensation/i, /benefits/i, /learning/i, /training/i, /development/i,
    /culture/i, /employee\s*experience/i, /dei/i, /diversity/i
  ],
  'customer-success': [
    /customer\s*success/i, /cs\s*(manager|lead)/i, /csm\b/i, /support/i,
    /customer\s*service/i, /customer\s*experience/i, /cx\b/i, /implementation/i,
    /onboarding/i, /solutions?\s*(architect|specialist)/i, /technical\s*account/i
  ],
  'executive': [
    /^ceo$/i, /^cto$/i, /^cfo$/i, /^coo$/i, /^cmo$/i, /^cpo$/i, /^cro$/i,
    /^ciso$/i, /^clo$/i, /^chro$/i, /chief\s*(executive|technology|financial|operating|marketing|product|revenue|information|legal|people)/i,
    /president/i, /founder/i, /co-?founder/i, /managing\s*director/i
  ]
};

// Level patterns
const levelPatterns: Record<JobLevel, RegExp[]> = {
  'intern': [/intern/i, /co-?op/i, /trainee/i, /apprentice/i],
  'junior': [/junior/i, /jr\.?/i, /entry/i, /associate/i, /\bI\b/, /\b1\b/],
  'mid': [/mid/i, /\bII\b/, /\b2\b/],
  'senior': [/senior/i, /sr\.?/i, /\bIII\b/, /\b3\b/, /lead(?!er)/i],
  'staff': [/staff/i, /\bIV\b/, /\b4\b/, /principal(?!\s*(architect|fellow))/i],
  'principal': [/principal/i, /distinguished/i, /fellow/i, /\bV\b/, /\b5\b/],
  'director': [/director/i, /head\s*of/i, /manager/i],
  'vp': [/vice\s*president/i, /vp\b/i, /svp/i, /evp/i],
  'c-level': [
    /^c[a-z]o$/i, /chief/i, /president/i, /founder/i, /co-?founder/i,
    /managing\s*director/i, /general\s*manager/i
  ]
};

// Patterns that indicate higher seniority
const seniorityBoostPatterns = [
  { pattern: /lead/i, boost: 1 },
  { pattern: /manager/i, boost: 2 },
  { pattern: /head/i, boost: 2 },
  { pattern: /director/i, boost: 3 },
  { pattern: /vp/i, boost: 4 },
  { pattern: /vice\s*president/i, boost: 4 },
  { pattern: /chief/i, boost: 5 },
];

export function normalizeRole(
  title: string,
  context?: string
): NormalizationResult {
  const normalizedTitle = title.trim();
  const combinedText = context ? `${normalizedTitle} ${context}` : normalizedTitle;

  // Detect job family
  let detectedFamily: JobFamily | null = null;
  let familyConfidence = 0;

  for (const [family, patterns] of Object.entries(familyPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(combinedText)) {
        const isExactMatch = pattern.test(normalizedTitle);
        const confidence = isExactMatch ? 0.9 : 0.7;
        if (confidence > familyConfidence) {
          familyConfidence = confidence;
          detectedFamily = family as JobFamily;
        }
      }
    }
  }

  // Detect job level
  let detectedLevel: JobLevel = 'mid'; // Default
  let levelConfidence = 0.5;

  for (const [level, patterns] of Object.entries(levelPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedTitle)) {
        levelConfidence = 0.85;
        detectedLevel = level as JobLevel;
        break;
      }
    }
    if (levelConfidence > 0.8) break;
  }

  // Apply seniority boost patterns
  if (levelConfidence < 0.8) {
    for (const { pattern, boost } of seniorityBoostPatterns) {
      if (pattern.test(normalizedTitle)) {
        const levels: JobLevel[] = ['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'director', 'vp', 'c-level'];
        const currentIndex = levels.indexOf(detectedLevel);
        const newIndex = Math.min(currentIndex + boost, levels.length - 1);
        detectedLevel = levels[newIndex];
        levelConfidence = 0.7;
        break;
      }
    }
  }

  // Generate normalized title
  const normalizedTitleStr = generateNormalizedTitle(detectedFamily, detectedLevel);

  // Calculate overall confidence
  const overallConfidence = Math.round(
    ((familyConfidence + levelConfidence) / 2) * 100
  );

  // Generate alternative mappings if confidence is low
  const alternatives: NormalizationResult['alternativeMappings'] = [];
  if (overallConfidence < 70) {
    // Add alternative family/level combinations
    const familyAlternatives = findAlternativeFamilies(combinedText, detectedFamily);
    for (const alt of familyAlternatives) {
      alternatives.push({
        jobFamily: alt.family,
        jobLevel: detectedLevel,
        confidence: alt.confidence,
      });
    }
  }

  return {
    roleProfile: {
      title: normalizedTitle,
      normalizedTitle: normalizedTitleStr,
      jobFamily: detectedFamily ?? 'operations',
      jobLevel: detectedLevel,
    },
    confidence: overallConfidence,
    alternativeMappings: alternatives.length > 0 ? alternatives : undefined,
  };
}

function generateNormalizedTitle(family: JobFamily | null, level: JobLevel): string {
  const familyTitles: Record<JobFamily, string> = {
    'engineering': 'Software Engineer',
    'product': 'Product Manager',
    'design': 'Designer',
    'data-science': 'Data Scientist',
    'marketing': 'Marketing Manager',
    'sales': 'Account Executive',
    'operations': 'Operations Manager',
    'finance': 'Finance Manager',
    'legal': 'Counsel',
    'hr-people': 'People Operations',
    'customer-success': 'Customer Success Manager',
    'executive': 'Executive',
  };

  const levelPrefixes: Record<JobLevel, string> = {
    'intern': 'Intern',
    'junior': 'Junior',
    'mid': '',
    'senior': 'Senior',
    'staff': 'Staff',
    'principal': 'Principal',
    'director': 'Director of',
    'vp': 'VP of',
    'c-level': 'Chief',
  };

  const baseTitle = family ? familyTitles[family] : 'Professional';
  const prefix = levelPrefixes[level];

  if (level === 'c-level') {
    return getCLevelTitle(family);
  }

  if (level === 'director' || level === 'vp') {
    return `${prefix} ${getFunctionName(family)}`;
  }

  if (prefix) {
    return `${prefix} ${baseTitle}`;
  }

  return baseTitle;
}

function getCLevelTitle(family: JobFamily | null): string {
  const cLevelTitles: Record<JobFamily, string> = {
    'engineering': 'Chief Technology Officer',
    'product': 'Chief Product Officer',
    'design': 'Chief Design Officer',
    'data-science': 'Chief Data Officer',
    'marketing': 'Chief Marketing Officer',
    'sales': 'Chief Revenue Officer',
    'operations': 'Chief Operating Officer',
    'finance': 'Chief Financial Officer',
    'legal': 'General Counsel',
    'hr-people': 'Chief People Officer',
    'customer-success': 'Chief Customer Officer',
    'executive': 'Chief Executive Officer',
  };
  return family ? cLevelTitles[family] : 'Chief Executive Officer';
}

function getFunctionName(family: JobFamily | null): string {
  const functionNames: Record<JobFamily, string> = {
    'engineering': 'Engineering',
    'product': 'Product',
    'design': 'Design',
    'data-science': 'Data Science',
    'marketing': 'Marketing',
    'sales': 'Sales',
    'operations': 'Operations',
    'finance': 'Finance',
    'legal': 'Legal',
    'hr-people': 'People',
    'customer-success': 'Customer Success',
    'executive': 'Strategy',
  };
  return family ? functionNames[family] : 'Operations';
}

function findAlternativeFamilies(
  text: string,
  excludeFamily: JobFamily | null
): Array<{ family: JobFamily; confidence: number }> {
  const alternatives: Array<{ family: JobFamily; confidence: number }> = [];

  for (const [family, patterns] of Object.entries(familyPatterns)) {
    if (family === excludeFamily) continue;

    for (const pattern of patterns) {
      if (pattern.test(text)) {
        alternatives.push({
          family: family as JobFamily,
          confidence: 50,
        });
        break;
      }
    }
  }

  return alternatives.slice(0, 3);
}

// Helper to detect location info from title/context
export function detectLocation(text: string): {
  locationType: LocationType;
  geo: GeoMarket;
} | null {
  const remotePatterns = [/remote/i, /distributed/i, /anywhere/i, /wfh/i];
  const hybridPatterns = [/hybrid/i, /flexible/i];
  const locationPatterns: Array<{ pattern: RegExp; geo: GeoMarket }> = [
    { pattern: /san\s*francisco|sf\b|bay\s*area|silicon\s*valley|palo\s*alto|mountain\s*view/i, geo: 'sv' },
    { pattern: /new\s*york|nyc|manhattan|brooklyn/i, geo: 'nyc' },
    { pattern: /los\s*angeles|la\b|santa\s*monica/i, geo: 'la' },
    { pattern: /seattle|bellevue/i, geo: 'seattle' },
    { pattern: /austin|texas/i, geo: 'austin' },
    { pattern: /boston|cambridge/i, geo: 'boston' },
    { pattern: /denver|colorado/i, geo: 'denver' },
    { pattern: /chicago/i, geo: 'chicago' },
  ];

  for (const pattern of remotePatterns) {
    if (pattern.test(text)) {
      return { locationType: 'remote', geo: 'remote-us' };
    }
  }

  for (const pattern of hybridPatterns) {
    if (pattern.test(text)) {
      // Check for specific geo
      for (const { pattern: geoPattern, geo } of locationPatterns) {
        if (geoPattern.test(text)) {
          return { locationType: 'hybrid', geo };
        }
      }
      return { locationType: 'hybrid', geo: 'sv' };
    }
  }

  for (const { pattern: geoPattern, geo } of locationPatterns) {
    if (geoPattern.test(text)) {
      return { locationType: 'onsite', geo };
    }
  }

  return null;
}
