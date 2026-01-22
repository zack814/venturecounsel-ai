// =============================================================================
// VALIDATION UTILITIES - Input validation functions
// =============================================================================

/**
 * RFC 5322 compliant email regex (simplified but robust).
 *
 * This is stricter than the basic regex previously used:
 * - Requires valid local part with allowed special characters
 * - Requires at least one dot in the domain
 * - Domain parts must start and end with alphanumeric
 * - Maximum length of 254 characters (per RFC 5321)
 */
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

/**
 * Validate email address with stricter rules.
 *
 * Checks:
 * - Format matches RFC 5322 (simplified)
 * - Maximum length of 254 characters
 * - TLD has at least 2 characters
 *
 * @param email - Email address to validate
 * @returns true if valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Check maximum length (RFC 5321)
  if (email.length > 254) {
    return false;
  }

  // Check local part length (before @) - max 64 chars per RFC 5321
  const atIndex = email.lastIndexOf('@');
  if (atIndex === -1 || atIndex > 64) {
    return false;
  }

  // Check format
  if (!EMAIL_REGEX.test(email)) {
    return false;
  }

  // Check TLD has at least 2 characters
  const domain = email.substring(atIndex + 1);
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return false;
  }

  return true;
}

/**
 * Normalize email address for storage and comparison.
 *
 * - Converts to lowercase
 * - Trims whitespace
 * - Removes any invisible characters
 *
 * @param email - Email address to normalize
 * @returns Normalized email or empty string if invalid input
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email
    .toLowerCase()
    .trim()
    // Remove zero-width characters and other invisible chars
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
}

/**
 * Validate and normalize email in one step.
 * Returns the normalized email if valid, null if invalid.
 *
 * @param email - Email address to validate and normalize
 * @returns Normalized email or null if invalid
 */
export function validateAndNormalizeEmail(email: string): string | null {
  const normalized = normalizeEmail(email);
  if (!normalized || !isValidEmail(normalized)) {
    return null;
  }
  return normalized;
}
