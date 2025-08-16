import { useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

function usePageFromPath(pathname: string): PageState {
  if (pathname === "/") return "main";
  const map: Record<string, PageState> = {
    "/topic-learning": "topic-learning",
    "/course-generation": "course-generation",
    "/language-learning": "language-learning",
    "/study": "study-mode-selector",
    "/flashcards": "flashcards",
    "/quiz": "quiz",
    "/language-flashcards": "language-flashcards",
  };
  return map[pathname] || "main";
}

export default function Index() {
  const navigate = useNavigate();
  const location = useLocation();

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
  const [languageCardIndex, setLanguageCardIndex] = useState<number>(1);

  const { gainXP } = useGamification();
  const { review, dueCards } = useSRS();
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => getSavedDecks());

  const currentPage: PageState = usePageFromPath(location.pathname);

  const handleTopicLearning = () => navigate('/topic-learning');
  const handleCourseGeneration = () => navigate('/course-generation');
  const handleLanguageLearning = () => navigate('/language-learning');
  const handleBackToMain = () => navigate('/');

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
    navigate('/study');
    gainXP(10);
  };

  const handleCourseGenerated = (course: AICourseStructure) => {
    setCurrentCourse(course);
    setCurrentTopic(course.title);
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
    navigate('/study');
    gainXP(20);
  };

  const handleLanguageContentGenerated = (language: string, content: Array<{ front: string; back: string }>) => {
    setCurrentLanguage(language);
    setCurrentLanguageContent(content);
    setLanguageCardIndex(1);
    navigate('/language-flashcards');
    gainXP(10);
  };

  const handleModeSelect = (mode: 'flashcards' | 'quiz') => {
    navigate(mode === 'flashcards' ? '/flashcards' : '/quiz');
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
    const xp = Math.round(percentage / 10) + 5;
    gainXP(xp);
  };

  const handleStartReview = (deck: SavedDeck) => {
    setCurrentTopic(deck.title);
    setCurrentContent({
      flashcards: deck.flashcards,
      quizQuestions: deck.quizQuestions,
    });
    navigate('/study');
  };

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
    }).filter(Boolean) as any[];
  });

  return (
    <div className="min-h-screen bg-background">
      {currentPage === 'main' && (
        <div>
          <MainNavigation
            onTopicLearning={handleTopicLearning}
            onLanguageLearning={handleLanguageLearning}
            onCourseGeneration={handleCourseGeneration}
          />

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
                        onClick={() => {
                          const { deleteDeck } = require('@/hooks/localStorage');
                          deleteDeck(deck.id);
                          setSavedDecks(getSavedDecks());
                        }}
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
        <LanguageLearning
          onLanguageSelect={(language, level) => {
            // For now, send a minimal flashcard set stub based on language+level
            handleLanguageContentGenerated(
              language,
              [
                { front: `${language.toUpperCase()} basics (${level})`, back: "Hello → Hola / Hallo / Bonjour" },
                { front: "Goodbye", back: "Adiós / Tschüss / Au revoir" },
              ]
            );
          }}
          onLevelTest={(language) => {
            // Future: navigate to a dedicated assessment path
            // For demo, go to study selector with placeholder content
            setCurrentTopic(`${language} Level Test`);
            setCurrentContent({
              flashcards: [
                { front: "Translate: apple", back: "manzana / Apfel / pomme" },
                { front: "Choose the correct article for 'Haus'", back: "das" },
              ],
              quizQuestions: [
                { question: "apple in Spanish?", options: ["manzana", "perro", "casa", "libro"], correctAnswer: 0 },
                { question: "'Haus' article? (German)", options: ["der", "die", "das", "den"], correctAnswer: 2 },
              ],
            });
            navigate('/study');
          }}
          onCustomVocab={(language) => {
            // For now, navigate to language-flashcards with empty list and let user add later
            setCurrentLanguage(language);
            setCurrentLanguageContent([]);
            navigate('/language-flashcards');
          }}
        />
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
          onBack={() => navigate('/study')}
          onReview={handleFlashcardReview}
        />
      )}

      {currentPage === 'quiz' && currentContent && (
        <QuizMode
          questions={currentContent.quizQuestions}
          onBack={() => navigate('/study')}
          onComplete={handleQuizComplete}
        />
      )}

      {currentPage === 'language-flashcards' && currentLanguageContent.length > 0 && (
        <div className="container mx-auto px-4 py-8 space-y-4">
          <div>
            <button
              onClick={() => navigate('/language-learning')}
              className="text-muted-foreground hover:text-foreground"
            >
              ← Back to Language Learning
            </button>
          </div>
          {(() => {
            const vocabulary = currentLanguageContent.map((c, i) => ({ id: String(i), word: c.front, translation: c.back }));
            const total = vocabulary.length;
            return (
              <LanguageFlashcards
                vocabulary={vocabulary as any}
                onNext={() => setLanguageCardIndex((n) => Math.min(n + 1, total))}
                onPrevious={() => setLanguageCardIndex((n) => Math.max(n - 1, 1))}
                cardNumber={languageCardIndex}
                totalCards={total}
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}
