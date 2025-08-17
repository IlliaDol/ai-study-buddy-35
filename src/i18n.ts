// Minimal i18n stub (en/uk) – extend later
export type Lang = 'en' | 'uk';
let current: Lang = (localStorage.getItem('LANG') as Lang) || 'en';
export function setLang(l: Lang) { current = l; localStorage.setItem('LANG', l); }
export function t(key: string): string { return (dict[current][key] ?? key) as string; }

const dict: Record<Lang, Record<string,string>> = {
  en: {
    'overview': 'Overview',
    'discussions': 'Discussions',
    'grades': 'Grades',
    'timeline': 'Timeline & Deadlines',
    'export_ics': 'Export .ics',
    'reset_schedule': 'Reset schedule',
    'next_up': 'Next up',
    'start_resume': 'Start / Resume',
    'mark_done': 'Mark as done',
    'next': 'Next',
  },
  uk: {
    'overview': 'Огляд',
    'discussions': 'Обговорення',
    'grades': 'Оцінки',
    'timeline': 'Дедлайни та таймлайн',
    'export_ics': 'Експорт .ics',
    'reset_schedule': 'Скинути графік',
    'next_up': 'Далі',
    'start_resume': 'Почати / Продовжити',
    'mark_done': 'Позначити виконаним',
    'next': 'Далі',
  },
};
