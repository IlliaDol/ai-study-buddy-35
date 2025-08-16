import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAnalytics } from './lib/analytics'
// Import i18n
import './i18n'
// Import DeepSeek configuration
import './config/deepseekConfig'

createRoot(document.getElementById("root")!).render(<App />);

// Initialize analytics (keys optional; safe no-ops if not provided)
initAnalytics({
  posthogKey: (import.meta as any).env?.VITE_POSTHOG_KEY,
  posthogHost: (import.meta as any).env?.VITE_POSTHOG_HOST,
  sentryDsn: (import.meta as any).env?.VITE_SENTRY_DSN,
  env: (import.meta as any).env?.MODE,
});

// Register a simple service worker for offline caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {/* ignore */});
  });
}

// Define proxy flag for API calls (will be true in production environment)
(window as any).__USE_PROXY__ = Boolean((import.meta as any).env?.VITE_USE_API_PROXY === 'true');
