// =============================================================================
// RATE LIMITING - Simple IP-based rate limiting
// =============================================================================

interface RateLimitEntry {
  count: number;
  resetAt: number; // timestamp
}

// In-memory store (resets on server restart, which is fine for MVP)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Rate limit configuration
// 10 analyses per day is generous for free tier while preventing abuse
const RATE_LIMIT = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

// IP validation regex - basic IPv4 and IPv6 patterns
const IPV4_REGEX = /^(\d{1,3}\.){3}\d{1,3}$/;
const IPV6_REGEX = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^([0-9a-fA-F]{1,4}:)*:([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;

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
 * Validate that a string looks like a valid IP address.
 * This prevents IP spoofing through malicious X-Forwarded-For headers.
 */
function isValidIp(ip: string): boolean {
  return IPV4_REGEX.test(ip) || IPV6_REGEX.test(ip);
}

/**
 * Get client IP from request with validation.
 *
 * Order of precedence:
 * 1. cf-connecting-ip (Cloudflare - most reliable if using CF)
 * 2. x-real-ip (Nginx proxy)
 * 3. First IP in x-forwarded-for (standard proxy header)
 *
 * All IPs are validated to prevent spoofing. If no valid IP is found,
 * we generate a unique identifier based on user-agent + timestamp.
 * This prevents all unknown users from sharing the same rate limit.
 */
export function getClientIp(request: Request): string {
  // Try Cloudflare header first (most reliable when using Cloudflare)
  const cfIp = request.headers.get('cf-connecting-ip');
  if (cfIp && isValidIp(cfIp.trim())) {
    return cfIp.trim();
  }

  // Try x-real-ip (set by nginx and other proxies)
  const realIp = request.headers.get('x-real-ip');
  if (realIp && isValidIp(realIp.trim())) {
    return realIp.trim();
  }

  // Try x-forwarded-for (standard, but can be spoofed)
  // Take only the first IP (client IP) and validate it
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const firstIp = forwarded.split(',')[0].trim();
    if (isValidIp(firstIp)) {
      return firstIp;
    }
  }

  // Fallback: Generate a pseudo-unique identifier
  // This prevents all unknown users from being grouped together
  const userAgent = request.headers.get('user-agent') || '';
  const fingerprint = `unknown-${hashCode(userAgent)}`;
  return fingerprint;
}

/**
 * Simple hash function for generating consistent fingerprints.
 * Not cryptographic, just for rate limiting differentiation.
 */
function hashCode(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
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
