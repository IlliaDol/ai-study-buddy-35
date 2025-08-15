import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, BookOpen, Brain, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

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
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const flashcards = generateFlashcards(topic, details);
      const quizQuestions = generateQuizQuestions(topic, details);
      onContentGenerated({ flashcards, quizQuestions });
      toast({
        title: "Study materials generated!",
        description: `Created ${flashcards.length} flashcards and ${quizQuestions.length} quiz questions.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate study materials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
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

  const generateFlashcards = (topic: string, details: string) => {
    const baseCards = [
      { front: `What is ${topic}?`, back: `${topic} is a fundamental concept that ${details || 'involves key principles and applications in its field'}.` },
      { front: `Key characteristics of ${topic}`, back: `Main features include systematic approach, practical applications, and theoretical foundations.` },
      { front: `Why is ${topic} important?`, back: `${topic} plays a crucial role in understanding and applying related concepts effectively.` },
      { front: `How is ${topic} used?`, back: `${topic} is applied through various methods and techniques depending on the specific context and requirements.` },
      { front: `Main benefits of studying ${topic}`, back: `Understanding ${topic} provides better problem-solving skills and deeper knowledge in the subject area.` },
    ];
    return baseCards;
  };

  const generateQuizQuestions = (topic: string, details: string) => {
    return [
      {
        question: `Which of the following best describes ${topic}?`,
        options: [
          `A fundamental concept in the field`,
          `An advanced technique`,
          `A simple tool`,
          `An outdated method`
        ],
        correctAnswer: 0,
        explanation: `${topic} is indeed a fundamental concept that forms the basis for understanding more advanced topics.`
      },
      {
        question: `What is the primary purpose of studying ${topic}?`,
        options: [
          `To memorize facts`,
          `To understand principles and applications`,
          `To pass exams only`,
          `To impress others`
        ],
        correctAnswer: 1,
        explanation: `The main goal is to understand the underlying principles and how they can be applied practically.`
      },
      {
        question: `How would you best approach learning ${topic}?`,
        options: [
          `Memorization only`,
          `Practical application and understanding`,
          `Skipping the basics`,
          `Focusing on advanced topics first`
        ],
        correctAnswer: 1,
        explanation: `Combining practical application with conceptual understanding is the most effective learning approach.`
      }
    ];
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

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Topic</label>
            <Input
              placeholder="e.g., Photosynthesis, World War II, Calculus..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Additional Details (Optional)
            </label>
            <Textarea
              placeholder="Add any specific areas you want to focus on, difficulty level, or additional context..."
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
                Generating...
              </>
            ) : (
              <>
                <Brain className="mr-2" size={20} />
                Generate
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