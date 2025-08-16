import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, BookOpen, Brain, Upload, Zap, GraduationCap, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { aiAgent } from "@/lib/aiAgent";
import { useTranslation } from "react-i18next";
import { LoadingBlock } from "./LoadingBlock";
import { ErrorBlock } from "./ErrorBlock";

interface GeneratedContent {
  flashcards: Array<{ front: string; back: string }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

interface TopicGeneratorProps {
  onContentGenerated: (content: GeneratedContent, topic: string) => void;
  onBack: () => void;
}

export const TopicGenerator = ({ onContentGenerated, onBack }: TopicGeneratorProps) => {
  const { t } = useTranslation();
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generationMode, setGenerationMode] = useState<'quick' | 'comprehensive'>('quick');
  const [countdown, setCountdown] = useState(0);

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: t('common.error'),
        description: t('topic.prompt'),
        variant: "destructive",
      });
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
        const query = details ? `${topic}: ${details}` : topic;
        const content = await aiAgent.generateContent(query);
        clearCountdown();
        onContentGenerated(content, topic);
        toast({
          title: t('common.success'),
          description: `${content.flashcards.length} flashcards and ${content.quizQuestions.length} quiz questions created.`,
        });
      } catch (error) {
        clearCountdown();
        setError(t('error.apiError'));
        toast({
          title: t('common.error'),
          description: t('error.apiError'),
          variant: "destructive",
        });
      }
    } else {
      // Use fallback content generation (fast, no countdown needed)
      try {
        const query = details ? `${topic}: ${details}` : topic;
        // Add slight delay to give feedback to user
        setTimeout(async () => {
          const content = await aiAgent.generateContent(query);
          onContentGenerated(content, topic);
          toast({
            title: t('common.success'),
            description: `${content.flashcards.length} flashcards and ${content.quizQuestions.length} quiz questions created.`,
          });
        }, 500);
      } catch (error) {
        setError(t('error.apiError'));
        toast({
          title: t('common.error'),
          description: t('error.apiError'),
          variant: "destructive",
        });
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
        <h2 className="text-xl font-semibold">{t('topic.title')}</h2>
      </div>

      {error ? (
        <ErrorBlock
          message={error}
          onRetry={handleRetry}
          onBack={onBack}
        />
      ) : isGenerating ? (
        <LoadingBlock
          message={t('topic.loading')}
          countdown={countdown}
          showCountdown={countdown > 0}
        />
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t('topic.prompt')}
            </label>
            <Input
              placeholder={t('topic.placeholder')}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mb-3"
            />
            <Textarea
              placeholder="Add specific details or requirements (optional)"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button
            className="w-full flex items-center gap-2"
            onClick={generateContent}
          >
            <Sparkles size={16} />
            {t('topic.generate')}
          </Button>
        </>
      )}
    </Card>
  );
};

