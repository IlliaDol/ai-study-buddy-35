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
import { Brain, Flame, Sparkles, ArrowLeft, BookOpen, Clock, Target, Trophy, Zap, Star, TrendingUp, Users } from "lucide-react";
import { motion } from "framer-motion";

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
  const handleQuickStudy = () => navigate('/quick-study');

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
          <div className="space-y-12">
            <MainNavigation
              onTopicLearning={handleTopicLearning}
              onCourseGeneration={handleCourseGeneration}
              onLanguageLearning={handleLanguageLearning}
              onQuickStudy={handleQuickStudy}
            />

            {/* Enhanced Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/10 via-violet-600/10 to-purple-600/10 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 p-8 md:p-12"
            >
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-violet-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="inline-flex items-center gap-3 mb-6"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-2xl">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
                      AI Study Buddy
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Your intelligent learning companion
                    </p>
                  </div>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-lg text-slate-700 dark:text-slate-300 mb-8 max-w-2xl mx-auto"
                >
                  Master any topic or language with structured flashcards and quizzes. 
                  <span className="text-emerald-500 font-semibold"> Powered by AI</span> when connected.
                </motion.p>

                {/* Enhanced Stats Display */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-6"
                >
                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Streak</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{streak} days</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Experience</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{xp} XP</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl px-6 py-4 border border-white/20 dark:border-slate-700/50 shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Level</p>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{Math.floor(xp / 100) + 1}</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Quick Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <BookOpen className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Total Decks</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{savedDecks.length}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Experience</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{xp} XP</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Flame className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Streak</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{streak} days</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="group bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <Trophy className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Level</p>
                    <p className="text-3xl font-bold text-slate-800 dark:text-white">{Math.floor(xp / 100) + 1}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Enhanced Due Cards Alert */}
            {dueDecksCount > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/30 dark:via-orange-900/30 dark:to-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/10 to-orange-400/10"></div>
                <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-amber-800 dark:text-amber-200 mb-2">Review Time!</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-lg">
                      You have cards due for review in {dueDecksCount} {dueDecksCount === 1 ? 'deck' : 'decks'}.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartDueReview}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Start Review
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Enhanced Saved Decks Section */}
            {savedDecks.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50 shadow-xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Your Study Decks</h2>
                </div>
                <SavedDecks decks={savedDecks} onReview={handleStartReview} onDelete={handleDeleteDeck} />
              </motion.div>
            )}

            {/* New Features Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gradient-to-br from-slate-50/50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 backdrop-blur-xl rounded-2xl p-8 border border-white/20 dark:border-slate-700/50"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Why Choose AI Study Buddy?</h2>
                <p className="text-slate-600 dark:text-slate-400">Discover the features that make learning more effective</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">AI-Powered</h3>
                  <p className="text-slate-600 dark:text-slate-400">Generate personalized content with advanced AI</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-violet-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Smart Learning</h3>
                  <p className="text-slate-600 dark:text-slate-400">Adaptive spaced repetition for optimal retention</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">Multi-Language</h3>
                  <p className="text-slate-600 dark:text-slate-400">Support for English, Ukrainian, and German</p>
                </div>
              </div>
            </motion.div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-violet-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/5 to-violet-400/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-400/8 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Header */}
        <header className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-b border-white/20 dark:border-slate-700/50 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-xl">
                    <Brain className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                    AI Study Buddy
                  </h1>
                </div>
                
                {/* Enhanced Progress Bar */}
                <div className="hidden md:flex items-center gap-4 ml-8">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-lg"></div>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Level {Math.floor(xp / 100) + 1}
                    </span>
                  </div>
                  <div className="w-32 h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full transition-all duration-500 progress-bar shadow-lg"
                      style={{ width: `${(xp % 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Enhanced Stats */}
                <div className="hidden sm:flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-900/30 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800 shadow-md">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                      {streak} day{streak !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-violet-50 dark:bg-violet-900/30 px-4 py-2 rounded-full border border-violet-200 dark:border-violet-800 shadow-md">
                    <Sparkles className="w-4 h-4 text-violet-500" />
                    <span className="text-sm font-semibold text-violet-700 dark:text-violet-300">
                      {xp} XP
                    </span>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="sm:hidden flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span className="font-bold">{streak}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Sparkles className="w-3 h-3 text-violet-500" />
                    <span>{xp}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowApp(false)}
                  className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors bg-white/50 dark:bg-slate-700/50 px-4 py-2 rounded-full backdrop-blur-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Назад до головної</span>
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
}
