import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Brain, BarChart3, ArrowLeft, Save } from "lucide-react";

interface StudyModeSelectorProps {
  onModeSelect: (mode: 'flashcards' | 'quiz') => void;
  onBack: () => void;
  topic: string;
  onSaveDeck?: () => void;
}

export const StudyModeSelector = ({ onModeSelect, onBack, topic, onSaveDeck }: StudyModeSelectorProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">Study: {topic}</h2>
          <p className="text-muted-foreground">Choose your study mode</p>
        </div>
        {onSaveDeck && (
          <Button variant="outline" size="sm" onClick={onSaveDeck} className="gap-2">
            <Save size={16} /> Save Deck
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="study-card p-6 cursor-pointer group hover:scale-105 transition-transform"
          onClick={() => onModeSelect('flashcards')}
        >
          <div className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
              <BookOpen size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Flashcards</h3>
              <p className="text-muted-foreground">
                Study with interactive flashcards. Flip cards to reveal answers and test your memory.
              </p>
            </div>
            <div className="pt-4">
              <Button className="w-full">Start Flashcards</Button>
            </div>
          </div>
        </Card>

        <Card 
          className="study-card p-6 cursor-pointer group hover:scale-105 transition-transform"
          onClick={() => onModeSelect('quiz')}
        >
          <div className="text-center space-y-4">
            <div className="p-4 bg-primary/10 rounded-full w-fit mx-auto group-hover:bg-primary/20 transition-colors">
              <Brain size={32} className="text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quiz Mode</h3>
              <p className="text-muted-foreground">
                Test your knowledge with multiple choice questions and get instant feedback.
              </p>
            </div>
            <div className="pt-4">
              <Button className="w-full">Start Quiz</Button>
            </div>
          </div>
        </Card>
      </div>

      <Card className="study-card p-6">
        <div className="flex items-center gap-4">
          <BarChart3 size={24} className="text-primary" />
          <div>
            <h4 className="font-semibold">Track Your Progress</h4>
            <p className="text-sm text-muted-foreground">
              Complete both modes to get a comprehensive understanding of the topic
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};