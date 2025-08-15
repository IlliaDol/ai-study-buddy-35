import { useState } from "react";
import { TopicGenerator } from "@/components/TopicGenerator";
import { StudyModeSelector } from "@/components/StudyModeSelector";
import { StudyCard } from "@/components/StudyCard";
import { QuizMode } from "@/components/QuizMode";
import { QuizResults } from "@/components/QuizResults";
import heroImage from "@/assets/hero-bg.jpg";

interface GeneratedContent {
  flashcards: Array<{ front: string; back: string }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

type AppState = 'topic-input' | 'mode-selection' | 'flashcards' | 'quiz' | 'quiz-results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('topic-input');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentCard, setCurrentCard] = useState(0);
  const [quizScore, setQuizScore] = useState(0);

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content);
    setCurrentTopic(content.flashcards[0]?.front.split('?')[0] || "Study Topic");
    setAppState('mode-selection');
  };

  const handleModeSelect = (mode: 'flashcards' | 'quiz') => {
    setCurrentCard(0);
    setAppState(mode);
  };

  const handleNextCard = () => {
    if (generatedContent && currentCard < generatedContent.flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    }
  };

  const handlePreviousCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1);
    }
  };

  const handleQuizComplete = (score: number) => {
    setQuizScore(score);
    setAppState('quiz-results');
  };

  const resetToTopicInput = () => {
    setAppState('topic-input');
    setGeneratedContent(null);
    setCurrentCard(0);
    setQuizScore(0);
  };

  const renderContent = () => {
    switch (appState) {
      case 'topic-input':
        return <TopicGenerator onContentGenerated={handleContentGenerated} />;
      
      case 'mode-selection':
        return (
          <StudyModeSelector
            onModeSelect={handleModeSelect}
            onBack={resetToTopicInput}
            topic={currentTopic}
          />
        );
      
      case 'flashcards':
        if (!generatedContent) return null;
        return (
          <StudyCard
            front={generatedContent.flashcards[currentCard].front}
            back={generatedContent.flashcards[currentCard].back}
            onNext={handleNextCard}
            onPrevious={handlePreviousCard}
            cardNumber={currentCard + 1}
            totalCards={generatedContent.flashcards.length}
          />
        );
      
      case 'quiz':
        if (!generatedContent) return null;
        return (
          <QuizMode
            questions={generatedContent.quizQuestions}
            onComplete={handleQuizComplete}
          />
        );
      
      case 'quiz-results':
        if (!generatedContent) return null;
        return (
          <QuizResults
            score={quizScore}
            totalQuestions={generatedContent.quizQuestions.length}
            onRetakeQuiz={() => setAppState('quiz')}
            onBackToModes={() => setAppState('mode-selection')}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {appState === 'topic-input' && (
        <div 
          className="relative bg-cover bg-center py-20"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 backdrop-blur-sm" />
          <div className="relative container mx-auto px-4 text-center text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              AI-Powered Study
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
              Transform any topic into interactive flashcards and quizzes with the power of AI
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {renderContent()}
      </div>

      {/* Navigation for study modes */}
      {(appState === 'flashcards' || appState === 'quiz') && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={() => setAppState('mode-selection')}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:bg-background/90 transition-colors"
          >
            ← Back to Study Modes
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
