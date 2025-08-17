import React, { useEffect, useMemo, useState } from 'react';
import { exportQuestionsCSV } from '../../utils/export';

type Mode = 'practice'|'adaptive'|'exam';

type QBase = {
  id: string;
  type: 'mcq'|'multi'|'match'|'order'|'cloze'|'short'|'numeric'|'case';
  stem: string;
  explanation?: string;
  tags?: string[];
  outcomeId?: string;
  reference?: string;
};
type Choice = { id:string; text:string; correct?:boolean };

type QMCQ   = QBase & { type: 'mcq';   choices: Choice[] };
type QMulti = QBase & { type: 'multi'; choices: Choice[] };
type QMatch = QBase & { type: 'match'; pairs: {left:string; right:string}[] };
type QOrder = QBase & { type: 'order'; items: string[] };
type QCloze = QBase & { type: 'cloze'; textWithGaps: string; answers: string[] };
type QShort = QBase & { type: 'short'; acceptableAnswers: string[] };
type QNumeric = QBase & { type: 'numeric'; expected: number; tolerance?: number; units?: string };
type QCase = QBase & { type: 'case'; context: string; subQuestions: (QMCQ|QMulti|QMatch|QOrder|QCloze|QShort|QNumeric)[] };

type Question = QMCQ | QMulti | QMatch | QOrder | QCloze | QShort | QNumeric | QCase;

function shuffle<T>(arr: T[]) { const a = [...arr]; for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }

const BANK: Question[] = [
  { id: 'q1', type: 'mcq', stem: 'Що з наведеного є основною ідеєю?',
    choices: [{id:'a',text:'Ідея A',correct:true},{id:'b',text:'Ідея B'},{id:'c',text:'Ідея C'}],
    explanation: 'Ідея A — базова.', tags: ['concepts'], outcomeId:'LO1', reference:'Ключові ідеї' },
  { id: 'q2', type: 'multi', stem: 'Позначте всі правильні твердження',
    choices: [{id:'a',text:'Так',correct:true},{id:'b',text:'Ні'},{id:'c',text:'Можливо',correct:true}],
    explanation: 'Правильні: Так і Можливо.', tags:['understanding'], outcomeId:'LO1' },
  { id: 'q3', type: 'match', stem: 'Зіставте терміни й визначення',
    pairs: [{ left: 'HTML', right: 'розмітка' },{ left: 'CSS',  right: 'стилі' },{ left: 'JS',   right: 'логіка' }],
    explanation: 'HTML→розмітка, CSS→стилі, JS→логіка.', tags:['definitions'], outcomeId:'LO1' },
  { id: 'q4', type: 'order', stem: 'Розташуйте кроки', items: ['Крок 1','Крок 2','Крок 3'],
    explanation: 'Порядок як у списку.', tags:['process'], outcomeId:'LO3' },
  { id: 'q5', type: 'cloze', stem: 'Заповніть пропуски', textWithGaps: 'E = m * {gap}^2', answers: ['c'],
    explanation: 'Швидкість світла: c.', tags:['facts'], outcomeId:'LO1' },
  { id: 'q6', type: 'short', stem: 'Дайте визначення терміну X', acceptableAnswers: ['еталон'],
    explanation: 'Має містити «еталон».', tags:['definitions'], outcomeId:'LO1', reference:'Вступ'},
  { id: 'q7', type: 'numeric', stem: '2 + 2 = ?', expected: 4, tolerance: 0,
    explanation: 'Базова арифметика.', tags:['calculation'], outcomeId:'LO2'},
  { id: 'q8', type: 'case', stem: 'Кейс: запуск продукту', context: 'Компанія А виводить продукт на ринок.',
    subQuestions: [
      { id:'q8a', type:'mcq', stem:'Перший крок?', choices:[
        {id:'a',text:'Реклама'},{id:'b',text:'Дослідження ринку',correct:true},{id:'c',text:'Знижки'}
      ], explanation:'Спочатку дані.'},
      { id:'q8b', type:'short', stem:'Сформулюйте 1 критерій успіху', acceptableAnswers:['частка','частку','market share','доход'], explanation:'Має містити показник типу «частка ринку» або «дохід».' }
    ],
    explanation:'Логіка: дослідження→критерії→реалізація.',
    tags:['process','application'], outcomeId:'LO3', reference:'Worked Example' },
];

type Rec = { id:string; correct:boolean; tags?:string[]; outcomeId?:string };

export default function AssessmentEngine({ examDurationSec = 600 }: { examDurationSec?: number }) {
  const [mode, setMode] = useState<Mode>('practice');
  const [queue, setQueue] = useState<number[]>(() => BANK.map((_,i)=>i));
  const [pos, setPos] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Rec[]>([]);
  const [finished, setFinished] = useState(false);

  // Exam timer
  const [remaining, setRemaining] = useState(examDurationSec);
  useEffect(() => {
    if (mode !== 'exam' || finished) return;
    const t = setInterval(() => {
      setRemaining(s => { if (s <= 1) { clearInterval(t); setFinished(true); return 0; } return s - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [mode, finished, examDurationSec]);

  const q = BANK[queue[pos]];
  const total = queue.length;
  const progress = Math.round((pos / Math.max(1,total)) * 100);
  const change = (qid: string, val: any) => setAnswers(a => ({ ...a, [qid]: val }));

  // ===== перевірка
  const check = (qq: Question, val: any): boolean => {
    switch(qq.type){
      case 'mcq': {
        const chosen = val as string|undefined;
        const correct = (qq as QMCQ).choices.find(c => c.correct)?.id;
        return chosen === correct;
      }
      case 'multi': {
        const chosen: string[] = (val || []) as string[];
        const correctIds = (qq as QMulti).choices.filter(c => c.correct).map(c=>c.id).sort().join('|');
        const sel = chosen.slice().sort().join('|');
        return sel === correctIds;
      }
      case 'order': {
        const order: string[] = val || [];
        return order.join('|') === (qq as QOrder).items.join('|');
      }
      case 'cloze': {
        const vals: string[] = val || [];
        const exp = (qq as QCloze).answers;
        if (vals.length !== exp.length) return false;
        return vals.every((v,i) => v.trim().toLowerCase() === exp[i].trim().toLowerCase());
      }
      case 'short': {
        const t = (val||'').toString().trim().toLowerCase();
        return (qq as QShort).acceptableAnswers.some(ans => t.includes(ans.toLowerCase()));
      }
      case 'numeric': {
        const num = Number(val);
        const tol = (qq as QNumeric).tolerance ?? 0;
        return Math.abs(num - (qq as QNumeric).expected) <= tol;
      }
      case 'match': {
        const map = val as Record<string,string>|undefined;
        if (!map) return false;
        const pairs = (qq as QMatch).pairs;
        return pairs.every(p => (map[p.left] || '').trim().toLowerCase() === p.right.trim().toLowerCase());
      }
      case 'case': {
        const sub = (qq as QCase).subQuestions;
        return sub.every(sq => check(sq, answers[sq.id]));
      }
    }
  };

  // відповіли?
  const currentAnswered =
    q.type==='case'
      ? (q as QCase).subQuestions.every(sq => answers[sq.id] !== undefined)
      : answers[q.id] !== undefined;

  const currentCorrect = currentAnswered && check(q, answers[q.id]);

  const submit = () => {
    if (q.type === 'case') {
      const sub = (q as QCase).subQuestions;
      const allOk = sub.every(sq => check(sq, answers[sq.id]));
      setRecords(prev => [...prev, { id: q.id, correct: allOk, tags: q.tags, outcomeId: q.outcomeId }]);
      for (const sq of sub) {
        setRecords(prev => [...prev, { id: sq.id, correct: check(sq, answers[sq.id]), tags: q.tags, outcomeId: q.outcomeId }]);
      }
      if (mode === 'adaptive' && !allOk) setQueue(prev => [...prev, queue[pos]]);
    } else {
      setRecords(prev => [...prev, { id: q.id, correct: currentCorrect as boolean, tags: q.tags, outcomeId: q.outcomeId }]);
      if (mode === 'adaptive' && !currentCorrect) setQueue(prev => [...prev, queue[pos]]);
    }
    if (pos < total - 1) setPos(p => p + 1); else setFinished(true);
  };

  const reset = () => { setPos(0); setQueue(BANK.map((_,i)=>i)); setRecords([]); setFinished(false); setAnswers({}); setRemaining(600); };

  // аналітика
  const stats = useMemo(() => {
    const byTag: Record<string, { correct:number; total:number }> = {};
    const byLO: Record<string, { correct:number; total:number }> = {};
    for (const r of records) {
      if (r.tags) for (const t of r.tags) { byTag[t] ??= { correct:0, total:0 }; byTag[t].total++; if (r.correct) byTag[t].correct++; }
      if (r.outcomeId) { byLO[r.outcomeId] ??= { correct:0, total:0 }; byLO[r.outcomeId].total++; if (r.correct) byLO[r.outcomeId].correct++; }
    }
    const overall = { correct: records.filter(r=>r.correct).length, total: records.length };
    return { overall, byTag, byLO };
  }, [records]);

  // рекомендації
  const recommendations = useMemo(() => {
    const recs: string[] = [];
    Object.entries(stats.byLO).forEach(([lo, s]) => {
      const p = Math.round(100*s.correct/Math.max(1,s.total));
      if (p < 70) recs.push(`LO "${lo}" < 70% — перечитай «Ключові ідеї» та переглянь Worked Example.`);
    });
    if (!recs.length && records.length>0) recs.push('Гарна робота! Для закріплення запусти Adaptive з іншими питаннями.');
    return recs;
  }, [stats, records.length]);

  // рендерер (інтерактивний order)
  const renderQuestion = (qq: Question) => {
    switch(qq.type){
      case 'mcq': {
        const qqq = qq as QMCQ;
        return (
          <div className="space-y-1">
            {qqq.choices.map(c => (
              <label key={c.id} className="flex items-center gap-2">
                <input type="radio" name={qq.id} value={c.id}
                  onChange={() => change(qq.id, c.id)}
                  checked={answers[qq.id]===c.id}/>
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'multi': {
        const qqq = qq as QMulti;
        const sel: string[] = answers[qq.id] || [];
        const toggle = (id:string) => {
          const set = new Set(sel); set.has(id)? set.delete(id): set.add(id);
          change(qq.id, Array.from(set));
        };
        return (
          <div className="space-y-1">
            {qqq.choices.map(c => (
              <label key={c.id} className="flex items-center gap-2">
                <input type="checkbox" checked={sel.includes(c.id)} onChange={()=>toggle(c.id)} />
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        );
      }
      case 'order': {
        const expected = (qq as QOrder).items;
        const cur: string[] = answers[qq.id] || shuffle(expected);
        if (!answers[qq.id]) change(qq.id, cur);
        const move = (i:number, dir:-1|1) => {
          const a = [...cur]; const j=i+dir; if (j<0||j>=a.length) return;
          [a[i],a[j]] = [a[j],a[i]]; change(qq.id, a);
        };
        return (
          <ul className="text-sm">
            {cur.map((it, i)=>(
              <li key={i} className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-gray-100">{i+1}</span>
                <span className="flex-1">{it}</span>
                <button className="px-2 py-0.5 border rounded text-xs" onClick={()=>move(i,-1)}>↑</button>
                <button className="px-2 py-0.5 border rounded text-xs" onClick={()=>move(i, 1)}>↓</button>
              </li>
            ))}
          </ul>
        );
      }
      case 'cloze': {
        const qqq = qq as QCloze;
        const gapCount = (qqq.textWithGaps.match(/\{gap\}/g) || []).length || qqq.answers.length;
        const vals: string[] = answers[qq.id] || Array(gapCount).fill('');
        const parts = qqq.textWithGaps.split('{gap}');
        return (
          <div className="flex flex-wrap items-center gap-2">
            {parts.map((part, i) => (
              <React.Fragment key={i}>
                <span>{part}</span>
                {i < gapCount && (
                  <input className="border rounded px-2 py-1 w-24"
                         value={vals[i] ?? ''}
                         onChange={e=>{ const copy = [...vals]; copy[i] = e.target.value; change(qq.id, copy); }}/>
                )}
              </React.Fragment>
            ))}
          </div>
        );
      }
      case 'short':
        return <input className="border rounded px-2 py-1 w-full" placeholder="Ваша відповідь"
                      value={answers[qq.id] || ''} onChange={e=>change(qq.id, e.target.value)} />;
      case 'numeric':
        return <div className="flex items-center gap-2">
          <input type="number" className="border rounded px-2 py-1 w-32"
                 value={answers[qq.id] || ''} onChange={e=>change(qq.id, e.target.value)} />
          {(qq as QNumeric).units && <span>{(qq as QNumeric).units}</span>}
        </div>;
      case 'match': {
        const rights = (qq as QMatch).pairs.map(p=>p.right);
        const map: Record<string,string> = answers[qq.id] || {};
        return (
          <div className="space-y-2">
            {(qq as QMatch).pairs.map((p,i)=>(
              <div key={i} className="flex items-center gap-2">
                <span className="min-w-[100px]">{p.left}</span>
                <select className="border rounded px-2 py-1" value={map[p.left] || ''}
                        onChange={e=>change(qq.id, { ...(map||{}), [p.left]: e.target.value })}>
                  <option value="" disabled>—</option>
                  {rights.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            ))}
          </div>
        );
      }
      default: return null;
    }
  };

  if (finished) {
    const correct = records.filter(r=>r.correct).length;
    const pct = records.length ? Math.round(100*correct/records.length) : 0;
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="font-semibold">Результати</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>exportQuestionsCSV(BANK, 'questions.csv')}>Export CSV (questions)</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={reset}>Почати знову</button>
          </div>
        </div>
        <div className="rounded border p-3">
          <div className="text-lg font-semibold">{pct}% правильних</div>
          <div className="text-sm opacity-70">{correct} з {records.length}</div>
        </div>
        {Object.keys(stats.byTag).length>0 && (
          <div className="rounded border p-3">
            <div className="font-medium mb-2">По тегах</div>
            <ul className="text-sm list-disc pl-5">
              {Object.entries(stats.byTag).map(([t, s])=>{
                const p = Math.round(100*s.correct/Math.max(1,s.total));
                return <li key={t}>{t}: {p}% ({s.correct}/{s.total})</li>;
              })}
            </ul>
          </div>
        )}
        {Object.keys(stats.byLO).length>0 && (
          <div className="rounded border p-3">
            <div className="font-medium mb-2">По learning outcomes</div>
            <ul className="text-sm list-disc pl-5">
              {Object.entries(stats.byLO).map(([lo, s])=>{
                const p = Math.round(100*s.correct/Math.max(1,s.total));
                return <li key={lo}>{lo}: {p}% ({s.correct}/{s.total})</li>;
              })}
            </ul>
          </div>
        )}
        <div className="rounded border p-3">
          <div className="font-medium mb-2">Рекомендації</div>
          <ul className="list-disc pl-5 text-sm">{recommendations.map((r,i)=><li key={i}>{r}</li>)}</ul>
        </div>
        {mode==='exam' && (
          <div className="rounded border p-3 text-sm">
            <div className="font-medium mb-1">Пояснення (Exam)</div>
            <ul className="list-disc pl-5">
              {BANK.map(qq => (
                <li key={qq.id}>
                  <span className="font-medium">{qq.stem}</span>
                  {qq.explanation ? <> — {qq.explanation}</> : null}
                  {qq.reference ? <> (див. {qq.reference})</> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const qIsCase = q.type==='case';
  const allSubAnswered = qIsCase ? (q as QCase).subQuestions.every(sq => answers[sq.id] !== undefined) : false;
  const feedbackPractice = (mode!=='exam') && (qIsCase ? allSubAnswered : (answers[q.id]!==undefined));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Start Learning — Assessment</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs">Mode:</label>
            <select className="border rounded px-2 py-1 text-xs" value={mode} onChange={e=>setMode(e.target.value as Mode)}>
              <option value="practice">Practice</option>
              <option value="adaptive">Adaptive</option>
              <option value="exam">Exam</option>
            </select>
          </div>
          {mode==='exam' && <div className="text-xs px-2 py-1 rounded bg-black/5">⏱ {Math.floor(remaining/60)}:{String(remaining%60).padStart(2,'0')}</div>}
          <div className="text-sm opacity-70">{pos+1} / {total}</div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-blue-600 rounded" style={{ width: `${progress}%` }} /></div>

      <div className="rounded border p-3 space-y-3">
        <div className="font-medium">{q.stem}</div>
        {q.type!=='case' ? renderQuestion(q) : (
          <div className="space-y-3">
            <div className="text-sm opacity-80">{(q as QCase).context}</div>
            {(q as QCase).subQuestions.map((sq) => (
              <div key={sq.id} className="rounded border p-2">
                <div className="text-sm font-medium mb-1">{sq.stem}</div>
                {renderQuestion(sq)}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {feedbackPractice ? (
          <div className="text-sm">
            {qIsCase ? (
              <div className="space-y-1">
                {(q as QCase).subQuestions.map(sq=>{
                  const ok = check(sq, answers[sq.id]);
                  return (
                    <div key={sq.id} className={ok?'text-green-600':'text-red-600'}>
                      {ok?'Правильно':'Неправильно'} — {('explanation' in sq && (sq as any).explanation) ? (sq as any).explanation : (q.explanation || '')}
                    </div>
                  );
                })}
                {q.reference ? <div className="opacity-70">див. {q.reference}</div> : null}
              </div>
            ) : (
              <div className={currentCorrect ? 'text-green-600' : 'text-red-600'}>
                {currentCorrect ? 'Правильно' : 'Неправильно'}{q.explanation ? ` — ${q.explanation}` : ''}{q.reference ? ` (див. ${q.reference})` : ''}
              </div>
            )}
          </div>
        ) : <div className="text-xs opacity-60">{mode==='exam'?'Exam mode: пояснення будуть наприкінці.':''}</div>}
        <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={submit} disabled={!currentAnswered}>
          {pos < total - 1 ? 'Далі' : 'Завершити'}
        </button>
      </div>
    </div>
  );
}
