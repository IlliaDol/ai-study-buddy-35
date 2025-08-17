export function toCSV(rows: string[][]): string {
  return rows.map(r => r.map(cell => {
    const c = (cell ?? '').toString().replace(/"/g,'""');
    return /[",\n]/.test(c) ? `"${c}"` : c;
  }).join(',')).join('\n');
}
export function downloadText(filename: string, content: string, mime='text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename; document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
}
export function exportFlashcardsCSV(cards: {front:string; back:string}[], filename='flashcards.csv') {
  const rows = [['Front','Back'], ...cards.map(c => [c.front, c.back])];
  downloadText(filename, toCSV(rows), 'text/csv;charset=utf-8');
}
export function exportQuestionsCSV(questions: any[], filename='questions.csv') {
  const rows = [['id','type','stem','answer/explanation']];
  for (const q of questions) {
    let ans = '';
    switch(q.type){
      case 'mcq': case 'multi':
        ans = (q.choices||[]).filter((c:any)=>c.correct).map((c:any)=>c.text).join(' | '); break;
      case 'match': ans = (q.pairs||[]).map((p:any)=>`${p.left}→${p.right}`).join(' ; '); break;
      case 'order': ans = (q.items||[]).join(' → '); break;
      case 'cloze': ans = (q.answers||[]).join(' | '); break;
      case 'short': ans = (q.acceptableAnswers||[]).join(' | '); break;
      case 'numeric': ans = `${q.expected} ± ${q.tolerance||0} ${q.units||''}`.trim(); break;
      default: ans = '';
    }
    rows.push([q.id, q.type, q.stem, q.explanation ? `${ans} // ${q.explanation}` : ans]);
  }
  downloadText(filename, toCSV(rows), 'text/csv;charset=utf-8');
}
