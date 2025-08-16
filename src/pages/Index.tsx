import { useState, useEffect } from "react";
import { track } from "@/lib/analytics";
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
import { getSavedDecks, saveDeck, deleteDeck, SavedDeck } from "@/hooks/localStorage";
import { AICourseStructure } from "@/lib/aiAgent";
import SavedDecks from "@/components/SavedDecks";
import CoursePlayer from "@/components/CoursePlayer";
import { useToast } from "@/hooks/use-toast";
import LandingPage from "@/components/LandingPage";
import { useNavigate } from "react-router-dom";

// Unified page type for state machine
type Page = 'main' | 'topic' | 'course' | 'language' | 'study-mode' | 'flashcards' | 'quiz' | 'language-flashcards';

// Context for current state
interface AppContext {
  topic: string;
  course: AICourseStructure | null;
  content: {
    flashcards: Array<{ front: string; back: string }>;
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
  } | null;
  deck: SavedDeck | null;
  lang: string;
  langContent: Array<{ front: string; back: string }>;
  currentModule: number;
}

export default function Index() {
  const navigate = useNavigate();
  const [showApp, setShowApp] = useState(false);
  
  // State machine
  const [page, setPage] = useState<Page>('main');
  const [ctx, setCtx] = useState<AppContext>({
    topic: '',
    course: null,
    content: null,
    deck: null,
    lang: '',
    langContent: [],
    currentModule: 0
  });

  // UI state
  const [studyCardIndex, setStudyCardIndex] = useState(0);
  const [langCardIndex, setLangCardIndex] = useState(0);
  const [savedDecks, setSavedDecks] = useState<SavedDeck[]>(() => getSavedDecks());
  const [dueDecksCount, setDueDecksCount] = useState(0);

  const { gainXP, streak, xp } = useGamification();
  const { review, dueCards } = useSRS();
  const { toast } = useToast();

  // Check for due cards on initial load
  useEffect(() => {
    const allDecks = getSavedDecks();
    let dueCount = 0;

    allDecks.forEach(deck => {
      const cardKeys = deck.flashcards.map((_, index) => `${deck.id}:${index}`);
      const dueDeckCards = dueCards(cardKeys);
      if (dueDeckCards.length > 0) {
        dueCount++;
      }
    });

    setDueDecksCount(dueCount);
  }, [savedDecks]);

  // Reset indexes when changing pages
  useEffect(() => {
    if (page === 'flashcards' || page === 'language-flashcards') {
      setStudyCardIndex(0);
      setLangCardIndex(0);
    }
  }, [page]);

  // Navigation handlers
  const handleBackToMain = () => {
    setPage('main');
    // Keep context for potential "Continue where you left off"
  };

  const handleTopicLearning = () => setPage('topic');
  const handleCourseGeneration = () => setPage('course');
  const handleLanguageLearning = () => setPage('language');

  const handleContentGenerated = (content: {
    flashcards: Array<{ front: string; back: string }>;
    quizQuestions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
  }, topic: string) => {
    setCtx(prev => ({ ...prev, content, topic }));
    setPage('study-mode');
    gainXP(10);
    track('content_generated', { source: 'topic', flashcards: content.flashcards.length, quizQuestions: content.quizQuestions.length });
  };

  const handleCourseGenerated = (course: AICourseStructure) => {
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

    setCtx(prev => ({
      ...prev,
      course,
      content,
      topic: course.title,
      currentModule: 0
    }));

    setPage('course');
    gainXP(20);
    track('course_generated', { title: course.title, modules: course.modules.length });
  };

  const handleLanguageContentGenerated = (language: string, content: Array<{ front: string; back: string }>) => {
    setCtx(prev => ({ ...prev, lang: language, langContent: content }));
    setLangCardIndex(0);
    setPage('language-flashcards');
    gainXP(10);
    track('language_content_generated', { language, size: content.length });
  };

  const handleModeSelect = (mode: 'flashcards' | 'quiz') => {
    setPage(mode);
    gainXP(5);
    track('mode_select', { mode, topic: ctx.topic });
  };

  const handleSaveDeck = () => {
    if (ctx.content && ctx.topic) {
      const deck: SavedDeck = {
        id: Date.now().toString(),
        title: ctx.topic,
        createdAt: Date.now(),
        flashcards: ctx.content.flashcards,
        quizQuestions: ctx.content.quizQuestions,
      };
      saveDeck(deck);
      setSavedDecks(getSavedDecks());
      gainXP(15);
      toast({
        title: "Deck saved",
        description: `${deck.flashcards.length} flashcards saved for future review`
      });
      track('deck_saved', { title: deck.title, flashcards: deck.flashcards.length, quiz: deck.quizQuestions.length });
    }
  };

  const handleFlashcardReview = (cardKey: string, grade: 'again' | 'hard' | 'good' | 'easy') => {
    review(cardKey, grade);
    const xpMap = { again: 1, hard: 2, good: 3, easy: 5 };
    gainXP(xpMap[grade]);
    track('flashcard_review', { cardKey, grade });
  };

  const handleQuizComplete = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    const xp = Math.round(percentage / 10) + 5; // 5-15 XP based on performance
    gainXP(xp);
    track('quiz_complete', { score, total, percentage });
  };

  const handleStartReview = (deck: SavedDeck) => {
    setCtx(prev => ({
      ...prev,
      topic: deck.title,
      content: {
        flashcards: deck.flashcards,
        quizQuestions: deck.quizQuestions,
      },
      deck
    }));
    setPage('study-mode');
    track('review_start', { title: deck.title });
  };

  const handleStartDueReview = () => {
    // Find the first deck with due cards
    const allDecks = getSavedDecks();
    for (const deck of allDecks) {
      const cardKeys = deck.flashcards.map((_, index) => `${deck.id}:${index}`);
      const dueDeckCards = dueCards(cardKeys);
      if (dueDeckCards.length > 0) {
        handleStartReview(deck);
        return;
      }
    }
  };

  const handleDeleteDeck = (deckId: string) => {
    deleteDeck(deckId);
    setSavedDecks(getSavedDecks());
    toast({
      title: "Deck deleted",
      description: "The deck has been removed from your saved content"
    });
    track('deck_deleted', { deckId });
  };

  const handleReviewModule = (moduleIndex: number) => {
    if (!ctx.course) return;

    const module = ctx.course.modules[moduleIndex];
    const content = {
      flashcards: module.flashcards.map(fc => ({ front: fc.front, back: fc.back })),
      quizQuestions: module.quizQuestions.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
    };

    setCtx(prev => ({
      ...prev,
      content,
      currentModule: moduleIndex
    }));

    setPage('study-mode');
    gainXP(5);
  };

  // Handle landing page actions
  const handleStartApp = () => {
    setShowApp(true);
  };

  const handleTryGenerate = async (prompt: string) => {
    // Mock generation for demo
    return `# Generated Content\n\nBased on: "${prompt}"\n\n- Card 1: Question → Answer\n- Card 2: Concept → Explanation\n- Card 3: Term → Definition\n\nReady to study!`;
  };

  const handleUpload = (file: File) => {
    console.log('File uploaded:', file.name);
    // Handle file upload logic here
  };

  // Show landing page first, then app
  if (!showApp) {
    return (
      <LandingPage
        onTryGenerate={handleTryGenerate}
        onUpload={handleUpload}
        onStart={handleStartApp}
      />
    );
  }

  // Render the current page based on state machine
  const renderCurrentPage = () => {
    switch (page) {
      case 'main':
        return (
          <div className="space-y-6">
            <MainNavigation
              onTopicLearning={handleTopicLearning}
              onCourseGeneration={handleCourseGeneration}
              onLanguageLearning={handleLanguageLearning}
            />

            {dueDecksCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 my-4">
                <h3 className="font-medium">Review Time!</h3>
                <p className="text-sm mb-2">You have cards due for review in {dueDecksCount} {dueDecksCount === 1 ? 'deck' : 'decks'}.</p>
                <button
                  onClick={handleStartDueReview}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-1 rounded-md text-sm"
                >
                  Start Review
                </button>
              </div>
            )}

            {savedDecks.length > 0 && <SavedDecks decks={savedDecks} onReview={handleStartReview} onDelete={handleDeleteDeck} />}
          </div>
        );

      case 'topic':
        return <TopicGenerator onContentGenerated={handleContentGenerated} onBack={handleBackToMain} />;

      case 'course':
        return ctx.course ? (
          <CoursePlayer
            course={ctx.course}
            onBack={handleBackToMain}
            onReviewModule={handleReviewModule}
          />
        ) : <CourseGenerator onCourseGenerated={handleCourseGenerated} onBack={handleBackToMain} />;

      case 'language':
        return (
          <LanguageLearning
            onLanguageSelect={handleLanguageContentGenerated}
            onBack={handleBackToMain}
          />
        );

      case 'study-mode':
        return (
          <StudyModeSelector
            topic={ctx.topic}
            onModeSelect={handleModeSelect}
            onSave={handleSaveDeck}
            onBack={handleBackToMain}
            isDeckSaved={!!ctx.deck}
          />
        );

      case 'flashcards':
        return ctx.content ? (
          <StudyCard
            cards={ctx.content.flashcards}
            currentIndex={studyCardIndex}
            setCurrentIndex={setStudyCardIndex}
            onBack={() => setPage('study-mode')}
            topic={ctx.topic}
            onReview={ctx.deck ?
              (grade) => handleFlashcardReview(`${ctx.deck!.id}:${studyCardIndex}`, grade)
              : undefined
            }
          />
        ) : handleBackToMain();

      case 'quiz':
        return ctx.content ? (
          <QuizMode
            questions={ctx.content.quizQuestions}
            topic={ctx.topic}
            onComplete={handleQuizComplete}
            onBack={() => setPage('study-mode')}
          />
        ) : handleBackToMain();

      case 'language-flashcards':
        return (
          <LanguageFlashcards
            cards={ctx.langContent}
            language={ctx.lang}
            currentIndex={langCardIndex}
            setCurrentIndex={setLangCardIndex}
            onBack={handleBackToMain}
          />
        );

      default:
        return handleBackToMain();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">AI Study Buddy</h1>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            <span className="font-bold">🔥 {streak} day streak</span>
            <span className="mx-2">|</span>
            <span>✨ {xp} XP</span>
          </div>
          <button
            onClick={() => setShowApp(false)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Назад до головної
          </button>
        </div>
      </header>

      <main>
        {renderCurrentPage()}
      </main>
    </div>
  );
}
