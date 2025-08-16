import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizModeProps {
  questions: QuizQuestion[];
  topic: string;
  onComplete: (score: number, total: number) => void;
  onBack: () => void;
}

export const QuizMode = ({ questions, topic, onComplete, onBack }: QuizModeProps) => {
  const { t } = useTranslation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

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
      const finalScore = score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0);
      setQuizCompleted(true);
      onComplete(finalScore, questions.length);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
  };

  if (questions.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p>{t('quiz.noQuestions')}</p>
        <Button onClick={onBack} className="mt-4">
          {t('quiz.back')}
        </Button>
      </Card>
    );
  }

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;

  if (quizCompleted) {
    const finalScore = score + (selectedAnswer === questions[questions.length - 1].correctAnswer ? 1 : 0);
    return (
      <Card className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-xl font-semibold">{t('quiz.results')}</h2>
        </div>

        <div className="text-center py-8">
          <h3 className="text-2xl font-bold mb-2">
            {finalScore === questions.length
              ? t('quiz.perfectScore')
              : t('quiz.score', { score: finalScore, total: questions.length })}
          </h3>
          <p className="text-muted-foreground mb-6">
            {finalScore / questions.length >= 0.7
              ? t('quiz.goodJob')
              : t('quiz.keepPracticing')}
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <Button variant="outline" onClick={handleRestart}>
              {t('quiz.restart')}
            </Button>
            <Button onClick={onBack}>
              {t('quiz.back')}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="text-xl font-semibold">{t('quiz.title', { topic })}</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {t('quiz.question', { current: currentQuestion + 1, total: questions.length })}
        </span>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-medium">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              disabled={showResult}
              className={`w-full p-4 text-left rounded-md border ${
                showResult && index === question.correctAnswer
                  ? "bg-green-50 border-green-300"
                  : showResult && index === selectedAnswer && index !== question.correctAnswer
                  ? "bg-red-50 border-red-300"
                  : selectedAnswer === index
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-muted/30 border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                {showResult && index === question.correctAnswer && (
                  <CheckCircle className="text-green-600 h-5 w-5 flex-shrink-0" />
                )}
                {showResult && index === selectedAnswer && index !== question.correctAnswer && (
                  <XCircle className="text-red-600 h-5 w-5 flex-shrink-0" />
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {showResult && (
          <div className={`p-4 rounded-md ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
            <p className="font-medium mb-1">
              {isCorrect ? t('quiz.correct') : t('quiz.incorrect', { answer: question.options[question.correctAnswer] })}
            </p>
            {question.explanation && <p className="text-muted-foreground text-sm">{question.explanation}</p>}
          </div>
        )}

        {showResult && (
          <Button className="w-full" onClick={handleNext}>
            {currentQuestion < questions.length - 1 ? t('quiz.next') : t('quiz.submit')}
          </Button>
        )}
      </div>
    </Card>
  );
};