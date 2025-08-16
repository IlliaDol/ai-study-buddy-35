import { deepseekPreset, getCurrentAPIConfig } from './apiConfig';

export const deepseekConfig = {
  baseUrl: deepseekPreset.baseUrl,
  model: deepseekPreset.model,
  /** Returns the user-provided key from runtime settings (or empty string). */
  get apiKey() {
    const cfg = getCurrentAPIConfig();
    return cfg?.provider === 'deepseek' ? cfg.apiKey : '';
  },
};
