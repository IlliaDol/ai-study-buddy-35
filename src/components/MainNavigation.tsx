import { Card } from "@/components/ui/card";
import { BookOpen, Globe, Brain, Sparkles, Flame, GraduationCap, KeyRound, Settings as SettingsIcon } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useGamification } from "@/hooks/useGamification";
import { Settings } from "./Settings";
import { useState } from "react";

interface MainNavigationProps {
  onTopicLearning: () => void;
  onLanguageLearning: () => void;
  onCourseGeneration: () => void;
}

export const MainNavigation = ({ onTopicLearning, onLanguageLearning, onCourseGeneration }: MainNavigationProps) => {
  const { xp, streak } = useGamification();
  const [showSettings, setShowSettings] = useState(false);
  const provider = (typeof window !== 'undefined' && (localStorage.getItem('AI_PROVIDER') || (localStorage.getItem('OPENAI_API_KEY') ? 'openai' : ''))) || '';
  const aiKey = typeof window !== 'undefined' ? (localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY') || '') : '';
  const hasAIKey = !!aiKey;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 backdrop-blur-sm" />
        <div className="relative container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-2">
            Learning Platform
          </h1>
          <div className="flex items-center justify-center gap-3 mb-5">
            <button
              type="button"
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center gap-2 text-sm bg-background/80 text-foreground border border-border rounded-full px-3 py-1 hover:bg-background"
              aria-label="Open AI Settings"
            >
              <SettingsIcon size={14} />
              AI Settings
            </button>
            {hasAIKey ? (
              <span className="text-xs bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-600/30 rounded-full px-2 py-0.5">
                {provider || 'deepseek'}
              </span>
            ) : (
              <span className="text-xs bg-yellow-300 text-black rounded-full px-2 py-0.5">No key set</span>
            )}
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Master any topic or language with structured flashcards and quizzes. Powered by AI when connected.
          </p>
          <div className="inline-flex items-center gap-4 bg-background/30 backdrop-blur-md border border-border rounded-full px-5 py-2 text-sm">
            <span className="flex items-center gap-2"><Flame size={16} className="text-primary" /> Streak: {streak}</span>
            <span>•</span>
            <span>XP: {xp}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Choose Your Learning Path</h2>
          <p className="text-muted-foreground text-lg">
            Select the type of learning experience that suits your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Topic Learning */}
          <Card 
            className="study-card p-8 group hover:scale-105 transition-all duration-300"
            aria-label="Topic Learning card"
          >
            <div className="text-center space-y-6">
              <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                <BookOpen size={48} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Topic Learning</h3>
                <p className="text-muted-foreground mb-6">
                  Generate study materials for any subject. Uses AI when connected.
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Sparkles size={16} />
                  <span>{hasAIKey ? `AI enabled (${provider || 'deepseek'})` : 'Local generator active'}</span>
                </div>
              </div>
              <div className="pt-4">
                <button type="button" onClick={onTopicLearning} className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors group-hover:bg-primary/90">
                  Start Topic Learning
                </button>
              </div>
            </div>
          </Card>

          {/* AI Course Generator */}
          <Card 
            className="study-card p-8 group hover:scale-105 transition-all duration-300"
            aria-label="AI Course Generator card"
          >
            <div className="text-center space-y-6">
              <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                <GraduationCap size={48} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">AI Course Generator</h3>
                <p className="text-muted-foreground mb-6">
                  Create comprehensive courses with structured modules and progressive tests.
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Brain size={16} />
                  <span>Structured Learning</span>
                </div>
              </div>
              <div className="pt-4">
                <button type="button" onClick={onCourseGeneration} className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors group-hover:bg-primary/90">
                  Generate Course
                </button>
              </div>
            </div>
          </Card>

          {/* Language Learning */}
          <Card 
            className="study-card p-8 group hover:scale-105 transition-all duration-300"
            aria-label="Language Learning card"
          >
            <div className="text-center space-y-6">
              <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                <Globe size={48} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Language Learning</h3>
                <p className="text-muted-foreground mb-6">
                  Master languages with adaptive vocabulary practice and level-based content.
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <BookOpen size={16} />
                  <span>10+ Languages Available</span>
                </div>
              </div>
              <div className="pt-4">
                <button type="button" onClick={onLanguageLearning} className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors group-hover:bg-primary/90">
                  Start Language Learning
                </button>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Powerful Learning Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="study-card p-6 text-center">
              <BookOpen size={32} className="text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Interactive Flashcards</h4>
              <p className="text-sm text-muted-foreground">
                Smooth flip animations and intuitive navigation for effective memorization
              </p>
            </Card>
            
            <Card className="study-card p-6 text-center">
              <Brain size={32} className="text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Smart Quizzes</h4>
              <p className="text-sm text-muted-foreground">
                Multiple choice questions with instant feedback and detailed explanations
              </p>
            </Card>
            
            <Card className="study-card p-6 text-center">
              <GraduationCap size={32} className="text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Structured Courses</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive learning paths with modules, objectives, and progress tracking
              </p>
            </Card>
            
            <Card className="study-card p-6 text-center">
              <Sparkles size={32} className="text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">AI Assistant</h4>
              <p className="text-sm text-muted-foreground">
                {hasAIKey ? 'Connected to your AI key for smarter content.' : 'Set your AI key to enable smarter content.'}
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
};