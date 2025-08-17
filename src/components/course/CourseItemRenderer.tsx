import { useMemo, useState, useRef, useEffect } from 'react';
import type { Course, CourseItem } from '../../store/course';
import { nextItem, toggleDone, markVisited } from '../../store/course';
import { Link } from 'react-router-dom';

export default function CourseItemRenderer({ course, item }: { course: Course; item: CourseItem }) {
  const [speed, setSpeed] = useState(1);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const next = useMemo(() => nextItem(course, item.id), [course, item.id]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed]);

  // mark visit
  markVisited(course.id, item.id);

  return (
    <div className="space-y-4">
      <header className="rounded-lg bg-card p-3 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <span className="text-xs opacity-70">{item.type}</span>
        </div>
      </header>

      {item.type === 'video' && (
        <section className="rounded-lg bg-card p-3 shadow-sm">
          <video ref={videoRef} className="w-full rounded" src={item.videoUrl || ''} controls playsInline />
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span>Speed</span>
            <select 
              value={speed} 
              onChange={(e) => setSpeed(Number(e.target.value))} 
              className="border rounded px-2 py-1"
              aria-label="Video playback speed"
            >
              {[0.75, 1, 1.25, 1.5, 1.75, 2].map(v => <option key={v} value={v}>{v}x</option>)}
            </select>
          </div>
        </section>
      )}

      {item.type === 'reading' && (
        <section className="rounded-lg bg-card p-3 shadow-sm whitespace-pre-wrap leading-relaxed">
          {item.content}
        </section>
      )}

      {item.type === 'quiz' && (
        <section className="rounded-lg bg-card p-3 shadow-sm">
          <p className="text-sm mb-2">This launches the quiz generator for this module.</p>
          <Link to="/quiz" className="px-3 py-1.5 rounded bg-primary text-white text-sm">Start Quiz</Link>
        </section>
      )}

      {item.type === 'lab' && (
        <section className="rounded-lg bg-card p-3 shadow-sm">
          <p className="text-sm mb-2">Browser lab (IDE) placeholder. You can attach your runner later.</p>
          <button className="px-3 py-1.5 rounded border text-sm" disabled>Open Lab</button>
        </section>
      )}

      <footer className="flex items-center justify-between">
        <button
          onClick={() => toggleDone(course.id, item.id, true)}
          className="px-3 py-1.5 rounded bg-emerald-600 text-white text-sm"
        >
          Mark as done
        </button>
        {next ? (
          <Link to={`/course/${course.id}/lesson/${next.id}`} className="px-3 py-1.5 rounded bg-primary text-white text-sm">
            Next →
          </Link>
        ) : (
          <Link to={`/course/${course.id}`} className="px-3 py-1.5 rounded border text-sm">Back to overview</Link>
        )}
      </footer>
    </div>
  );
}
