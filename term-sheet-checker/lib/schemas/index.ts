// ============================================
// CENTRALIZED SCHEMA EXPORTS
// ============================================
// This file provides a single import point for all schema types.
// Import from '@/lib/schemas' for access to all types.

// Shared display labels
export * from './common';

// NOTE: Direct re-export of all schemas is not possible due to TypeScript
// limitations with Zod schemas (same name for value and type).
// Import specific schemas from their canonical locations:
//   - @/lib/comp-schemas (compensation optimizer types)
//   - @/lib/offer-evaluator-schemas (offer evaluation types)
//   - @/lib/token-risk-schemas (token risk analysis types)
//   - @/lib/safe-types (SAFE document types)
//   - @/lib/types/index (term sheet types)
