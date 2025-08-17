import CourseShell from '../../layouts/CourseShell';
import LeftNav from '../../components/course/LeftNav';
import RightSidebar from '../../components/course/RightSidebar';
import { loadCourse, flattenItems } from '../../store/course';
import { Link } from 'react-router-dom';

export default function CourseOverview() {
  const course = loadCourse();
  const first = flattenItems(course)[0];
  return (
    <CourseShell title={course.title} left={<LeftNav course={course} />} right={<RightSidebar course={course} />}>
      <section className="rounded-lg bg-card p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Overview</h2>
        <p className="text-sm text-muted-foreground mb-3">
          Follow a structured, Coursera-inspired flow with soft deadlines, but a fully original interface.
        </p>
        {first && (
          <Link to={`/course/${course.id}/lesson/${first.id}`} className="px-3 py-2 rounded bg-primary text-white text-sm">
            Start / Resume
          </Link>
        )}
      </section>
      <section className="rounded-lg bg-card p-4 shadow-sm">
        <h3 className="font-medium mb-2">Syllabus</h3>
        <ul className="space-y-2">
          {course.weeks.map(w => (
            <li key={w.id}>
              <div className="font-semibold">{w.title}</div>
              <ul className="ml-2 mt-1 space-y-1">
                {w.modules.map(m => (
                  <li key={m.id} className="text-sm">{m.title} — {m.items.length} items</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </CourseShell>
  );
}
