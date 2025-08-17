import React, { useState } from 'react';
type Props = { language?: string; starter?: string; tests?: string; };
export default function CodePractice({ language='python', starter='', tests='' }: Props) {
  const [code, setCode] = useState(starter || '');
  return (
    <div className="space-y-3">
      <div className="text-sm opacity-70">Code Practice ({language}). Виконання коду у браузері вимкнено. Підключіть бекенд-раннер для запуску тестів.</div>
      <textarea className="w-full h-48 border rounded p-2 font-mono text-sm" value={code} onChange={e=>setCode(e.target.value)} />
      {tests && (<details className="rounded border p-2"><summary className="cursor-pointer font-medium">Показати тести</summary><pre className="text-xs whitespace-pre-wrap">{tests}</pre></details>)}
    </div>
  );
}
