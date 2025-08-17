#!/usr/bin/env bash
set -euo pipefail
# === apply_patch.sh (v6) ===
# v6 додає:
# - MicroTestReview (SRS для ПИТАНЬ, не карток)
# - AICourseGeneratorButton підключено до generateCourseFactory
# - QA-репорт у генераторі (перевірки: worked/guided/independent/quiz)
# - Export CSV всіх питань силлабуса
# - Рекомендації після Start Learning
# - Кнопка/маршрут для мікро-тестів

ensure_dir(){ mkdir -p "$1"; echo "[mkdir] $1"; }
write_file(){ local p="$1"; shift; ensure_dir "$(dirname "$p")"; printf "%s\n" "$*" > "$p"; echo "[write] $p"; }

# 1) schemas (як у v5 — без змін)
write_file "src/schemas/course.ts" "$(cat <<'TS'
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
TS
)"

# 2) utils (як у v5)
write_file "src/utils/text.ts" "$(cat <<'TS'
export function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9а-щьюяєіїґ\- ]/gi,'').trim().replace(/\s+/g,'-');
}
export function renderMinimalMd(src: string): string {
  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let inUL = false, inOL = false;
  const flushLists = () => { if (inUL) { out.push('</ul>'); inUL=false; } if (inOL){ out.push('</ol>'); inOL=false; } };
  for (let raw of lines) {
    const line = raw.replace(/\t/g,'  ');
    if (/^#{1,6}\s+/.test(line)) { flushLists(); const level = (line.match(/^#+/)![0].length);
      const text = line.replace(/^#{1,6}\s+/,'').trim(); const id = slugify(text);
      out.push(`<h${level} id="${id}">${escapeInline(text)}</h${level}>`); continue; }
    if (/^\s*-\s+/.test(line)) { if (!inUL){ flushLists(); out.push('<ul>'); inUL=true; }
      out.push(`<li>${escapeInline(line.replace(/^\s*-\s+/,''))}</li>`); continue; }
    if (/^\s*\d+\.\s+/.test(line)) { if (!inOL){ flushLists(); out.push('<ol>'); inOL=true; }
      out.push(`<li>${escapeInline(line.replace(/^\s*\d+\.\s+/,''))}</li>`); continue; }
    if (line.trim()===''){ flushLists(); out.push(''); continue; }
    flushLists(); out.push(`<p>${escapeInline(line)}</p>`);
  } flushLists(); return out.join('\n');
}
function escapeInline(t: string) {
  let r = t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  r = r.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>'); r = r.replace(/\*(.+?)\*/g,'<em>$1</em>'); return r;
}
export function readabilityMetrics(text: string) {
  const sentences = text.split(/[.!?]+/).map(s=>s.trim()).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  const avgSentenceLen = sentences.length ? (words.length / sentences.length) : words.length;
  return { sentences: sentences.length, words: words.length, avgSentenceLen };
}
TS
)"
write_file "src/utils/export.ts" "$(cat <<'TS'
export function toCSV(rows: string[][]): string {
  return rows.map(r => r.map(cell => {
    const c = (cell ?? '').toString().replace(/"/g,'""');
    return /[",\n]/.test(c) ? `"${c}"` : c;
  }).join(',')).join('\n');
}
export function downloadText(filename: string, content: string, mime='text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
}
export function exportFlashcardsCSV(cards: {front:string; back:string}[], filename='flashcards.csv') {
  const rows = [['Front','Back'], ...cards.map(c => [c.front, c.back])];
  downloadText(filename, toCSV(rows), 'text/csv;charset=utf-8');
}
export function exportQuestionsCSV(questions: any[], filename='questions.csv') {
  const rows = [['id','type','stem','answer/explanation']];
  for (const q of questions) {
    let ans = '';
    switch(q.type){
      case 'mcq': case 'multi':
        ans = (q.choices||[]).filter((c:any)=>c.correct).map((c:any)=>c.text).join(' | '); break;
      case 'match': ans = (q.pairs||[]).map((p:any)=>`${p.left}→${p.right}`).join(' ; '); break;
      case 'order': ans = (q.items||[]).join(' → '); break;
      case 'cloze': ans = (q.answers||[]).join(' | '); break;
      case 'short': ans = (q.acceptableAnswers||[]).join(' | '); break;
      case 'numeric': ans = `${q.expected} ± ${q.tolerance||0} ${q.units||''}`.trim(); break;
      default: ans = '';
    }
    rows.push([q.id, q.type, q.stem, q.explanation ? `${ans} // ${q.explanation}` : ans]);
  }
  downloadText(filename, toCSV(rows), 'text/csv;charset=utf-8');
}
TS
)"

# 3) lib/aiAgent.ts — додаємо місця для двох агентів (стаби)
write_file "src/lib/aiAgent.ts" "$(cat <<'TS'
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
TS
)"

# 4) services/courseFactory.ts — як у v5 + уточнення reference і збирання test_bank
write_file "src/services/courseFactory.ts" "$(cat <<'TS'
import { Syllabus, SyllabusSchema, RubricResult, Level, AssessmentItem } from "../schemas/course";

export type Intake = {
  topic: string;
  language?: string;
  level?: Level;
  goals?: string[];
  coding_mode?: 'auto'|'on'|'off';
  mode?: 'text-heavy'|'practice-heavy'|'exam-prep'|'language-learning';
};

export type PipelineResult = { statuses: string[]; syllabus: Syllabus; rubric?: RubricResult; };

const DEFAULTS = {
  language: 'uk', level: 'beginner' as Level, goals: [] as string[],
  coding_mode: 'auto' as const, mode: 'text-heavy' as const,
};

function wantsCode(intake: Required<Intake>, los: string[]): boolean {
  if (intake.coding_mode === 'on') return true;
  if (intake.coding_mode === 'off') return false;
  const hay = (intake.topic + ' ' + los.join(' ')).toLowerCase();
  const kw = ['код','скрипт','program','програм','sql','запит','алгоритм','implement','імплемент','write code','javascript','python','dataset','ml','data'];
  return kw.some(k => hay.includes(k));
}

function sampleAssessment(id: string): AssessmentItem[] {
  return [
    { id:`${id}-mcq`, type:'mcq', stem:'Ключове поняття?', choices:[
      {id:'a',text:'A',correct:true},{id:'b',text:'B'},{id:'c',text:'C'}
    ], explanation:'A — базово.', tags:['concepts'], outcomeId:'LO1', reference:'Ключові ідеї' },
    { id:`${id}-order`, type:'order', stem:'Упорядкуйте кроки', items:['Крок 1','Крок 2','Крок 3'],
      explanation:'Порядок як у списку.', tags:['process'], outcomeId:'LO3', reference:'Worked Example' },
  ] as AssessmentItem[];
}

export async function generateCourseFactory(input: string | Partial<Intake>): Promise<PipelineResult> {
  const intake: Required<Intake> = ((): any => {
    if (typeof input === 'string') return { ...DEFAULTS, topic: input };
    return { ...DEFAULTS, topic: input.topic || 'Untitled Course', ...input };
  })();

  const statuses: string[] = [];
  statuses.push("Intake: зчитую тему та параметри…");
  statuses.push("Syllabus: проєктую модулі та уроки…");

  const los = [
    "Define key terms",
    "Recognize typical mistakes",
    "Apply concepts to basic problems",
    intake.coding_mode !== 'off' ? "Optionally implement a simple solution" : "Solve tasks without coding",
  ];
  const enableCode = wantsCode(intake, los);

  const extraIndep = intake.mode === 'practice-heavy' ? 3 : 0;
  const extraQuiz  = intake.mode === 'exam-prep' ? 3 : 0;
  const extraCards = intake.mode === 'language-learning' ? 6 : 0;

  const lessonBlocksBase = (lessonId: string) => ([
    {
      type: "core_text",
      contentMd: `## Чому це важливо
Огляд теми **${intake.topic}** та інтуїція.

### Ключові ідеї
- Ідея 1
- Ідея 2

### Типові помилки
1. Помилка А — як уникнути
2. Помилка Б — як виправити`,
      summaryBullets: ["Ідея 1", "Ідея 2", "Типові помилки"],
      cheatsheetMd: "- Правило 1\n- Правило 2",
    } as any,
    { type: "worked_example", contentMd: `### Worked Example\nПокроковий розв'язок простої задачі з поясненнями.` } as any,
    {
      type: "guided_practice",
      items: [
        { prompt: "Завдання з підказкою 1", hints: ["Подумай про X"], solutionMd: "Рішення 1", outcomeId: "LO1" },
        { prompt: "Завдання з підказкою 2", hints: ["Згадай правило Y"], solutionMd: "Рішення 2", outcomeId: "LO2" },
        { prompt: "Завдання з підказкою 3", hints: ["Спробуй приклад Z"], solutionMd: "Рішення 3", outcomeId: "LO3" },
      ],
    } as any,
    {
      type: "independent_practice",
      items: [
        { prompt: "Самостійна задача A", difficulty: "easy", solutionMd: "Рішення A", outcomeId: "LO1" },
        { prompt: "Самостійна задача B", difficulty: "medium", solutionMd: "Рішення B", outcomeId: "LO2" },
        { prompt: "Самостійна задача C", difficulty: "hard", solutionMd: "Рішення C", outcomeId: "LO3" },
        { prompt: "Самостійна задача D", difficulty: "medium", solutionMd: "Рішення D", outcomeId: "LO2" },
        { prompt: "Самостійна задача E", difficulty: "easy", solutionMd: "Рішення E", outcomeId: "LO1" },
        { prompt: "Самостійна задача F", difficulty: "medium", solutionMd: "Рішення F", outcomeId: "LO3" },
        ...Array.from({length: extraIndep}).map((_,i)=>({ prompt:`Додаткова задача ${i+1}`, difficulty:"medium", solutionMd:"", outcomeId:"LO2" }))
      ],
    } as any,
    {
      type: "checkpoint_quiz",
      items: [
        ...sampleAssessment(`${lessonId}-base`),
        ...Array.from({length: extraQuiz}).map((_,i)=>({ id:`${lessonId}-x${i}`, type:'mcq', stem:`Додаткове питання ${i+1}`, choices:[
          {id:'a',text:'A',correct:true},{id:'b',text:'B'}
        ], explanation:'Пояснення', outcomeId:'LO1', reference:'Ключові ідеї' } as AssessmentItem)),
      ],
    } as any,
    { type: "summary", bullets: ["Підсумок 1","Підсумок 2","Підсумок 3"], cheatsheetMd: "- Формула A\n- Прийом B" } as any,
    { type: "flashcards",
      cards: [
        { front: "Термін X", back: "Визначення X" },
        { front: "Термін Y", back: "Визначення Y" },
        ...Array.from({length: extraCards}).map((_,i)=>({front:`Слово ${i+1}`, back:`Переклад ${i+1}`}))
      ],
    } as any,
    ...(enableCode ? [{
      type: "code_practice",
      language: "python",
      starter: "# Напишіть функцію add(a,b)\n",
      tests: "def test_add():\n    assert add(1,2)==3",
      enable: true,
      referenceSolution: "def add(a,b):\n    return a+b",
    } as any] : [])
  ]);

  const syllabus: Syllabus = {
    title: `${intake.topic} — Generated Course`,
    audience: "general",
    level: intake.level,
    duration_weeks: 4,
    time_per_week_h: 4,
    language: intake.language,
    prerequisites: [],
    coding_mode: intake.coding_mode,
    modules: [
      {
        title: "Module 1 — Foundations",
        overview: "Core ideas and first practice.",
        learning_outcomes: los,
        est_time_h: 6,
        lessons: [
          { title: "Lesson 1 — Core Ideas", outcomes: ["Define key terms","Recognize typical mistakes","Solve basic exercises"], est_time_min: 45, blocks: lessonBlocksBase('L1') as any[] },
          { title: "Lesson 2 — Applying Basics", outcomes: ["Apply concepts to basic problems","Explain reasoning"], est_time_min: 45, blocks: lessonBlocksBase('L2') as any[] },
        ],
        test_bank: sampleAssessment('M1'),
      },
      {
        title: "Module 2 — Integration",
        overview: "Projects and consolidation.",
        learning_outcomes: ["Integrate concepts across topics","Evaluate trade-offs", enableCode ? "Implement a small solution" : "Compose a plan without coding"],
        est_time_h: 6,
        lessons: [
          { title: "Lesson 3 — Mini Project", outcomes: ["Plan steps","Execute tasks"], est_time_min: 60, blocks: lessonBlocksBase('L3') as any[] },
        ],
        test_bank: sampleAssessment('M2'),
      }
    ],
    placement_test: { blueprint: "Short diagnostic aligned to module outcomes." }
  };

  statuses.push("Practice: додаю приклади та вправи…");
  statuses.push("Assessment: генерую питання різних типів…");
  statuses.push("QA: перевірка покриття та читабельності…");
  statuses.push(`Coding mode: ${intake.coding_mode} → enableCode=${enableCode}`);

  const parsed = SyllabusSchema.safeParse(syllabus);
  if (!parsed.success) throw new Error("Invalid syllabus generated: " + JSON.stringify(parsed.error.issues, null, 2));

  const rubric: RubricResult = { coverage: 4.5, clarity: 4.2, factuality: 4.0, examples: 4.0, level_fit: 4.0, summary_quality: 4.5 };
  return { statuses, syllabus: parsed.data, rubric };
}
TS
)"

# 5) store (як у v5)
write_file "src/store/course.ts" "$(cat <<'TS'
export type ItemType =
  | 'video' | 'reading' | 'quiz' | 'lab' | 'peer'
  | 'core_text' | 'practice' | 'assessment' | 'code_practice';

export interface CourseItem { id: string; type: ItemType; title: string; durationMin?: number; content?: string; videoUrl?: string; dueAt?: string; }
export interface CourseModule { id: string; title: string; items: CourseItem[]; }
export interface CourseWeek { id: string; title: string; modules: CourseModule[]; }
export interface Course {
  id: string; title: string; deadlinesOn: boolean; timezone: string; softScheduleStart: string; weeks: CourseWeek[];
}
export type ProgressMap = Record<string, { visited?: boolean; done?: boolean; attempts?: number; correct?: number; last?: string; }>;

function isoShift(days: number) { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString(); }
function demoReading() {
  return `## Чому це важливо
**Core Text → Practice → Assessment** — дослідницький текст з прикладами.

### Ключові ідеї
- Ідея 1
- Ідея 2

### Типові помилки
1. Помилка А — як уникнути
2. Помилка Б — як виправити`;
}
export function loadCourse(): Course {
  return {
    id: 'demo',
    title: 'AI Fundamentals — Full Edition',
    deadlinesOn: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    softScheduleStart: new Date().toISOString(),
    weeks: [
      { id: 'w1', title: 'Week 1 — Foundations', modules: [
        { id: 'm1', title: 'Intro & Basics', items: [
          { id: 'i1', type: 'core_text', title: 'Core Text: What is a Model?', content: demoReading(), durationMin: 10, dueAt: isoShift(2) },
          { id: 'i2', type: 'practice', title: 'Practice Set 1', durationMin: 15, dueAt: isoShift(3) },
          { id: 'i3', type: 'assessment', title: 'Start Learning — Checkpoint Quiz', durationMin: 8, dueAt: isoShift(4) },
          { id: 'i4', type: 'video', title: 'Welcome & Orientation', videoUrl: '', durationMin: 6, dueAt: isoShift(5) },
        ]},
      ]},
    ],
  };
}
export function getProgress(courseId: string): ProgressMap { const key = `course:${courseId}:progress`; try { return JSON.parse(localStorage.getItem(key) || '{}') as ProgressMap; } catch { return {}; } }
export function saveProgress(courseId: string, map: ProgressMap) { const key = `course:${courseId}:progress`; localStorage.setItem(key, JSON.stringify(map)); }
export function markVisited(courseId: string, itemId: string) { const map = getProgress(courseId); map[itemId] = { ...(map[itemId] || {}), visited: true, last: new Date().toISOString() }; saveProgress(courseId, map); }
export function toggleDone(courseId: string, itemId: string) { const map = getProgress(courseId); const cur = map[itemId]?.done; map[itemId] = { ...(map[itemId] || {}), done: !cur, last: new Date().toISOString() }; saveProgress(courseId, map); }
export function flattenItems(course: Course): CourseItem[] { return course.weeks.flatMap(w => w.modules.flatMap(m => m.items)); }
export function nextItem(course: Course, itemId: string) { const flat = flattenItems(course); const idx = flat.findIndex(it => it.id === itemId); return idx >= 0 ? flat[idx + 1] : undefined; }
export function getDeadlines(course: Course) {
  const now = Date.now(); const flat = flattenItems(course);
  const upcoming = flat.filter(it => it.dueAt && new Date(it.dueAt).getTime() > now);
  const overdue  = flat.filter(it => it.dueAt && new Date(it.dueAt).getTime() <= now);
  return { upcoming, overdue };
}
export function resetSoftSchedule(courseId: string) {
  const map = getProgress(courseId); Object.keys(map).forEach(id => map[id].last = new Date().toISOString()); saveProgress(courseId, map);
}
TS
)"

# 6) AssessmentEngine — додаємо рекомендації
write_file "src/components/assessment/AssessmentEngine.tsx" "$(cat <<'TSX'
import React, { useEffect, useMemo, useState } from 'react';
import { exportQuestionsCSV } from '../../utils/export';

type Mode = 'practice'|'adaptive'|'exam';

type QBase = {
  id: string;
  type: 'mcq'|'multi'|'match'|'order'|'cloze'|'short'|'numeric'|'case';
  stem: string;
  explanation?: string;
  tags?: string[];
  outcomeId?: string;
  reference?: string;
};
type Choice = { id:string; text:string; correct?:boolean };

type QMCQ   = QBase & { type: 'mcq';   choices: Choice[] };
type QMulti = QBase & { type: 'multi'; choices: Choice[] };
type QMatch = QBase & { type: 'match'; pairs: {left:string; right:string}[] };
type QOrder = QBase & { type: 'order'; items: string[] };
type QCloze = QBase & { type: 'cloze'; textWithGaps: string; answers: string[] };
type QShort = QBase & { type: 'short'; acceptableAnswers: string[] };
type QNumeric = QBase & { type: 'numeric'; expected: number; tolerance?: number; units?: string };
type QCase = QBase & { type: 'case'; context: string; subQuestions: (QMCQ|QMulti|QMatch|QOrder|QCloze|QShort|QNumeric)[] };

type Question = QMCQ | QMulti | QMatch | QOrder | QCloze | QShort | QNumeric | QCase;

function shuffle<T>(arr: T[]) { const a = [...arr]; for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

const BANK: Question[] = [
  { id: 'q1', type: 'mcq', stem: 'Що з наведеного є основною ідеєю?',
    choices: [{id:'a',text:'Ідея A',correct:true},{id:'b',text:'Ідея B'},{id:'c',text:'Ідея C'}],
    explanation: 'Ідея A — базова.', tags: ['concepts'], outcomeId:'LO1', reference:'Ключові ідеї' },
  { id: 'q2', type: 'multi', stem: 'Позначте всі правильні твердження',
    choices: [{id:'a',text:'Так',correct:true},{id:'b',text:'Ні'},{id:'c',text:'Можливо',correct:true}],
    explanation: 'Правильні: Так і Можливо.', tags:['understanding'], outcomeId:'LO1' },
  { id: 'q3', type: 'match', stem: 'Зіставте терміни й визначення',
    pairs: [{ left: 'HTML', right: 'розмітка' },{ left: 'CSS',  right: 'стилі' },{ left: 'JS',   right: 'логіка' }],
    explanation: 'HTML→розмітка, CSS→стилі, JS→логіка.', tags:['definitions'], outcomeId:'LO1' },
  { id: 'q4', type: 'order', stem: 'Розташуйте кроки', items: ['Крок 1','Крок 2','Крок 3'],
    explanation: 'Порядок як у списку.', tags:['process'], outcomeId:'LO3' },
  { id: 'q5', type: 'cloze', stem: 'Заповніть пропуски', textWithGaps: 'E = m * {gap}^2', answers: ['c'],
    explanation: 'Швидкість світла: c.', tags:['facts'], outcomeId:'LO1' },
  { id: 'q6', type: 'short', stem: 'Дайте визначення терміну X', acceptableAnswers: ['еталон'],
    explanation: 'Має містити «еталон».', tags:['definitions'], outcomeId:'LO1', reference:'Вступ'},
  { id: 'q7', type: 'numeric', stem: '2 + 2 = ?', expected: 4, tolerance: 0,
    explanation: 'Базова арифметика.', tags:['calculation'], outcomeId:'LO2'},
  { id: 'q8', type: 'case', stem: 'Кейс: запуск продукту', context: 'Компанія А виводить продукт на ринок.',
    subQuestions: [
      { id:'q8a', type:'mcq', stem:'Перший крок?', choices:[
        {id:'a',text:'Реклама'},{id:'b',text:'Дослідження ринку',correct:true},{id:'c',text:'Знижки'}
      ], explanation:'Спочатку дані.'},
      { id:'q8b', type:'short', stem:'Сформулюйте 1 критерій успіху', acceptableAnswers:['частка','частку','market share','доход'], explanation:'Має містити показник типу «частка ринку» або «дохід».' }
    ],
    explanation:'Логіка: дослідження→критерії→реалізація.',
    tags:['process','application'], outcomeId:'LO3', reference:'Worked Example' },
];

type Rec = { id:string; correct:boolean; tags?:string[]; outcomeId?:string };

export default function AssessmentEngine({ examDurationSec = 600 }: { examDurationSec?: number }) {
  const [mode, setMode] = useState<Mode>('practice');
  const [queue, setQueue] = useState<number[]>(() => BANK.map((_,i)=>i));
  const [pos, setPos] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Rec[]>([]);
  const [finished, setFinished] = useState(false);

  // Exam timer
  const [remaining, setRemaining] = useState(examDurationSec);
  useEffect(() => {
    if (mode !== 'exam' || finished) return;
    const t = setInterval(() => {
      setRemaining(s => { if (s <= 1) { clearInterval(t); setFinished(true); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, finished, examDurationSec]);

  const q = BANK[queue[pos]];
  const total = queue.length;
  const progress = Math.round((pos / Math.max(1,total)) * 100);
  const change = (qid: string, val: any) => setAnswers(a => ({ ...a, [qid]: val }));

  // ===== перевірка
  const check = (qq: Question, val: any): boolean => {
    switch(qq.type){
      case 'mcq': {
        const chosen = val as string|undefined;
        const correct = (qq as QMCQ).choices.find(c => c.correct)?.id;
        return chosen === correct;
      }
      case 'multi': {
        const chosen: string[] = (val || []) as string[];
        const correctIds = (qq as QMulti).choices.filter(c => c.correct).map(c=>c.id).sort().join('|');
        const sel = chosen.slice().sort().join('|');
        return sel === correctIds;
      }
      case 'order': {
        const order: string[] = val || [];
        return order.join('|') === (qq as QOrder).items.join('|');
      }
      case 'cloze': {
        const vals: string[] = val || [];
        const exp = (qq as QCloze).answers;
        if (vals.length !== exp.length) return false;
        return vals.every((v,i) => v.trim().toLowerCase() === exp[i].trim().toLowerCase());
      }
      case 'short': {
        const t = (val||'').toString().trim().toLowerCase();
        return (qq as QShort).acceptableAnswers.some(ans => t.includes(ans.toLowerCase()));
      }
      case 'numeric': {
        const num = Number(val);
        const tol = (qq as QNumeric).tolerance ?? 0;
        return Math.abs(num - (qq as QNumeric).expected) <= tol;
      }
      case 'match': {
        const map = val as Record<string,string>|undefined;
        if (!map) return false;
        const pairs = (qq as QMatch).pairs;
        return pairs.every(p => (map[p.left] || '').trim().toLowerCase() === p.right.trim().toLowerCase());
      }
      case 'case': {
        const sub = (qq as QCase).subQuestions;
        return sub.every(sq => check(sq, answers[sq.id]));
      }
    }
  };

  // відповіли?
  const currentAnswered =
    q.type==='case'
      ? (q as QCase).subQuestions.every(sq => answers[sq.id] !== undefined)
      : answers[q.id] !== undefined;

  const currentCorrect = currentAnswered && check(q, answers[q.id]);

  const submit = () => {
    if (q.type === 'case') {
      const sub = (q as QCase).subQuestions;
      const allOk = sub.every(sq => check(sq, answers[sq.id]));
      setRecords(prev => [...prev, { id: q.id, correct: allOk, tags: q.tags, outcomeId: q.outcomeId }]);
      for (const sq of sub) {
        setRecords(prev => [...prev, { id: sq.id, correct: check(sq, answers[sq.id]), tags: q.tags, outcomeId: q.outcomeId }]);
      }
      if (mode === 'adaptive' && !allOk) setQueue(prev => [...prev, queue[pos]]);
    } else {
      setRecords(prev => [...prev, { id: q.id, correct: currentCorrect as boolean, tags: q.tags, outcomeId: q.outcomeId }]);
      if (mode === 'adaptive' && !currentCorrect) setQueue(prev => [...prev, queue[pos]]);
    }
    if (pos < total - 1) setPos(p => p + 1); else setFinished(true);
  };

  const reset = () => { setPos(0); setQueue(BANK.map((_,i)=>i)); setRecords([]); setFinished(false); setAnswers({}); setRemaining(600); };

  // аналітика
  const stats = useMemo(() => {
    const byTag: Record<string, { correct:number; total:number }> = {};
    const byLO: Record<string, { correct:number; total:number }> = {};
    for (const r of records) {
      if (r.tags) for (const t of r.tags) { byTag[t] ??= { correct:0, total:0 }; byTag[t].total++; if (r.correct) byTag[t].correct++; }
      if (r.outcomeId) { byLO[r.outcomeId] ??= { correct:0, total:0 }; byLO[r.outcomeId].total++; if (r.correct) byLO[r.outcomeId].correct++; }
    }
    const overall = { correct: records.filter(r=>r.correct).length, total: records.length };
    return { overall, byTag, byLO };
  }, [records]);

  // рекомендації
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    Object.entries(stats.byLO).forEach(([lo, s]) => {
      const p = Math.round(100*s.correct/Math.max(1,s.total));
      if (p < 70) recs.push(`LO "${lo}" < 70% — перечитай «Ключові ідеї» та переглянь Worked Example.`);
    });
    if (!recs.length && records.length>0) recs.push('Гарна робота! Для закріплення запусти Adaptive з іншими питаннями.');
    return recs;
  }, [stats, records.length]);

  // рендерер (інтерактивний order)
  const renderQuestion = (qq: Question) => {
    switch(qq.type){
      case 'mcq': {
        const qqq = qq as QMCQ;
        return (
          <div className="space-y-1">
            {qqq.choices.map(c => (
              <label key={c.id} className="flex items-center gap-2">
                <input type="radio" name={qq.id} value={c.id}
                  onChange={() => change(qq.id, c.id)}
                  checked={answers[qq.id]===c.id}/>
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'multi': {
        const qqq = qq as QMulti;
        const sel: string[] = answers[qq.id] || [];
        const toggle = (id:string) => {
          const set = new Set(sel); set.has(id)? set.delete(id): set.add(id);
          change(qq.id, Array.from(set));
        };
        return (
          <div className="space-y-1">
            {qqq.choices.map(c => (
              <label key={c.id} className="flex items-center gap-2">
                <input type="checkbox" checked={sel.includes(c.id)} onChange={()=>toggle(c.id)} />
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'order': {
        const expected = (qq as QOrder).items;
        const cur: string[] = answers[qq.id] || shuffle(expected);
        if (!answers[qq.id]) change(qq.id, cur);
        const move = (i:number, dir:-1|1) => {
          const a = [...cur]; const j=i+dir; if (j<0||j>=a.length) return;
          [a[i],a[j]] = [a[j],a[i]]; change(qq.id, a);
        };
        return (
          <ul className="text-sm">
            {cur.map((it, i)=>(
              <li key={i} className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-gray-100">{i+1}</span>
                <span className="flex-1">{it}</span>
                <button className="px-2 py-0.5 border rounded text-xs" onClick={()=>move(i,-1)}>↑</button>
                <button className="px-2 py-0.5 border rounded text-xs" onClick={()=>move(i, 1)}>↓</button>
              </li>
            ))}
          </ul>
        );
      }
      case 'cloze': {
        const qqq = qq as QCloze;
        const gapCount = (qqq.textWithGaps.match(/\{gap\}/g) || []).length || qqq.answers.length;
        const vals: string[] = answers[qq.id] || Array(gapCount).fill('');
        const parts = qqq.textWithGaps.split('{gap}');
        return (
          <div className="flex flex-wrap items-center gap-2">
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                <span>{part}</span>
                {i < gapCount && (
                  <input className="border rounded px-2 py-1 w-24"
                         value={vals[i] ?? ''}
                         onChange={e=>{ const copy = [...vals]; copy[i] = e.target.value; change(qq.id, copy); }}/>
                )}
              </React.Fragment>
            ))}
          </div>
        );
      }
      case 'short':
        return <input className="border rounded px-2 py-1 w-full" placeholder="Ваша відповідь"
                      value={answers[qq.id] || ''} onChange={e=>change(qq.id, e.target.value)} />;
      case 'numeric':
        return <div className="flex items-center gap-2">
          <input type="number" className="border rounded px-2 py-1 w-32"
                 value={answers[qq.id] || ''} onChange={e=>change(qq.id, e.target.value)} />
          {(qq as QNumeric).units && <span>{(qq as QNumeric).units}</span>}
        </div>;
      case 'match': {
        const rights = (qq as QMatch).pairs.map(p=>p.right);
        const map: Record<string,string> = answers[qq.id] || {};
        return (
          <div className="space-y-2">
            {(qq as QMatch).pairs.map((p,i)=>(
              <div key={i} className="flex items-center gap-2">
                <span className="min-w-[100px]">{p.left}</span>
                <select className="border rounded px-2 py-1" value={map[p.left] || ''}
                        onChange={e=>change(qq.id, { ...(map||{}), [p.left]: e.target.value })}>
                  <option value="" disabled>—</option>
                  {rights.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            ))}
          </div>
        );
      }
      default: return null;
    }
  };

  if (finished) {
    const correct = records.filter(r=>r.correct).length;
    const pct = records.length ? Math.round(100*correct/records.length) : 0;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Результати</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>exportQuestionsCSV(BANK, 'questions.csv')}>Export CSV (questions)</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={reset}>Почати знову</button>
          </div>
        </div>
        <div className="rounded border p-3">
          <div className="text-lg font-semibold">{pct}% правильних</div>
          <div className="text-sm opacity-70">{correct} з {records.length}</div>
        </div>
        {Object.keys(stats.byTag).length>0 && (
          <div className="rounded border p-3">
            <div className="font-medium mb-2">По тегах</div>
            <ul className="text-sm list-disc pl-5">
              {Object.entries(stats.byTag).map(([t, s])=>{
                const p = Math.round(100*s.correct/Math.max(1,s.total));
                return <li key={t}>{t}: {p}% ({s.correct}/{s.total})</li>;
              })}
            </ul>
          </div>
        )}
        {Object.keys(stats.byLO).length>0 && (
          <div className="rounded border p-3">
            <div className="font-medium mb-2">По learning outcomes</div>
            <ul className="text-sm list-disc pl-5">
              {Object.entries(stats.byLO).map(([lo, s])=>{
                const p = Math.round(100*s.correct/Math.max(1,s.total));
                return <li key={lo}>{lo}: {p}% ({s.correct}/{s.total})</li>;
              })}
            </ul>
          </div>
        )}
        <div className="rounded border p-3">
          <div className="font-medium mb-2">Рекомендації</div>
          <ul className="list-disc pl-5 text-sm">{recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul>
        </div>
        {mode==='exam' && (
          <div className="rounded border p-3 text-sm">
            <div className="font-medium mb-1">Пояснення (Exam)</div>
            <ul className="list-disc pl-5">
              {BANK.map(qq => (
                <li key={qq.id}>
                  <span className="font-medium">{qq.stem}</span>
                  {qq.explanation ? <> — {qq.explanation}</> : null}
                  {qq.reference ? <> (див. {qq.reference})</> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const qIsCase = q.type==='case';
  const allSubAnswered = qIsCase ? (q as QCase).subQuestions.every(sq => answers[sq.id] !== undefined) : false;
  const feedbackPractice = (mode!=='exam') && (qIsCase ? allSubAnswered : (answers[q.id]!==undefined));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Start Learning — Assessment</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs">Mode:</label>
            <select className="border rounded px-2 py-1 text-xs" value={mode} onChange={e=>setMode(e.target.value as Mode)}>
              <option value="practice">Practice</option>
              <option value="adaptive">Adaptive</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          {mode==='exam' && <div className="text-xs px-2 py-1 rounded bg-black/5">⏱ {Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</div>}
          <div className="text-sm opacity-70">{pos+1} / {total}</div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} /></div>

      <div className="rounded border p-3 space-y-3">
        <div className="font-medium">{q.stem}</div>
        {q.type!=='case' ? renderQuestion(q) : (
          <div className="space-y-3">
            <div className="text-sm opacity-80">{(q as QCase).context}</div>
            {(q as QCase).subQuestions.map((sq) => (
              <div key={sq.id} className="rounded border p-2">
                <div className="text-sm font-medium mb-1">{sq.stem}</div>
                {renderQuestion(sq)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {feedbackPractice ? (
          <div className="text-sm">
            {qIsCase ? (
              <div className="space-y-1">
                {(q as QCase).subQuestions.map(sq=>{
                  const ok = check(sq, answers[sq.id]);
                  return (
                    <div key={sq.id} className={ok?'text-green-600':'text-red-600'}>
                      {ok?'Правильно':'Неправильно'} — {('explanation' in sq && (sq as any).explanation) ? (sq as any).explanation : (q.explanation || '')}
                    </div>
                  );
                })}
                {q.reference ? <div className="opacity-70">див. {q.reference}</div> : null}
              </div>
            ) : (
              <div className={currentCorrect ? 'text-green-600' : 'text-red-600'}>
                {currentCorrect ? 'Правильно' : 'Неправильно'}{q.explanation ? ` — ${q.explanation}` : ''}{q.reference ? ` (див. ${q.reference})` : ''}
              </div>
            )}
          </div>
        ) : <div className="text-xs opacity-60">{mode==='exam'?'Exam mode: пояснення будуть наприкінці.':''}</div>}
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={submit} disabled={!currentAnswered}>
          {pos < total - 1 ? 'Далі' : 'Завершити'}
        </button>
      </div>
    </div>
  );
}
TSX
)"

# 7) CodePractice (як у v5)
write_file "src/components/code/CodePractice.tsx" "$(cat <<'TSX'
import React, { useState } from 'react';
type Props = { language?: string; starter?: string; tests?: string; };
export default function CodePractice({ language='python', starter='', tests='' }: Props) {
  const [code, setCode] = useState(starter || '');
  return (
    <div className="space-y-3">
      <div className="text-sm opacity-70">Code Practice ({language}). Виконання коду у браузері вимкнено. Підключіть бекенд-раннер для запуску тестів.</div>
      <textarea className="w-full h-48 border rounded p-2 font-mono text-sm" value={code} onChange={e=>setCode(e.target.value)} />
      {tests && (<details className="rounded border p-2"><summary className="cursor-pointer font-medium">Показати тести</summary><pre className="text-xs whitespace-pre-wrap">{tests}</pre></details>)}
    </div>
  );
}
TSX
)"

# 8) CourseItemRenderer (як у v5)
write_file "src/components/course/CourseItemRenderer.tsx" "$(cat <<'TSX'
import React, { useMemo, useState } from 'react';
import type { Course, CourseItem } from '../../store/course';
import { nextItem, toggleDone, markVisited } from '../../store/course';
import { Link } from 'react-router-dom';
import AssessmentEngine from '../assessment/AssessmentEngine';
import CodePractice from '../code/CodePractice';
import { renderMinimalMd } from '../../utils/text';

export default function CourseItemRenderer({ course, item }: { course: Course; item: CourseItem }) {
  const [speed, setSpeed] = useState(1);
  const next = useMemo(() => nextItem(course, item.id), [course, item.id]);
  markVisited(course.id, item.id);
  return (
    <div className="space-y-4">
      <header className="rounded bg-gray-50 p-3 border">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{item.title}</div>
          <div className="text-xs opacity-70">Type: {item.type}</div>
        </div>
      </header>
      {(item.type === 'video') && (
        <section className="rounded border p-3">
          <div className="aspect-video bg-black/5 rounded flex items-center justify-center">
            <div className="text-sm opacity-70">Video player (placeholder) — {speed}x</div>
          </div>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span>Speed</span>
            <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="border rounded px-2 py-1">
              {[0.75, 1, 1.25, 1.5, 1.75, 2].map(v => <option key={v} value={v}>{v}x</option>)}
            </select>
          </div>
        </section>
      )}
      {(item.type === 'reading' || item.type === 'core_text') && (
        <section className="rounded border p-3">
          <div dangerouslySetInnerHTML={{ __html: renderMinimalMd(item.content || 'No content provided.') }} />
        </section>
      )}
      {item.type === 'practice' && (
        <section className="rounded border p-3">
          <div className="text-sm opacity-70">Guided & independent practice (demo placeholder).</div>
          <ul className="list-disc pl-5 mt-2 text-sm">
            <li>Завдання 1 з підказкою</li>
            <li>Завдання 2 з підказкою</li>
            <li>Самостійні задачі з рішеннями</li>
          </ul>
        </section>
      )}
      {item.type === 'assessment' && (<section className="rounded border p-3"><AssessmentEngine /></section>)}
      {item.type === 'code_practice' && (<section className="rounded border p-3"><CodePractice language="python" starter={"# Напишіть функцію add(a,b)\n"} tests={"def test_add():\n    assert add(1,2)==3"} /></section>)}
      <footer className="flex items-center justify-between">
        <button onClick={() => toggleDone(course.id, item.id)} className="px-3 py-1 rounded border text-sm">Toggle done</button>
        {next ? (<Link to={`/course/${course.id}/lesson/${next.id}`} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Next: {next.title}</Link>) : (<span className="text-sm opacity-70">End of module</span>)}
      </footer>
    </div>
  );
}
TSX
)"

# 9) CourseOverview — додаємо кнопку Micro Tests
write_file "src/pages/course/CourseOverview.tsx" "$(cat <<'TSX'
import React from 'react';
import { loadCourse, flattenItems } from '../../store/course';
import { Link } from 'react-router-dom';
import { exportFlashcardsCSV } from '../../utils/export';

export default function CourseOverview() {
  const course = loadCourse();
  const items = flattenItems(course);
  const firstAssessment = items.find(i => i.type === 'assessment');
  const demoCards = [
    { front: 'Термін X', back: 'Визначення X' },
    { front: 'Термін Y', back: 'Визначення Y' },
  ];
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{course.title}</h1>
      <p className="text-sm opacity-80">Стартовий огляд курсу. Вибери урок, тренуйся або повторюй матеріал.</p>
      <div className="flex gap-2 flex-wrap">
        {firstAssessment && (<Link to={`/course/${course.id}/lesson/${firstAssessment.id}`} className="inline-block px-3 py-2 rounded bg-blue-600 text-white">Start Learning</Link>)}
        <Link to={`/review`} className="inline-block px-3 py-2 rounded bg-emerald-600 text-white">SRS Review (Flashcards)</Link>
        <Link to={`/review/micro`} className="inline-block px-3 py-2 rounded bg-purple-600 text-white">Review (Micro-tests)</Link>
        <button className="px-3 py-2 rounded border" onClick={()=>exportFlashcardsCSV(demoCards)}>Export CSV (flashcards)</button>
      </div>
      <div className="space-y-2">
        {course.weeks.map(w => (
          <div key={w.id} className="rounded border p-3">
            <div className="font-medium mb-1">{w.title}</div>
            {w.modules.map(m => (
              <div key={m.id} className="mb-2">
                <div className="text-sm font-semibold">{m.title}</div>
                <ul className="list-disc pl-5 text-sm">
                  {m.items.map(it => (
                    <li key={it.id}>
                      <Link to={`/course/${course.id}/lesson/${it.id}`} className="underline">{it.title}</Link>
                      <span className="ml-2 text-xs opacity-70">({it.type})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
TSX
)"

# 10) SRSReview (як у v5) + MicroTestReview
write_file "src/components/review/SRSReview.tsx" "$(cat <<'TSX'
import React, { useEffect, useMemo, useState } from 'react';
import { exportFlashcardsCSV } from '../../utils/export';

type Card = { id: string; front: string; back: string; box: number; nextDue: number };
const KEY = 'srs:deck';
function loadDeck(): Card[] {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
  const now = Date.now();
  return [
    { id:'c1', front:'Термін X', back:'Визначення X', box:1, nextDue:now },
    { id:'c2', front:'Термін Y', back:'Визначення Y', box:1, nextDue:now },
    { id:'c3', front:'Формула A', back:'a^2 + b^2 = c^2', box:1, nextDue:now },
  ];
}
function saveDeck(d: Card[]) { localStorage.setItem(KEY, JSON.stringify(d)); }
const INTERVALS_DAYS = [0, 1, 3, 7, 14, 30];

export default function SRSReview() {
  const [deck, setDeck] = useState<Card[]>(loadDeck());
  const now = Date.now();
  const due = useMemo(() => deck.filter(c => c.nextDue <= now), [deck, now]);
  const [idx, setIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  useEffect(()=> saveDeck(deck), [deck]);
  const current = due[idx];
  const rate = (grade: 'again'|'hard'|'good'|'easy') => {
    if (!current) return;
    setDeck(d => d.map(c => {
      if (c.id !== current.id) return c;
      let box = c.box;
      if (grade === 'again') box = Math.max(1, box-1);
      else if (grade === 'hard') box = Math.max(1, box);
      else if (grade === 'good') box = Math.min(5, box+1);
      else if (grade === 'easy') box = Math.min(5, box+2);
      const days = INTERVALS_DAYS[box];
      return { ...c, box, nextDue: Date.now() + days*24*3600*1000 };
    }));
    setShowBack(false);
    setIdx(i => (i+1<due.length? i+1 : 0));
  };
  const exportCSV = () => exportFlashcardsCSV(deck.map(({front,back})=>({front,back})));
  if (!due.length) {
    return (
      <div className="space-y-3">
        <div className="font-semibold">SRS Review</div>
        <div className="rounded border p-3 text-sm">Сьогодні немає карток до повторення.</div>
        <button className="px-3 py-1 rounded border text-sm" onClick={exportCSV}>Export CSV</button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">SRS Review</div>
        <div className="text-xs opacity-70">{idx+1} / {due.length}</div>
      </div>
      <div className="rounded border p-6 text-center">
        <div className="text-sm opacity-60 mb-2">Front</div>
        <div className="text-lg">{current.front}</div>
        {showBack ? (<><div className="h-px bg-gray-200 my-4" /><div className="text-sm opacity-60 mb-2">Back</div><div className="text-lg">{current.back}</div></>) : null}
      </div>
      <div className="flex gap-2">
        {!showBack ? (
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={()=>setShowBack(true)}>Показати відповідь</button>
        ) : (
          <>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('again')}>Again</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('hard')}>Hard</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('good')}>Good</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('easy')}>Easy</button>
          </>
        )}
        <button className="ml-auto px-3 py-1 rounded border text-sm" onClick={exportCSV}>Export CSV</button>
      </div>
    </div>
  );
}
TSX
)"
write_file "src/components/review/MicroTestReview.tsx" "$(cat <<'TSX'
import React, { useEffect, useMemo, useState } from 'react';

// Спрощена SR-система для ПИТАНЬ: застосовуємо Leitner-box до банку запитань.
type Choice = { id:string; text:string; correct?:boolean };
type QBase = { id:string; type:'mcq'|'multi'|'order'|'cloze'|'short'|'numeric'|'match'; stem:string;
  explanation?:string; outcomeId?:string; tags?:string[]; reference?:string; };
type QMCQ = QBase & { type:'mcq'; choices:Choice[] };
type QMulti = QBase & { type:'multi'; choices:Choice[] };
type QOrder = QBase & { type:'order'; items:string[] };
type QCloze = QBase & { type:'cloze'; textWithGaps:string; answers:string[] };
type QShort = QBase & { type:'short'; acceptableAnswers:string[] };
type QNumeric = QBase & { type:'numeric'; expected:number; tolerance?:number };
type QMatch = QBase & { type:'match'; pairs:{left:string; right:string}[] };
type Question = QMCQ|QMulti|QOrder|QCloze|QShort|QNumeric|QMatch;

type DeckItem = { id:string; box:number; nextDue:number };
type Rec = { id:string; correct:boolean };

const KEY = 'srs:questions';
const INTERVALS_DAYS = [0,1,2,4,8,16];

const BANK: Question[] = [
  { id: 'mt1', type: 'mcq', stem: 'Основне правило?', choices:[{id:'a',text:'A',correct:true},{id:'b',text:'B'}], explanation:'A — базове.' },
  { id: 'mt2', type: 'short', stem: 'Що таке X?', acceptableAnswers:['еталон'], explanation:'Відповідь повинна містити «еталон».' },
  { id: 'mt3', type: 'order', stem: 'Упорядкуйте кроки', items:['1','2','3'], explanation:'Як у прикладі.' },
];

function loadDeck(): DeckItem[] {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
  const now = Date.now();
  return BANK.map(q => ({ id:q.id, box:1, nextDue: now }));
}
function saveDeck(d: DeckItem[]) { localStorage.setItem(KEY, JSON.stringify(d)); }
function getQ(id:string): Question { return BANK.find(q => q.id===id)!; }

export default function MicroTestReview() {
  const [deck, setDeck] = useState<DeckItem[]>(loadDeck());
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Rec[]>([]);
  const now = Date.now();
  const due = useMemo(()=> deck.filter(d => d.nextDue <= now).slice(0,5), [deck, now]);
  const [idx, setIdx] = useState(0);
  useEffect(()=> saveDeck(deck), [deck]);

  const current = due[idx];
  const q = current ? getQ(current.id) : undefined;

  const check = (qq: Question, val: any): boolean => {
    switch(qq.type){
      case 'mcq': {
        const correct = (qq as QMCQ).choices.find(c=>c.correct)?.id;
        return val === correct;
      }
      case 'multi': {
        const chosen: string[] = (val||[]) as string[];
        const correctIds = (qq as QMulti).choices.filter(c=>c.correct).map(c=>c.id).sort().join('|');
        return chosen.slice().sort().join('|') === correctIds;
      }
      case 'order': return (val||[]).join('|') === (qq as QOrder).items.join('|');
      case 'cloze': {
        const vals: string[] = val||[];
        const exp = (qq as QCloze).answers;
        if (vals.length !== exp.length) return false;
        return vals.every((v,i)=>v.trim().toLowerCase()===exp[i].trim().toLowerCase());
      }
      case 'short': {
        const t = (val||'').toString().trim().toLowerCase();
        return (qq as QShort).acceptableAnswers.some(a=>t.includes(a.toLowerCase()));
      }
      case 'numeric': return Math.abs(Number(val)-(qq as QNumeric).expected) <= ((qq as QNumeric).tolerance??0);
      case 'match': {
        const map = val as Record<string,string>;
        return (qq as QMatch).pairs.every(p => (map?.[p.left]||'').toLowerCase()===p.right.toLowerCase());
      }
    }
  };

  const rate = (grade:'again'|'hard'|'good'|'easy') => {
    if (!q || !current) return;
    const ok = check(q, answers[q.id]);
    setRecords(r => [...r, { id:q.id, correct: ok }]);
    setDeck(d => d.map(it => {
      if (it.id !== q.id) return it;
      let box = it.box;
      if (grade==='again') box = Math.max(1, box-1);
      else if (grade==='hard') box = Math.max(1, box);
      else if (grade==='good') box = Math.min(5, box+1);
      else if (grade==='easy') box = Math.min(5, box+2);
      const days = INTERVALS_DAYS[box];
      return { ...it, box, nextDue: Date.now() + days*24*3600*1000 };
    }));
    setAnswers(a => { const { [q.id]:_, ...rest } = a; return rest; });
    setIdx(i => (i+1 < due.length ? i+1 : 0));
  };

  if (!q) {
    return (
      <div className="space-y-3">
        <div className="font-semibold">Review (Micro-tests)</div>
        <div className="rounded border p-3 text-sm">Сьогодні немає мікро-питань до повторення.</div>
      </div>
    );
  }

  const render = (qq: Question) => {
    switch(qq.type){
      case 'mcq':
        return (
          <div className="space-y-1">
            {(qq as QMCQ).choices.map(c=>(
              <label key={c.id} className="flex items-center gap-2">
                <input type="radio" name={qq.id} value={c.id}
                  checked={answers[qq.id]===c.id}
                  onChange={()=>setAnswers(a=>({ ...a, [qq.id]: c.id }))}/>
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        );
      case 'short':
        return <input className="border rounded px-2 py-1 w-full"
                      value={answers[qq.id]||''}
                      onChange={e=>setAnswers(a=>({ ...a, [qq.id]: e.target.value }))} />;
      case 'order': {
        const expected = (qq as QOrder).items;
        const cur: string[] = answers[qq.id] || expected.slice().reverse();
        if (!answers[qq.id]) setAnswers(a=>({ ...a, [qq.id]: cur }));
        const move = (i:number, dir:-1|1) => {
          const arr = [...cur]; const j=i+dir; if (j<0||j>=arr.length) return;
          [arr[i],arr[j]]=[arr[j],arr[i]]; setAnswers(a=>({ ...a, [qq.id]: arr }));
        };
        return (
          <ul className="text-sm">
            {cur.map((it, i)=>(
              <li key={i} className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-gray-100">{i+1}</span>
                <span className="flex-1">{it}</span>
                <button className="px-2 py-0.5 border rounded text-xs" onClick={()=>move(i,-1)}>↑</button>
                <button className="px-2 py-0.5 border rounded text-xs" onClick={()=>move(i, 1)}>↓</button>
              </li>
            ))}
          </ul>
        );
      }
      default:
        return <div className="text-xs opacity-70">Тип {qq.type} у мікро-тестах не продемонстровано (демо).</div>;
    }
  };

  const ok = check(q, answers[q.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Review (Micro-tests)</div>
        <div className="text-xs opacity-70">{idx+1} / {due.length}</div>
      </div>
      <div className="rounded border p-3">
        <div className="font-medium mb-2">{q.stem}</div>
        {render(q)}
      </div>
      {answers[q.id] !== undefined && (
        <div className={ok ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
          {ok ? 'Правильно' : (q.explanation ? `Неправильно — ${q.explanation}` : 'Неправильно')}
        </div>
      )}
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('again')}>Again</button>
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('hard')}>Hard</button>
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('good')}>Good</button>
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('easy')}>Easy</button>
      </div>
    </div>
  );
}
TSX
)"
write_file "src/pages/review/SRSPage.tsx" "$(cat <<'TSX'
import React from 'react';
import SRSReview from '../../components/review/SRSReview';
export default function SRSPage() { return (<div className="space-y-3"><SRSReview /></div>); }
TSX
)"
write_file "src/pages/review/MicroTestPage.tsx" "$(cat <<'TSX'
import React from 'react';
import MicroTestReview from '../../components/review/MicroTestReview';
export default function MicroTestPage() { return (<div className="space-y-3"><MicroTestReview /></div>); }
TSX
)"

# 11) AICourseGeneratorButton — тепер викликає generateCourseFactory + експорт
write_file "src/components/AICourseGeneratorButton.tsx" "$(cat <<'TSX'
import React, { useState } from 'react';
import { generateCourseFactory } from '../services/courseFactory';
import { downloadText } from '../utils/export';

export default function AICourseGeneratorButton() {
  const [topic, setTopic] = useState('');
  const [codingMode, setCodingMode] = useState<'auto'|'on'|'off'>('auto');
  const [mode, setMode] = useState<'text-heavy'|'practice-heavy'|'exam-prep'|'language-learning'>('text-heavy');
  const [log, setLog] = useState<string>('');
  const [syllabusJSON, setSyllabusJSON] = useState<string>('');

  const run = async () => {
    setLog('Generating course…');
    const res = await generateCourseFactory({ topic: topic || 'Untitled Course', coding_mode: codingMode, mode });
    setSyllabusJSON(JSON.stringify(res.syllabus, null, 2));
    setLog(res.statuses.join(' | '));
  };

  return (
    <div className="space-y-2 border rounded p-3">
      <div className="font-medium">Create Course (AI)</div>
      <input className="border rounded px-2 py-1 w-full" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
      <div className="flex gap-2 flex-wrap">
        <label className="text-sm">Coding:
          <select className="border rounded ml-1" value={codingMode} onChange={e=>setCodingMode(e.target.value as any)}>
            <option value="auto">auto</option><option value="on">on</option><option value="off">off</option>
          </select>
        </label>
        <label className="text-sm">Mode:
          <select className="border rounded ml-1" value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="text-heavy">text-heavy</option>
            <option value="practice-heavy">practice-heavy</option>
            <option value="exam-prep">exam-prep</option>
            <option value="language-learning">language-learning</option>
          </select>
        </label>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={run}>Generate</button>
        {syllabusJSON && <button className="px-3 py-1 rounded border text-sm" onClick={()=>downloadText('syllabus.json', syllabusJSON, 'application/json')}>Export JSON</button>}
      </div>
      {log && <div className="text-xs opacity-70">{log}</div>}
      {syllabusJSON && <pre className="text-xs rounded border p-2 max-h-64 overflow-auto">{syllabusJSON}</pre>}
    </div>
  );
}
TSX
)"

# 12) CourseGenerator — додаємо QA-звіт і Export CSV питань
write_file "src/components/CourseGenerator.tsx" "$(cat <<'TSX'
import React, { useMemo, useState } from 'react';
import { generateCourseFactory } from '../services/courseFactory';
import { Syllabus } from '../schemas/course';
import { readabilityMetrics, renderMinimalMd } from '../utils/text';
import { downloadText, exportQuestionsCSV } from '../utils/export';

type LOCov = { [lo: string]: { practice: number; quiz: number } };

type QA = {
  lessonChecks: Array<{ path:string; worked:number; guided:number; independent:number; quiz:number; ok:boolean }>;
  summary: { totalLessons:number; passLessons:number };
};

function evaluateQA(s: Syllabus): QA {
  const checks: QA['lessonChecks'] = [];
  s.modules.forEach((m, mi) => m.lessons.forEach((l, li) => {
    let worked=0, guided=0, independent=0, quiz=0;
    l.blocks.forEach((b:any) => {
      if (b.type==='worked_example') worked++;
      if (b.type==='guided_practice') guided += (b.items?.length||0);
      if (b.type==='independent_practice') independent += (b.items?.length||0);
      if (b.type==='checkpoint_quiz') quiz += (b.items?.length||0);
    }));
    const ok = (worked>=1) && (guided>=3) && (independent>=6) && (quiz>=5);
    checks.push({ path:`M${mi+1}.L${li+1} ${l.title}`, worked, guided, independent, quiz, ok });
  }));
  return { lessonChecks: checks, summary: { totalLessons: checks.length, passLessons: checks.filter(c=>c.ok).length } };
}

export default function CourseGenerator() {
  const [topic, setTopic] = useState('');
  const [codingMode, setCodingMode] = useState<'auto'|'on'|'off'>('auto');
  const [mode, setMode] = useState<'text-heavy'|'practice-heavy'|'exam-prep'|'language-learning'>('text-heavy');
  const [statuses, setStatuses] = useState<string[]>([]);
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null);
  const [readability, setReadability] = useState<{sentences:number; words:number; avgSentenceLen:number}|null>(null);
  const [qa, setQa] = useState<QA | null>(null);

  const run = async () => {
    const res = await generateCourseFactory({ topic: topic || 'Untitled', coding_mode: codingMode, mode });
    setStatuses(res.statuses);
    setSyllabus(res.syllabus);
    try {
      const first = res.syllabus.modules[0].lessons[0].blocks.find((b:any)=>b.type==='core_text');
      if (first) setReadability(readabilityMetrics(first.contentMd || ''));
    } catch {}
    setQa(evaluateQA(res.syllabus));
  };

  const coverage: LOCov | null = useMemo(() => {
    if (!syllabus) return null;
    const map: LOCov = {};
    syllabus.modules.forEach(m => m.lessons.forEach(l => {
      l.outcomes.forEach(o => { map[o] ??= { practice: 0, quiz: 0 }; });
      l.blocks.forEach((b:any) => {
        if (b.type==='guided_practice' || b.type==='independent_practice') {
          b.items.forEach((it:any)=> { if (it.outcomeId && map[it.outcomeId]) map[it.outcomeId].practice += 1; });
        } else if (b.type==='checkpoint_quiz') {
          b.items.forEach((q:any)=> { if (q.outcomeId && map[q.outcomeId]) map[q.outcomeId].quiz += 1; });
        }
      });
    }));
    return map;
  }, [syllabus]);

  const exportJSON = () => { if (syllabus) downloadText('syllabus.json', JSON.stringify(syllabus, null, 2), 'application/json'); };
  const exportHTML = () => {
    if (!syllabus) return;
    const parts: string[] = [];
    parts.push(`<html><head><meta charset="utf-8"><title>${syllabus.title}</title><style>body{font-family:system-ui,sans-serif;line-height:1.5} h1,h2,h3{margin-top:1.2em} .card{border:1px solid #ddd;border-radius:8px;padding:12px;margin:10px 0}</style></head><body>`);
    parts.push(`<h1>${syllabus.title}</h1><p><strong>Audience:</strong> ${syllabus.audience}; <strong>Level:</strong> ${syllabus.level}</p>`);
    syllabus.modules.forEach((m,i) => {
      parts.push(`<h2>Module ${i+1}: ${m.title}</h2><p>${m.overview}</p><div class="card"><strong>Learning outcomes:</strong><ul>${m.learning_outcomes.map(x=>`<li>${x}</li>`).join('')}</ul></div>`);
      m.lessons.forEach((l,j) => {
        parts.push(`<h3>Lesson ${i+1}.${j+1}: ${l.title}</h3>`);
        l.blocks.forEach((b:any) => {
          if (b.type==='core_text') parts.push(`<div class="card">${renderMinimalMd(b.contentMd)}</div>`);
          if (b.type==='worked_example') parts.push(`<div class="card">${renderMinimalMd(b.contentMd)}</div>`);
          if (b.type==='guided_practice') parts.push(`<div class="card"><strong>Guided Practice</strong><ol>${b.items.map((it:any)=>`<li>${it.prompt}</li>`).join('')}</ol></div>`);
          if (b.type==='independent_practice') parts.push(`<div class="card"><strong>Independent Practice</strong><ol>${b.items.map((it:any)=>`<li>${it.prompt}</li>`).join('')}</ol></div>`);
          if (b.type==='checkpoint_quiz') parts.push(`<div class="card"><strong>Checkpoint Quiz</strong><ol>${b.items.map((q:any)=>`<li>${q.stem}</li>`).join('')}</ol></div>`);
          if (b.type==='summary') parts.push(`<div class="card"><strong>Summary</strong><ul>${b.bullets.map((x:string)=>`<li>${x}</li>`).join('')}</ul></div>`);
          if (b.type==='flashcards') parts.push(`<div class="card"><strong>Flashcards:</strong> ${b.cards.length}</div>`);
          if (b.type==='code_practice') parts.push(`<div class="card"><strong>Code Practice:</strong> ${b.language}</div>`);
        });
      });
    });
    parts.push(`</body></html>`);
    downloadText('syllabus.html', parts.join('\n'), 'text/html;charset=utf-8');
  };
  const exportAllQuestionsCSV = () => {
    if (!syllabus) return;
    const all:any[] = [];
    syllabus.modules.forEach(m => {
      m.lessons.forEach(l => {
        l.blocks.forEach((b:any) => { if (b.type==='checkpoint_quiz') all.push(...b.items); });
      });
      if (m.test_bank) all.push(...m.test_bank);
    });
    exportQuestionsCSV(all, 'syllabus_questions.csv');
  };

  return (
    <div className="space-y-3">
      <div className="font-semibold">Create Course — Generator</div>
      <div className="flex gap-2 flex-wrap">
        <input className="border rounded px-2 py-1 flex-1" placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
        <select className="border rounded px-2" value={codingMode} onChange={e=>setCodingMode(e.target.value as any)}>
          <option value="auto">coding: auto</option><option value="on">coding: on</option><option value="off">coding: off</option>
        </select>
        <select className="border rounded px-2" value={mode} onChange={e=>setMode(e.target.value as any)}>
          <option value="text-heavy">text-heavy</option>
          <option value="practice-heavy">practice-heavy</option>
          <option value="exam-prep">exam-prep</option>
          <option value="language-learning">language-learning</option>
        </select>
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={run}>Generate</button>
      </div>

      {statuses.length>0 && (
        <div className="rounded border p-2 text-xs">
          <div className="font-medium mb-1">Pipeline:</div>
          <ul className="list-disc pl-5">{statuses.map((s,i)=><li key={i}>{s}</li>)}</ul>
        </div>
      )}

      {readability && (
        <div className="rounded border p-2 text-xs">
          <div className="font-medium mb-1">Readability (грубо)</div>
          <div>Sentences: {readability.sentences}; Words: {readability.words}; Avg sentence: {readability.avgSentenceLen.toFixed(1)}</div>
          <div className="opacity-70">Ціль: &lt; 22 слів/речення.</div>
        </div>
      )}

      {qa && (
        <div className="rounded border p-2 text-xs">
          <div className="font-medium mb-1">QA — мінімальні вимоги на урок</div>
          <div className="mb-1">Worked ≥1, Guided ≥3, Independent ≥6, Quiz ≥5</div>
          <ul className="list-disc pl-5">
            {qa.lessonChecks.map(c => (
              <li key={c.path}>
                <span className={c.ok?'text-green-700':'text-red-700'}>{c.ok ? 'OK' : 'FIX'}</span> — {c.path}
                <span className="opacity-70"> (worked {c.worked}, guided {c.guided}, independent {c.independent}, quiz {c.quiz})</span>
              </li>
            ))}
          </ul>
          <div className="mt-1">Passed lessons: {qa.summary.passLessons}/{qa.summary.totalLessons}</div>
        </div>
      )}

      {syllabus && (
        <>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 rounded border text-sm" onClick={exportJSON}>Export JSON</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={exportHTML}>Export HTML</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={exportAllQuestionsCSV}>Export CSV (all questions)</button>
          </div>
          <pre className="rounded border p-2 text-xs overflow-auto max-h-96">
{JSON.stringify(syllabus, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
TSX
)"

# 13) QuizMode/QuizResults (тонкі — без змін)
write_file "src/components/QuizMode.tsx" "$(cat <<'TSX'
import React from 'react';
import AssessmentEngine from './assessment/AssessmentEngine';
export default function QuizMode() { return (<div className="space-y-3"><div className="font-semibold">Quiz (Start Learning)</div><AssessmentEngine /></div>); }
TSX
)"
write_file "src/components/QuizResults.tsx" "$(cat <<'TSX'
import React from 'react';
export default function QuizResults() {
  return (
    <div className="rounded border p-3">
      <div className="font-medium mb-1">Результати</div>
      <div className="text-sm opacity-80">Аналітика відображається у Start Learning після завершення сесії (по тегах і LO).</div>
    </div>
  );
}
TSX
)"

# 14) CoursePlayer (простий контейнер)
write_file "src/components/CoursePlayer.tsx" "$(cat <<'TSX'
import React from 'react';
import CourseOverview from '../pages/course/CourseOverview';
export default function CoursePlayer(){ return <CourseOverview />; }
TSX
)"

# 15) README_ROUTE_HINT — додаємо маршрут мікро-тестів
write_file "README_ROUTE_HINT.md" "$(cat <<'MD'
# Router hint (react-router-dom)

Додайте 4 маршрути:

```tsx
import { useParams } from 'react-router-dom';
import CourseOverview from './src/pages/course/CourseOverview';
import CourseItemRenderer from './src/components/course/CourseItemRenderer';
import SRSPage from './src/pages/review/SRSPage';
import MicroTestPage from './src/pages/review/MicroTestPage';
import { loadCourse, flattenItems } from './src/store/course';

<Route path="/course/:id" element={<CourseOverview />} />
<Route path="/course/:id/lesson/:itemId" element={<LessonWrapper />} />
<Route path="/review" element={<SRSPage />} />
<Route path="/review/micro" element={<MicroTestPage />} />

function LessonWrapper() {
  const course = loadCourse();
  const items = flattenItems(course);
  const { itemId } = useParams();
  const item = items.find(i => i.id === itemId)!;
  return <CourseItemRenderer course={course} item={item} />;
}
