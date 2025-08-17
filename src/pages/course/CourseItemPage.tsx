import { useParams } from 'react-router-dom';
import CourseShell from '../../layouts/CourseShell';
import LeftNav from '../../components/course/LeftNav';
import RightSidebar from '../../components/course/RightSidebar';
import CourseItemRenderer from '../../components/course/CourseItemRenderer';
import { loadCourse, flattenItems } from '../../store/course';

export default function CourseItemPage() {
  const course = loadCourse();
  const { itemId } = useParams();
  const item = flattenItems(course).find(i => i.id === itemId);
  if (!item) return <div className="container p-6">Item not found</div>;
  return (
    <CourseShell title={course.title} left={<LeftNav course={course} />} right={<RightSidebar course={course} />}>
      <CourseItemRenderer course={course} item={item} />
    </CourseShell>
  );
}
