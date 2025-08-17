import { useState } from 'react';
import CourseShell from '../../layouts/CourseShell';
import LeftNav from '../../components/course/LeftNav';
import RightSidebar from '../../components/course/RightSidebar';
import { loadCourse } from '../../store/course';

type Thread = { id: string; title: string; body: string };

export default function CourseDiscussions() {
  const course = loadCourse();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [title, setTitle] = useState(''); const [body, setBody] = useState('');

  const add = () => {
    if (!title.trim()) return;
    setThreads([{ id: crypto.randomUUID(), title, body }, ...threads]);
    setTitle(''); setBody('');
  };

  return (
    <CourseShell title={course.title} left={<LeftNav course={course} />} right={<RightSidebar course={course} />}>
      <section className="rounded-lg bg-card p-4 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Discussions</h2>
        <div className="space-y-2 mb-4">
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Thread title" className="w-full border rounded px-2 py-1"/>
          <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Question / context" className="w-full border rounded px-2 py-2 min-h-[120px]"/>
          <button onClick={add} className="px-3 py-1.5 rounded bg-primary text-white text-sm">Post</button>
        </div>
        <ul className="space-y-2">
          {threads.length === 0 && <li className="text-sm text-muted-foreground">No threads yet. Be the first to ask!</li>}
          {threads.map(t => (
            <li key={t.id} className="border rounded p-2">
              <div className="font-medium">{t.title}</div>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">{t.body}</div>
            </li>
          ))}
        </ul>
      </section>
    </CourseShell>
  );
}
