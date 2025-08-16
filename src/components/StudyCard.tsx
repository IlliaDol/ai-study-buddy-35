import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface StudyCardProps {
  cards: Array<{ front: string; back: string }>;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  onBack: () => void;
  topic: string;
  onReview?: (grade: 'again' | 'hard' | 'good' | 'easy') => void;
}

export const StudyCard = ({ 
  cards,
  currentIndex,
  setCurrentIndex,
  onBack,
  topic,
  onReview
}: StudyCardProps) => {
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

  const handleReview = (grade: 'again' | 'hard' | 'good' | 'easy') => {
    if (onReview) {
      onReview(grade);
    }

    // Always move to the next card after reviewing
    handleNext();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case ' ':
        case 'Enter':
          event.preventDefault();
          handleFlip();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          if (currentIndex > 0) handlePrevious();
          break;
        case 'ArrowRight':
          event.preventDefault();
          if (currentIndex < totalCards - 1) handleNext();
          break;
        case '1':
          if (isFlipped && onReview) handleReview('again');
          break;
        case '2':
          if (isFlipped && onReview) handleReview('hard');
          break;
        case '3':
          if (isFlipped && onReview) handleReview('good');
          break;
        case '4':
          if (isFlipped && onReview) handleReview('easy');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, currentIndex, totalCards, onReview]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-1">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="font-semibold text-lg">
            {t('flashcards.title', { topic })}
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
        aria-label={isFlipped ? "Show question" : "Show answer"}
        className="flip-card w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded"
      >
        <div aria-live="polite" className="sr-only">
          {isFlipped ? t('flashcards.showing_answer') : t('flashcards.showing_question')}
        </div>
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          <Card className="flip-card-front study-card p-8 h-80 flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <p className="text-xl font-medium leading-relaxed">{card.front}</p>
              <p className="text-muted-foreground mt-4 text-sm">{t('flashcards.tap')}</p>
            </div>
          </Card>
          
          <Card className="flip-card-back study-card p-8 h-80 flex items-center justify-center cursor-pointer bg-accent">
            <div className="text-center">
              <p className="text-xl font-medium leading-relaxed text-accent-foreground">{card.back}</p>
            </div>
          </Card>
        </div>
      </button>

      {isFlipped && onReview ? (
        // SRS review buttons when flipped
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            className="bg-red-50 hover:bg-red-100 border-red-200"
            onClick={() => handleReview('again')}
          >
            {t('flashcards.again')}
          </Button>
          <Button
            variant="outline"
            className="bg-orange-50 hover:bg-orange-100 border-orange-200"
            onClick={() => handleReview('hard')}
          >
            {t('flashcards.hard')}
          </Button>
          <Button
            variant="outline"
            className="bg-green-50 hover:bg-green-100 border-green-200"
            onClick={() => handleReview('good')}
          >
            {t('flashcards.good')}
          </Button>
          <Button
            variant="outline"
            className="bg-blue-50 hover:bg-blue-100 border-blue-200"
            onClick={() => handleReview('easy')}
          >
            {t('flashcards.easy')}
          </Button>
        </div>
      ) : (
        // Standard navigation buttons
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
      )}
    </div>
  );
};