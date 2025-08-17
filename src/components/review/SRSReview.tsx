import React, { useEffect, useMemo, useState } from 'react';
import { exportFlashcardsCSV } from '../../utils/export';

type Card = { id: string; front: string; back: string; box: number; nextDue: number };
const KEY = 'srs:deck';
function loadDeck(): Card[] {
  try { const raw = localStorage.getItem(KEY); if (raw) return JSON.parse(raw); } catch {}
  const now = Date.now();
  return [
    { id:'c1', front:'Термін X', back:'Визначення X', box:1, nextDue:now },
    { id:'c2', front:'Термін Y', back:'Визначення Y', box:1, nextDue:now },
    { id:'c3', front:'Формула A', back:'a^2 + b^2 = c^2', box:1, nextDue:now },
  ];
}
function saveDeck(d: Card[]) { localStorage.setItem(KEY, JSON.stringify(d)); }
const INTERVALS_DAYS = [0, 1, 3, 7, 14, 30];

export default function SRSReview() {
  const [deck, setDeck] = useState<Card[]>(loadDeck());
  const now = Date.now();
  const due = useMemo(() => deck.filter(c => c.nextDue <= now), [deck, now]);
  const [idx, setIdx] = useState(0);
  const [showBack, setShowBack] = useState(false);
  useEffect(()=> saveDeck(deck), [deck]);
  const current = due[idx];
  const rate = (grade: 'again'|'hard'|'good'|'easy') => {
    if (!current) return;
    setDeck(d => d.map(c => {
      if (c.id !== current.id) return c;
      let box = c.box;
      if (grade === 'again') box = Math.max(1, box-1);
      else if (grade === 'hard') box = Math.max(1, box);
      else if (grade === 'good') box = Math.min(5, box+1);
      else if (grade === 'easy') box = Math.min(5, box+2);
      const days = INTERVALS_DAYS[box];
      return { ...c, box, nextDue: Date.now() + days*24*3600*1000 };
    }));
    setShowBack(false);
    setIdx(i => (i+1<due.length? i+1 : 0));
  };
  const exportCSV = () => exportFlashcardsCSV(deck.map(({front,back})=>({front,back})));
  if (!due.length) {
    return (
      <div className="space-y-3">
        <div className="font-semibold">SRS Review</div>
        <div className="rounded border p-3 text-sm">Сьогодні немає карток до повторення.</div>
        <button className="px-3 py-1 rounded border text-sm" onClick={exportCSV}>Export CSV</button>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">SRS Review</div>
        <div className="text-xs opacity-70">{idx+1} / {due.length}</div>
      </div>
      <div className="rounded border p-6 text-center">
        <div className="text-sm opacity-60 mb-2">Front</div>
        <div className="text-lg">{current.front}</div>
        {showBack ? (<><div className="h-px bg-gray-200 my-4" /><div className="text-sm opacity-60 mb-2">Back</div><div className="text-lg">{current.back}</div></>) : null}
      </div>
      <div className="flex gap-2">
        {!showBack ? (
          <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={()=>setShowBack(true)}>Показати відповідь</button>
        ) : (
          <>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('again')}>Again</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('hard')}>Hard</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('good')}>Good</button>
            <button className="px-3 py-1 rounded border text-sm" onClick={()=>rate('easy')}>Easy</button>
          </>
        )}
        <button className="ml-auto px-3 py-1 rounded border text-sm" onClick={exportCSV}>Export CSV</button>
      </div>
    </div>
  );
}
