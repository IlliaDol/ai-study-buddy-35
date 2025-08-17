import type { Course, CourseItem } from '../store/course';

function icsEscape(s: string) {
  return s.replace(/,/g, '\\,').replace(/;/g, '\\;').replace(/\n/g, '\\n');
}

function fmt(dt: string) {
  // Basic UTC format YYYYMMDDTHHMMSSZ
  const d = new Date(dt);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth()+1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

export function exportDeadlinesToICS(course: Course) {
  const items: CourseItem[] = course.weeks.flatMap(w => w.modules.flatMap(m => m.items));
  const events = items
    .filter(i => i.dueAt)
    .map(i => [
      'BEGIN:VEVENT',
      `UID:${course.id}-${i.id}@ai-study`,
      `DTSTAMP:${fmt(new Date().toISOString())}`,
      `DTSTART:${fmt(i.dueAt!)}`,
      `DTEND:${fmt(new Date(new Date(i.dueAt!).getTime() + 30*60*1000).toISOString())}`,
      `SUMMARY:${icsEscape(`${course.title}: ${i.title}`)}`,
      `DESCRIPTION:${icsEscape(`Type: ${i.type} • Soft deadline`)}`,
      'END:VEVENT',
    ].join('\r\n')).join('\r\n');

  const body = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ai-study//course//EN',
    'CALSCALE:GREGORIAN',
    events,
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${course.id}-deadlines.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
