import CourseShell from '../../layouts/CourseShell';
import LeftNav from '../../components/course/LeftNav';
import RightSidebar from '../../components/course/RightSidebar';
import { loadCourse, flattenItems, getProgress } from '../../store/course';

export default function CourseGrades() {
  const course = loadCourse();
  const items = flattenItems(course);
  const progress = getProgress(course.id);
  return (
    <CourseShell title={course.title} left={<LeftNav course={course} />} right={<RightSidebar course={course} />}>
      <section className="rounded-lg bg-card p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Grades</h2>
        <div className="overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2">Item</th>
                <th className="py-2">Type</th>
                <th className="py-2">Status</th>
                <th className="py-2">Score</th>
              </tr>
            </thead>
            <tbody>
              {items.map(it => {
                const pr = progress[it.id];
                return (
                  <tr key={it.id} className="border-b">
                    <td className="py-2">{it.title}</td>
                    <td className="py-2">{it.type}</td>
                    <td className="py-2">{pr?.done ? 'Done' : 'Pending'}</td>
                    <td className="py-2">{pr?.score ?? '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </CourseShell>
  );
}
