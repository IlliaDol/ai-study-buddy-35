// Minimal course store: types, sample data, local progress & deadlines
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
