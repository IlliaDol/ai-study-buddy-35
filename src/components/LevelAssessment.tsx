import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AssessmentQuestion {
  word: string;
  options: string[];
  correctAnswer: number;
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface LevelAssessmentProps {
  language: string;
  onComplete: (level: string) => void;
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

// Sample assessment questions (in a real app, these would come from an API)
const generateAssessmentQuestions = (language: string): AssessmentQuestion[] => {
  const spanishQuestions: AssessmentQuestion[] = [
    { word: "Casa", options: ["Car", "House", "Cat", "Book"], correctAnswer: 1, level: 'beginner' },
    { word: "Libro", options: ["Light", "Book", "Water", "Food"], correctAnswer: 1, level: 'beginner' },
    { word: "Esperanza", options: ["Experience", "Hope", "Expensive", "Explanation"], correctAnswer: 1, level: 'intermediate' },
    { word: "Desarrollar", options: ["Develop", "Destroy", "Discover", "Decide"], correctAnswer: 0, level: 'intermediate' },
    { word: "Perspicaz", options: ["Persistent", "Perplexed", "Perceptive", "Perfect"], correctAnswer: 2, level: 'advanced' },
    { word: "Efímero", options: ["Eternal", "Ephemeral", "Effective", "Elegant"], correctAnswer: 1, level: 'advanced' },
  ];

  const frenchQuestions: AssessmentQuestion[] = [
    { word: "Chien", options: ["Cat", "Dog", "Chair", "Cheese"], correctAnswer: 1, level: 'beginner' },
    { word: "Eau", options: ["Water", "Air", "Earth", "Fire"], correctAnswer: 0, level: 'beginner' },
    { word: "Comprendre", options: ["Complete", "Understand", "Compare", "Compute"], correctAnswer: 1, level: 'intermediate' },
    { word: "Développer", options: ["Develop", "Deliver", "Destroy", "Decide"], correctAnswer: 0, level: 'intermediate' },
    { word: "Perspicace", options: ["Persistent", "Perplexed", "Perceptive", "Perfect"], correctAnswer: 2, level: 'advanced' },
    { word: "Éphémère", options: ["Eternal", "Ephemeral", "Effective", "Elegant"], correctAnswer: 1, level: 'advanced' },
  ];

  // Return appropriate questions based on language
  switch (language) {
    case 'es': return spanishQuestions;
    case 'fr': return frenchQuestions;
    default: return spanishQuestions; // Fallback
  }
};

export const LevelAssessment = ({ language, onComplete, onBack }: LevelAssessmentProps) => {
  const [questions] = useState(generateAssessmentQuestions(language));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [results, setResults] = useState<boolean[]>([]);

  const handleAnswerSelect = (optionIndex: number) => {
    if (showResult) return;
    setSelectedAnswer(optionIndex);
    setShowResult(true);

    const isCorrect = optionIndex === questions[currentQuestion].correctAnswer;
    setResults([...results, isCorrect]);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      calculateLevel();
    }
  };

  const calculateLevel = () => {
    const beginnerQuestions = questions.filter(q => q.level === 'beginner');
    const intermediateQuestions = questions.filter(q => q.level === 'intermediate');
    const advancedQuestions = questions.filter(q => q.level === 'advanced');

    const beginnerCorrect = results.slice(0, beginnerQuestions.length).filter(Boolean).length;
    const intermediateCorrect = results.slice(beginnerQuestions.length, beginnerQuestions.length + intermediateQuestions.length).filter(Boolean).length;
    const advancedCorrect = results.slice(beginnerQuestions.length + intermediateQuestions.length).filter(Boolean).length;

    let level = 'beginner';
    
    if (beginnerCorrect >= beginnerQuestions.length * 0.7) {
      if (intermediateCorrect >= intermediateQuestions.length * 0.7) {
        if (advancedCorrect >= advancedQuestions.length * 0.5) {
          level = 'advanced';
        } else {
          level = 'intermediate';
        }
      } else {
        level = 'intermediate';
      }
    }

    toast({
      title: "Assessment Complete!",
      description: `Your level has been determined as ${level}.`,
    });

    onComplete(level);
  };

  const question = questions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
            <h2 className="text-2xl font-bold">{getLanguageName(language)} Level Test</h2>
            <p className="text-muted-foreground">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="w-full" />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Progress: {Math.round(progress)}%</span>
          <span>Level: {question.level}</span>
        </div>
      </div>

      <Card className="study-card p-8">
        <div className="text-center space-y-6">
          <div>
            <h3 className="text-2xl font-bold mb-2">What does this word mean?</h3>
            <div className="text-3xl font-bold text-primary mb-4">{question.word}</div>
          </div>
          
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
        </div>
      </Card>

      {showResult && (
        <div className="text-center">
          <Button onClick={handleNext} size="lg">
            {currentQuestion < questions.length - 1 ? "Next Question" : "Finish Assessment"}
          </Button>
        </div>
      )}
    </div>
  );
};