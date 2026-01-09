// Analytics utility for GA4 event tracking
// Provides type-safe event tracking that works with Google Tag Manager

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

type EventParams = Record<string, string | number | boolean>;

/**
 * Push event to dataLayer for GTM processing
 * Works with GA4 tags configured in GTM
 */
export function trackEvent(eventName: string, params?: EventParams): void {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

/**
 * Track email capture conversions
 * Fires when user successfully submits email for a lead magnet
 */
export function trackEmailCapture(
  leadMagnet: string,
  sourcePage: string,
  sourceVariant: string
): void {
  trackEvent('email_captured', {
    lead_magnet: leadMagnet,
    source_page: sourcePage,
    source_variant: sourceVariant,
  });

  // Also send to GA4 directly if gtag is available (backup)
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: 1,
      lead_magnet: leadMagnet,
      source_page: sourcePage,
    });
  }
}

/**
 * Track tool usage (term sheet checker, SAFE generator, etc.)
 * Call this when user starts using a tool
 */
export function trackToolUsage(toolName: string, action: string): void {
  trackEvent('tool_used', {
    tool_name: toolName,
    action: action,
  });
}

/**
 * Track file uploads
 */
export function trackFileUpload(fileType: string, toolName: string): void {
  trackEvent('file_uploaded', {
    file_type: fileType,
    tool_name: toolName,
  });
}

/**
 * Track CTA clicks
 */
export function trackCTAClick(buttonName: string, location: string): void {
  trackEvent('cta_clicked', {
    button_name: buttonName,
    location: location,
  });
}
