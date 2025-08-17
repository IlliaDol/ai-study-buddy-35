import { z } from "zod";

/** ===== Levels ===== */
export const LevelEnum = z.enum([
  "A1","A2","B1","B2","C1","C2",
  "beginner","intermediate","advanced",
]);
export type Level = z.infer<typeof LevelEnum>;

/** ===== Assessment types ===== */
export const AssessmentTypeEnum = z.enum([
  "mcq","multi","match","order","cloze","short","numeric","case","code"
]);
export type AssessmentType = z.infer<typeof AssessmentTypeEnum>;

export const AssessmentChoiceSchema = z.object({
  id: z.string(),
  text: z.string(),
  correct: z.boolean().default(false)
});

export const AssessmentBaseSchema = z.object({
  id: z.string(),
  type: AssessmentTypeEnum,
  stem: z.string(),
  outcomeId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  difficulty: z.enum(["easy","medium","hard"]).default("medium"),
  explanation: z.string().optional(),
  reference: z.string().optional(), // anchor/section name in Core Text
});

export const MCQSchema = AssessmentBaseSchema.extend({
  type: z.literal("mcq"),
  choices: z.array(AssessmentChoiceSchema).min(2),
});
export const MultiSchema = AssessmentBaseSchema.extend({
  type: z.literal("multi"),
  choices: z.array(AssessmentChoiceSchema).min(2),
});
export const MatchSchema = AssessmentBaseSchema.extend({
  type: z.literal("match"),
  pairs: z.array(z.object({ left: z.string(), right: z.string() })).min(2),
});
export const OrderSchema = AssessmentBaseSchema.extend({
  type: z.literal("order"),
  items: z.array(z.string()).min(2),
});
export const ClozeSchema = AssessmentBaseSchema.extend({
  type: z.literal("cloze"),
  textWithGaps: z.string(),
  answers: z.array(z.string()).min(1),
});
export const ShortSchema = AssessmentBaseSchema.extend({
  type: z.literal("short"),
  acceptableAnswers: z.array(z.string()).min(1),
});
export const NumericSchema = AssessmentBaseSchema.extend({
  type: z.literal("numeric"),
  expected: z.number(),
  tolerance: z.number().default(0),
  units: z.string().optional(),
});
export const CaseSchema = AssessmentBaseSchema.extend({
  type: z.literal("case"),
  context: z.string(),
  subQuestions: z.array(AssessmentBaseSchema).min(1),
});
export const CodeSchema = AssessmentBaseSchema.extend({
  type: z.literal("code"),
  language: z.string().default("python"),
  starter: z.string().default(""),
  tests: z.string().default(""),
  referenceSolution: z.string().optional(),
});

export const AssessmentItemSchema = z.discriminatedUnion("type", [
  MCQSchema, MultiSchema, MatchSchema, OrderSchema, ClozeSchema,
  ShortSchema, NumericSchema, CaseSchema, CodeSchema
]);
export type AssessmentItem = z.infer<typeof AssessmentItemSchema>;

/** ===== Lesson blocks ===== */
export const CoreTextBlockSchema = z.object({
  type: z.literal("core_text"),
  contentMd: z.string(),
  summaryBullets: z.array(z.string()).default([]),
  cheatsheetMd: z.string().default(""),
});
export const WorkedExampleBlockSchema = z.object({
  type: z.literal("worked_example"),
  contentMd: z.string(),
});
export const GuidedPracticeBlockSchema = z.object({
  type: z.literal("guided_practice"),
  items: z.array(z.object({
    prompt: z.string(),
    hints: z.array(z.string()).default([]),
    solutionMd: z.string().optional(),
    outcomeId: z.string().optional(),
  })).min(1),
});
export const IndependentPracticeBlockSchema = z.object({
  type: z.literal("independent_practice"),
  items: z.array(z.object({
    prompt: z.string(),
    difficulty: z.enum(["easy","medium","hard"]).default("medium"),
    solutionMd: z.string().optional(),
    outcomeId: z.string().optional(),
  })).min(1),
});
export const CheckpointQuizBlockSchema = z.object({
  type: z.literal("checkpoint_quiz"),
  items: z.array(AssessmentItemSchema).min(1),
});
export const ReflectionBlockSchema = z.object({
  type: z.literal("reflection"),
  prompts: z.array(z.string()).min(1),
});
export const SummaryBlockSchema = z.object({
  type: z.literal("summary"),
  bullets: z.array(z.string()).min(1),
  cheatsheetMd: z.string().default(""),
});
export const FlashcardsBlockSchema = z.object({
  type: z.literal("flashcards"),
  cards: z.array(z.object({ front: z.string(), back: z.string() })).min(1),
});
export const CodePracticeBlockSchema = z.object({
  type: z.literal("code_practice"),
  language: z.string().default("python"),
  starter: z.string().default(""),
  tests: z.string().default(""),
  enable: z.boolean().default(true),
  referenceSolution: z.string().optional(),
});

export const LessonBlockSchema = z.discriminatedUnion("type", [
  CoreTextBlockSchema, WorkedExampleBlockSchema, GuidedPracticeBlockSchema,
  IndependentPracticeBlockSchema, CheckpointQuizBlockSchema, ReflectionBlockSchema,
  SummaryBlockSchema, FlashcardsBlockSchema, CodePracticeBlockSchema
]);
export type LessonBlock = z.infer<typeof LessonBlockSchema>;

export const LessonSchema = z.object({
  title: z.string().min(1),
  outcomes: z.array(z.string()).min(1),
  est_time_min: z.number().int().positive().default(45),
  blocks: z.array(LessonBlockSchema).min(1),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const ModuleSchema = z.object({
  title: z.string().min(1),
  overview: z.string().default(""),
  learning_outcomes: z.array(z.string()).min(1),
  est_time_h: z.number().int().positive().default(6),
  lessons: z.array(LessonSchema).min(1),
  test_bank: z.array(AssessmentItemSchema).optional(),
});
export type Module = z.infer<typeof ModuleSchema>;

export const SyllabusSchema = z.object({
  title: z.string().min(1),
  audience: z.string().default("general"),
  level: LevelEnum,
  duration_weeks: z.number().int().positive(),
  time_per_week_h: z.number().int().positive(),
  language: z.string().default("uk"),
  prerequisites: z.array(z.string()).default([]),
  modules: z.array(ModuleSchema).min(1),
  placement_test: z.object({ blueprint: z.string().default("") }).optional(),
  coding_mode: z.enum(["auto","on","off"]).default("auto"),
});
export type Syllabus = z.infer<typeof SyllabusSchema>;

export const RubricResultSchema = z.object({
  factuality: z.number().min(0).max(5),
  clarity: z.number().min(0).max(5),
  level_fit: z.number().min(0).max(5),
  examples: z.number().min(0).max(5),
  coverage: z.number().min(0).max(5),
  summary_quality: z.number().min(0).max(5),
}).partial();
export type RubricResult = z.infer<typeof RubricResultSchema>;

export function validateSyllabus(data: unknown) { return SyllabusSchema.safeParse(data); }
export function validateLesson(data: unknown) { return LessonSchema.safeParse(data); }
export function validateAssessment(data: unknown) { return AssessmentItemSchema.safeParse(data); }
