'use client';

import React, { useEffect } from 'react';
import { useWizard } from '../WizardContext';
import { Select, Input } from '@/components/comp-optimizer/ui/Input';
import { normalizeRole } from '@/services/roleNormalizer';
import type { JobFamily, JobLevel, LocationType, GeoMarket } from '@/lib/comp-schemas';

const jobFamilyOptions = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'product', label: 'Product' },
  { value: 'design', label: 'Design' },
  { value: 'data-science', label: 'Data Science / Analytics' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'operations', label: 'Operations' },
  { value: 'finance', label: 'Finance' },
  { value: 'legal', label: 'Legal' },
  { value: 'hr-people', label: 'HR / People' },
  { value: 'customer-success', label: 'Customer Success' },
  { value: 'executive', label: 'Executive' },
];

const jobLevelOptions = [
  { value: 'intern', label: 'Intern' },
  { value: 'junior', label: 'Junior / Entry Level' },
  { value: 'mid', label: 'Mid-Level' },
  { value: 'senior', label: 'Senior' },
  { value: 'staff', label: 'Staff' },
  { value: 'principal', label: 'Principal' },
  { value: 'director', label: 'Director' },
  { value: 'vp', label: 'VP' },
  { value: 'c-level', label: 'C-Level' },
];

const locationTypeOptions = [
  { value: 'onsite', label: 'Onsite' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
];

const geoOptions = [
  { value: 'sv', label: 'San Francisco / Silicon Valley' },
  { value: 'nyc', label: 'New York City' },
  { value: 'la', label: 'Los Angeles' },
  { value: 'seattle', label: 'Seattle' },
  { value: 'austin', label: 'Austin' },
  { value: 'boston', label: 'Boston' },
  { value: 'denver', label: 'Denver' },
  { value: 'chicago', label: 'Chicago' },
  { value: 'remote-us', label: 'Remote (US)' },
  { value: 'international', label: 'International' },
];

export function Step2Role() {
  const { state, updateRoleProfile } = useWizard();
  const { roleProfile, companyContext } = state;

  // Auto-normalize title when it changes
  useEffect(() => {
    if (roleProfile.title && roleProfile.title.length > 2) {
      const debounceTimer = setTimeout(() => {
        const result = normalizeRole(roleProfile.title!);
        if (result.confidence > 50) {
          updateRoleProfile({
            jobFamily: result.roleProfile.jobFamily,
            jobLevel: result.roleProfile.jobLevel,
            normalizedTitle: result.roleProfile.normalizedTitle,
          });
        }
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  }, [roleProfile.title, updateRoleProfile]);

  // Default role geo to company geo
  useEffect(() => {
    if (!roleProfile.geo && companyContext.geoMarket) {
      updateRoleProfile({ geo: companyContext.geoMarket });
    }
  }, [companyContext.geoMarket, roleProfile.geo, updateRoleProfile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Role Details</h2>
        <p className="mt-1 text-sm text-slate-600">
          Describe the role you&apos;re hiring for. We&apos;ll match it to market benchmarks.
        </p>
      </div>

      <div className="space-y-6">
        <Input
          label="Job Title"
          type="text"
          placeholder="e.g., Senior Software Engineer, VP of Marketing"
          value={roleProfile.title ?? ''}
          onChange={(e) => updateRoleProfile({ title: e.target.value })}
          hint="Enter the actual title - we'll normalize it to benchmarks"
        />

        {roleProfile.normalizedTitle && roleProfile.title !== roleProfile.normalizedTitle && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Matched to:</span> {roleProfile.normalizedTitle}
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <Select
            label="Job Family"
            options={jobFamilyOptions}
            value={roleProfile.jobFamily}
            onChange={(e) => updateRoleProfile({ jobFamily: e.target.value as JobFamily })}
            hint="Function / department"
          />

          <Select
            label="Job Level"
            options={jobLevelOptions}
            value={roleProfile.jobLevel}
            onChange={(e) => updateRoleProfile({ jobLevel: e.target.value as JobLevel })}
            hint="Seniority level"
          />

          <Select
            label="Location Type"
            options={locationTypeOptions}
            value={roleProfile.locationType}
            onChange={(e) => updateRoleProfile({ locationType: e.target.value as LocationType })}
            hint="Where will this person work?"
          />

          <Select
            label="Role Geography"
            options={geoOptions}
            value={roleProfile.geo}
            onChange={(e) => updateRoleProfile({ geo: e.target.value as GeoMarket })}
            hint="For salary band adjustment"
          />
        </div>

        <Input
          label="Department (optional)"
          type="text"
          placeholder="e.g., Platform, Growth, Enterprise Sales"
          value={roleProfile.department ?? ''}
          onChange={(e) => updateRoleProfile({ department: e.target.value || undefined })}
          hint="Team or department name"
        />
      </div>
    </div>
  );
}
