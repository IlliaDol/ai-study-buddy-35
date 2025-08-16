import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Provider } from '../config/apiConfig';

export interface AIProviderState {
  provider: Provider;
  apiKey: string; // empty if offline or not set
  setProvider: (p: Provider) => void;
  setApiKey: (k: string) => void;
}

const Ctx = createContext<AIProviderState | null>(null);

function readProvider(): Provider {
  const raw = (localStorage.getItem('AI_PROVIDER') || 'offline').trim() as Provider;
  return (raw === 'openai' || raw === 'deepseek' || raw === 'offline') ? raw : 'offline';
}

function readKey(): string {
  return (localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || '').trim();
}

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [provider, setProviderState] = useState<Provider>(() => readProvider());
  const [apiKey, setApiKeyState] = useState<string>(() => readKey());

  useEffect(() => {
    localStorage.setItem('AI_PROVIDER', provider);
  }, [provider]);

  useEffect(() => {
    if (apiKey) localStorage.setItem('AI_API_KEY', apiKey);
  }, [apiKey]);

  const value = useMemo<AIProviderState>(() => ({
    provider,
    apiKey,
    setProvider: setProviderState,
    setApiKey: setApiKeyState,
  }), [provider, apiKey]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export function useAIProvider(): AIProviderState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAIProvider must be used within <AIProvider>');
  return ctx;
}
