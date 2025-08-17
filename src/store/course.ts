// Minimal course store: types, sample data, local progress & deadlines
export type ItemType = 'video' | 'reading' | 'quiz' | 'lab' | 'peer';

export interface CourseItem {
  id: string;
  type: ItemType;
  title: string;
  durationMin?: number;
  content?: string;       // reading text or quiz id ref
  videoUrl?: string;
  dueAt?: string;         // ISO string (soft deadline)
}

export interface CourseModule {
  id: string;
  title: string;
  items: CourseItem[];
}

export interface CourseWeek {
  id: string;
  title: string;
  modules: CourseModule[];
}

export interface Course {
  id: string;
  title: string;
  weeks: CourseWeek[];
  deadlinesOn: boolean;
  timezone?: string;
  softScheduleStart?: string;
}

export interface ItemProgress {
  done: boolean;
  attempts?: number;
  score?: number;
  lastVisited?: string;
}

type ProgressMap = Record<string, ItemProgress>;

const PROGRESS_KEY = (courseId: string) => `COURSE_PROGRESS_${courseId}`;
const SCHEDULE_BASE_KEY = (courseId: string) => `COURSE_SCHEDULE_BASE_${courseId}`;

function getScheduleBase(courseId: string): string {
  let base = localStorage.getItem(SCHEDULE_BASE_KEY(courseId));
  if (!base) {
    base = new Date().toISOString();
    localStorage.setItem(SCHEDULE_BASE_KEY(courseId), base);
  }
  return base;
}

export function loadCourse(): Course {
  // Sample deterministic on first run (can be replaced by API later).
  // All due dates are computed relative to a persistent baseline (soft schedule start).
  const courseId = 'sample-course';
  const baseISO = getScheduleBase(courseId);
  const sample: Course = {
    id: courseId,
    title: 'AI Fundamentals — Full Edition',
    deadlinesOn: true,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    softScheduleStart: baseISO,
    weeks: [
      {
        id: 'w1',
        title: 'Week 1 — Foundations',
        modules: [
          {
            id: 'm1',
            title: 'Intro & Basics',
            items: [
              { id: 'i1', type: 'video', title: 'Welcome & Orientation', videoUrl: '', durationMin: 6, dueAt: isoShiftFrom(baseISO, 2) },
              { id: 'i2', type: 'reading', title: 'What is a Model?', content: demoReading(), durationMin: 8, dueAt: isoShiftFrom(baseISO, 3) },
              { id: 'i3', type: 'quiz', title: 'Foundations Quiz', content: 'foundations-quiz', durationMin: 10, dueAt: isoShiftFrom(baseISO, 4) },
            ],
          },
        ],
      },
      {
        id: 'w2',
        title: 'Week 2 — Practice',
        modules: [
          {
            id: 'm2',
            title: 'Hands-on',
            items: [
              { id: 'i4', type: 'reading', title: 'Prompt Patterns', content: demoReading2(), durationMin: 10, dueAt: isoShiftFrom(baseISO, 7) },
              { id: 'i5', type: 'lab', title: 'Mini Lab: Evaluate Prompts', durationMin: 15, dueAt: isoShiftFrom(baseISO, 9) },
            ],
          },
        ],
      },
    ],
  };
  return sample;
}

function isoShiftFrom(baseISO: string, days: number) {
  const d = new Date(baseISO);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

function demoReading() {
  return `You'll get a Coursera-like flow without cloning UI.
Focus: structure → practice → assessment. Deadlines are soft (you can reset schedule).`;
}
function demoReading2() {
  return `Prompt patterns: role, constraints, examples, evaluation.
Try: outline → draft → critique → revise.`;
}

export function getProgress(courseId: string): ProgressMap {
  const raw = localStorage.getItem(PROGRESS_KEY(courseId));
  return raw ? JSON.parse(raw) : {};
}

export function setProgress(courseId: string, map: ProgressMap) {
  localStorage.setItem(PROGRESS_KEY(courseId), JSON.stringify(map));
}

export function markVisited(courseId: string, itemId: string, patch: Partial<ItemProgress> = {}) {
  const map = getProgress(courseId);
  map[itemId] = { lastVisited: new Date().toISOString(), done: map[itemId]?.done ?? false, ...map[itemId], ...patch };
  setProgress(courseId, map);
}

export function toggleDone(courseId: string, itemId: string, done = true) {
  markVisited(courseId, itemId, { done });
}

export function flattenItems(course: Course): CourseItem[] {
  return course.weeks.flatMap(w => w.modules.flatMap(m => m.items));
}

export function nextItem(course: Course, currentId?: string): CourseItem | undefined {
  const items = flattenItems(course);
  if (!currentId) return items[0];
  const idx = items.findIndex(i => i.id === currentId);
  return idx >= 0 && idx + 1 < items.length ? items[idx + 1] : undefined;
}

export function getDeadlines(course: Course) {
  const now = new Date();
  const items = flattenItems(course).filter(i => !!i.dueAt);
  const overdue = items.filter(i => new Date(i.dueAt!) < now);
  const upcoming = items.filter(i => new Date(i.dueAt!) >= now);
  return { overdue, upcoming };
}

export function resetSoftSchedule(courseId: string) {
  localStorage.setItem(SCHEDULE_BASE_KEY(courseId), new Date().toISOString());
}
