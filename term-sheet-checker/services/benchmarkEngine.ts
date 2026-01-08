import benchmarkData from '@/data/benchmarks/v1/sv_default.json';
import type { CompanyStage, JobFamily, JobLevel, GeoMarket } from '@/lib/comp-schemas';

export interface SalaryPercentiles {
  p25: number;
  p50: number;
  p75: number;
}

export interface EquityPercentiles {
  p25: number; // in basis points
  p50: number;
  p75: number;
}

export interface BenchmarkResult {
  salary: SalaryPercentiles;
  equityBps: EquityPercentiles;
  ote?: SalaryPercentiles; // for sales roles
  confidence: number;
  source: string;
}

export interface VestingDefaults {
  totalMonths: number;
  cliffMonths: number;
  vestingFrequency: 'monthly' | 'quarterly' | 'annually';
}

export interface ExitScenario {
  exitMultiple: number;
  dilutionFactor: number;
  timeToLiquidityYears: number;
  probabilityWeight: number;
}

export interface ExitScenarios {
  lowCase: ExitScenario;
  baseCase: ExitScenario;
  highCase: ExitScenario;
}

class BenchmarkEngine {
  private data: typeof benchmarkData;

  constructor() {
    this.data = benchmarkData;
  }

  getBenchmark(
    jobFamily: JobFamily,
    jobLevel: JobLevel,
    stage: CompanyStage,
    geo: GeoMarket = 'sv'
  ): BenchmarkResult | null {
    const familyData = this.data[jobFamily as keyof typeof this.data];
    if (!familyData || typeof familyData !== 'object') {
      return null;
    }

    const levelData = familyData[jobLevel as keyof typeof familyData];
    if (!levelData || typeof levelData !== 'object') {
      // Try to find a close level match
      return this.findClosestLevelMatch(jobFamily, jobLevel, stage, geo);
    }

    const stageData = levelData[stage as keyof typeof levelData] as Record<string, unknown>;
    if (!stageData || typeof stageData !== 'object') {
      return null;
    }

    const geoAdjustment = this.getGeoAdjustment(geo);
    const salaryData = stageData['salary'] as SalaryPercentiles;
    const equityData = stageData['equityBps'] as EquityPercentiles;

    return {
      salary: {
        p25: Math.round(salaryData.p25 * geoAdjustment),
        p50: Math.round(salaryData.p50 * geoAdjustment),
        p75: Math.round(salaryData.p75 * geoAdjustment),
      },
      equityBps: equityData,
      ote: stageData['ote'] ? {
        p25: Math.round((stageData['ote'] as SalaryPercentiles).p25 * geoAdjustment),
        p50: Math.round((stageData['ote'] as SalaryPercentiles).p50 * geoAdjustment),
        p75: Math.round((stageData['ote'] as SalaryPercentiles).p75 * geoAdjustment),
      } : undefined,
      confidence: this.data.confidence,
      source: this.data.source,
    };
  }

  private findClosestLevelMatch(
    jobFamily: JobFamily,
    jobLevel: JobLevel,
    stage: CompanyStage,
    geo: GeoMarket
  ): BenchmarkResult | null {
    const levelHierarchy: JobLevel[] = ['intern', 'junior', 'mid', 'senior', 'staff', 'principal', 'director', 'vp', 'c-level'];
    const currentIndex = levelHierarchy.indexOf(jobLevel);

    const familyData = this.data[jobFamily as keyof typeof this.data];
    if (!familyData || typeof familyData !== 'object') return null;

    // Try adjacent levels
    for (let offset = 1; offset < levelHierarchy.length; offset++) {
      for (const direction of [-1, 1]) {
        const tryIndex = currentIndex + (offset * direction);
        if (tryIndex >= 0 && tryIndex < levelHierarchy.length) {
          const tryLevel = levelHierarchy[tryIndex];
          const levelData = familyData[tryLevel as keyof typeof familyData];
          if (levelData && typeof levelData === 'object') {
            const stageData = levelData[stage as keyof typeof levelData] as Record<string, unknown>;
            if (stageData && typeof stageData === 'object') {
              const geoAdjustment = this.getGeoAdjustment(geo);
              const salaryData = stageData['salary'] as SalaryPercentiles;
              const equityData = stageData['equityBps'] as EquityPercentiles;
              return {
                salary: {
                  p25: Math.round(salaryData.p25 * geoAdjustment),
                  p50: Math.round(salaryData.p50 * geoAdjustment),
                  p75: Math.round(salaryData.p75 * geoAdjustment),
                },
                equityBps: equityData,
                confidence: this.data.confidence * 0.8, // Lower confidence for approximate match
                source: `${this.data.source} (approximated from ${tryLevel})`,
              };
            }
          }
        }
      }
    }
    return null;
  }

  getGeoAdjustment(geo: GeoMarket): number {
    return this.data.geoAdjustments[geo as keyof typeof this.data.geoAdjustments] ?? 1.0;
  }

  getEmployerLoad(geo: GeoMarket): number {
    return this.data.employerLoadDefaults[geo as keyof typeof this.data.employerLoadDefaults] ?? 0.25;
  }

  getVestingDefaults(type: 'standard' | 'executive' | 'advisor' = 'standard'): VestingDefaults {
    return this.data.vestingDefaults[type] as VestingDefaults;
  }

  getTypicalFDShares(stage: CompanyStage): { min: number; typical: number; max: number } {
    return this.data.stageTypicalFDRanges[stage as keyof typeof this.data.stageTypicalFDRanges];
  }

  getTypicalPoolSize(stage: CompanyStage): number {
    return this.data.stageTypicalPoolSize[stage as keyof typeof this.data.stageTypicalPoolSize];
  }

  getExitScenarios(stage: CompanyStage): ExitScenarios {
    return this.data.exitScenarios[stage as keyof typeof this.data.exitScenarios] as ExitScenarios;
  }

  interpolateSalary(
    percentile: number,
    benchmarks: SalaryPercentiles
  ): number {
    if (percentile <= 25) return benchmarks.p25;
    if (percentile >= 75) return benchmarks.p75;

    if (percentile <= 50) {
      const ratio = (percentile - 25) / 25;
      return Math.round(benchmarks.p25 + ratio * (benchmarks.p50 - benchmarks.p25));
    } else {
      const ratio = (percentile - 50) / 25;
      return Math.round(benchmarks.p50 + ratio * (benchmarks.p75 - benchmarks.p50));
    }
  }

  interpolateEquity(
    percentile: number,
    benchmarks: EquityPercentiles
  ): number {
    if (percentile <= 25) return benchmarks.p25;
    if (percentile >= 75) return benchmarks.p75;

    if (percentile <= 50) {
      const ratio = (percentile - 25) / 25;
      return Math.round(benchmarks.p25 + ratio * (benchmarks.p50 - benchmarks.p25));
    } else {
      const ratio = (percentile - 50) / 25;
      return Math.round(benchmarks.p50 + ratio * (benchmarks.p75 - benchmarks.p50));
    }
  }
}

export const benchmarkEngine = new BenchmarkEngine();
