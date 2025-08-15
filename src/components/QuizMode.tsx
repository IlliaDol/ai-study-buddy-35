import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModeProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
}

export const QuizMode = ({ questions, onComplete }: QuizModeProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
    setShowResult(true);

    if (optionIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0));
    }
  };

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between text-muted-foreground">
        <span>Question {currentQuestion + 1} of {questions.length}</span>
        <span>Score: {score}/{questions.length}</span>
      </div>

      <Card className="study-card p-8">
        <h3 className="text-xl font-semibold mb-6">{question.question}</h3>
        
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <Button
              key={index}
              variant="outline"
              className={`w-full text-left justify-start p-4 h-auto ${
                showResult
                  ? index === question.correctAnswer
                    ? "bg-success/10 border-success text-success-foreground"
                    : index === selectedAnswer && index !== question.correctAnswer
                    ? "bg-destructive/10 border-destructive text-destructive-foreground"
                    : ""
                  : selectedAnswer === index
                  ? "bg-primary/10 border-primary"
                  : ""
              }`}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
            >
              <div className="flex items-center gap-3">
                {showResult && (
                  index === question.correctAnswer ? (
                    <CheckCircle size={20} className="text-success" />
                  ) : index === selectedAnswer && index !== question.correctAnswer ? (
                    <XCircle size={20} className="text-destructive" />
                  ) : null
                )}
                <span>{option}</span>
              </div>
            </Button>
          ))}
        </div>

        {showResult && question.explanation && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </div>
        )}
      </Card>

      {showResult && (
        <div className="text-center">
          <Button onClick={handleNext} size="lg">
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Quiz"}
          </Button>
        </div>
      )}
    </div>
  );
};