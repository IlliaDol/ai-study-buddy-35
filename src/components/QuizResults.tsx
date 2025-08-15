import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onRetakeQuiz: () => void;
  onBackToModes: () => void;
}

export const QuizResults = ({ 
  score, 
  totalQuestions, 
  onRetakeQuiz, 
  onBackToModes 
}: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  
  const getScoreMessage = () => {
    if (percentage >= 90) return "Excellent work! 🎉";
    if (percentage >= 70) return "Great job! 👏";
    if (percentage >= 50) return "Good effort! 👍";
    return "Keep practicing! 💪";
  };

  const getScoreColor = () => {
    if (percentage >= 70) return "text-success";
    if (percentage >= 50) return "text-primary";
    return "text-destructive";
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <Card className="study-card p-8 text-center">
        <div className="space-y-6">
          <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto">
            <Trophy size={48} className="text-primary" />
          </div>
          
          <div>
            <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground">{getScoreMessage()}</p>
          </div>

          <div className="space-y-4">
            <div className={`text-6xl font-bold ${getScoreColor()}`}>
              {percentage}%
            </div>
            <p className="text-xl">
              {score} out of {totalQuestions} correct
            </p>
          </div>

          <div className="w-full bg-muted rounded-full h-4">
            <div 
              className={`h-4 rounded-full transition-all duration-1000 ${
                percentage >= 70 ? 'bg-success' : 
                percentage >= 50 ? 'bg-primary' : 'bg-destructive'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-6">
            <Button 
              variant="outline" 
              onClick={onRetakeQuiz}
              className="gap-2"
            >
              <RotateCcw size={16} />
              Retake Quiz
            </Button>
            <Button 
              onClick={onBackToModes}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Study More
            </Button>
          </div>
        </div>
      </Card>

      <Card className="study-card p-6">
        <h3 className="font-semibold mb-4">Study Tips</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          {percentage < 70 && (
            <>
              <p>• Try reviewing the flashcards again before retaking the quiz</p>
              <p>• Focus on the questions you got wrong</p>
            </>
          )}
          <p>• Regular practice helps improve retention</p>
          <p>• Consider studying related topics to deepen your understanding</p>
        </div>
      </Card>
    </div>
  );
};