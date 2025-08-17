import type { Syllabus } from '../schemas/course';

export interface AssessmentChoice { id: string; text: string; correct?: boolean }
export type AssessmentType = 'mcq'|'multi'|'match'|'order'|'cloze'|'short'|'numeric'|'case'|'code';
export interface AssessmentItem {
  id: string; type: AssessmentType; stem: string;
  outcomeId?: string; tags?: string[]; difficulty?: 'easy'|'medium'|'hard';
  explanation?: string; reference?: string;
  choices?: AssessmentChoice[]; pairs?: {left:string; right:string;}[]; items?: string[];
  textWithGaps?: string; answers?: string[]; acceptableAnswers?: string[];
  expected?: number; tolerance?: number; units?: string;
  context?: string; subQuestions?: AssessmentItem[];
  language?: string; starter?: string; tests?: string; referenceSolution?: string;
}

export interface AICourseModule {
  title: string; description: string; concepts: string[];
  flashcards: Array<{ front: string; back: string; difficulty: 'easy'|'medium'|'hard' }>;
  quizQuestions: Array<{ question: string; options: string[]; correctAnswer: number; explanation?: string; }>;
}
export interface AICourseStructure {
  title: string; description: string; difficulty: 'beginner'|'intermediate'|'advanced';
  estimatedTime: string; prerequisites: string[]; learningObjectives: string[];
  modules: AICourseModule[]; syllabus?: Syllabus;
  codingMode?: 'auto'|'on'|'off'; assessmentBank?: AssessmentItem[];
}

async function invokeDeepResearch(input: any) {
  // TODO: hook LLM. Stub for now.
  return { ok: true, data: input };
}
async function invokeReasoner(input: any) {
  // TODO: hook LLM. Stub for now.
  return { ok: true, data: input };
}

export const aiAgent = {
  async generateCourse(query: string): Promise<AICourseStructure> {
    const { generateCourseStructure } = await import('../services/fallback');
    const base = generateCourseStructure(query);
    return { ...base, codingMode: 'auto' };
  },
  invokeDeepResearch, invokeReasoner,
};
