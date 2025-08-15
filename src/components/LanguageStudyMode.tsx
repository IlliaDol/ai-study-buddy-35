import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, BarChart3, ArrowLeft } from "lucide-react";

interface VocabEntry {
  id: string;
  word: string;
  translation: string;
}

interface LanguageStudyModeProps {
  language: string;
  level: string;
  vocabulary?: VocabEntry[];
  onModeSelect: (mode: 'flashcards' | 'quiz') => void;
  onBack: () => void;
}

const getLanguageFlag = (langCode: string): string => {
  const flags: Record<string, string> = {
    es: "🇪🇸", fr: "🇫🇷", de: "🇩🇪", it: "🇮🇹", pt: "🇵🇹",
    ja: "🇯🇵", ko: "🇰🇷", zh: "🇨🇳", ru: "🇷🇺", ar: "🇸🇦"
  };
  return flags[langCode] || "🌍";
};

const getLanguageName = (langCode: string): string => {
  const names: Record<string, string> = {
    es: "Spanish", fr: "French", de: "German", it: "Italian", pt: "Portuguese",
    ja: "Japanese", ko: "Korean", zh: "Chinese", ru: "Russian", ar: "Arabic"
  };
  return names[langCode] || "Language";
};

const formatLevel = (level: string): string => {
  switch (level) {
    case 'beginner': return 'Beginner (A1-A2)';
    case 'intermediate': return 'Intermediate (B1-B2)';
    case 'advanced': return 'Advanced (C1-C2)';
    default: return level;
  }
};

export const LanguageStudyMode = ({ 
  language, 
  level, 
  vocabulary, 
  onModeSelect, 
  onBack 
}: LanguageStudyModeProps) => {
  const isCustomVocab = vocabulary && vocabulary.length > 0;
  const studyType = isCustomVocab ? 'Custom Vocabulary' : `${formatLevel(level)} Level`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getLanguageFlag(language)}</span>
          <div>
            <h2 className="text-2xl font-bold">{getLanguageName(language)} Study</h2>
            <p className="text-muted-foreground">{studyType}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="study-card p-6 cursor-pointer group hover:scale-105 transition-transform"
          onClick={() => onModeSelect('flashcards')}
        >
          <div className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
              <BookOpen size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Flashcards</h3>
              <p className="text-muted-foreground">
                {isCustomVocab 
                  ? `Study your ${vocabulary.length} custom words with interactive flashcards`
                  : `Learn ${getLanguageName(language)} vocabulary with adaptive flashcards`
                }
              </p>
            </div>
            <div className="pt-4">
              <Button className="w-full">Start Flashcards</Button>
            </div>
          </div>
        </Card>

        <Card 
          className="study-card p-6 cursor-pointer group hover:scale-105 transition-transform"
          onClick={() => onModeSelect('quiz')}
        >
          <div className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
              <Brain size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quiz Mode</h3>
              <p className="text-muted-foreground">
                {isCustomVocab
                  ? "Test your knowledge with multiple choice questions from your vocabulary"
                  : "Challenge yourself with vocabulary questions and get instant feedback"
                }
              </p>
            </div>
            <div className="pt-4">
              <Button className="w-full">Start Quiz</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="study-card p-6">
        <div className="flex items-center gap-4">
          <BarChart3 size={24} className="text-primary" />
          <div>
            <h4 className="font-semibold">Progress Tracking</h4>
            <p className="text-sm text-muted-foreground">
              {isCustomVocab
                ? "Master your personal vocabulary with spaced repetition"
                : `Build your ${getLanguageName(language)} vocabulary systematically`
              }
            </p>
          </div>
        </div>
      </Card>

      {isCustomVocab && (
        <Card className="study-card p-4">
          <h4 className="font-semibold mb-3">Your Vocabulary Preview</h4>
          <div className="grid grid-cols-2 gap-2 text-sm max-h-32 overflow-y-auto">
            {vocabulary.slice(0, 10).map((entry) => (
              <div key={entry.id} className="flex justify-between p-2 bg-background/50 rounded">
                <span className="font-medium">{entry.word}</span>
                <span className="text-muted-foreground">{entry.translation}</span>
              </div>
            ))}
            {vocabulary.length > 10 && (
              <div className="col-span-2 text-center text-muted-foreground text-xs">
                +{vocabulary.length - 10} more words
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};