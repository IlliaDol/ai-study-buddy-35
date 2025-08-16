import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface VocabEntry {
  id: string;
  word: string;
  translation: string;
}

interface LanguageFlashcardsProps {
  vocabulary: VocabEntry[];
  onNext: () => void;
  onPrevious: () => void;
  cardNumber: number;
  totalCards: number;
}

export const LanguageFlashcards = ({ 
  vocabulary, 
  onNext, 
  onPrevious, 
  cardNumber, 
  totalCards 
}: LanguageFlashcardsProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const currentCard = vocabulary[cardNumber - 1];

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    onNext();
  };

  const handlePrevious = () => {
    setIsFlipped(false);
    onPrevious();
  };

  if (!currentCard) return null;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>{cardNumber} of {totalCards}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleFlip}
          className="gap-2"
        >
          <RotateCcw size={16} />
          Flip
        </Button>
      </div>

      <button
        type="button"
        onClick={handleFlip}
        aria-pressed={isFlipped}
        aria-label={isFlipped ? "Show word" : "Show translation"}
        className="flip-card w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring rounded"
      >
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          <Card className="flip-card-front study-card p-8 h-80 flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-4">{currentCard.word}</p>
              <p className="text-muted-foreground text-sm">Click to reveal translation</p>
            </div>
          </Card>
          
          <Card className="flip-card-back study-card p-8 h-80 flex items-center justify-center cursor-pointer bg-accent">
            <div className="text-center">
              <p className="text-2xl font-semibold text-accent-foreground mb-2">{currentCard.translation}</p>
              <p className="text-lg text-accent-foreground/70">{currentCard.word}</p>
            </div>
          </Card>
        </div>
      </button>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={cardNumber === 1}
        >
          Previous
        </Button>
        
        <div className="flex gap-2">
          {Array.from({ length: totalCards }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                index + 1 === cardNumber 
                  ? "bg-primary" 
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <Button 
          onClick={handleNext}
          disabled={cardNumber === totalCards}
        >
          Next
        </Button>
      </div>
    </div>
  );
};