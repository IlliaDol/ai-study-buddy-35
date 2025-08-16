// Lightweight analytics facade with safe no-op fallbacks.
// Will try to dynamically import optional deps (posthog-js, @sentry/browser) if present.

let posthog: any = null;
let sentry: any = null;

export type AnalyticsConfig = {
  posthogKey?: string;
  posthogHost?: string;
  sentryDsn?: string;
  env?: 'development' | 'production' | 'test';
};

// Fully dynamic import helper to avoid static module resolution/type errors
const dynImport = (specifier: string): Promise<any> => {
  // eslint-disable-next-line @typescript-eslint/no-implied-eval
  const importer = new Function('s', 'return import(s)');
  return importer(specifier);
};

export function initAnalytics(cfg: AnalyticsConfig = {}) {
  const env = cfg.env || (import.meta as any).env?.MODE || 'development';

  // PostHog (optional)
  if (cfg.posthogKey) {
    dynImport('posthog-js').then((m) => {
      posthog = m.default;
      posthog.init(cfg.posthogKey!, {
        api_host: cfg.posthogHost || 'https://us.i.posthog.com',
        capture_pageview: true,
        capture_pageleave: true,
      });
    }).catch(() => {/* ignore if not installed */});
  }

  // Sentry (optional)
  if (cfg.sentryDsn && env === 'production') {
    dynImport('@sentry/browser').then((m) => {
      sentry = m;
      sentry.init({ dsn: cfg.sentryDsn });
    }).catch(() => {/* ignore if not installed */});
  }
}

export function track(event: string, properties?: Record<string, any>) {
  try {
    if (posthog?.capture) {
      posthog.capture(event, properties);
    }
  } catch {}
}

export function captureException(err: unknown, context?: Record<string, any>) {
  try {
    if (sentry?.captureException) {
      sentry.captureException(err, { extra: context });
    }
  } catch {}
}
