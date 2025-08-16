import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LoadingBlock } from "./LoadingBlock";
import { ErrorBlock } from "./ErrorBlock";
import { aiAgent } from "@/lib/aiAgent";

interface LanguageLearningProps {
  onLanguageSelect: (language: string, content: Array<{ front: string; back: string }>) => void;
  onBack: () => void;
}

const languages = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
];

export const LanguageLearning = ({ onLanguageSelect, onBack }: LanguageLearningProps) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const selectedLangData = languages.find(lang => lang.name.toLowerCase() === selectedLanguage.toLowerCase());

  const handleStartLearning = async () => {
    if (!selectedLanguage || !selectedLevel) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Check if using DeepSeek API
    const hasAIKey = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY');
    const provider = localStorage.getItem('AI_PROVIDER') || 'deepseek';
    const isUsingAPI = hasAIKey && (provider === 'deepseek' || provider === 'openai');

    if (isUsingAPI) {
      // Start countdown for API calls
      setCountdown(20);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      const clearCountdown = () => {
        clearInterval(countdownInterval);
        setCountdown(0);
      };

      try {
        const content = await aiAgent.generateLanguageContent(selectedLanguage, selectedLevel);
        clearCountdown();
        onLanguageSelect(selectedLanguage, content);
      } catch (error) {
        clearCountdown();
        setError(t('error.apiError'));
        setIsGenerating(false);
      }
    } else {
      // Use fallback content generation (fast, no countdown needed)
      try {
        // Add slight delay to give feedback to user
        setTimeout(async () => {
          const content = await aiAgent.generateLanguageContent(selectedLanguage, selectedLevel);
          onLanguageSelect(selectedLanguage, content);
        }, 500);
      } catch (error) {
        setError(t('error.apiError'));
        setIsGenerating(false);
      }
    }
  };

  const handleRetry = () => {
    setError(null);
    setIsGenerating(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft size={16} />
        </Button>
        <h2 className="text-xl font-semibold">{t('language.title')}</h2>
      </div>

      {error ? (
        <ErrorBlock
          message={error}
          onRetry={handleRetry}
          onBack={onBack}
        />
      ) : isGenerating ? (
        <LoadingBlock
          message={t('language.loading')}
          countdown={countdown}
          showCountdown={countdown > 0}
        />
      ) : (
        <>
          <p className="mb-6 text-muted-foreground">
            {t('language.prompt')}
          </p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                {t('language.select')}
              </label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t('language.select')} />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.name}>
                      <div className="flex items-center gap-2">
                        <span className="text-base">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                {t('language.level')}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Button
                  variant={selectedLevel === 'beginner' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setSelectedLevel('beginner')}
                >
                  <div className="text-left">
                    <div className="font-medium">{t('language.level.beginner')}</div>
                    <div className="text-xs opacity-70">A1-A2</div>
                  </div>
                </Button>
                <Button
                  variant={selectedLevel === 'intermediate' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setSelectedLevel('intermediate')}
                >
                  <div className="text-left">
                    <div className="font-medium">{t('language.level.intermediate')}</div>
                    <div className="text-xs opacity-70">B1-B2</div>
                  </div>
                </Button>
                <Button
                  variant={selectedLevel === 'advanced' ? 'default' : 'outline'}
                  className="justify-start"
                  onClick={() => setSelectedLevel('advanced')}
                >
                  <div className="text-left">
                    <div className="font-medium">{t('language.level.advanced')}</div>
                    <div className="text-xs opacity-70">C1-C2</div>
                  </div>
                </Button>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleStartLearning}
              disabled={!selectedLanguage || !selectedLevel}
            >
              {t('language.generate')}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};