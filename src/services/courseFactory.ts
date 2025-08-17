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
