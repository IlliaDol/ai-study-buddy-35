import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { aiAgent, AICourseStructure } from "@/lib/aiAgent";
import { useTranslation } from "react-i18next";
import { LoadingBlock } from "./LoadingBlock";
import { ErrorBlock } from "./ErrorBlock";

interface CourseGeneratorProps {
  onCourseGenerated: (course: AICourseStructure) => void;
  onBack: () => void;
}

export const CourseGenerator = ({ onCourseGenerated, onBack }: CourseGeneratorProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const generateCourse = async () => {
    if (!query.trim()) {
      toast({
        title: t('common.error'),
        description: t('course.prompt'),
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Check if using API
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
        const course = await aiAgent.generateCourse(query);
        clearCountdown();
        onCourseGenerated(course);
        toast({
          title: t('common.success'),
          description: `${course.title} (${course.modules.length} ${t('coursePlayer.modules')})`,
        });
      } catch (error) {
        clearCountdown();
        setError(t('error.apiError'));
        setIsGenerating(false);
        toast({
          title: t('common.error'),
          description: t('error.apiError'),
          variant: "destructive",
        });
      }
    } else {
      // Use fallback content generation (fast, no countdown needed)
      try {
        // Add slight delay to give feedback to user
        setTimeout(async () => {
          const course = await aiAgent.generateCourse(query);
          onCourseGenerated(course);
          toast({
            title: t('common.success'),
            description: `${course.title} (${course.modules.length} ${t('coursePlayer.modules')})`,
          });
        }, 800);
      } catch (error) {
        setError(t('error.apiError'));
        setIsGenerating(false);
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
        <h2 className="text-xl font-semibold">{t('course.title')}</h2>
      </div>

      {error ? (
        <ErrorBlock
          message={error}
          onRetry={handleRetry}
          onBack={onBack}
        />
      ) : isGenerating ? (
        <LoadingBlock
          message={t('course.loading')}
          countdown={countdown}
          showCountdown={countdown > 0}
        />
      ) : (
        <>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              {t('course.prompt')}
            </label>
            <Textarea
              placeholder={t('course.placeholder')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          <Button
            className="w-full flex items-center gap-2"
            onClick={generateCourse}
          >
            <Sparkles size={16} />
            {t('course.generate')}
          </Button>
        </>
      )}
    </Card>
  );
};
