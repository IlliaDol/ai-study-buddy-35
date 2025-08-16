import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { KeyRound, Save, X } from "lucide-react";

interface SettingsProps {
  onClose: () => void;
}

export const Settings = ({ onClose }: SettingsProps) => {
  const [provider, setProvider] = useState('deepseek');
  const [apiKey, setApiKey] = useState('sk-2231f2e6d3d84fd5ab2a4021fbe2d306');

  useEffect(() => {
    // Load current settings from localStorage
    const currentProvider = localStorage.getItem('AI_PROVIDER') || 'deepseek';
    const currentKey = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || 'sk-2231f2e6d3d84fd5ab2a4021fbe2d306';
    
    setProvider(currentProvider);
    setApiKey(currentKey);
  }, []);

  const handleSave = () => {
    localStorage.setItem('AI_PROVIDER', provider);
    localStorage.setItem('AI_API_KEY', apiKey);
    
    // Keep legacy for OpenAI
    if (provider === 'openai') {
      localStorage.setItem('OPENAI_API_KEY', apiKey);
    }
    
    alert(`Settings saved! AI provider: ${provider}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <KeyRound size={20} />
            AI Settings
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Close settings"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              AI Provider
            </label>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="deepseek">DeepSeek Reasoner</option>
              <option value="openai">OpenAI GPT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Your API key is stored locally in your browser
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            Save Settings
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </Card>
    </div>
  );
};
