import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, BookOpen, Brain, Clock, Target, CheckCircle, ArrowRight, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { aiAgent, AICourseStructure } from "@/lib/aiAgent";

interface CourseGeneratorProps {
  onCourseGenerated: (course: AICourseStructure) => void;
}

export const CourseGenerator = ({ onCourseGenerated }: CourseGeneratorProps) => {
  const [query, setQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCourse, setGeneratedCourse] = useState<AICourseStructure | null>(null);

  const generateCourse = async () => {
    if (!query.trim()) {
      toast({
        title: "Query required",
        description: "Please describe what you want to learn.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const course = await aiAgent.generateComprehensiveCourse(query);
      setGeneratedCourse(course);
      onCourseGenerated(course);
      toast({
        title: "Course generated!",
        description: `${course.title} with ${course.modules.length} modules created.`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const startCourse = () => {
    if (generatedCourse) {
      // Start with the first module
      const firstModule = generatedCourse.modules[0];
      const content = {
        flashcards: firstModule.flashcards.map(fc => ({ front: fc.front, back: fc.back })),
        quizQuestions: firstModule.quizQuestions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        }))
      };
      onCourseGenerated(generatedCourse);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="study-card p-8">
        <div className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-primary" size={24} />
              <h2 className="text-2xl font-bold">AI Course Generator</h2>
            </div>
            <p className="text-muted-foreground">
              Describe what you want to learn and AI will create a comprehensive course structure
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">What do you want to learn?</label>
              <Textarea
                placeholder="e.g., I want to learn JavaScript for web development, focusing on practical applications and real-world projects..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={generateCourse}
              disabled={isGenerating}
              size="lg"
              className="w-full max-w-md"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="mr-2 animate-spin" size={20} />
                  Generating Course...
                </>
              ) : (
                <>
                  <Brain className="mr-2" size={20} />
                  Generate Comprehensive Course
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {generatedCourse && (
        <Card className="study-card p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{generatedCourse.title}</h3>
              <p className="text-muted-foreground mb-4">{generatedCourse.description}</p>
              
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <Clock size={14} />
                  {generatedCourse.estimatedTime}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <BookOpen size={14} />
                  {generatedCourse.modules.length} modules
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Target size={14} />
                  {generatedCourse.difficulty}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle size={16} className="text-primary" />
                  Learning Objectives
                </h4>
                <ul className="space-y-2">
                  {generatedCourse.learningObjectives.map((objective, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen size={16} className="text-primary" />
                  Prerequisites
                </h4>
                <ul className="space-y-2">
                  {generatedCourse.prerequisites.map((prereq, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Course Modules</h4>
              <div className="space-y-3">
                {generatedCourse.modules.map((module, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div>
                        <h5 className="font-medium">{module.title}</h5>
                        <p className="text-sm text-muted-foreground">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{module.flashcards.length} cards</span>
                      <span>•</span>
                      <span>{module.quizQuestions.length} questions</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <Button onClick={startCourse} size="lg" className="gap-2">
                <Play size={16} />
                Start Course
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
