'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from '@react-pdf/renderer';
import type { CompPackage, RiskFlag, OfferLanguageBlock } from '@/lib/comp-schemas';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
  },
  packageCard: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    marginBottom: 10,
    borderRadius: 4,
  },
  packageName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  recommended: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  label: {
    color: '#666',
  },
  value: {
    fontWeight: 'bold',
  },
  riskFlag: {
    padding: 10,
    marginBottom: 8,
    borderRadius: 4,
  },
  criticalFlag: {
    backgroundColor: '#ffebee',
  },
  warningFlag: {
    backgroundColor: '#fff8e1',
  },
  infoFlag: {
    backgroundColor: '#e3f2fd',
  },
  flagTitle: {
    fontWeight: 'bold',
    marginBottom: 3,
  },
  flagText: {
    fontSize: 9,
  },
  clause: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  clauseTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  clauseContent: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 8,
    color: '#999',
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff3e0',
    borderRadius: 4,
  },
  disclaimerText: {
    fontSize: 8,
    color: '#666',
    lineHeight: 1.4,
  },
});

interface PDFDocumentProps {
  packages: CompPackage[];
  bestFitPackage: CompPackage;
  riskFlags: RiskFlag[];
  offerBlocks: OfferLanguageBlock[];
  roleTitle: string;
  stage: string;
  generatedAt: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatPercent(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`;
}

export function CompReportPDF({
  packages,
  bestFitPackage,
  riskFlags,
  offerBlocks,
  roleTitle,
  stage,
  generatedAt,
}: PDFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Compensation Package Report</Text>
          <Text style={styles.subtitle}>
            {roleTitle} | {stage} Stage | Generated {generatedAt}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Packages</Text>
          {packages.map((pkg) => (
            <View
              key={pkg.id}
              style={[
                styles.packageCard,
                ...(pkg.isRecommended ? [styles.recommended] : []),
              ]}
            >
              <Text style={styles.packageName}>
                {pkg.name} {pkg.isRecommended && '(Recommended)'}
              </Text>
              <View style={styles.row}>
                <Text style={styles.label}>Base Salary</Text>
                <Text style={styles.value}>{formatCurrency(pkg.baseSalary)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Bonus Target</Text>
                <Text style={styles.value}>{formatCurrency(pkg.bonusTarget)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Equity (% FD)</Text>
                <Text style={styles.value}>{formatPercent(pkg.equityPercentFD, 3)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Options</Text>
                <Text style={styles.value}>{pkg.equityOptionCount.toLocaleString()}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Monthly Burn</Text>
                <Text style={styles.value}>{formatCurrency(pkg.burnDeltaMonthly)}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Pool Impact</Text>
                <Text style={styles.value}>{formatPercent(pkg.poolImpactPercent, 1)}</Text>
              </View>
              {pkg.expectedValueBand && (
                <View style={styles.row}>
                  <Text style={styles.label}>Expected Value Range</Text>
                  <Text style={styles.value}>
                    {formatCurrency(pkg.expectedValueBand.low)} - {formatCurrency(pkg.expectedValueBand.high)}
                  </Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={styles.label}>Overall Score</Text>
                <Text style={styles.value}>{pkg.scores.overallScore}/100</Text>
              </View>
            </View>
          ))}
        </View>

        {riskFlags.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Risk Flags & Compliance Notes</Text>
            {riskFlags.map((flag, index) => (
              <View
                key={index}
                style={[
                  styles.riskFlag,
                  ...(flag.severity === 'critical' ? [styles.criticalFlag] : []),
                  ...(flag.severity === 'warning' ? [styles.warningFlag] : []),
                  ...(flag.severity === 'info' ? [styles.infoFlag] : []),
                ]}
              >
                <Text style={styles.flagTitle}>{flag.title}</Text>
                <Text style={styles.flagText}>{flag.description}</Text>
                {flag.actionRequired && (
                  <Text style={[styles.flagText, { marginTop: 3, fontWeight: 'bold' }]}>
                    Action: {flag.actionRequired}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerText}>
            DISCLAIMER: This report is for informational purposes only and does not constitute legal,
            tax, or financial advice. Compensation decisions should be made in consultation with
            qualified professionals. Market data is based on curated benchmarks and may not reflect
            your specific market conditions. All expected value calculations are illustrative and
            not guarantees of future value.
          </Text>
        </View>

        <Text style={styles.footer}>
          Generated by Comp Mix Optimizer | VentureCounsel.ai
        </Text>
      </Page>

      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Offer Language Blocks</Text>
          <Text style={styles.subtitle}>
            Copy-paste ready language for your offer letter
          </Text>
        </View>

        {offerBlocks.map((block) => (
          <View key={block.id} style={styles.clause}>
            <Text style={styles.clauseTitle}>{block.title}</Text>
            <Text style={styles.clauseContent}>{block.content}</Text>
          </View>
        ))}

        <Text style={styles.footer}>
          Generated by Comp Mix Optimizer | VentureCounsel.ai
        </Text>
      </Page>
    </Document>
  );
}

export async function generatePDF(props: PDFDocumentProps): Promise<Blob> {
  const doc = <CompReportPDF {...props} />;
  const blob = await pdf(doc).toBlob();
  return blob;
}

export async function downloadPDF(props: PDFDocumentProps, filename: string = 'comp-report.pdf') {
  const blob = await generatePDF(props);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
