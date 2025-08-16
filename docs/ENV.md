# Environment Setup (Analytics & Error Tracking)

Optional keys. If not provided, analytics facade becomes a safe no-op.

Create a `.env` file (or `.env.local`) in the project root:

```
VITE_POSTHOG_KEY=
VITE_POSTHOG_HOST=https://us.i.posthog.com
VITE_SENTRY_DSN=
```

Notes:
- `VITE_POSTHOG_KEY`: Your PostHog project API key.
- `VITE_POSTHOG_HOST`: PostHog host. Use your region host if different.
- `VITE_SENTRY_DSN`: Sentry DSN. Sentry will only initialize in `production` mode.

How it works:
- `src/lib/analytics.ts` uses dynamic imports to optionally load `posthog-js` and `@sentry/browser` if present. If you don't install them, nothing breaks.
- Initialization occurs in `src/main.tsx` via `initAnalytics()`.

Install optional deps (only if you plan to use them):

```
npm i posthog-js @sentry/browser
```

Remove later if not needed:

```
npm remove posthog-js @sentry/browser
```
