import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface LanguageFlashcardsProps {
  cards: Array<{ front: string; back: string }>;
  language: string;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onBack: () => void;
}

export const LanguageFlashcards = ({ 
  cards,
  language,
  currentIndex,
  setCurrentIndex,
  onBack
}: LanguageFlashcardsProps) => {
  const { t } = useTranslation();
  const [isFlipped, setIsFlipped] = useState(false);
  const card = cards[currentIndex];
  const totalCards = cards.length;

  if (!card) return null;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < totalCards - 1) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-1">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="font-semibold text-lg">
            {language} {t('language.title')}
          </h2>
        </div>

        <span className="text-sm text-muted-foreground">
          {t('flashcards.card', { current: currentIndex + 1, total: totalCards })}
        </span>
      </div>

      <button
        type="button"
        onClick={handleFlip}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Show term" : "Show translation"}
        className="flip-card w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded"
      >
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          <Card className="flip-card-front study-card p-8 h-80 flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <span className="text-sm text-muted-foreground mb-2 block">English</span>
              <p className="text-xl font-medium leading-relaxed">{card.front}</p>
              <p className="text-muted-foreground mt-4 text-sm">{t('flashcards.tap')}</p>
            </div>
          </Card>
          
          <Card className="flip-card-back study-card p-8 h-80 flex items-center justify-center cursor-pointer bg-accent">
            <div className="text-center">
              <span className="text-sm text-accent-foreground/70 mb-2 block">{language}</span>
              <p className="text-xl font-medium leading-relaxed text-accent-foreground">{card.back}</p>
            </div>
          </Card>
        </div>
      </button>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          {t('flashcards.previous')}
        </Button>
        
        <div className="flex gap-1">
          {totalCards <= 10 && Array.from({ length: totalCards }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex
                  ? "bg-primary"
                  : "bg-muted"
              }`}
            />
          ))}
          {totalCards > 10 && (
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {totalCards}
            </span>
          )}
        </div>

        <Button 
          onClick={handleNext}
          disabled={currentIndex === totalCards - 1}
        >
          {t('flashcards.next')}
        </Button>
      </div>
    </div>
  );
};