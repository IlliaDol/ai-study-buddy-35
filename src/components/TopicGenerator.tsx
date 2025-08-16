import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, BookOpen, Brain, Upload, Zap, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { aiAgent } from "@/lib/aiAgent";

interface GeneratedContent {
  flashcards: Array<{ front: string; back: string }>;
  quizQuestions: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
    explanation?: string;
  }>;
}

interface TopicGeneratorProps {
  onContentGenerated: (content: GeneratedContent) => void;
}

export const TopicGenerator = ({ onContentGenerated }: TopicGeneratorProps) => {
  const [topic, setTopic] = useState("");
  const [details, setDetails] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationMode, setGenerationMode] = useState<'quick' | 'comprehensive'>('quick');
  const [countdown, setCountdown] = useState(0);

  const generateContent = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic required",
        description: "Please enter a topic to generate study materials.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Check if using DeepSeek API
    const hasAIKey = localStorage.getItem('AI_API_KEY') || localStorage.getItem('OPENAI_API_KEY');
    const provider = localStorage.getItem('AI_PROVIDER') || 'deepseek';
    const isUsingAPI = hasAIKey && (provider === 'deepseek' || provider === 'openai');
    
    if (isUsingAPI) {
      // Start 20-second countdown for API calls
      setCountdown(20);
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      const clearCountdown = () => {
        clearInterval(countdownInterval);
        setCountdown(0);
      };
      
      try {
        const query = details ? `${topic}: ${details}` : topic;
        
        if (generationMode === 'comprehensive') {
          const course = await aiAgent.generateComprehensiveCourse(query);
          clearCountdown();
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
          onContentGenerated(content);
          toast({
            title: "Comprehensive course generated!",
            description: `${course.title} with ${course.modules.length} modules created. Starting with first module.`,
          });
        } else {
          const content = await aiAgent.generateQuickContent(query);
          clearCountdown();
          onContentGenerated(content);
          toast({
            title: "Study materials generated!",
            description: `Created ${content.flashcards.length} flashcards and ${content.quizQuestions.length} quiz questions.`,
          });
        }
      } catch (error) {
        clearCountdown();
        toast({
          title: "Generation failed",
          description: "Failed to generate study materials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    } else {
      // Local generation - no countdown
      try {
        const query = details ? `${topic}: ${details}` : topic;
        
        if (generationMode === 'comprehensive') {
          const course = await aiAgent.generateComprehensiveCourse(query);
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
          onContentGenerated(content);
          toast({
            title: "Comprehensive course generated!",
            description: `${course.title} with ${course.modules.length} modules created. Starting with first module.`,
          });
        } else {
          const content = await aiAgent.generateQuickContent(query);
          onContentGenerated(content);
          toast({
            title: "Study materials generated!",
            description: `Created ${content.flashcards.length} flashcards and ${content.quizQuestions.length} quiz questions.`,
          });
        }
      } catch (error) {
        toast({
          title: "Generation failed",
          description: "Failed to generate study materials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    }
  };

  const handleImportText = async () => {
    const text = prompt('Paste text to generate flashcards from:');
    if (!text) return;
    setTopic(topic || 'Imported Text');
    setDetails(details || '');
    const flashcards = splitTextToCards(text);
    const quizQuestions = flashcards.slice(0, 3).map((c, i) => ({
      question: c.front,
      options: [c.back, 'Unknown', 'Irrelevant', 'Skip'],
      correctAnswer: 0,
      explanation: `Answer: ${c.back}`,
    }));
    onContentGenerated({ flashcards, quizQuestions });
    toast({ title: 'Imported from text', description: `Created ${flashcards.length} cards.` });
  };

  const handleImportPDF = async (file: File) => {
    try {
      const text = await extractTextFromPDF(file);
      if (!text) {
        toast({ title: 'PDF import failed', description: 'Could not read text from PDF', variant: 'destructive' });
        return;
      }
      const flashcards = splitTextToCards(text);
      const quizQuestions = flashcards.slice(0, 3).map((c) => ({
        question: c.front,
        options: [c.back, 'Unknown', 'Irrelevant', 'Skip'],
        correctAnswer: 0,
        explanation: `Answer: ${c.back}`,
      }));
      setTopic(file.name.replace(/\.pdf$/i, ''));
      onContentGenerated({ flashcards, quizQuestions });
      toast({ title: 'Imported PDF', description: `Created ${flashcards.length} cards.` });
    } catch (e) {
      toast({ title: 'PDF import failed', description: 'Error while reading PDF', variant: 'destructive' });
    }
  };

  return (
    <Card className="study-card p-8">
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="text-primary" size={24} />
            <h2 className="text-2xl font-bold">AI Study Generator</h2>
          </div>
          <p className="text-muted-foreground">
            Enter a topic and let AI create personalized flashcards and quizzes for you
          </p>
        </div>

        {/* Generation Mode Toggle */}
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-lg p-1">
            <Button
              variant={generationMode === 'quick' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGenerationMode('quick')}
              className="flex items-center gap-2"
            >
              <Zap size={16} />
              Quick Generation
            </Button>
            <Button
              variant={generationMode === 'comprehensive' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setGenerationMode('comprehensive')}
              className="flex items-center gap-2"
            >
              <GraduationCap size={16} />
              Comprehensive Course
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Input
              placeholder="e.g., JavaScript, World War II, Calculus, React hooks..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Details (Optional)
            </label>
            <Textarea
              placeholder={generationMode === 'comprehensive' 
                ? "Describe your learning goals, experience level, specific focus areas, or any context that will help create a better course..."
                : "Add any specific areas you want to focus on, difficulty level, or additional context..."
              }
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Button
            onClick={generateContent}
            disabled={isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 animate-spin" size={20} />
                {countdown > 0 ? `Generating... ${countdown}s` : 'Generating...'}
              </>
            ) : (
              <>
                <Brain className="mr-2" size={20} />
                {generationMode === 'comprehensive' ? 'Generate Course' : 'Generate'}
              </>
            )}
          </Button>

          <Button variant="outline" className="w-full" onClick={handleImportText}>
            <Upload className="mr-2" size={18} /> Import Text
          </Button>

          <label className="w-full">
            <input type="file" accept="application/pdf" className="hidden" onChange={(e) => {
              const f = e.target.files?.[0]; if (f) handleImportPDF(f);
            }} />
            <div className="inline-flex w-full justify-center items-center gap-2 h-11 px-4 rounded-md border border-input bg-background hover:bg-accent cursor-pointer">
              <Upload size={18} /> Import PDF
            </div>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="text-center">
            <BookOpen className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-sm font-medium">Flashcards</p>
            <p className="text-xs text-muted-foreground">Interactive study cards</p>
          </div>
          <div className="text-center">
            <Brain className="mx-auto mb-2 text-primary" size={24} />
            <p className="text-sm font-medium">Quiz Mode</p>
            <p className="text-xs text-muted-foreground">Test your knowledge</p>
          </div>
        </div>

        {generationMode === 'comprehensive' && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={16} className="text-primary" />
              <span className="font-medium text-sm">Comprehensive Course Mode</span>
            </div>
            <p className="text-xs text-muted-foreground">
              AI will analyze your query, understand context, and create a structured course with multiple modules, 
              learning objectives, and progressive difficulty levels.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

function splitTextToCards(text: string) {
  const lines = text.split(/[\r\n]+/).map(s => s.trim()).filter(Boolean).slice(0, 40);
  if (lines.length < 4) {
    return [
      { front: 'Summary', back: text.slice(0, 160) + (text.length > 160 ? '…' : '') },
      { front: 'Key Idea', back: text.split(/\.\s/)[0] || text.slice(0, 100) },
    ];
  }
  const cards: Array<{ front: string; back: string }> = [];
  for (let i = 0; i < lines.length - 1; i += 2) {
    cards.push({ front: lines[i], back: lines[i+1] });
  }
  return cards.slice(0, 20);
}

async function extractTextFromPDF(file: File): Promise<string> {
  // Try to use PDF.js if available globally; otherwise fallback to simple read (most PDFs are binary not text)
  // Users can import text from a text-based PDF; if not, show an error handled by caller
  try {
    // @ts-ignore
    const pdfjsLib = (window as any)['pdfjsLib'];
    if (pdfjsLib) {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      for (let p = 1; p <= Math.min(pdf.numPages, 10); p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        const strings = content.items.map((it: any) => it.str).join(' ');
        fullText += strings + '\n';
      }
      return fullText;
    }
  } catch {}
  // Fallback: try as text (works only for some PDFs)
  try {
    const text = await file.text();
    return text;
  } catch {
    return '';
  }
}