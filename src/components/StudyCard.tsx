import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";

interface StudyCardProps {
  front: string;
  back: string;
  onNext: () => void;
  onPrevious: () => void;
  cardNumber: number;
  totalCards: number;
}

export const StudyCard = ({ 
  front, 
  back, 
  onNext, 
  onPrevious, 
  cardNumber, 
  totalCards 
}: StudyCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

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

      <div className="flip-card" onClick={handleFlip}>
        <div className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}>
          <Card className="flip-card-front study-card p-8 h-80 flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <p className="text-xl font-medium leading-relaxed">{front}</p>
              <p className="text-muted-foreground mt-4 text-sm">Click to reveal answer</p>
            </div>
          </Card>
          
          <Card className="flip-card-back study-card p-8 h-80 flex items-center justify-center cursor-pointer bg-accent">
            <div className="text-center">
              <p className="text-xl font-medium leading-relaxed text-accent-foreground">{back}</p>
            </div>
          </Card>
        </div>
      </div>

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