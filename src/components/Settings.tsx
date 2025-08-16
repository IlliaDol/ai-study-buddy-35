import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { KeyRound, Save, X, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useTranslation } from "react-i18next";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState('deepseek');
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [keyError, setKeyError] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Load current settings from localStorage
    const currentProvider = localStorage.getItem('AI_PROVIDER') || 'deepseek';
    const currentKey = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || '';

    setProvider(currentProvider);
    setApiKey(currentKey);
  }, []);

  const validateKey = (key: string, provider: string): boolean => {
    if (!key) return true; // Empty key is allowed

    if (provider === 'deepseek' && (!key.startsWith('sk-') || key.length < 20)) {
      setKeyError(t('settings.error.deepseekFormat'));
      return false;
    }

    setKeyError('');
    return true;
  };

  const handleSave = () => {
    if (!validateKey(apiKey, provider)) {
      toast({
        title: t('settings.error.invalidKey'),
        description: keyError,
        variant: "destructive"
      });
      return;
    }

    localStorage.setItem('AI_PROVIDER', provider);
    localStorage.setItem('AI_API_KEY', apiKey);
    
    // Keep legacy for OpenAI
    if (provider === 'openai') {
      localStorage.setItem('OPENAI_API_KEY', apiKey);
    }
    
    toast({
      title: t('settings.saved'),
      description: t('settings.providerSet', { provider }),
    });
    onClose();
  };

  const getMaskedKey = (key: string) => {
    if (!key) return '';
    if (key.length < 8) return '****';
    return `${key.substring(0, 3)}${'*'.repeat(key.length - 6)}${key.substring(key.length - 3)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <KeyRound size={20} />
            {t('settings.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label={t('common.cancel')}
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {t('settings.provider')}
            </label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                setKeyError('');
              }}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="deepseek">DeepSeek Reasoner</option>
              <option value="openai">OpenAI GPT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              {t('settings.apiKey')}
            </label>
            <div className="relative">
              <input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  validateKey(e.target.value, provider);
                }}
                placeholder="sk-..."
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowApiKey(!showApiKey)}
                aria-label={showApiKey ? "Hide API key" : "Show API key"}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {keyError && <p className="text-xs text-red-500 mt-1">{keyError}</p>}
            <p className="text-xs text-gray-500 mt-1">
              {!showApiKey && apiKey ? t('settings.apiKeyStored', { key: getMaskedKey(apiKey) }) : ''}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {t('settings.apiKeyNote')}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {t('settings.save')}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            {t('common.cancel')}
          </button>
        </div>
      </Card>
    </div>
  );
}
