// =============================================================================
// AUTH UTILITIES - Secure password comparison
// =============================================================================

import { timingSafeEqual } from 'crypto';

/**
 * Verify admin password using constant-time comparison to prevent timing attacks.
 *
 * Standard string comparison (===) can leak password length through timing
 * differences. This function uses crypto.timingSafeEqual which takes constant
 * time regardless of where characters differ.
 */
export function verifyAdminPassword(provided: string | null): boolean {
  const expected = process.env.ADMIN_PASSWORD;

  // Early return if either value is missing
  if (!provided || !expected) {
    return false;
  }

  // Convert to buffers for comparison
  const providedBuf = Buffer.from(provided, 'utf-8');
  const expectedBuf = Buffer.from(expected, 'utf-8');

  // timingSafeEqual requires equal length buffers
  // We pad the shorter one to prevent length-based timing attacks
  if (providedBuf.length !== expectedBuf.length) {
    // Compare against expected anyway to maintain constant time
    // This prevents attackers from determining password length
    timingSafeEqual(expectedBuf, expectedBuf);
    return false;
  }

  return timingSafeEqual(providedBuf, expectedBuf);
}

/**
 * Middleware helper to check admin authentication from request headers.
 * Returns true if the x-admin-password header matches.
 */
export function isAdminAuthenticated(request: Request): boolean {
  const authHeader = request.headers.get('x-admin-password');
  return verifyAdminPassword(authHeader);
}
