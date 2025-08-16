// API Configuration for AI Study Buddy (production-safe)
// NOTE: Secrets MUST NOT be committed to the repo. Keys come from runtime settings only.

export type Provider = 'offline' | 'deepseek' | 'openai';

export interface APIConfig {
  provider: Exclude<Provider, 'offline'>;
  apiKey: string;
  baseUrl: string;
  model: string;
  temperature: number;
  maxTokens: number;
}

// Provider presets (without secrets)
export const deepseekPreset = {
  provider: 'deepseek' as const,
  baseUrl: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-reasoner',
  temperature: 0.2,
  maxTokens: 800,
};

export const openaiPreset = {
  provider: 'openai' as const,
  baseUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  temperature: 0.2,
  maxTokens: 800,
};

export const API_TIMEOUTS = {
  DEFAULT: 45_000,
  QUICK: 15_000,
  LONG: 120_000,
};

export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_HOUR: 1000,
};

export const API_ERROR_MESSAGES = {
  INVALID_KEY: 'Invalid API key format. Keys should start with "sk-"',
  KEY_NOT_CONFIGURED: 'API key not configured. Please set your API key in settings.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait before making more requests.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. The API took too long to respond.',
};

export function validateAPIKey(key: string): boolean {
  if (!key || typeof key !== 'string') return false;
  if (!key.startsWith('sk-')) return false;
  return key.length >= 20;
}

/** Returns the current provider string (may be 'offline' when no key). */
export function getCurrentProvider(): Provider {
  const p = (localStorage.getItem('AI_PROVIDER') || 'offline') as Provider;
  return p;
}

/** Returns a full API config or null if not configured (use offline fallback). */
export function getCurrentAPIConfig(): APIConfig | null {
  try {
    const provider = getCurrentProvider();
    if (provider === 'offline') return null;

    const key = (localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || '').trim();
    if (!validateAPIKey(key)) return null;

    const preset = provider === 'deepseek' ? deepseekPreset : openaiPreset;
    return { ...preset, apiKey: key };
  } catch (err) {
    console.warn('Failed to get API configuration:', err);
    return null;
  }
}

export function setAPIConfig(provider: Provider, apiKey?: string): boolean {
  try {
    localStorage.setItem('AI_PROVIDER', provider);

    if (provider === 'offline') {
      localStorage.removeItem('AI_API_KEY');
      return true;
    }

    const key = (apiKey || '').trim();
    if (!validateAPIKey(key)) return false;
    localStorage.setItem('AI_API_KEY', key);
    if (provider === 'openai') localStorage.setItem('OPENAI_API_KEY', key); // legacy compat
    return true;
  } catch (err) {
    console.error('Failed to save API configuration:', err);
    return false;
  }
}

export function clearAPIConfig(): void {
  localStorage.removeItem('AI_PROVIDER');
  localStorage.removeItem('AI_API_KEY');
  localStorage.removeItem('OPENAI_API_KEY');
}

export function isAPIConfigured(): boolean {
  return getCurrentAPIConfig() !== null;
}

export function getProviderDisplayName(provider: Provider): string {
  switch (provider) {
    case 'deepseek':
      return 'DeepSeek Reasoner';
    case 'openai':
      return 'OpenAI GPT';
    default:
      return 'Offline';
  }
}
