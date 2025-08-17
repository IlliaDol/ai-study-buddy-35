import { Link, NavLink, useParams } from 'react-router-dom';
import type { Course } from '../../store/course';
import { getProgress, flattenItems } from '../../store/course';

export default function LeftNav({ course }: { course: Course }) {
  const { id } = useParams();
  const progress = getProgress(course.id);
  const items = flattenItems(course);
  const doneCount = items.filter(i => progress[i.id]?.done).length;

  const base = `/course/${course.id}`;

  return (
    <nav aria-label="Course content" className="rounded-lg bg-card p-3 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">{course.title}</div>
        <div className="text-xs text-muted-foreground">{doneCount}/{items.length}</div>
      </div>
      <ul className="space-y-1 mb-3">
        <li><NavItem to={base} label="Overview" /></li>
        <li><NavItem to={`${base}/discussions`} label="Discussions" /></li>
        <li><NavItem to={`${base}/grades`} label="Grades" /></li>
      </ul>
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Weeks & Modules</div>
      <ul className="space-y-2">
        {course.weeks.map(w => (
          <li key={w.id} className="border rounded-md">
            <div className="px-2 py-1.5 font-medium">{w.title}</div>
            <div className="px-2 pb-2 space-y-2">
              {w.modules.map(m => (
                <div key={m.id}>
                  <div className="text-sm font-medium">{m.title}</div>
                  <ul className="mt-1 space-y-1">
                    {m.items.map(it => {
                      const done = progress[it.id]?.done;
                      return (
                        <li key={it.id}>
                          <Link to={`${base}/lesson/${it.id}`} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted focus:bg-muted focus:outline-none">
                            <span className={`min-w-2 h-2 rounded-full ${done ? 'bg-emerald-500' : 'bg-slate-300'}`} aria-hidden />
                            <span className="truncate text-sm">{it.title}</span>
                            <span className="ml-auto text-[11px] opacity-70">{it.type}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `block px-2 py-1.5 rounded text-sm ${isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`
      }
    >
      {label}
    </NavLink>
  );
}
