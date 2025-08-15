import { useState } from "react";
import { TopicGenerator } from "@/components/TopicGenerator";
import { StudyModeSelector } from "@/components/StudyModeSelector";
import { StudyCard } from "@/components/StudyCard";
import { QuizMode } from "@/components/QuizMode";
import { QuizResults } from "@/components/QuizResults";
import { LanguageLearning } from "@/components/LanguageLearning";
import { LevelAssessment } from "@/components/LevelAssessment";
import { CustomVocabulary } from "@/components/CustomVocabulary";
import { LanguageStudyMode } from "@/components/LanguageStudyMode";
import { LanguageFlashcards } from "@/components/LanguageFlashcards";
import { MainNavigation } from "@/components/MainNavigation";

interface GeneratedContent {
  flashcards: Array<{ front: string; back: string }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

interface VocabEntry {
  id: string;
  word: string;
  translation: string;
}

type AppState = 
  | 'main-navigation'
  | 'topic-input' 
  | 'topic-mode-selection' 
  | 'topic-flashcards' 
  | 'topic-quiz' 
  | 'topic-quiz-results'
  | 'language-selection'
  | 'level-assessment'
  | 'custom-vocabulary'
  | 'language-study-mode'
  | 'language-flashcards'
  | 'language-quiz'
  | 'language-quiz-results';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('main-navigation');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [currentTopic, setCurrentTopic] = useState("");
  const [currentCard, setCurrentCard] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  
  // Language learning state
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [customVocabulary, setCustomVocabulary] = useState<VocabEntry[]>([]);

  // Topic Learning Handlers
  const handleTopicLearning = () => {
    setAppState('topic-input');
  };

  const handleContentGenerated = (content: GeneratedContent) => {
    setGeneratedContent(content);
    setCurrentTopic(content.flashcards[0]?.front.split('?')[0] || "Study Topic");
    setAppState('topic-mode-selection');
  };

  const handleTopicModeSelect = (mode: 'flashcards' | 'quiz') => {
    setCurrentCard(0);
    setAppState(mode === 'flashcards' ? 'topic-flashcards' : 'topic-quiz');
  };

  // Language Learning Handlers
  const handleLanguageLearning = () => {
    setAppState('language-selection');
  };

  const handleLanguageSelect = (language: string, level: string) => {
    setSelectedLanguage(language);
    setSelectedLevel(level);
    // Generate vocabulary based on language and level
    const generatedVocab = generateLanguageVocabulary(language, level);
    setCustomVocabulary(generatedVocab);
    setAppState('language-study-mode');
  };

  const handleLevelTest = (language: string) => {
    setSelectedLanguage(language);
    setAppState('level-assessment');
  };

  const handleLevelAssessmentComplete = (level: string) => {
    setSelectedLevel(level);
    const generatedVocab = generateLanguageVocabulary(selectedLanguage, level);
    setCustomVocabulary(generatedVocab);
    setAppState('language-study-mode');
  };

  const handleCustomVocab = (language: string) => {
    setSelectedLanguage(language);
    setAppState('custom-vocabulary');
  };

  const handleCustomVocabStudy = (vocabulary: VocabEntry[]) => {
    setCustomVocabulary(vocabulary);
    setSelectedLevel('custom');
    setAppState('language-study-mode');
  };

  const handleLanguageStudyModeSelect = (mode: 'flashcards' | 'quiz') => {
    setCurrentCard(0);
    setAppState(mode === 'flashcards' ? 'language-flashcards' : 'language-quiz');
  };

  // Navigation helpers
  const handleNextCard = () => {
    if (appState === 'topic-flashcards' && generatedContent && currentCard < generatedContent.flashcards.length - 1) {
      setCurrentCard(currentCard + 1);
    } else if (appState === 'language-flashcards' && currentCard < customVocabulary.length - 1) {
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
    setAppState(appState === 'topic-quiz' ? 'topic-quiz-results' : 'language-quiz-results');
  };

  const resetToMainNavigation = () => {
    setAppState('main-navigation');
    setGeneratedContent(null);
    setCurrentCard(0);
    setQuizScore(0);
    setSelectedLanguage("");
    setSelectedLevel("");
    setCustomVocabulary([]);
  };

  // Helper function to generate vocabulary based on language and level
  const generateLanguageVocabulary = (language: string, level: string): VocabEntry[] => {
    const baseVocab: Record<string, Record<string, VocabEntry[]>> = {
      es: {
        beginner: [
          { id: '1', word: 'hola', translation: 'hello' },
          { id: '2', word: 'adiós', translation: 'goodbye' },
          { id: '3', word: 'casa', translation: 'house' },
          { id: '4', word: 'agua', translation: 'water' },
          { id: '5', word: 'gato', translation: 'cat' },
        ],
        intermediate: [
          { id: '1', word: 'desarrollo', translation: 'development' },
          { id: '2', word: 'comprensión', translation: 'understanding' },
          { id: '3', word: 'experiencia', translation: 'experience' },
          { id: '4', word: 'importante', translation: 'important' },
          { id: '5', word: 'tecnología', translation: 'technology' },
        ],
        advanced: [
          { id: '1', word: 'perspicaz', translation: 'perceptive' },
          { id: '2', word: 'efímero', translation: 'ephemeral' },
          { id: '3', word: 'metamorfosis', translation: 'metamorphosis' },
          { id: '4', word: 'introspección', translation: 'introspection' },
          { id: '5', word: 'serendipidad', translation: 'serendipity' },
        ],
      },
      fr: {
        beginner: [
          { id: '1', word: 'bonjour', translation: 'hello' },
          { id: '2', word: 'au revoir', translation: 'goodbye' },
          { id: '3', word: 'maison', translation: 'house' },
          { id: '4', word: 'eau', translation: 'water' },
          { id: '5', word: 'chat', translation: 'cat' },
        ],
        intermediate: [
          { id: '1', word: 'développement', translation: 'development' },
          { id: '2', word: 'compréhension', translation: 'understanding' },
          { id: '3', word: 'expérience', translation: 'experience' },
          { id: '4', word: 'important', translation: 'important' },
          { id: '5', word: 'technologie', translation: 'technology' },
        ],
        advanced: [
          { id: '1', word: 'perspicace', translation: 'perceptive' },
          { id: '2', word: 'éphémère', translation: 'ephemeral' },
          { id: '3', word: 'métamorphose', translation: 'metamorphosis' },
          { id: '4', word: 'introspection', translation: 'introspection' },
          { id: '5', word: 'sérendipité', translation: 'serendipity' },
        ],
      },
    };

    return baseVocab[language]?.[level] || baseVocab.es.beginner;
  };

  const renderContent = () => {
    switch (appState) {
      case 'main-navigation':
        return (
          <MainNavigation
            onTopicLearning={handleTopicLearning}
            onLanguageLearning={handleLanguageLearning}
          />
        );

      case 'topic-input':
        return <TopicGenerator onContentGenerated={handleContentGenerated} />;
      
      case 'topic-mode-selection':
        return (
          <StudyModeSelector
            onModeSelect={handleTopicModeSelect}
            onBack={() => setAppState('topic-input')}
            topic={currentTopic}
          />
        );
      
      case 'topic-flashcards':
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
      
      case 'topic-quiz':
        if (!generatedContent) return null;
        return (
          <QuizMode
            questions={generatedContent.quizQuestions}
            onComplete={handleQuizComplete}
          />
        );
      
      case 'topic-quiz-results':
        if (!generatedContent) return null;
        return (
          <QuizResults
            score={quizScore}
            totalQuestions={generatedContent.quizQuestions.length}
            onRetakeQuiz={() => setAppState('topic-quiz')}
            onBackToModes={() => setAppState('topic-mode-selection')}
          />
        );

      case 'language-selection':
        return (
          <LanguageLearning
            onLanguageSelect={handleLanguageSelect}
            onLevelTest={handleLevelTest}
            onCustomVocab={handleCustomVocab}
          />
        );

      case 'level-assessment':
        return (
          <LevelAssessment
            language={selectedLanguage}
            onComplete={handleLevelAssessmentComplete}
            onBack={() => setAppState('language-selection')}
          />
        );

      case 'custom-vocabulary':
        return (
          <CustomVocabulary
            language={selectedLanguage}
            onBack={() => setAppState('language-selection')}
            onStartStudy={handleCustomVocabStudy}
          />
        );

      case 'language-study-mode':
        return (
          <LanguageStudyMode
            language={selectedLanguage}
            level={selectedLevel}
            vocabulary={customVocabulary}
            onModeSelect={handleLanguageStudyModeSelect}
            onBack={() => setAppState('language-selection')}
          />
        );

      case 'language-flashcards':
        return (
          <LanguageFlashcards
            vocabulary={customVocabulary}
            onNext={handleNextCard}
            onPrevious={handlePreviousCard}
            cardNumber={currentCard + 1}
            totalCards={customVocabulary.length}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      {appState === 'main-navigation' ? (
        renderContent()
      ) : (
        <div className="container mx-auto px-4 py-12">
          {renderContent()}
        </div>
      )}

      {/* Back to main navigation button for study modes */}
      {!['main-navigation', 'topic-input', 'language-selection'].includes(appState) && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2">
          <button
            onClick={resetToMainNavigation}
            className="bg-background/80 backdrop-blur-sm border border-border rounded-full px-6 py-2 text-sm font-medium shadow-lg hover:bg-background/90 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      )}
    </div>
  );
};

export default Index;
