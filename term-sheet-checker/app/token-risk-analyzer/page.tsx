'use client';

import { useState, useEffect, useRef } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface EntityComponent {
  id: string;
  type: string;
  jurisdiction: string;
  role: string;
  description: string;
}

interface FormData {
  // Section 1: Token Mechanics
  tokenName: string;
  tokenSymbol: string;
  tokenFeatures: string[];
  tokenDescription: string;
  blockchain: string;
  totalSupply: string;
  isSupplyFixed: string;
  hasLaunched: string;
  launchDate: string;
  currentUtility: string;
  plannedUtility: string;

  // Section 2: Distribution & Sales
  distributionMethods: string[];
  distributionDescription: string;
  hasConductedSale: string;
  saleDescription: string;
  totalRaised: string;
  purchaserTypes: string[];
  hasLockups: string;
  lockupDetails: string;
  allocationBreakdown: string;

  // Section 3: Entity Structure
  hasEntity: string;
  entityStructure: EntityComponent[];
  structureRationale: string;

  // Section 4: Team & Control
  teamDescription: string;
  teamSize: string;
  keyPersonDependency: string;
  governanceModel: string;
  governanceDescription: string;
  technicalControls: string[];
  decentralizationPlans: string;

  // Section 5: Marketing & Communications
  marketingChannels: string[];
  marketingDescription: string;
  priceDiscussion: string;
  returnPromises: string;
  investmentLanguage: string;
  communityEngagement: string;

  // Section 6: US Exposure
  usTargeting: string;
  usMarketingEfforts: string;
  usResidentAccess: string;
  geoRestrictions: string;
  kycAml: string;
  regulatoryConsultation: string;
  additionalContext: string;
}

interface ConcernItem {
  category: string;
  concern: string;
  severity: 'significant' | 'elevated' | 'notable';
  secPerspective: string;
  mitigation: string;
}

interface Analysis {
  overallAssessment: {
    level: 'significant' | 'elevated' | 'notable';
    summary: string;
    secPerspective: string;
  };
  howeyAnalysis: {
    investmentOfMoney: { concerns: string[]; mitigators: string[]; secView: string };
    commonEnterprise: { concerns: string[]; mitigators: string[]; secView: string };
    expectationOfProfits: { concerns: string[]; mitigators: string[]; secView: string };
    effortsOfOthers: { concerns: string[]; mitigators: string[]; secView: string };
  };
  keyConcerns: ConcernItem[];
  mitigatingFactors: string[];
  criticalActions: string[];
  counselGuidance: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const ENTITY_TYPES = [
  { value: 'delaware-c-corp', label: 'Delaware C-Corporation' },
  { value: 'delaware-llc', label: 'Delaware LLC' },
  { value: 'wyoming-llc', label: 'Wyoming LLC (DAO-friendly)' },
  { value: 'cayman-foundation', label: 'Cayman Foundation Company' },
  { value: 'cayman-exempted', label: 'Cayman Exempted Company' },
  { value: 'bvi-company', label: 'BVI Business Company' },
  { value: 'singapore-pte', label: 'Singapore Private Limited' },
  { value: 'swiss-foundation', label: 'Swiss Foundation' },
  { value: 'swiss-ag', label: 'Swiss AG' },
  { value: 'panama-foundation', label: 'Panama Foundation' },
  { value: 'marshall-dao', label: 'Marshall Islands DAO LLC' },
  { value: 'other', label: 'Other' },
];

const ENTITY_ROLES = [
  { value: 'token-issuer', label: 'Token Issuer' },
  { value: 'protocol-developer', label: 'Protocol Developer' },
  { value: 'ip-holder', label: 'IP Holder' },
  { value: 'foundation', label: 'Foundation / Ecosystem Support' },
  { value: 'operations', label: 'Operations / Services' },
  { value: 'treasury', label: 'Treasury Management' },
  { value: 'governance', label: 'Governance Coordination' },
];

const COMMON_STRUCTURES = [
  {
    name: 'US DevCo + Offshore Foundation',
    description: 'Common structure: US company for development, offshore foundation for token issuance',
    entities: [
      { type: 'delaware-c-corp', jurisdiction: 'Delaware, USA', role: 'protocol-developer' },
      { type: 'cayman-foundation', jurisdiction: 'Cayman Islands', role: 'token-issuer' },
    ],
  },
  {
    name: 'Pure Foundation Model',
    description: 'Single foundation structure for non-profit ecosystem development',
    entities: [
      { type: 'cayman-foundation', jurisdiction: 'Cayman Islands', role: 'token-issuer' },
    ],
  },
  {
    name: 'Multi-Jurisdictional',
    description: 'DevCo + Foundation + Operating subsidiary structure',
    entities: [
      { type: 'delaware-c-corp', jurisdiction: 'Delaware, USA', role: 'protocol-developer' },
      { type: 'cayman-foundation', jurisdiction: 'Cayman Islands', role: 'token-issuer' },
      { type: 'bvi-company', jurisdiction: 'British Virgin Islands', role: 'operations' },
    ],
  },
  {
    name: 'Custom Structure',
    description: 'Define your own multi-entity structure',
    entities: [],
  },
];

const TOKEN_FEATURES = [
  { id: 'utility', label: 'Utility / Access', description: 'Required to access or use platform features' },
  { id: 'governance', label: 'Governance / Voting', description: 'Grants voting rights on protocol decisions' },
  { id: 'staking', label: 'Staking / Validation', description: 'Can be staked to secure network or earn rewards' },
  { id: 'payment', label: 'Payment / Medium of Exchange', description: 'Used as currency within ecosystem' },
  { id: 'rewards', label: 'Rewards / Incentives', description: 'Distributed as rewards for participation' },
  { id: 'fee-capture', label: 'Fee Capture / Revenue Share', description: 'Entitles holder to portion of protocol fees' },
  { id: 'collateral', label: 'Collateral', description: 'Used as collateral in protocol mechanisms' },
];

const DISTRIBUTION_METHODS = [
  { id: 'public-sale', label: 'Public Token Sale', riskLevel: 'high' },
  { id: 'private-sale', label: 'Private / Presale Round', riskLevel: 'medium' },
  { id: 'saft', label: 'SAFT Agreement', riskLevel: 'medium' },
  { id: 'ico-ieo', label: 'ICO / IEO / IDO', riskLevel: 'high' },
  { id: 'airdrop', label: 'Airdrop (Free Distribution)', riskLevel: 'low' },
  { id: 'mining-staking', label: 'Mining / Staking Rewards', riskLevel: 'low' },
  { id: 'contributor-comp', label: 'Contributor Compensation', riskLevel: 'low' },
  { id: 'liquidity-mining', label: 'Liquidity Mining / DeFi Incentives', riskLevel: 'medium' },
  { id: 'retroactive', label: 'Retroactive Distribution', riskLevel: 'low' },
];

const steps = [
  { num: 1, title: 'Token Mechanics', description: 'What your token does' },
  { num: 2, title: 'Distribution', description: 'How tokens are distributed' },
  { num: 3, title: 'Entity Structure', description: 'Corporate structure' },
  { num: 4, title: 'Team & Control', description: 'Governance and decentralization' },
  { num: 5, title: 'Marketing', description: 'Communications and positioning' },
  { num: 6, title: 'US Exposure', description: 'US market considerations' },
  { num: 7, title: 'Analysis', description: 'Risk assessment' },
];

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialFormData: FormData = {
  tokenName: '',
  tokenSymbol: '',
  tokenFeatures: [],
  tokenDescription: '',
  blockchain: '',
  totalSupply: '',
  isSupplyFixed: '',
  hasLaunched: '',
  launchDate: '',
  currentUtility: '',
  plannedUtility: '',
  distributionMethods: [],
  distributionDescription: '',
  hasConductedSale: '',
  saleDescription: '',
  totalRaised: '',
  purchaserTypes: [],
  hasLockups: '',
  lockupDetails: '',
  allocationBreakdown: '',
  hasEntity: '',
  entityStructure: [],
  structureRationale: '',
  teamDescription: '',
  teamSize: '',
  keyPersonDependency: '',
  governanceModel: '',
  governanceDescription: '',
  technicalControls: [],
  decentralizationPlans: '',
  marketingChannels: [],
  marketingDescription: '',
  priceDiscussion: '',
  returnPromises: '',
  investmentLanguage: '',
  communityEngagement: '',
  usTargeting: '',
  usMarketingEfforts: '',
  usResidentAccess: '',
  geoRestrictions: '',
  kycAml: '',
  regulatoryConsultation: '',
  additionalContext: '',
};

// ============================================================================
// REUSABLE FORM COMPONENTS (defined outside main component to prevent re-renders)
// ============================================================================

function Tooltip({ content }: { content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="inline-flex items-center justify-center w-4 h-4 text-xs bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 font-semibold transition-colors cursor-help"
        aria-label="More information"
      >
        ?
      </button>
      {isOpen && (
        <div className="absolute z-50 w-72 p-3 bg-navy-900 text-white text-sm rounded-lg shadow-xl -translate-x-1/2 left-1/2 mt-2">
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-navy-900 rotate-45" />
          <p className="relative z-10 leading-relaxed">{content}</p>
        </div>
      )}
    </span>
  );
}

function FormField({ label, tooltip, children, required }: { label: string; tooltip?: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {tooltip && <Tooltip content={tooltip} />}
      </label>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, className = '' }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${className}`}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
    />
  );
}

function Select({ value, onChange, options, placeholder }: { value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

function CheckboxCard({ checked, onChange, label, description }: { checked: boolean; onChange: () => void; label: string; description?: string }) {
  return (
    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${checked ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded mt-0.5"
      />
      <div className="ml-3">
        <span className="text-gray-900 font-medium">{label}</span>
        {description && <p className="text-gray-500 text-sm mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

function RadioOption({ name, value, checked, onChange, label, description }: { name: string; value: string; checked: boolean; onChange: () => void; label: string; description?: string }) {
  return (
    <label className={`flex items-start p-4 border rounded-xl cursor-pointer transition-all ${checked ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-300 mt-0.5"
      />
      <div className="ml-3">
        <span className="text-gray-900 font-medium">{label}</span>
        {description && <p className="text-gray-500 text-sm mt-0.5">{description}</p>}
      </div>
    </label>
  );
}

function InfoBox({ type, title, children }: { type: 'info' | 'warning' | 'tip'; title: string; children: React.ReactNode }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    tip: 'bg-green-50 border-green-200 text-green-800',
  };
  const icons = {
    info: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    warning: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
    tip: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
  };
  return (
    <div className={`rounded-xl border p-4 mb-6 ${styles[type]}`}>
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">{icons[type]}</svg>
        <div>
          <p className="font-semibold mb-1">{title}</p>
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Entity Card component with local state to prevent focus loss
interface EntityCardProps {
  entity: EntityComponent;
  index: number;
  onUpdate: (id: string, field: keyof EntityComponent, value: string) => void;
  onRemove: (id: string) => void;
  entityTypes: { value: string; label: string }[];
  entityRoles: { value: string; label: string }[];
}

function EntityCard({ entity, index, onUpdate, onRemove, entityTypes, entityRoles }: EntityCardProps) {
  // Local state for text inputs to prevent focus loss during typing
  const [localJurisdiction, setLocalJurisdiction] = useState(entity.jurisdiction);
  const [localDescription, setLocalDescription] = useState(entity.description);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state when entity prop changes (e.g., from template selection)
  useEffect(() => {
    setLocalJurisdiction(entity.jurisdiction);
    setLocalDescription(entity.description);
  }, [entity.id, entity.jurisdiction, entity.description]);

  const handleJurisdictionChange = (value: string) => {
    setLocalJurisdiction(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(entity.id, 'jurisdiction', value);
    }, 300);
  };

  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onUpdate(entity.id, 'description', value);
    }, 300);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-medium text-navy-900">Entity {index + 1}</h4>
        <button
          type="button"
          onClick={() => onRemove(entity.id)}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
          <select
            value={entity.type}
            onChange={e => onUpdate(entity.id, 'type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          >
            <option value="">Select type</option>
            {entityTypes.map(t => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jurisdiction</label>
          <input
            type="text"
            value={localJurisdiction}
            onChange={e => handleJurisdictionChange(e.target.value)}
            placeholder="e.g., Delaware, USA"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
          <select
            value={entity.role}
            onChange={e => onUpdate(entity.id, 'role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          >
            <option value="">Select role</option>
            {entityRoles.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            value={localDescription}
            onChange={e => handleDescriptionChange(e.target.value)}
            placeholder="Brief description of this entity's purpose"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function TokenRiskPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedStructureTemplate, setSelectedStructureTemplate] = useState<number | null>(null);

  const updateFormData = (field: keyof FormData, value: string | string[] | EntityComponent[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof FormData, item: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(item)) {
      updateFormData(field, currentArray.filter(i => i !== item));
    } else {
      updateFormData(field, [...currentArray, item]);
    }
  };

  const addEntity = () => {
    const newEntity: EntityComponent = {
      id: Date.now().toString(),
      type: '',
      jurisdiction: '',
      role: '',
      description: '',
    };
    updateFormData('entityStructure', [...formData.entityStructure, newEntity]);
  };

  const updateEntity = (id: string, field: keyof EntityComponent, value: string) => {
    updateFormData(
      'entityStructure',
      formData.entityStructure.map(e => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeEntity = (id: string) => {
    updateFormData(
      'entityStructure',
      formData.entityStructure.filter(e => e.id !== id)
    );
  };

  const applyStructureTemplate = (templateIndex: number) => {
    setSelectedStructureTemplate(templateIndex);
    const template = COMMON_STRUCTURES[templateIndex];
    if (template.entities.length > 0) {
      const entities = template.entities.map((e, i) => ({
        id: `template-${i}-${Date.now()}`,
        type: e.type,
        jurisdiction: e.jurisdiction,
        role: e.role,
        description: '',
      }));
      updateFormData('entityStructure', entities);
    } else {
      updateFormData('entityStructure', []);
    }
  };

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setCurrentStep(7);
    setTimeout(() => {
      const result = performAnalysis(formData);
      setAnalysis(result);
      setIsAnalyzing(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2500);
  };

  const startOver = () => {
    if (confirm('Are you sure you want to start a new analysis? All data will be cleared.')) {
      setFormData(initialFormData);
      setAnalysis(null);
      setCurrentStep(1);
      setSelectedStructureTemplate(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --------------------------------------------------------------------------
  // Analysis Engine
  // --------------------------------------------------------------------------

  function performAnalysis(data: FormData): Analysis {
    const keyConcerns: ConcernItem[] = [];
    const mitigatingFactors: string[] = [];

    // Analyze Investment of Money
    const investmentConcerns: string[] = [];
    const investmentMitigators: string[] = [];
    let investmentSecView = '';

    if (data.distributionMethods.includes('public-sale') || data.distributionMethods.includes('ico-ieo')) {
      investmentConcerns.push('Public token sale involves exchange of value for tokens');
      keyConcerns.push({
        category: 'Distribution',
        concern: 'Public token sale creates strong "investment of money" indicator',
        severity: 'significant',
        secPerspective: 'The SEC has consistently viewed public token sales as satisfying the investment of money prong, regardless of whether payment is in fiat or cryptocurrency.',
        mitigation: 'Consider alternative distribution methods such as airdrops, contributor rewards, or limiting sales to accredited investors under Regulation D.'
      });
    }
    if (data.distributionMethods.includes('private-sale') || data.distributionMethods.includes('saft')) {
      investmentConcerns.push('Private sale or SAFT involves investment of money');
    }
    if (data.totalRaised && parseFloat(data.totalRaised) > 0) {
      investmentConcerns.push(`Raised approximately ${data.totalRaised} through token-related sales`);
    }
    if (data.distributionMethods.includes('airdrop')) {
      investmentMitigators.push('Airdrop distribution does not involve investment of money');
      mitigatingFactors.push('Free distribution via airdrop reduces investment character');
    }
    if (data.distributionMethods.includes('mining-staking') || data.distributionMethods.includes('contributor-comp')) {
      investmentMitigators.push('Tokens earned through participation or work');
      mitigatingFactors.push('Tokens earned through active participation rather than purchased');
    }

    investmentSecView = investmentConcerns.length > 0
      ? 'The SEC would likely view the token distribution as involving an "investment of money" given the sale mechanics described.'
      : 'The distribution methods described may provide arguments against the investment of money prong, though this is highly fact-dependent.';

    // Analyze Common Enterprise
    const enterpriseConcerns: string[] = [];
    const enterpriseMitigators: string[] = [];
    let enterpriseSecView = '';

    if (data.tokenFeatures.includes('fee-capture')) {
      enterpriseConcerns.push('Fee capture mechanism creates shared revenue pool');
      keyConcerns.push({
        category: 'Token Design',
        concern: 'Revenue sharing mechanism resembles profit-sharing arrangement',
        severity: 'significant',
        secPerspective: 'Fee distribution to token holders creates horizontal commonality—all holders profit or lose together based on protocol performance.',
        mitigation: 'Consider whether fee capture is essential to token function. If retained, ensure robust utility justification and consult specialized counsel.'
      });
    }
    if (data.entityStructure.length > 0) {
      const hasUSTaxableEntity = data.entityStructure.some(e =>
        e.type.includes('delaware') || e.jurisdiction.toLowerCase().includes('usa') || e.jurisdiction.toLowerCase().includes('united states')
      );
      if (hasUSTaxableEntity) {
        enterpriseConcerns.push('US-based entity may establish common enterprise through vertical commonality');
      }
    }
    enterpriseConcerns.push('Token holders share common platform and infrastructure');

    if (data.governanceModel === 'dao' || data.governanceModel === 'hybrid') {
      enterpriseMitigators.push('Decentralized governance distributes control');
    }

    enterpriseSecView = 'Courts have found common enterprise where investor funds are pooled or where investor returns depend on the efforts of a single promoter. Token structures typically satisfy this prong.';

    // Analyze Expectation of Profits
    const profitConcerns: string[] = [];
    const profitMitigators: string[] = [];
    let profitSecView = '';

    if (data.returnPromises === 'yes' || data.priceDiscussion === 'yes') {
      profitConcerns.push('Communications may create or reinforce profit expectations');
      keyConcerns.push({
        category: 'Marketing',
        concern: 'Price or return discussions create profit expectation',
        severity: 'significant',
        secPerspective: 'The SEC examines all communications, including social media, Discord, and team member statements. Price predictions or return discussions are treated as evidence of investment marketing.',
        mitigation: 'Implement strict communication policies. Never discuss price, returns, or investment value. Train all team members and community moderators.'
      });
    }
    if (data.investmentLanguage === 'yes') {
      profitConcerns.push('Investment-oriented language used in communications');
      keyConcerns.push({
        category: 'Marketing',
        concern: 'Investment terminology in marketing materials',
        severity: 'elevated',
        secPerspective: 'Terms like "invest," "returns," "ROI," or "passive income" signal investment intent regardless of disclaimers.',
        mitigation: 'Audit all materials and remove investment language. Focus exclusively on utility, functionality, and ecosystem participation.'
      });
    }
    if (data.tokenFeatures.includes('staking')) {
      profitConcerns.push('Staking rewards may be viewed as passive income');
    }
    if (data.tokenFeatures.includes('fee-capture')) {
      profitConcerns.push('Fee distribution resembles dividend payments');
    }

    if (data.tokenFeatures.includes('utility') && data.currentUtility) {
      profitMitigators.push('Token has genuine consumptive utility');
      mitigatingFactors.push('Functional utility at time of distribution');
    }
    if (data.priceDiscussion === 'no' && data.returnPromises === 'no') {
      profitMitigators.push('No price or return discussions in communications');
      mitigatingFactors.push('Marketing focused on utility rather than investment');
    }

    profitSecView = profitConcerns.length > 1
      ? 'Multiple factors suggest purchasers may reasonably expect profits. The SEC would likely view this as satisfying the expectation of profits prong.'
      : 'While some mitigating factors exist, purchasers in crypto markets often expect appreciation. The SEC typically finds this prong satisfied.';

    // Analyze Efforts of Others
    const effortsConcerns: string[] = [];
    const effortsMitigators: string[] = [];
    let effortsSecView = '';

    if (data.keyPersonDependency === 'high' || data.keyPersonDependency === 'critical') {
      effortsConcerns.push('High dependency on core team for value creation');
      keyConcerns.push({
        category: 'Team Dependency',
        concern: 'Protocol success heavily dependent on core team',
        severity: 'elevated',
        secPerspective: 'When a small team controls development and makes essential decisions, the "efforts of others" prong is typically satisfied even if token holders can vote on proposals.',
        mitigation: 'Document and execute decentralization roadmap. Enable independent ecosystem contributors. Progressively reduce team control over critical functions.'
      });
    }
    if (data.governanceModel === 'centralized' || data.governanceModel === 'multisig-team') {
      effortsConcerns.push('Centralized governance structure');
    }
    if (data.technicalControls.includes('upgrade-authority') || data.technicalControls.includes('pause-function')) {
      effortsConcerns.push('Team retains significant technical controls');
      keyConcerns.push({
        category: 'Technical Control',
        concern: 'Admin keys or upgrade authority retained by team',
        severity: 'elevated',
        secPerspective: 'Retained admin controls demonstrate ongoing team involvement in the success or failure of the project, even post-launch.',
        mitigation: 'Consider time-locked controls, progressive decentralization, or transfer to community governance. Document any retained controls and the rationale.'
      });
    }

    if (data.governanceModel === 'dao') {
      effortsMitigators.push('DAO governance distributes decision-making');
    }
    if (data.technicalControls.includes('immutable') || data.technicalControls.includes('community-multisig')) {
      effortsMitigators.push('Technical controls decentralized or immutable');
      mitigatingFactors.push('Decentralized or immutable technical architecture');
    }
    if (data.decentralizationPlans) {
      mitigatingFactors.push('Documented decentralization roadmap');
    }

    effortsSecView = effortsConcerns.length > 0
      ? 'The SEC would likely find the "efforts of others" prong satisfied given team dependency and control patterns described.'
      : 'Some decentralization features may support arguments against this prong, but the SEC has been skeptical of decentralization claims in practice.';

    // US Exposure Analysis
    if (data.usTargeting === 'yes' || data.usResidentAccess === 'yes') {
      keyConcerns.push({
        category: 'US Exposure',
        concern: 'US persons can access or purchase tokens',
        severity: 'significant',
        secPerspective: 'Any ability for US persons to purchase tokens brings the offering under SEC jurisdiction. Geographic restrictions are often insufficient without robust enforcement.',
        mitigation: 'Implement geo-blocking with IP verification, require non-US attestations, exclude US persons from sales, and consider Regulation D exemption for any US participants.'
      });
    }
    if (data.usMarketingEfforts === 'yes') {
      keyConcerns.push({
        category: 'US Exposure',
        concern: 'Marketing efforts target or reach US audience',
        severity: 'elevated',
        secPerspective: 'Marketing to US persons, even inadvertently through English-language social media, can establish US jurisdiction.',
        mitigation: 'Geo-target marketing to exclude US. Add prominent US exclusion notices. Do not use US-based influencers or media placements.'
      });
    }

    // Determine overall assessment
    const significantCount = keyConcerns.filter(c => c.severity === 'significant').length;
    const elevatedCount = keyConcerns.filter(c => c.severity === 'elevated').length;

    let overallLevel: 'significant' | 'elevated' | 'notable';
    let overallSummary: string;
    let overallSecPerspective: string;

    if (significantCount >= 2 || (significantCount >= 1 && elevatedCount >= 2)) {
      overallLevel = 'significant';
      overallSummary = `Based on the information provided, ${data.tokenName || 'this token'} presents SIGNIFICANT regulatory concerns under U.S. federal securities law. Multiple factors suggest the SEC would likely analyze this token under the Howey test, and several prongs appear satisfied. Before proceeding with any distribution to U.S. persons, consultation with specialized securities counsel is essential.`;
      overallSecPerspective = 'Given current SEC enforcement priorities and the factors identified, this token structure would likely receive scrutiny. The SEC has brought enforcement actions against projects with similar characteristics, including those marketed primarily for utility purposes.';
    } else if (significantCount >= 1 || elevatedCount >= 2) {
      overallLevel = 'elevated';
      overallSummary = `${data.tokenName || 'This token'} presents ELEVATED regulatory concerns. While not all factors point clearly toward security classification, several issues warrant careful attention. The analysis should inform structural and communication decisions, and counsel consultation is strongly recommended.`;
      overallSecPerspective = 'The SEC may view this token with scrutiny given the factors identified. Careful structuring and communication practices could help reduce regulatory risk, but uncertainty remains.';
    } else {
      overallLevel = 'notable';
      overallSummary = `${data.tokenName || 'This token'} presents NOTABLE considerations for securities analysis. While the current structure contains some favorable factors, token classification is highly fact-dependent and regulatory views continue to evolve. This assessment should not be interpreted as legal clearance.`;
      overallSecPerspective = 'Even with favorable structural elements, the SEC has taken expansive views of token classification. Continued attention to communications and structural decisions is important.';
    }

    // Generate critical actions
    const criticalActions: string[] = [];

    if (significantCount > 0 || elevatedCount > 0) {
      criticalActions.push('Consult with specialized crypto securities counsel before any token distribution or public communications about the token.');
    }
    if (keyConcerns.some(c => c.category === 'Marketing')) {
      criticalActions.push('Conduct comprehensive audit of all marketing materials, website copy, social media, and team communications for investment language.');
    }
    if (keyConcerns.some(c => c.category === 'US Exposure')) {
      criticalActions.push('Implement robust geo-restrictions and consider whether US persons should be entirely excluded from token distribution.');
    }
    if (keyConcerns.some(c => c.category === 'Technical Control')) {
      criticalActions.push('Document decentralization roadmap with specific milestones for reducing team control over protocol functions.');
    }
    if (keyConcerns.some(c => c.category === 'Token Design' && c.concern.includes('revenue'))) {
      criticalActions.push('Evaluate whether fee-capture mechanism is essential to token design and consider alternatives.');
    }

    if (criticalActions.length === 0) {
      criticalActions.push('Document utility characteristics and maintain records supporting non-security classification.');
      criticalActions.push('Implement communication policies to ensure ongoing compliance with utility-focused messaging.');
    }

    // Counsel guidance
    let counselGuidance = '';
    if (overallLevel === 'significant') {
      counselGuidance = 'Given the significant concerns identified, consultation with specialized crypto securities counsel is essential before proceeding. Consider whether restructuring, registration, or exemption strategies (such as Regulation D, Regulation S, or Regulation A+) may be appropriate. If you need counsel, consider a qualified crypto securities law firm such as Rains LLP.';
    } else if (overallLevel === 'elevated') {
      counselGuidance = 'The elevated concerns warrant consultation with securities counsel to evaluate risk mitigation strategies and ensure appropriate structural decisions. An attorney experienced in crypto securities matters can help navigate these issues. Consider consulting a qualified crypto securities law firm such as Rains LLP.';
    } else {
      counselGuidance = 'While the analysis shows more favorable factors, token classification remains a complex, evolving area. Periodic review with counsel is advisable, particularly as the project evolves or if distribution plans change. If questions arise, consider consulting a qualified crypto securities law firm such as Rains LLP.';
    }

    return {
      overallAssessment: {
        level: overallLevel,
        summary: overallSummary,
        secPerspective: overallSecPerspective,
      },
      howeyAnalysis: {
        investmentOfMoney: { concerns: investmentConcerns, mitigators: investmentMitigators, secView: investmentSecView },
        commonEnterprise: { concerns: enterpriseConcerns, mitigators: enterpriseMitigators, secView: enterpriseSecView },
        expectationOfProfits: { concerns: profitConcerns, mitigators: profitMitigators, secView: profitSecView },
        effortsOfOthers: { concerns: effortsConcerns, mitigators: effortsMitigators, secView: effortsSecView },
      },
      keyConcerns,
      mitigatingFactors,
      criticalActions,
      counselGuidance,
    };
  }

  // --------------------------------------------------------------------------
  // Step Renderers
  // --------------------------------------------------------------------------

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Token Mechanics</h2>
        <p className="text-gray-600">Tell us what your token does and how it works.</p>
      </div>

      <InfoBox type="tip" title="Why this matters">
        The functional characteristics of your token are central to securities analysis. Tokens with genuine utility that exists at the time of distribution are generally viewed more favorably than tokens sold primarily as investment opportunities.
      </InfoBox>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Token Name" tooltip="The name of your token as it will appear in wallets and exchanges.">
          <TextInput value={formData.tokenName} onChange={v => updateFormData('tokenName', v)} placeholder="e.g., Acme Protocol Token" />
        </FormField>
        <FormField label="Token Symbol" tooltip="The ticker symbol for your token (typically 3-5 characters).">
          <TextInput value={formData.tokenSymbol} onChange={v => updateFormData('tokenSymbol', v.toUpperCase())} placeholder="e.g., ACME" className="uppercase" />
        </FormField>
      </div>

      <FormField
        label="Token Features"
        tooltip="Select all features that apply to your token. Many tokens have multiple functions—this is common and does not automatically increase risk."
        required
      >
        <div className="space-y-2">
          {TOKEN_FEATURES.map(feature => (
            <CheckboxCard
              key={feature.id}
              checked={formData.tokenFeatures.includes(feature.id)}
              onChange={() => toggleArrayItem('tokenFeatures', feature.id)}
              label={feature.label}
              description={feature.description}
            />
          ))}
        </div>
      </FormField>

      <FormField
        label="Describe your token's functionality"
        tooltip="Explain in your own words what the token does and why it exists. Focus on the utility and purpose rather than investment potential."
      >
        <TextArea
          value={formData.tokenDescription}
          onChange={v => updateFormData('tokenDescription', v)}
          placeholder="Describe the core functionality of your token: What problem does it solve? How do users interact with it? What can you do with the token that you couldn't do without it?"
          rows={5}
        />
      </FormField>

      <div className="grid md:grid-cols-2 gap-4">
        <FormField label="Blockchain" tooltip="The blockchain network where your token will be deployed.">
          <Select
            value={formData.blockchain}
            onChange={v => updateFormData('blockchain', v)}
            placeholder="Select blockchain"
            options={[
              { value: 'ethereum', label: 'Ethereum' },
              { value: 'solana', label: 'Solana' },
              { value: 'polygon', label: 'Polygon' },
              { value: 'arbitrum', label: 'Arbitrum' },
              { value: 'optimism', label: 'Optimism' },
              { value: 'base', label: 'Base' },
              { value: 'avalanche', label: 'Avalanche' },
              { value: 'bnb', label: 'BNB Chain' },
              { value: 'other', label: 'Other' },
            ]}
          />
        </FormField>
        <FormField label="Total Supply" tooltip="The maximum number of tokens that will ever exist.">
          <TextInput value={formData.totalSupply} onChange={v => updateFormData('totalSupply', v)} placeholder="e.g., 1,000,000,000" />
        </FormField>
      </div>

      <FormField label="Is the supply fixed?" tooltip="Can new tokens be minted after initial distribution, or is the supply capped?">
        <div className="space-y-2">
          <RadioOption name="supplyFixed" value="yes" checked={formData.isSupplyFixed === 'yes'} onChange={() => updateFormData('isSupplyFixed', 'yes')} label="Yes, fixed supply" description="No new tokens can be created after launch" />
          <RadioOption name="supplyFixed" value="no" checked={formData.isSupplyFixed === 'no'} onChange={() => updateFormData('isSupplyFixed', 'no')} label="No, supply can change" description="New tokens can be minted (e.g., for rewards, inflation)" />
          <RadioOption name="supplyFixed" value="governance" checked={formData.isSupplyFixed === 'governance'} onChange={() => updateFormData('isSupplyFixed', 'governance')} label="Governed by token holders" description="Minting requires governance approval" />
        </div>
      </FormField>

      <FormField label="Has the token launched?" tooltip="Has the token been deployed and is it currently available to users?">
        <div className="space-y-2">
          <RadioOption name="launched" value="yes" checked={formData.hasLaunched === 'yes'} onChange={() => updateFormData('hasLaunched', 'yes')} label="Yes, already launched" />
          <RadioOption name="launched" value="no" checked={formData.hasLaunched === 'no'} onChange={() => updateFormData('hasLaunched', 'no')} label="No, not yet launched" />
        </div>
      </FormField>

      {formData.hasLaunched === 'yes' && (
        <FormField label="When did the token launch?" tooltip="Approximate date when the token became available.">
          <TextInput value={formData.launchDate} onChange={v => updateFormData('launchDate', v)} placeholder="e.g., January 2024" />
        </FormField>
      )}

      <FormField
        label="What utility is available NOW?"
        tooltip="Describe what users can actually do with the token today, not future plans. Current, functional utility is a key factor in securities analysis."
      >
        <TextArea
          value={formData.currentUtility}
          onChange={v => updateFormData('currentUtility', v)}
          placeholder="What can users do with the token right now? Be specific about actual use cases that exist today."
          rows={4}
        />
      </FormField>

      <FormField
        label="What additional utility is planned?"
        tooltip="Describe future functionality that is in development. Future promises are viewed differently than existing functionality."
      >
        <TextArea
          value={formData.plannedUtility}
          onChange={v => updateFormData('plannedUtility', v)}
          placeholder="What additional functionality is planned for the future? Include approximate timelines if known."
          rows={3}
        />
      </FormField>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Distribution & Sales</h2>
        <p className="text-gray-600">How tokens are or will be distributed to users and investors.</p>
      </div>

      <InfoBox type="info" title="Distribution matters significantly">
        How tokens are distributed is often the most important factor in securities analysis. Direct sales for value (money or crypto) strongly suggest the "investment of money" element of the Howey test. Free distributions, earned rewards, and contributor compensation receive different treatment.
      </InfoBox>

      <FormField
        label="Distribution Methods"
        tooltip="Select all methods used or planned for token distribution. Multiple methods are common."
        required
      >
        <div className="space-y-2">
          {DISTRIBUTION_METHODS.map(method => (
            <CheckboxCard
              key={method.id}
              checked={formData.distributionMethods.includes(method.id)}
              onChange={() => toggleArrayItem('distributionMethods', method.id)}
              label={method.label}
            />
          ))}
        </div>
      </FormField>

      <FormField
        label="Describe your distribution approach"
        tooltip="Explain your token distribution strategy in detail. Include timing, eligibility criteria, and rationale."
      >
        <TextArea
          value={formData.distributionDescription}
          onChange={v => updateFormData('distributionDescription', v)}
          placeholder="How are tokens being distributed? To whom? What is the rationale for your distribution approach?"
          rows={4}
        />
      </FormField>

      <FormField label="Have you conducted any token sales?" tooltip="This includes presales, public sales, SAFT agreements, or any exchange of value for tokens.">
        <div className="space-y-2">
          <RadioOption name="conductedSale" value="yes" checked={formData.hasConductedSale === 'yes'} onChange={() => updateFormData('hasConductedSale', 'yes')} label="Yes" />
          <RadioOption name="conductedSale" value="no" checked={formData.hasConductedSale === 'no'} onChange={() => updateFormData('hasConductedSale', 'no')} label="No" />
          <RadioOption name="conductedSale" value="planned" checked={formData.hasConductedSale === 'planned'} onChange={() => updateFormData('hasConductedSale', 'planned')} label="No, but planning to" />
        </div>
      </FormField>

      {(formData.hasConductedSale === 'yes' || formData.hasConductedSale === 'planned') && (
        <>
          <FormField
            label="Describe the sale structure"
            tooltip="Include details about pricing, timing, purchaser eligibility, and terms."
          >
            <TextArea
              value={formData.saleDescription}
              onChange={v => updateFormData('saleDescription', v)}
              placeholder="Describe the token sale: pricing mechanism, timing, rounds, purchaser restrictions, and any other relevant details."
              rows={4}
            />
          </FormField>

          <FormField label="Total amount raised (USD equivalent)" tooltip="Approximate total value raised through token sales.">
            <TextInput value={formData.totalRaised} onChange={v => updateFormData('totalRaised', v)} placeholder="e.g., $5,000,000" />
          </FormField>

          <FormField
            label="Who are/were the purchasers?"
            tooltip="The sophistication and accreditation status of purchasers affects regulatory analysis."
          >
            <div className="space-y-2">
              <CheckboxCard checked={formData.purchaserTypes.includes('accredited')} onChange={() => toggleArrayItem('purchaserTypes', 'accredited')} label="Accredited investors" description="Investors meeting SEC accreditation standards" />
              <CheckboxCard checked={formData.purchaserTypes.includes('institutional')} onChange={() => toggleArrayItem('purchaserTypes', 'institutional')} label="Institutional investors" description="VCs, funds, family offices" />
              <CheckboxCard checked={formData.purchaserTypes.includes('non-us')} onChange={() => toggleArrayItem('purchaserTypes', 'non-us')} label="Non-US persons only" description="No US persons participated" />
              <CheckboxCard checked={formData.purchaserTypes.includes('public')} onChange={() => toggleArrayItem('purchaserTypes', 'public')} label="General public" description="No purchaser restrictions" />
            </div>
          </FormField>
        </>
      )}

      <FormField label="Are there lockup or vesting periods?" tooltip="Lockups can affect securities analysis—they may indicate investment intent but also protect against immediate speculation.">
        <div className="space-y-2">
          <RadioOption name="lockups" value="yes" checked={formData.hasLockups === 'yes'} onChange={() => updateFormData('hasLockups', 'yes')} label="Yes" />
          <RadioOption name="lockups" value="no" checked={formData.hasLockups === 'no'} onChange={() => updateFormData('hasLockups', 'no')} label="No" />
        </div>
      </FormField>

      {formData.hasLockups === 'yes' && (
        <FormField label="Describe lockup/vesting terms">
          <TextArea
            value={formData.lockupDetails}
            onChange={v => updateFormData('lockupDetails', v)}
            placeholder="Describe lockup periods, vesting schedules, and which token allocations they apply to."
            rows={3}
          />
        </FormField>
      )}

      <FormField
        label="Token allocation breakdown"
        tooltip="How is the total supply allocated? Include team, investors, community, treasury, and other categories."
      >
        <TextArea
          value={formData.allocationBreakdown}
          onChange={v => updateFormData('allocationBreakdown', v)}
          placeholder="e.g., Team: 15%, Investors: 20%, Community rewards: 30%, Treasury: 20%, Liquidity: 15%"
          rows={4}
        />
      </FormField>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Entity Structure</h2>
        <p className="text-gray-600">The corporate structure behind your token project.</p>
      </div>

      <InfoBox type="info" title="Multi-entity structures are common">
        Many crypto projects use multiple entities across jurisdictions—for example, a US development company paired with an offshore foundation for token issuance. This is a common and often advisable approach. Describe your full structure below.
      </InfoBox>

      <FormField label="Do you have a formal entity structure?" tooltip="Has your project formed any legal entities (corporations, LLCs, foundations, etc.)?">
        <div className="space-y-2">
          <RadioOption name="hasEntity" value="yes" checked={formData.hasEntity === 'yes'} onChange={() => updateFormData('hasEntity', 'yes')} label="Yes, we have entity(ies)" />
          <RadioOption name="hasEntity" value="planning" checked={formData.hasEntity === 'planning'} onChange={() => updateFormData('hasEntity', 'planning')} label="Planning to form" />
          <RadioOption name="hasEntity" value="no" checked={formData.hasEntity === 'no'} onChange={() => updateFormData('hasEntity', 'no')} label="No formal entity" />
        </div>
      </FormField>

      {(formData.hasEntity === 'yes' || formData.hasEntity === 'planning') && (
        <>
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-navy-900 mb-3">Quick Start: Common Structures</h3>
            <p className="text-sm text-gray-600 mb-4">Select a common structure template or build your own.</p>
            <div className="grid md:grid-cols-2 gap-3">
              {COMMON_STRUCTURES.map((structure, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => applyStructureTemplate(index)}
                  className={`text-left p-4 rounded-lg border transition-all ${selectedStructureTemplate === index ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200 hover:border-gray-300 hover:bg-white'}`}
                >
                  <p className="font-medium text-navy-900">{structure.name}</p>
                  <p className="text-sm text-gray-600 mt-1">{structure.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-navy-900">Your Entities</h3>
              <button
                type="button"
                onClick={addEntity}
                className="px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 border border-cyan-300 rounded-lg hover:bg-cyan-50 transition-colors"
              >
                + Add Entity
              </button>
            </div>

            {formData.entityStructure.length === 0 ? (
              <p className="text-gray-500 text-sm italic py-4 text-center">Select a template above or add entities manually.</p>
            ) : (
              formData.entityStructure.map((entity, index) => (
                <EntityCard
                  key={entity.id}
                  entity={entity}
                  index={index}
                  onUpdate={updateEntity}
                  onRemove={removeEntity}
                  entityTypes={ENTITY_TYPES}
                  entityRoles={ENTITY_ROLES}
                />
              ))
            )}
          </div>

          <FormField
            label="Why did you choose this structure?"
            tooltip="Understanding the rationale helps assess whether the structure is appropriate for your situation."
          >
            <TextArea
              value={formData.structureRationale}
              onChange={v => updateFormData('structureRationale', v)}
              placeholder="Explain why you chose this entity structure. What considerations drove your decisions?"
              rows={3}
            />
          </FormField>
        </>
      )}
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Team & Control</h2>
        <p className="text-gray-600">Who controls the protocol and how decentralized is it?</p>
      </div>

      <InfoBox type="info" title="Decentralization is a spectrum">
        The SEC has indicated that truly decentralized networks may not involve securities. However, "decentralization" is not binary—it exists on a spectrum, and claims of decentralization are scrutinized carefully. Focus on describing your actual governance and control mechanisms honestly.
      </InfoBox>

      <FormField
        label="Describe your team"
        tooltip="Who are the key people behind the project? This helps assess the 'efforts of others' factor."
      >
        <TextArea
          value={formData.teamDescription}
          onChange={v => updateFormData('teamDescription', v)}
          placeholder="Describe the core team: How many people? What are their roles? Are they publicly identified?"
          rows={4}
        />
      </FormField>

      <FormField label="Team size" tooltip="Approximate number of core team members working on the project.">
        <Select
          value={formData.teamSize}
          onChange={v => updateFormData('teamSize', v)}
          placeholder="Select team size"
          options={[
            { value: '1-5', label: '1-5 people' },
            { value: '6-15', label: '6-15 people' },
            { value: '16-50', label: '16-50 people' },
            { value: '50+', label: '50+ people' },
          ]}
        />
      </FormField>

      <FormField
        label="How dependent is the project on key individuals?"
        tooltip="If the core team disappeared tomorrow, could the protocol continue functioning and developing?"
      >
        <div className="space-y-2">
          <RadioOption name="keyPerson" value="critical" checked={formData.keyPersonDependency === 'critical'} onChange={() => updateFormData('keyPersonDependency', 'critical')} label="Critical dependency" description="Project would likely fail without core team" />
          <RadioOption name="keyPerson" value="high" checked={formData.keyPersonDependency === 'high'} onChange={() => updateFormData('keyPersonDependency', 'high')} label="High dependency" description="Project would be significantly impaired" />
          <RadioOption name="keyPerson" value="moderate" checked={formData.keyPersonDependency === 'moderate'} onChange={() => updateFormData('keyPersonDependency', 'moderate')} label="Moderate dependency" description="Project could continue with some difficulty" />
          <RadioOption name="keyPerson" value="low" checked={formData.keyPersonDependency === 'low'} onChange={() => updateFormData('keyPersonDependency', 'low')} label="Low dependency" description="Project has broad contributor base and could continue" />
        </div>
      </FormField>

      <FormField
        label="Governance model"
        tooltip="How are decisions about the protocol made? Who has authority to make changes?"
      >
        <div className="space-y-2">
          <RadioOption name="governance" value="centralized" checked={formData.governanceModel === 'centralized'} onChange={() => updateFormData('governanceModel', 'centralized')} label="Centralized" description="Core team makes all significant decisions" />
          <RadioOption name="governance" value="multisig-team" checked={formData.governanceModel === 'multisig-team'} onChange={() => updateFormData('governanceModel', 'multisig-team')} label="Team multisig" description="Decisions require multiple team member approval" />
          <RadioOption name="governance" value="hybrid" checked={formData.governanceModel === 'hybrid'} onChange={() => updateFormData('governanceModel', 'hybrid')} label="Hybrid" description="Mix of team control and community governance" />
          <RadioOption name="governance" value="dao" checked={formData.governanceModel === 'dao'} onChange={() => updateFormData('governanceModel', 'dao')} label="DAO governance" description="Token holders vote on major decisions" />
          <RadioOption name="governance" value="immutable" checked={formData.governanceModel === 'immutable'} onChange={() => updateFormData('governanceModel', 'immutable')} label="Immutable" description="Protocol cannot be changed after deployment" />
        </div>
      </FormField>

      <FormField label="Describe your governance in more detail">
        <TextArea
          value={formData.governanceDescription}
          onChange={v => updateFormData('governanceDescription', v)}
          placeholder="How does governance actually work? What decisions go through governance? What is the voting process?"
          rows={4}
        />
      </FormField>

      <FormField
        label="Technical controls retained by team"
        tooltip="What technical capabilities does the team retain over the protocol? These can significantly affect decentralization claims."
      >
        <div className="space-y-2">
          <CheckboxCard checked={formData.technicalControls.includes('upgrade-authority')} onChange={() => toggleArrayItem('technicalControls', 'upgrade-authority')} label="Upgrade authority" description="Team can upgrade smart contracts" />
          <CheckboxCard checked={formData.technicalControls.includes('pause-function')} onChange={() => toggleArrayItem('technicalControls', 'pause-function')} label="Pause function" description="Team can pause protocol operations" />
          <CheckboxCard checked={formData.technicalControls.includes('mint-authority')} onChange={() => toggleArrayItem('technicalControls', 'mint-authority')} label="Mint authority" description="Team can create new tokens" />
          <CheckboxCard checked={formData.technicalControls.includes('fee-setting')} onChange={() => toggleArrayItem('technicalControls', 'fee-setting')} label="Fee setting" description="Team controls protocol fees" />
          <CheckboxCard checked={formData.technicalControls.includes('treasury-control')} onChange={() => toggleArrayItem('technicalControls', 'treasury-control')} label="Treasury control" description="Team controls treasury funds" />
          <CheckboxCard checked={formData.technicalControls.includes('community-multisig')} onChange={() => toggleArrayItem('technicalControls', 'community-multisig')} label="Community multisig" description="Controls distributed across community members" />
          <CheckboxCard checked={formData.technicalControls.includes('immutable')} onChange={() => toggleArrayItem('technicalControls', 'immutable')} label="Immutable/No controls" description="Smart contracts cannot be changed" />
        </div>
      </FormField>

      <FormField
        label="Decentralization plans"
        tooltip="If you retain significant control now, what are your plans for progressive decentralization?"
      >
        <TextArea
          value={formData.decentralizationPlans}
          onChange={v => updateFormData('decentralizationPlans', v)}
          placeholder="Describe your roadmap for decentralization. What milestones? What timeline? How will control be transferred?"
          rows={4}
        />
      </FormField>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">Marketing & Communications</h2>
        <p className="text-gray-600">How you communicate about your token matters significantly.</p>
      </div>

      <InfoBox type="warning" title="Communications are heavily scrutinized">
        The SEC examines all communications—website, whitepaper, social media, Discord, Twitter, podcasts, and even casual team member statements. Marketing that emphasizes investment returns, price appreciation, or passive income significantly increases securities risk. Focus on utility and functionality.
      </InfoBox>

      <FormField label="Marketing channels used">
        <div className="space-y-2">
          <CheckboxCard checked={formData.marketingChannels.includes('twitter')} onChange={() => toggleArrayItem('marketingChannels', 'twitter')} label="Twitter/X" />
          <CheckboxCard checked={formData.marketingChannels.includes('discord')} onChange={() => toggleArrayItem('marketingChannels', 'discord')} label="Discord" />
          <CheckboxCard checked={formData.marketingChannels.includes('telegram')} onChange={() => toggleArrayItem('marketingChannels', 'telegram')} label="Telegram" />
          <CheckboxCard checked={formData.marketingChannels.includes('blog')} onChange={() => toggleArrayItem('marketingChannels', 'blog')} label="Blog/Medium" />
          <CheckboxCard checked={formData.marketingChannels.includes('youtube')} onChange={() => toggleArrayItem('marketingChannels', 'youtube')} label="YouTube/Video" />
          <CheckboxCard checked={formData.marketingChannels.includes('podcasts')} onChange={() => toggleArrayItem('marketingChannels', 'podcasts')} label="Podcasts" />
          <CheckboxCard checked={formData.marketingChannels.includes('influencers')} onChange={() => toggleArrayItem('marketingChannels', 'influencers')} label="Paid influencers" />
          <CheckboxCard checked={formData.marketingChannels.includes('conferences')} onChange={() => toggleArrayItem('marketingChannels', 'conferences')} label="Conferences/Events" />
        </div>
      </FormField>

      <FormField label="Describe your marketing approach">
        <TextArea
          value={formData.marketingDescription}
          onChange={v => updateFormData('marketingDescription', v)}
          placeholder="How do you market the token? What messages do you emphasize? Who is your target audience?"
          rows={4}
        />
      </FormField>

      <FormField
        label="Has the team ever discussed token price?"
        tooltip="This includes predictions, targets, comparisons to other tokens, or any suggestion that the token will increase in value."
      >
        <div className="space-y-2">
          <RadioOption name="priceDiscussion" value="yes" checked={formData.priceDiscussion === 'yes'} onChange={() => updateFormData('priceDiscussion', 'yes')} label="Yes" description="Team has discussed price or value appreciation" />
          <RadioOption name="priceDiscussion" value="possibly" checked={formData.priceDiscussion === 'possibly'} onChange={() => updateFormData('priceDiscussion', 'possibly')} label="Possibly/Not sure" description="May have been mentioned in some context" />
          <RadioOption name="priceDiscussion" value="no" checked={formData.priceDiscussion === 'no'} onChange={() => updateFormData('priceDiscussion', 'no')} label="No" description="Team has never discussed price" />
        </div>
      </FormField>

      <FormField
        label="Have any promises about returns been made?"
        tooltip="This includes staking yields, reward rates, APY figures, or any suggestion of profit potential."
      >
        <div className="space-y-2">
          <RadioOption name="returnPromises" value="yes" checked={formData.returnPromises === 'yes'} onChange={() => updateFormData('returnPromises', 'yes')} label="Yes" description="Returns, yields, or APY have been mentioned" />
          <RadioOption name="returnPromises" value="possibly" checked={formData.returnPromises === 'possibly'} onChange={() => updateFormData('returnPromises', 'possibly')} label="Possibly/Not sure" description="May have been mentioned in some context" />
          <RadioOption name="returnPromises" value="no" checked={formData.returnPromises === 'no'} onChange={() => updateFormData('returnPromises', 'no')} label="No" description="No return promises have been made" />
        </div>
      </FormField>

      <FormField
        label="Is investment-oriented language used in any materials?"
        tooltip="Terms like 'invest,' 'investors,' 'ROI,' 'returns,' 'passive income,' or 'early adopter advantage' are red flags."
      >
        <div className="space-y-2">
          <RadioOption name="investmentLanguage" value="yes" checked={formData.investmentLanguage === 'yes'} onChange={() => updateFormData('investmentLanguage', 'yes')} label="Yes" description="Some investment terminology is used" />
          <RadioOption name="investmentLanguage" value="possibly" checked={formData.investmentLanguage === 'possibly'} onChange={() => updateFormData('investmentLanguage', 'possibly')} label="Possibly/Need to review" description="Not certain, would need to audit materials" />
          <RadioOption name="investmentLanguage" value="no" checked={formData.investmentLanguage === 'no'} onChange={() => updateFormData('investmentLanguage', 'no')} label="No" description="Only utility-focused language is used" />
        </div>
      </FormField>

      <FormField label="Describe your community engagement">
        <TextArea
          value={formData.communityEngagement}
          onChange={v => updateFormData('communityEngagement', v)}
          placeholder="How do you engage with your community? What topics are discussed? How do moderators handle price discussion?"
          rows={4}
        />
      </FormField>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-navy-900 mb-2">US Exposure</h2>
        <p className="text-gray-600">Your relationship with the US market affects regulatory risk significantly.</p>
      </div>

      <InfoBox type="warning" title="US exposure is a critical factor">
        The SEC has jurisdiction over offerings that involve US persons, occur in the US, or are directed at US markets. Even inadvertent US exposure—such as failing to geo-block US users—can bring your project under SEC scrutiny.
      </InfoBox>

      <FormField
        label="Are you targeting US users or investors?"
        tooltip="Is the US market a focus for your project? This includes direct marketing, US-based team members promoting, or deliberately including US persons."
      >
        <div className="space-y-2">
          <RadioOption name="usTargeting" value="yes" checked={formData.usTargeting === 'yes'} onChange={() => updateFormData('usTargeting', 'yes')} label="Yes" description="US is a target market" />
          <RadioOption name="usTargeting" value="not-primary" checked={formData.usTargeting === 'not-primary'} onChange={() => updateFormData('usTargeting', 'not-primary')} label="Not primarily" description="US is not a focus but may have some exposure" />
          <RadioOption name="usTargeting" value="no" checked={formData.usTargeting === 'no'} onChange={() => updateFormData('usTargeting', 'no')} label="No" description="Actively excluding US market" />
        </div>
      </FormField>

      <FormField
        label="Are marketing efforts reaching US audiences?"
        tooltip="This includes English-language social media, US-based influencers, US media coverage, or conferences in the US."
      >
        <div className="space-y-2">
          <RadioOption name="usMarketing" value="yes" checked={formData.usMarketingEfforts === 'yes'} onChange={() => updateFormData('usMarketingEfforts', 'yes')} label="Yes" description="Marketing reaches US audiences" />
          <RadioOption name="usMarketing" value="probably" checked={formData.usMarketingEfforts === 'probably'} onChange={() => updateFormData('usMarketingEfforts', 'probably')} label="Probably" description="English-language marketing with global reach" />
          <RadioOption name="usMarketing" value="no" checked={formData.usMarketingEfforts === 'no'} onChange={() => updateFormData('usMarketingEfforts', 'no')} label="No" description="Marketing geo-targeted to exclude US" />
        </div>
      </FormField>

      <FormField
        label="Can US residents access and purchase tokens?"
        tooltip="Even without active marketing, if US persons can technically purchase tokens, there may be US exposure."
      >
        <div className="space-y-2">
          <RadioOption name="usAccess" value="yes" checked={formData.usResidentAccess === 'yes'} onChange={() => updateFormData('usResidentAccess', 'yes')} label="Yes" description="US residents can access and purchase" />
          <RadioOption name="usAccess" value="technically" checked={formData.usResidentAccess === 'technically'} onChange={() => updateFormData('usResidentAccess', 'technically')} label="Technically possible" description="No hard blocks, but terms exclude US" />
          <RadioOption name="usAccess" value="blocked" checked={formData.usResidentAccess === 'blocked'} onChange={() => updateFormData('usResidentAccess', 'blocked')} label="Blocked" description="Technical measures prevent US access" />
        </div>
      </FormField>

      <FormField label="What geographic restrictions are in place?">
        <TextArea
          value={formData.geoRestrictions}
          onChange={v => updateFormData('geoRestrictions', v)}
          placeholder="Describe any geo-blocking, IP filtering, attestations, or other measures to restrict US access."
          rows={3}
        />
      </FormField>

      <FormField
        label="Do you conduct KYC/AML?"
        tooltip="Know Your Customer and Anti-Money Laundering procedures. This affects who can participate and provides documentation."
      >
        <div className="space-y-2">
          <RadioOption name="kyc" value="comprehensive" checked={formData.kycAml === 'comprehensive'} onChange={() => updateFormData('kycAml', 'comprehensive')} label="Comprehensive KYC" description="Full identity verification for all participants" />
          <RadioOption name="kyc" value="accredited-only" checked={formData.kycAml === 'accredited-only'} onChange={() => updateFormData('kycAml', 'accredited-only')} label="For accredited investors only" description="KYC for private sale participants" />
          <RadioOption name="kyc" value="basic" checked={formData.kycAml === 'basic'} onChange={() => updateFormData('kycAml', 'basic')} label="Basic" description="Email or wallet verification only" />
          <RadioOption name="kyc" value="none" checked={formData.kycAml === 'none'} onChange={() => updateFormData('kycAml', 'none')} label="None" description="No KYC procedures" />
        </div>
      </FormField>

      <FormField
        label="Have you consulted with securities counsel?"
        tooltip="Have you received legal advice about securities law compliance for your token?"
      >
        <div className="space-y-2">
          <RadioOption name="counsel" value="yes-opinion" checked={formData.regulatoryConsultation === 'yes-opinion'} onChange={() => updateFormData('regulatoryConsultation', 'yes-opinion')} label="Yes, with written opinion" description="Received formal legal opinion" />
          <RadioOption name="counsel" value="yes-advice" checked={formData.regulatoryConsultation === 'yes-advice'} onChange={() => updateFormData('regulatoryConsultation', 'yes-advice')} label="Yes, informal advice" description="Consulted counsel but no formal opinion" />
          <RadioOption name="counsel" value="planning" checked={formData.regulatoryConsultation === 'planning'} onChange={() => updateFormData('regulatoryConsultation', 'planning')} label="Planning to" description="Have not yet but intend to" />
          <RadioOption name="counsel" value="no" checked={formData.regulatoryConsultation === 'no'} onChange={() => updateFormData('regulatoryConsultation', 'no')} label="No" description="Have not consulted securities counsel" />
        </div>
      </FormField>

      <FormField label="Any additional context for the analysis?">
        <TextArea
          value={formData.additionalContext}
          onChange={v => updateFormData('additionalContext', v)}
          placeholder="Anything else relevant to understanding your token's regulatory position? Unique circumstances, prior regulatory contact, specific concerns?"
          rows={4}
        />
      </FormField>

      <div className="mt-8 p-5 bg-gradient-to-r from-cyan-50 to-teal-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <div>
            <p className="text-cyan-900 font-semibold">Ready to Generate Analysis</p>
            <p className="text-cyan-700 text-sm mt-1">Click &quot;Generate Analysis&quot; to receive a comprehensive assessment of regulatory concerns, SEC perspective, and recommended actions.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (isAnalyzing) {
      return (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-cyan-100 rounded-full mb-8">
            <svg className="w-10 h-10 text-cyan-600 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </div>
          <h3 className="text-2xl font-bold text-navy-900 mb-3">Analyzing Your Token</h3>
          <p className="text-gray-600 max-w-md mx-auto">Evaluating against securities law frameworks, generating SEC perspective analysis, and identifying key concerns...</p>
        </div>
      );
    }

    if (!analysis) {
      return (
        <div className="text-center py-20">
          <p className="text-gray-600">No analysis available. Please complete the questionnaire first.</p>
          <button onClick={() => setCurrentStep(1)} className="mt-6 px-6 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors">Start Over</button>
        </div>
      );
    }

    const severityColors = {
      significant: { bg: 'bg-red-100', border: 'border-red-300', text: 'text-red-900', badge: 'bg-red-200 text-red-800' },
      elevated: { bg: 'bg-amber-100', border: 'border-amber-300', text: 'text-amber-900', badge: 'bg-amber-200 text-amber-800' },
      notable: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-900', badge: 'bg-blue-200 text-blue-800' },
    };

    const levelColors = severityColors[analysis.overallAssessment.level];

    return (
      <div className="space-y-8">
        {/* Top Disclaimer */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <svg className="w-8 h-8 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <div>
              <h4 className="font-bold text-amber-900 mb-2">Important Disclaimer</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                <strong>This analysis is for informational purposes only and does not constitute legal advice.</strong> Securities law analysis is highly fact-specific. This tool identifies potential concerns based on common regulatory frameworks but cannot replace consultation with qualified legal counsel. Token classification depends on the totality of circumstances and may differ from this analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Overall Assessment */}
        <div className={`p-8 rounded-2xl border-2 ${levelColors.bg} ${levelColors.border}`}>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-navy-900">Overall Assessment</h2>
              <p className="text-gray-600 mt-1">{formData.tokenName || 'Your Token'} {formData.tokenSymbol ? `(${formData.tokenSymbol})` : ''}</p>
            </div>
            <div className={`px-6 py-3 rounded-full font-bold text-lg ${levelColors.badge}`}>
              {analysis.overallAssessment.level === 'significant' && 'Significant Concerns'}
              {analysis.overallAssessment.level === 'elevated' && 'Elevated Concerns'}
              {analysis.overallAssessment.level === 'notable' && 'Notable Considerations'}
            </div>
          </div>
          <p className={`${levelColors.text} leading-relaxed mb-4`}>{analysis.overallAssessment.summary}</p>
          <div className="bg-white/60 rounded-xl p-4 mt-4">
            <p className="text-sm font-semibold text-gray-700 mb-1">SEC Perspective:</p>
            <p className="text-sm text-gray-600 leading-relaxed">{analysis.overallAssessment.secPerspective}</p>
          </div>
        </div>

        {/* Key Concerns */}
        {analysis.keyConcerns.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-navy-900 mb-2">Key Concerns Identified</h3>
            <p className="text-gray-600 text-sm mb-6">Issues that warrant attention based on your responses</p>
            <div className="space-y-4">
              {analysis.keyConcerns.map((concern, i) => {
                const colors = severityColors[concern.severity];
                return (
                  <div key={i} className={`p-5 rounded-xl border-l-4 ${colors.bg} ${colors.border}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.badge}`}>
                        {concern.severity === 'significant' && 'Significant'}
                        {concern.severity === 'elevated' && 'Elevated'}
                        {concern.severity === 'notable' && 'Notable'}
                      </span>
                      <span className="text-xs text-gray-500 font-medium">{concern.category}</span>
                    </div>
                    <h4 className="font-bold text-navy-900 mb-2">{concern.concern}</h4>
                    <div className="bg-white/60 rounded-lg p-3 mb-3">
                      <p className="text-xs font-semibold text-gray-700 mb-1">How regulators may view this:</p>
                      <p className="text-sm text-gray-600">{concern.secPerspective}</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-green-700 mb-1">Potential mitigation:</p>
                      <p className="text-sm text-green-800">{concern.mitigation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Howey Analysis */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-navy-900 mb-2">Howey Test Analysis</h3>
          <p className="text-gray-600 text-sm mb-6">How each prong of the Howey test applies to your token</p>
          <div className="space-y-4">
            {[
              { key: 'investmentOfMoney', title: 'Investment of Money', data: analysis.howeyAnalysis.investmentOfMoney },
              { key: 'commonEnterprise', title: 'Common Enterprise', data: analysis.howeyAnalysis.commonEnterprise },
              { key: 'expectationOfProfits', title: 'Expectation of Profits', data: analysis.howeyAnalysis.expectationOfProfits },
              { key: 'effortsOfOthers', title: 'Efforts of Others', data: analysis.howeyAnalysis.effortsOfOthers },
            ].map(({ key, title, data }) => (
              <details key={key} className="border border-gray-200 rounded-xl overflow-hidden">
                <summary className="p-4 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-navy-900">{title}</span>
                </summary>
                <div className="p-4 space-y-3">
                  {data.concerns.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1">Concerns:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {data.concerns.map((c, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-400 mt-1">•</span>{c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {data.mitigators.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">Mitigating Factors:</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {data.mitigators.map((m, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-400 mt-1">•</span>{m}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="bg-gray-50 rounded-lg p-3 mt-2">
                    <p className="text-xs font-semibold text-gray-700 mb-1">SEC Perspective:</p>
                    <p className="text-sm text-gray-600">{data.secView}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Mitigating Factors */}
        {analysis.mitigatingFactors.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              Favorable Factors
            </h3>
            <ul className="space-y-2">
              {analysis.mitigatingFactors.map((factor, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-green-800">
                  <span className="text-green-400 mt-1">•</span>{factor}
                </li>
              ))}
            </ul>
            <p className="text-xs text-green-700 mt-4 italic">Note: Favorable factors do not guarantee non-security classification. Securities analysis considers the totality of circumstances.</p>
          </div>
        )}

        {/* Critical Actions */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-navy-900 mb-2">Recommended Actions</h3>
          <p className="text-gray-600 text-sm mb-6">Priority steps based on this analysis</p>
          <div className="space-y-3">
            {analysis.criticalActions.map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </div>
                <p className="text-gray-700">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Counsel Guidance */}
        <div className="bg-navy-50 border border-navy-200 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-navy-900 mb-3">Counsel Consultation</h3>
          <p className="text-gray-700 leading-relaxed">{analysis.counselGuidance}</p>
        </div>

        {/* Bottom Disclaimer */}
        <div className="bg-gray-100 border border-gray-300 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <svg className="w-6 h-6 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>About this analysis:</strong> This tool provides educational guidance based on publicly available securities law frameworks. It is not legal advice and should not be relied upon for legal decisions.</p>
              <p>Token classification is highly fact-intensive and depends on the totality of circumstances. The same token may be analyzed differently at different stages of its lifecycle or under different regulatory approaches.</p>
              <p>If your project has Medium or Significant concern levels, or if your token distribution will include US persons, consultation with specialized crypto securities counsel is strongly recommended before proceeding.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <button onClick={startOver} className="px-8 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Start New Analysis</button>
          <button onClick={() => window.print()} className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold rounded-xl hover:from-cyan-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl">Export Report (PDF)</button>
        </div>
      </div>
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      case 7: return renderResults();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      <main className="pt-24 pb-16 px-4 sm:px-6 flex-grow">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-6">
              <div className="w-2 h-2 bg-cyan-600 rounded-full animate-pulse"></div>
              <span className="text-cyan-800 font-semibold text-xs uppercase tracking-wide">Token Securities Risk Analyzer</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight mb-4 leading-tight">
              Assess Your Token&apos;s Regulatory Risk
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Analyze your crypto token against U.S. securities law frameworks. Get actionable insights to inform your regulatory strategy.
            </p>
          </div>

          {/* Disclaimer Banner (Before Wizard) */}
          {currentStep < 7 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <p className="text-sm text-amber-800">
                  <strong>Disclaimer:</strong> This tool is for informational purposes only and does not constitute legal advice. Token classification is fact-intensive and requires professional legal analysis.
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-600">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </span>
              <span className="text-sm font-bold text-cyan-600">
                {Math.round((currentStep / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-8">
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          {currentStep < 7 && (
            <div className="flex justify-between items-center">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                ← Previous
              </button>
              {currentStep === 6 ? (
                <button
                  onClick={runAnalysis}
                  className="px-10 py-4 bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-bold rounded-xl hover:from-cyan-500 hover:to-teal-500 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Generate Analysis →
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  className="px-8 py-3 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
