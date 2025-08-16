import { Syllabus, SyllabusSchema, Lesson, RubricResult, Level } from "../schemas/course";

export type Intake = {
  topic: string;
  language: string; // e.g., 'uk', 'en'
  level: Level; // union inferred from enum
  goals?: string[];
};

export type PipelineResult = {
  statuses: string[];
  syllabus: Syllabus;
  rubric?: RubricResult;
};

// Minimal stub that simulates a 7-step pipeline and returns a valid syllabus
export async function generateCourseFactory(intake: Intake): Promise<PipelineResult> {
  const statuses: string[] = [];

  // 1) Intake
  statuses.push("Intake: нормалізую запит…");

  const language = intake.language || "uk";
  const level = intake.level || "beginner";
  const goals = intake.goals && intake.goals.length ? intake.goals : [
    "Сформувати базове розуміння теми",
    "Навчитися застосовувати знання на практиці",
    "Підготуватися до наступного рівня",
  ];

  // 2) Planner (stub)
  statuses.push("Planner: будую силлабус та граф знань…");

  const syllabusDraft: Syllabus = {
    title: `${intake.topic} — базовий курс`,
    language,
    level,
    goals,
    modules: [
      {
        title: "Модуль 1. Основи",
        outcomes: [
          "Пояснити ключові поняття (Remember)",
          "Використовувати базові інструменти (Apply)",
        ],
        prerequisites: [],
        lessons: [
          {
            id: "lesson-1",
            title: "Вступ та базові терміни",
            outcomes: [
              "Розуміти ключові терміни",
              "Вміти наводити приклади використання",
            ],
            theory: [
              "Короткий огляд теми та її застосувань.",
            ],
            examples: [
              "Приклад 1: простий реальний сценарій.",
            ],
            exercises: [
              {
                type: "mcq",
                stem: "Що з наведеного є ключовим терміном?",
                options: ["Термін A", "Термін B", "Термін C"],
                answer: "Термін A",
              },
            ],
            references: [
              {
                title: "Енциклопедія з теми",
                url: "https://example.com/ref",
                citation: "Author, Title (Year)",
              },
            ],
          },
        ],
      },
    ],
  };

  // 3) Retriever (stubbed references already in lesson)
  statuses.push("Retriever: підбираю джерела та роблю нотатки…");

  // 4) Writer (already provided a minimal lesson structure)
  statuses.push("Writer: генерую уроки, приклади та вправи…");

  // 5) Critic (stub): optimistic rubric
  statuses.push("Critic: перевіряю за рубриками якості…");
  const rubric: RubricResult = {
    factuality: 4.2,
    clarity: 4.3,
    level_fit: 4.0,
    examples: 4.0,
    localization: 4.5,
    must_fix: [],
  };

  // Validate by schema; if invalid, throw with issues for visibility
  const parsed = SyllabusSchema.safeParse(syllabusDraft);
  if (!parsed.success) {
    const issues = parsed.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join('; ');
    throw new Error(`Syllabus validation failed: ${issues}`);
  }

  // 6) Assessment Builder (included a simple MCQ in lesson)
  statuses.push("Assessment: будую базові тести…");

  // 7) Personalizer (stub)
  statuses.push("Personalizer: готую адаптацію під рівень та історію…");

  return {
    statuses,
    syllabus: parsed.data,
    rubric,
  };
}
