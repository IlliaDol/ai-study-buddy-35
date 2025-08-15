import { useState } from "react";
import { MainNavigation } from "@/components/MainNavigation";
import { TopicGenerator } from "@/components/TopicGenerator";
import { CourseGenerator } from "@/components/CourseGenerator";
import { StudyModeSelector } from "@/components/StudyModeSelector";
import { StudyCard } from "@/components/StudyCard";
import { QuizMode } from "@/components/QuizMode";
import { LanguageLearning } from "@/components/LanguageLearning";
import { LanguageFlashcards } from "@/components/LanguageFlashcards";
import { useGamification } from "@/hooks/useGamification";
import { useSRS } from "@/hooks/useSRS";
import { getSavedDecks, saveDeck, SavedDeck } from "@/hooks/localStorage";
import { AICourseStructure } from "@/lib/aiAgent";

type PageState = 
  | 'main' 
  | 'topic-learning' 
  | 'course-generation'
  | 'language-learning' 
  | 'study-mode-selector' 
  | 'flashcards' 
  | 'quiz' 
  | 'language-flashcards';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<PageState>('main');
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentContent, setCurrentContent] = useState<{
    flashcards: Array<{ front: string; back: string }>;
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
  } | null>(null);
  const [currentCourse, setCurrentCourse] = useState<AICourseStructure | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState("");
  const [currentLanguageContent, setCurrentLanguageContent] = useState<Array<{ front: string; back: string }>>([]);
  
  const { gainXP } = useGamification();
  const { review, dueCards } = useSRS();
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => getSavedDecks());

  const handleTopicLearning = () => setCurrentPage('topic-learning');
  const handleCourseGeneration = () => setCurrentPage('course-generation');
  const handleLanguageLearning = () => setCurrentPage('language-learning');
  const handleBackToMain = () => setCurrentPage('main');

  const handleContentGenerated = (content: {
    flashcards: Array<{ front: string; back: string }>;
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
  }) => {
    setCurrentContent(content);
    setCurrentPage('study-mode-selector');
    gainXP(10); // XP for generating content
  };

  const handleCourseGenerated = (course: AICourseStructure) => {
    setCurrentCourse(course);
    setCurrentTopic(course.title);
    // Start with first module content
    const firstModule = course.modules[0];
    const content = {
      flashcards: firstModule.flashcards.map(fc => ({ front: fc.front, back: fc.back })),
      quizQuestions: firstModule.quizQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
    };
    setCurrentContent(content);
    setCurrentPage('study-mode-selector');
    gainXP(20); // More XP for comprehensive course
  };

  const handleLanguageContentGenerated = (language: string, content: Array<{ front: string; back: string }>) => {
    setCurrentLanguage(language);
    setCurrentLanguageContent(content);
    setCurrentPage('language-flashcards');
    gainXP(10);
  };

  const handleModeSelect = (mode: 'flashcards' | 'quiz') => {
    setCurrentPage(mode);
    gainXP(5);
  };

  const handleSaveDeck = () => {
    if (currentContent && currentTopic) {
      const deck: SavedDeck = {
        id: Date.now().toString(),
        title: currentTopic,
        createdAt: Date.now(),
        flashcards: currentContent.flashcards,
        quizQuestions: currentContent.quizQuestions,
      };
      saveDeck(deck);
      setSavedDecks(getSavedDecks());
      gainXP(15);
    }
  };

  const handleFlashcardReview = (cardKey: string, grade: 'again' | 'hard' | 'good' | 'easy') => {
    review(cardKey, grade);
    const xpMap = { again: 1, hard: 2, good: 3, easy: 4 };
    gainXP(xpMap[grade]);
  };

  const handleQuizComplete = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    const xp = Math.round(percentage / 10) + 5; // 5-15 XP based on performance
    gainXP(xp);
  };

  const handleStartReview = (deck: SavedDeck) => {
    setCurrentTopic(deck.title);
    setCurrentContent({
      flashcards: deck.flashcards,
      quizQuestions: deck.quizQuestions,
    });
    setCurrentPage('study-mode-selector');
  };

  const handleDeleteDeck = (deckId: string) => {
    // Import deleteDeck function
    const { deleteDeck } = require('@/hooks/localStorage');
    deleteDeck(deckId);
    setSavedDecks(getSavedDecks());
  };

  // Get due cards for review
  const dueCardsForReview = savedDecks.flatMap(deck => {
    const cardKeys = deck.flashcards.map((_, index) => `${deck.id}-flashcard-${index}`);
    return dueCards(cardKeys).map(cardKey => {
      const [deckId, , cardIndex] = cardKey.split('-');
      const deck = savedDecks.find(d => d.id === deckId);
      if (deck) {
        return {
          deckId,
          deckTitle: deck.title,
          card: deck.flashcards[parseInt(cardIndex)],
          cardKey
        };
      }
      return null;
    }).filter(Boolean);
  });

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'main' && (
        <div>
          <MainNavigation 
            onTopicLearning={handleTopicLearning}
            onLanguageLearning={handleLanguageLearning}
          />
          
          {/* Saved Decks Section */}
          {savedDecks.length > 0 && (
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-6">Your Saved Decks</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedDecks.map((deck) => (
                  <div key={deck.id} className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2">{deck.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {deck.flashcards.length} cards • {deck.quizQuestions.length} questions
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStartReview(deck)}
                        className="flex-1 bg-primary text-primary-foreground px-3 py-1 rounded text-sm hover:bg-primary/90"
                      >
                        Study
                      </button>
                      <button
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="px-3 py-1 border border-destructive text-destructive rounded text-sm hover:bg-destructive hover:text-destructive-foreground"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Today's Reviews Section */}
          {dueCardsForReview.length > 0 && (
            <div className="container mx-auto px-4 py-8">
              <h2 className="text-2xl font-bold mb-6">Today's Reviews</h2>
              <div className="bg-card border rounded-lg p-4">
                <p className="text-muted-foreground mb-3">
                  You have {dueCardsForReview.length} cards due for review
                </p>
                <button
                  onClick={() => {
                    const firstDue = dueCardsForReview[0];
                    if (firstDue) {
                      const deck = savedDecks.find(d => d.id === firstDue.deckId);
                      if (deck) {
                        handleStartReview(deck);
                      }
                    }
                  }}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
                >
                  Start Review
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {currentPage === 'topic-learning' && (
        <div className="container mx-auto px-4 py-8">
          <TopicGenerator onContentGenerated={handleContentGenerated} />
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToMain}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Main Menu
            </button>
          </div>
        </div>
      )}

      {currentPage === 'course-generation' && (
        <div className="container mx-auto px-4 py-8">
          <CourseGenerator onCourseGenerated={handleCourseGenerated} />
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToMain}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Main Menu
            </button>
          </div>
        </div>
      )}

      {currentPage === 'language-learning' && (
        <LanguageLearning onContentGenerated={handleLanguageContentGenerated} />
      )}

      {currentPage === 'study-mode-selector' && currentContent && (
        <StudyModeSelector
          onModeSelect={handleModeSelect}
          onBack={handleBackToMain}
          topic={currentTopic}
          onSaveDeck={handleSaveDeck}
        />
      )}

      {currentPage === 'flashcards' && currentContent && (
        <StudyCard
          flashcards={currentContent.flashcards}
          onBack={() => setCurrentPage('study-mode-selector')}
          onReview={handleFlashcardReview}
        />
      )}

      {currentPage === 'quiz' && currentContent && (
        <QuizMode
          questions={currentContent.quizQuestions}
          onBack={() => setCurrentPage('study-mode-selector')}
          onComplete={handleQuizComplete}
        />
      )}

      {currentPage === 'language-flashcards' && currentLanguageContent.length > 0 && (
        <LanguageFlashcards
          flashcards={currentLanguageContent}
          language={currentLanguage}
          onBack={() => setCurrentPage('language-learning')}
          onReview={handleFlashcardReview}
        />
      )}
    </div>
  );
}
