import { useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowLeft, BookOpen, Check } from 'lucide-react';
import { AICourseStructure } from '@/lib/aiAgent';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface CoursePlayerProps {
  course: AICourseStructure;
  onBack: () => void;
  onReviewModule: (moduleIndex: number) => void;
}

export default function CoursePlayer({ course, onBack, onReviewModule }: CoursePlayerProps) {
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [completedModules, setCompletedModules] = useState<number[]>([]);

  const currentModule = course.modules[currentModuleIndex];
  const progress = Math.round(((completedModules.length) / course.modules.length) * 100);

  const handlePrevModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
    }
  };

  const handleNextModule = () => {
    if (currentModuleIndex < course.modules.length - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1);
      // Mark previous module as completed if not already
      if (!completedModules.includes(currentModuleIndex)) {
        setCompletedModules([...completedModules, currentModuleIndex]);
      }
    }
  };

  const handleMarkComplete = () => {
    if (!completedModules.includes(currentModuleIndex)) {
      setCompletedModules([...completedModules, currentModuleIndex]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Left sidebar - module navigation */}
      <div className="w-full md:w-64 flex-shrink-0">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
            <ArrowLeft size={16} />
          </Button>
          <h2 className="font-semibold text-lg">{course.title}</h2>
        </div>

        <div className="mb-4">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-1">
            {completedModules.length} of {course.modules.length} modules completed
          </p>
        </div>

        <Card>
          <ScrollArea className="h-[400px] p-2">
            <nav className="space-y-1 p-2">
              {course.modules.map((module, index) => (
                <div
                  key={index}
                  className={`
                    p-2 rounded-md cursor-pointer flex items-center justify-between
                    ${currentModuleIndex === index ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'}
                  `}
                  onClick={() => setCurrentModuleIndex(index)}
                >
                  <div className="flex items-center">
                    <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-200 text-xs mr-2">
                      {index + 1}
                    </span>
                    <span className="truncate text-sm">{module.title}</span>
                  </div>
                  {completedModules.includes(index) && (
                    <Check size={14} className="text-green-600" />
                  )}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </Card>
      </div>

      {/* Main content area */}
      <div className="flex-grow">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Module {currentModuleIndex + 1}: {currentModule.title}</h3>
          </div>

          <p className="text-gray-700">{currentModule.description}</p>

          <div>
            <h4 className="font-medium mb-2">Key Concepts</h4>
            <ul className="list-disc pl-5 space-y-1">
              {currentModule.concepts.map((concept, i) => (
                <li key={i} className="text-gray-700">{concept}</li>
              ))}
            </ul>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-2">Flashcards Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentModule.flashcards.slice(0, 2).map((card, i) => (
                <Card key={i} className="p-3 bg-gray-50">
                  <div className="font-medium">{card.front}</div>
                  <div className="text-gray-500 text-sm mt-1">Click "Review This Module" to study</div>
                </Card>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {currentModule.flashcards.length} flashcards in this module
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Quiz Preview</h4>
            <Card className="p-3 bg-gray-50">
              <div className="font-medium">{currentModule.quizQuestions[0]?.question || "No quiz questions available"}</div>
              <div className="text-gray-500 text-sm mt-1">Click "Review This Module" to take the quiz</div>
            </Card>
            <div className="text-sm text-gray-500 mt-1">
              {currentModule.quizQuestions.length} quiz questions in this module
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => onReviewModule(currentModuleIndex)}
              className="flex items-center gap-2"
            >
              <BookOpen size={16} />
              Review This Module
            </Button>

            <Button
              onClick={handleMarkComplete}
              variant="outline"
              disabled={completedModules.includes(currentModuleIndex)}
            >
              <Check size={16} className="mr-1" />
              {completedModules.includes(currentModuleIndex)
                ? "Completed"
                : "Mark as Completed"
              }
            </Button>
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="ghost"
              onClick={handlePrevModule}
              disabled={currentModuleIndex === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft size={16} />
              Previous Module
            </Button>

            <Button
              variant="ghost"
              onClick={handleNextModule}
              disabled={currentModuleIndex === course.modules.length - 1}
              className="flex items-center gap-1"
            >
              Next Module
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
