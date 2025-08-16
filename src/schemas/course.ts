import { z } from "zod";

// Levels could be CEFR or custom; keep flexible but constrained
export const LevelEnum = z.enum([
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
  "beginner",
  "intermediate",
  "advanced",
]);
export type Level = z.infer<typeof LevelEnum>;

export const AssessmentItemSchema = z.object({
  type: z.enum(["mcq", "cloze", "translate", "freeform"]),
  stem: z.string().min(1),
  options: z.array(z.string()).optional(),
  answer: z.union([z.string(), z.number(), z.array(z.string())]),
  rubric: z
    .object({
      guidance: z.string().optional(),
      maxScore: z.number().int().min(1).max(10).optional(),
    })
    .optional(),
});

export type AssessmentItem = z.infer<typeof AssessmentItemSchema>;

export const LessonSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  outcomes: z.array(z.string()).min(1),
  theory: z.array(z.string()).default([]),
  examples: z.array(z.string()).default([]),
  exercises: z.array(AssessmentItemSchema).default([]),
  references: z
    .array(
      z.object({
        title: z.string().min(1),
        url: z.string().url().optional(),
        citation: z.string().min(1).optional(),
      })
    )
    .default([]),
});

export type Lesson = z.infer<typeof LessonSchema>;

export const ModuleSchema = z.object({
  title: z.string().min(1),
  outcomes: z.array(z.string()).default([]),
  prerequisites: z.array(z.string()).default([]),
  lessons: z.array(LessonSchema).default([]),
});

export type Module = z.infer<typeof ModuleSchema>;

export const SyllabusSchema = z.object({
  title: z.string().min(1),
  language: z.string().min(2),
  level: LevelEnum,
  goals: z.array(z.string()).default([]),
  modules: z.array(ModuleSchema).min(1),
});

export type Syllabus = z.infer<typeof SyllabusSchema>;

export const RubricResultSchema = z.object({
  factuality: z.number().min(0).max(5),
  clarity: z.number().min(0).max(5),
  level_fit: z.number().min(0).max(5),
  examples: z.number().min(0).max(5),
  localization: z.number().min(0).max(5),
  must_fix: z.array(z.string()).default([]),
});

export type RubricResult = z.infer<typeof RubricResultSchema>;

// Helper guards
export function validateSyllabus(data: unknown) {
  return SyllabusSchema.safeParse(data);
}

export function validateLesson(data: unknown) {
  return LessonSchema.safeParse(data);
}

export function validateAssessment(data: unknown) {
  return AssessmentItemSchema.safeParse(data);
}
