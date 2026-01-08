// =============================================================================
// RATE LIMITING - Simple IP-based rate limiting
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp
}

// In-memory store (resets on server restart, which is fine for MVP)
const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT = 1000; // requests per day (essentially unlimited for testing)
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Check if IP is rate limited
 * Returns { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetAt: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  // No entry or expired - create new
  if (!entry || now > entry.resetAt) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + WINDOW_MS
    };
    rateLimitStore.set(ip, newEntry);

    return {
      allowed: true,
      remaining: RATE_LIMIT - 1,
      resetAt: newEntry.resetAt
    };
  }

  // Entry exists and not expired
  if (entry.count >= RATE_LIMIT) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt
    };
  }

  // Increment count
  entry.count++;
  rateLimitStore.set(ip, entry);

  return {
    allowed: true,
    remaining: RATE_LIMIT - entry.count,
    resetAt: entry.resetAt
  };
}

/**
 * Get client IP from request
 */
export function getClientIp(request: Request): string {
  // Try various headers that might contain the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback (this might be Vercel's IP in production)
  return 'unknown';
}

/**
 * Clean up expired entries (call periodically)
 */
export function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (now > entry.resetAt) {
      rateLimitStore.delete(ip);
    }
  }
}

// Clean up every hour
setInterval(cleanupExpiredEntries, 60 * 60 * 1000);
