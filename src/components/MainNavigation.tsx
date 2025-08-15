import { Card } from "@/components/ui/card";
import { BookOpen, Globe, Brain, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

interface MainNavigationProps {
  onTopicLearning: () => void;
  onLanguageLearning: () => void;
}

export const MainNavigation = ({ onTopicLearning, onLanguageLearning }: MainNavigationProps) => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-20"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-glow/20 backdrop-blur-sm" />
        <div className="relative container mx-auto px-4 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI-Powered Learning
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Master any topic or language with personalized flashcards and quizzes powered by AI
          </p>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Topic Learning */}
          <Card 
            className="study-card p-8 cursor-pointer group hover:scale-105 transition-all duration-300"
            onClick={onTopicLearning}
          >
            <div className="text-center space-y-6">
              <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                <Brain size={48} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Topic Learning</h3>
                <p className="text-muted-foreground mb-6">
                  Generate study materials for any subject. From science and history to 
                  programming and literature - AI creates personalized flashcards and quizzes.
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <Sparkles size={16} />
                  <span>AI-Generated Content</span>
                </div>
              </div>
              <div className="pt-4">
                <div className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors group-hover:bg-primary/90">
                  Start Topic Learning
                </div>
              </div>
            </div>
          </Card>

          {/* Language Learning */}
          <Card 
            className="study-card p-8 cursor-pointer group hover:scale-105 transition-all duration-300"
            onClick={onLanguageLearning}
          >
            <div className="text-center space-y-6">
              <div className="p-6 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
                <Globe size={48} className="text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4">Language Learning</h3>
                <p className="text-muted-foreground mb-6">
                  Master vocabulary in multiple languages. Take level assessments, 
                  add custom words, and study with adaptive learning techniques.
                </p>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <BookOpen size={16} />
                  <span>10+ Languages Available</span>
                </div>
              </div>
              <div className="pt-4">
                <div className="w-full bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium transition-colors group-hover:bg-primary/90">
                  Start Language Learning
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center mb-12">Powerful Learning Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
              <Sparkles size={32} className="text-primary mx-auto mb-4" />
              <h4 className="font-semibold mb-2">AI-Powered</h4>
              <p className="text-sm text-muted-foreground">
                Intelligent content generation tailored to your learning level and goals
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};