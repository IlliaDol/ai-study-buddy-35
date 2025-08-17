import React, { useEffect, useMemo, useState } from 'react';

// Спрощена SR-система для ПИТАНЬ: застосовуємо Leitner-box до банку запитань.
type Choice = { id:string; text:string; correct?:boolean };
type QBase = { id:string; type:'mcq'|'multi'|'order'|'cloze'|'short'|'numeric'|'match'; stem:string;
  explanation?:string; outcomeId?:string; tags?:string[]; reference?:string; };
type QMCQ = QBase & { type:'mcq'; choices:Choice[] };
type QMulti = QBase & { type:'multi'; choices:Choice[] };
type QOrder = QBase & { type:'order'; items:string[] };
type QCloze = QBase & { type:'cloze'; textWithGaps:string; answers:string[] };
type QShort = QBase & { type:'short'; acceptableAnswers:string[] };
type QNumeric = QBase & { type:'numeric'; expected:number; tolerance?:number };
type QMatch = QBase & { type:'match'; pairs:{left:string; right:string}[] };
type Question = QMCQ|QMulti|QOrder|QCloze|QShort|QNumeric|QMatch;

type DeckItem = { id:string; box:number; nextDue:number };
type Rec = { id:string; correct:boolean };

const KEY = 'srs:questions';
const INTERVALS_DAYS = [0,1,2,4,8,16];

const BANK: Question[] = [
  { id: 'mt1', type: 'mcq', stem: 'Основне правило?', choices:[{id:'a',text:'A',correct:true},{id:'b',text:'B'}], explanation:'A — базове.' },
  { id: 'mt2', type: 'short', stem: 'Що таке X?', acceptableAnswers:['еталон'], explanation:'Відповідь повинна містити «еталон».' },
  { id: 'mt3', type: 'order', stem: 'Упорядкуйте кроки', items:['1','2','3'], explanation:'Як у прикладі.' },
];

function loadDeck(): DeckItem[] {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
  const now = Date.now();
  return BANK.map(q => ({ id:q.id, box:1, nextDue: now }));
}
function saveDeck(d: DeckItem[]) { localStorage.setItem(KEY, JSON.stringify(d)); }
function getQ(id:string): Question { return BANK.find(q => q.id===id)!; }

export default function MicroTestReview() {
  const [deck, setDeck] = useState<DeckItem[]>(loadDeck());
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [records, setRecords] = useState<Rec[]>([]);
  const now = Date.now();
  const due = useMemo(()=> deck.filter(d => d.nextDue <= now).slice(0,5), [deck, now]);
  const [idx, setIdx] = useState(0);
  useEffect(()=> saveDeck(deck), [deck]);

  const current = due[idx];
  const q = current ? getQ(current.id) : undefined;

  const check = (qq: Question, val: any): boolean => {
    switch(qq.type){
      case 'mcq': {
        const correct = (qq as QMCQ).choices.find(c=>c.correct)?.id;
        return val === correct;
      }
      case 'multi': {
        const chosen: string[] = (val||[]) as string[];
        const correctIds = (qq as QMulti).choices.filter(c=>c.correct).map(c=>c.id).sort().join('|');
        return chosen.slice().sort().join('|') === correctIds;
      }
      case 'order': return (val||[]).join('|') === (qq as QOrder).items.join('|');
      case 'cloze': {
        const vals: string[] = val||[];
        const exp = (qq as QCloze).answers;
        if (vals.length !== exp.length) return false;
        return vals.every((v,i)=>v.trim().toLowerCase()===exp[i].trim().toLowerCase());
      }
      case 'short': {
        const t = (val||'').toString().trim().toLowerCase();
        return (qq as QShort).acceptableAnswers.some(a=>t.includes(a.toLowerCase()));
      }
      case 'numeric': return Math.abs(Number(val)-(qq as QNumeric).expected) <= ((qq as QNumeric).tolerance??0);
      case 'match': {
        const map = val as Record<string,string>;
        return (qq as QMatch).pairs.every(p => (map?.[p.left]||'').toLowerCase()===p.right.toLowerCase());
      }
    }
  };

  const rate = (grade:'again'|'hard'|'good'|'easy') => {
    if (!q || !current) return;
    const ok = check(q, answers[q.id]);
    setRecords(r => [...r, { id:q.id, correct: ok }]);
    setDeck(d => d.map(it => {
      if (it.id !== q.id) return it;
      let box = it.box;
      if (grade==='again') box = Math.max(1, box-1);
      else if (grade==='hard') box = Math.max(1, box);
      else if (grade==='good') box = Math.min(5, box+1);
      else if (grade==='easy') box = Math.min(5, box+2);
      const days = INTERVALS_DAYS[box];
      return { ...it, box, nextDue: Date.now() + days*24*3600*1000 };
    }));
    setAnswers(a => { const { [q.id]:_, ...rest } = a; return rest; });
    setIdx(i => (i+1 < due.length ? i+1 : 0));
  };

  if (!q) {
    return (
      <div className="space-y-3">
        <div className="font-semibold">Review (Micro-tests)</div>
        <div className="rounded border p-3 text-sm">Сьогодні немає мікро-питань до повторення.</div>
      </div>
    );
  }

  const render = (qq: Question) => {
    switch(qq.type){
      case 'mcq':
        return (
          <div className="space-y-1">
            {(qq as QMCQ).choices.map(c=>(
              <label key={c.id} className="flex items-center gap-2">
                <input type="radio" name={qq.id} value={c.id}
                  checked={answers[qq.id]===c.id}
                  onChange={()=>setAnswers(a=>({ ...a, [qq.id]: c.id }))}/>
                <span>{c.text}</span>
              </label>
            ))}
          </div>
        );
      case 'short':
        return <input className="border rounded px-2 py-1 w-full"
                      value={answers[qq.id]||''}
                      onChange={e=>setAnswers(a=>({ ...a, [qq.id]: e.target.value }))} />;
      case 'order': {
        const expected = (qq as QOrder).items;
        const cur: string[] = answers[qq.id] || expected.slice().reverse();
        if (!answers[qq.id]) setAnswers(a=>({ ...a, [qq.id]: cur }));
        const move = (i:number, dir:-1|1) => {
          const arr = [...cur]; const j=i+dir; if (j<0||j>=arr.length) return;
          [arr[i],arr[j]]=[arr[j],arr[i]]; setAnswers(a=>({ ...a, [qq.id]: arr }));
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
      default:
        return <div className="text-xs opacity-70">Тип {qq.type} у мікро-тестах не продемонстровано (демо).</div>;
    }
  };

  const ok = check(q, answers[q.id]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Review (Micro-tests)</div>
        <div className="text-xs opacity-70">{idx+1} / {due.length}</div>
      </div>
      <div className="rounded border p-3">
        <div className="font-medium mb-2">{q.stem}</div>
        {render(q)}
      </div>
      {answers[q.id] !== undefined && (
        <div className={ok ? 'text-green-600 text-sm' : 'text-red-600 text-sm'}>
          {ok ? 'Правильно' : (q.explanation ? `Неправильно — ${q.explanation}` : 'Неправильно')}
        </div>
      )}
      <div className="flex gap-2">
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('again')}>Again</button>
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('hard')}>Hard</button>
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('good')}>Good</button>
        <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('easy')}>Easy</button>
      </div>
    </div>
  );
}
