// API Configuration for AI Study Buddy
// This file contains API settings and keys for external services

export interface APIConfig {
  provider: 'deepseek' | 'openai';
  apiKey: string;
  baseUrl?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

// Default API configuration
export const defaultAPIConfig: Omit<APIConfig, 'apiKey'> = {
  provider: 'deepseek',
  baseUrl: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-reasoner',
  temperature: 0.2,
  maxTokens: 2000,
};

// OpenAI configuration
export const openaiConfig: Omit<APIConfig, 'apiKey'> = {
  provider: 'openai',
  baseUrl: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-4o-mini',
  temperature: 0.2,
  maxTokens: 2000,
};

// API Keys - Replace with your actual keys
export const API_KEYS = {
  // DeepSeek API Key - Insert your key here
  DEEPSEEK_API_KEY: 'sk-2231f2e6d3d84fd5ab2a4021fbe2d306', // sk-your-deepseek-key-here
  
  // OpenAI API Key - Not used (DeepSeek only)
  OPENAI_API_KEY: '', // Not needed - using DeepSeek only
};

// Get API configuration based on provider
export function getAPIConfig(provider: 'deepseek' | 'openai'): APIConfig {
  const apiKey = provider === 'deepseek' 
    ? API_KEYS.DEEPSEEK_API_KEY 
    : API_KEYS.OPENAI_API_KEY;
    
  if (!apiKey) {
    throw new Error(`API key not configured for provider: ${provider}`);
  }
  
  const config = provider === 'deepseek' ? defaultAPIConfig : openaiConfig;
  
  return {
    ...config,
    apiKey,
  };
}

// Validate API key format
export function validateAPIKey(key: string, provider: 'deepseek' | 'openai'): boolean {
  if (!key || typeof key !== 'string') return false;
  
  // Both DeepSeek and OpenAI keys start with 'sk-'
  if (!key.startsWith('sk-')) return false;
  
  // Basic length validation
  if (key.length < 20) return false;
  
  return true;
}

// Get current API configuration from localStorage or config file
export function getCurrentAPIConfig(): APIConfig | null {
  try {
    // First try localStorage (for runtime configuration)
    const provider = (localStorage.getItem('AI_PROVIDER') || 'deepseek') as 'deepseek' | 'openai';
    const localKey = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY');
    
    if (localKey && validateAPIKey(localKey, provider)) {
      const config = provider === 'deepseek' ? defaultAPIConfig : openaiConfig;
      return {
        ...config,
        apiKey: localKey,
      };
    }
    
    // Fallback to config file keys
    return getAPIConfig(provider);
  } catch (error) {
    console.warn('Failed to get API configuration:', error);
    return null;
  }
}

// Set API configuration in localStorage
export function setAPIConfig(provider: 'deepseek' | 'openai', apiKey: string): boolean {
  if (!validateAPIKey(apiKey, provider)) {
    console.error('Invalid API key format');
    return false;
  }
  
  try {
    localStorage.setItem('AI_PROVIDER', provider);
    localStorage.setItem('AI_API_KEY', apiKey);
    
    // Keep legacy OpenAI key for backward compatibility
    if (provider === 'openai') {
      localStorage.setItem('OPENAI_API_KEY', apiKey);
    }
    
    return true;
  } catch (error) {
    console.error('Failed to save API configuration:', error);
    return false;
  }
}

// Clear API configuration
export function clearAPIConfig(): void {
  localStorage.removeItem('AI_PROVIDER');
  localStorage.removeItem('AI_API_KEY');
  localStorage.removeItem('OPENAI_API_KEY');
}

// Check if API is configured
export function isAPIConfigured(): boolean {
  const config = getCurrentAPIConfig();
  return config !== null && !!config.apiKey;
}

// Get provider display name
export function getProviderDisplayName(provider: 'deepseek' | 'openai'): string {
  return provider === 'deepseek' ? 'DeepSeek Reasoner' : 'OpenAI GPT';
}

// API timeout configuration
export const API_TIMEOUTS = {
  DEFAULT: 20000, // 20 seconds
  QUICK: 10000,   // 10 seconds for quick operations
  LONG: 60000,    // 60 seconds for complex operations
};

// Rate limiting configuration
export const RATE_LIMITS = {
  REQUESTS_PER_MINUTE: 60,
  REQUESTS_PER_HOUR: 1000,
};

// Error messages
export const API_ERROR_MESSAGES = {
  INVALID_KEY: 'Invalid API key format. Keys should start with "sk-"',
  KEY_NOT_CONFIGURED: 'API key not configured. Please set your API key in settings.',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded. Please wait before making more requests.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timeout. The API took too long to respond.',
};
