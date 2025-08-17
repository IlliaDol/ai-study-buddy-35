import type { Course } from '../../store/course';
import { getDeadlines, nextItem, getProgress, resetSoftSchedule, flattenItems } from '../../store/course';
import { exportDeadlinesToICS } from '../../utils/ics';
import { t } from '../../i18n';
import { Link } from 'react-router-dom';

export default function RightSidebar({ course }: { course: Course }) {
  const { overdue, upcoming } = getDeadlines(course);
  const progress = getProgress(course.id);
  const base = `/course/${course.id}`;
  // First not-done item, otherwise fall back to first:
  const all = flattenItems(course);
  const next = all.find(i => !progress[i.id]?.done) ?? all[0];

  return (
    <div className="space-y-4">
      <section className="rounded-lg bg-card p-3 shadow-sm">
        <header className="font-semibold mb-2">{t('timeline')}</header>
        <div className="text-sm mb-2">
          <span className="mr-3">Overdue: <b>{overdue.length}</b></span>
          <span>Upcoming: <b>{upcoming.length}</b></span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => exportDeadlinesToICS(course)} className="px-2 py-1 rounded bg-primary text-white text-sm">
            {t('export_ics')}
          </button>
          <button
            onClick={() => { 
              resetSoftSchedule(course.id);
              alert('Schedule reset. Deadlines moved forward from now.');
              // force recompute on next load:
              location.reload();
            }}
            className="px-2 py-1 rounded border text-sm"
          >
            {t('reset_schedule')}
          </button>
        </div>
      </section>
      {next && (
        <section className="rounded-lg bg-card p-3 shadow-sm">
          <header className="font-semibold mb-2">{t('next_up')}</header>
          <div className="text-sm mb-2">{next.title}</div>
          <Link to={`${base}/lesson/${next.id}`} className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm">
            Continue
          </Link>
        </section>
      )}
      <section className="rounded-lg bg-card p-3 shadow-sm">
        <header className="font-semibold mb-2">What's after this?</header>
        <p className="text-sm text-muted-foreground">Keep a steady pace. Deadlines are soft — you can reschedule anytime.</p>
      </section>
    </div>
  );
}
